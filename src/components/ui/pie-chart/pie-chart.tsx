"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
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
  ChartTooltip,
  ChartTooltipRow,
} from "@/components/ui/chart-primitives/chart-tooltip";
import { useChartWidth } from "@/components/ui/chart-primitives/use-chart-width";

export const pieChartSizeIds = [
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies string[];
export type PieChartSizeId = (typeof pieChartSizeIds)[number];

/** Preset segment colours; see `chartColorIds`. */
export const pieChartSegmentColorIds = chartColorIds;
export type PieChartSegmentColorId = ChartColorId;

const SIZE_TO_PIXELS: Record<PieChartSizeId, number> = {
  sm: 96,
  md: 160,
  lg: 224,
  xl: 320,
};

const SHARE_FORMAT: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

export const pieChartVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      size: {
        sm: "h-24 w-24",
        md: "h-40 w-40",
        lg: "h-56 w-56",
        xl: "h-80 w-80",
      } satisfies Record<PieChartSizeId, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface PieChartSegment {
  /** Stable identifier for the segment. Used as React key and click payload. */
  id: string;
  /**
   * Relative size of the segment. Segment angle is `value / sum(values)`.
   * Non-positive values are skipped.
   */
  value: number;
  /** Optional human-readable label exposed via `aria-label` and tooltips. */
  label?: string;
  /**
   * Preset color. Defaults to the segment's palette slot (its position in
   * `segmentOrder` when the chart has one, else in `segments`); a ninth
   * segment and beyond are painted `"other"`. Ignored if `fill` is provided.
   */
  color?: PieChartSegmentColorId;
  /**
   * Override the fill with a raw CSS color (e.g. `"#ff0080"` or
   * `"var(--chart-3)"`). Takes precedence over `color`.
   */
  fill?: string;
  /** Extra classes applied to this segment's `<path>`. */
  className?: string;
  /** Fired when this segment is clicked or activated via keyboard. */
  onClick?: (segment: PieChartSegment, event: MouseEvent<SVGPathElement> | KeyboardEvent<SVGPathElement>) => void;
}

export interface PieChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof pieChartVariants> {
  /** Segments to render, in order (clockwise from 12 o'clock). */
  segments: ReadonlyArray<PieChartSegment>;
  /** Accessible label describing what the chart represents. */
  label: string;
  /**
   * Inner radius as a fraction of the outer radius (0–1). `0` is a solid pie,
   * values like `0.55` produce a donut. Defaults to `0`.
   */
  innerRadius?: number;
  /**
   * Diameter in pixels (defaults are size-aware), or `"auto"` to fit the
   * container's width, never growing past the size preset. An `"auto"`
   * chart renders an empty placeholder at the preset's height until it has
   * been measured.
   */
  diameter?: number | "auto";
  /**
   * Every segment id the chart can show, in colour-slot order. Pass the
   * full, unfiltered list and a segment you filter out never repaints the
   * others.
   */
  segmentOrder?: ReadonlyArray<string>;
  /** Format a segment's value for the readout and table. */
  formatValue?: (value: number) => string;
  /** Show the hover / focus readout. Defaults to `true`. */
  showTooltip?: boolean;
  /** Show a legend of the segments under the chart. Defaults to `false`. */
  showLegend?: boolean;
  /**
   * Hold the current render at reduced opacity while new data loads, rather
   * than flashing a skeleton.
   */
  loading?: boolean;
  /**
   * Width of the divider stroke between segments. Defaults to `1`. Set to `0`
   * to remove the divider.
   */
  segmentGap?: number;
  /**
   * Fallback handler invoked for any segment that doesn't have its own
   * `onClick`. Receives the clicked segment.
   */
  onSegmentClick?: (segment: PieChartSegment, event: MouseEvent<SVGPathElement> | KeyboardEvent<SVGPathElement>) => void;
  /** Optional content rendered in the center of the chart (useful for donuts). */
  children?: ReactNode;
  /** Extra classes for the centered content wrapper. */
  centerClassName?: string;
  /**
   * When true, renders each segment's `label` inside the slice. Use
   * `segmentLabelFormatter` to customize the displayed string (e.g. show a
   * percentage instead of the raw label).
   */
  showSegmentLabels?: boolean;
  /**
   * Customize the in-segment label text. Return `null` to skip a segment.
   * Defaults to `segment.label ?? segment.id`.
   */
  segmentLabelFormatter?: (params: {
    segment: PieChartSegment;
    value: number;
    /** Share of the total, in the range 0–1. */
    fraction: number;
    /** Share of the total, in the range 0–100. */
    percentage: number;
    index: number;
  }) => string | null;
  /**
   * Minimum segment sweep (in radians) required to render its label. Smaller
   * segments are skipped to avoid overlap. Defaults to ~11.5° (0.2 rad).
   */
  minSegmentLabelAngle?: number;
  /** Extra classes applied to every segment-label `<text>` element. */
  segmentLabelClassName?: string;
  /** Optional ref forwarded to the wrapper element. */
  ref?: Ref<HTMLDivElement>;
}

interface ResolvedSegment {
  segment: PieChartSegment;
  index: number;
  startAngle: number;
  endAngle: number;
  paint: ChartPaint;
}

/** Convert a polar coordinate (angle in radians, measured from 12 o'clock,
 * clockwise) into an SVG cartesian point. */
function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): readonly [number, number] {
  // -π/2 rotates so 0 rad sits at the top of the circle.
  const a: number = angle - Math.PI / 2;
  return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
}

