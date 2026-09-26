"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { memo, useCallback, useId, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import {
  chartColorIds,
  chartPaintClass,
  createChartColorScale,
  getChartSeriesColorId,
  type ChartColorId,
  type ChartPaint,
} from "@/components/ui/chart-primitives/chart-colors";
import { ChartDataTable } from "@/components/ui/chart-primitives/chart-data-table";
import { formatChartNumber } from "@/components/ui/chart-primitives/chart-format";
import { ChartLegend } from "@/components/ui/chart-primitives/chart-legend";
import {
  logDecadeTicks,
  niceTicksWithin,
  thinLabels,
} from "@/components/ui/chart-primitives/chart-scale";
import {
  ChartLiveRegion,
  ChartTooltip,
  ChartTooltipRow,
} from "@/components/ui/chart-primitives/chart-tooltip";
import {
  useChartWidth,
  type ChartWidth,
} from "@/components/ui/chart-primitives/use-chart-width";

export const scatterPlotSizeIds = [
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies string[];
export type ScatterPlotSizeId = (typeof scatterPlotSizeIds)[number];

/** Preset series colours; see `chartColorIds`. */
export const scatterPlotColorIds = chartColorIds;
export type ScatterPlotColorId = ChartColorId;

export const scatterPlotShapeIds = [
  "circle",
  "square",
  "triangle",
  "diamond",
] as const satisfies string[];
export type ScatterPlotShapeId = (typeof scatterPlotShapeIds)[number];

export const scatterPlotYScaleIds = ["linear", "log"] as const satisfies string[];
export type ScatterPlotYScaleId = (typeof scatterPlotYScaleIds)[number];

/** Default canvas dimensions per size. Either axis can be overridden via the
 * `width` / `height` props. */
const SIZE_TO_CANVAS: Record<
  ScatterPlotSizeId,
  { width: number; height: number }
> = {
  sm: { width: 240, height: 180 },
  md: { width: 360, height: 260 },
  lg: { width: 480, height: 340 },
  xl: { width: 640, height: 440 },
};

/** Tick-label font size per size preset, for thinning crowded labels. */
const SIZE_TO_FONT_PX: Record<ScatterPlotSizeId, number> = {
  sm: 10,
  md: 11,
  lg: 12,
  xl: 14,
};

/**
 * With every pair of series able to sit side by side, only the first three
 * palette slots stay distinguishable (colour-blind and full-colour alike),
 * so a fourth series and beyond is painted `"other"` unless it names a
 * colour. Shapes keep them apart.
 */
const MAX_COLORED_SERIES: number = 3;

/**
 * Shape rotation when a series doesn't specify its own, by colour slot.
 * Shapes rotate alongside colours so overlapping series stay distinguishable
 * without relying on color alone.
 */
const DEFAULT_SHAPE_ROTATION: ReadonlyArray<ScatterPlotShapeId> = [
  "circle",
  "triangle",
  "square",
  "diamond",
];

/** How close (px) the pointer must come to a point to read it out. */
const DEFAULT_HIT_RADIUS: number = 24;

/** Opacity of the points outside the hovered point's `group`. */
const FADED_OPACITY: number = 0.12;

export const scatterPlotVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      size: {
        sm: "text-[10px]",
        md: "text-[11px]",
        lg: "text-xs",
        xl: "text-sm",
      } satisfies Record<ScatterPlotSizeId, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface ScatterPlotPoint {
  /** X value in domain units. Non-finite values are skipped. */
  x: number;
  /** Y value in domain units. Non-finite values are skipped. */
  y: number;
  /**
   * Optional magnitude used to scale the marker (bubble chart mode). Values
   * are mapped through a square-root scale onto `sizeRange` so that marker
   * *area* -- not radius -- is proportional to the value. Ignored when the
   * chart has no `sizeRange`-eligible data.
   */
  size?: number;
  /** Human-readable label for the point (used in aria-labels and tooltips). */
  label?: string;
  /** Stable identifier for the point. Defaults to the index. */
  id?: string;
  /**
   * Optional group the point belongs to (e.g. an operation name). Hovering a
   * point fades every other group, so one group's spread stands out.
   */
  group?: string;
}

export interface ScatterPlotSeries {
  /** Stable identifier for the series. Used as React key and click payload. */
  id: string;
  /** Display name for the series. */
  label?: string;
  /** Points to plot. Order is irrelevant except for paint order. */
  points: ReadonlyArray<ScatterPlotPoint>;
  /**
   * Preset color. Defaults to the series' palette slot (its position in
   * `seriesOrder` when the chart has one, else in `series`); only the first
   * three series get a hue, later ones are `"other"`. Ignored if `color` is
   * provided.
   */
  colorId?: ScatterPlotColorId;
  /**
   * Override the marker color with a raw CSS color (e.g. `"#ff0080"` or
   * `"var(--chart-2)"`). Takes precedence over `colorId`.
   */
  color?: string;
  /** Marker shape. Defaults to a rotation based on the series' slot. */
  shape?: ScatterPlotShapeId;
  /** Override the chart-level `pointRadius` for this series. */
  pointRadius?: number;
  /** Override the chart-level `pointOpacity` for this series. */
  pointOpacity?: number;
  /** Render a least-squares trend line for this series. Defaults to `false`. */
  trendLine?: boolean;
  /** Extra classes applied to this series' markers. */
  className?: string;
  /** Fired when a point in this series is clicked or activated via keyboard. */
  onPointClick?: (
    point: ScatterPlotPoint,
    series: ScatterPlotSeries,
    event: MouseEvent<SVGPathElement> | KeyboardEvent<SVGPathElement>,
  ) => void;
}

export interface ScatterPlotValueLabelContext {
  series: ScatterPlotSeries;
  point: ScatterPlotPoint;
  index: number;
}

export interface ScatterPlotTooltipContext {
  series: ScatterPlotSeries;
  point: ScatterPlotPoint;
  /** `formatX(point.x)`. */
  formattedX: string;
  /** `formatY(point.y)`. */
  formattedY: string;
  paint: ChartPaint;
}

export interface ScatterPlotReferenceLine {
  /** Position of the line in domain units. */
  value: number;
  /** Optional label rendered next to the line. */
  label?: string;
  /** Extra classes applied to the line element. */
  className?: string;
}

export interface ScatterPlotProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof scatterPlotVariants> {
  /** Series to render, in order (later series are drawn on top). */
  series: ReadonlyArray<ScatterPlotSeries>;
  /** Accessible label describing what the chart represents. */
  label: string;
  /**
   * Canvas width in pixels (defaults are size-aware), or `"auto"` to fill the
   * container and redraw when it resizes. An `"auto"` chart renders an empty
   * placeholder at its height until it has been measured, so the server
   * render carries no pixel width and no tick labels.
   */
  width?: ChartWidth;
  /**
   * Override the rendered canvas height in pixels (defaults are size-aware).
   * A legend, when shown, sits above this box.
   */
  height?: number;
  /**
   * Every series id the chart can show, in colour-slot order. Pass the full,
   * unfiltered list and a series you filter out never repaints the others.
   */
  seriesOrder?: ReadonlyArray<string>;
  /** Lower bound of the x-axis. Defaults to the smallest x across series. */
  xMin?: number;
  /** Upper bound of the x-axis. Defaults to the largest x across series. */
  xMax?: number;
  /**
   * Lower bound of the y-axis. Defaults to the smallest y across series (on a
   * log scale, the decade below the smallest positive y).
   */
  yMin?: number;
  /**
   * Upper bound of the y-axis. Defaults to the largest y across series (on a
   * log scale, the decade above it).
   */
  yMax?: number;
  /**
   * `"log"` spreads values over orders of magnitude (latencies, sizes): the
   * y-axis ticks sit at whole decades, and zero or negative values are drawn
   * on the bottom decade. Defaults to `"linear"`.
   */
  yScale?: ScatterPlotYScaleId;
  /** Marker radius in pixels when points carry no `size`. Defaults to `4`. */
  pointRadius?: number;
  /**
   * Min/max marker radius in pixels for points that carry a `size`. Defaults
   * to `[4, 14]`.
   */
  sizeRange?: readonly [number, number];
  /** Marker fill opacity, useful for dense/overlapping data. Defaults to `0.8`. */
  pointOpacity?: number;
  /** Render the x/y axis lines. Defaults to `true`. */
  showAxis?: boolean;
  /**
   * Number of evenly-spaced horizontal gridlines drawn across the y-axis. `0`
   * disables them. Defaults to `0`. With y-axis labels shown, any non-zero
   * count draws a hairline at each tick instead (a log scale always has its
   * decade lines).
   */
  gridLineCount?: number;
  /**
   * Number of evenly-spaced vertical gridlines drawn across the x-axis. `0`
   * disables them. Defaults to `0`. With x-axis labels shown, any non-zero
   * count draws a hairline at each tick instead.
   */
  verticalGridLineCount?: number;
  /**
   * Format an x value for the x-axis ticks and the tooltip (e.g. an epoch
   * timestamp as a time). Giving it turns the x-axis tick labels on unless
   * `showXAxisLabels` is `false`; `xTickFormatter` wins for the ticks.
   */
  formatX?: (x: number) => string;
  /**
   * Format a y value for the y-axis ticks and the tooltip. Giving it turns
   * the y-axis tick labels on unless `showYAxisLabels` is `false`;
   * `yTickFormatter` wins for the ticks.
   */
  formatY?: (y: number) => string;
  /** Replace the hover / focus readout's content. */
  formatTooltip?: (context: ScatterPlotTooltipContext) => ReactNode;
  /** Show the nearest-point readout on hover and keyboard focus. Defaults to `true`. */
  showTooltip?: boolean;
  /**
   * How close, in pixels, the pointer must come to a point for it to be read
   * out; the pointer need not land on the dot. Defaults to `24`.
   */
  hitRadius?: number;
  /**
   * Show a legend above the plot. Defaults to `true` for two or more series.
   */
  showLegend?: boolean;
  /**
   * Format an x-axis tick label. Return `null` to skip the tick. When omitted,
   * ticks render only if `showXAxisLabels` is on (formatted with `formatX`).
   */
  xTickFormatter?: (x: number, index: number) => string | null;
  /**
   * About how many x-axis ticks to draw. Defaults to `5`. Ignored when
   * `xTickValues` is given. Labels that would overlap are dropped on a
   * narrow chart.
   */
  xTickCount?: number;
  /**
   * Exact x positions for the x-axis ticks (e.g. every whole hour of a time
   * axis). Values outside the x domain are skipped.
   */
  xTickValues?: ReadonlyArray<number>;
  /** Render x-axis tick labels. Defaults to on when `formatX` is given. */
  showXAxisLabels?: boolean;
  /**
   * Format a y-axis tick label. Return `null` to skip the tick. When omitted,
   * ticks render only if `showYAxisLabels` is on (formatted with `formatY`).
   */
  yTickFormatter?: (y: number, index: number) => string | null;
  /**
   * About how many y-axis ticks to draw. Defaults to `5`. A log scale ticks
   * every decade instead.
   */
  yTickCount?: number;
  /**
   * Place the x-axis and linear y-axis ticks on round values inside the
   * domain rather than evenly between its ends. Only the ticks move.
   * Defaults to on, except for an axis given an `xTickFormatter` /
   * `yTickFormatter`, which keeps evenly spaced ticks that include both
   * ends (as before). For a time axis, pass `xTickValues` on round times.
   */
  niceTicks?: boolean;
  /** Render y-axis tick labels. Defaults to on when `formatY` is given. */
  showYAxisLabels?: boolean;
  /**
   * Width in pixels reserved for y-axis tick labels (the left gutter).
   * Defaults to `36`. Only applied when y-axis labels are visible.
   */
  yTickLabelWidth?: number;
  /** Axis title rendered under the x-axis. */
  xAxisTitle?: string;
  /** Axis title rendered (rotated) alongside the y-axis. */
  yAxisTitle?: string;
  /** Vertical reference line(s) at fixed x positions, drawn above the points. */
  xReferenceLines?: ReadonlyArray<ScatterPlotReferenceLine>;
  /** Horizontal reference line(s) at fixed y positions, drawn above the points. */
  yReferenceLines?: ReadonlyArray<ScatterPlotReferenceLine>;
  /** Render a text label next to every point. Defaults to `false`. */
  showValueLabels?: boolean;
  /**
   * Customize the point-label text. Return `null` to skip a point. Defaults to
   * the point's `label`, falling back to `(x, y)`.
   */
  valueLabelFormatter?: (
    context: ScatterPlotValueLabelContext,
  ) => string | null;
  /**
   * Hold the current render at reduced opacity while new data loads, rather
   * than flashing a skeleton.
   */
  loading?: boolean;
  /**
   * Fallback handler invoked for any point that doesn't have its own
   * series-level `onPointClick`.
   */
  onPointClick?: (
    point: ScatterPlotPoint,
    series: ScatterPlotSeries,
    event: MouseEvent<SVGPathElement> | KeyboardEvent<SVGPathElement>,
  ) => void;
  /** Text rendered when no finite data points are supplied. */
  emptyMessage?: string;
  /** Optional content overlaid on top of the plot area. */
  children?: ReactNode;
  /** Extra classes for the overlay content wrapper. */
  overlayClassName?: string;
  /** Extra classes applied to every point-label `<text>` element. */
  valueLabelClassName?: string;
  /** Extra classes applied to every axis tick `<text>` element. */
  tickLabelClassName?: string;
  /** Extra classes applied to the axis / gridline `<line>` elements. */
  axisClassName?: string;
  /** Optional ref forwarded to the wrapper element. */
  ref?: Ref<HTMLDivElement>;
}

interface ResolvedPoint {
  point: ScatterPlotPoint;
  /** SVG coordinates. */
  x: number;
  y: number;
  /** Marker radius in pixels. */
  r: number;
  /** Index in the series' `points`. */
  index: number;
  /** Index in the chart's flat point list (the readout's key). */
  flatIndex: number;
  /** Index of the point's `group` among the chart's groups; -1 for none. */
  groupIndex: number;
}

interface ResolvedSeries {
  series: ScatterPlotSeries;
  points: ReadonlyArray<ResolvedPoint>;
  paint: ChartPaint;
  shape: ScatterPlotShapeId;
  opacity: number;
  trend: { x1: number; y1: number; x2: number; y2: number } | null;
}

interface FlatPoint {
  seriesIndex: number;
  rp: ResolvedPoint;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function round(value: number): string {
  return value.toFixed(2);
}

/**
 * Build the `d` attribute for a marker centered at (cx, cy). Every shape is
 * drawn as a path so markers share one element type (and therefore one set of
 * event handlers and focus semantics).
 */
function buildMarkerPath(
  shape: ScatterPlotShapeId,
  cx: number,
  cy: number,
  r: number,
): string {
  switch (shape) {
    case "square": {
      // Half-side chosen so the square's area approximates the circle's.
      const h: number = r * 0.886;
      return `M ${round(cx - h)} ${round(cy - h)} H ${round(cx + h)} V ${round(cy + h)} H ${round(cx - h)} Z`;
    }
    case "triangle": {
      // Equilateral triangle with circumradius scaled for equal visual weight.
      const R: number = r * 1.2;
      const points: string = [-90, 30, 150]
        .map((deg) => {
          const rad: number = (deg * Math.PI) / 180;
          return `${round(cx + R * Math.cos(rad))} ${round(cy + R * Math.sin(rad))}`;
        })
        .join(" L ");
      return `M ${points} Z`;
    }
    case "diamond": {
      const R: number = r * 1.25;
      return `M ${round(cx)} ${round(cy - R)} L ${round(cx + R)} ${round(cy)} L ${round(cx)} ${round(cy + R)} L ${round(cx - R)} ${round(cy)} Z`;
    }
    case "circle":
    default:
      return `M ${round(cx - r)} ${round(cy)} a ${round(r)} ${round(r)} 0 1 0 ${round(r * 2)} 0 a ${round(r)} ${round(r)} 0 1 0 ${round(-r * 2)} 0 Z`;
  }
}

/**
 * Ordinary least-squares fit over the supplied domain points. Returns `null`
 * when a line can't be determined (fewer than two points, or all x identical).
 */
function computeTrendLine(
  points: ReadonlyArray<{ x: number; y: number }>,
): { slope: number; intercept: number } | null {
  if (points.length < 2) return null;
  let sumX: number = 0;
  let sumY: number = 0;
  let sumXY: number = 0;
  let sumXX: number = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  }
  const n: number = points.length;
  const denominator: number = n * sumXX - sumX * sumX;
  if (denominator === 0) return null;
  const slope: number = (n * sumXY - sumX * sumY) / denominator;
  const intercept: number = (sumY - slope * sumX) / n;
  if (!Number.isFinite(slope) || !Number.isFinite(intercept)) return null;
  return { slope, intercept };
}

interface PointsLayerProps {
  resolved: ReadonlyArray<ResolvedSeries>;
  onPointClick: ScatterPlotProps["onPointClick"];
  onPointFocus: (flatIndex: number) => void;
  formatX: (x: number) => string;
  formatY: (y: number) => string;
  showValueLabels: boolean;
  valueLabelFormatter: ScatterPlotProps["valueLabelFormatter"];
  valueLabelClassName: string | undefined;
}

/**
 * The markers, trend lines and point labels: memoized, so a pointer move
 * re-renders only the readout, not thousands of points. (Group emphasis is
 * a scoped style rule for the same reason.)
 */
const PointsLayer = memo(function PointsLayer({
  resolved,
  onPointClick,
  onPointFocus,
  formatX,
  formatY,
  showValueLabels,
  valueLabelFormatter,
  valueLabelClassName,
}: PointsLayerProps): ReactElement {
  return (
    <g data-slot="scatter-plot-points">
      {resolved.map((rs) => {
        const handler = rs.series.onPointClick ?? onPointClick;
        const isInteractive: boolean = typeof handler === "function";
        const seriesName: string = rs.series.label ?? rs.series.id;
        return (
          <g
            key={rs.series.id}
            data-slot="scatter-plot-series"
            data-series-id={rs.series.id}
          >
            {rs.trend ? (
              <line
                aria-hidden="true"
                data-slot="scatter-plot-trend-line"
                x1={rs.trend.x1}
                y1={rs.trend.y1}
                x2={rs.trend.x2}
                y2={rs.trend.y2}
                stroke={rs.paint.value}
                strokeWidth={1.5}
                strokeDasharray="5 4"
                strokeLinecap="round"
                className={cn(
                  "pointer-events-none",
                  chartPaintClass(rs.paint, "stroke"),
                )}
              />
            ) : null}

            {rs.points.map((rp) => {
              const pointKey: string =
                rp.point.id ?? `${rs.series.id}-${rp.index}`;
              const ariaLabel: string = rp.point.label
                ? `${seriesName} – ${rp.point.label}: (${formatX(rp.point.x)}, ${formatY(rp.point.y)})`
                : `${seriesName}: (${formatX(rp.point.x)}, ${formatY(rp.point.y)})`;
              return (
                <path
                  key={pointKey}
                  d={buildMarkerPath(rs.shape, rp.x, rp.y, rp.r)}
                  fill={rs.paint.value}
                  fillOpacity={rs.opacity}
                  stroke="hsl(var(--background))"
                  strokeWidth={1}
                  data-point-index={rp.index}
                  data-group={rp.groupIndex >= 0 ? rp.groupIndex : undefined}
                  data-testid={`scatter-plot-point-${pointKey}`}
                  role={isInteractive ? "button" : undefined}
                  tabIndex={isInteractive ? 0 : undefined}
                  aria-label={isInteractive ? ariaLabel : undefined}
                  aria-hidden={isInteractive ? undefined : "true"}
                  onFocus={
                    isInteractive
                      ? (): void => onPointFocus(rp.flatIndex)
                      : undefined
                  }
                  onClick={
                    isInteractive
                      ? (event: MouseEvent<SVGPathElement>): void => {
                          handler!(rp.point, rs.series, event);
                        }
                      : undefined
                  }
                  onKeyDown={
                    isInteractive
                      ? (event: KeyboardEvent<SVGPathElement>): void => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handler!(rp.point, rs.series, event);
                          }
                        }
                      : undefined
                  }
                  className={cn(
                    "transition-opacity",
                    chartPaintClass(rs.paint, "fill"),
                    isInteractive &&
                      "cursor-pointer focus:outline-none",
                    rs.series.className,
                  )}
                />
              );
            })}

            {showValueLabels
              ? rs.points.map((rp) => {
                  const text: string | null = valueLabelFormatter
                    ? valueLabelFormatter({
                        series: rs.series,
                        point: rp.point,
                        index: rp.index,
                      })
                    : (rp.point.label ??
                      `(${formatX(rp.point.x)}, ${formatY(rp.point.y)})`);
                  if (text === null || text === "") return null;
                  const labelKey: string =
                    (rp.point.id ?? `${rs.series.id}-${rp.index}`) + "-val";
                  return (
                    <text
                      key={labelKey}
                      x={rp.x}
                      y={rp.y - rp.r - 4}
                      textAnchor="middle"
                      className={cn(
                        "pointer-events-none select-none fill-foreground font-medium",
                        valueLabelClassName,
                      )}
                    >
                      {text}
                    </text>
                  );
                })
              : null}
          </g>
        );
      })}
    </g>
  );
});

