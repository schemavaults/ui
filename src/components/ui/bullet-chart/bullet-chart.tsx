"use client";

import { cva } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";

import { cn } from "@/lib/utils";
import {
  chartPaintClass,
  chartPaintSwatchStyle,
  type ChartColorId,
  type ChartPaint,
} from "@/components/ui/chart-primitives/chart-colors";
import { ChartDataTable } from "@/components/ui/chart-primitives/chart-data-table";
import {
  formatChartNumber,
  formatChartTick,
} from "@/components/ui/chart-primitives/chart-format";
import {
  cleanNumber,
  closestNiceStep,
  niceAxis,
  niceTicksWithin,
} from "@/components/ui/chart-primitives/chart-scale";

import { resolveBulletChartBands } from "./resolve-bullet-chart-bands";

export const bulletChartSizeIds = ["sm", "default", "lg"] as const;
export type BulletChartSizeId = (typeof bulletChartSizeIds)[number];

/**
 * How the qualitative bands behind each measure are painted:
 * - `neutral`: greys, darkest for the worst band (Stephen Few's original
 *   design; prints and reads well without colour)
 * - `status`: destructive → warning → positive tints, ordered by `polarity`
 */
export const bulletChartBandToneIds = ["neutral", "status"] as const;
export type BulletChartBandToneId = (typeof bulletChartBandToneIds)[number];

/** Which end of the scale is good, for ordering the bands from bad to good. */
export const bulletChartPolarityIds = [
  "higher-is-better",
  "lower-is-better",
] as const;
export type BulletChartPolarityId = (typeof bulletChartPolarityIds)[number];

export const bulletChartTrackVariants = cva(
  "relative w-full overflow-hidden rounded-sm",
  {
    variants: {
      size: {
        sm: "h-4",
        default: "h-6",
        lg: "h-8",
      } satisfies Record<BulletChartSizeId, string>,
    },
    defaultVariants: { size: "default" },
  },
);

const bulletChartLabelVariants = cva("min-w-0 truncate font-medium", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    } satisfies Record<BulletChartSizeId, string>,
  },
  defaultVariants: { size: "default" },
});

// Written out in full so Tailwind finds every class when it scans the
// package. Index 0 is the worst band.
const NEUTRAL_BAND_CLASSES: readonly string[] = [
  "bg-foreground/[0.22]",
  "bg-foreground/[0.15]",
  "bg-foreground/[0.10]",
  "bg-foreground/[0.06]",
  "bg-foreground/[0.03]",
];

const STATUS_BAND_CLASSES: readonly string[] = [
  "bg-destructive/25",
  "bg-warning/25",
  "bg-emerald-500/20 dark:bg-emerald-400/20",
];

export interface BulletChartItem {
  /** Stable identifier, used as the React key. */
  id: string;
  /** The measure's name (e.g. "Revenue"). */
  label: string;
  /** Secondary text under the label (e.g. "USD, thousands"). */
  description?: ReactNode;
  /** The measure: the bar's length. Clamped to the scale. */
  value: number;
  /** The comparative measure (goal, last period, SLO), drawn as a tick. */
  target?: number;
  /**
   * Upper bounds of the qualitative bands, ascending (e.g. `[150, 225]` for
   * poor / satisfactory / good on a 0–300 scale). The last band runs to the
   * scale's end. Up to five bands are distinguishable.
   */
  ranges?: ReadonlyArray<number>;
  /** Names for the bands, in scale order, for the accessible description. */
  rangeLabels?: ReadonlyArray<string>;
  /** Lower bound of this row's scale. Defaults to the chart's `min`. */
  min?: number;
  /** Upper bound of this row's scale. Defaults to the chart's `max`, else auto. */
  max?: number;
  /** Colour of this row's measure bar; wins over the chart's `color`. */
  color?: ChartColorId;
  /** Which end of this row's scale is good; wins over the chart's `polarity`. */
  polarity?: BulletChartPolarityId;
}