function buildSegmentPath(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep: number = endAngle - startAngle;
  const largeArc: 0 | 1 = sweep > Math.PI ? 1 : 0;

  // Full-circle case: SVG arcs can't span 360°, so render as two half-arcs
  // (or two annular halves for the donut case).
  if (sweep >= Math.PI * 2 - 1e-6) {
    const [oTopX, oTopY] = polarToCartesian(cx, cy, outerRadius, 0);
    const [oBotX, oBotY] = polarToCartesian(cx, cy, outerRadius, Math.PI);
    if (innerRadius <= 0) {
      return [
        `M ${oTopX} ${oTopY}`,
        `A ${outerRadius} ${outerRadius} 0 1 1 ${oBotX} ${oBotY}`,
        `A ${outerRadius} ${outerRadius} 0 1 1 ${oTopX} ${oTopY}`,
        "Z",
      ].join(" ");
    }
    const [iTopX, iTopY] = polarToCartesian(cx, cy, innerRadius, 0);
    const [iBotX, iBotY] = polarToCartesian(cx, cy, innerRadius, Math.PI);
    return [
      `M ${oTopX} ${oTopY}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${oBotX} ${oBotY}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${oTopX} ${oTopY}`,
      `M ${iTopX} ${iTopY}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${iBotX} ${iBotY}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${iTopX} ${iTopY}`,
      "Z",
    ].join(" ");
  }

  const [oStartX, oStartY] = polarToCartesian(
    cx,
    cy,
    outerRadius,
    startAngle,
  );
  const [oEndX, oEndY] = polarToCartesian(cx, cy, outerRadius, endAngle);

  if (innerRadius <= 0) {
    return [
      `M ${cx} ${cy}`,
      `L ${oStartX} ${oStartY}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${oEndX} ${oEndY}`,
      "Z",
    ].join(" ");
  }

  const [iStartX, iStartY] = polarToCartesian(
    cx,
    cy,
    innerRadius,
    endAngle,
  );
  const [iEndX, iEndY] = polarToCartesian(
    cx,
    cy,
    innerRadius,
    startAngle,
  );

  return [
    `M ${oStartX} ${oStartY}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${oEndX} ${oEndY}`,
    `L ${iStartX} ${iStartY}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${iEndX} ${iEndY}`,
    "Z",
  ].join(" ");
}

