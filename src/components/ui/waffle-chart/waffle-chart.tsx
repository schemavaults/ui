"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  CSSProperties,
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  chartPaintClass,
  chartPaintSwatchStyle,
  createChartColorScale,
  getChartSeriesColorId,
  type ChartColorId,
  type ChartPaint,
} from "@/components/ui/chart-primitives/chart-colors";
import { ChartDataTable } from "@/components/ui/chart-primitives/chart-data-table";
import { formatChartNumber } from "@/components/ui/chart-primitives/chart-format";

import { allocateWaffleCells } from "./allocate-waffle-cells";

export const waffleChartShapeIds = [
  "rounded",
  "square",
  "circle",
] as const satisfies string[];
export type WaffleChartShapeId = (typeof waffleChartShapeIds)[number];

export const waffleChartGapIds = [
  "none",
  "sm",
  "default",
  "lg",
] as const satisfies string[];
export type WaffleChartGapId = (typeof waffleChartGapIds)[number];

export const waffleChartFillDirectionIds = [
  "row",
  "column",
] as const satisfies string[];
export type WaffleChartFillDirectionId =
  (typeof waffleChartFillDirectionIds)[number];

export const waffleChartGridVariants = cva("grid w-full", {
  variants: {
    gap: {
      none: "gap-0",
      sm: "gap-px",
      default: "gap-0.5",
      lg: "gap-1",
    } satisfies Record<WaffleChartGapId, string>,
  },
  defaultVariants: {
    gap: "default",
  },
});

export const waffleChartCellVariants = cva("aspect-square w-full", {
  variants: {
    shape: {
      rounded: "rounded-[2px]",
      square: "rounded-none",
      circle: "rounded-full",
    } satisfies Record<WaffleChartShapeId, string>,
  },
  defaultVariants: {
    shape: "rounded",
  },
});

export interface WaffleChartSegment {
  /** Stable identifier; React key, colour-scale key and click payload. */
  id: string;
  /** Label for the legend, cell titles and the data table. Defaults to `id`. */
  label?: string;
  /** Non-negative size. Non-positive and non-finite values are skipped. */
  value: number;
  /** Preset from the shared chart palette. Ignored if `fill` is set. */
  color?: ChartColorId;
  /** Raw CSS colour that overrides the preset (e.g. `"#7c3aed"`). */
  fill?: string;
}

