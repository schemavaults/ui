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
import { useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  chartColorIds,
  chartPaintClass,
  chartPaintSwatchStyle,
  type ChartColorId,
  type ChartPaint,
} from "@/components/ui/chart-primitives/chart-colors";
import { ChartDataTable } from "@/components/ui/chart-primitives/chart-data-table";
import {
  formatChartNumber,
  formatChartTick,
} from "@/components/ui/chart-primitives/chart-format";
import {
  cleanNumber,
  estimateLabelWidth,
  niceAxis,
  niceStep,
  roundedBarPath,
} from "@/components/ui/chart-primitives/chart-scale";
import {
  ChartTooltip,
  ChartTooltipRow,
} from "@/components/ui/chart-primitives/chart-tooltip";
import {
  useChartWidth,
  type ChartWidth,
} from "@/components/ui/chart-primitives/use-chart-width";

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

/** Preset bar colours; see `chartColorIds`. */
export const barChartBarColorIds = chartColorIds;
export type BarChartBarColorId = ChartColorId;

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

/** Approximate tick-label font size per size preset, for sizing the value-axis gutter. */
const SIZE_TO_FONT_PX: Record<BarChartSizeId, number> = {
  sm: 10,
  md: 11,
  lg: 12,
  xl: 14,
};

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
  /**
   * Preset color for this bar. Defaults to the chart's `color` (slot 1):
   * the bars of one series share one colour.
   */
  color?: BarChartBarColorId;
  /**
   * Override the fill with a raw CSS color (e.g. `"#ff0080"` or
   * `"var(--chart-3)"`). Takes precedence over `color`.
   */
  fill?: string;
  /** Extra classes applied to this bar's shape. */
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

export interface BarChartTooltipContext {
  bar: BarChartBar;
  value: number;
  index: number;
  /** `formatValue(value)`. */
  formattedValue: string;
}

export interface BarChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick" | "color">,
    VariantProps<typeof barChartVariants> {
  /** Bars to render, in order. */
  bars: ReadonlyArray<BarChartBar>;
  /** Accessible label describing what the chart represents. */
  label: string;
  /** Bar direction. Defaults to `"vertical"` (columns growing upward). */
  orientation?: BarChartOrientationId;
  /**
   * Upper bound of the value scale. Defaults to the largest bar value (or `1`
   * when every bar is `0`), rounded up to a nice tick when `showValueAxis`
   * is on. Useful for pinning multiple charts to a shared scale.
   */
  max?: number;
  /**
   * Canvas width in pixels (defaults are size-aware), or `"auto"` to fill the
   * container and redraw when it resizes. An `"auto"` chart renders an empty
   * placeholder at its height until it has been measured, so the server
   * render carries no pixel width.
   */
  width?: ChartWidth;
  /** Override the rendered canvas height in pixels (defaults are size-aware). */
  height?: number;
  /**
   * Colour of every bar that names none of its own. Defaults to `"chart-1"`:
   * one series, one colour.
   */
  color?: BarChartBarColorId;
  /**
   * Gap between bars as a fraction of each bar's slot (0–0.9). Defaults to
   * `0.3`.
   */
  barGap?: number;
  /**
   * Thickest a bar may get, in pixels. Defaults to `24`; the rest of a wide
   * slot stays air. Pass `Infinity` to fill the slot.
   */
  maxBarThickness?: number;
  /** Corner radius of each bar's free end (the baseline end stays square). Defaults to `4`. */
  cornerRadius?: number;
  /** Render the baseline axis line. Defaults to `true`. */
  showAxis?: boolean;
  /**
   * Number of evenly-spaced gridlines drawn across the value axis. `0`
   * disables gridlines. Defaults to `0`.
   */
  gridLineCount?: number;
  /**
   * Render a value axis: nice tick values (0, 20, 40 …) with hairline
   * gridlines, labelled with `formatValue`. Defaults to `false`.
   */
  showValueAxis?: boolean;
  /** About how many intervals the value axis is split into. Defaults to `4`. */
  valueAxisTickCount?: number;
  /** Render each bar's category `label` along the axis. Defaults to `true`. */
  showCategoryLabels?: boolean;
  /** Render a value label at the free end of each bar. Defaults to `false`. */
  showValueLabels?: boolean;
  /**
   * Format a value for the value axis, the value labels and the tooltip.
   * Defaults to a thousands-separated number.
   */
  formatValue?: (value: number) => string;
  /**
   * Customize the value-label text. Return `null` to skip a bar. Defaults to
   * `formatValue(value)`.
   */
  valueLabelFormatter?: (
    context: BarChartValueLabelContext,
  ) => string | null;
  /** Replace the hover / focus readout's content. */
  formatTooltip?: (context: BarChartTooltipContext) => ReactNode;
  /** Hide the hover / focus readout. Defaults to `true` (shown). */
  showTooltip?: boolean;
  /**
   * Hold the current render at reduced opacity while new data loads, rather
   * than flashing a skeleton.
   */
  loading?: boolean;
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
  index: number;
  /** Bar rectangle in SVG user units. */
  x: number;
  y: number;
  barWidth: number;
  barHeight: number;
  /** The whole slot: the bar's hover / focus / click target. */
  slotX: number;
  slotY: number;
  slotWidth: number;
  slotHeight: number;
  /** Anchor for the value label (free end of the bar). */
  valueX: number;
  valueY: number;
  /** Anchor for the category label (along the baseline axis). */
  categoryX: number;
  categoryY: number;
  paint: ChartPaint;
}

