"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import {
  holdToConfirmButtonSizeIds,
  holdToConfirmButtonVariantIds,
  type HoldToConfirmButtonSize,
  type HoldToConfirmButtonVariant,
} from "./hold-to-confirm-button-variants";

const holdToConfirmButtonVariants = cva(
  "group/hold-btn relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=confirmed]:cursor-default select-none",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=confirmed]:bg-primary data-[state=confirmed]:text-primary-foreground",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/15 data-[state=confirmed]:bg-destructive data-[state=confirmed]:text-destructive-foreground data-[state=confirmed]:border-destructive",
        primary:
          "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15 data-[state=confirmed]:bg-primary data-[state=confirmed]:text-primary-foreground data-[state=confirmed]:border-primary",
        warning:
          "bg-warning/15 text-warning-foreground border border-warning/40 hover:bg-warning/25 data-[state=confirmed]:bg-warning data-[state=confirmed]:text-warning-foreground data-[state=confirmed]:border-warning",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground data-[state=confirmed]:bg-primary data-[state=confirmed]:text-primary-foreground data-[state=confirmed]:border-primary",
      } satisfies Record<HoldToConfirmButtonVariant, string>,
      size: {
        sm: "h-9 rounded-md px-3 text-xs [&_svg]:size-3.5",
        default: "h-10 px-4 py-2 text-sm [&_svg]:size-4",
        lg: "h-11 rounded-md px-8 text-sm [&_svg]:size-5",
      } satisfies Record<HoldToConfirmButtonSize, string>,
    },
    defaultVariants: {
      variant: "destructive",
      size: "default",
    },
  },
);

const holdProgressVariants = cva(
  "pointer-events-none absolute inset-y-0 left-0 origin-left transition-[width] ease-linear",
  {
    variants: {
      variant: {
        default: "bg-primary/30",
        destructive: "bg-destructive/40",
        primary: "bg-primary/30",
        warning: "bg-warning/45",
        outline: "bg-primary/25",
      } satisfies Record<HoldToConfirmButtonVariant, string>,
    },
    defaultVariants: {
      variant: "destructive",
    },
  },
);

export interface HoldToConfirmButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">,
    VariantProps<typeof holdToConfirmButtonVariants> {
  /**
   * Duration (in milliseconds) the user must press-and-hold the button
   * before {@link HoldToConfirmButtonProps.onConfirm} fires. Defaults to 1500ms.
   */
  durationMs?: number;
  /**
   * Fires once the user has held the button continuously for `durationMs`.
   * The button enters the `confirmed` state after this fires; reset it by
   * unmounting / remounting, or by toggling {@link HoldToConfirmButtonProps.resetOnConfirm}.
   */
  onConfirm: () => void;
  /**
   * When `true`, the button automatically returns to its idle state after
   * `confirmedResetDelayMs` milliseconds. Defaults to `false` so callers can
   * keep the confirmed treatment until they explicitly unmount or rerender.
   */
  resetOnConfirm?: boolean;
  /**
   * How long the confirmed state is shown before the button returns to idle
   * when `resetOnConfirm` is true. Defaults to 1200ms.
   */
  confirmedResetDelayMs?: number;
  /**
   * Optional label shown while the user is holding the button. Defaults to
   * `children` (i.e. no change).
   */
  holdingLabel?: ReactNode;
  /**
   * Optional label shown after the action has been confirmed. Defaults to
   * `children`.
   */
  confirmedLabel?: ReactNode;
  /**
   * Fired whenever the user starts holding the button.
   */
  onHoldStart?: () => void;
  /**
   * Fired whenever the user releases the button before confirmation completes.
   */
  onHoldCancel?: () => void;
  ref?: Ref<HTMLButtonElement>;
}

type HoldState = "idle" | "holding" | "confirmed";

const TICK_INTERVAL_MS = 16;

