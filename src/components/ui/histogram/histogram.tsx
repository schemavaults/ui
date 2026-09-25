"use client";

import type {
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import {
  chartPaintClass,
  chartPaintSwatchStyle,
  type ChartColorId,
  type ChartPaint,
} from "@/components/ui/chart-primitives/chart-colors";
import { ChartDataTable } from "@/components/ui/chart-primitives/chart-data-table";
import { formatChartNumber } from "@/components/ui/chart-primitives/chart-format";
import {
  niceAxis,
  roundedBarPath,
  thinIndices,
} from "@/components/ui/chart-primitives/chart-scale";
import {
  ChartTooltip,
  ChartTooltipRow,
} from "@/components/ui/chart-primitives/chart-tooltip";
import {
  useChartWidth,
  type ChartWidth,
} from "@/components/ui/chart-primitives/use-chart-width";

import type { HistogramBucket } from "./bin-values";

/** What the counted things are called in the readout: "12 traces". */
export interface HistogramCountNoun {
  singular: string;
  plural: string;
}

export interface HistogramProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  /**
   * Adjacent buckets in ascending order, e.g. from `binValues()`. A last
   * bucket with `upper: null` is an open-ended overflow bucket.
   */
  buckets: ReadonlyArray<HistogramBucket>;
  /** Accessible label describing what the chart represents. */
  label: string;
  /**
   * The size of the whole sample, for each bucket's share. Defaults to the
   * sum of the bucket counts.
   */
  total?: number;
  /**
   * Canvas width in pixels, or `"auto"` (the default) to fill the container
   * and redraw when it resizes. An `"auto"` chart renders an empty
   * placeholder at its height until it has been measured.
   */
  width?: ChartWidth;
  /** Canvas height in pixels, x-axis labels included. Defaults to `240`. */
  height?: number;
  /** Colour of the bars. Defaults to `"chart-1"`. */
  color?: ChartColorId;
  /** Colour of the overflow bucket, set apart from the regular bins. Defaults to `"other"`. */
  overflowColor?: ChartColorId;
  /** Format a bucket edge for the x-axis and the readout. Defaults to a thousands-separated number. */
  formatBoundary?: (value: number) => string;
  /** Format a count. Defaults to a thousands-separated number. */
  formatCount?: (count: number) => string;
  /** Describe a bucket's range in the readout and the table. Defaults to "lower – upper" / "lower or more". */
  describeBucket?: (bucket: HistogramBucket) => string;
  /** What the counted things are called. Defaults to value / values. */
  countNoun?: HistogramCountNoun;
  /**
   * The caption under the chart when the last bucket is an overflow bucket.
   * Defaults to a sentence saying how many values it holds; `false` hides it.
   */
  overflowCaption?: ReactNode | false;
  /** Show the hover / focus readout. Defaults to `true`. */
  showTooltip?: boolean;
  /** Text rendered when there are no buckets. */
  emptyMessage?: string;
  /**
   * Hold the current render at reduced opacity while new data loads, rather
   * than flashing a skeleton.
   */
  loading?: boolean;
  /** Optional ref forwarded to the wrapper element. */
  ref?: Ref<HTMLDivElement>;
}

const MARGIN = { top: 16, right: 8, bottom: 24 } as const;
/** The surface gap between touching bars. */
const BAR_GAP: number = 2;
/** Room each x-axis label needs before labels start thinning out. */
const X_LABEL_SPACING: number = 52;
/** Approximate width of an 11px tick-label character. */
const TICK_CHAR_WIDTH: number = 6.8;

const SHARE_FORMAT: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

/**
 * A histogram: the counts of adjacent ranges of one quantity, as touching
 * columns on a shared count axis, labelled at the bucket edges.
 *
 * Unlike `BarChart` (unrelated categories, each label under its bar), the
 * x-axis here is continuous: labels sit on the edges between bars, thinned
 * so they never crowd. An open-ended overflow bucket is drawn in the
 * de-emphasis grey with a caption, so a long tail doesn't flatten the rest.
 * Hover or the arrow keys read out a bucket's range, count and share.
 *
 * Bin raw values with `binValues()`.
 */
