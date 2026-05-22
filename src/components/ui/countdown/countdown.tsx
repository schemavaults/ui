"use client";

import {
  Fragment,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const countdownVariantIds = [
  "boxed",
  "plain",
  "compact",
] as const satisfies string[];

export type CountdownVariantId = (typeof countdownVariantIds)[number];

export const countdownSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies string[];

export type CountdownSizeId = (typeof countdownSizeIds)[number];

export const countdownColorIds = [
  "default",
  "brand",
  "destructive",
  "warning",
] as const satisfies string[];

export type CountdownColorId = (typeof countdownColorIds)[number];

export interface CountdownTimeParts {
  /** Milliseconds remaining (clamped to 0). */
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const countdownVariants = cva("inline-flex tabular-nums", {
  variants: {
    variant: {
      boxed: "items-center gap-2",
      plain: "items-start gap-1.5",
      compact: "items-center",
    } satisfies Record<CountdownVariantId, string>,
  },
  defaultVariants: {
    variant: "boxed",
  },
});

export const countdownSegmentVariants = cva(
  "flex flex-col items-center justify-center",
  {
    variants: {
      variant: {
        boxed: "rounded-lg border border-border bg-card shadow-sm",
        plain: "",
        compact: "",
      } satisfies Record<CountdownVariantId, string>,
      size: {
        sm: "",
        default: "",
        lg: "",
      } satisfies Record<CountdownSizeId, string>,
    },
    compoundVariants: [
      {
        variant: "boxed",
        size: "sm",
        class: "min-w-[3.5rem] gap-0.5 px-2 py-1.5",
      },
      {
        variant: "boxed",
        size: "default",
        class: "min-w-[4.5rem] gap-1 px-2.5 py-2.5",
      },
      {
        variant: "boxed",
        size: "lg",
        class: "min-w-[6rem] gap-1.5 px-3 py-3.5",
      },
      { variant: "plain", size: "sm", class: "gap-0.5" },
      { variant: "plain", size: "default", class: "gap-1" },
      { variant: "plain", size: "lg", class: "gap-1.5" },
    ],
    defaultVariants: {
      variant: "boxed",
      size: "default",
    },
  },
);

export const countdownDigitVariants = cva(
  "font-semibold leading-none tabular-nums tracking-tight",
  {
    variants: {
      size: {
        sm: "text-lg",
        default: "text-3xl",
        lg: "text-5xl",
      } satisfies Record<CountdownSizeId, string>,
      color: {
        default: "text-foreground",
        brand: "text-schemavaults-brand-blue",
        destructive: "text-destructive",
        warning: "text-warning",
      } satisfies Record<CountdownColorId, string>,
      variant: {
        boxed: "",
        plain: "",
        compact: "",
      } satisfies Record<CountdownVariantId, string>,
    },
    compoundVariants: [
      { variant: "compact", size: "sm", class: "text-sm" },
      { variant: "compact", size: "default", class: "text-lg" },
      { variant: "compact", size: "lg", class: "text-2xl" },
    ],
    defaultVariants: {
      size: "default",
      color: "default",
      variant: "boxed",
    },
  },
);

export const countdownLabelVariants = cva(
  "whitespace-nowrap font-medium uppercase leading-none tracking-wide text-muted-foreground",
  {
    variants: {
      size: {
        sm: "text-[10px]",
        default: "text-[11px]",
        lg: "text-xs",
      } satisfies Record<CountdownSizeId, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const SEPARATOR_SIZE_CLASS: Record<CountdownSizeId, string> = {
  sm: "text-lg",
  default: "text-3xl",
  lg: "text-5xl",
};

const UNIT_LABELS = {
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
} as const satisfies Record<string, string>;

type CountdownUnitId = keyof typeof UNIT_LABELS;

function normalizeTimestamp(to: Date | string | number): number {
  if (to instanceof Date) return to.getTime();
  if (typeof to === "number") return to;
  return new Date(to).getTime();
}

function getTimeRemaining(
  target: number,
  showDays: boolean,
): CountdownTimeParts {
  if (!Number.isFinite(target)) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const total: number = Math.max(0, target - Date.now());
  const totalSeconds: number = Math.floor(total / 1000);
  const seconds: number = totalSeconds % 60;
  const minutes: number = Math.floor(totalSeconds / 60) % 60;
  // When days are hidden, hours absorb the day overflow (e.g. "52:30:00").
  const hours: number = showDays
    ? Math.floor(totalSeconds / 3600) % 24
    : Math.floor(totalSeconds / 3600);
  const days: number = Math.floor(totalSeconds / 86400);
  return { total, days, hours, minutes, seconds };
}

function pad(value: number): string {
  return String(Math.max(0, Math.trunc(value))).padStart(2, "0");
}

function pluralize(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

function describeRemaining(
  parts: CountdownTimeParts,
  showDays: boolean,
  showSeconds: boolean,
): string {
  if (parts.total <= 0) return "Countdown complete";
  const segments: string[] = [];
  if (showDays) segments.push(pluralize(parts.days, "day"));
  segments.push(pluralize(parts.hours, "hour"));
  segments.push(pluralize(parts.minutes, "minute"));
  if (showSeconds) segments.push(pluralize(parts.seconds, "second"));
  return `${segments.join(", ")} remaining`;
}

export interface CountdownProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  /** The target date/time to count down to. Accepts a Date, ISO string, or epoch-ms number. */
  to: Date | string | number;
  /** Visual layout. Defaults to `boxed`. */
  variant?: CountdownVariantId;
  /** Size scale. Defaults to `default`. */
  size?: CountdownSizeId;
  /** Colour intent applied to the digits. Defaults to `default`. */
  color?: CountdownColorId;
  /** Show the unit labels (Days/Hours/…). Ignored by the `compact` variant. Defaults to `true`. */
  showLabels?: boolean;
  /** Include a separate days segment. When false, hours absorb the days. Defaults to `true`. */
  showDays?: boolean;
  /** Include the seconds segment. Defaults to `true`. */
  showSeconds?: boolean;
  /** Accessible label prefix, e.g. "Trial ends in". */
  label?: string;
  /** Content rendered in place of the timer once the target is reached. */
  completedContent?: ReactNode;
  /** Called once when the countdown reaches zero. */
  onComplete?: () => void;
  /** Additional classes for each segment wrapper. */
  segmentClassName?: string;
  /** Additional classes for the digit text. */
  digitClassName?: string;
  /** Additional classes for the unit label text. */
  labelClassName?: string;
}

export function Countdown({
  to,
  variant = "boxed",
  size = "default",
  color = "default",
  showLabels = true,
  showDays = true,
  showSeconds = true,
  label,
  completedContent,
  onComplete,
  className,
  segmentClassName,
  digitClassName,
  labelClassName,
  ...props
}: CountdownProps): ReactElement {
  const targetTime: number = normalizeTimestamp(to);

  const [timeLeft, setTimeLeft] = useState<CountdownTimeParts>(() =>
    getTimeRemaining(targetTime, showDays),
  );

  // An Effect Event always sees the latest onComplete without making the
  // interval Effect reactive to it.
  const handleComplete = useEffectEvent((): void => {
    onComplete?.();
  });

  const completedFiredRef = useRef<boolean>(false);

  useEffect(() => {
    completedFiredRef.current = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    function fireCompleteOnce(): void {
      if (!completedFiredRef.current) {
        completedFiredRef.current = true;
        handleComplete();
      }
    }

    function tick(): void {
      const next: CountdownTimeParts = getTimeRemaining(targetTime, showDays);
      setTimeLeft(next);
      if (next.total <= 0) {
        if (intervalId !== undefined) clearInterval(intervalId);
        fireCompleteOnce();
      }
    }

    const initial: CountdownTimeParts = getTimeRemaining(targetTime, showDays);
    setTimeLeft(initial);
    if (initial.total <= 0) {
      fireCompleteOnce();
    } else {
      intervalId = setInterval(tick, 1000);
    }

    return () => {
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [targetTime, showDays]);

  const finished: boolean = timeLeft.total <= 0;
  const accessibleLabel: string = `${label ? `${label}: ` : ""}${describeRemaining(
    timeLeft,
    showDays,
    showSeconds,
  )}`;

  if (finished && completedContent !== undefined) {
    return (
      <div
        role="timer"
        aria-label={label ? `${label}: Countdown complete` : "Countdown complete"}
        data-slot="countdown"
        data-finished="true"
        className={cn(countdownVariants({ variant }), className)}
        {...props}
      >
        {completedContent}
      </div>
    );
  }

  if (variant === "compact") {
    const core: string = showSeconds
      ? `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`
      : `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}`;
    const display: string = showDays
      ? `${pad(timeLeft.days)}d ${core}`
      : core;
    return (
      <div
        role="timer"
        aria-label={accessibleLabel}
        data-slot="countdown"
        data-finished={finished ? "true" : "false"}
        className={cn(countdownVariants({ variant }), className)}
        {...props}
      >
        <span
          suppressHydrationWarning
          className={cn(
            countdownDigitVariants({ size, color, variant: "compact" }),
            digitClassName,
          )}
        >
          {display}
        </span>
      </div>
    );
  }

  const units: { id: CountdownUnitId; value: number }[] = [];
  if (showDays) units.push({ id: "days", value: timeLeft.days });
  units.push({ id: "hours", value: timeLeft.hours });
  units.push({ id: "minutes", value: timeLeft.minutes });
  if (showSeconds) units.push({ id: "seconds", value: timeLeft.seconds });

  return (
    <div
      role="timer"
      aria-label={accessibleLabel}
      data-slot="countdown"
      data-finished={finished ? "true" : "false"}
      className={cn(countdownVariants({ variant }), className)}
      {...props}
    >
      {units.map((unit, index) => (
        <Fragment key={unit.id}>
          {variant === "plain" && index > 0 && (
            <span
              aria-hidden="true"
              className={cn(
                "self-start font-semibold leading-none text-muted-foreground/50",
                SEPARATOR_SIZE_CLASS[size],
              )}
            >
              :
            </span>
          )}
          <div
            className={cn(
              countdownSegmentVariants({ variant, size }),
              segmentClassName,
            )}
          >
            <span
              suppressHydrationWarning
              className={cn(
                countdownDigitVariants({ size, color, variant }),
                digitClassName,
              )}
            >
              {pad(unit.value)}
            </span>
            {showLabels && (
              <span
                className={cn(countdownLabelVariants({ size }), labelClassName)}
              >
                {UNIT_LABELS[unit.id]}
              </span>
            )}
          </div>
        </Fragment>
      ))}
    </div>
  );
}

Countdown.displayName = "Countdown";