export interface BulletChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  /** One row per measure. */
  items: ReadonlyArray<BulletChartItem>;
  /** Accessible name of the chart. */
  label: string;
  /** Bar thickness and text size. Defaults to `"default"`. */
  size?: BulletChartSizeId;
  /** Measure bar colour. Defaults to `"chart-1"`. */
  color?: ChartColorId;
  /** A raw CSS colour for the measure bars; wins over `color`. */
  fill?: string;
  /** How the bands are painted. Defaults to `"neutral"`. */
  bandTone?: BulletChartBandToneId;
  /** Which end of the scale is good. Defaults to `"higher-is-better"`. */
  polarity?: BulletChartPolarityId;
  /** Lower bound of every row's scale (unless an item sets its own). Defaults to `0`. */
  min?: number;
  /**
   * Upper bound shared by every row (unless an item sets its own). When
   * omitted each row rounds its own largest value, target or range up to a
   * nice number.
   */
  max?: number;
  /** Show tick labels under each row. Defaults to `true`. */
  showAxis?: boolean;
  /** Show the value (and target) readout beside the label. Defaults to `true`. */
  showValues?: boolean;
  /** Format the axis tick labels. Defaults to plain numbers, compact from 10,000 up. */
  formatTick?: (value: number) => string;
  /** Format the readout, tooltip and accessible description values. */
  formatValue?: (value: number) => string;
  /** Lay the label out beside the bar (`"inline"`) or above it (`"stacked"`). Defaults to `"inline"`. */
  labelPosition?: "inline" | "stacked";
  /** Shown instead of the chart when there are no items. */
  emptyMessage?: ReactNode;
  /** Optional ref forwarded to the wrapper element. */
  ref?: Ref<HTMLDivElement>;
}

interface ResolvedBand {
  from: number;
  to: number;
  className: string;
  name: string | undefined;
}

interface ResolvedRow {
  item: BulletChartItem;
  min: number;
  max: number;
  value: number;
  target: number | undefined;
  bands: ResolvedBand[];
  ticks: number[];
  tickStep: number;
}

const COMPACT_TICK_FORMAT: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Tick labels: compact (`2.5M`) once the scale reaches 10,000 so they never collide. */
export function formatBulletChartTick(value: number, step: number, max: number): string {
  return Math.abs(max) >= 10_000
    ? COMPACT_TICK_FORMAT.format(value)
    : formatChartTick(value, step);
}

