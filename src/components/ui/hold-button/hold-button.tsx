"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";

export const holdButtonVariantIds = [
  "default",
  "destructive",
  "warning",
  "success",
  "info",
  "outline",
] as const satisfies readonly string[];

export type HoldButtonVariantId = (typeof holdButtonVariantIds)[number];

export const holdButtonSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];

export type HoldButtonSizeId = (typeof holdButtonSizeIds)[number];

const holdButtonVariants = cva(
  [
    "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden",
    "whitespace-nowrap rounded-md font-medium select-none",
    "ring-offset-background transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "touch-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 data-[holding=true]:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 data-[holding=true]:bg-destructive/80",
        warning:
          "bg-warning text-warning-foreground hover:bg-warning/90 data-[holding=true]:bg-warning/80",
        success:
          "bg-emerald-600 text-white hover:bg-emerald-600/90 data-[holding=true]:bg-emerald-600/80 dark:bg-emerald-500 dark:hover:bg-emerald-500/90 dark:data-[holding=true]:bg-emerald-500/80",
        info: "bg-schemavaults-brand-blue text-primary-foreground hover:bg-schemavaults-brand-blue/90 data-[holding=true]:bg-schemavaults-brand-blue/80",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground data-[holding=true]:bg-accent/60",
      } satisfies Record<HoldButtonVariantId, string>,
      size: {
        sm: "h-9 px-3 text-xs [&_svg]:size-3.5",
        md: "h-10 px-4 text-sm [&_svg]:size-4",
        lg: "h-11 px-6 text-base [&_svg]:size-5",
      } satisfies Record<HoldButtonSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const holdButtonFillVariants = cva(
  "pointer-events-none absolute inset-y-0 left-0 z-0 transition-[width] ease-linear motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "bg-primary-foreground/20",
        destructive: "bg-destructive-foreground/20",
        warning: "bg-warning-foreground/20",
        success: "bg-white/25",
        info: "bg-primary-foreground/20",
        outline: "bg-foreground/10",
      } satisfies Record<HoldButtonVariantId, string>,
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface HoldButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onAbort">,
    VariantProps<typeof holdButtonVariants> {
  /**
   * Duration in milliseconds the user must press-and-hold to fire `onConfirm`.
   * Defaults to 1500ms. Setting this too low defeats the purpose of the
   * confirmation gesture; recommended minimum is ~750ms.
   */
  duration?: number;
  /**
   * Fired once the user has held the button down continuously for `duration`.
   * The fill animation completes before this fires.
   */
  onConfirm?: () => void;
  /**
   * Fired when the user begins a hold gesture (pointer down or keyboard).
   */
  onHoldStart?: () => void;
  /**
   * Fired when the user releases before the hold completes, cancelling.
   */
  onHoldCancel?: () => void;
  /**
   * Optional leading icon rendered before the label.
   */
  icon?: ReactNode;
  /**
   * Optional label shown while the button is being held. Defaults to the
   * idle label (children).
   */
  holdingLabel?: ReactNode;
  /**
   * When true, the button visually shows a fully-filled state without firing
   * `onConfirm`. Useful for representing a successful async follow-up.
   */
  completed?: boolean;
  /**
   * Ref forwarded to the underlying button element.
   */
  ref?: Ref<HTMLButtonElement>;
}

type HoldState = "idle" | "holding" | "completed";

function HoldButton({
  className,
  variant,
  size,
  duration = 1500,
  onConfirm,
  onHoldStart,
  onHoldCancel,
  icon,
  holdingLabel,
  completed = false,
  disabled,
  children,
  type = "button",
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  onKeyDown,
  onKeyUp,
  ref,
  ...props
}: HoldButtonProps): ReactElement {
  const [state, setState] = useState<HoldState>(completed ? "completed" : "idle");
  const [progress, setProgress] = useState<number>(completed ? 1 : 0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect((): void => {
    if (completed) {
      setState("completed");
      setProgress(1);
    }
  }, [completed]);

  const cleanup = useCallback((): void => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
  }, []);

  useEffect((): (() => void) => cleanup, [cleanup]);

  const tick = useCallback((): void => {
    if (startTimeRef.current === null) return;
    const elapsed: number = performance.now() - startTimeRef.current;
    const ratio: number = Math.min(elapsed / duration, 1);
    setProgress(ratio);
    if (ratio >= 1) {
      cleanup();
      setState("completed");
      onConfirm?.();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [cleanup, duration, onConfirm]);

  const beginHold = useCallback((): void => {
    if (disabled || state === "completed") return;
    if (startTimeRef.current !== null) return;
    setState("holding");
    setProgress(0);
    startTimeRef.current = performance.now();
    onHoldStart?.();
    rafRef.current = requestAnimationFrame(tick);
  }, [disabled, onHoldStart, state, tick]);

  const cancelHold = useCallback((): void => {
    if (startTimeRef.current === null) return;
    cleanup();
    setState((prev): HoldState => (prev === "completed" ? "completed" : "idle"));
    setProgress(0);
    onHoldCancel?.();
  }, [cleanup, onHoldCancel]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>): void => {
      onPointerDown?.(event);
      if (event.defaultPrevented) return;
      if (event.button !== undefined && event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      beginHold();
    },
    [beginHold, onPointerDown],
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
      // Only cancel on leave when the pointer isn't being captured (mouse out
      // without releasing). For captured pointer (touch/drag), the up/cancel
      // events handle the gesture termination.
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
      if (event.repeat) return;
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        beginHold();
      }
    },
    [beginHold, onKeyDown],
  );

  const handleKeyUp = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>): void => {
      onKeyUp?.(event);
      if (event.defaultPrevented) return;
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        cancelHold();
      }
    },
    [cancelHold, onKeyUp],
  );

  const handleBlur = useCallback((): void => {
    cancelHold();
  }, [cancelHold]);

  const isHolding: boolean = state === "holding";
  const isCompleted: boolean = state === "completed";
  const widthPercent: number = Math.round(progress * 100);

  return (
    <button
      ref={ref}
      type={type}
      data-slot="hold-button"
      data-state={state}
      data-holding={isHolding ? "true" : "false"}
      data-completed={isCompleted ? "true" : "false"}
      disabled={disabled}
      aria-disabled={disabled}
      aria-pressed={isHolding}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      className={cn(holdButtonVariants({ variant, size }), className)}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="hold-button-fill"
        style={{ width: `${widthPercent}%` }}
        className={cn(holdButtonFillVariants({ variant }))}
      />
      <span
        data-slot="hold-button-content"
        className="relative z-10 inline-flex items-center gap-2"
      >
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        <span>{isHolding && holdingLabel !== undefined ? holdingLabel : children}</span>
      </span>
    </button>
  );
}
HoldButton.displayName = "HoldButton";

export { HoldButton, holdButtonVariants, holdButtonFillVariants };
