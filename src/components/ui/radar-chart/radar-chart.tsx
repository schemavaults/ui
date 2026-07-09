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

export const radarChartSizeIds = [
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies string[];
export type RadarChartSizeId = (typeof radarChartSizeIds)[number];

export const radarChartColorIds = [
  "default",
  "primary",
  "positive",
  "warning",
  "destructive",
  "muted",
] as const satisfies string[];
export type RadarChartColorId = (typeof radarChartColorIds)[number];

export const radarChartGridShapeIds = [
  "polygon",
  "circle",
] as const satisfies string[];
export type RadarChartGridShapeId = (typeof radarChartGridShapeIds)[number];

const SIZE_TO_PIXELS: Record<RadarChartSizeId, number> = {
  sm: 160,
  md: 240,
  lg: 320,
  xl: 420,
};

const STROKE_CLASSES: Record<RadarChartColorId, string> = {
  default: "stroke-schemavaults-brand-blue",
  primary: "stroke-primary",
  positive: "stroke-emerald-500 dark:stroke-emerald-400",
  warning: "stroke-warning",
  destructive: "stroke-destructive",
  muted: "stroke-muted-foreground",
};

const FILL_CLASSES: Record<RadarChartColorId, string> = {
  default: "fill-schemavaults-brand-blue",
  primary: "fill-primary",
  positive: "fill-emerald-500 dark:fill-emerald-400",
  warning: "fill-warning",
  destructive: "fill-destructive",
  muted: "fill-muted-foreground",
};

const TEXT_CLASSES: Record<RadarChartColorId, string> = {
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
const DEFAULT_COLOR_ROTATION: ReadonlyArray<RadarChartColorId> = [
  "default",
  "positive",
  "warning",
  "destructive",
  "primary",
  "muted",
];

export const radarChartVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      size: {
        sm: "text-[10px]",
        md: "text-[11px]",
        lg: "text-xs",
        xl: "text-sm",
      } satisfies Record<RadarChartSizeId, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface RadarChartAxis {
  /** Stable identifier used as React key. */
  id: string;
  /** Human-readable label placed at the axis tip. */
  label?: string;
  /**
   * Optional per-axis maximum. Overrides the chart-level `max` for scaling
   * this axis' values only. Useful when axes are measured on different scales.
   */
  max?: number;
  /**
   * Optional per-axis minimum. Overrides the chart-level `min` for scaling
   * this axis' values only.
   */
  min?: number;
}

export interface RadarChartSeriesPoint {
  /** Numeric value for the axis at the same index. Non-finite = gap. */
  value: number;
  /** Human-readable label used in aria-labels and tooltips. */
  label?: string;
}

export interface RadarChartSeries {
  /** Stable identifier used as React key and click payload. */
  id: string;
  /** Display name for the series. */
  label?: string;
  /**
   * One value per axis, in axis order. Extra values are ignored and missing
   * values are treated as gaps. Values may be raw numbers or point objects
   * with an optional label.
   */
  values: ReadonlyArray<number | RadarChartSeriesPoint>;
  /** Preset color id from the chart palette. Ignored if `stroke` is provided. */
  color?: RadarChartColorId;
  /**
   * Override the stroke with a raw CSS color (e.g. `"#ff0080"` or
   * `"hsl(var(--chart-1))"`). Takes precedence over `color`.
   */
  stroke?: string;
  /** Fill the shape. Defaults to the chart-level `area` (true). */
  area?: boolean;
  /** Opacity applied to the filled area. Defaults to `0.2`. */
  fillOpacity?: number;
  /** Stroke width in user units. Defaults to `2`. */
  strokeWidth?: number;
  /** Stroke dash pattern, e.g. `"4 3"`. Defaults to a solid line. */
  strokeDasharray?: string;
  /** Override the chart-level `showPoints`. */
  showPoints?: boolean;
  /** Extra classes applied to this series' shape `<path>`. */
  className?: string;
  /** Fired when a vertex in this series is clicked or activated via keyboard. */
  onPointClick?: (
    axis: RadarChartAxis,
    value: number,
    series: RadarChartSeries,
    event:
      | MouseEvent<SVGCircleElement>
      | KeyboardEvent<SVGCircleElement>,
  ) => void;
}

export interface RadarChartValueLabelContext {
  series: RadarChartSeries;
  axis: RadarChartAxis;
  value: number;
  axisIndex: number;
}

export interface RadarChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof radarChartVariants> {
  /** Axes to render, in order (clockwise starting from 12 o'clock). */
  axes: ReadonlyArray<RadarChartAxis>;
  /** Series to render, in order (later series are drawn on top). */
  series: ReadonlyArray<RadarChartSeries>;
  /** Accessible label describing what the chart represents. */
  label: string;
  /** Override the rendered diameter in pixels (defaults are size-aware). */
  diameter?: number;
  /**
   * Lower bound of the value axis. Defaults to `0`. Applied per-axis unless the
   * axis specifies its own `min`.
   */
  min?: number;
  /**
   * Upper bound of the value axis. Defaults to the largest value across
   * series. Applied per-axis unless the axis specifies its own `max`.
   */
  max?: number;
  /**
   * Angle in degrees at which the first axis is placed. `0` = 12 o'clock;
   * positive rotates clockwise. Defaults to `0`.
   */
  startAngle?: number;
  /**
   * Number of concentric grid rings (excluding the outer boundary). Defaults
   * to `4`. Set to `0` to hide grid rings.
   */
  gridLevels?: number;
  /** Shape of the grid rings. Defaults to `"polygon"`. */
  gridShape?: RadarChartGridShapeId;
  /** Render the axis spokes. Defaults to `true`. */
  showAxis?: boolean;
  /** Render the axis labels at each spoke tip. Defaults to `true`. */
  showAxisLabels?: boolean;
  /** Render the outer boundary ring. Defaults to `true`. */
  showBoundary?: boolean;
  /**
   * Fill the area under each series' shape. Individual series can override.
   * Defaults to `true`.
   */
  area?: boolean;
  /** Render point markers at every axis vertex. Defaults to `false`. */
  showPoints?: boolean;
  /** Render a value label at every axis vertex. Defaults to `false`. */
  showValueLabels?: boolean;
  /**
   * Customize the value-label text. Return `null` to skip a point. Defaults
   * to the raw value (`String(value)`).
   */
  valueLabelFormatter?: (
    context: RadarChartValueLabelContext,
  ) => string | null;
  /**
   * Fallback handler invoked for any point that doesn't have its own series-
   * level `onPointClick`. Receives the axis, value, and series.
   */
  onPointClick?: (
    axis: RadarChartAxis,
    value: number,
    series: RadarChartSeries,
    event:
      | MouseEvent<SVGCircleElement>
      | KeyboardEvent<SVGCircleElement>,
  ) => void;
  /** Optional content overlaid at the center of the chart. */
  children?: ReactNode;
  /** Extra classes for the overlay content wrapper. */
  overlayClassName?: string;
  /** Extra classes applied to every axis label `<text>` element. */
  axisLabelClassName?: string;
  /** Extra classes applied to every value-label `<text>` element. */
  valueLabelClassName?: string;
  /** Extra classes applied to the grid / axis `<path>` / `<line>` elements. */
  gridClassName?: string;
  /** Optional ref forwarded to the wrapper element. */
  ref?: Ref<HTMLDivElement>;
}

interface ResolvedAxis {
  axis: RadarChartAxis;
  /** Angle in radians, measured clockwise from 12 o'clock. */
  angle: number;
  /** Domain min / max for this axis. */
  min: number;
  max: number;
  /** Cartesian coordinates of the axis tip (at value = max). */
  tipX: number;
  tipY: number;
}

interface ResolvedSeriesPoint {
  axisIndex: number;
  value: number;
  label: string | undefined;
  isGap: boolean;
  /** Cartesian coordinates in SVG space. */
  x: number;
  y: number;
}

interface ResolvedSeries {
  series: RadarChartSeries;
  color: RadarChartColorId;
  points: ReadonlyArray<ResolvedSeriesPoint>;
  showPoints: boolean;
  area: boolean;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeValue(
  value: number | RadarChartSeriesPoint | undefined,
): { value: number; label: string | undefined; isGap: boolean } {
  if (value === undefined) {
    return { value: 0, label: undefined, isGap: true };
  }
  if (typeof value === "number") {
    return {
      value: isFiniteNumber(value) ? value : 0,
      label: undefined,
      isGap: !isFiniteNumber(value),
    };
  }
  const raw = value.value;
  return {
    value: isFiniteNumber(raw) ? raw : 0,
    label: value.label,
    isGap: !isFiniteNumber(raw),
  };
}

function buildShapePath(points: ReadonlyArray<ResolvedSeriesPoint>): string {
  // Skip gaps by breaking the path into separate closed sub-paths whenever a
  // run of non-gap vertices ends. Wrap around the end/start of the axis list.
  const n = points.length;
  if (n === 0) return "";

  // Find the first non-gap so wrapped runs stay contiguous.
  let start = 0;
  while (start < n && points[start]!.isGap) start += 1;
  if (start === n) return "";

  const segments: ResolvedSeriesPoint[][] = [];
  let current: ResolvedSeriesPoint[] = [];
  for (let i = 0; i < n; i += 1) {
    const p = points[(start + i) % n]!;
    if (p.isGap) {
      if (current.length > 0) {
        segments.push(current);
        current = [];
      }
      continue;
    }
    current.push(p);
  }
  if (current.length > 0) segments.push(current);

  // If the shape wraps fully around (no gaps at all), it's a single closed
  // polygon connecting back to the first vertex.
  const allClosed = segments.length === 1 && segments[0]!.length === n;

  let d = "";
  for (const seg of segments) {
    if (seg.length === 0) continue;
    const first = seg[0]!;
    d += `${d ? " " : ""}M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
    for (let i = 1; i < seg.length; i += 1) {
      const p = seg[i]!;
      d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    }
    if (allClosed) d += " Z";
  }
  return d;
}

function buildRingPath(
  cx: number,
  cy: number,
  ratio: number,
  axesAngles: ReadonlyArray<number>,
  radius: number,
  shape: RadarChartGridShapeId,
): string {
  if (shape === "circle") {
    const r = radius * ratio;
    // Two arcs to draw a full circle in SVG.
    return `M ${(cx + r).toFixed(2)} ${cy.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 1 1 ${(cx - r).toFixed(2)} ${cy.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 1 1 ${(cx + r).toFixed(2)} ${cy.toFixed(2)} Z`;
  }
  if (axesAngles.length === 0) return "";
  let d = "";
  axesAngles.forEach((angle, idx) => {
    const x = cx + Math.sin(angle) * radius * ratio;
    const y = cy - Math.cos(angle) * radius * ratio;
    d += `${idx === 0 ? "M" : " L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  return `${d} Z`;
}

function RadarChart({
  axes,
  series,
  label,
  size,
  diameter,
  min = 0,
  max,
  startAngle = 0,
  gridLevels = 4,
  gridShape = "polygon",
  showAxis = true,
  showAxisLabels = true,
  showBoundary = true,
  area = true,
  showPoints = false,
  showValueLabels = false,
  valueLabelFormatter,
  onPointClick,
  children,
  className,
  overlayClassName,
  axisLabelClassName,
  valueLabelClassName,
  gridClassName,
  ref,
  ...props
}: RadarChartProps): ReactElement {
  const resolvedSize: RadarChartSizeId = size ?? "md";
  const D: number = diameter ?? SIZE_TO_PIXELS[resolvedSize];
  const titleId: string = useId();

  const axisLabelGutter: number = showAxisLabels ? 44 : 8;
  const radius: number = Math.max(0, D / 2 - axisLabelGutter / 2);
  const cx: number = D / 2;
  const cy: number = D / 2;

  const axisCount: number = axes.length;
  const hasAxes: boolean = axisCount >= 3;
  const hasSeries: boolean = series.length > 0;

  // Compute a chart-level max fallback from data.
  const dataMax: number = (() => {
    let m = Number.NEGATIVE_INFINITY;
    for (const s of series) {
      for (const raw of s.values) {
        const n = normalizeValue(raw);
        if (!n.isGap && n.value > m) m = n.value;
      }
    }
    return Number.isFinite(m) ? m : 1;
  })();

  const effectiveMax: number = isFiniteNumber(max) ? max : dataMax;

  const startAngleRad: number = (startAngle * Math.PI) / 180;

  const resolvedAxes: ReadonlyArray<ResolvedAxis> = axes.map((axis, idx) => {
    const angle =
      startAngleRad + (idx * (2 * Math.PI)) / Math.max(1, axisCount);
    const axisMin: number = isFiniteNumber(axis.min) ? axis.min : min;
    const axisMax: number = isFiniteNumber(axis.max) ? axis.max : effectiveMax;
    return {
      axis,
      angle,
      min: axisMin,
      max: axisMax,
      tipX: cx + Math.sin(angle) * radius,
      tipY: cy - Math.cos(angle) * radius,
    };
  });

  const axesAngles: ReadonlyArray<number> = resolvedAxes.map((a) => a.angle);

  const resolvedSeries: ReadonlyArray<ResolvedSeries> = series.map(
    (s, seriesIndex): ResolvedSeries => {
      const color: RadarChartColorId =
        s.color ??
        DEFAULT_COLOR_ROTATION[seriesIndex % DEFAULT_COLOR_ROTATION.length]!;
      const seriesShowPoints: boolean = s.showPoints ?? showPoints;
      const seriesArea: boolean = s.area ?? area;
      const points: ReadonlyArray<ResolvedSeriesPoint> = resolvedAxes.map(
        (ra, axisIndex): ResolvedSeriesPoint => {
          const raw = s.values[axisIndex];
          const norm = normalizeValue(raw);
          const span: number = ra.max - ra.min > 0 ? ra.max - ra.min : 1;
          const clamped: number = Math.max(
            0,
            Math.min(1, (norm.value - ra.min) / span),
          );
          const r: number = norm.isGap ? 0 : clamped * radius;
          return {
            axisIndex,
            value: norm.value,
            label: norm.label,
            isGap: norm.isGap,
            x: cx + Math.sin(ra.angle) * r,
            y: cy - Math.cos(ra.angle) * r,
          };
        },
      );
      return {
        series: s,
        color,
        points,
        showPoints: seriesShowPoints,
        area: seriesArea,
      };
    },
  );

  const gridRatios: ReadonlyArray<number> = (() => {
    if (gridLevels <= 0) return [];
    const out: number[] = [];
    for (let i = 1; i <= gridLevels; i += 1) {
      out.push(i / (gridLevels + 1));
    }
    return out;
  })();

  return (
    <div
      ref={ref}
      role="img"
      aria-labelledby={titleId}
      data-slot="radar-chart"
      className={cn(radarChartVariants({ size }), className)}
      style={{ width: D, height: D }}
      {...props}
    >
      <svg
        width={D}
        height={D}
        viewBox={`0 0 ${D} ${D}`}
        aria-hidden={children ? "true" : undefined}
        className="h-full w-full overflow-visible"
      >
        <title id={titleId}>{label}</title>

        {!hasAxes ? (
          <text
            x={D / 2}
            y={D / 2}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground"
          >
            {axisCount === 0 ? "No axes" : "Need ≥3 axes"}
          </text>
        ) : (
          <>
            {gridRatios.length > 0 ? (
              <g
                aria-hidden="true"
                data-slot="radar-chart-grid"
                className="pointer-events-none"
              >
                {gridRatios.map((r) => (
                  <path
                    key={`grid-${r}`}
                    d={buildRingPath(cx, cy, r, axesAngles, radius, gridShape)}
                    fill="none"
                    strokeWidth={1}
                    className={cn("stroke-border/60", gridClassName)}
                  />
                ))}
              </g>
            ) : null}

            {showBoundary ? (
              <path
                aria-hidden="true"
                data-slot="radar-chart-boundary"
                d={buildRingPath(cx, cy, 1, axesAngles, radius, gridShape)}
                fill="none"
                strokeWidth={1}
                className={cn("stroke-border", gridClassName)}
              />
            ) : null}

            {showAxis ? (
              <g
                aria-hidden="true"
                data-slot="radar-chart-axes"
                className="pointer-events-none"
              >
                {resolvedAxes.map((ra) => (
                  <line
                    key={`axis-${ra.axis.id}`}
                    x1={cx}
                    y1={cy}
                    x2={ra.tipX}
                    y2={ra.tipY}
                    strokeWidth={1}
                    className={cn("stroke-border", gridClassName)}
                  />
                ))}
              </g>
            ) : null}

            {hasSeries ? (
              resolvedSeries.map((rs) => {
                const strokeWidth: number = rs.series.strokeWidth ?? 2;
                const shapePath: string = buildShapePath(rs.points);
                const strokeClass: string | undefined = rs.series.stroke
                  ? undefined
                  : STROKE_CLASSES[rs.color];
                const fillClass: string | undefined = rs.series.stroke
                  ? undefined
                  : FILL_CLASSES[rs.color];
                const textClass: string | undefined = rs.series.stroke
                  ? undefined
                  : TEXT_CLASSES[rs.color];
                const fillOpacity: number = rs.series.fillOpacity ?? 0.2;

                return (
                  <g
                    key={rs.series.id}
                    data-slot="radar-chart-series"
                    data-series-id={rs.series.id}
                  >
                    {rs.area && shapePath !== "" ? (
                      <path
                        d={shapePath}
                        stroke="none"
                        fill={rs.series.stroke ?? "currentColor"}
                        fillOpacity={fillOpacity}
                        className={cn(
                          fillClass,
                          "pointer-events-none",
                        )}
                      />
                    ) : null}
                    {shapePath !== "" ? (
                      <path
                        d={shapePath}
                        fill="none"
                        stroke={rs.series.stroke}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={rs.series.strokeDasharray}
                        className={cn(strokeClass, rs.series.className)}
                      />
                    ) : null}

                    {rs.showPoints
                      ? rs.points.map((rp) => {
                          if (rp.isGap) return null;
                          const ra = resolvedAxes[rp.axisIndex]!;
                          const handler =
                            rs.series.onPointClick ?? onPointClick;
                          const isInteractive: boolean =
                            typeof handler === "function";
                          const pointLabel: string =
                            rp.label ??
                            `${rs.series.label ?? rs.series.id} – ${ra.axis.label ?? ra.axis.id}: ${rp.value}`;
                          return (
                            <circle
                              key={`${rs.series.id}-${ra.axis.id}`}
                              cx={rp.x}
                              cy={rp.y}
                              r={Math.max(strokeWidth + 1, 3)}
                              fill={rs.series.stroke ?? "currentColor"}
                              stroke="hsl(var(--background))"
                              strokeWidth={1.5}
                              data-axis-id={ra.axis.id}
                              role={isInteractive ? "button" : undefined}
                              tabIndex={isInteractive ? 0 : undefined}
                              aria-label={pointLabel}
                              onClick={
                                isInteractive
                                  ? (
                                      event: MouseEvent<SVGCircleElement>,
                                    ): void => {
                                      handler!(
                                        ra.axis,
                                        rp.value,
                                        rs.series,
                                        event,
                                      );
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
                                        handler!(
                                          ra.axis,
                                          rp.value,
                                          rs.series,
                                          event,
                                        );
                                      }
                                    }
                                  : undefined
                              }
                              className={cn(
                                "transition-opacity",
                                rs.series.stroke ? undefined : fillClass,
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
                          const ra = resolvedAxes[rp.axisIndex]!;
                          const text: string | null = valueLabelFormatter
                            ? valueLabelFormatter({
                                series: rs.series,
                                axis: ra.axis,
                                value: rp.value,
                                axisIndex: rp.axisIndex,
                              })
                            : String(rp.value);
                          if (text === null || text === "") return null;
                          // Offset the label a couple pixels outward from the
                          // vertex so it doesn't collide with the point marker.
                          const dx = Math.sin(ra.angle);
                          const dy = -Math.cos(ra.angle);
                          const offset = 8;
                          return (
                            <text
                              key={`${rs.series.id}-${ra.axis.id}-val`}
                              x={rp.x + dx * offset}
                              y={rp.y + dy * offset}
                              textAnchor="middle"
                              dominantBaseline="central"
                              className={cn(
                                "pointer-events-none select-none fill-foreground font-medium",
                                textClass,
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
            ) : null}

            {showAxisLabels ? (
              <g
                aria-hidden="true"
                data-slot="radar-chart-axis-labels"
                className="pointer-events-none select-none"
              >
                {resolvedAxes.map((ra) => {
                  const text: string = ra.axis.label ?? ra.axis.id;
                  const dx = Math.sin(ra.angle);
                  const dy = -Math.cos(ra.angle);
                  const labelOffset = 12;
                  const lx = ra.tipX + dx * labelOffset;
                  const ly = ra.tipY + dy * labelOffset;
                  // Anchor the label so it doesn't overrun the axis tip.
                  const textAnchor: "start" | "middle" | "end" =
                    dx > 0.15 ? "start" : dx < -0.15 ? "end" : "middle";
                  const dominantBaseline: "hanging" | "middle" | "auto" =
                    dy > 0.15 ? "auto" : dy < -0.15 ? "hanging" : "middle";
                  return (
                    <text
                      key={`label-${ra.axis.id}`}
                      x={lx}
                      y={ly}
                      textAnchor={textAnchor}
                      dominantBaseline={dominantBaseline}
                      className={cn(
                        "fill-muted-foreground",
                        axisLabelClassName,
                      )}
                    >
                      {text}
                    </text>
                  );
                })}
              </g>
            ) : null}
          </>
        )}
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
RadarChart.displayName = "RadarChart";

export { RadarChart };
