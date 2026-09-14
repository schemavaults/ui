"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { useId } from "react";

import { cn } from "@/lib/utils";

export const scatterPlotSizeIds = [
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies string[];
export type ScatterPlotSizeId = (typeof scatterPlotSizeIds)[number];

export const scatterPlotColorIds = [
  "default",
  "primary",
  "positive",
  "warning",
  "destructive",
  "muted",
] as const satisfies string[];
export type ScatterPlotColorId = (typeof scatterPlotColorIds)[number];

export const scatterPlotShapeIds = [
  "circle",
  "square",
  "triangle",
  "diamond",
] as const satisfies string[];
export type ScatterPlotShapeId = (typeof scatterPlotShapeIds)[number];

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

const FILL_CLASSES: Record<ScatterPlotColorId, string> = {
  default: "fill-schemavaults-brand-blue",
  primary: "fill-primary",
  positive: "fill-emerald-500 dark:fill-emerald-400",
  warning: "fill-warning",
  destructive: "fill-destructive",
  muted: "fill-muted-foreground",
};

const STROKE_CLASSES: Record<ScatterPlotColorId, string> = {
  default: "stroke-schemavaults-brand-blue",
  primary: "stroke-primary",
  positive: "stroke-emerald-500 dark:stroke-emerald-400",
  warning: "stroke-warning",
  destructive: "stroke-destructive",
  muted: "stroke-muted-foreground",
};

/**
 * Fallback color/shape rotation when a series doesn't specify its own. Index
 * is the series position in the input array, modulo the palette length. Shapes
 * rotate alongside colors so overlapping series stay distinguishable without
 * relying on color alone.
 */
const DEFAULT_COLOR_ROTATION: ReadonlyArray<ScatterPlotColorId> = [
  "default",
  "positive",
  "warning",
  "destructive",
  "primary",
  "muted",
];

const DEFAULT_SHAPE_ROTATION: ReadonlyArray<ScatterPlotShapeId> = [
  "circle",
  "triangle",
  "square",
  "diamond",
];

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
}

export interface ScatterPlotSeries {
  /** Stable identifier for the series. Used as React key and click payload. */
  id: string;
  /** Display name for the series. */
  label?: string;
  /** Points to plot. Order is irrelevant except for paint order. */
  points: ReadonlyArray<ScatterPlotPoint>;
  /** Preset color id from the chart palette. Ignored if `color` is provided. */
  colorId?: ScatterPlotColorId;
  /**
   * Override the marker color with a raw CSS color (e.g. `"#ff0080"` or
   * `"hsl(var(--chart-1))"`). Takes precedence over `colorId`.
   */
  color?: string;
  /** Marker shape. Defaults to a rotation based on the series index. */
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
  /** Override the rendered canvas width in pixels (defaults are size-aware). */
  width?: number;
  /** Override the rendered canvas height in pixels (defaults are size-aware). */
  height?: number;
  /** Lower bound of the x-axis. Defaults to the smallest x across series. */
  xMin?: number;
  /** Upper bound of the x-axis. Defaults to the largest x across series. */
  xMax?: number;
  /** Lower bound of the y-axis. Defaults to the smallest y across series. */
  yMin?: number;
  /** Upper bound of the y-axis. Defaults to the largest y across series. */
  yMax?: number;
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
   * disables them. Defaults to `0`.
   */
  gridLineCount?: number;
  /**
   * Number of evenly-spaced vertical gridlines drawn across the x-axis. `0`
   * disables them. Defaults to `0`.
   */
  verticalGridLineCount?: number;
  /**
   * Format an x-axis tick label. Return `null` to skip the tick. When omitted,
   * ticks render only if `showXAxisLabels` is `true` (raw values).
   */
  xTickFormatter?: (x: number, index: number) => string | null;
  /** Number of evenly-spaced x-axis ticks, endpoints included. Defaults to `5`. */
  xTickCount?: number;
  /** Render raw-value x-axis ticks. Ignored when `xTickFormatter` is set. */
  showXAxisLabels?: boolean;
  /**
   * Format a y-axis tick label. Return `null` to skip the tick. When omitted,
   * ticks render only if `showYAxisLabels` is `true` (raw values).
   */
  yTickFormatter?: (y: number, index: number) => string | null;
  /** Number of evenly-spaced y-axis ticks, endpoints included. Defaults to `5`. */
  yTickCount?: number;
  /** Render raw-value y-axis ticks. Ignored when `yTickFormatter` is set. */
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
  /** Vertical reference line(s) at fixed x positions. */
  xReferenceLines?: ReadonlyArray<ScatterPlotReferenceLine>;
  /** Horizontal reference line(s) at fixed y positions. */
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
  index: number;
}

