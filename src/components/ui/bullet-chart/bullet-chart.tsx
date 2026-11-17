"use client";

import { cva } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";

import { m, useReducedMotion } from "@/framer-motion";
import { cn } from "@/lib/utils";
import {
  getChartColorClasses,
  type ChartColorId,
} from "@/components/ui/chart-primitives/chart-colors";
import {
  formatChartNumber,
  formatChartTick,
} from "@/components/ui/chart-primitives/chart-format";
import {
  closestNiceStep,
  niceAxis,
  niceTicksWithin,
} from "@/components/ui/chart-primitives/chart-scale";

export const bulletChartSizeIds = ["sm", "default", "lg"] as const;
export type BulletChartSizeId = (typeof bulletChartSizeIds)[number];

export const bulletChartLabelPositionIds = ["top", "left"] as const;
export type BulletChartLabelPositionId =
  (typeof bulletChartLabelPositionIds)[number];

export const bulletChartTrackVariants = cva(
  "relative w-full overflow-hidden rounded-sm bg-muted",
  {
    variants: {
      size: {
        sm: "h-3",
        default: "h-5",
        lg: "h-7",
      } satisfies Record<BulletChartSizeId, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const bulletChartTextVariants = cva("tabular-nums", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    } satisfies Record<BulletChartSizeId, string>,
  },
  defaultVariants: {
    size: "default",
  },
});

/**
 * Qualitative band shades, lightest to darkest. Written out in full so
 * Tailwind finds every class when it scans the package. They are tints of
 * `foreground`, so they read in both light and dark mode, and they stay
 * neutral so the measure bar is the only coloured mark.
 */
const BAND_SHADES: readonly string[] = [
  "bg-foreground/[0.06]",
  "bg-foreground/[0.11]",
  "bg-foreground/[0.16]",
  "bg-foreground/[0.21]",
  "bg-foreground/[0.26]",
];

const MISSED_TARGET_BAR_CLASS: string = "bg-red-500 dark:bg-red-400";

/** A qualitative band: everything from the previous band's `to` up to this one's. */
export interface BulletChartRange {
  /** Upper bound of the band, in data units. Bands are sorted by `to`. */
  to: number;
  /** Name of the band ("Poor", "Satisfactory", "Good"), announced with the value. */
  label?: string;
}

export interface BulletChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role" | "color"> {
  /** The measured value (the bar). Clamped to the scale for drawing. */
  value: number;
  /** Accessible name, also shown as the visible label unless `showLabel` is false. */
  label: string;
  /** Secondary text shown under the label ("Q3, USD thousands"). */
  description?: ReactNode;
  /** The comparative target, drawn as a vertical marker across the bar. */
  target?: number;
  /**
   * Qualitative bands behind the bar (e.g. poor / satisfactory / good).
   * Up to five are shaded; extra bands reuse the darkest shade.
   */
  ranges?: readonly BulletChartRange[];
  /** Start of the scale. Defaults to 0. */
  min?: number;
  /**
   * End of the scale. Defaults to a round number at or above the largest of
   * `value`, `target` and the last range.
   */
  max?: number;
  /**
   * Whether a larger value is better (revenue) or worse (latency, error
   * rate). Decides which end of the bands is shaded darkest (the bad end)
   * and, with `colorByTarget`, whether meeting the target means staying
   * above or below it. Defaults to true.
   */
  higherIsBetter?: boolean;
  /** Colour of the measure bar. Ignored when `colorByTarget` is set. Defaults to `"default"`. */
  color?: ChartColorId;
  /**
   * Paints the bar `positive` when the value meets `target` and
   * `destructive` when it misses, honouring `higherIsBetter`.
   */
  colorByTarget?: boolean;
  /** Bar height. */
  size?: BulletChartSizeId;
  /**
   * `"top"` puts the label and readout above the bar; `"left"` puts the
   * label in a fixed-width column beside it, so a stack of bullet charts
   * lines up into a KPI table.
   */
  labelPosition?: BulletChartLabelPositionId;
  /** Shows the visible label. The chart keeps its accessible name either way. Defaults to true. */
  showLabel?: boolean;
  /** Shows the formatted value (and target) as a readout. Defaults to true. */
  showValue?: boolean;
  /** Shows the signed percentage difference from `target` next to the readout. */
  showDelta?: boolean;
  /** Shows a tick scale under the bar. */
  showTicks?: boolean;
  /** Roughly how many tick intervals to draw. Defaults to 4. */
  tickCount?: number;
  /** Shown after the value in the default readout ("%", "ms"). */
  unit?: string;
  /** Formats the value and target in the readout and accessible text. */
  formatValue?: (value: number) => string;
  /** Formats tick labels. Defaults to `formatValue`, then a step-aware number. */
  formatTick?: (value: number) => string;
  /** Animates the bar growing in. Skipped under `prefers-reduced-motion`. Defaults to true. */
  animate?: boolean;
  /** Classes for the bar track (the bands' container). */
  trackClassName?: string;
  /** Classes for the measure bar. */
  barClassName?: string;
  /** Classes for the target marker. */
  targetClassName?: string;
  /** Classes for the label. With `labelPosition="left"` this is where to set its width. */
  labelClassName?: string;
  /**
   * Classes for the readout. With `labelPosition="left"` the readout sits in
   * a right-aligned column at least 10rem wide so the bars line up.
   */
  valueClassName?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toPercent(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return ((clamp(value, min, max) - min) / (max - min)) * 100;
}

