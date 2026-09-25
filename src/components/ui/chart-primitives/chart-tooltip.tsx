"use client";

import type { CSSProperties, ReactElement, ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";

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

/**
 * A floating readout drawn in HTML over a chart. Render it inside the
 * chart's `position: relative` container. It centers on its anchor, clamps
 * itself inside the container horizontally, and flips below the anchor when
 * there is no room above.
 *
 * Lead each row with the value and follow with the label: `ChartTooltipRow`
 * does that and keys each series with a short line in its colour.
 *
 * It is visual only (`aria-hidden`): pair it with a `ChartLiveRegion` that
 * announces keyboard moves, since a live region that mounts together with
 * its text is not read out.
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

  // Position from the rendered size on every render, before the browser
  // paints, so a readout whose content changed never shows a frame at the
  // old width. React never sets left/top/visibility itself, so the values
  // written here stick.
  useLayoutEffect((): void => {
    const element: HTMLDivElement | null = ref.current;
    if (!element) return;
    const width: number = element.offsetWidth;
    const height: number = element.offsetHeight;
    const left: number = Math.min(
      Math.max(0, x - width / 2),
      Math.max(0, containerWidth - width),
    );
    const below: boolean = y - offset - height < 0;
    element.style.left = `${left}px`;
    element.style.top = `${below ? y + offset : y - offset - height}px`;
    element.style.visibility = "visible";
    element.dataset["side"] = below ? "bottom" : "top";
  });

  const style: CSSProperties = { maxWidth: Math.max(0, containerWidth) };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="chart-tooltip"
      className={cn(
        "pointer-events-none invisible absolute left-0 top-0 z-10 w-max rounded-md border bg-popover px-2.5 py-1.5 text-left text-xs font-normal text-popover-foreground shadow-md",
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

export interface ChartLiveRegionProps {
  /** What to announce; an empty string says nothing. */
  message: string;
}

/**
 * A visually hidden, always-mounted `role="status"` region: charts put their
 * keyboard readout here so screen readers announce each arrow-key move.
 * Keep it mounted (empty) between moves; don't feed it pointer hovers.
 */
function ChartLiveRegion({ message }: ChartLiveRegionProps): ReactElement {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-slot="chart-live-region"
      className="sr-only"
    >
      {message}
    </span>
  );
}
ChartLiveRegion.displayName = "ChartLiveRegion";

export { ChartTooltip, ChartTooltipRow, ChartLiveRegion };
