"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";

export const holdToConfirmButtonVariantIds = [
  "default",
  "destructive",
  "warning",
  "secondary",
  "outline",
] as const satisfies readonly string[];
export type HoldToConfirmButtonVariantId =
  (typeof holdToConfirmButtonVariantIds)[number];

export const holdToConfirmButtonSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type HoldToConfirmButtonSizeId =
  (typeof holdToConfirmButtonSizeIds)[number];

export const holdToConfirmButtonVariants = cva(
  "group/hold-confirm relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md font-medium ring-offset-background transition-[background-color,border-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none touch-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 data-[holding=true]:bg-primary/85",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 data-[holding=true]:bg-destructive/85",
        warning:
          "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] hover:bg-[hsl(var(--warning))]/90 data-[holding=true]:bg-[hsl(var(--warning))]/85",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[holding=true]:bg-secondary/70",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground data-[holding=true]:bg-accent/60",
      } satisfies Record<HoldToConfirmButtonVariantId, string>,
      size: {
        sm: "h-9 px-3 text-xs [&_svg]:size-3.5",
        default: "h-10 px-4 text-sm [&_svg]:size-4",
        lg: "h-11 px-6 text-base [&_svg]:size-5",
      } satisfies Record<HoldToConfirmButtonSizeId, string>,
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "destructive",
      size: "default",
      fullWidth: false,
    },
  },
);

const fillVariants = cva(
  "absolute inset-y-0 left-0 will-change-[width] pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary-foreground/25",
        destructive: "bg-destructive-foreground/30",
        warning: "bg-[hsl(var(--warning-foreground))]/25",
        secondary: "bg-secondary-foreground/15",
        outline: "bg-accent/80",
      } satisfies Record<HoldToConfirmButtonVariantId, string>,
    },
    defaultVariants: {
      variant: "destructive",
    },
  },
);

