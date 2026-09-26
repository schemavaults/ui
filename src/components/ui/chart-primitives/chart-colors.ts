import type { CSSProperties } from "react";

/**
 * The categorical chart palette from `@schemavaults/theme` (0.29.0+):
 * `--chart-1` … `--chart-8` for series in slot order, and `--chart-other`
 * for the de-emphasis grey.
 *
 * Every reference carries the light-mode value as its `var()` fallback, so a
 * chart still draws the right hues against an older `globals.css` that does
 * not define the tokens yet (it just keeps the light steps in dark mode).
 *
 * Slots are assigned in order and never cycled: a series past the last slot
 * is painted `"other"`. Colour follows the series id, not its position, when
 * a chart is given its full `seriesOrder`.
 */

export const chartSeriesColorIds = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
  "chart-7",
  "chart-8",
] as const satisfies string[];
export type ChartSeriesColorId = (typeof chartSeriesColorIds)[number];

/**
 * Every preset a chart mark can be painted with:
 * - `chart-1` … `chart-8`: the categorical series slots (identity)
 * - `other`: the de-emphasis grey for folded tails and overflow buckets
 * - `default`: slot 1, the colour a single-series chart uses
 * - `brand`: the SchemaVaults brand blue, as an explicit choice
 * - `positive`, `warning`, `destructive`: status colours, for series that
 *   mean good or bad (pair them with a label; never rely on hue alone)
 * - `primary`, `muted`: theme ink
 */
export const chartColorIds = [
  ...chartSeriesColorIds,
  "other",
  "default",
  "brand",
  "primary",
  "positive",
  "warning",
  "destructive",
  "muted",
] as const satisfies string[];
export type ChartColorId = (typeof chartColorIds)[number];

/** The palette's size; a ninth series folds into `"other"`. */
export const CHART_SERIES_SLOT_COUNT: number = chartSeriesColorIds.length;

/** The series colours as CSS values, for custom charts and legends. */
export const CHART_SERIES_COLORS: readonly string[] = [
  "var(--chart-1, #2a78d6)",
  "var(--chart-2, #eb6834)",
  "var(--chart-3, #1baf7a)",
  "var(--chart-4, #eda100)",
  "var(--chart-5, #e87ba4)",
  "var(--chart-6, #008300)",
  "var(--chart-7, #4a3aa7)",
  "var(--chart-8, #e34948)",
];

/** The de-emphasis grey as a CSS value. */
export const CHART_OTHER_COLOR: string = "var(--chart-other, #898781)";

export interface ChartColorClasses {
  /** SVG fill (`fill-*`). */
  fill: string;
  /** SVG stroke (`stroke-*`). */
  stroke: string;
  /** HTML background (`bg-*`), for legend swatches and tooltip keys. */
  bg: string;
  /** Text colour (`text-*`), for `currentColor` gradients. Never for labels. */
  text: string;
}