export interface WaffleChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof waffleChartGridVariants>,
    VariantProps<typeof waffleChartCellVariants> {
  /** Segments to render, filled in order. */
  segments: ReadonlyArray<WaffleChartSegment>;
  /** Accessible name for the chart and caption of its hidden data table. */
  label: string;
  /**
   * Whole the segments are measured against. Defaults to the sum of segment
   * values. When it exceeds the sum, the leftover cells stay empty — useful
   * for "62 of 100 seats taken".
   */
  total?: number;
  /** Number of cells in the grid. Defaults to `100`, one cell per percent. */
  cells?: number;
  /** Number of columns. Defaults to `10`. */
  columns?: number;
  /**
   * `"row"` (default) fills left to right, then top to bottom; `"column"`
   * fills top to bottom, then left to right.
   */
  fillDirection?: WaffleChartFillDirectionId;
  /**
   * The full list of segment ids the chart can show, so a segment keeps its
   * colour when others are filtered out. Without it, colour follows position.
   */
  segmentOrder?: readonly string[];
  /** Render the legend below the grid. Defaults to `true`. */
  showLegend?: boolean;
  /** Show each segment's value in the legend. Defaults to `false`. */
  showLegendValues?: boolean;
  /** Show each segment's share of the total in the legend. Defaults to `true`. */
  showLegendPercentages?: boolean;
  /** Label for the empty-cell legend entry when `total` leaves a remainder. */
  remainderLabel?: string;
  /** Format a value for the legend, titles and data table. */
  formatValue?: (value: number) => string;
  /**
   * Dim every other segment while a cell or legend entry is hovered or
   * focused. Defaults to `true`.
   */
  highlightOnHover?: boolean;
  /** Fade cells in, in fill order, on mount. Respects reduced motion. Defaults to `true`. */
  animate?: boolean;
  /**
   * Makes legend entries buttons that report the segment. Cells stay
   * pointer-only so the grid is not dozens of tab stops.
   */
  onSegmentClick?: (
    segment: WaffleChartSegment,
    event: MouseEvent<HTMLElement>,
  ) => void;
  /** Extra classes for the grid element. */
  gridClassName?: string;
  /** Extra classes for the legend list. */
  legendClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

interface ResolvedWaffleSegment {
  segment: WaffleChartSegment;
  label: string;
  cellCount: number;
  paint: ChartPaint;
}

const SHARE_FORMAT: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

/** Highlight key shared by the empty cells and their legend entry. */
const REMAINDER_ID: string = "__remainder__";

/** Total stagger for the mount animation, spread over every cell. */
const ANIMATION_SPREAD_MS: number = 600;

function WaffleChart({
  segments,
  label,
  total,
  cells = 100,
  columns = 10,
  fillDirection = "row",
  segmentOrder,
  gap,
  shape,
  showLegend = true,
  showLegendValues = false,
  showLegendPercentages = true,
  remainderLabel = "Remaining",
  formatValue = formatChartNumber,
  highlightOnHover = true,
  animate = true,
  onSegmentClick,
  className,
  gridClassName,
  legendClassName,
  ref,
  ...props
}: WaffleChartProps): ReactElement {
  const [activeId, setActiveId] = useState<string | null>(null);

  const cellCount: number = Math.max(0, Math.floor(cells));
  const columnCount: number = Math.max(1, Math.floor(columns));
  const rowCount: number = Math.ceil(cellCount / columnCount);

  // Each segment keeps its position in `segments`, so its default colour
  // slot doesn't shift when an earlier segment is zero.
  const valid: ReadonlyArray<{ segment: WaffleChartSegment; slot: number }> =
    segments
      .map((segment, slot) => ({ segment, slot }))
      .filter(({ segment: s }) => Number.isFinite(s.value) && s.value > 0);

  const segmentsTotal: number = valid.reduce(
    (acc, { segment }) => acc + segment.value,
    0,
  );
  const effectiveTotal: number =
    total !== undefined && Number.isFinite(total) && total > segmentsTotal
      ? total
      : segmentsTotal;
  const remainder: number = effectiveTotal - segmentsTotal;

  const counts: number[] = allocateWaffleCells(
    valid.map(({ segment }) => segment.value),
    cellCount,
    total,
  );

  const colorScale: ((id: string) => ChartColorId) | null = segmentOrder
    ? createChartColorScale(segmentOrder)
    : null;

  const resolved: ReadonlyArray<ResolvedWaffleSegment> = valid.map(
    ({ segment, slot }, index) => ({
      segment,
      label: segment.label ?? segment.id,
      cellCount: counts[index]!,
      paint: {
        colorId:
          segment.color ??
          (colorScale ? colorScale(segment.id) : getChartSeriesColorId(slot)),
        value: segment.fill,
      },
    }),
  );

  // One entry per cell, in fill order; `null` is an empty cell.
  const cellOwners: ReadonlyArray<ResolvedWaffleSegment | null> = (() => {
    const owners: Array<ResolvedWaffleSegment | null> = [];
    for (const r of resolved) {
      for (let i = 0; i < r.cellCount; i += 1) owners.push(r);
    }
    while (owners.length < cellCount) owners.push(null);
    return owners;
  })();

  const share = (value: number): string =>
    effectiveTotal > 0 ? SHARE_FORMAT.format(value / effectiveTotal) : "—";

  const describe = (name: string, value: number): string =>
    `${name}: ${formatValue(value)} (${share(value)})`;

  const highlight = (id: string | null): void => {
    if (highlightOnHover) setActiveId(id);
  };

  const isDimmed = (id: string | null): boolean =>
    activeId !== null && id !== activeId;

  const gridStyle: CSSProperties =
    fillDirection === "column"
      ? {
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rowCount}, auto)`,
          gridAutoFlow: "column",
        }
      : { gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` };

  const legendEntry = (
    id: string,
    name: string,
    value: number,
    swatch: ReactElement,
    segment: WaffleChartSegment | null,
  ): ReactElement => {
    const body: ReactNode = (
      <>
        {swatch}
        <span className="font-medium text-foreground">{name}</span>
        {showLegendValues && (
          <span className="tabular-nums text-muted-foreground">
            {formatValue(value)}
          </span>
        )}
        {showLegendPercentages && (
          <span className="tabular-nums text-muted-foreground">
            {showLegendValues ? `(${share(value)})` : share(value)}
          </span>
        )}
      </>
    );
    const entryClass: string = cn(
      "inline-flex items-center gap-1.5 transition-opacity motion-reduce:transition-none",
      isDimmed(id) && "opacity-40",
    );
    return (
      <li
        key={id}
        data-slot="waffle-chart-legend-item"
        data-segment-id={id}
        onMouseEnter={() => highlight(id)}
        onMouseLeave={() => highlight(null)}
      >
        {segment && onSegmentClick ? (
          <button
            type="button"
            className={cn(
              entryClass,
              "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
            onClick={(event) => onSegmentClick(segment, event)}
            onFocus={() => highlight(id)}
            onBlur={() => highlight(null)}
          >
            {body}
          </button>
        ) : (
          <span className={entryClass}>{body}</span>
        )}
      </li>
    );
  };

  return (
    <div
      ref={ref}
      data-slot="waffle-chart"
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    >
      <div
        role="img"
        aria-label={`${label}: ${[
          ...resolved.map((r) => describe(r.label, r.segment.value)),
          ...(remainder > 0 ? [describe(remainderLabel, remainder)] : []),
        ].join(", ")}`}
        data-slot="waffle-chart-grid"
        className={cn(waffleChartGridVariants({ gap }), gridClassName)}
        style={gridStyle}
        onMouseLeave={() => highlight(null)}
      >
        {cellOwners.map((owner, index) => {
          const ownerId: string | null = owner
            ? owner.segment.id
            : remainder > 0
              ? REMAINDER_ID
              : null;
          return (
            <div
              key={index}
              aria-hidden="true"
              data-slot="waffle-chart-cell"
              data-segment-id={owner ? owner.segment.id : undefined}
              data-empty={owner ? undefined : ""}
              title={
                owner
                  ? describe(owner.label, owner.segment.value)
                  : remainder > 0
                    ? describe(remainderLabel, remainder)
                    : undefined
              }
              onMouseEnter={() => highlight(ownerId)}
              className={cn(
                waffleChartCellVariants({ shape }),
                "transition-opacity duration-150 motion-reduce:transition-none",
                owner ? chartPaintClass(owner.paint, "bg") : "bg-secondary",
                isDimmed(ownerId) && "opacity-25",
                animate &&
                  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-50 motion-safe:fill-mode-both motion-safe:duration-300",
              )}
              style={{
                ...(owner ? chartPaintSwatchStyle(owner.paint) : undefined),
                ...(animate && cellCount > 1
                  ? {
                      animationDelay: `${Math.round(
                        (index / (cellCount - 1)) * ANIMATION_SPREAD_MS,
                      )}ms`,
                    }
                  : undefined),
              }}
            />
          );
        })}
      </div>
      {showLegend && resolved.length > 0 && (
        <ul
          aria-label="Legend"
          data-slot="waffle-chart-legend"
          className={cn(
            "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs",
            legendClassName,
          )}
        >
          {resolved.map((r) =>
            legendEntry(
              r.segment.id,
              r.label,
              r.segment.value,
              <span
                aria-hidden="true"
                className={cn(
                  waffleChartCellVariants({ shape }),
                  "inline-block size-2.5 shrink-0",
                  chartPaintClass(r.paint, "bg"),
                )}
                style={chartPaintSwatchStyle(r.paint)}
              />,
              r.segment,
            ),
          )}
          {remainder > 0 &&
            legendEntry(
              REMAINDER_ID,
              remainderLabel,
              remainder,
              <span
                aria-hidden="true"
                className={cn(
                  waffleChartCellVariants({ shape }),
                  "inline-block size-2.5 shrink-0 bg-secondary",
                )}
              />,
              null,
            )}
        </ul>
      )}
      {resolved.length > 0 && (
        <ChartDataTable
          caption={label}
          columns={["Segment", "Value", "Share"]}
          rows={[
            ...resolved.map((r) => ({
              key: r.segment.id,
              cells: [r.label, formatValue(r.segment.value), share(r.segment.value)],
            })),
            ...(remainder > 0
              ? [
                  {
                    key: REMAINDER_ID,
                    cells: [remainderLabel, formatValue(remainder), share(remainder)],
                  },
                ]
              : []),
          ]}
        />
      )}
    </div>
  );
}
WaffleChart.displayName = "WaffleChart";

export { WaffleChart };