function finiteOr(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toPercent(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return ((clamp(value, min, max) - min) / (max - min)) * 100;
}

/** Band classes in scale order, worst → best flipped by polarity. */
function bandClasses(
  count: number,
  tone: BulletChartBandToneId,
  polarity: BulletChartPolarityId,
): string[] {
  const classes: string[] = Array.from({ length: count }, (_, index) => {
    if (tone === "status") {
      if (count === 1) return STATUS_BAND_CLASSES[2]!;
      const slot: number = Math.round(
        (index * (STATUS_BAND_CLASSES.length - 1)) / (count - 1),
      );
      return STATUS_BAND_CLASSES[slot]!;
    }
    return NEUTRAL_BAND_CLASSES[
      Math.min(index, NEUTRAL_BAND_CLASSES.length - 1)
    ]!;
  });
  return polarity === "lower-is-better" ? classes.reverse() : classes;
}

function resolveRow(
  item: BulletChartItem,
  chartMin: number,
  chartMax: number | undefined,
  tone: BulletChartBandToneId,
  chartPolarity: BulletChartPolarityId,
): ResolvedRow {
  const min: number = finiteOr(item.min, chartMin);
  const value: number = finiteOr(item.value, min);
  const target: number | undefined =
    item.target !== undefined && Number.isFinite(item.target)
      ? item.target
      : undefined;
  const ranges: number[] = (item.ranges ?? []).filter((r) => Number.isFinite(r));

  let max: number;
  const explicitMax: number | undefined = item.max ?? chartMax;
  if (explicitMax !== undefined && Number.isFinite(explicitMax) && explicitMax > min) {
    max = explicitMax;
  } else {
    const largest: number = Math.max(value, target ?? min, ...ranges, min);
    const span: number = largest - min;
    max = span > 0 ? cleanNumber(min + niceAxis(span, 4).top) : min + 1;
  }

  const polarity: BulletChartPolarityId = item.polarity ?? chartPolarity;
  const spans = resolveBulletChartBands(ranges, min, max);
  const classes: string[] = bandClasses(spans.length, tone, polarity);
  const bands: ResolvedBand[] = spans.map((span, index) => ({
    ...span,
    className: classes[index]!,
    name: item.rangeLabels?.[index],
  }));

  return {
    item,
    min,
    max,
    value: clamp(value, min, max),
    target: target === undefined ? undefined : clamp(target, min, max),
    bands,
    ticks: niceTicksWithin(min, max, 4),
    tickStep: closestNiceStep(max - min, 4),
  };
}

function describeRow(row: ResolvedRow, format: (value: number) => string): string {
  const parts: string[] = [`${row.item.label}: ${format(row.value)}`];
  if (row.target !== undefined) parts.push(`target ${format(row.target)}`);
  if (row.bands.length > 1) {
    const bands: string = row.bands
      .map(
        (band, index) =>
          `${band.name ?? `band ${index + 1}`} ${format(band.from)}–${format(band.to)}`,
      )
      .join(", ");
    parts.push(`ranges: ${bands}`);
  }
  parts.push(`scale ${format(row.min)}–${format(row.max)}`);
  return parts.join("; ");
}

/**
 * A bullet chart (Stephen Few): a compact, linear replacement for gauges and
 * meters that shows a measure against a target, over qualitative bands
 * (poor / satisfactory / good), in a single row. Stack several to compare
 * KPIs on a dashboard.
 *
 * Each row is drawn in plain HTML on its own scale (or a shared `max`), so it
 * stretches to any width. The bar colour comes from the shared `--chart-*`
 * palette in `@schemavaults/theme`; bands are neutral greys or status tints.
 * Every row is a `role="img"` with a full text description, and a visually
 * hidden data table carries the numbers.
 */
function BulletChart({
  items,
  label,
  size = "default",
  color = "chart-1",
  fill,
  bandTone = "neutral",
  polarity = "higher-is-better",
  min = 0,
  max,
  showAxis = true,
  showValues = true,
  formatValue = formatChartNumber,
  formatTick,
  labelPosition = "inline",
  emptyMessage = "No data",
  className,
  ref,
  ...props
}: BulletChartProps): ReactElement {
  const chartMin: number = finiteOr(min, 0);
  const rows: ResolvedRow[] = items.map((item) =>
    resolveRow(item, chartMin, max, bandTone, polarity),
  );
  const inline: boolean = labelPosition === "inline";

  return (
    <div
      ref={ref}
      data-slot="bullet-chart"
      role="group"
      aria-label={label}
      className={cn("w-full min-w-0", className)}
      {...props}
    >
      {rows.length === 0 ? (
        <p className="flex min-h-24 items-center justify-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((row): ReactElement => {
            const paint: ChartPaint = {
              colorId: row.item.color ?? color,
              value: row.item.color ? undefined : fill,
            };
            const valuePct: number = toPercent(row.value, row.min, row.max);
            const targetPct: number | undefined =
              row.target === undefined
                ? undefined
                : toPercent(row.target, row.min, row.max);
            const description: string = describeRow(row, formatValue);

            return (
              <div
                key={row.item.id}
                data-slot="bullet-chart-row"
                data-item-id={row.item.id}
                className={cn(
                  "flex min-w-0",
                  inline
                    ? "flex-col gap-1 sm:flex-row sm:items-start sm:gap-4"
                    : "flex-col gap-1.5",
                )}
              >
                <div
                  className={cn(
                    "flex min-w-0 justify-between gap-3",
                    inline
                      ? "items-baseline sm:w-36 sm:shrink-0 sm:flex-col sm:items-end sm:gap-0 sm:text-right"
                      : "items-baseline",
                  )}
                >
                  <span className="flex min-w-0 flex-col">
                    <span
                      className={bulletChartLabelVariants({ size })}
                      title={row.item.label}
                    >
                      {row.item.label}
                    </span>
                    {row.item.description && (
                      <span className="truncate text-xs text-muted-foreground">
                        {row.item.description}
                      </span>
                    )}
                  </span>
                  {showValues && (
                    <span
                      data-slot="bullet-chart-readout"
                      className="shrink-0 text-xs tabular-nums text-muted-foreground"
                    >
                      <span className="font-semibold text-foreground">
                        {formatValue(row.value)}
                      </span>
                      {row.target !== undefined && (
                        <> / {formatValue(row.target)}</>
                      )}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    role="img"
                    aria-label={description}
                    title={description}
                    className={cn(
                      bulletChartTrackVariants({ size }),
                      row.bands.length === 0 && "bg-muted",
                    )}
                  >
                    {row.bands.map(
                      (band, index): ReactElement => (
                        <span
                          key={index}
                          aria-hidden="true"
                          data-slot="bullet-chart-band"
                          className={cn("absolute inset-y-0", band.className)}
                          style={{
                            left: `${toPercent(band.from, row.min, row.max)}%`,
                            width: `${
                              toPercent(band.to, row.min, row.max) -
                              toPercent(band.from, row.min, row.max)
                            }%`,
                          }}
                        />
                      ),
                    )}
                    <span
                      aria-hidden="true"
                      data-slot="bullet-chart-measure"
                      className={cn(
                        "absolute inset-y-[33%] left-0 rounded-r-[2px] transition-[width] duration-500 ease-out motion-reduce:transition-none",
                        chartPaintClass(paint, "bg"),
                      )}
                      style={{
                        width: `${valuePct}%`,
                        ...chartPaintSwatchStyle(paint),
                      }}
                    />
                    {targetPct !== undefined && (
                      <span
                        aria-hidden="true"
                        data-slot="bullet-chart-target"
                        className="absolute inset-y-[12%] w-[3px] -translate-x-1/2 rounded-full bg-foreground transition-[left] duration-500 ease-out motion-reduce:transition-none"
                        style={{
                          left: `clamp(1.5px, ${targetPct}%, calc(100% - 1.5px))`,
                        }}
                      />
                    )}
                  </div>
                  {showAxis && (
                    <div
                      aria-hidden="true"
                      data-slot="bullet-chart-axis"
                      className="relative mt-1 h-4 text-[10px] tabular-nums text-muted-foreground"
                    >
                      {row.ticks.map((tick, index): ReactElement => {
                        const pct: number = toPercent(tick, row.min, row.max);
                        const first: boolean = index === 0 && pct === 0;
                        const last: boolean =
                          index === row.ticks.length - 1 && pct === 100;
                        return (
                          <span
                            key={tick}
                            className={cn(
                              "absolute top-0 whitespace-nowrap",
                              first
                                ? "translate-x-0"
                                : last
                                  ? "-translate-x-full"
                                  : "-translate-x-1/2",
                            )}
                            style={{ left: `${pct}%` }}
                          >
                            {formatTick
                              ? formatTick(tick)
                              : formatBulletChartTick(tick, row.tickStep, row.max)}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {rows.length > 0 && (
        <ChartDataTable
          caption={label}
          columns={["Measure", "Value", "Target", "Ranges", "Scale"]}
          rows={rows.map((row) => ({
            key: row.item.id,
            cells: [
              row.item.label,
              formatValue(row.value),
              row.target === undefined ? "—" : formatValue(row.target),
              row.bands.length > 1
                ? row.bands
                    .map(
                      (band, index) =>
                        `${band.name ?? `Band ${index + 1}`}: ${formatValue(band.from)}–${formatValue(band.to)}`,
                    )
                    .join(", ")
                : "—",
              `${formatValue(row.min)}–${formatValue(row.max)}`,
            ],
          }))}
        />
      )}
    </div>
  );
}
BulletChart.displayName = "BulletChart";

export { BulletChart };
