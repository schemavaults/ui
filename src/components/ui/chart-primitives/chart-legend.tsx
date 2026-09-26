"use client";

import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  chartPaintClass,
  chartPaintSwatchStyle,
  type ChartPaint,
} from "./chart-colors";

/** The swatch mirrors the mark: a line for lines, a square for bars, the marker shape for points. */
export type ChartLegendSwatch =
  | "line"
  | "square"
  | "circle"
  | "triangle"
  | "diamond";

export interface ChartLegendItem {
  id: string;
  label: ReactNode;
  paint: ChartPaint;
  swatch: ChartLegendSwatch;
}

export interface ChartLegendProps {
  items: ReadonlyArray<ChartLegendItem>;
  className?: string;
}

const MARKER_PATHS: Record<"circle" | "triangle" | "diamond", string> = {
  circle: "M1 5a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z",
  triangle: "M5 0.2L9.6 8.8H0.4Z",
  diamond: "M5 0L10 5L5 10L0 5Z",
};

function Swatch({
  swatch,
  paint,
}: {
  swatch: ChartLegendSwatch;
  paint: ChartPaint;
}): ReactElement {
  if (swatch === "line" || swatch === "square") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-block shrink-0",
          swatch === "line" ? "h-0.5 w-4 rounded-full" : "size-2.5 rounded-[2px]",
          chartPaintClass(paint, "bg"),
        )}
        style={chartPaintSwatchStyle(paint)}
      />
    );
  }
  return (
    <svg
      aria-hidden="true"
      width={10}
      height={10}
      viewBox="0 0 10 10"
      className="shrink-0"
    >
      <path
        d={MARKER_PATHS[swatch]}
        fill={paint.value}
        className={chartPaintClass(paint, "fill")}
      />
    </svg>
  );
}

/** A wrapping row of series keys for a chart with two or more series. */
function ChartLegend({ items, className }: ChartLegendProps): ReactElement {
  return (
    <ul
      aria-label="Legend"
      data-slot="chart-legend"
      className={cn(
        "flex flex-row flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground",
        className,
      )}
    >
      {items.map(
        (item: ChartLegendItem): ReactElement => (
          <li key={item.id} className="flex min-w-0 items-center gap-1.5">
            <Swatch swatch={item.swatch} paint={item.paint} />
            <span className="truncate">{item.label}</span>
          </li>
        ),
      )}
    </ul>
  );
}
ChartLegend.displayName = "ChartLegend";

export { ChartLegend };