function ScatterPlot({
  series,
  label,
  size,
  width,
  height,
  seriesOrder,
  xMin,
  xMax,
  yMin,
  yMax,
  yScale = "linear",
  pointRadius = 4,
  sizeRange = [4, 14],
  pointOpacity = 0.8,
  showAxis = true,
  gridLineCount = 0,
  verticalGridLineCount = 0,
  formatX = formatChartNumber,
  formatY = formatChartNumber,
  formatTooltip,
  showTooltip = true,
  hitRadius = DEFAULT_HIT_RADIUS,
  showLegend,
  xTickFormatter,
  xTickCount = 5,
  xTickValues,
  showXAxisLabels,
  yTickFormatter,
  yTickCount = 5,
  niceTicks,
  showYAxisLabels,
  yTickLabelWidth = 36,
  xAxisTitle,
  yAxisTitle,
  xReferenceLines,
  yReferenceLines,
  showValueLabels = false,
  valueLabelFormatter,
  loading = false,
  onPointClick,
  emptyMessage = "No data",
  children,
  className,
  style,
  overlayClassName,
  valueLabelClassName,
  tickLabelClassName,
  axisClassName,
  ref,
  ...props
}: ScatterPlotProps): ReactElement {
  const resolvedSize: ScatterPlotSizeId = size ?? "md";
  const canvas = SIZE_TO_CANVAS[resolvedSize];
  const chart = useChartWidth<HTMLDivElement>(width, canvas.width, ref);
  const W: number | null = chart.width;
  const H: number = height ?? canvas.height;

  const hintId: string = useId();
  const svgId: string = useId();
  /** Index into the flat point list of the point being read out. */
  const [active, setActive] = useState<number | null>(null);
  /** Whether the point was reached with the arrow keys (so it is announced). */
  const [announce, setAnnounce] = useState<boolean>(false);

  const hasXAxisLabels: boolean =
    typeof xTickFormatter === "function" ||
    (showXAxisLabels ?? formatX !== formatChartNumber);
  const hasYAxisLabels: boolean =
    typeof yTickFormatter === "function" ||
    (showYAxisLabels ?? formatY !== formatChartNumber);
  const isLog: boolean = yScale === "log";
  const [minRadius, maxRadius] = sizeRange;

  const layout = useMemo(() => {
    const drawWidth: number = W ?? 0;

    // Reserve gutters for axis labels / titles.
    const padTop: number = showValueLabels ? 16 : 8;
    const padBottom: number =
      (hasXAxisLabels ? 20 : 8) + (xAxisTitle ? 16 : 0);
    const padLeft: number =
      (hasYAxisLabels ? Math.max(8, yTickLabelWidth) : 8) +
      (yAxisTitle ? 16 : 0);
    const padRight: number = 10;

    const plotX0: number = padLeft;
    const plotY0: number = padTop;
    const plotW: number = Math.max(0, drawWidth - padLeft - padRight);
    const plotH: number = Math.max(0, H - padTop - padBottom);

    // Determine the domain across all series, ignoring non-finite coordinates.
    let domainXMin: number = Number.POSITIVE_INFINITY;
    let domainXMax: number = Number.NEGATIVE_INFINITY;
    let domainYMin: number = Number.POSITIVE_INFINITY;
    let domainYMax: number = Number.NEGATIVE_INFINITY;
    let smallestPositiveY: number = Number.POSITIVE_INFINITY;
    let domainSizeMin: number = Number.POSITIVE_INFINITY;
    let domainSizeMax: number = Number.NEGATIVE_INFINITY;
    let totalFinitePoints: number = 0;

    for (const s of series) {
      for (const p of s.points) {
        if (!isFiniteNumber(p.x) || !isFiniteNumber(p.y)) continue;
        totalFinitePoints += 1;
        if (p.x < domainXMin) domainXMin = p.x;
        if (p.x > domainXMax) domainXMax = p.x;
        if (p.y < domainYMin) domainYMin = p.y;
        if (p.y > domainYMax) domainYMax = p.y;
        if (p.y > 0 && p.y < smallestPositiveY) smallestPositiveY = p.y;
        if (isFiniteNumber(p.size)) {
          if (p.size < domainSizeMin) domainSizeMin = p.size;
          if (p.size > domainSizeMax) domainSizeMax = p.size;
        }
      }
    }

    const hasData: boolean = totalFinitePoints > 0;
    const hasSizedPoints: boolean =
      Number.isFinite(domainSizeMin) && Number.isFinite(domainSizeMax);

    const effectiveXMin: number = isFiniteNumber(xMin)
      ? xMin
      : hasData
        ? domainXMin
        : 0;
    const effectiveXMax: number = isFiniteNumber(xMax)
      ? xMax
      : hasData
        ? domainXMax
        : 1;
    const xSpan: number =
      effectiveXMax > effectiveXMin ? effectiveXMax - effectiveXMin : 1;

    // Y domain: linear from the data (or the pinned bounds); log snapped out
    // to whole decades, the bottom one holding the smallest positive value.
    const logTicks: number[] = isLog
      ? logDecadeTicks(
          isFiniteNumber(yMin) && yMin > 0
            ? yMin
            : Number.isFinite(smallestPositiveY)
              ? smallestPositiveY
              : 1,
          isFiniteNumber(yMax) && yMax > 0
            ? yMax
            : hasData && domainYMax > 0
              ? domainYMax
              : 10,
        )
      : [];
    const effectiveYMin: number = isLog
      ? isFiniteNumber(yMin) && yMin > 0
        ? yMin
        : logTicks[0]!
      : isFiniteNumber(yMin)
        ? yMin
        : hasData
          ? domainYMin
          : 0;
    const effectiveYMax: number = isLog
      ? isFiniteNumber(yMax) && yMax > 0
        ? yMax
        : logTicks[logTicks.length - 1]!
      : isFiniteNumber(yMax)
        ? yMax
        : hasData
          ? domainYMax
          : 1;

    // Inset the data area so markers sitting on the domain edges aren't clipped.
    const markerPad: number = hasSizedPoints
      ? Math.max(minRadius, maxRadius) + 2
      : pointRadius + 2;
    const innerW: number = Math.max(0, plotW - markerPad * 2);
    const innerH: number = Math.max(0, plotH - markerPad * 2);

    const projectX = (x: number): number =>
      plotX0 + markerPad + ((x - effectiveXMin) / xSpan) * innerW;

    const yTransform = (y: number): number =>
      isLog ? Math.log10(Math.max(y, effectiveYMin)) : y;
    const yLow: number = yTransform(effectiveYMin);
    const yHigh: number = yTransform(effectiveYMax);
    const yTransformedSpan: number = yHigh > yLow ? yHigh - yLow : 1;
    const projectY = (y: number): number =>
      plotY0 +
      markerPad +
      innerH -
      ((yTransform(y) - yLow) / yTransformedSpan) * innerH;

    const sizeSpan: number = hasSizedPoints
      ? domainSizeMax - domainSizeMin
      : 0;

    const resolveRadius = (
      point: ScatterPlotPoint,
      seriesRadius: number,
    ): number => {
      if (!hasSizedPoints || !isFiniteNumber(point.size)) return seriesRadius;
      if (sizeSpan <= 0) return maxRadius;
      // Square-root scale: marker *area* tracks the value, not the radius.
      const t: number = (point.size - domainSizeMin) / sizeSpan;
      return minRadius + (maxRadius - minRadius) * Math.sqrt(t);
    };

    const slotOf: (id: string, index: number) => number = seriesOrder
      ? ((): ((id: string, index: number) => number) => {
          const order: Map<string, number> = new Map();
          for (const id of seriesOrder) {
            if (!order.has(id)) order.set(id, order.size);
          }
          return (id: string): number => order.get(id) ?? -1;
        })()
      : (_id: string, index: number): number => index;
    const colorScale: ((id: string) => ChartColorId) | null = seriesOrder
      ? createChartColorScale(seriesOrder, MAX_COLORED_SERIES)
      : null;

    const flat: FlatPoint[] = [];
    const groupIndexByName: Map<string, number> = new Map();
    const groupIndexOf = (group: string | undefined): number => {
      if (group === undefined) return -1;
      let index: number | undefined = groupIndexByName.get(group);
      if (index === undefined) {
        index = groupIndexByName.size;
        groupIndexByName.set(group, index);
      }
      return index;
    };
    const resolved: ReadonlyArray<ResolvedSeries> = series.map(
      (s, seriesIndex): ResolvedSeries => {
        const slot: number = slotOf(s.id, seriesIndex);
        const colorId: ChartColorId =
          s.colorId ??
          (colorScale
            ? colorScale(s.id)
            : getChartSeriesColorId(seriesIndex, MAX_COLORED_SERIES));
        const shape: ScatterPlotShapeId =
          s.shape ??
          DEFAULT_SHAPE_ROTATION[
            (slot >= 0 ? slot : seriesIndex) % DEFAULT_SHAPE_ROTATION.length
          ]!;
        const seriesRadius: number = s.pointRadius ?? pointRadius;
        const points: ResolvedPoint[] = [];
        s.points.forEach((p, index) => {
          if (!isFiniteNumber(p.x) || !isFiniteNumber(p.y)) return;
          const rp: ResolvedPoint = {
            point: p,
            x: projectX(p.x),
            y: projectY(p.y),
            r: resolveRadius(p, seriesRadius),
            index,
            flatIndex: flat.length,
            groupIndex: groupIndexOf(p.group),
          };
          points.push(rp);
          flat.push({ seriesIndex, rp });
        });

        // On a log scale the fit is made on log10(y), so it is the straight
        // line the reader sees; values at or below the floor sit on it.
        const fit = s.trendLine
          ? computeTrendLine(
              points.map((rp) => ({
                x: rp.point.x,
                y: isLog
                  ? Math.log10(Math.max(rp.point.y, effectiveYMin))
                  : rp.point.y,
              })),
            )
          : null;
        const fitY = (x: number): number => {
          const y: number = fit!.slope * x + fit!.intercept;
          return isLog ? 10 ** y : y;
        };
        return {
          series: s,
          points,
          paint: { colorId, value: s.color },
          shape,
          opacity: s.pointOpacity ?? pointOpacity,
          trend: fit
            ? {
                x1: projectX(effectiveXMin),
                y1: projectY(fitY(effectiveXMin)),
                x2: projectX(effectiveXMax),
                y2: projectY(fitY(effectiveXMax)),
              }
            : null,
        };
      },
    );

    // Keyboard order: left to right, then bottom to top.
    const byX: number[] = flat
      .map((_, index: number): number => index)
      .sort(
        (a: number, b: number): number =>
          flat[a]!.rp.x - flat[b]!.rp.x || flat[b]!.rp.y - flat[a]!.rp.y,
      );


    return {
      plotX0,
      plotY0,
      plotW,
      plotH,
      hasData,
      effectiveXMin,
      effectiveXMax,
      effectiveYMin,
      effectiveYMax,
      xSpan,
      projectX,
      projectY,
      logTicks,
      resolved,
      flat,
      byX,
      groupCount: groupIndexByName.size,
    };
  }, [
    W,
    H,
    series,
    seriesOrder,
    xMin,
    xMax,
    yMin,
    yMax,
    isLog,
    pointRadius,
    minRadius,
    maxRadius,
    pointOpacity,
    showValueLabels,
    hasXAxisLabels,
    hasYAxisLabels,
    xAxisTitle,
    yAxisTitle,
    yTickLabelWidth,
  ]);

  const {
    plotX0,
    plotY0,
    plotW,
    plotH,
    hasData,
    effectiveXMin,
    effectiveYMin,
    effectiveYMax,
    xSpan,
    projectX,
    projectY,
    logTicks,
    resolved,
    flat,
    byX,
  } = layout;

  const niceXTicks: boolean = niceTicks ?? typeof xTickFormatter !== "function";
  const niceYTicks: boolean = niceTicks ?? typeof yTickFormatter !== "function";

  const xTicks: ReadonlyArray<{ x: number; text: string }> = (() => {
    if (!hasXAxisLabels || !hasData) return [];
    const count: number = Math.max(2, xTickCount);
    const values: ReadonlyArray<number> = xTickValues
      ? xTickValues.filter(
          (value) => value >= effectiveXMin && value <= layout.effectiveXMax,
        )
      : niceXTicks
        ? niceTicksWithin(effectiveXMin, layout.effectiveXMax, count - 1)
        : Array.from(
            { length: count },
            (_, i: number): number =>
              effectiveXMin + (i / (count - 1)) * xSpan,
          );
    const ticks: { x: number; text: string }[] = [];
    values.forEach((value: number, i: number): void => {
      const text: string | null | undefined =
        typeof xTickFormatter === "function"
          ? xTickFormatter(value, i)
          : formatX(value);
      if (typeof text !== "string" || text === "") return;
      ticks.push({ x: projectX(value), text });
    });
    return thinLabels(ticks, SIZE_TO_FONT_PX[resolvedSize]);
  })();

  const yTicks: ReadonlyArray<{ y: number; text: string }> = (() => {
    if (!hasYAxisLabels || !hasData) return [];
    // Log: every decade, top-down. Linear: evenly spaced, endpoints included.
    const values: number[] = isLog
      ? logTicks
          .filter((v) => v >= effectiveYMin && v <= effectiveYMax)
          .reverse()
      : niceYTicks
        ? // Top-down, so a custom formatter sees the largest value first.
          niceTicksWithin(
            effectiveYMin,
            effectiveYMax,
            Math.max(2, yTickCount) - 1,
          ).reverse()
        : Array.from({ length: Math.max(2, yTickCount) }, (_, i: number) => {
            const count: number = Math.max(2, yTickCount);
            return (
              effectiveYMax -
              (i / (count - 1)) * (effectiveYMax - effectiveYMin || 1)
            );
          });
    const ticks: { y: number; text: string }[] = [];
    values.forEach((value: number, i: number): void => {
      const text: string | null | undefined =
        typeof yTickFormatter === "function"
          ? yTickFormatter(value, i)
          : formatY(value);
      if (typeof text !== "string" || text === "") return;
      ticks.push({ y: projectY(value), text });
    });
    return ticks;
  })();

  // Gridlines (pixel positions) follow the tick labels when they are shown,
  // so every line has its value; otherwise they split the plot evenly.
  const evenFractions = (count: number): number[] =>
    Array.from({ length: Math.max(0, count) }, (_, i: number) => (i + 1) / (count + 1));
  const horizontalGridLines: ReadonlyArray<number> =
    gridLineCount <= 0 || isLog
      ? []
      : yTicks.length > 0
        ? yTicks
            .map((tick) => tick.y)
            .filter((y) => y > plotY0 + 0.5 && y < plotY0 + plotH - 0.5)
        : evenFractions(gridLineCount).map((t) => plotY0 + plotH - t * plotH);
  const verticalGridLines: ReadonlyArray<number> =
    verticalGridLineCount <= 0
      ? []
      : xTicks.length > 0
        ? xTicks
            .map((tick) => tick.x)
            .filter((x) => x > plotX0 + 0.5 && x < plotX0 + plotW - 0.5)
        : evenFractions(verticalGridLineCount).map((t) => plotX0 + t * plotW);

  const readoutEnabled: boolean = showTooltip && hasData;
  const activePoint: FlatPoint | undefined =
    active === null ? undefined : flat[active];
  const activeSeries: ResolvedSeries | undefined = activePoint
    ? resolved[activePoint.seriesIndex]
    : undefined;
  const emphasizedGroup: number | null =
    activePoint && layout.groupCount > 1 && activePoint.rp.groupIndex >= 0
      ? activePoint.rp.groupIndex
      : null;

  const hasInteractivePoints: boolean = series.some(
    (s) => typeof (s.onPointClick ?? onPointClick) === "function",
  );
  const legendVisible: boolean = showLegend ?? series.length > 1;

  const onPointerMove = (event: PointerEvent<SVGSVGElement>): void => {
    if (!readoutEnabled || W === null) return;
    const bounds: DOMRect = event.currentTarget.getBoundingClientRect();
    const scale: number = bounds.width > 0 ? W / bounds.width : 1;
    const px: number = (event.clientX - bounds.left) * scale;
    const py: number = (event.clientY - bounds.top) * scale;
    // A linear scan is fast enough for a few thousand points.
    let nearest: number | null = null;
    let nearestDistance: number = hitRadius * hitRadius;
    for (let index = 0; index < flat.length; index += 1) {
      const rp: ResolvedPoint = flat[index]!.rp;
      const distance: number = (rp.x - px) ** 2 + (rp.y - py) ** 2;
      if (distance <= nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    }
    if (nearest !== active) setActive(nearest);
    if (announce) setAnnounce(false);
  };

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>): void => {
    if (!readoutEnabled || event.target !== event.currentTarget) return;
    if (byX.length === 0) return;
    const position: number = active === null ? -1 : byX.indexOf(active);
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      next = Math.min(byX.length - 1, position + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      next = position < 0 ? byX.length - 1 : Math.max(0, position - 1);
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = byX.length - 1;
    } else if (event.key === "Escape") {
      event.preventDefault();
      setActive(null);
      return;
    } else {
      return;
    }
    event.preventDefault();
    setActive(byX[next]!);
    setAnnounce(true);
  };

  const onBlur = (event: FocusEvent<SVGSVGElement>): void => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setActive(null);
    }
  };

  // Stable, so the memoized points layer doesn't re-render on hover. The
  // focused point's own label is read out, so it isn't announced again.
  const onPointFocus = useCallback((flatIndex: number): void => {
    setActive(flatIndex);
    setAnnounce(false);
  }, []);

  const pointsLayer: ReactElement = (
    <PointsLayer
      resolved={resolved}
      onPointClick={onPointClick}
      onPointFocus={onPointFocus}
      formatX={formatX}
      formatY={formatY}
      showValueLabels={showValueLabels}
      valueLabelFormatter={valueLabelFormatter}
      valueLabelClassName={valueLabelClassName}
    />
  );

  // Thousands of rows: build the table view only when the data changes.
  const dataTable: ReactElement | null = useMemo(
    (): ReactElement | null =>
      hasData ? (
        <ChartDataTable
          caption={label}
          columns={[
            "Series",
            xAxisTitle ?? "x",
            yAxisTitle ?? "y",
            "Label",
          ]}
          rows={resolved.flatMap((rs) =>
            rs.points.map((rp) => ({
              key: `${rs.series.id}-${rp.point.id ?? rp.index}`,
              cells: [
                rs.series.label ?? rs.series.id,
                formatX(rp.point.x),
                formatY(rp.point.y),
                rp.point.label ?? rp.point.group ?? "",
              ],
            })),
          )}
        />
      ) : null,
    [hasData, label, resolved, formatX, formatY, xAxisTitle, yAxisTitle],
  );

  const plot: ReactElement | null =
    W === null ? null : (
      <svg
        id={svgId}
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role={hasInteractivePoints ? "group" : "img"}
        aria-label={label}
        aria-describedby={readoutEnabled ? hintId : undefined}
        tabIndex={readoutEnabled ? 0 : undefined}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onPointerMove={onPointerMove}
        onPointerLeave={(): void => setActive(null)}
        className="block h-full w-full overflow-visible rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {horizontalGridLines.length > 0 || verticalGridLines.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="scatter-plot-gridlines"
            className="pointer-events-none"
          >
            {horizontalGridLines.map((y) => {
              return (
                <line
                  key={`h-grid-${y}`}
                  x1={plotX0}
                  y1={y}
                  x2={plotX0 + plotW}
                  y2={y}
                  strokeWidth={1}
                  className={cn("stroke-border/60", axisClassName)}
                />
              );
            })}
            {verticalGridLines.map((x) => {
              return (
                <line
                  key={`v-grid-${x}`}
                  x1={x}
                  y1={plotY0}
                  x2={x}
                  y2={plotY0 + plotH}
                  strokeWidth={1}
                  className={cn("stroke-border/60", axisClassName)}
                />
              );
            })}
          </g>
        ) : null}

        {isLog && hasData && hasYAxisLabels ? (
          <g
            aria-hidden="true"
            data-slot="scatter-plot-decade-lines"
            className="pointer-events-none"
          >
            {yTicks.map((tick, index) => (
              <line
                key={`decade-${index}`}
                x1={plotX0}
                y1={tick.y}
                x2={plotX0 + plotW}
                y2={tick.y}
                strokeWidth={1}
                className={cn("stroke-border/60", axisClassName)}
              />
            ))}
          </g>
        ) : null}

        {showAxis ? (
          <g
            aria-hidden="true"
            data-slot="scatter-plot-axis"
            className="pointer-events-none"
          >
            <line
              x1={plotX0}
              y1={plotY0}
              x2={plotX0}
              y2={plotY0 + plotH}
              strokeWidth={1}
              className={cn("stroke-border", axisClassName)}
            />
            <line
              x1={plotX0}
              y1={plotY0 + plotH}
              x2={plotX0 + plotW}
              y2={plotY0 + plotH}
              strokeWidth={1}
              className={cn("stroke-border", axisClassName)}
            />
          </g>
        ) : null}

        {emphasizedGroup !== null && typeof CSS !== "undefined" ? (
          <style>
            {`#${CSS.escape(svgId)} [data-slot="scatter-plot-points"] path[data-group]:not([data-group="${emphasizedGroup}"]){fill-opacity:${FADED_OPACITY};stroke-opacity:${FADED_OPACITY}}`}
          </style>
        ) : null}

        {!hasData ? (
          <text
            x={W / 2}
            y={H / 2}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground"
          >
            {emptyMessage}
          </text>
        ) : (
          pointsLayer
        )}

        {/* Reference lines sit above the points, their labels on a halo in
            the surface colour so they stay legible over dense data. */}
        {hasData && xReferenceLines && xReferenceLines.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="scatter-plot-x-reference-lines"
            className="pointer-events-none select-none"
          >
            {xReferenceLines.map((line, index) => {
              const x: number = projectX(line.value);
              return (
                <g key={`x-ref-${index}-${line.value}`}>
                  <line
                    x1={x}
                    y1={plotY0}
                    x2={x}
                    y2={plotY0 + plotH}
                    strokeWidth={1}
                    strokeDasharray="4 3"
                    className={cn(
                      "stroke-muted-foreground/70",
                      line.className,
                    )}
                  />
                  {line.label ? (
                    <text
                      x={x + 4}
                      y={plotY0 + 8}
                      paintOrder="stroke"
                      stroke="hsl(var(--background))"
                      strokeWidth={3}
                      strokeLinejoin="round"
                      className="fill-muted-foreground"
                    >
                      {line.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </g>
        ) : null}

        {hasData && yReferenceLines && yReferenceLines.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="scatter-plot-y-reference-lines"
            className="pointer-events-none select-none"
          >
            {yReferenceLines.map((line, index) => {
              const y: number = projectY(line.value);
              return (
                <g key={`y-ref-${index}-${line.value}`}>
                  <line
                    x1={plotX0}
                    y1={y}
                    x2={plotX0 + plotW}
                    y2={y}
                    strokeWidth={1}
                    strokeDasharray="4 3"
                    className={cn(
                      "stroke-muted-foreground/70",
                      line.className,
                    )}
                  />
                  {line.label ? (
                    <text
                      x={plotX0 + plotW - 4}
                      y={y - 4}
                      textAnchor="end"
                      paintOrder="stroke"
                      stroke="hsl(var(--background))"
                      strokeWidth={3}
                      strokeLinejoin="round"
                      className="fill-muted-foreground"
                    >
                      {line.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </g>
        ) : null}

        {activePoint ? (
          <circle
            aria-hidden="true"
            data-slot="scatter-plot-active-point"
            cx={activePoint.rp.x}
            cy={activePoint.rp.y}
            r={activePoint.rp.r + 3}
            strokeWidth={2}
            className="pointer-events-none fill-none stroke-foreground"
          />
        ) : null}

        {xTicks.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="scatter-plot-x-ticks"
            className="pointer-events-none select-none"
          >
            {xTicks.map((tick, index) => (
              <g key={`xtick-${index}-${tick.text}`}>
                <line
                  x1={tick.x}
                  x2={tick.x}
                  y1={plotY0 + plotH}
                  y2={plotY0 + plotH + 3}
                  strokeWidth={1}
                  className={cn("stroke-border", axisClassName)}
                />
                <text
                  x={tick.x}
                  y={plotY0 + plotH + 14}
                  textAnchor="middle"
                  className={cn(
                    "fill-muted-foreground tabular-nums",
                    tickLabelClassName,
                  )}
                >
                  {tick.text}
                </text>
              </g>
            ))}
          </g>
        ) : null}

        {yTicks.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="scatter-plot-y-ticks"
            className="pointer-events-none select-none"
          >
            {yTicks.map((tick, index) => (
              <g key={`ytick-${index}-${tick.text}`}>
                <line
                  x1={plotX0 - 3}
                  x2={plotX0}
                  y1={tick.y}
                  y2={tick.y}
                  strokeWidth={1}
                  className={cn("stroke-border", axisClassName)}
                />
                <text
                  x={plotX0 - 6}
                  y={tick.y}
                  textAnchor="end"
                  dominantBaseline="central"
                  className={cn(
                    "fill-muted-foreground tabular-nums",
                    tickLabelClassName,
                  )}
                >
                  {tick.text}
                </text>
              </g>
            ))}
          </g>
        ) : null}

        {xAxisTitle ? (
          <text
            aria-hidden="true"
            data-slot="scatter-plot-x-axis-title"
            x={plotX0 + plotW / 2}
            y={H - 2}
            textAnchor="middle"
            className="pointer-events-none select-none fill-muted-foreground font-medium"
          >
            {xAxisTitle}
          </text>
        ) : null}

        {yAxisTitle ? (
          <text
            aria-hidden="true"
            data-slot="scatter-plot-y-axis-title"
            x={10}
            y={plotY0 + plotH / 2}
            textAnchor="middle"
            transform={`rotate(-90 10 ${plotY0 + plotH / 2})`}
            className="pointer-events-none select-none fill-muted-foreground font-medium"
          >
            {yAxisTitle}
          </text>
        ) : null}
      </svg>
    );

  const multiSeries: boolean = series.length > 1;

  return (
    <div
      ref={chart.ref}
      data-slot="scatter-plot"
      aria-busy={loading || undefined}
      className={cn(
        scatterPlotVariants({ size }),
        "flex-col items-stretch justify-start gap-2 transition-opacity",
        chart.rootClassName,
        loading && "opacity-60",
        className,
      )}
      style={{ ...chart.rootStyle, ...style }}
      {...props}
    >
      {legendVisible && series.length > 0 && W !== null ? (
        <ChartLegend
          items={resolved.map((rs) => ({
            id: rs.series.id,
            label: rs.series.label ?? rs.series.id,
            paint: rs.paint,
            swatch: rs.shape,
          }))}
        />
      ) : null}
      <div
        data-slot="scatter-plot-plot"
        className="relative w-full shrink-0"
        style={{ height: H }}
      >
        {plot}
        {readoutEnabled && W !== null ? (
          <>
            <span id={hintId} hidden>
              Use the arrow keys to read the points from left to right.
            </span>
            <ChartLiveRegion
              message={
                announce && activePoint && activeSeries
                  ? [
                      multiSeries
                        ? `${activeSeries.series.label ?? activeSeries.series.id}:`
                        : "",
                      formatY(activePoint.rp.point.y),
                      `at ${formatX(activePoint.rp.point.x)}`,
                      activePoint.rp.point.label ?? activePoint.rp.point.group ?? "",
                    ]
                      .filter(Boolean)
                      .join(" ")
                  : ""
              }
            />
          </>
        ) : null}
        {showTooltip && activePoint && activeSeries && W !== null ? (
          <ChartTooltip
            x={activePoint.rp.x}
            y={activePoint.rp.y - activePoint.rp.r}
            containerWidth={W}
          >
            {formatTooltip ? (
              formatTooltip({
                series: activeSeries.series,
                point: activePoint.rp.point,
                formattedX: formatX(activePoint.rp.point.x),
                formattedY: formatY(activePoint.rp.point.y),
                paint: activeSeries.paint,
              })
            ) : (
              <>
                <ChartTooltipRow
                  value={formatY(activePoint.rp.point.y)}
                  label={
                    multiSeries
                      ? (activeSeries.series.label ?? activeSeries.series.id)
                      : yAxisTitle
                  }
                  color={multiSeries ? activeSeries.paint.value : undefined}
                  colorClassName={
                    multiSeries
                      ? chartPaintClass(activeSeries.paint, "bg")
                      : undefined
                  }
                />
                <div className="text-muted-foreground">
                  {xAxisTitle ? `${xAxisTitle} ` : "at "}
                  <span className="tabular-nums">
                    {formatX(activePoint.rp.point.x)}
                  </span>
                </div>
                {activePoint.rp.point.label ? (
                  <div className="mt-0.5 whitespace-normal break-words font-medium">
                    {activePoint.rp.point.label}
                  </div>
                ) : null}
                {activePoint.rp.point.group !== undefined &&
                activePoint.rp.point.group !== activePoint.rp.point.label ? (
                  <div className="whitespace-normal break-words text-muted-foreground">
                    {activePoint.rp.point.group}
                  </div>
                ) : null}
              </>
            )}
          </ChartTooltip>
        ) : null}
        {children ? (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 flex items-center justify-center text-center",
              overlayClassName,
            )}
          >
            {children}
          </div>
        ) : null}
      </div>
      {W !== null ? dataTable : null}
    </div>
  );
}
ScatterPlot.displayName = "ScatterPlot";

export { ScatterPlot };
