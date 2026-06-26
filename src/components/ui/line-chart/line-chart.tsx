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

export const lineChartSizeIds = [
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies string[];
export type LineChartSizeId = (typeof lineChartSizeIds)[number];

export const lineChartColorIds = [
  "default",
  "primary",
  "positive",
  "warning",
  "destructive",
  "muted",
] as const satisfies string[];
export type LineChartColorId = (typeof lineChartColorIds)[number];

export const lineChartCurveIds = ["linear", "smooth"] as const satisfies string[];
export type LineChartCurveId = (typeof lineChartCurveIds)[number];

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

const STROKE_CLASSES: Record<LineChartColorId, string> = {
  default: "stroke-schemavaults-brand-blue",
  primary: "stroke-primary",
  positive: "stroke-emerald-500 dark:stroke-emerald-400",
  warning: "stroke-warning",
  destructive: "stroke-destructive",
  muted: "stroke-muted-foreground",
};

const FILL_CLASSES: Record<LineChartColorId, string> = {
  default: "fill-schemavaults-brand-blue",
  primary: "fill-primary",
  positive: "fill-emerald-500 dark:fill-emerald-400",
  warning: "fill-warning",
  destructive: "fill-destructive",
  muted: "fill-muted-foreground",
};

const TEXT_CLASSES: Record<LineChartColorId, string> = {
  default: "text-schemavaults-brand-blue",
  primary: "text-primary",
  positive: "text-emerald-500 dark:text-emerald-400",
  warning: "text-warning",
  destructive: "text-destructive",
  muted: "text-muted-foreground",
};

/**
 * Fallback color rotation when a series doesn't specify its own color. Index
 * is the series position in the input array, modulo the palette length.
 */
const DEFAULT_COLOR_ROTATION: ReadonlyArray<LineChartColorId> = [
  "default",
  "positive",
  "warning",
  "destructive",
  "primary",
  "muted",
];

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
  /** Preset color id from the chart palette. Ignored if `stroke` is provided. */
  color?: LineChartColorId;
  /**
   * Override the stroke with a raw CSS color (e.g. `"#ff0080"` or
   * `"hsl(var(--chart-1))"`). Takes precedence over `color`.
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

export interface LineChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof lineChartVariants> {
  /** Series to render, in order (later series are drawn on top). */
  series: ReadonlyArray<LineChartSeries>;
  /** Accessible label describing what the chart represents. */
  label: string;
  /**
   * Override the rendered canvas width in pixels (defaults are size-aware).
   */
  width?: number;
  /**
   * Override the rendered canvas height in pixels (defaults are size-aware).
   */
  height?: number;
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
   * `0` disables gridlines. Defaults to `0`.
   */
  gridLineCount?: number;
  /**
   * Optional x-axis tick labels indexed by point position. When the chart is
   * in categorical mode (no explicit `x` on points), labels are shown at each
   * index. Pass `null` for an entry to skip it.
   */
  categories?: ReadonlyArray<string | null>;
  /**
   * Format an x-tick label from its numeric value. Used when explicit numeric
   * x-values are provided on points. Return `null` to skip the tick.
   */
  xTickFormatter?: (x: number, index: number) => string | null;
  /**
   * Number of evenly-spaced x-axis ticks to render when `xTickFormatter` is
   * provided. Defaults to `5`.
   */
  xTickCount?: number;
  /** Render a value label above every point. Defaults to `false`. */
  showValueLabels?: boolean;
  /**
   * Customize the value-label text. Return `null` to skip a point. Defaults
   * to the raw value (`String(value)`).
   */
  valueLabelFormatter?: (
    context: LineChartValueLabelContext,
  ) => string | null;
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
  color: LineChartColorId;
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
  yMin,
  yMax,
  xMin,
  xMax,
  curve = "linear",
  showPoints = false,
  showAxis = true,
  gridLineCount = 0,
  categories,
  xTickFormatter,
  xTickCount = 5,
  showValueLabels = false,
  valueLabelFormatter,
  onPointClick,
  children,
  className,
  overlayClassName,
  valueLabelClassName,
  categoryLabelClassName,
  axisClassName,
  ref,
  ...props
}: LineChartProps): ReactElement {
  const resolvedSize: LineChartSizeId = size ?? "md";
  const canvas = SIZE_TO_CANVAS[resolvedSize];
  const W: number = width ?? canvas.width;
  const H: number = height ?? canvas.height;

  const titleId: string = useId();
  const gradientIdPrefix: string = useId();

  // Reserve gutters for axis labels.
  const hasCategoryLabels: boolean =
    (categories !== undefined && categories.length > 0) ||
    typeof xTickFormatter === "function";
  const categoryGutter: number = hasCategoryLabels ? 22 : 6;
  const valueGutter: number = showValueLabels ? 18 : 6;
  const padTop: number = valueGutter;
  const padBottom: number = categoryGutter;
  const padLeft: number = 6;
  const padRight: number = 6;

  const plotX0: number = padLeft;
  const plotY0: number = padTop;
  const plotW: number = Math.max(0, W - padLeft - padRight);
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

  const resolved: ReadonlyArray<ResolvedSeries> = series.map(
    (s, seriesIndex): ResolvedSeries => {
      const color: LineChartColorId =
        s.color ??
        DEFAULT_COLOR_ROTATION[seriesIndex % DEFAULT_COLOR_ROTATION.length]!;
      const seriesCurve: LineChartCurveId = s.curve ?? curve;
      const seriesShowPoints: boolean = s.showPoints ?? showPoints;
      const points: ReadonlyArray<ResolvedPoint> = s.points.map((p, idx) => {
        const domainX: number = isFiniteNumber(p.x) ? p.x : idx;
        const domainY: number = isFiniteNumber(p.y) ? p.y : 0;
        const isGap: boolean = !isFiniteNumber(p.y);
        return {
          point: p,
          domainX,
          domainY,
          x: projectX(domainX),
          y: isGap ? projectY(effectiveYMin) : projectY(domainY),
          isGap,
          index: idx,
        };
      });
      return {
        series: s,
        points,
        color,
        curve: seriesCurve,
        showPoints: seriesShowPoints,
      };
    },
  );

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

  // X-axis tick set.
  const xTicks: ReadonlyArray<{ x: number; text: string }> = (() => {
    if (categories && categories.length > 0) {
      const ticks: { x: number; text: string }[] = [];
      categories.forEach((text, idx) => {
        if (text === null) return;
        const domainX: number = idx;
        if (domainX < effectiveXMin || domainX > effectiveXMax) return;
        ticks.push({ x: projectX(domainX), text });
      });
      return ticks;
    }
    if (typeof xTickFormatter === "function" && xTickCount > 0 && hasData) {
      const ticks: { x: number; text: string }[] = [];
      const count: number = Math.max(2, xTickCount);
      for (let i = 0; i < count; i += 1) {
        const t: number = count === 1 ? 0 : i / (count - 1);
        const domainX: number = effectiveXMin + t * xSpan;
        const text = xTickFormatter(domainX, i);
        if (text === null || text === "") continue;
        ticks.push({ x: projectX(domainX), text });
      }
      return ticks;
    }
    return [];
  })();

  return (
    <div
      ref={ref}
      role="img"
      aria-labelledby={titleId}
      data-slot="line-chart"
      className={cn(lineChartVariants({ size }), className)}
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

        {gridLines.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="line-chart-gridlines"
            className="pointer-events-none"
          >
            {gridLines.map((t) => {
              const y: number = plotY0 + plotH - t * plotH;
              return (
                <line
                  key={`grid-${t}`}
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
            const strokeClass: string | undefined = rs.series.stroke
              ? undefined
              : STROKE_CLASSES[rs.color];
            const fillClass: string | undefined = rs.series.stroke
              ? undefined
              : TEXT_CLASSES[rs.color];
            const gradientId: string = `${gradientIdPrefix}-grad-${seriesIndex}`;

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
                        className={fillClass}
                      >
                        <stop
                          offset="0%"
                          stopColor={rs.series.stroke ?? "currentColor"}
                          stopOpacity="0.35"
                        />
                        <stop
                          offset="100%"
                          stopColor={rs.series.stroke ?? "currentColor"}
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d={areaPath}
                      fill={`url(#${gradientId})`}
                      stroke="none"
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
                  className={cn(strokeClass, rs.series.className)}
                />

                {rs.showPoints
                  ? rs.points.map((rp) => {
                      if (rp.isGap) return null;
                      const handler =
                        rs.series.onPointClick ?? onPointClick;
                      const isInteractive: boolean =
                        typeof handler === "function";
                      const ariaLabel: string = rp.point.label
                        ? `${rs.series.label ?? rs.series.id} – ${rp.point.label}: ${rp.point.y}`
                        : `${rs.series.label ?? rs.series.id} at ${rp.domainX}: ${rp.point.y}`;
                      const pointKey: string =
                        rp.point.id ?? `${rs.series.id}-${rp.index}`;
                      return (
                        <circle
                          key={pointKey}
                          cx={rp.x}
                          cy={rp.y}
                          r={Math.max(strokeWidth + 1, 3)}
                          fill={rs.series.stroke ?? "currentColor"}
                          stroke="hsl(var(--background))"
                          strokeWidth={1.5}
                          data-point-index={rp.index}
                          role={isInteractive ? "button" : undefined}
                          tabIndex={isInteractive ? 0 : undefined}
                          aria-label={ariaLabel}
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
                            rs.series.stroke ? undefined : FILL_CLASSES[rs.color],
                            isInteractive &&
                              "cursor-pointer hover:opacity-80 focus:outline-none focus-visible:opacity-80",
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
                        : String(rp.point.y);
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
            data-slot="line-chart-x-ticks"
            className="pointer-events-none select-none"
          >
            {xTicks.map((tick, idx) => (
              <text
                key={`xtick-${idx}-${tick.text}`}
                x={tick.x}
                y={plotY0 + plotH + 14}
                textAnchor="middle"
                className={cn("fill-muted-foreground", categoryLabelClassName)}
              >
                {tick.text}
              </text>
            ))}
          </g>
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
LineChart.displayName = "LineChart";

export { LineChart };
