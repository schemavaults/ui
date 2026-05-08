"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, Ref } from "react";
import { useId } from "react";

import { cn } from "@/lib/utils";

export const sparklineVariantIds = ["line", "area", "bar"] as const satisfies string[];
export type SparklineVariantId = (typeof sparklineVariantIds)[number];

export const sparklineColorIds = [
  "default",
  "primary",
  "positive",
  "warning",
  "destructive",
  "muted",
  "auto",
] as const satisfies string[];
export type SparklineColorId = (typeof sparklineColorIds)[number];

export const sparklineSizeIds = ["sm", "md", "lg"] as const satisfies string[];
export type SparklineSizeId = (typeof sparklineSizeIds)[number];

const SIZE_TO_DIMENSIONS: Record<
  SparklineSizeId,
  { width: number; height: number }
> = {
  sm: { width: 80, height: 24 },
  md: { width: 120, height: 36 },
  lg: { width: 180, height: 56 },
};

export const sparklineVariants = cva(
  "inline-flex shrink-0 items-center align-middle",
  {
    variants: {
      size: {
        sm: "h-6",
        md: "h-9",
        lg: "h-14",
      } satisfies Record<SparklineSizeId, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const SPARKLINE_STROKE_CLASSES: Record<
  Exclude<SparklineColorId, "auto">,
  string
> = {
  default: "stroke-schemavaults-brand-blue",
  primary: "stroke-primary",
  positive: "stroke-emerald-500 dark:stroke-emerald-400",
  warning: "stroke-warning",
  destructive: "stroke-destructive",
  muted: "stroke-muted-foreground",
};

const SPARKLINE_FILL_CLASSES: Record<
  Exclude<SparklineColorId, "auto">,
  string
> = {
  default: "text-schemavaults-brand-blue",
  primary: "text-primary",
  positive: "text-emerald-500 dark:text-emerald-400",
  warning: "text-warning",
  destructive: "text-destructive",
  muted: "text-muted-foreground",
};

const SPARKLINE_BAR_FILL_CLASSES: Record<
  Exclude<SparklineColorId, "auto">,
  string
> = {
  default: "fill-schemavaults-brand-blue",
  primary: "fill-primary",
  positive: "fill-emerald-500 dark:fill-emerald-400",
  warning: "fill-warning",
  destructive: "fill-destructive",
  muted: "fill-muted-foreground",
};

function resolveAutoColor(data: ReadonlyArray<number>): SparklineColorId {
  if (data.length < 2) return "default";
  const first: number = data[0]!;
  const last: number = data[data.length - 1]!;
  if (last > first) return "positive";
  if (last < first) return "destructive";
  return "muted";
}

function buildLinePath(
  points: ReadonlyArray<readonly [number, number]>,
): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  const [fx, fy] = first!;
  let d: string = `M ${fx.toFixed(2)} ${fy.toFixed(2)}`;
  for (const [x, y] of rest) {
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

function buildAreaPath(
  points: ReadonlyArray<readonly [number, number]>,
  height: number,
): string {
  if (points.length === 0) return "";
  const linePath: string = buildLinePath(points);
  const last: readonly [number, number] = points[points.length - 1]!;
  const first: readonly [number, number] = points[0]!;
  return `${linePath} L ${last[0].toFixed(2)} ${height.toFixed(2)} L ${first[0].toFixed(2)} ${height.toFixed(2)} Z`;
}

export interface SparklineProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof sparklineVariants> {
  /** Numeric data points to plot, in order. */
  data: ReadonlyArray<number>;
  /** Visual style: continuous line, filled area, or bars. */
  variant?: SparklineVariantId;
  /**
   * Color for the line/area/bars. `auto` infers from the trend
   * (positive if up, destructive if down, muted if flat).
   */
  color?: SparklineColorId;
  /** Accessible label describing what the sparkline represents. */
  label: string;
  /** Override the rendered width in pixels (defaults are size-aware). */
  width?: number;
  /** Override the rendered height in pixels (defaults are size-aware). */
  height?: number;
  /** Stroke width for line/area variants. Defaults to 1.5. */
  strokeWidth?: number;
  /** Show a dot at the last data point (line/area only). Defaults to true. */
  showLastPoint?: boolean;
  /** Render a filled gradient under area variant. Defaults to true. */
  gradient?: boolean;
  /**
   * Show a horizontal baseline at the minimum value of the dataset.
   * Defaults to false.
   */
  showBaseline?: boolean;
  /** Override the minimum value of the y-axis (defaults to data min). */
  min?: number;
  /** Override the maximum value of the y-axis (defaults to data max). */
  max?: number;
  /** Optional ref forwarded to the wrapper element. */
  ref?: Ref<HTMLDivElement>;
}

function Sparkline({
  data,
  variant = "line",
  color = "default",
  label,
  size,
  width,
  height,
  strokeWidth = 1.5,
  showLastPoint = true,
  gradient = true,
  showBaseline = false,
  min,
  max,
  className,
  ref,
  ...props
}: SparklineProps): ReactElement {
  const resolvedSize: SparklineSizeId = size ?? "md";
  const dims = SIZE_TO_DIMENSIONS[resolvedSize];
  const w: number = width ?? dims.width;
  const h: number = height ?? dims.height;

  const resolvedColor: Exclude<SparklineColorId, "auto"> =
    color === "auto"
      ? (resolveAutoColor(data) as Exclude<SparklineColorId, "auto">)
      : color;

  const gradientId: string = useId();

  if (data.length === 0) {
    return (
      <div
        ref={ref}
        role="img"
        aria-label={label}
        data-slot="sparkline"
        data-variant={variant}
        data-color={resolvedColor}
        className={cn(sparklineVariants({ size }), className)}
        style={{ width: w, height: h }}
        {...props}
      >
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          aria-hidden="true"
        />
      </div>
    );
  }

  const dataMin: number = min ?? Math.min(...data);
  const dataMax: number = max ?? Math.max(...data);
  const range: number = dataMax - dataMin || 1;

  // Inset to keep strokes/dots fully visible inside the viewBox.
  const inset: number = Math.max(strokeWidth, 2);
  const innerWidth: number = Math.max(0, w - inset * 2);
  const innerHeight: number = Math.max(0, h - inset * 2);

  const xStep: number =
    data.length === 1 ? 0 : innerWidth / (data.length - 1);

  const points: ReadonlyArray<readonly [number, number]> = data.map(
    (value, index) => {
      const x: number =
        data.length === 1 ? inset + innerWidth / 2 : inset + index * xStep;
      const normalized: number = (value - dataMin) / range;
      const y: number = inset + innerHeight * (1 - normalized);
      return [x, y] as const;
    },
  );

  const lastPoint: readonly [number, number] = points[points.length - 1]!;

  const strokeClass: string = SPARKLINE_STROKE_CLASSES[resolvedColor];
  const fillClass: string = SPARKLINE_FILL_CLASSES[resolvedColor];
  const barFillClass: string = SPARKLINE_BAR_FILL_CLASSES[resolvedColor];

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      data-slot="sparkline"
      data-variant={variant}
      data-color={resolvedColor}
      className={cn(sparklineVariants({ size }), className)}
      style={{ width: w, height: h }}
      {...props}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        className="overflow-visible"
      >
        {variant === "area" && gradient ? (
          <defs>
            <linearGradient
              id={gradientId}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              className={fillClass}
            >
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
        ) : null}

        {showBaseline ? (
          <line
            x1={inset}
            x2={w - inset}
            y1={h - inset}
            y2={h - inset}
            className="stroke-border"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
        ) : null}

        {variant === "bar" ? (
          (() => {
            const gap: number = data.length > 32 ? 1 : 2;
            const totalGap: number = gap * Math.max(0, data.length - 1);
            const barWidth: number = Math.max(
              1,
              (innerWidth - totalGap) / Math.max(1, data.length),
            );
            const minHeight: number = 1;
            return (
              <g className={barFillClass}>
                {data.map((value, index) => {
                  const normalized: number = (value - dataMin) / range;
                  const barHeight: number = Math.max(
                    minHeight,
                    innerHeight * normalized,
                  );
                  const x: number =
                    inset + index * (barWidth + gap);
                  const y: number = inset + (innerHeight - barHeight);
                  return (
                    <rect
                      key={index}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx={Math.min(1.5, barWidth / 2)}
                    />
                  );
                })}
              </g>
            );
          })()
        ) : null}

        {variant === "area" ? (
          <path
            d={buildAreaPath(points, h - inset)}
            fill={gradient ? `url(#${gradientId})` : "currentColor"}
            fillOpacity={gradient ? 1 : 0.2}
            stroke="none"
            className={fillClass}
          />
        ) : null}

        {variant !== "bar" ? (
          <path
            d={buildLinePath(points)}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={strokeClass}
          />
        ) : null}

        {variant !== "bar" && showLastPoint ? (
          <circle
            cx={lastPoint[0]}
            cy={lastPoint[1]}
            r={Math.max(strokeWidth + 0.5, 2)}
            className={cn(fillClass, "fill-current")}
            stroke="hsl(var(--background))"
            strokeWidth={1}
          />
        ) : null}
      </svg>
    </div>
  );
}
Sparkline.displayName = "Sparkline";

export { Sparkline };