// Written out in full so Tailwind finds every class when it scans the
// package; the arbitrary values keep working against a theme that predates
// the chart tokens.
const CHART_COLOR_CLASSES: Record<ChartColorId, ChartColorClasses> = {
  "chart-1": {
    fill: "fill-[color:var(--chart-1,#2a78d6)]",
    stroke: "stroke-[color:var(--chart-1,#2a78d6)]",
    bg: "bg-[color:var(--chart-1,#2a78d6)]",
    text: "text-[color:var(--chart-1,#2a78d6)]",
  },
  "chart-2": {
    fill: "fill-[color:var(--chart-2,#eb6834)]",
    stroke: "stroke-[color:var(--chart-2,#eb6834)]",
    bg: "bg-[color:var(--chart-2,#eb6834)]",
    text: "text-[color:var(--chart-2,#eb6834)]",
  },
  "chart-3": {
    fill: "fill-[color:var(--chart-3,#1baf7a)]",
    stroke: "stroke-[color:var(--chart-3,#1baf7a)]",
    bg: "bg-[color:var(--chart-3,#1baf7a)]",
    text: "text-[color:var(--chart-3,#1baf7a)]",
  },
  "chart-4": {
    fill: "fill-[color:var(--chart-4,#eda100)]",
    stroke: "stroke-[color:var(--chart-4,#eda100)]",
    bg: "bg-[color:var(--chart-4,#eda100)]",
    text: "text-[color:var(--chart-4,#eda100)]",
  },
  "chart-5": {
    fill: "fill-[color:var(--chart-5,#e87ba4)]",
    stroke: "stroke-[color:var(--chart-5,#e87ba4)]",
    bg: "bg-[color:var(--chart-5,#e87ba4)]",
    text: "text-[color:var(--chart-5,#e87ba4)]",
  },
  "chart-6": {
    fill: "fill-[color:var(--chart-6,#008300)]",
    stroke: "stroke-[color:var(--chart-6,#008300)]",
    bg: "bg-[color:var(--chart-6,#008300)]",
    text: "text-[color:var(--chart-6,#008300)]",
  },
  "chart-7": {
    fill: "fill-[color:var(--chart-7,#4a3aa7)]",
    stroke: "stroke-[color:var(--chart-7,#4a3aa7)]",
    bg: "bg-[color:var(--chart-7,#4a3aa7)]",
    text: "text-[color:var(--chart-7,#4a3aa7)]",
  },
  "chart-8": {
    fill: "fill-[color:var(--chart-8,#e34948)]",
    stroke: "stroke-[color:var(--chart-8,#e34948)]",
    bg: "bg-[color:var(--chart-8,#e34948)]",
    text: "text-[color:var(--chart-8,#e34948)]",
  },
  other: {
    fill: "fill-[color:var(--chart-other,#898781)]",
    stroke: "stroke-[color:var(--chart-other,#898781)]",
    bg: "bg-[color:var(--chart-other,#898781)]",
    text: "text-[color:var(--chart-other,#898781)]",
  },
  default: {
    fill: "fill-[color:var(--chart-1,#2a78d6)]",
    stroke: "stroke-[color:var(--chart-1,#2a78d6)]",
    bg: "bg-[color:var(--chart-1,#2a78d6)]",
    text: "text-[color:var(--chart-1,#2a78d6)]",
  },
  brand: {
    fill: "fill-schemavaults-brand-blue",
    stroke: "stroke-schemavaults-brand-blue",
    bg: "bg-schemavaults-brand-blue",
    text: "text-schemavaults-brand-blue",
  },
  primary: {
    fill: "fill-primary",
    stroke: "stroke-primary",
    bg: "bg-primary",
    text: "text-primary",
  },
  positive: {
    fill: "fill-emerald-500 dark:fill-emerald-400",
    stroke: "stroke-emerald-500 dark:stroke-emerald-400",
    bg: "bg-emerald-500 dark:bg-emerald-400",
    text: "text-emerald-500 dark:text-emerald-400",
  },
  warning: {
    fill: "fill-warning",
    stroke: "stroke-warning",
    bg: "bg-warning",
    text: "text-warning",
  },
  destructive: {
    fill: "fill-destructive",
    stroke: "stroke-destructive",
    bg: "bg-destructive",
    text: "text-destructive",
  },
  muted: {
    fill: "fill-muted-foreground",
    stroke: "stroke-muted-foreground",
    bg: "bg-muted-foreground",
    text: "text-muted-foreground",
  },
};

/** The Tailwind classes that paint a preset colour onto a mark or swatch. */
export function getChartColorClasses(colorId: ChartColorId): ChartColorClasses {
  return CHART_COLOR_CLASSES[colorId];
}

/**
 * The preset for the series in position `index` (0-based) when it names no
 * colour of its own: slot `index + 1`, or `"other"` once the palette (or
 * `maxSlots`, for charts that may colour fewer series) is used up.
 */
export function getChartSeriesColorId(
  index: number,
  maxSlots: number = CHART_SERIES_SLOT_COUNT,
): ChartColorId {
  const slots: number = Math.max(0, Math.min(maxSlots, CHART_SERIES_SLOT_COUNT));
  if (!Number.isInteger(index) || index < 0 || index >= slots) return "other";
  return chartSeriesColorIds[index]!;
}

/**
 * Colour follows the entity: maps each id to the slot of its position in
 * `seriesIds`, the full, unfiltered list of everything the chart can show.
 * Filtering a series out of the chart then never repaints the others, and
 * an id the list does not know is painted `"other"`.
 */
export function createChartColorScale(
  seriesIds: readonly string[],
  maxSlots: number = CHART_SERIES_SLOT_COUNT,
): (id: string) => ChartColorId {
  const slotById: Map<string, number> = new Map();
  for (const id of seriesIds) {
    if (!slotById.has(id)) slotById.set(id, slotById.size);
  }
  return (id: string): ChartColorId => {
    const slot: number | undefined = slotById.get(id);
    return slot === undefined ? "other" : getChartSeriesColorId(slot, maxSlots);
  };
}

/** How a mark is painted: a preset through classes, or a raw CSS colour. */
export interface ChartPaint {
  colorId: ChartColorId;
  /** A raw CSS colour that overrides the preset. */
  value?: string;
}

/** The class that paints `part` of a mark, or `undefined` when a raw colour wins. */
export function chartPaintClass(
  paint: ChartPaint,
  part: keyof ChartColorClasses,
): string | undefined {
  return paint.value ? undefined : CHART_COLOR_CLASSES[paint.colorId][part];
}

/** Inline style for an HTML swatch of `paint` (legend, tooltip key). */
export function chartPaintSwatchStyle(
  paint: ChartPaint,
): CSSProperties | undefined {
  return paint.value ? { backgroundColor: paint.value } : undefined;
}