function HoldToConfirmButton({
  className,
  variant,
  size,
  durationMs = 1500,
  onConfirm,
  resetOnConfirm = false,
  confirmedResetDelayMs = 1200,
  holdingLabel,
  confirmedLabel,
  onHoldStart,
  onHoldCancel,
  disabled,
  type = "button",
  children,
  onKeyDown,
  onKeyUp,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  ref,
  ...props
}: HoldToConfirmButtonProps): ReactElement {
  const [state, setState] = useState<HoldState>("idle");
  const [progress, setProgress] = useState<number>(0);

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyHeldRef = useRef<boolean>(false);

  const clearTimers = useCallback((): void => {
    if (rafRef.current !== null) {
      clearInterval(rafRef.current);
      rafRef.current = null;
    }
    if (completionTimeoutRef.current !== null) {
      clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
  }, []);

  useEffect((): (() => void) => {
    return (): void => {
      clearTimers();
      if (resetTimeoutRef.current !== null) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    };
  }, [clearTimers]);

  const stopHold = useCallback(
    (reason: "cancel" | "complete"): void => {
      clearTimers();
      startTimeRef.current = null;

      if (reason === "complete") {
        setProgress(1);
        setState("confirmed");
        onConfirm();
        if (resetOnConfirm) {
          if (resetTimeoutRef.current !== null) {
            clearTimeout(resetTimeoutRef.current);
          }
          resetTimeoutRef.current = setTimeout((): void => {
            setState("idle");
            setProgress(0);
            resetTimeoutRef.current = null;
          }, confirmedResetDelayMs);
        }
      } else {
        setProgress(0);
        setState("idle");
        onHoldCancel?.();
      }
    },
    [
      clearTimers,
      confirmedResetDelayMs,
      onConfirm,
      onHoldCancel,
      resetOnConfirm,
    ],
  );

  const startHold = useCallback((): void => {
    if (disabled || state === "confirmed") return;
    if (state === "holding") return;

    clearTimers();
    onHoldStart?.();
    setState("holding");
    setProgress(0);
    const startTime: number = performance.now();
    startTimeRef.current = startTime;

    rafRef.current = setInterval((): void => {
      if (startTimeRef.current === null) return;
      const elapsed: number = performance.now() - startTimeRef.current;
      const nextProgress: number = Math.min(elapsed / durationMs, 1);
      setProgress(nextProgress);
    }, TICK_INTERVAL_MS) as unknown as number;

    completionTimeoutRef.current = setTimeout((): void => {
      stopHold("complete");
    }, durationMs);
  }, [clearTimers, disabled, durationMs, onHoldStart, state, stopHold]);

  const cancelHold = useCallback((): void => {
    if (state !== "holding") return;
    stopHold("cancel");
  }, [state, stopHold]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>): void => {
      onPointerDown?.(event);
      if (event.defaultPrevented) return;
      if (event.button !== undefined && event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      startHold();
    },
    [onPointerDown, startHold],
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>): void => {
      onPointerUp?.(event);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      cancelHold();
    },
    [cancelHold, onPointerUp],
  );

  const handlePointerLeave = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>): void => {
      onPointerLeave?.(event);
      // Pointer capture keeps events flowing to the button while pressed,
      // so a true "leave" without an active capture means the hold should end.
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        cancelHold();
      }
    },
    [cancelHold, onPointerLeave],
  );

  const handlePointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>): void => {
      onPointerCancel?.(event);
      cancelHold();
    },
    [cancelHold, onPointerCancel],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>): void => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key !== " " && event.key !== "Enter") return;
      if (keyHeldRef.current) {
        // Suppress browser auto-click while the key is held down.
        event.preventDefault();
        return;
      }
      keyHeldRef.current = true;
      event.preventDefault();
      startHold();
    },
    [onKeyDown, startHold],
  );

  const handleKeyUp = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>): void => {
      onKeyUp?.(event);
      if (event.key !== " " && event.key !== "Enter") return;
      keyHeldRef.current = false;
      cancelHold();
    },
    [cancelHold, onKeyUp],
  );

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>): void => {
      // Always block synthetic clicks - confirmation requires a hold.
      event.preventDefault();
    },
    [],
  );

  const percent: number = Math.round(progress * 100);
  const label: ReactNode =
    state === "confirmed" && confirmedLabel !== undefined
      ? confirmedLabel
      : state === "holding" && holdingLabel !== undefined
        ? holdingLabel
        : children;

  return (
    <button
      ref={ref}
      type={type}
      data-slot="hold-to-confirm-button"
      data-state={state}
      data-progress={percent}
      aria-live="polite"
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onClick={handleClick}
      className={cn(
        holdToConfirmButtonVariants({ variant, size }),
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="hold-to-confirm-button-progress"
        className={cn(holdProgressVariants({ variant }))}
        style={{
          width: `${percent}%`,
          transitionDuration: state === "holding" ? `${TICK_INTERVAL_MS}ms` : "200ms",
        }}
      />
      <span
        data-slot="hold-to-confirm-button-label"
        className="relative z-[1] inline-flex items-center gap-2"
      >
        {label}
      </span>
    </button>
  );
}
HoldToConfirmButton.displayName = "HoldToConfirmButton";

export {
  HoldToConfirmButton,
  holdToConfirmButtonVariants,
  holdToConfirmButtonSizeIds,
  holdToConfirmButtonVariantIds,
};
export type { HoldToConfirmButtonSize, HoldToConfirmButtonVariant };

export default HoldToConfirmButton;
