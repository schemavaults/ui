"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";

import { m } from "@/framer-motion";
import { cn } from "@/lib/utils";

export const meterSizeIds = ["sm", "default", "lg"] as const;
export type MeterSizeId = (typeof meterSizeIds)[number];

export const meterColorIds = [
  "default",
  "positive",
  "warning",
  "destructive",
] as const;
export type MeterColorId = (typeof meterColorIds)[number];

export const meterVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      size: {
        sm: "h-1.5",
        default: "h-2.5",
        lg: "h-4",
      } satisfies Record<MeterSizeId, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export const meterIndicatorVariants = cva(
  "h-full rounded-full transition-colors duration-300",
  {
    variants: {
      color: {
        default: "bg-schemavaults-brand-blue",
        positive: "bg-emerald-500 dark:bg-emerald-400",
        warning: "bg-warning",
        destructive: "bg-destructive",
      } satisfies Record<MeterColorId, string>,
    },
    defaultVariants: {
      color: "default",
    },
  },
);

const meterValueTextVariants = cva("tabular-nums text-foreground", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    } satisfies Record<MeterSizeId, string>,
  },
  defaultVariants: {
    size: "default",
  },
});

/**
 * A meter behaves like the HTML `<meter>` element: the value is a scalar
 * measurement inside a known range, with optional quality thresholds
 * (`low`, `high`, `optimum`) that define which sub-range is preferable.
 *
 * The rules are the same as `<meter>`:
 *   - "optimum" marks the ideal value.
 *   - If `optimum` falls between `low` and `high`, values inside the same
 *     band are considered optimal, adjacent bands are sub-optimal, and the
 *     farthest band is considered bad.
 *   - When only one of `low`/`high` is set, the missing side extends to the
 *     matching endpoint.
 *
 * When `autoColorFromThresholds` is enabled the indicator color is chosen
 * automatically from the resolved quality: optimum → positive, sub-optimum
 * → warning, worst → destructive.
 */
function clampValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function valueToPercentage(value: number, min: number, max: number): number {
  if (max === min) {
    return 0;
  }
  return ((value - min) / (max - min)) * 100;
}

type MeterQuality = "optimum" | "sub-optimum" | "worst";

function resolveQuality(
  value: number,
  low: number,
  high: number,
  optimum: number,
): MeterQuality {
  const inLow: boolean = value < low;
  const inHigh: boolean = value > high;
  const inMid: boolean = !inLow && !inHigh;

  const optimumInMid: boolean = optimum >= low && optimum <= high;
  const optimumInLow: boolean = optimum < low;
  const optimumInHigh: boolean = optimum > high;

  if (optimumInMid) {
    return inMid ? "optimum" : "sub-optimum";
  }
  if (optimumInLow) {
    if (inLow) {
      return "optimum";
    }
    return inMid ? "sub-optimum" : "worst";
  }
  if (optimumInHigh) {
    if (inHigh) {
      return "optimum";
    }
    return inMid ? "sub-optimum" : "worst";
  }
  return inMid ? "optimum" : "sub-optimum";
}

const QUALITY_TO_COLOR: Record<MeterQuality, MeterColorId> = {
  optimum: "positive",
  "sub-optimum": "warning",
  worst: "destructive",
};