function PieChart({
  segments,
  label,
  size,
  innerRadius,
  diameter,
  segmentOrder,
  segmentGap = 1,
  onSegmentClick,
  formatValue = formatChartNumber,
  showTooltip = true,
  showLegend = false,
  loading = false,
  children,
  className,
  style,
  centerClassName,
  showSegmentLabels = false,
  segmentLabelFormatter,
  minSegmentLabelAngle = 0.2,
  segmentLabelClassName,
  ref,
  ...props
}: PieChartProps): ReactElement {
  const resolvedSize: PieChartSizeId = size ?? "md";
  const presetDiameter: number = SIZE_TO_PIXELS[resolvedSize];
  const chart = useChartWidth<HTMLDivElement>(
    diameter === "auto" ? "auto" : (diameter ?? presetDiameter),
    presetDiameter,
    ref,
  );
  // "auto" fits the container, up to the preset; null until measured.
  const pixelSize: number | null =
    chart.width === null
      ? null
      : chart.isAuto
        ? Math.min(chart.width, presetDiameter)
        : chart.width;
  const boxSize: number = pixelSize ?? presetDiameter;
  const cx: number = boxSize / 2;
  const cy: number = boxSize / 2;
  const outerRadius: number = boxSize / 2;
  const innerR: number = Math.max(
    0,
    Math.min(0.95, innerRadius ?? 0) * outerRadius,
  );

  const hintId: string = useId();
  const [activeState, setActive] = useState<number | null>(null);

  const validSegments: ReadonlyArray<PieChartSegment> = segments.filter(
    (s) => s.value > 0 && Number.isFinite(s.value),
  );

  const total: number = validSegments.reduce(
    (acc, s) => acc + s.value,
    0,
  );

  const colorScale: ((id: string) => ChartColorId) | null = segmentOrder
    ? createChartColorScale(segmentOrder)
    : null;

  const resolved: ReadonlyArray<ResolvedSegment> = (() => {
    if (total <= 0) return [];
    let angle: number = 0;
    return validSegments.map((segment, index) => {
      const sweep: number = (segment.value / total) * Math.PI * 2;
      const startAngle: number = angle;
      const endAngle: number = angle + sweep;
      angle = endAngle;
      const colorId: ChartColorId =
        segment.color ??
        (colorScale ? colorScale(segment.id) : getChartSeriesColorId(index));
      return {
        segment,
        index,
        startAngle,
        endAngle,
        paint: { colorId, value: segment.fill },
      };
    });
  })();
  // A stale index (the data shrank under the pointer) reads as nothing active.
  const active: number | null =
    activeState !== null && activeState < resolved.length ? activeState : null;

  const hasInteractiveSegments: boolean = resolved.some(
    (r) => typeof (r.segment.onClick ?? onSegmentClick) === "function",
  );
  const readoutEnabled: boolean = showTooltip && resolved.length > 0;
  const activeSegment: ResolvedSegment | undefined =
    active === null ? undefined : resolved[active];
  // The pie is centered in an "auto" root that may be wider than it.
  const offsetX: number =
    chart.isAuto && chart.width !== null && pixelSize !== null
      ? (chart.width - pixelSize) / 2
      : 0;

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>): void => {
    if (!readoutEnabled || event.target !== event.currentTarget) return;
    const last: number = resolved.length - 1;
    let next: number | null = active;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = active === null ? 0 : active === last ? 0 : active + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = active === null ? last : active === 0 ? last : active - 1;
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

  const labelRadius: number =
    innerR > 0 ? (innerR + outerRadius) / 2 : outerRadius * 0.65;

  const plot: ReactElement | null =
    pixelSize === null ? null : (
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox={`0 0 ${pixelSize} ${pixelSize}`}
        role={hasInteractiveSegments ? "group" : "img"}
        aria-label={label}
        aria-describedby={readoutEnabled ? hintId : undefined}
        tabIndex={readoutEnabled && !hasInteractiveSegments ? 0 : undefined}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onPointerLeave={(): void => setActive(null)}
        className="block shrink-0 overflow-visible rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {resolved.length === 0 ? (
          <circle
            cx={cx}
            cy={cy}
            r={outerRadius}
            className="fill-muted/40 dark:fill-muted/30"
          />
        ) : (
          resolved.map((r) => {
            const { segment, startAngle, endAngle, paint } = r;
            const d: string = buildSegmentPath(
              cx,
              cy,
              outerRadius,
              innerR,
              startAngle,
              endAngle,
            );
            const handler = segment.onClick ?? onSegmentClick;
            const isInteractive: boolean = typeof handler === "function";
            const dimmed: boolean = active !== null && active !== r.index;
            return (
              <path
                key={segment.id}
                d={d}
                fill={paint.value}
                stroke="hsl(var(--background))"
                strokeWidth={segmentGap}
                strokeLinejoin="round"
                data-segment-id={segment.id}
                role={isInteractive ? "button" : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                aria-label={
                  isInteractive
                    ? `${segment.label ?? segment.id}: ${formatValue(segment.value)}`
                    : undefined
                }
                onPointerEnter={
                  readoutEnabled ? (): void => setActive(r.index) : undefined
                }
                onFocus={
                  readoutEnabled ? (): void => setActive(r.index) : undefined
                }
                onClick={
                  isInteractive
                    ? (event: MouseEvent<SVGPathElement>): void => {
                        handler!(segment, event);
                      }
                    : undefined
                }
                onKeyDown={
                  isInteractive
                    ? (event: KeyboardEvent<SVGPathElement>): void => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handler!(segment, event);
                        }
                      }
                    : undefined
                }
                className={cn(
                  "transition-opacity",
                  chartPaintClass(paint, "fill"),
                  dimmed && "opacity-40",
                  isInteractive &&
                    "cursor-pointer focus:outline-none",
                  segment.className,
                )}
              />
            );
          })
        )}
        {showSegmentLabels && resolved.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="pie-chart-segment-labels"
            className="pointer-events-none select-none"
          >
            {resolved.map(({ segment, startAngle, endAngle }, index) => {
              const sweep: number = endAngle - startAngle;
              if (sweep < minSegmentLabelAngle) return null;
              const value: number = segment.value;
              const fraction: number = value / total;
              const percentage: number = fraction * 100;
              const text: string | null = segmentLabelFormatter
                ? segmentLabelFormatter({
                    segment,
                    value,
                    fraction,
                    percentage,
                    index,
                  })
                : (segment.label ?? segment.id);
              if (text === null || text === "") return null;
              const midAngle: number = (startAngle + endAngle) / 2;
              const [lx, ly] = polarToCartesian(
                cx,
                cy,
                labelRadius,
                midAngle,
              );
              return (
                <text
                  key={`${segment.id}-label`}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={cn(
                    "fill-white text-[11px] font-medium [paint-order:stroke] [stroke:rgba(0,0,0,0.35)] [stroke-width:2px]",
                    segmentLabelClassName,
                  )}
                >
                  {text}
                </text>
              );
            })}
          </g>
        ) : null}
      </svg>
    );

  const tooltipAnchor: readonly [number, number] | null = activeSegment
    ? polarToCartesian(
        cx,
        cy,
        labelRadius,
        (activeSegment.startAngle + activeSegment.endAngle) / 2,
      )
    : null;

  return (
    <div
      ref={chart.ref}
      data-slot="pie-chart"
      aria-busy={loading || undefined}
      className={cn(
        pieChartVariants({ size }),
        "h-auto flex-col items-center justify-start gap-2 transition-opacity",
        chart.isAuto && "flex w-full min-w-0 shrink",
        loading && "opacity-60",
        className,
      )}
      style={{
        ...(chart.isAuto ? chart.rootStyle : { width: boxSize }),
        ...style,
      }}
      {...props}
    >
      <div
        data-slot="pie-chart-plot"
        className="relative flex w-full shrink-0 justify-center"
        style={{ height: boxSize }}
      >
        {plot}
        {readoutEnabled && pixelSize !== null ? (
          <span id={hintId} hidden>
            Use the arrow keys to read each segment.
          </span>
        ) : null}
        {showTooltip && activeSegment && tooltipAnchor && chart.width !== null ? (
          <ChartTooltip
            x={offsetX + tooltipAnchor[0]}
            y={tooltipAnchor[1]}
            containerWidth={chart.isAuto ? chart.width : boxSize}
          >
            <ChartTooltipRow
              value={formatValue(activeSegment.segment.value)}
              label={activeSegment.segment.label ?? activeSegment.segment.id}
            />
            <div className="text-muted-foreground tabular-nums">
              {SHARE_FORMAT.format(activeSegment.segment.value / total)} of the
              total
            </div>
          </ChartTooltip>
        ) : null}
        {children ? (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 flex items-center justify-center text-center",
              centerClassName,
            )}
          >
            {children}
          </div>
        ) : null}
      </div>
      {showLegend && resolved.length > 0 && pixelSize !== null ? (
        <ChartLegend
          className="justify-center"
          items={resolved.map((r) => ({
            id: r.segment.id,
            label: r.segment.label ?? r.segment.id,
            paint: r.paint,
            swatch: "square",
          }))}
        />
      ) : null}
      {pixelSize !== null && resolved.length > 0 ? (
        <ChartDataTable
          caption={label}
          columns={["Segment", "Value", "Share"]}
          rows={resolved.map((r) => ({
            key: r.segment.id,
            cells: [
              r.segment.label ?? r.segment.id,
              formatValue(r.segment.value),
              SHARE_FORMAT.format(r.segment.value / total),
            ],
          }))}
        />
      ) : null}
    </div>
  );
}
PieChart.displayName = "PieChart";

export { PieChart };