export interface HoldToConfirmButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children">,
    VariantProps<typeof holdToConfirmButtonVariants> {
  /** Required label rendered inside the button. */
  children: ReactNode;
  /** Optional leading slot, typically an icon. */
  icon?: ReactNode;
  /**
   * Duration of the hold (in milliseconds) required to fire `onConfirm`.
   * Defaults to `1500`.
   */
  holdDurationMs?: number;
  /**
   * Fired when the user successfully holds the button for the full duration.
   */
  onConfirm?: () => void;
  /**
   * Fired when the user releases the button before reaching the full duration.
   * Receives the fraction of progress completed (0–1) at release.
   */
  onCancel?: (progress: number) => void;
  /**
   * Fired when the hold begins.
   */
  onHoldStart?: () => void;
  /**
   * Fired on every animation frame while held. Useful for synchronising
   * external UI to progress.
   */
  onHoldProgress?: (progress: number) => void;
  /**
   * Optional alternate label rendered in place of `children` while the
   * button is being actively held. Helpful for hinting at confirmation
   * (e.g. "Keep holding…").
   */
  holdingLabel?: ReactNode;
  /**
   * Optional label rendered after a successful confirmation. Cleared the
   * next time the user begins holding the button.
   */
  confirmedLabel?: ReactNode;
  /**
   * When true, the button does not reset its visual confirmed state
   * automatically. Useful for one-shot destructive actions. Defaults
   * to `false`.
   */
  latchConfirmed?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

const PROGRESS_EPSILON = 0.999;

function HoldToConfirmButton({
  children,
  className,
  variant,
  size,
  fullWidth,
  icon,
  holdDurationMs = 1500,
  onConfirm,
  onCancel,
  onHoldStart,
  onHoldProgress,
  holdingLabel,
  confirmedLabel,
  latchConfirmed = false,
  disabled,
  type = "button",
  ref,
  ...props
}: HoldToConfirmButtonProps): ReactElement {
  const [progress, setProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const confirmedRef = useRef<boolean>(false);
  const progressRef = useRef<number>(0);

  const clamp = useCallback(
    (value: number): number => Math.max(0, Math.min(1, value)),
    [],
  );

  const cancelRaf = useCallback((): void => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback(
    (timestamp: number): void => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const next = clamp(elapsed / holdDurationMs);
      progressRef.current = next;
      setProgress(next);
      onHoldProgress?.(next);

      if (next >= PROGRESS_EPSILON) {
        confirmedRef.current = true;
        setProgress(1);
        setIsHolding(false);
        setConfirmed(true);
        cancelRaf();
        startTimeRef.current = null;
        onConfirm?.();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [cancelRaf, clamp, holdDurationMs, onConfirm, onHoldProgress],
  );

  const startHold = useCallback((): void => {
    if (disabled) return;
    if (isHolding) return;
    confirmedRef.current = false;
    setConfirmed(false);
    setIsHolding(true);
    startTimeRef.current = null;
    progressRef.current = 0;
    setProgress(0);
    onHoldStart?.();
    rafRef.current = requestAnimationFrame(tick);
  }, [disabled, isHolding, onHoldStart, tick]);

  const releaseHold = useCallback((): void => {
    if (!isHolding && progressRef.current === 0) return;
    const wasConfirmed = confirmedRef.current;
    cancelRaf();
    startTimeRef.current = null;
    setIsHolding(false);

    if (wasConfirmed) {
      if (!latchConfirmed) {
        // Reset visuals on next frame so the fill stays full briefly
        // before fading back out — feels more responsive than instant.
        rafRef.current = requestAnimationFrame(() => {
          setProgress(0);
          setConfirmed(false);
          progressRef.current = 0;
        });
      }
      return;
    }

    const releasedAt = progressRef.current;
    onCancel?.(releasedAt);
    setProgress(0);
    progressRef.current = 0;
  }, [cancelRaf, isHolding, latchConfirmed, onCancel]);

  useEffect(() => {
    return (): void => {
      cancelRaf();
    };
  }, [cancelRaf]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>): void => {
      if (event.button !== undefined && event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      startHold();
    },
    [startHold],
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>): void => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      releaseHold();
    },
    [releaseHold],
  );

  const handlePointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>): void => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      releaseHold();
    },
    [releaseHold],
  );

  const handlePointerLeave = useCallback((): void => {
    if (isHolding) {
      releaseHold();
    }
  }, [isHolding, releaseHold]);

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>): void => {
      if (event.repeat) return;
      if (event.key !== " " && event.key !== "Enter") return;
      event.preventDefault();
      startHold();
    },
    [startHold],
  );

  const handleKeyUp = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>): void => {
      if (event.key !== " " && event.key !== "Enter") return;
      event.preventDefault();
      releaseHold();
    },
    [releaseHold],
  );

  const handleBlur = useCallback((): void => {
    if (isHolding) {
      releaseHold();
    }
  }, [isHolding, releaseHold]);

  const fillPercent = Math.round(progress * 100);
  const showHoldingLabel = isHolding && holdingLabel != null;
  const showConfirmedLabel = confirmed && confirmedLabel != null;

  return (
    <button
      ref={ref}
      type={type}
      data-slot="hold-to-confirm-button"
      data-holding={isHolding || undefined}
      data-confirmed={confirmed || undefined}
      aria-live="polite"
      disabled={disabled}
      className={cn(
        holdToConfirmButtonVariants({ variant, size, fullWidth, className }),
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      {...props}
    >
      <span
        data-slot="hold-to-confirm-button-fill"
        role="progressbar"
        aria-label="Hold progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={fillPercent}
        className={cn(fillVariants({ variant }))}
        style={{
          width: `${fillPercent}%`,
          transition: isHolding
            ? "none"
            : "width 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      <span
        data-slot="hold-to-confirm-button-content"
        className="relative z-10 inline-flex items-center justify-center gap-2"
      >
        {icon != null ? (
          <span
            aria-hidden="true"
            data-slot="hold-to-confirm-button-icon"
            className="inline-flex shrink-0 items-center justify-center"
          >
            {icon}
          </span>
        ) : null}
        <span data-slot="hold-to-confirm-button-label" className="truncate">
          {showConfirmedLabel
            ? confirmedLabel
            : showHoldingLabel
              ? holdingLabel
              : children}
        </span>
      </span>
    </button>
  );
}
HoldToConfirmButton.displayName = "HoldToConfirmButton";

export { HoldToConfirmButton };
export default HoldToConfirmButton;
