"use client";

import type { CSSProperties, ReactElement, ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface ChartTooltipProps {
  /** Anchor x in the chart container's pixels (the tooltip centers on it). */
  x: number;
  /** Anchor y in the chart container's pixels (the tooltip sits above it). */
  y: number;
  /**
   * Width of the chart container. The tooltip is clamped inside it and never
   * grows wider than it.
   */
  containerWidth: number;
  /** Gap between the anchor and the tooltip, in pixels. Defaults to `10`. */
  offset?: number;
  children: ReactNode;
  className?: string;
}

interface MeasuredSize {
  width: number;
  height: number;
}

/**
 * A floating readout drawn in HTML over a chart. Render it inside the
 * chart's `position: relative` container. It centers on its anchor, clamps
 * itself inside the container horizontally, and flips below the anchor when
 * there is no room above.
 *
 * Lead each row with the value and follow with the label: `ChartTooltipRow`
 * does that and keys each series with a short line in its colour.
 */
function ChartTooltip({
  x,
  y,
  containerWidth,
  offset = 10,
  children,
  className,
}: ChartTooltipProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<MeasuredSize | null>(null);

  // Position from the real size, measured before the browser paints and
  // again whenever the content (and so the size) changes.
  useLayoutEffect((): (() => void) | undefined => {
    const element: HTMLDivElement | null = ref.current;
    if (!element) return undefined;
    const measure = (): void => {
      const width: number = element.offsetWidth;
      const height: number = element.offsetHeight;
      setSize((current: MeasuredSize | null): MeasuredSize =>
        current && current.width === width && current.height === height
          ? current
          : { width, height },
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return (): void => {
      observer.disconnect();
    };
  }, []);

  const width: number = size?.width ?? 0;
  const height: number = size?.height ?? 0;
  const left: number = Math.min(
    Math.max(0, x - width / 2),
    Math.max(0, containerWidth - width),
  );
  const below: boolean = y - offset - height < 0;
  const top: number = below ? y + offset : y - offset - height;

  const style: CSSProperties = {
    left,
    top,
    maxWidth: Math.max(0, containerWidth),
    visibility: size ? "visible" : "hidden",
  };

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      data-slot="chart-tooltip"
      data-side={below ? "bottom" : "top"}
      className={cn(
        "pointer-events-none absolute z-10 w-max rounded-md border bg-popover px-2.5 py-1.5 text-left text-xs font-normal text-popover-foreground shadow-md",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
ChartTooltip.displayName = "ChartTooltip";

export interface ChartTooltipRowProps {
  /** The value, shown first in strong text. */
  value: ReactNode;
  /** What the value is, shown after it in muted text. */
  label?: ReactNode;
  /**
   * Classes for the series key (a short line in the series colour), e.g.
   * `getChartColorClasses("chart-2").bg`. Leave the key out on single-series
   * charts.
   */
  colorClassName?: string;
  /** A raw CSS colour for the series key; wins over `colorClassName`. */
  color?: string;
  className?: string;
}

/** One `value · label` line of a chart tooltip. */
function ChartTooltipRow({
  value,
  label,
  colorClassName,
  color,
  className,
}: ChartTooltipRowProps): ReactElement {
  const hasKey: boolean = Boolean(color || colorClassName);
  return (
    <div
      data-slot="chart-tooltip-row"
      className={cn("flex min-w-0 items-center gap-1.5 whitespace-nowrap", className)}
    >
      {hasKey ? (
        <span
          aria-hidden="true"
          className={cn(
            "inline-block h-0.5 w-3 shrink-0 rounded-full",
            color ? undefined : colorClassName,
          )}
          style={color ? { backgroundColor: color } : undefined}
        />
      ) : null}
      <span className="font-semibold tabular-nums">{value}</span>
      {label !== undefined && label !== null && label !== "" ? (
        <span className="min-w-0 truncate text-muted-foreground">{label}</span>
      ) : null}
    </div>
  );
}
ChartTooltipRow.displayName = "ChartTooltipRow";

export { ChartTooltip, ChartTooltipRow };