interface ResolvedSeries {
  series: ScatterPlotSeries;
  points: ReadonlyArray<ResolvedPoint>;
  colorId: ScatterPlotColorId;
  shape: ScatterPlotShapeId;
  opacity: number;
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

function ScatterPlot({
  series,
  label,
  size,
  width,
  height,
  xMin,
  xMax,
  yMin,
  yMax,
  pointRadius = 4,
  sizeRange = [4, 14],
  pointOpacity = 0.8,
  showAxis = true,
  gridLineCount = 0,
  verticalGridLineCount = 0,
  xTickFormatter,
  xTickCount = 5,
  showXAxisLabels = false,
  yTickFormatter,
  yTickCount = 5,
  showYAxisLabels = false,
  yTickLabelWidth = 36,
  xAxisTitle,
  yAxisTitle,
  xReferenceLines,
  yReferenceLines,
  showValueLabels = false,
  valueLabelFormatter,
  onPointClick,
  emptyMessage = "No data",
  children,
  className,
  overlayClassName,
  valueLabelClassName,
  tickLabelClassName,
  axisClassName,
  ref,
  ...props
}: ScatterPlotProps): ReactElement {
  const resolvedSize: ScatterPlotSizeId = size ?? "md";
  const canvas = SIZE_TO_CANVAS[resolvedSize];
  const W: number = width ?? canvas.width;
  const H: number = height ?? canvas.height;

  const titleId: string = useId();

  const hasXAxisLabels: boolean =
    typeof xTickFormatter === "function" || showXAxisLabels;
  const hasYAxisLabels: boolean =
    typeof yTickFormatter === "function" || showYAxisLabels;

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
  const plotW: number = Math.max(0, W - padLeft - padRight);
  const plotH: number = Math.max(0, H - padTop - padBottom);

  // Determine the domain across all series, ignoring non-finite coordinates.
  let domainXMin: number = Number.POSITIVE_INFINITY;
  let domainXMax: number = Number.NEGATIVE_INFINITY;
  let domainYMin: number = Number.POSITIVE_INFINITY;
  let domainYMax: number = Number.NEGATIVE_INFINITY;
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
  const effectiveYMin: number = isFiniteNumber(yMin)
    ? yMin
    : hasData
      ? domainYMin
      : 0;
  const effectiveYMax: number = isFiniteNumber(yMax)
    ? yMax
    : hasData
      ? domainYMax
      : 1;

  const xSpan: number =
    effectiveXMax > effectiveXMin ? effectiveXMax - effectiveXMin : 1;
  const ySpan: number =
    effectiveYMax > effectiveYMin ? effectiveYMax - effectiveYMin : 1;

  const [minRadius, maxRadius] = sizeRange;
  // Inset the data area so markers sitting on the domain edges aren't clipped.
  const markerPad: number = hasSizedPoints
    ? Math.max(minRadius, maxRadius) + 2
    : pointRadius + 2;
  const innerW: number = Math.max(0, plotW - markerPad * 2);
  const innerH: number = Math.max(0, plotH - markerPad * 2);

  const projectX = (x: number): number =>
    plotX0 + markerPad + ((x - effectiveXMin) / xSpan) * innerW;
  const projectY = (y: number): number =>
    plotY0 + markerPad + innerH - ((y - effectiveYMin) / ySpan) * innerH;

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

  const resolved: ReadonlyArray<ResolvedSeries> = series.map(
    (s, seriesIndex): ResolvedSeries => {
      const colorId: ScatterPlotColorId =
        s.colorId ??
        DEFAULT_COLOR_ROTATION[seriesIndex % DEFAULT_COLOR_ROTATION.length]!;
      const shape: ScatterPlotShapeId =
        s.shape ??
        DEFAULT_SHAPE_ROTATION[seriesIndex % DEFAULT_SHAPE_ROTATION.length]!;
      const seriesRadius: number = s.pointRadius ?? pointRadius;
      const points: ResolvedPoint[] = [];
      s.points.forEach((p, index) => {
        if (!isFiniteNumber(p.x) || !isFiniteNumber(p.y)) return;
        points.push({
          point: p,
          x: projectX(p.x),
          y: projectY(p.y),
          r: resolveRadius(p, seriesRadius),
          index,
        });
      });
      return {
        series: s,
        points,
        colorId,
        shape,
        opacity: s.pointOpacity ?? pointOpacity,
      };
    },
  );

  const horizontalGridLines: ReadonlyArray<number> = (() => {
    if (gridLineCount <= 0) return [];
    const lines: number[] = [];
    for (let i = 1; i <= gridLineCount; i += 1) {
      lines.push(i / (gridLineCount + 1));
    }
    return lines;
  })();

  const verticalGridLines: ReadonlyArray<number> = (() => {
    if (verticalGridLineCount <= 0) return [];
    const lines: number[] = [];
    for (let i = 1; i <= verticalGridLineCount; i += 1) {
      lines.push(i / (verticalGridLineCount + 1));
    }
    return lines;
  })();

  const xTicks: ReadonlyArray<{ x: number; text: string }> = (() => {
    if (!hasXAxisLabels || !hasData) return [];
    const count: number = Math.max(2, xTickCount);
    const ticks: { x: number; text: string }[] = [];
    for (let i = 0; i < count; i += 1) {
      const t: number = i / (count - 1);
      const value: number = effectiveXMin + t * xSpan;
      const text: string | null =
        typeof xTickFormatter === "function"
          ? xTickFormatter(value, i)
          : String(value);
      if (text === null || text === "") continue;
      ticks.push({ x: projectX(value), text });
    }
    return ticks;
  })();

  const yTicks: ReadonlyArray<{ y: number; text: string }> = (() => {
    if (!hasYAxisLabels || !hasData) return [];
    const count: number = Math.max(2, yTickCount);
    const ticks: { y: number; text: string }[] = [];
    for (let i = 0; i < count; i += 1) {
      // Iterate top-down (i = 0 -> yMax) so the first call to a custom
      // formatter receives the largest value -- the order most consumers
      // expect.
      const t: number = i / (count - 1);
      const value: number = effectiveYMax - t * ySpan;
      const text: string | null =
        typeof yTickFormatter === "function"
          ? yTickFormatter(value, i)
          : String(value);
      if (text === null || text === "") continue;
      ticks.push({ y: projectY(value), text });
    }
    return ticks;
  })();

  return (
    <div
      ref={ref}
      role="img"
      aria-labelledby={titleId}
      data-slot="scatter-plot"
      className={cn(scatterPlotVariants({ size }), className)}
      style={{ width: W, height: H }}
      {...props}
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden={children ? "true" : undefined}
        className="h-full w-full overflow-visible"
      >
        <title id={titleId}>{label}</title>

        {horizontalGridLines.length > 0 || verticalGridLines.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="scatter-plot-gridlines"
            className="pointer-events-none"
          >
            {horizontalGridLines.map((t) => {
              const y: number = plotY0 + plotH - t * plotH;
              return (
                <line
                  key={`h-grid-${t}`}
                  x1={plotX0}
                  y1={y}
                  x2={plotX0 + plotW}
                  y2={y}
                  strokeWidth={1}
                  className={cn("stroke-border/60", axisClassName)}
                />
              );
            })}
            {verticalGridLines.map((t) => {
              const x: number = plotX0 + t * plotW;
              return (
                <line
                  key={`v-grid-${t}`}
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
          resolved.map((rs) => {
            const rawColor: string | undefined = rs.series.color;
            const fillClass: string | undefined = rawColor
              ? undefined
              : FILL_CLASSES[rs.colorId];
            const strokeClass: string | undefined = rawColor
              ? undefined
              : STROKE_CLASSES[rs.colorId];
            const handler = rs.series.onPointClick ?? onPointClick;
            const isInteractive: boolean = typeof handler === "function";

            const trend = rs.series.trendLine
              ? computeTrendLine(
                  rs.series.points.filter(
                    (p): p is ScatterPlotPoint =>
                      isFiniteNumber(p.x) && isFiniteNumber(p.y),
                  ),
                )
              : null;

            return (
              <g
                key={rs.series.id}
                data-slot="scatter-plot-series"
                data-series-id={rs.series.id}
              >
                {trend ? (
                  <line
                    aria-hidden="true"
                    data-slot="scatter-plot-trend-line"
                    x1={projectX(effectiveXMin)}
                    y1={projectY(
                      trend.slope * effectiveXMin + trend.intercept,
                    )}
                    x2={projectX(effectiveXMax)}
                    y2={projectY(
                      trend.slope * effectiveXMax + trend.intercept,
                    )}
                    stroke={rawColor}
                    strokeWidth={1.5}
                    strokeDasharray="5 4"
                    strokeLinecap="round"
                    className={cn("pointer-events-none", strokeClass)}
                  />
                ) : null}

                {rs.points.map((rp) => {
                  const pointKey: string =
                    rp.point.id ?? `${rs.series.id}-${rp.index}`;
                  const seriesName: string = rs.series.label ?? rs.series.id;
                  const ariaLabel: string = rp.point.label
                    ? `${seriesName} – ${rp.point.label}: (${rp.point.x}, ${rp.point.y})`
                    : `${seriesName}: (${rp.point.x}, ${rp.point.y})`;
                  return (
                    <path
                      key={pointKey}
                      d={buildMarkerPath(rs.shape, rp.x, rp.y, rp.r)}
                      fill={rawColor ?? "currentColor"}
                      fillOpacity={rs.opacity}
                      stroke="hsl(var(--background))"
                      strokeWidth={1}
                      data-point-index={rp.index}
                      data-testid={`scatter-plot-point-${pointKey}`}
                      role={isInteractive ? "button" : undefined}
                      tabIndex={isInteractive ? 0 : undefined}
                      aria-label={ariaLabel}
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
                        fillClass,
                        isInteractive &&
                          "cursor-pointer hover:opacity-80 focus:outline-none focus-visible:opacity-60",
                        rs.series.className,
                      )}
                    >
                      <title>{ariaLabel}</title>
                    </path>
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
                          `(${rp.point.x}, ${rp.point.y})`);
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
          })
        )}

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
                  className={cn("fill-muted-foreground", tickLabelClassName)}
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
                  className={cn("fill-muted-foreground", tickLabelClassName)}
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
  );
}
ScatterPlot.displayName = "ScatterPlot";

export { ScatterPlot };
