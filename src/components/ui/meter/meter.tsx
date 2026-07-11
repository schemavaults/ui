"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";

import { m } from "@/framer-motion";
import { cn } from "@/lib/utils";

export const meterSizeIds = ["sm", "md", "lg"] as const;
export type MeterSizeId = (typeof meterSizeIds)[number];

export const meterAppearanceIds = ["continuous", "segmented"] as const;
export type MeterAppearanceId = (typeof meterAppearanceIds)[number];

export const meterColorIds = [
  "default",
  "primary",
  "positive",
  "warning",
  "destructive",
] as const;
export type MeterColorId = (typeof meterColorIds)[number];

const meterTrackVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      size: {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
      } satisfies Record<MeterSizeId, string>,
      appearance: {
        continuous: "",
        segmented: "bg-transparent overflow-visible rounded-none",
      } satisfies Record<MeterAppearanceId, string>,
    },
    defaultVariants: {
      size: "md",
      appearance: "continuous",
    },
  },
);

const meterIndicatorVariants = cva(
  "h-full rounded-full transition-colors duration-300",
  {
    variants: {
      color: {
        default: "bg-schemavaults-brand-blue",
        primary: "bg-primary",
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

const meterSegmentColorVariants = cva("transition-colors duration-300", {
  variants: {
    color: {
      default: "bg-schemavaults-brand-blue",
      primary: "bg-primary",
      positive: "bg-emerald-500 dark:bg-emerald-400",
      warning: "bg-warning",
      destructive: "bg-destructive",
    } satisfies Record<MeterColorId, string>,
  },
  defaultVariants: {
    color: "default",
  },
});

export interface MeterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role" | "color">,
    VariantProps<typeof meterTrackVariants> {
  /** Current measurement (clamped to [`min`, `max`]). */
  value: number;
  /** Accessible label describing what the meter represents. */
  label: string;
  /** Minimum value (defaults to 0). */
  min?: number;
  /** Maximum value (defaults to 100). */
  max?: number;
  /**
   * Upper bound of the "low" range. Values below `low` are considered
   * suboptimum on the low side. Mirrors the HTML `<meter>` `low` attribute.
   */
  low?: number;
  /**
   * Lower bound of the "high" range. Values above `high` are considered
   * suboptimum on the high side. Mirrors the HTML `<meter>` `high` attribute.
   */
  high?: number;
  /**
   * The optimum value. Used to pick threshold-based colors: the range
   * containing `optimum` is "positive", the adjacent range is "warning",
   * and the far range is "destructive". Mirrors the HTML `<meter>`
   * `optimum` attribute.
   */
  optimum?: number;
  /**
   * When true, colour the indicator automatically from `low` / `high` /
   * `optimum` thresholds (HTML `<meter>` semantics). Requires `low` and
   * `high` to be set to have any effect. Overrides the `color` prop.
   * Defaults to true when any of `low` / `high` / `optimum` are provided.
   */
  autoColorFromThresholds?: boolean;
  /**
   * Explicit color for the indicator. Ignored when
   * `autoColorFromThresholds` is enabled and thresholds resolve a color.
   */
  color?: MeterColorId;
  /** Number of discrete segments (only used when `appearance="segmented"`). */
  segments?: number;
  /** Additional classes for the filled indicator (continuous mode). */
  indicatorClassName?: string;
  /** Additional classes for the empty track. */
  trackClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Resolve the threshold-based color for a meter value, mirroring the
 * HTML `<meter>` element's semantics:
 *
 * - If `optimum` is inside `[low, high]`, values inside `[low, high]` are
 *   "positive"; values outside are "warning".
 * - If `optimum` is below `low`, low values are "positive", middle values
 *   are "warning", and high values are "destructive".
 * - If `optimum` is above `high`, high values are "positive", middle
 *   values are "warning", and low values are "destructive".
 */
export function resolveMeterThresholdColor(
  value: number,
  min: number,
  max: number,
  low: number | undefined,
  high: number | undefined,
  optimum: number | undefined,
): MeterColorId | undefined {
  if (low === undefined && high === undefined && optimum === undefined) {
    return undefined;
  }
  const resolvedLow: number = low ?? min;
  const resolvedHigh: number = high ?? max;
  const resolvedOptimum: number = optimum ?? (resolvedLow + resolvedHigh) / 2;

  const inLow: boolean = value < resolvedLow;
  const inHigh: boolean = value > resolvedHigh;
  const inMid: boolean = !inLow && !inHigh;

  if (resolvedOptimum >= resolvedLow && resolvedOptimum <= resolvedHigh) {
    return inMid ? "positive" : "warning";
  }
  if (resolvedOptimum < resolvedLow) {
    if (inLow) return "positive";
    if (inMid) return "warning";
    return "destructive";
  }
  if (inHigh) return "positive";
  if (inMid) return "warning";
  return "destructive";
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
  appearance,
  color,
  autoColorFromThresholds,
  segments = 10,
  className,
  indicatorClassName,
  trackClassName,
  ref,
  ...props
}: MeterProps): ReactElement {
  const clamped: number = clamp(value, min, max);
  const percentage: number =
    max === min ? 0 : ((clamped - min) / (max - min)) * 100;

  const thresholdsProvided: boolean =
    low !== undefined || high !== undefined || optimum !== undefined;
  const shouldAutoColor: boolean =
    autoColorFromThresholds ?? thresholdsProvided;
  const thresholdColor: MeterColorId | undefined = shouldAutoColor
    ? resolveMeterThresholdColor(clamped, min, max, low, high, optimum)
    : undefined;
  const resolvedColor: MeterColorId = thresholdColor ?? color ?? "default";

  const resolvedAppearance: MeterAppearanceId = appearance ?? "continuous";
  const resolvedSize: MeterSizeId = size ?? "md";

  return (
    <div
      ref={ref}
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={label}
      data-slot="meter"
      data-appearance={resolvedAppearance}
      className={cn(
        meterTrackVariants({
          size: resolvedSize,
          appearance: resolvedAppearance,
        }),
        trackClassName,
        className,
      )}
      {...props}
    >
      {resolvedAppearance === "continuous" ? (
        <m.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          data-slot="meter-indicator"
          className={cn(
            meterIndicatorVariants({ color: resolvedColor }),
            indicatorClassName,
          )}
        />
      ) : (
        <MeterSegmentedIndicator
          percentage={percentage}
          segments={segments}
          color={resolvedColor}
          size={resolvedSize}
          indicatorClassName={indicatorClassName}
        />
      )}
    </div>
  );
}

Meter.displayName = "Meter";

const segmentedSegmentHeightBySize: Record<MeterSizeId, string> = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

function MeterSegmentedIndicator({
  percentage,
  segments,
  color,
  size,
  indicatorClassName,
}: {
  percentage: number;
  segments: number;
  color: MeterColorId;
  size: MeterSizeId;
  indicatorClassName?: string;
}): ReactElement {
  const safeSegments: number = Math.max(1, Math.floor(segments));
  const filledSegments: number = Math.round((percentage / 100) * safeSegments);
  return (
    <div
      className={cn(
        "flex w-full items-stretch gap-1",
        segmentedSegmentHeightBySize[size],
      )}
      aria-hidden="true"
    >
      {Array.from({ length: safeSegments }).map((_, index) => {
        const isFilled: boolean = index < filledSegments;
        return (
          <m.span
            key={index}
            initial={{ opacity: 0.4, scaleY: 0.85 }}
            animate={{
              opacity: isFilled ? 1 : 0.35,
              scaleY: 1,
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            data-slot="meter-segment"
            data-filled={isFilled}
            className={cn(
              "flex-1 rounded-sm origin-bottom",
              isFilled
                ? meterSegmentColorVariants({ color })
                : "bg-secondary",
              indicatorClassName,
            )}
          />
        );
      })}
    </div>
  );
}

export interface MeterFieldProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role" | "color">,
    Omit<MeterProps, "className" | "ref"> {
  /** Text rendered above the meter (defaults to the accessible `label`). */
  labelSlot?: ReactNode;
  /**
   * Custom node rendered on the right of the header row (e.g. the current
   * value with a unit). When omitted and `showValue` is true, the value
   * and optional `unit` are shown.
   */
  valueSlot?: ReactNode;
  /** Show the numeric value in the top-right of the header. */
  showValue?: boolean;
  /** When true, show `min` on the left and `max` on the right beneath the meter. */
  showRange?: boolean;
  /** Optional unit shown after the numeric value (e.g. "%", "GB"). */
  unit?: string;
  /** Formatter for the displayed value. Defaults to `Math.round`. */
  formatValue?: (value: number) => string;
  /** Extra classes on the outer wrapper. */
  className?: string;
  /** Extra classes on the label element. */
  labelClassName?: string;
  /** Extra classes on the value element. */
  valueClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Convenience wrapper that renders a labelled `Meter` with an optional
 * numeric value display and range ticks — the typical layout used in
 * dashboard tiles.
 */
export function MeterField({
  value,
  min = 0,
  max = 100,
  label,
  labelSlot,
  valueSlot,
  showValue = true,
  showRange = false,
  unit,
  formatValue,
  className,
  labelClassName,
  valueClassName,
  ref,
  ...meterProps
}: MeterFieldProps): ReactElement {
  const clamped: number = clamp(value, min, max);
  const formatter: (v: number) => string =
    formatValue ?? ((v): string => Math.round(v).toString());
  const displayValue: string = formatter(clamped);
  return (
    <div
      ref={ref}
      data-slot="meter-field"
      className={cn("flex w-full flex-col gap-1.5", className)}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span
          data-slot="meter-field-label"
          className={cn(
            "text-sm font-medium text-foreground leading-none",
            labelClassName,
          )}
        >
          {labelSlot ?? label}
        </span>
        {valueSlot ??
          (showValue ? (
            <span
              data-slot="meter-field-value"
              className={cn(
                "text-sm font-semibold tabular-nums text-foreground leading-none",
                valueClassName,
              )}
            >
              {displayValue}
              {unit ? (
                <span className="ml-0.5 text-xs font-medium text-muted-foreground">
                  {unit}
                </span>
              ) : null}
            </span>
          ) : null)}
      </div>
      <Meter value={clamped} min={min} max={max} label={label} {...meterProps} />
      {showRange ? (
        <div className="flex w-full justify-between text-xs tabular-nums text-muted-foreground">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      ) : null}
    </div>
  );
}

MeterField.displayName = "MeterField";

export {
  meterTrackVariants,
  meterIndicatorVariants,
  meterSegmentColorVariants,
};
