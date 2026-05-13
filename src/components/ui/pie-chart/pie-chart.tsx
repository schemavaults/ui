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

export const pieChartSizeIds = [
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies string[];
export type PieChartSizeId = (typeof pieChartSizeIds)[number];

export const pieChartSegmentColorIds = [
  "default",
  "primary",
  "positive",
  "warning",
  "destructive",
  "muted",
] as const satisfies string[];
export type PieChartSegmentColorId = (typeof pieChartSegmentColorIds)[number];

const SIZE_TO_PIXELS: Record<PieChartSizeId, number> = {
  sm: 96,
  md: 160,
  lg: 224,
  xl: 320,
};

const SEGMENT_FILL_CLASSES: Record<PieChartSegmentColorId, string> = {
  default: "fill-schemavaults-brand-blue",
  primary: "fill-primary",
  positive: "fill-emerald-500 dark:fill-emerald-400",
  warning: "fill-warning",
  destructive: "fill-destructive",
  muted: "fill-muted-foreground",
};

/**
 * Fallback color rotation when a segment doesn't specify its own color. Index
 * is the segment position in the input array, modulo the palette length.
 */
const DEFAULT_COLOR_ROTATION: ReadonlyArray<PieChartSegmentColorId> = [
  "default",
  "positive",
  "warning",
  "destructive",
  "primary",
  "muted",
];

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
  /** Preset color id from the chart palette. Ignored if `fill` is provided. */
  color?: PieChartSegmentColorId;
  /**
   * Override the fill with a raw CSS color (e.g. `"#ff0080"` or
   * `"hsl(var(--chart-1))"`). Takes precedence over `color`.
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
  /** Override the rendered diameter in pixels (defaults are size-aware). */
  diameter?: number;
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
  /** Optional ref forwarded to the wrapper element. */
  ref?: Ref<HTMLDivElement>;
}

interface ResolvedSegment {
  segment: PieChartSegment;
  startAngle: number;
  endAngle: number;
  fillClass: string | undefined;
  fill: string | undefined;
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
  segmentGap = 1,
  onSegmentClick,
  children,
  className,
  centerClassName,
  ref,
  ...props
}: PieChartProps): ReactElement {
  const resolvedSize: PieChartSizeId = size ?? "md";
  const pixelSize: number = diameter ?? SIZE_TO_PIXELS[resolvedSize];
  const cx: number = pixelSize / 2;
  const cy: number = pixelSize / 2;
  const outerRadius: number = pixelSize / 2;
  const innerR: number = Math.max(
    0,
    Math.min(0.95, innerRadius ?? 0) * outerRadius,
  );

  const titleId: string = useId();

  const validSegments: ReadonlyArray<PieChartSegment> = segments.filter(
    (s) => s.value > 0 && Number.isFinite(s.value),
  );

  const total: number = validSegments.reduce(
    (acc, s) => acc + s.value,
    0,
  );

  const resolved: ReadonlyArray<ResolvedSegment> = (() => {
    if (total <= 0) return [];
    let angle: number = 0;
    return validSegments.map((segment, index) => {
      const sweep: number = (segment.value / total) * Math.PI * 2;
      const startAngle: number = angle;
      const endAngle: number = angle + sweep;
      angle = endAngle;
      const presetColor: PieChartSegmentColorId =
        segment.color ??
        DEFAULT_COLOR_ROTATION[index % DEFAULT_COLOR_ROTATION.length]!;
      const fillClass: string | undefined = segment.fill
        ? undefined
        : SEGMENT_FILL_CLASSES[presetColor];
      return {
        segment,
        startAngle,
        endAngle,
        fillClass,
        fill: segment.fill,
      };
    });
  })();

  return (
    <div
      ref={ref}
      role="img"
      aria-labelledby={titleId}
      data-slot="pie-chart"
      className={cn(pieChartVariants({ size }), className)}
      style={{ width: pixelSize, height: pixelSize }}
      {...props}
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox={`0 0 ${pixelSize} ${pixelSize}`}
        aria-hidden={children ? "true" : undefined}
        className="h-full w-full overflow-visible"
      >
        <title id={titleId}>{label}</title>
        {resolved.length === 0 ? (
          <circle
            cx={cx}
            cy={cy}
            r={outerRadius}
            className="fill-muted/40 dark:fill-muted/30"
          />
        ) : (
          resolved.map(({ segment, startAngle, endAngle, fillClass, fill }) => {
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
            return (
              <path
                key={segment.id}
                d={d}
                fill={fill}
                stroke="hsl(var(--background))"
                strokeWidth={segmentGap}
                strokeLinejoin="round"
                data-segment-id={segment.id}
                role={isInteractive ? "button" : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                aria-label={segment.label ?? segment.id}
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
                  fillClass,
                  isInteractive &&
                    "cursor-pointer hover:opacity-80 focus:outline-none focus-visible:opacity-80",
                  segment.className,
                )}
              />
            );
          })
        )}
      </svg>
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
  );
}
PieChart.displayName = "PieChart";

export { PieChart };