export interface MeterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role" | "color">,
    VariantProps<typeof meterVariants>,
    VariantProps<typeof meterIndicatorVariants> {
  /** Current value (clamped to [min, max]). */
  value: number;
  /** Accessible label describing what the meter represents. */
  label: string;
  /** Minimum value (defaults to 0). */
  min?: number;
  /** Maximum value (defaults to 100). */
  max?: number;
  /**
   * Upper bound of the "low" band. Values below `low` are considered low.
   * Defaults to `min` (i.e. no low band).
   */
  low?: number;
  /**
   * Lower bound of the "high" band. Values above `high` are considered high.
   * Defaults to `max` (i.e. no high band).
   */
  high?: number;
  /**
   * Ideal value. When `optimum` sits between `low` and `high`, the mid
   * band is optimal; otherwise the band containing `optimum` is optimal.
   * Defaults to the midpoint of [min, max].
   */
  optimum?: number;
  /**
   * When true, the indicator color is chosen automatically based on where
   * the current value sits relative to the thresholds — overriding `color`.
   */
  autoColorFromThresholds?: boolean;
  /**
   * When true (default), renders the label above the bar. Set to `false` to
   * hide the visible label (it is still announced via `aria-label`).
   */
  showLabel?: boolean;
  /** When true (default), renders the numeric value alongside the label. */
  showValue?: boolean;
  /**
   * When true, faintly renders the threshold band edges behind the
   * indicator so the reader can see where "low", "mid", and "high" sit.
   */
  showThresholdMarks?: boolean;
  /** Displayed unit next to the value (e.g. "%", "GB"). */
  unit?: string;
  /**
   * Optional formatter for the value shown next to the label. Overrides
   * the default `Math.round(value) + unit` display.
   */
  formatValue?: (value: number) => ReactNode;
  /** Additional classes for the filled indicator. */
  indicatorClassName?: string;
  /** Additional classes for the header row containing label + value. */
  headerClassName?: string;
  /** Additional classes for the label text. */
  labelClassName?: string;
  /** Additional classes for the value text. */
  valueClassName?: string;
}

export function Meter({
  value,
  label,
  min = 0,
  max = 100,
  low,
  high,
  optimum,
  size,
  color,
  autoColorFromThresholds = false,
  showLabel = true,
  showValue = true,
  showThresholdMarks = false,
  unit,
  formatValue,
  className,
  indicatorClassName,
  headerClassName,
  labelClassName,
  valueClassName,
  ...props
}: MeterProps): ReactElement {
  const resolvedSize: MeterSizeId = size ?? "default";
  const resolvedLow: number = low ?? min;
  const resolvedHigh: number = high ?? max;
  const resolvedOptimum: number = optimum ?? (min + max) / 2;
  const clamped: number = clampValue(value, min, max);
  const percentage: number = valueToPercentage(clamped, min, max);

  const quality: MeterQuality = resolveQuality(
    clamped,
    resolvedLow,
    resolvedHigh,
    resolvedOptimum,
  );

  const indicatorColor: MeterColorId = autoColorFromThresholds
    ? QUALITY_TO_COLOR[quality]
    : (color ?? "default");

  const lowPct: number = valueToPercentage(
    clampValue(resolvedLow, min, max),
    min,
    max,
  );
  const highPct: number = valueToPercentage(
    clampValue(resolvedHigh, min, max),
    min,
    max,
  );
  const showLowMark: boolean = showThresholdMarks && lowPct > 0 && lowPct < 100;
  const showHighMark: boolean =
    showThresholdMarks && highPct > 0 && highPct < 100 && highPct !== lowPct;

  const showHeader: boolean = showLabel || showValue;

  const defaultFormattedValue: ReactNode = (
    <>
      {Math.round(clamped)}
      {unit && (
        <span className="ml-0.5 text-muted-foreground">{unit}</span>
      )}
    </>
  );

  return (
    <div className={cn("flex w-full flex-col gap-1", className)} {...props}>
      {showHeader && (
        <div
          className={cn(
            "flex items-baseline justify-between gap-2",
            headerClassName,
          )}
        >
          {showLabel && (
            <span
              className={cn(
                meterValueTextVariants({ size: resolvedSize }),
                "text-muted-foreground",
                labelClassName,
              )}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              className={cn(
                meterValueTextVariants({ size: resolvedSize }),
                "font-medium",
                valueClassName,
              )}
            >
              {formatValue ? formatValue(clamped) : defaultFormattedValue}
            </span>
          )}
        </div>
      )}
      <div
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className={cn(meterVariants({ size: resolvedSize }))}
      >
        {showLowMark && (
          <span
            aria-hidden="true"
            className="absolute inset-y-0 w-px bg-foreground/25"
            style={{ left: `${lowPct}%` }}
          />
        )}
        {showHighMark && (
          <span
            aria-hidden="true"
            className="absolute inset-y-0 w-px bg-foreground/25"
            style={{ left: `${highPct}%` }}
          />
        )}
        <m.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn(
            meterIndicatorVariants({ color: indicatorColor }),
            indicatorClassName,
          )}
        />
      </div>
    </div>
  );
}

Meter.displayName = "Meter";
