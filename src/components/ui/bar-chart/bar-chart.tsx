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

export const barChartSizeIds = [
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies string[];
export type BarChartSizeId = (typeof barChartSizeIds)[number];

export const barChartOrientationIds = [
  "vertical",
  "horizontal",
] as const satisfies string[];
export type BarChartOrientationId = (typeof barChartOrientationIds)[number];

export const barChartBarColorIds = [
  "default",
  "primary",
  "positive",
  "warning",
  "destructive",
  "muted",
] as const satisfies string[];
export type BarChartBarColorId = (typeof barChartBarColorIds)[number];

/** Default canvas dimensions per size. Either axis can be overridden via the
 * `width` / `height` props. */
const SIZE_TO_CANVAS: Record<
  BarChartSizeId,
  { width: number; height: number }
> = {
  sm: { width: 240, height: 140 },
  md: { width: 360, height: 200 },
  lg: { width: 480, height: 260 },
  xl: { width: 640, height: 340 },
};

const BAR_FILL_CLASSES: Record<BarChartBarColorId, string> = {
  default: "fill-schemavaults-brand-blue",
  primary: "fill-primary",
  positive: "fill-emerald-500 dark:fill-emerald-400",
  warning: "fill-warning",
  destructive: "fill-destructive",
  muted: "fill-muted-foreground",
};

/**
 * Fallback color rotation when a bar doesn't specify its own color. Index is
 * the bar position in the input array, modulo the palette length.
 */
const DEFAULT_COLOR_ROTATION: ReadonlyArray<BarChartBarColorId> = [
  "default",
  "positive",
  "warning",
  "destructive",
  "primary",
  "muted",
];

export const barChartVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      size: {
        sm: "text-[10px]",
        md: "text-[11px]",
        lg: "text-xs",
        xl: "text-sm",
      } satisfies Record<BarChartSizeId, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface BarChartBar {
  /** Stable identifier for the bar. Used as React key and click payload. */
  id: string;
  /**
   * Bar magnitude. Bar length is `value / max`. Negative and non-finite
   * values are treated as `0`.
   */
  value: number;
  /** Human-readable category label rendered along the axis. */
  label?: string;
  /** Preset color id from the chart palette. Ignored if `fill` is provided. */
  color?: BarChartBarColorId;
  /**
   * Override the fill with a raw CSS color (e.g. `"#ff0080"` or
   * `"hsl(var(--chart-1))"`). Takes precedence over `color`.
   */
  fill?: string;
  /** Extra classes applied to this bar's `<rect>`. */
  className?: string;
  /** Fired when this bar is clicked or activated via keyboard. */
  onClick?: (
    bar: BarChartBar,
    event: MouseEvent<SVGRectElement> | KeyboardEvent<SVGRectElement>,
  ) => void;
}

export interface BarChartValueLabelContext {
  bar: BarChartBar;
  value: number;
  /** Share of the scale max, in the range 0–1. */
  fraction: number;
  /** Share of the scale max, in the range 0–100. */
  percentage: number;
  index: number;
}

export interface BarChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof barChartVariants> {
  /** Bars to render, in order. */
  bars: ReadonlyArray<BarChartBar>;
  /** Accessible label describing what the chart represents. */
  label: string;
  /** Bar direction. Defaults to `"vertical"` (columns growing upward). */
  orientation?: BarChartOrientationId;
  /**
   * Upper bound of the value scale. Defaults to the largest bar value (or `1`
   * when every bar is `0`). Useful for pinning multiple charts to a shared
   * scale.
   */
  max?: number;
  /** Override the rendered canvas width in pixels (defaults are size-aware). */
  width?: number;
  /** Override the rendered canvas height in pixels (defaults are size-aware). */
  height?: number;
  /**
   * Gap between bars as a fraction of each bar's slot (0–0.9). Defaults to
   * `0.3`.
   */
  barGap?: number;
  /** Corner radius applied to the free end of every bar. Defaults to `4`. */
  cornerRadius?: number;
  /** Render the baseline axis line. Defaults to `true`. */
  showAxis?: boolean;
  /**
   * Number of evenly-spaced gridlines drawn across the value axis. `0`
   * disables gridlines. Defaults to `0`.
   */
  gridLineCount?: number;
  /** Render each bar's category `label` along the axis. Defaults to `true`. */
  showCategoryLabels?: boolean;
  /** Render a value label at the free end of each bar. Defaults to `false`. */
  showValueLabels?: boolean;
  /**
   * Customize the value-label text. Return `null` to skip a bar. Defaults to
   * the raw value (`String(value)`).
   */
  valueLabelFormatter?: (
    context: BarChartValueLabelContext,
  ) => string | null;
  /**
   * Fallback handler invoked for any bar that doesn't have its own `onClick`.
   * Receives the clicked bar.
   */
  onBarClick?: (
    bar: BarChartBar,
    event: MouseEvent<SVGRectElement> | KeyboardEvent<SVGRectElement>,
  ) => void;
  /** Optional content overlaid on top of the plot area. */
  children?: ReactNode;
  /** Extra classes for the overlay content wrapper. */
  overlayClassName?: string;
  /** Extra classes applied to every value-label `<text>` element. */
  valueLabelClassName?: string;
  /** Extra classes applied to every category-label `<text>` element. */
  categoryLabelClassName?: string;
  /** Extra classes applied to the axis / gridline `<line>` elements. */
  axisClassName?: string;
  /** Optional ref forwarded to the wrapper element. */
  ref?: Ref<HTMLDivElement>;
}

interface ResolvedBar {
  bar: BarChartBar;
  value: number;
  /** Bar rectangle in SVG user units. */
  x: number;
  y: number;
  barWidth: number;
  barHeight: number;
  /** Anchor for the value label (free end of the bar). */
  valueX: number;
  valueY: number;
  /** Anchor for the category label (along the baseline axis). */
  categoryX: number;
  categoryY: number;
  fillClass: string | undefined;
  fill: string | undefined;
}

function sanitizeValue(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function BarChart({
  bars,
  label,
  orientation = "vertical",
  max,
  size,
  width,
  height,
  barGap = 0.3,
  cornerRadius = 4,
  showAxis = true,
  gridLineCount = 0,
  showCategoryLabels = true,
  showValueLabels = false,
  valueLabelFormatter,
  onBarClick,
  children,
  className,
  overlayClassName,
  valueLabelClassName,
  categoryLabelClassName,
  axisClassName,
  ref,
  ...props
}: BarChartProps): ReactElement {
  const resolvedSize: BarChartSizeId = size ?? "md";
  const canvas = SIZE_TO_CANVAS[resolvedSize];
  const W: number = width ?? canvas.width;
  const H: number = height ?? canvas.height;

  const titleId: string = useId();

  const isHorizontal: boolean = orientation === "horizontal";
  const gap: number = Math.max(0, Math.min(0.9, barGap));

  // Reserve a gutter for category labels (along the axis) and a gutter for
  // value labels (at the free end of the bars).
  const categoryGutter: number = showCategoryLabels ? 24 : 6;
  const valueGutter: number = showValueLabels ? 28 : 6;

  const padTop: number = isHorizontal ? 6 : valueGutter;
  const padBottom: number = isHorizontal ? categoryGutter : categoryGutter;
  const padLeft: number = isHorizontal ? categoryGutter + 8 : 6;
  const padRight: number = isHorizontal ? valueGutter : 6;

  const plotX0: number = padLeft;
  const plotY0: number = padTop;
  const plotW: number = Math.max(0, W - padLeft - padRight);
  const plotH: number = Math.max(0, H - padTop - padBottom);

  const sanitized: ReadonlyArray<number> = bars.map((b) =>
    sanitizeValue(b.value),
  );
  const computedMax: number =
    max ?? Math.max(0, ...sanitized);
  const scaleMax: number = computedMax > 0 ? computedMax : 1;

  const count: number = bars.length;

  const resolved: ReadonlyArray<ResolvedBar> = (() => {
    if (count === 0) return [];
    const axisSpan: number = isHorizontal ? plotH : plotW;
    const slot: number = axisSpan / count;
    const thickness: number = slot * (1 - gap);
    const inset: number = (slot - thickness) / 2;

    return bars.map((bar, index): ResolvedBar => {
      const value: number = sanitized[index]!;
      const fraction: number = value / scaleMax;
      const presetColor: BarChartBarColorId =
        bar.color ??
        DEFAULT_COLOR_ROTATION[index % DEFAULT_COLOR_ROTATION.length]!;
      const fillClass: string | undefined = bar.fill
        ? undefined
        : BAR_FILL_CLASSES[presetColor];

      if (isHorizontal) {
        const barLength: number = fraction * plotW;
        const y: number = plotY0 + index * slot + inset;
        const x: number = plotX0;
        return {
          bar,
          value,
          x,
          y,
          barWidth: barLength,
          barHeight: thickness,
          valueX: x + barLength + 6,
          valueY: y + thickness / 2,
          categoryX: plotX0 - 8,
          categoryY: y + thickness / 2,
          fillClass,
          fill: bar.fill,
        };
      }

      const barLength: number = fraction * plotH;
      const x: number = plotX0 + index * slot + inset;
      const y: number = plotY0 + plotH - barLength;
      return {
        bar,
        value,
        x,
        y,
        barWidth: thickness,
        barHeight: barLength,
        valueX: x + thickness / 2,
        valueY: y - 6,
        categoryX: x + thickness / 2,
        categoryY: plotY0 + plotH + 14,
        fillClass,
        fill: bar.fill,
      };
    });
  })();

  const gridLines: ReadonlyArray<number> = (() => {
    if (gridLineCount <= 0) return [];
    const lines: number[] = [];
    for (let i = 1; i <= gridLineCount; i += 1) {
      lines.push(i / (gridLineCount + 1));
    }
    return lines;
  })();

  return (
    <div
      ref={ref}
      role="img"
      aria-labelledby={titleId}
      data-slot="bar-chart"
      data-orientation={orientation}
      className={cn(barChartVariants({ size }), className)}
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
            data-slot="bar-chart-gridlines"
            className="pointer-events-none"
          >
            {gridLines.map((t) => {
              if (isHorizontal) {
                const x: number = plotX0 + t * plotW;
                return (
                  <line
                    key={`grid-${t}`}
                    x1={x}
                    y1={plotY0}
                    x2={x}
                    y2={plotY0 + plotH}
                    strokeWidth={1}
                    className={cn(
                      "stroke-border/60",
                      axisClassName,
                    )}
                  />
                );
              }
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
          <line
            data-slot="bar-chart-axis"
            x1={plotX0}
            y1={isHorizontal ? plotY0 : plotY0 + plotH}
            x2={isHorizontal ? plotX0 : plotX0 + plotW}
            y2={plotY0 + plotH}
            strokeWidth={1}
            className={cn("stroke-border", axisClassName)}
          />
        ) : null}

        {resolved.length === 0 ? (
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
          resolved.map((r) => {
            const handler = r.bar.onClick ?? onBarClick;
            const isInteractive: boolean = typeof handler === "function";
            return (
              <rect
                key={r.bar.id}
                x={r.x}
                y={r.y}
                width={Math.max(0, r.barWidth)}
                height={Math.max(0, r.barHeight)}
                rx={cornerRadius}
                ry={cornerRadius}
                fill={r.fill}
                data-bar-id={r.bar.id}
                role={isInteractive ? "button" : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                aria-label={
                  r.bar.label
                    ? `${r.bar.label}: ${r.value}`
                    : `${r.bar.id}: ${r.value}`
                }
                onClick={
                  isInteractive
                    ? (event: MouseEvent<SVGRectElement>): void => {
                        handler!(r.bar, event);
                      }
                    : undefined
                }
                onKeyDown={
                  isInteractive
                    ? (event: KeyboardEvent<SVGRectElement>): void => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handler!(r.bar, event);
                        }
                      }
                    : undefined
                }
                className={cn(
                  "transition-opacity",
                  r.fillClass,
                  isInteractive &&
                    "cursor-pointer hover:opacity-80 focus:outline-none focus-visible:opacity-80",
                  r.bar.className,
                )}
              />
            );
          })
        )}

        {showCategoryLabels && resolved.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="bar-chart-category-labels"
            className="pointer-events-none select-none"
          >
            {resolved.map((r) => {
              const text: string = r.bar.label ?? r.bar.id;
              return (
                <text
                  key={`${r.bar.id}-cat`}
                  x={r.categoryX}
                  y={r.categoryY}
                  textAnchor={isHorizontal ? "end" : "middle"}
                  dominantBaseline={isHorizontal ? "central" : "auto"}
                  className={cn(
                    "fill-muted-foreground",
                    categoryLabelClassName,
                  )}
                >
                  {text}
                </text>
              );
            })}
          </g>
        ) : null}

        {showValueLabels && resolved.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="bar-chart-value-labels"
            className="pointer-events-none select-none"
          >
            {resolved.map((r, index) => {
              const fraction: number = r.value / scaleMax;
              const text: string | null = valueLabelFormatter
                ? valueLabelFormatter({
                    bar: r.bar,
                    value: r.value,
                    fraction,
                    percentage: fraction * 100,
                    index,
                  })
                : String(r.value);
              if (text === null || text === "") return null;
              return (
                <text
                  key={`${r.bar.id}-val`}
                  x={r.valueX}
                  y={r.valueY}
                  textAnchor={isHorizontal ? "start" : "middle"}
                  dominantBaseline={isHorizontal ? "central" : "auto"}
                  className={cn(
                    "fill-foreground font-medium",
                    valueLabelClassName,
                  )}
                >
                  {text}
                </text>
              );
            })}
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
BarChart.displayName = "BarChart";

export { BarChart };