interface ResolvedBand {
  from: number;
  to: number;
  label?: string;
  shade: string;
}

function resolveBands(
  ranges: readonly BulletChartRange[],
  min: number,
  max: number,
  higherIsBetter: boolean,
): ResolvedBand[] {
  const sorted: BulletChartRange[] = ranges
    .filter((range) => Number.isFinite(range.to))
    .slice()
    .sort((a, b) => a.to - b.to);
  const count: number = sorted.length;
  const bands: ResolvedBand[] = [];
  let from: number = min;
  sorted.forEach((range, index) => {
    // Darkest at the bad end: the bottom band when higher is better.
    const badness: number = higherIsBetter ? count - 1 - index : index;
    const shadeIndex: number = Math.min(
      BAND_SHADES.length - 1,
      Math.round((badness / Math.max(1, count - 1)) * (Math.min(count, BAND_SHADES.length) - 1)),
    );
    bands.push({
      from,
      to: range.to,
      label: range.label,
      shade: BAND_SHADES[shadeIndex]!,
    });
    from = range.to;
  });
  return bands.filter((band) => band.to > min && band.from < max);
}

function meetsTarget(
  value: number,
  target: number,
  higherIsBetter: boolean,
): boolean {
  return higherIsBetter ? value >= target : value <= target;
}

/**
 * A bullet chart: one measure against a target, over qualitative bands.
 * The compact replacement for a gauge in a KPI list.
 */