function Histogram({
  buckets,
  label,
  total,
  width = "auto",
  height = 240,
  color = "chart-1",
  overflowColor = "other",
  formatBoundary = formatChartNumber,
  formatCount = formatChartNumber,
  describeBucket,
  countNoun = { singular: "value", plural: "values" },
  overflowCaption,
  showTooltip = true,
  emptyMessage = "No data",
  loading = false,
  className,
  style,
  ref,
  ...props
}: HistogramProps): ReactElement {
  const chart = useChartWidth<HTMLDivElement>(width, 360, ref);
  const W: number | null = chart.width;
  const H: number = height;
  const hintId: string = useId();
  const [activeState, setActive] = useState<number | null>(null);

  const count: number = buckets.length;
  // A stale index (the data shrank under the pointer) reads as nothing active.
  const active: number | null =
    activeState !== null && activeState < count ? activeState : null;
  const sampleSize: number =
    total ?? buckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const noun = (n: number): string =>
    n === 1 ? countNoun.singular : countNoun.plural;
  const describe = (bucket: HistogramBucket): string => {
    if (describeBucket) return describeBucket(bucket);
    if (bucket.upper === null) return `${formatBoundary(bucket.lower)} or more`;
    return `${formatBoundary(bucket.lower)} – ${formatBoundary(bucket.upper)}`;
  };

  const maxCount: number = Math.max(0, ...buckets.map((bucket) => bucket.count));
  const axis = niceAxis(maxCount, 4, 1);
  const marginLeft: number =
    Math.ceil(
      Math.max(...axis.ticks.map((tick) => formatCount(tick).length)) *
        TICK_CHAR_WIDTH,
    ) + 12;

  const plotX0: number = marginLeft;
  const plotX1: number = Math.max(plotX0 + 1, (W ?? 0) - MARGIN.right);
  const plotY0: number = MARGIN.top;
  const plotY1: number = Math.max(plotY0 + 1, H - MARGIN.bottom);
  const plotW: number = plotX1 - plotX0;
  const slot: number = count > 0 ? plotW / count : 0;
  const projectY = (value: number): number =>
    plotY1 - (Math.max(0, value) / axis.top) * (plotY1 - plotY0);

  // Tallest bucket, labelled directly.
  const modeIndex: number = buckets.findIndex(
    (bucket) => bucket.count === maxCount && maxCount > 0,
  );

  // Edge labels: the lower edge of every bucket plus the closing upper edge
  // (the overflow bucket has none), thinned to ~52px apart.
  const boundaries: { x: number; value: number }[] = buckets.map(
    (bucket, index) => ({ x: plotX0 + index * slot, value: bucket.lower }),
  );
  const lastBucket: HistogramBucket | undefined = buckets[count - 1];
  if (lastBucket && lastBucket.upper !== null) {
    boundaries.push({ x: plotX0 + count * slot, value: lastBucket.upper });
  }
  const maxLabels: number = Math.max(2, Math.floor(plotW / X_LABEL_SPACING));
  const labelledBoundaries = thinIndices(boundaries.length, maxLabels).map(
    (index: number) => boundaries[index]!,
  );

  const overflow: HistogramBucket | undefined =
    lastBucket && lastBucket.upper === null ? lastBucket : undefined;
  const barPaint: ChartPaint = { colorId: color };
  const overflowPaint: ChartPaint = { colorId: overflowColor };

  const barGap: number = slot > BAR_GAP * 2 ? BAR_GAP : 0;
  const readoutEnabled: boolean = showTooltip && count > 0;
  const activeBucket: HistogramBucket | undefined =
    active === null ? undefined : buckets[active];

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>): void => {
    if (!readoutEnabled) return;
    const last: number = count - 1;
    let next: number | null = active;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      next = active === null ? 0 : Math.min(last, active + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      next = active === null ? last : Math.max(0, active - 1);
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = last;
    } else if (event.key === "Escape") {
      next = null;
    } else {
      return;
    }
    event.preventDefault();
    setActive(next);
  };

  const onBlur = (event: FocusEvent<SVGSVGElement>): void => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setActive(null);
    }
  };

  const plot: ReactElement | null =
    W === null ? null : (
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={label}
        aria-describedby={readoutEnabled ? hintId : undefined}
        tabIndex={readoutEnabled ? 0 : undefined}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onPointerLeave={(): void => setActive(null)}
        className="block overflow-visible rounded-sm text-[11px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {count > 0 ? (
          <g
            aria-hidden="true"
            data-slot="histogram-count-axis"
            className="pointer-events-none select-none"
          >
            {axis.ticks.map((tick) => (
              <g key={`tick-${tick}`}>
                {tick > 0 ? (
                  <line
                    x1={plotX0}
                    x2={plotX1}
                    y1={projectY(tick)}
                    y2={projectY(tick)}
                    strokeWidth={1}
                    className="stroke-border"
                  />
                ) : null}
                <text
                  x={plotX0 - 6}
                  y={projectY(tick)}
                  textAnchor="end"
                  dominantBaseline="central"
                  className="fill-muted-foreground tabular-nums"
                >
                  {formatCount(tick)}
                </text>
              </g>
            ))}
          </g>
        ) : null}

        <g data-slot="histogram-bars" className="pointer-events-none">
          {buckets.map((bucket, index) => {
            const top: number = projectY(bucket.count);
            const paint: ChartPaint =
              bucket.upper === null ? overflowPaint : barPaint;
            const dimmed: boolean = active !== null && active !== index;
            return (
              <path
                key={`${bucket.lower}-${bucket.upper}`}
                d={roundedBarPath(
                  plotX0 + index * slot + barGap / 2,
                  top,
                  Math.max(0, slot - barGap),
                  plotY1 - top,
                  4,
                )}
                data-slot="histogram-bar"
                data-overflow={bucket.upper === null ? "true" : undefined}
                className={cn(
                  "transition-opacity",
                  chartPaintClass(paint, "fill"),
                  dimmed && "opacity-40",
                )}
              />
            );
          })}
        </g>

        {modeIndex >= 0 ? (
          <text
            aria-hidden="true"
            // The first column's label starts at the bar instead of running
            // into the count-axis labels.
            x={
              modeIndex === 0
                ? plotX0 + barGap / 2
                : plotX0 + (modeIndex + 0.5) * slot
            }
            y={projectY(maxCount) - 5}
            textAnchor={modeIndex === 0 ? "start" : "middle"}
            className="pointer-events-none select-none fill-foreground font-medium tabular-nums"
          >
            {formatCount(maxCount)}
          </text>
        ) : null}

        <line
          aria-hidden="true"
          x1={plotX0}
          x2={plotX1}
          y1={plotY1}
          y2={plotY1}
          strokeWidth={1}
          className="stroke-muted-foreground/50"
        />
        <g
          aria-hidden="true"
          data-slot="histogram-edge-labels"
          className="pointer-events-none select-none"
        >
          {labelledBoundaries.map(({ x, value }) => (
            <text
              key={`edge-${x}-${value}`}
              x={x}
              y={plotY1 + 15}
              textAnchor="middle"
              className="fill-muted-foreground tabular-nums"
            >
              {formatBoundary(value)}
            </text>
          ))}
        </g>

        {/* Hover targets: the whole column, not just the painted bar. */}
        {readoutEnabled
          ? buckets.map((bucket, index) => (
              <rect
                key={`hit-${bucket.lower}-${bucket.upper}`}
                aria-hidden="true"
                x={plotX0 + index * slot}
                y={plotY0}
                width={Math.max(0, slot)}
                height={plotY1 - plotY0}
                fill="transparent"
                onPointerEnter={(): void => setActive(index)}
              />
            ))
          : null}

        {count === 0 ? (
          <text
            x={W / 2}
            y={H / 2}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground text-sm"
          >
            {emptyMessage}
          </text>
        ) : null}
      </svg>
    );

  const caption: ReactNode =
    overflow && overflowCaption !== false
      ? (overflowCaption ??
        `The last bar gathers the ${formatCount(overflow.count)} largest ${noun(overflow.count)} (${describe(overflow)}).`)
      : null;

  return (
    <div
      ref={chart.ref}
      data-slot="histogram"
      aria-busy={loading || undefined}
      className={cn(
        "relative flex flex-col gap-1 transition-opacity",
        chart.rootClassName,
        loading && "opacity-60",
        className,
      )}
      style={{ ...chart.rootStyle, ...style }}
      {...props}
    >
      <div
        data-slot="histogram-plot"
        className="relative w-full shrink-0"
        style={{ height: H }}
      >
        {plot}
        {readoutEnabled && W !== null ? (
          <span id={hintId} hidden>
            Use the arrow keys to read each bucket.
          </span>
        ) : null}
        {showTooltip && activeBucket && active !== null && W !== null ? (
          <ChartTooltip
            x={plotX0 + (active + 0.5) * slot}
            y={projectY(activeBucket.count)}
            containerWidth={W}
          >
            <ChartTooltipRow
              value={`${formatCount(activeBucket.count)} ${noun(activeBucket.count)}`}
              label={
                sampleSize > 0
                  ? SHARE_FORMAT.format(activeBucket.count / sampleSize)
                  : undefined
              }
            />
            <div className="mt-0.5 text-muted-foreground tabular-nums">
              {describe(activeBucket)}
            </div>
          </ChartTooltip>
        ) : null}
      </div>

      {caption !== null && W !== null ? (
        <p
          data-slot="histogram-overflow-caption"
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <span
            aria-hidden="true"
            className={cn(
              "inline-block size-2.5 shrink-0 rounded-[3px]",
              chartPaintClass(overflowPaint, "bg"),
            )}
            style={chartPaintSwatchStyle(overflowPaint)}
          />
          <span>{caption}</span>
        </p>
      ) : null}

      {W !== null && count > 0 ? (
        <ChartDataTable
          caption={label}
          columns={["Range", "Count", "Share"]}
          rows={buckets.map((bucket) => ({
            key: `${bucket.lower}-${bucket.upper}`,
            cells: [
              describe(bucket),
              formatCount(bucket.count),
              sampleSize > 0 ? SHARE_FORMAT.format(bucket.count / sampleSize) : "",
            ],
          }))}
        />
      ) : null}
    </div>
  );
}
Histogram.displayName = "Histogram";

export { Histogram };
