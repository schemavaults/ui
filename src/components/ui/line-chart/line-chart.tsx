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
import { useId, useState } from "react";

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
  nearestSortedIndex,
  niceTicksWithin,
  thinLabels,
} from "@/components/ui/chart-primitives/chart-scale";
import {
  ChartTooltip,
  ChartTooltipRow,
} from "@/components/ui/chart-primitives/chart-tooltip";
import {
  useChartWidth,
  type ChartWidth,
} from "@/components/ui/chart-primitives/use-chart-width";

export const lineChartSizeIds = [
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies string[];
export type LineChartSizeId = (typeof lineChartSizeIds)[number];

/** Preset series colours; see `chartColorIds`. */
export const lineChartColorIds = chartColorIds;
export type LineChartColorId = ChartColorId;

export const lineChartCurveIds = ["linear", "smooth"] as const satisfies string[];
export type LineChartCurveId = (typeof lineChartCurveIds)[number];

/** Tick-label font size per size preset, for thinning crowded labels. */
const SIZE_TO_FONT_PX: Record<LineChartSizeId, number> = {
  sm: 10,
  md: 11,
  lg: 12,
  xl: 14,
};

/** Default canvas dimensions per size. Either axis can be overridden via the
 * `width` / `height` props. */
const SIZE_TO_CANVAS: Record<
  LineChartSizeId,
  { width: number; height: number }
> = {
  sm: { width: 240, height: 140 },
  md: { width: 360, height: 200 },
  lg: { width: 480, height: 260 },
  xl: { width: 640, height: 340 },
};

export const lineChartVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      size: {
        sm: "text-[10px]",
        md: "text-[11px]",
        lg: "text-xs",
        xl: "text-sm",
      } satisfies Record<LineChartSizeId, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface LineChartPoint {
  /**
   * Optional explicit x-coordinate in domain units. When omitted, the point's
   * index in the series is used (categorical mode).
   */
  x?: number;
  /**
   * Y value. Non-finite values (NaN / Infinity) create a gap in the line and
   * are not rendered as point markers.
   */
  y: number;
  /** Human-readable label for the point (used in aria-labels and tooltips). */
  label?: string;
  /** Stable identifier for the point. Defaults to the index. */
  id?: string;
}

export interface LineChartSeries {
  /** Stable identifier for the series. Used as React key and click payload. */
  id: string;
  /** Display name for the series. */
  label?: string;
  /** Points in plot order. */
  points: ReadonlyArray<LineChartPoint>;
  /**
   * Preset color. Defaults to the series' palette slot: its position in
   * `seriesOrder` when the chart has one, else in `series`. Ignored if
   * `stroke` is provided.
   */
  color?: LineChartColorId;
  /**
   * Override the stroke with a raw CSS color (e.g. `"#ff0080"` or
   * `"var(--chart-3)"`). Takes precedence over `color`.
   */
  stroke?: string;
  /** Fill the area between this series' line and the baseline. */
  area?: boolean;
  /** Override the chart-level `curve` for this series. */
  curve?: LineChartCurveId;
  /** Override the chart-level `showPoints` for this series. */
  showPoints?: boolean;
  /** Stroke dash pattern, e.g. `"4 3"`. Defaults to a solid line. */
  strokeDasharray?: string;
  /** Stroke width in user units. Defaults to 2. */
  strokeWidth?: number;
  /** Extra classes applied to this series' line path. */
  className?: string;
  /** Fired when a point in this series is clicked or activated via keyboard. */
  onPointClick?: (
    point: LineChartPoint,
    series: LineChartSeries,
    event:
      | MouseEvent<SVGCircleElement>
      | KeyboardEvent<SVGCircleElement>,
  ) => void;
}

export interface LineChartValueLabelContext {
  series: LineChartSeries;
  point: LineChartPoint;
  value: number;
  index: number;
}

export interface LineChartTooltipValue {
  series: LineChartSeries;
  /** The series' point at this x, if it has one. */
  point: LineChartPoint | undefined;
  /** `null` when the series has no finite value at this x. */
  value: number | null;
  /** `formatY(value)`, or `"—"` for no value. */
  formattedValue: string;
  paint: ChartPaint;
}

export interface LineChartTooltipContext {
  /** The x the crosshair snapped to, in domain units (the index in categorical mode). */
  x: number;
  /** The x as the tooltip heading shows it. */
  xLabel: string;
  /** One entry per series, in series order. */
  values: ReadonlyArray<LineChartTooltipValue>;
}

export interface LineChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof lineChartVariants> {
  /** Series to render, in order (later series are drawn on top). */
  series: ReadonlyArray<LineChartSeries>;
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
   * unfiltered list and a series you filter out of `series` never repaints
   * the others: colour follows the series, not its position. Ids missing
   * from the list are painted `"other"`.
   */
  seriesOrder?: ReadonlyArray<string>;
  /** Lower bound of the y-axis. Defaults to the smallest value across series. */
  yMin?: number;
  /** Upper bound of the y-axis. Defaults to the largest value across series. */
  yMax?: number;
  /** Lower bound of the x-axis (numeric mode). Defaults to the smallest x. */
  xMin?: number;
  /** Upper bound of the x-axis (numeric mode). Defaults to the largest x. */
  xMax?: number;
  /** Default interpolation for every series. Defaults to `"linear"`. */
  curve?: LineChartCurveId;
  /** Render point markers for every series. Defaults to `false`. */
  showPoints?: boolean;
  /** Render the baseline / left-axis lines. Defaults to `true`. */
  showAxis?: boolean;
  /**
   * Number of evenly-spaced horizontal gridlines drawn across the value axis.
   * `0` disables gridlines. Defaults to `0`. With y-axis labels shown, any
   * non-zero count draws a hairline at each tick instead.
   */
  gridLineCount?: number;
  /**
   * Optional x-axis tick labels indexed by point position. When the chart is
   * in categorical mode (no explicit `x` on points), labels are shown at each
   * index. Pass `null` for an entry to skip it.
   */
  categories?: ReadonlyArray<string | null>;
  /**
   * Format an x value for the x-axis ticks and the tooltip heading (e.g. a
   * timestamp as a time). Giving it turns the x-axis tick labels on unless
   * `showXAxisLabels` is `false`; `xTickFormatter` wins for the ticks.
   */
  formatX?: (x: number) => string;
  /**
   * Format a y value for the y-axis ticks and the tooltip. Giving it turns
   * the y-axis tick labels on unless `showYAxisLabels` is `false`;
   * `yTickFormatter` wins for the ticks. Defaults to a thousands-separated
   * number.
   */
  formatY?: (y: number) => string;
  /** Replace the crosshair readout's content. */
  formatTooltip?: (context: LineChartTooltipContext) => ReactNode;
  /**
   * Show the crosshair readout on hover and keyboard focus. Defaults to
   * `true`.
   */
  showTooltip?: boolean;
  /**
   * Show a legend above the plot. Defaults to `true` for two or more series
   * and `false` for one (its title already names it).
   */
  showLegend?: boolean;
  /**
   * Format an x-tick label from its numeric value. Used when explicit numeric
   * x-values are provided on points. Return `null` to skip the tick.
   */
  xTickFormatter?: (x: number, index: number) => string | null;
  /**
   * About how many x-axis ticks to render in numeric mode. Defaults to `5`.
   * Ignored when `xTickValues` is given. Labels that would overlap are
   * dropped on a narrow chart.
   */
  xTickCount?: number;
  /**
   * Exact x positions for the numeric x-axis ticks (e.g. every whole hour of
   * a time axis), formatted with `xTickFormatter` or `formatX`. Values
   * outside the x domain are skipped.
   */
  xTickValues?: ReadonlyArray<number>;
  /**
   * Render numeric x-axis tick labels (formatted with `formatX`). Defaults to
   * on when `formatX` or `xTickFormatter` is given.
   */
  showXAxisLabels?: boolean;
  /**
   * Format a y-axis tick label from its numeric value. When provided, tick
   * labels are rendered to the left of the y-axis and a left gutter is
   * reserved automatically. Return `null` to skip a tick.
   */
  yTickFormatter?: (y: number, index: number) => string | null;
  /**
   * About how many y-axis ticks to draw. Defaults to `5`. Has no effect
   * unless y-axis labels are shown.
   */
  yTickCount?: number;
  /**
   * Place the y-axis ticks (and numeric x-axis ticks) on round values inside
   * the domain (0, 100, 200 …) rather than evenly between its ends (13.7,
   * 27.4 …). Only the ticks move; the lines are drawn the same either way.
   * Defaults to `true`; `false` restores evenly spaced ticks that include
   * both ends.
   */
  niceTicks?: boolean;
  /**
   * Render y-axis tick labels (formatted with `formatY`). Defaults to on when
   * `formatY` or `yTickFormatter` is given.
   */
  showYAxisLabels?: boolean;
  /**
   * Width in pixels reserved for y-axis tick labels (the left gutter).
   * Defaults to `36`. Only applied when y-axis labels are visible.
   */
  yTickLabelWidth?: number;
  /** Render a value label above every point. Defaults to `false`. */
  showValueLabels?: boolean;
  /**
   * Customize the value-label text. Return `null` to skip a point. Defaults
   * to `formatY(value)`.
   */
  valueLabelFormatter?: (
    context: LineChartValueLabelContext,
  ) => string | null;
  /**
   * Hold the current render at reduced opacity while new data loads, rather
   * than flashing a skeleton.
   */
  loading?: boolean;
  /**
   * Fallback handler invoked for any point that doesn't have its own series-
   * level `onPointClick`. Receives the clicked point and its series.
   */
  onPointClick?: (
    point: LineChartPoint,
    series: LineChartSeries,
    event:
      | MouseEvent<SVGCircleElement>
      | KeyboardEvent<SVGCircleElement>,
  ) => void;
  /** Optional content overlaid on top of the plot area. */
  children?: ReactNode;
  /** Extra classes for the overlay content wrapper. */
  overlayClassName?: string;
  /** Extra classes applied to every value-label `<text>` element. */
  valueLabelClassName?: string;
  /** Extra classes applied to every x-axis tick `<text>` element. */
  categoryLabelClassName?: string;
  /** Extra classes applied to every y-axis tick `<text>` element. */
  yAxisLabelClassName?: string;
  /** Extra classes applied to the axis / gridline `<line>` elements. */
  axisClassName?: string;
  /** Optional ref forwarded to the wrapper element. */
  ref?: Ref<HTMLDivElement>;
}

interface ResolvedPoint {
  point: LineChartPoint;
  /** Domain coordinates. */
  domainX: number;
  domainY: number;
  /** SVG coordinates. */
  x: number;
  y: number;
  /** True when `point.y` was not a finite number. */
  isGap: boolean;
  index: number;
}

interface ResolvedSeries {
  series: LineChartSeries;
  points: ReadonlyArray<ResolvedPoint>;
  /** The first finite point at each domain x, for the crosshair. */
  byX: ReadonlyMap<number, ResolvedPoint>;
  paint: ChartPaint;
  curve: LineChartCurveId;
  showPoints: boolean;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function buildLinePath(points: ReadonlyArray<ResolvedPoint>): string {
  // Skip gaps by breaking the path into separate sub-paths.
  let d = "";
  let needMove = true;
  for (const p of points) {
    if (p.isGap) {
      needMove = true;
      continue;
    }
    if (needMove) {
      d += `${d ? " " : ""}M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      needMove = false;
    } else {
      d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    }
  }
  return d;
}

/**
 * Catmull-Rom-to-Bezier smoothing. Produces a path that passes through every
 * non-gap point with no overshoot beyond the data range.
 */
function buildSmoothPath(points: ReadonlyArray<ResolvedPoint>): string {
  // Smooth across contiguous runs of non-gap points.
  const segments: ResolvedPoint[][] = [];
  let current: ResolvedPoint[] = [];
  for (const p of points) {
    if (p.isGap) {
      if (current.length > 0) segments.push(current);
      current = [];
    } else {
      current.push(p);
    }
  }
  if (current.length > 0) segments.push(current);

  const tension = 0.5;

  let d = "";
  for (const seg of segments) {
    if (seg.length === 0) continue;
    if (seg.length === 1) {
      const p = seg[0]!;
      d += `${d ? " " : ""}M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      continue;
    }
    const first = seg[0]!;
    d += `${d ? " " : ""}M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
    for (let i = 0; i < seg.length - 1; i += 1) {
      const p0 = seg[i === 0 ? 0 : i - 1]!;
      const p1 = seg[i]!;
      const p2 = seg[i + 1]!;
      const p3 = seg[i + 2 < seg.length ? i + 2 : i + 1]!;
      const c1x = p1.x + ((p2.x - p0.x) / 6) * tension * 2;
      const c1y = p1.y + ((p2.y - p0.y) / 6) * tension * 2;
      const c2x = p2.x - ((p3.x - p1.x) / 6) * tension * 2;
      const c2y = p2.y - ((p3.y - p1.y) / 6) * tension * 2;
      d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }
  }
  return d;
}

function buildAreaPath(
  linePath: string,
  points: ReadonlyArray<ResolvedPoint>,
  baselineY: number,
): string {
  if (linePath === "") return "";
  // Close each sub-path of the line back down to the baseline.
  const segments: ResolvedPoint[][] = [];
  let current: ResolvedPoint[] = [];
  for (const p of points) {
    if (p.isGap) {
      if (current.length > 0) segments.push(current);
      current = [];
    } else {
      current.push(p);
    }
  }
  if (current.length > 0) segments.push(current);

  // Strategy: re-emit the line path per segment and close it. This keeps the
  // smoothing/segmentation logic in one place (the original line builder).
  let d = "";
  for (const seg of segments) {
    if (seg.length === 0) continue;
    const first = seg[0]!;
    const last = seg[seg.length - 1]!;
    // Sub-path of just this segment.
    const subPoints: ResolvedPoint[] = seg;
    const subLine = subPoints.length > 1
      ? buildLinePath(subPoints)
      : `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
    d += `${d ? " " : ""}${subLine} L ${last.x.toFixed(2)} ${baselineY.toFixed(2)} L ${first.x.toFixed(2)} ${baselineY.toFixed(2)} Z`;
  }
  return d;
}

function LineChart({
  series,
  label,
  size,
  width,
  height,
  seriesOrder,
  yMin,
  yMax,
  xMin,
  xMax,
  curve = "linear",
  showPoints = false,
  showAxis = true,
  gridLineCount = 0,
  categories,
  formatX,
  formatY = formatChartNumber,
  formatTooltip,
  showTooltip = true,
  showLegend,
  xTickFormatter,
  xTickCount = 5,
  xTickValues,
  showXAxisLabels,
  yTickFormatter,
  yTickCount = 5,
  niceTicks = true,
  showYAxisLabels,
  yTickLabelWidth = 36,
  showValueLabels = false,
  valueLabelFormatter,
  loading = false,
  onPointClick,
  children,
  className,
  style,
  overlayClassName,
  valueLabelClassName,
  categoryLabelClassName,
  yAxisLabelClassName,
  axisClassName,
  ref,
  ...props
}: LineChartProps): ReactElement {
  const resolvedSize: LineChartSizeId = size ?? "md";
  const canvas = SIZE_TO_CANVAS[resolvedSize];
  const chart = useChartWidth<HTMLDivElement>(width, canvas.width, ref);
  const W: number | null = chart.width;
  const H: number = height ?? canvas.height;

  const gradientIdPrefix: string = useId();
  const hintId: string = useId();
  /** Index into `xValues` the crosshair sits on. */
  const [active, setActive] = useState<number | null>(null);

  // Reserve gutters for axis labels.
  const hasCategoryLabels: boolean =
    (categories !== undefined && categories.length > 0) ||
    typeof xTickFormatter === "function" ||
    (showXAxisLabels ?? typeof formatX === "function");
  const hasYAxisLabels: boolean =
    typeof yTickFormatter === "function" ||
    (showYAxisLabels ?? formatY !== formatChartNumber);
  const categoryGutter: number = hasCategoryLabels ? 22 : 6;
  const valueGutter: number = showValueLabels ? 18 : 6;
  const padTop: number = valueGutter;
  const padBottom: number = categoryGutter;
  const padLeft: number = hasYAxisLabels ? Math.max(8, yTickLabelWidth) : 6;
  const padRight: number = 6;

  const plotX0: number = padLeft;
  const plotY0: number = padTop;
  const plotW: number = Math.max(0, (W ?? 0) - padLeft - padRight);
  const plotH: number = Math.max(0, H - padTop - padBottom);

  // Determine the domain across all series.
  let domainXMin: number = Number.POSITIVE_INFINITY;
  let domainXMax: number = Number.NEGATIVE_INFINITY;
  let domainYMin: number = Number.POSITIVE_INFINITY;
  let domainYMax: number = Number.NEGATIVE_INFINITY;
  let totalFinitePoints: number = 0;

  for (const s of series) {
    s.points.forEach((p, idx) => {
      const x: number = isFiniteNumber(p.x) ? p.x : idx;
      if (x < domainXMin) domainXMin = x;
      if (x > domainXMax) domainXMax = x;
      if (isFiniteNumber(p.y)) {
        if (p.y < domainYMin) domainYMin = p.y;
        if (p.y > domainYMax) domainYMax = p.y;
        totalFinitePoints += 1;
      }
    });
  }

  const hasData: boolean = totalFinitePoints > 0;

  const effectiveXMin: number = isFiniteNumber(xMin)
    ? xMin
    : hasData && Number.isFinite(domainXMin)
      ? domainXMin
      : 0;
  const effectiveXMax: number = isFiniteNumber(xMax)
    ? xMax
    : hasData && Number.isFinite(domainXMax)
      ? domainXMax
      : 1;
  const effectiveYMin: number = isFiniteNumber(yMin)
    ? yMin
    : hasData && Number.isFinite(domainYMin)
      ? domainYMin
      : 0;
  const effectiveYMax: number = isFiniteNumber(yMax)
    ? yMax
    : hasData && Number.isFinite(domainYMax)
      ? domainYMax
      : 1;

  const xSpan: number =
    effectiveXMax > effectiveXMin ? effectiveXMax - effectiveXMin : 1;
  const ySpan: number =
    effectiveYMax > effectiveYMin ? effectiveYMax - effectiveYMin : 1;

  const projectX = (x: number): number =>
    plotX0 + ((x - effectiveXMin) / xSpan) * plotW;
  const projectY = (y: number): number =>
    plotY0 + plotH - ((y - effectiveYMin) / ySpan) * plotH;

  const colorScale: ((id: string) => ChartColorId) | null = seriesOrder
    ? createChartColorScale(seriesOrder)
    : null;

  const resolved: ReadonlyArray<ResolvedSeries> = series.map(
    (s, seriesIndex): ResolvedSeries => {
      const colorId: ChartColorId =
        s.color ??
        (colorScale ? colorScale(s.id) : getChartSeriesColorId(seriesIndex));
      const seriesCurve: LineChartCurveId = s.curve ?? curve;
      const seriesShowPoints: boolean = s.showPoints ?? showPoints;
      const byX: Map<number, ResolvedPoint> = new Map();
      const points: ReadonlyArray<ResolvedPoint> = s.points.map((p, idx) => {
        const domainX: number = isFiniteNumber(p.x) ? p.x : idx;
        const domainY: number = isFiniteNumber(p.y) ? p.y : 0;
        const isGap: boolean = !isFiniteNumber(p.y);
        const rp: ResolvedPoint = {
          point: p,
          domainX,
          domainY,
          x: projectX(domainX),
          y: isGap ? projectY(effectiveYMin) : projectY(domainY),
          isGap,
          index: idx,
        };
        if (!isGap && !byX.has(domainX)) byX.set(domainX, rp);
        return rp;
      });
      return {
        series: s,
        points,
        byX,
        paint: { colorId, value: s.stroke },
        curve: seriesCurve,
        showPoints: seriesShowPoints,
      };
    },
  );

  // Every x at which some series has a value, ascending: the crosshair's stops.
  const xValues: ReadonlyArray<number> = Array.from(
    new Set(resolved.flatMap((rs) => Array.from(rs.byX.keys()))),
  )
    .filter((x) => x >= effectiveXMin && x <= effectiveXMax)
    .sort((a, b) => a - b);

  const baselineYClamped: number =
    effectiveYMin <= 0 && effectiveYMax >= 0
      ? projectY(0)
      : projectY(effectiveYMin);

  const gridLines: ReadonlyArray<number> = (() => {
    if (gridLineCount <= 0) return [];
    const lines: number[] = [];
    for (let i = 1; i <= gridLineCount; i += 1) {
      lines.push(i / (gridLineCount + 1));
    }
    return lines;
  })();

  const isCategorical: boolean = categories !== undefined && categories.length > 0;

  /** How the tooltip heading and the table name an x. */
  const describeX = (x: number): string => {
    if (isCategorical && Number.isInteger(x)) {
      const category: string | null | undefined = categories![x];
      if (category) return category;
    }
    if (formatX) return formatX(x);
    for (const rs of resolved) {
      const pointLabel: string | undefined = rs.byX.get(x)?.point.label;
      if (pointLabel) return pointLabel;
    }
    return formatChartNumber(x);
  };

  // X-axis tick set, thinned so labels never run together.
  const xTicks: ReadonlyArray<{ x: number; text: string }> = thinLabels((() => {
    if (isCategorical) {
      const ticks: { x: number; text: string }[] = [];
      categories!.forEach((text, idx) => {
        if (text === null) return;
        const domainX: number = idx;
        if (domainX < effectiveXMin || domainX > effectiveXMax) return;
        ticks.push({ x: projectX(domainX), text });
      });
      return ticks;
    }
    if (hasCategoryLabels && hasData && xTickValues) {
      const ticks: { x: number; text: string }[] = [];
      xTickValues.forEach((domainX, i) => {
        if (domainX < effectiveXMin || domainX > effectiveXMax) return;
        const text: string | null =
          typeof xTickFormatter === "function"
            ? xTickFormatter(domainX, i)
            : formatX
              ? formatX(domainX)
              : formatChartNumber(domainX);
        if (text === null || text === "") return;
        ticks.push({ x: projectX(domainX), text });
      });
      return ticks;
    }
    if (hasCategoryLabels && xTickCount > 0 && hasData) {
      const ticks: { x: number; text: string }[] = [];
      const count: number = Math.max(2, xTickCount);
      const values: number[] = niceTicks
        ? niceTicksWithin(effectiveXMin, effectiveXMax, count - 1)
        : Array.from(
            { length: count },
            (_, i: number): number => effectiveXMin + (i / (count - 1)) * xSpan,
          );
      values.forEach((domainX: number, i: number): void => {
        const text: string | null =
          typeof xTickFormatter === "function"
            ? xTickFormatter(domainX, i)
            : formatX
              ? formatX(domainX)
              : formatChartNumber(domainX);
        if (text === null || text === "") return;
        ticks.push({ x: projectX(domainX), text });
      });
      return ticks;
    }
    return [];
  })(), SIZE_TO_FONT_PX[resolvedSize]);

  // Y-axis tick set. Always includes both endpoints when active.
  const yTicks: ReadonlyArray<{ y: number; value: number; text: string }> = (() => {
    if (!hasYAxisLabels || !hasData) return [];
    const count: number = Math.max(2, yTickCount);
    // Top-down (the largest value first), so the first call to a custom
    // formatter receives the largest value -- the order most consumers
    // expect.
    const values: number[] = niceTicks
      ? niceTicksWithin(effectiveYMin, effectiveYMax, count - 1).reverse()
      : Array.from(
          { length: count },
          (_, i: number): number => effectiveYMax - (i / (count - 1)) * ySpan,
        );
    const ticks: { y: number; value: number; text: string }[] = [];
    values.forEach((value: number, i: number): void => {
      const text: string | null =
        typeof yTickFormatter === "function"
          ? yTickFormatter(value, i)
          : formatY(value);
      if (text === null || text === "") return;
      ticks.push({ y: projectY(value), value, text });
    });
    return ticks;
  })();

  // Gridlines follow the tick labels when they are shown, so every line has
  // its value; otherwise they split the plot evenly.
  const gridLineYs: ReadonlyArray<number> =
    gridLineCount <= 0
      ? []
      : yTicks.length > 0
        ? yTicks
            .map((tick) => tick.y)
            .filter((y) => y > plotY0 + 0.5 && y < plotY0 + plotH - 0.5)
        : gridLines.map((t) => plotY0 + plotH - t * plotH);

  const hasInteractivePoints: boolean = resolved.some(
    (rs) =>
      rs.showPoints &&
      typeof (rs.series.onPointClick ?? onPointClick) === "function",
  );
  const readoutEnabled: boolean = showTooltip && hasData && xValues.length > 0;
  const legendVisible: boolean = showLegend ?? series.length > 1;

  const activeX: number | undefined =
    active === null ? undefined : xValues[active];
  const activeValues: ReadonlyArray<LineChartTooltipValue> =
    activeX === undefined
      ? []
      : resolved.map((rs): LineChartTooltipValue => {
          const rp: ResolvedPoint | undefined = rs.byX.get(activeX);
          const value: number | null = rp ? rp.domainY : null;
          return {
            series: rs.series,
            point: rp?.point,
            value,
            formattedValue: value === null ? "—" : formatY(value),
            paint: rs.paint,
          };
        });

  const onPointerMove = (event: PointerEvent<SVGSVGElement>): void => {
    if (!readoutEnabled || W === null) return;
    const bounds: DOMRect = event.currentTarget.getBoundingClientRect();
    const scale: number = bounds.width > 0 ? W / bounds.width : 1;
    const px: number = (event.clientX - bounds.left) * scale;
    const domainX: number =
      plotW > 0 ? effectiveXMin + ((px - plotX0) / plotW) * xSpan : effectiveXMin;
    const nearest: number = nearestSortedIndex(xValues, domainX);
    setActive(nearest < 0 ? null : nearest);
  };

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>): void => {
    if (!readoutEnabled || event.target !== event.currentTarget) return;
    const last: number = xValues.length - 1;
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

  const activeDots: ReadonlyArray<{ rs: ResolvedSeries; rp: ResolvedPoint }> =
    activeX === undefined
      ? []
      : resolved.flatMap((rs) => {
          const rp: ResolvedPoint | undefined = rs.byX.get(activeX);
          return rp ? [{ rs, rp }] : [];
        });

  const plot: ReactElement | null =
    W === null ? null : (
      <svg
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
        {gridLineYs.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="line-chart-gridlines"
            className="pointer-events-none"
          >
            {gridLineYs.map((y) => {
              return (
                <line
                  key={`grid-${y}`}
                  x1={plotX0}
                  y1={y}
                  x2={plotX0 + plotW}
                  y2={y}
                  strokeWidth={1}
                  className={cn("stroke-border/60", axisClassName)}
                />
              );
            })}
          </g>
        ) : null}

        {showAxis ? (
          <g
            aria-hidden="true"
            data-slot="line-chart-axis"
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

        {!hasData ? (
          <text
            x={W / 2}
            y={H / 2}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground"
          >
            No data
          </text>
        ) : (
          resolved.map((rs, seriesIndex) => {
            const strokeWidth: number = rs.series.strokeWidth ?? 2;
            const linePath: string =
              rs.curve === "smooth"
                ? buildSmoothPath(rs.points)
                : buildLinePath(rs.points);
            const areaPath: string = rs.series.area
              ? buildAreaPath(linePath, rs.points, baselineYClamped)
              : "";
            const gradientId: string = `${gradientIdPrefix}-grad-${seriesIndex}`;
            const markerRadius: number = Math.max(4, strokeWidth + 2);

            return (
              <g
                key={rs.series.id}
                data-slot="line-chart-series"
                data-series-id={rs.series.id}
              >
                {rs.series.area && areaPath !== "" ? (
                  <>
                    <defs>
                      <linearGradient
                        id={gradientId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                        className={chartPaintClass(rs.paint, "text")}
                      >
                        <stop
                          offset="0%"
                          stopColor={rs.series.stroke ?? "currentColor"}
                          stopOpacity="0.16"
                        />
                        <stop
                          offset="100%"
                          stopColor={rs.series.stroke ?? "currentColor"}
                          stopOpacity="0.04"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d={areaPath}
                      fill={`url(#${gradientId})`}
                      stroke="none"
                      className="pointer-events-none"
                    />
                  </>
                ) : null}
                <path
                  d={linePath}
                  fill="none"
                  stroke={rs.series.stroke}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={rs.series.strokeDasharray}
                  className={cn(
                    "pointer-events-none",
                    chartPaintClass(rs.paint, "stroke"),
                    rs.series.className,
                  )}
                />

                {rs.showPoints
                  ? rs.points.map((rp) => {
                      if (rp.isGap) return null;
                      const handler =
                        rs.series.onPointClick ?? onPointClick;
                      const isInteractive: boolean =
                        typeof handler === "function";
                      const ariaLabel: string = `${rs.series.label ?? rs.series.id} at ${describeX(rp.domainX)}: ${formatY(rp.point.y)}`;
                      const pointKey: string =
                        rp.point.id ?? `${rs.series.id}-${rp.index}`;
                      const xIndex: number = xValues.indexOf(rp.domainX);
                      return (
                        <circle
                          key={pointKey}
                          cx={rp.x}
                          cy={rp.y}
                          r={markerRadius}
                          fill={rs.series.stroke}
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                          data-point-index={rp.index}
                          role={isInteractive ? "button" : undefined}
                          tabIndex={isInteractive ? 0 : undefined}
                          aria-label={isInteractive ? ariaLabel : undefined}
                          aria-hidden={isInteractive ? undefined : "true"}
                          onFocus={
                            isInteractive && readoutEnabled && xIndex >= 0
                              ? (): void => setActive(xIndex)
                              : undefined
                          }
                          onClick={
                            isInteractive
                              ? (
                                  event: MouseEvent<SVGCircleElement>,
                                ): void => {
                                  handler!(rp.point, rs.series, event);
                                }
                              : undefined
                          }
                          onKeyDown={
                            isInteractive
                              ? (
                                  event: KeyboardEvent<SVGCircleElement>,
                                ): void => {
                                  if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                  ) {
                                    event.preventDefault();
                                    handler!(rp.point, rs.series, event);
                                  }
                                }
                              : undefined
                          }
                          className={cn(
                            "transition-opacity",
                            chartPaintClass(rs.paint, "fill"),
                            isInteractive
                              ? "cursor-pointer hover:opacity-80 focus:outline-none focus-visible:opacity-80"
                              : "pointer-events-none",
                          )}
                        />
                      );
                    })
                  : null}

                {showValueLabels
                  ? rs.points.map((rp) => {
                      if (rp.isGap) return null;
                      const text: string | null = valueLabelFormatter
                        ? valueLabelFormatter({
                            series: rs.series,
                            point: rp.point,
                            value: rp.point.y,
                            index: rp.index,
                          })
                        : formatY(rp.point.y);
                      if (text === null || text === "") return null;
                      const labelKey: string =
                        (rp.point.id ?? `${rs.series.id}-${rp.index}`) +
                        "-val";
                      return (
                        <text
                          key={labelKey}
                          x={rp.x}
                          y={rp.y - 8}
                          textAnchor="middle"
                          className={cn(
                            "pointer-events-none select-none fill-foreground font-medium tabular-nums",
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
          })
        )}

        {xTicks.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="line-chart-x-ticks"
            className="pointer-events-none select-none"
          >
            {xTicks.map((tick, idx) => (
              <text
                key={`xtick-${idx}-${tick.text}`}
                x={tick.x}
                y={plotY0 + plotH + 14}
                textAnchor="middle"
                className={cn(
                  "fill-muted-foreground tabular-nums",
                  categoryLabelClassName,
                )}
              >
                {tick.text}
              </text>
            ))}
          </g>
        ) : null}

        {yTicks.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="line-chart-y-ticks"
            className="pointer-events-none select-none"
          >
            {yTicks.map((tick, idx) => (
              <g key={`ytick-${idx}-${tick.text}`}>
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
                    yAxisLabelClassName,
                  )}
                >
                  {tick.text}
                </text>
              </g>
            ))}
          </g>
        ) : null}

        {activeX !== undefined ? (
          <g
            aria-hidden="true"
            data-slot="line-chart-crosshair"
            className="pointer-events-none"
          >
            <line
              x1={projectX(activeX)}
              x2={projectX(activeX)}
              y1={plotY0}
              y2={plotY0 + plotH}
              strokeWidth={1}
              className="stroke-muted-foreground/60"
            />
            {activeDots.map(({ rs, rp }) => (
              <circle
                key={rs.series.id}
                cx={rp.x}
                cy={rp.y}
                r={4}
                fill={rs.series.stroke}
                stroke="hsl(var(--background))"
                strokeWidth={2}
                className={chartPaintClass(rs.paint, "fill")}
              />
            ))}
          </g>
        ) : null}
      </svg>
    );

  const tooltipY: number =
    activeDots.length > 0
      ? Math.min(...activeDots.map(({ rp }) => rp.y))
      : plotY0;

  return (
    <div
      ref={chart.ref}
      data-slot="line-chart"
      aria-busy={loading || undefined}
      className={cn(
        lineChartVariants({ size }),
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
            swatch: "line",
          }))}
        />
      ) : null}
      <div
        data-slot="line-chart-plot"
        className="relative w-full shrink-0"
        style={{ height: H }}
      >
        {plot}
        {readoutEnabled && W !== null ? (
          <span id={hintId} hidden>
            Use the left and right arrow keys to read the values at each point.
          </span>
        ) : null}
        {showTooltip && activeX !== undefined && W !== null ? (
          <ChartTooltip
            x={projectX(activeX)}
            y={tooltipY}
            containerWidth={W}
          >
            {formatTooltip ? (
              formatTooltip({
                x: activeX,
                xLabel: describeX(activeX),
                values: activeValues,
              })
            ) : (
              <>
                <div className="mb-0.5 text-muted-foreground">
                  {describeX(activeX)}
                </div>
                {activeValues.map((entry) => (
                  <ChartTooltipRow
                    key={entry.series.id}
                    value={entry.formattedValue}
                    label={entry.series.label ?? entry.series.id}
                    color={series.length > 1 ? entry.paint.value : undefined}
                    colorClassName={
                      series.length > 1
                        ? chartPaintClass(entry.paint, "bg")
                        : undefined
                    }
                  />
                ))}
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
      {W !== null && hasData ? (
        <ChartDataTable
          caption={label}
          columns={[
            "x",
            ...series.map((s) => s.label ?? s.id),
          ]}
          rows={xValues.map((x) => ({
            key: String(x),
            cells: [
              describeX(x),
              ...resolved.map((rs) => {
                const rp: ResolvedPoint | undefined = rs.byX.get(x);
                return rp ? formatY(rp.domainY) : "—";
              }),
            ],
          }))}
        />
      ) : null}
    </div>
  );
}
LineChart.displayName = "LineChart";

export { LineChart };