export function BulletChart({
  value,
  label,
  description,
  target,
  ranges = [],
  min = 0,
  max,
  higherIsBetter = true,
  color = "default",
  colorByTarget = false,
  size = "default",
  labelPosition = "top",
  showLabel = true,
  showValue = true,
  showDelta = false,
  showTicks = false,
  tickCount = 4,
  unit,
  formatValue,
  formatTick,
  animate = true,
  className,
  trackClassName,
  barClassName,
  targetClassName,
  labelClassName,
  valueClassName,
  ...props
}: BulletChartProps): ReactElement {
  const reduceMotion: boolean | null = useReducedMotion();

  const hasTarget: boolean = target !== undefined && Number.isFinite(target);
  const lastRange: number = ranges.reduce(
    (acc, range) => (Number.isFinite(range.to) ? Math.max(acc, range.to) : acc),
    -Infinity,
  );
  const dataMax: number = Math.max(
    Number.isFinite(value) ? value : min,
    hasTarget ? target! : min,
    lastRange,
  );
  const resolvedMax: number =
    max !== undefined && Number.isFinite(max) && max > min
      ? max
      : min === 0
        ? niceAxis(dataMax, 5).top
        : Math.max(min + 1, dataMax);

  const safeValue: number = Number.isFinite(value) ? value : min;
  const valuePct: number = toPercent(safeValue, min, resolvedMax);
  const targetPct: number | undefined = hasTarget
    ? toPercent(target!, min, resolvedMax)
    : undefined;

  const bands: ResolvedBand[] = resolveBands(
    ranges,
    min,
    resolvedMax,
    higherIsBetter,
  );
  const currentBand: ResolvedBand | undefined = bands.find(
    (band) => safeValue >= band.from && safeValue <= band.to,
  );

  const met: boolean | undefined = hasTarget
    ? meetsTarget(safeValue, target!, higherIsBetter)
    : undefined;
  const barColor: ChartColorId =
    colorByTarget && met !== undefined
      ? met
        ? "positive"
        : "destructive"
      : color;

  const format = (n: number): string =>
    formatValue ? formatValue(n) : `${formatChartNumber(n)}${unit ?? ""}`;

  const deltaPct: number | undefined =
    hasTarget && target !== 0
      ? ((safeValue - target!) / Math.abs(target!)) * 100
      : undefined;
  const deltaText: string | undefined =
    deltaPct === undefined
      ? undefined
      : `${deltaPct > 0 ? "+" : deltaPct < 0 ? "−" : "±"}${formatChartNumber(
          Math.round(Math.abs(deltaPct) * 10) / 10,
        )}%`;

  const valueText: string = [
    format(safeValue),
    hasTarget ? `target ${format(target!)}` : undefined,
    met === undefined ? undefined : met ? "target met" : "target missed",
    currentBand?.label,
  ]
    .filter(Boolean)
    .join(", ");

  const ticks: number[] = showTicks
    ? niceTicksWithin(min, resolvedMax, tickCount)
    : [];
  const tickStep: number = closestNiceStep(resolvedMax - min, tickCount);
  const tickLabel = (n: number): string =>
    formatTick
      ? formatTick(n)
      : formatValue
        ? formatValue(n)
        : formatChartTick(n, tickStep);

  const shouldAnimate: boolean = animate && !reduceMotion;

  const readout: ReactNode = showValue ? (
    <span
      className={cn(
        bulletChartTextVariants({ size }),
        "flex shrink-0 items-baseline gap-1.5 whitespace-nowrap font-medium text-foreground",
        valueClassName,
      )}
      data-slot="bullet-chart-value"
    >
      <span>{format(safeValue)}</span>
      {hasTarget && (
        <span className="font-normal text-muted-foreground">
          / {format(target!)}
        </span>
      )}
      {showDelta && deltaText && (
        <span
          className={cn(
            "text-xs font-medium",
            met
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400",
          )}
          data-slot="bullet-chart-delta"
        >
          {deltaText}
        </span>
      )}
    </span>
  ) : null;

  const labelNode: ReactNode = showLabel ? (
    <div
      className={cn(
        "flex min-w-0 flex-col",
        labelPosition === "left" && "w-32 shrink-0",
        labelClassName,
      )}
    >
      <span
        className={cn(
          bulletChartTextVariants({ size }),
          "truncate font-medium text-foreground",
        )}
      >
        {label}
      </span>
      {description && (
        <span className="truncate text-xs text-muted-foreground">
          {description}
        </span>
      )}
    </div>
  ) : null;

  const chart: ReactElement = (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div
        role="meter"
        aria-label={label}
        aria-valuenow={clamp(safeValue, min, resolvedMax)}
        aria-valuemin={min}
        aria-valuemax={resolvedMax}
        aria-valuetext={valueText}
        className={cn(bulletChartTrackVariants({ size }), trackClassName)}
        data-slot="bullet-chart-track"
      >
        {bands.map((band, index) => {
          const left: number = toPercent(band.from, min, resolvedMax);
          const right: number = toPercent(band.to, min, resolvedMax);
          return (
            <span
              key={index}
              aria-hidden="true"
              className={cn("absolute inset-y-0", band.shade)}
              style={{ left: `${left}%`, width: `${right - left}%` }}
              data-slot="bullet-chart-band"
              title={band.label}
            />
          );
        })}
        <m.span
          aria-hidden="true"
          className={cn(
            "absolute left-0 top-1/2 block h-2/5 -translate-y-1/2 rounded-r-[2px]",
            // The theme's dark-mode `destructive` is too dim to read as a
            // thin bar on the bands, so a missed target uses a brighter red.
            colorByTarget && met === false
              ? MISSED_TARGET_BAR_CLASS
              : getChartColorClasses(barColor).bg,
            barClassName,
          )}
          initial={shouldAnimate ? { width: 0 } : false}
          animate={{ width: `${valuePct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={shouldAnimate ? undefined : { width: `${valuePct}%` }}
          data-slot="bullet-chart-bar"
          data-color={barColor}
        />
        {targetPct !== undefined && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-[12%] block h-[76%] w-[3px] -translate-x-1/2 rounded-full bg-foreground",
              targetClassName,
            )}
            style={{ left: `clamp(1.5px, ${targetPct}%, calc(100% - 1.5px))` }}
            data-slot="bullet-chart-target"
          />
        )}
      </div>
      {showTicks && ticks.length > 0 && (
        <div
          aria-hidden="true"
          className="relative h-4 text-[11px] tabular-nums text-muted-foreground"
          data-slot="bullet-chart-ticks"
        >
          {ticks.map((tick) => {
            const pct: number = toPercent(tick, min, resolvedMax);
            const align: string =
              pct <= 0
                ? "translate-x-0"
                : pct >= 100
                  ? "-translate-x-full"
                  : "-translate-x-1/2";
            return (
              <span
                key={tick}
                className={cn("absolute top-0 whitespace-nowrap", align)}
                style={{ left: `${pct}%` }}
              >
                {tickLabel(tick)}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );

  if (labelPosition === "left") {
    return (
      <div
        className={cn("flex w-full items-start gap-3", className)}
        data-slot="bullet-chart"
        {...props}
      >
        {labelNode}
        {chart}
        {readout && (
          <div className="flex min-w-[10rem] shrink-0 justify-end">
            {readout}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("flex w-full flex-col gap-1.5", className)}
      data-slot="bullet-chart"
      {...props}
    >
      {(labelNode || readout) && (
        <div className="flex items-end justify-between gap-3">
          {labelNode ?? <span />}
          {readout}
        </div>
      )}
      {chart}
    </div>
  );
}

BulletChart.displayName = "BulletChart";