function sanitizeValue(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

/** Ticks from 0 to a pinned `max` at a nice step (the last tick may sit below `max`). */
function ticksUpTo(max: number, target: number): { ticks: number[]; step: number } {
  const step: number = niceStep(max / Math.max(1, target));
  const ticks: number[] = [];
  for (let value = 0; value <= max + step * 1e-9; value += step) {
    ticks.push(cleanNumber(value));
  }
  return { ticks, step };
}

function BarChart({
  bars,
  label,
  orientation = "vertical",
  max,
  size,
  width,
  height,
  color = "chart-1",
  barGap = 0.3,
  maxBarThickness = 24,
  cornerRadius = 4,
  showAxis = true,
  gridLineCount = 0,
  showValueAxis = false,
  valueAxisTickCount = 4,
  showCategoryLabels = true,
  showValueLabels = false,
  formatValue = formatChartNumber,
  valueLabelFormatter,
  formatTooltip,
  showTooltip = true,
  loading = false,
  onBarClick,
  children,
  className,
  style,
  overlayClassName,
  valueLabelClassName,
  categoryLabelClassName,
  axisClassName,
  ref,
  ...props
}: BarChartProps): ReactElement {
  const resolvedSize: BarChartSizeId = size ?? "md";
  const canvas = SIZE_TO_CANVAS[resolvedSize];
  const chart = useChartWidth<HTMLDivElement>(width, canvas.width, ref);
  const W: number | null = chart.width;
  const H: number = height ?? canvas.height;

  const hintId: string = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeState, setActive] = useState<number | null>(null);

  const isHorizontal: boolean = orientation === "horizontal";
  const gap: number = Math.max(0, Math.min(0.9, barGap));
  const count: number = bars.length;
  // A stale index (the data shrank under the pointer) reads as nothing active.
  const active: number | null =
    activeState !== null && activeState < count ? activeState : null;

  const sanitized: ReadonlyArray<number> = bars.map((b) =>
    sanitizeValue(b.value),
  );
  const dataMax: number = Math.max(0, ...sanitized);

  // Value scale: the pinned max, else the data max (rounded up to a nice
  // tick when the value axis is drawn).
  const valueAxis: { ticks: number[]; step: number; top: number } | null =
    (() => {
      if (!showValueAxis) return null;
      if (max !== undefined && Number.isFinite(max) && max > 0) {
        return { ...ticksUpTo(max, valueAxisTickCount), top: max };
      }
      const axis = niceAxis(dataMax, valueAxisTickCount);
      return { ticks: axis.ticks, step: axis.step, top: axis.top };
    })();
  const computedMax: number = valueAxis ? valueAxis.top : (max ?? dataMax);
  const scaleMax: number = computedMax > 0 ? computedMax : 1;

  const formatTick = (value: number): string =>
    formatValue === formatChartNumber
      ? formatChartTick(value, valueAxis?.step ?? 1)
      : formatValue(value);

  // Reserve a gutter for category labels (along the axis) and a gutter for
  // value labels (at the free end of the bars).
  const fontPx: number = SIZE_TO_FONT_PX[resolvedSize];
  const categoryGutter: number = showCategoryLabels ? 24 : 6;
  const valueGutter: number = showValueLabels ? 28 : 6;
  const valueAxisGutter: number = valueAxis
    ? Math.ceil(
        Math.max(...valueAxis.ticks.map((t) => formatTick(t).length)) *
          fontPx *
          0.62,
      ) + 10
    : 0;

  const padTop: number = isHorizontal ? 6 : Math.max(valueGutter, valueAxis ? 8 : 0);
  const padBottom: number = isHorizontal
    ? Math.max(categoryGutter, valueAxis ? 20 : 0)
    : categoryGutter;
  const padLeft: number = isHorizontal
    ? categoryGutter + 8
    : Math.max(6, valueAxisGutter);
  const padRight: number = isHorizontal
    ? Math.max(valueGutter, valueAxis ? 12 : 0)
    : 6;

  const plotX0: number = padLeft;
  const plotY0: number = padTop;
  const plotW: number = Math.max(0, (W ?? 0) - padLeft - padRight);
  const plotH: number = Math.max(0, H - padTop - padBottom);

  const resolved: ReadonlyArray<ResolvedBar> = (() => {
    if (count === 0 || W === null) return [];
    const axisSpan: number = isHorizontal ? plotH : plotW;
    const slot: number = axisSpan / count;
    const thickness: number = Math.max(
      0,
      Math.min(slot * (1 - gap), maxBarThickness),
    );
    const inset: number = (slot - thickness) / 2;

    return bars.map((bar, index): ResolvedBar => {
      const value: number = sanitized[index]!;
      const fraction: number = Math.min(1, value / scaleMax);
      const paint: ChartPaint = {
        colorId: bar.color ?? color,
        value: bar.fill,
      };

      if (isHorizontal) {
        const barLength: number = fraction * plotW;
        const slotY: number = plotY0 + index * slot;
        const y: number = slotY + inset;
        const x: number = plotX0;
        return {
          bar,
          value,
          index,
          x,
          y,
          barWidth: barLength,
          barHeight: thickness,
          slotX: plotX0,
          slotY,
          slotWidth: plotW,
          slotHeight: slot,
          valueX: x + barLength + 6,
          valueY: y + thickness / 2,
          categoryX: plotX0 - 8,
          categoryY: y + thickness / 2,
          paint,
        };
      }

      const barLength: number = fraction * plotH;
      const slotX: number = plotX0 + index * slot;
      const x: number = slotX + inset;
      const y: number = plotY0 + plotH - barLength;
      return {
        bar,
        value,
        index,
        x,
        y,
        barWidth: thickness,
        barHeight: barLength,
        slotX,
        slotY: plotY0,
        slotWidth: slot,
        slotHeight: plotH,
        valueX: x + thickness / 2,
        valueY: y - 6,
        categoryX: x + thickness / 2,
        categoryY: plotY0 + plotH + 14,
        paint,
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

  // On a narrow chart show every k-th category label, so they never run
  // together (the readout and the table still name every bar).
  const categoryLabelStep: number = (() => {
    if (!showCategoryLabels || count === 0) return 1;
    const slot: number = (isHorizontal ? plotH : plotW) / count;
    if (slot <= 0) return 1;
    const needed: number = isHorizontal
      ? fontPx + 2
      : Math.max(
          ...bars.map((bar) => estimateLabelWidth(bar.label ?? bar.id, fontPx)),
        ) + 6;
    return Math.max(1, Math.ceil(needed / slot));
  })();

  const hasInteractiveBars: boolean = bars.some(
    (bar) => typeof (bar.onClick ?? onBarClick) === "function",
  );
  const activeBar: ResolvedBar | undefined =
    active === null ? undefined : resolved[active];

  const focusBar = (index: number): void => {
    const target = svgRef.current?.querySelector<SVGElement>(
      `[data-bar-index="${index}"]`,
    );
    target?.focus();
  };

  const moveActive = (key: string, from: number | null): number | null => {
    if (count === 0) return null;
    if (key === "ArrowRight" || key === "ArrowDown") {
      return from === null ? 0 : Math.min(count - 1, from + 1);
    }
    if (key === "ArrowLeft" || key === "ArrowUp") {
      return from === null ? count - 1 : Math.max(0, from - 1);
    }
    if (key === "Home") return 0;
    if (key === "End") return count - 1;
    return from;
  };

  const onSvgKeyDown = (event: KeyboardEvent<SVGSVGElement>): void => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Escape") {
      setActive(null);
      return;
    }
    const next: number | null = moveActive(event.key, active);
    if (next !== active) {
      event.preventDefault();
      setActive(next);
    }
  };

  const onSvgBlur = (event: FocusEvent<SVGSVGElement>): void => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setActive(null);
    }
  };

  const valueScale = (value: number): number =>
    isHorizontal
      ? plotX0 + (Math.min(value, scaleMax) / scaleMax) * plotW
      : plotY0 + plotH - (Math.min(value, scaleMax) / scaleMax) * plotH;

  const plot: ReactElement | null =
    W === null ? null : (
      <svg
        ref={svgRef}
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role={hasInteractiveBars ? "group" : "img"}
        aria-label={label}
        aria-describedby={count > 0 && showTooltip ? hintId : undefined}
        tabIndex={!hasInteractiveBars && count > 0 && showTooltip ? 0 : undefined}
        onKeyDown={showTooltip ? onSvgKeyDown : undefined}
        onBlur={onSvgBlur}
        onPointerLeave={(): void => setActive(null)}
        className="block h-full w-full overflow-visible rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
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
                    className={cn("stroke-border/60", axisClassName)}
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

        {valueAxis ? (
          <g
            aria-hidden="true"
            data-slot="bar-chart-value-axis"
            className="pointer-events-none select-none"
          >
            {valueAxis.ticks.map((tick) => {
              const at: number = valueScale(tick);
              return (
                <g key={`value-tick-${tick}`}>
                  {tick > 0 ? (
                    isHorizontal ? (
                      <line
                        x1={at}
                        x2={at}
                        y1={plotY0}
                        y2={plotY0 + plotH}
                        strokeWidth={1}
                        className={cn("stroke-border", axisClassName)}
                      />
                    ) : (
                      <line
                        x1={plotX0}
                        x2={plotX0 + plotW}
                        y1={at}
                        y2={at}
                        strokeWidth={1}
                        className={cn("stroke-border", axisClassName)}
                      />
                    )
                  ) : null}
                  <text
                    x={isHorizontal ? at : plotX0 - 6}
                    y={isHorizontal ? plotY0 + plotH + 14 : at}
                    textAnchor={isHorizontal ? "middle" : "end"}
                    dominantBaseline={isHorizontal ? "auto" : "central"}
                    className="fill-muted-foreground tabular-nums"
                  >
                    {formatTick(tick)}
                  </text>
                </g>
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
          <>
            <g data-slot="bar-chart-bars" className="pointer-events-none">
              {resolved.map((r) => {
                const dimmed: boolean = active !== null && active !== r.index;
                return (
                  <path
                    key={r.bar.id}
                    d={roundedBarPath(
                      r.x,
                      r.y,
                      Math.max(0, r.barWidth),
                      Math.max(0, r.barHeight),
                      cornerRadius,
                      isHorizontal ? "right" : "top",
                    )}
                    fill={r.paint.value}
                    data-slot="bar-chart-bar"
                    data-active={active === r.index ? "true" : undefined}
                    className={cn(
                      "transition-opacity",
                      chartPaintClass(r.paint, "fill"),
                      dimmed && "opacity-40",
                      r.bar.className,
                    )}
                  />
                );
              })}
            </g>
            {/* One target per bar: its whole slot, so a short bar is as easy
                to hover (and click) as a tall one. */}
            <g data-slot="bar-chart-hit-areas">
              {resolved.map((r) => {
                const handler = r.bar.onClick ?? onBarClick;
                const isInteractive: boolean = typeof handler === "function";
                return (
                  <rect
                    key={`${r.bar.id}-hit`}
                    x={r.slotX}
                    y={r.slotY}
                    width={Math.max(0, r.slotWidth)}
                    height={Math.max(0, r.slotHeight)}
                    rx={2}
                    fill="transparent"
                    strokeWidth={1.5}
                    data-bar-id={r.bar.id}
                    data-bar-index={r.index}
                    role={isInteractive ? "button" : undefined}
                    tabIndex={isInteractive ? 0 : undefined}
                    aria-hidden={isInteractive ? undefined : "true"}
                    aria-label={
                      isInteractive
                        ? `${r.bar.label ?? r.bar.id}: ${formatValue(r.value)}`
                        : undefined
                    }
                    onPointerEnter={
                      showTooltip ? (): void => setActive(r.index) : undefined
                    }
                    onFocus={
                      showTooltip ? (): void => setActive(r.index) : undefined
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
                              return;
                            }
                            if (event.key === "Escape") {
                              setActive(null);
                              return;
                            }
                            const next: number | null = moveActive(
                              event.key,
                              r.index,
                            );
                            if (next !== null && next !== r.index) {
                              event.preventDefault();
                              focusBar(next);
                            }
                          }
                        : undefined
                    }
                    className={cn(
                      "stroke-transparent",
                      isInteractive &&
                        "cursor-pointer focus:outline-none focus-visible:stroke-ring",
                    )}
                  />
                );
              })}
            </g>
          </>
        )}

        {showCategoryLabels && resolved.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="bar-chart-category-labels"
            className="pointer-events-none select-none"
          >
            {resolved.map((r) => {
              if (r.index % categoryLabelStep !== 0) return null;
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
                : formatValue(r.value);
              if (text === null || text === "") return null;
              return (
                <text
                  key={`${r.bar.id}-val`}
                  x={r.valueX}
                  y={r.valueY}
                  textAnchor={isHorizontal ? "start" : "middle"}
                  dominantBaseline={isHorizontal ? "central" : "auto"}
                  className={cn(
                    "fill-foreground font-medium tabular-nums",
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
    );

  return (
    <div
      ref={chart.ref}
      data-slot="bar-chart"
      data-orientation={orientation}
      aria-busy={loading || undefined}
      className={cn(
        barChartVariants({ size }),
        "flex-col items-stretch justify-start transition-opacity",
        chart.rootClassName,
        loading && "opacity-60",
        className,
      )}
      style={{ ...chart.rootStyle, ...style }}
      {...props}
    >
      <div
        data-slot="bar-chart-plot"
        className="relative w-full shrink-0"
        style={{ height: H }}
      >
        {plot}
        {count > 0 && showTooltip && W !== null ? (
          <span id={hintId} hidden>
            Use the arrow keys to read each bar.
          </span>
        ) : null}
        {showTooltip && activeBar && W !== null ? (
          <ChartTooltip
            x={
              isHorizontal
                ? activeBar.x + activeBar.barWidth
                : activeBar.x + activeBar.barWidth / 2
            }
            y={activeBar.y}
            containerWidth={W}
          >
            {formatTooltip ? (
              formatTooltip({
                bar: activeBar.bar,
                value: activeBar.value,
                index: activeBar.index,
                formattedValue: formatValue(activeBar.value),
              })
            ) : (
              <ChartTooltipRow
                value={formatValue(activeBar.value)}
                label={activeBar.bar.label ?? activeBar.bar.id}
              />
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
      {W !== null && count > 0 ? (
        <ChartDataTable
          caption={label}
          columns={["Category", "Value"]}
          rows={bars.map((bar, index) => ({
            key: bar.id,
            cells: [bar.label ?? bar.id, formatValue(sanitized[index]!)],
          }))}
        />
      ) : null}
    </div>
  );
}
BarChart.displayName = "BarChart";

/** A legend swatch for a bar colour, e.g. for a legend built next to several bar charts. */
export function barChartSwatchProps(
  colorId: BarChartBarColorId,
  fill?: string,
): { className: string | undefined; style: ReturnType<typeof chartPaintSwatchStyle> } {
  const paint: ChartPaint = { colorId, value: fill };
  return {
    className: chartPaintClass(paint, "bg"),
    style: chartPaintSwatchStyle(paint),
  };
}

export { BarChart };
