"use client";

import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";

import { cn } from "@/lib/utils";
import {
  chartPaintClass,
  chartPaintSwatchStyle,
  type ChartColorId,
  type ChartPaint,
} from "@/components/ui/chart-primitives/chart-colors";
import { formatChartNumber } from "@/components/ui/chart-primitives/chart-format";

export interface BarListItem {
  /** Stable identifier. Used as React key, selection id and select payload. */
  id: string;
  /** The row's name, truncated to one line (the full text is in its tooltip). */
  label: string;
  /** Bar length is `value / max`. Negative and non-finite values count as `0`. */
  value: number;
  /** The value as shown at the end of the row. Defaults to `formatValue(value)`. */
  valueLabel?: ReactNode;
  /** Secondary detail beside the bar (e.g. "1,204 calls"). */
  detail?: ReactNode;
}

export interface BarListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect" | "color"> {
  /** Rows, in the order to show them (usually largest first). */
  items: ReadonlyArray<BarListItem>;
  /** Accessible name of the list. */
  label: string;
  /** Colour of every bar: one series, one colour. Defaults to `"chart-1"`. */
  color?: ChartColorId;
  /** A raw CSS colour for the bars; wins over `color`. */
  fill?: string;
  /**
   * Upper bound of the shared scale. Defaults to the largest value; pass the
   * same `max` to several lists to compare them.
   */
  max?: number;
  /** Format a value for the end of its row. Defaults to a thousands-separated number. */
  formatValue?: (value: number) => string;
  /**
   * Called when a row is clicked or toggled from the keyboard. Rows render
   * as buttons (with `aria-pressed`) when it is set.
   */
  onSelect?: (item: BarListItem) => void;
  /** Ids of the rows to show as selected (pressed). */
  selectedIds?: ReadonlyArray<string>;
  /** Shown instead of the list when there are no items. */
  emptyMessage?: ReactNode;
  /** Extra classes for every row label (e.g. `font-mono` for code names). */
  labelClassName?: string;
  /**
   * Hold the current render at reduced opacity while new data loads, rather
   * than flashing a skeleton.
   */
  loading?: boolean;
  /** Optional ref forwarded to the wrapper element. */
  ref?: Ref<HTMLDivElement>;
}

function sanitizeValue(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/**
 * A ranked list of horizontal bars on one shared scale, in plain HTML, for
 * rankings whose names are too long for a chart axis (endpoints, operations,
 * pages). Each row puts the name on top, truncated to one line, with the
 * value right-aligned at the row's end, and a thin bar underneath.
 *
 * With `onSelect`, rows become toggle buttons (Tab to reach, Enter or Space
 * to toggle), e.g. for click-to-filter.
 */
function BarList({
  items,
  label,
  color = "chart-1",
  fill,
  max,
  formatValue = formatChartNumber,
  onSelect,
  selectedIds = [],
  emptyMessage = "No data",
  labelClassName,
  loading = false,
  className,
  ref,
  ...props
}: BarListProps): ReactElement {
  const values: number[] = items.map((item) => sanitizeValue(item.value));
  const scaleMax: number =
    max !== undefined && Number.isFinite(max) && max > 0
      ? max
      : Math.max(0, ...values);
  const paint: ChartPaint = { colorId: color, value: fill };

  return (
    <div
      ref={ref}
      data-slot="bar-list"
      aria-busy={loading || undefined}
      className={cn(
        "w-full min-w-0 transition-opacity",
        loading && "opacity-60",
        className,
      )}
      {...props}
    >
      {items.length === 0 ? (
        <p className="flex min-h-24 items-center justify-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <ol aria-label={label} className="flex flex-col gap-1">
          {items.map((item, index): ReactElement => {
            const value: number = values[index]!;
            const fraction: number =
              scaleMax > 0 ? Math.min(1, value / scaleMax) : 0;
            // A non-zero value always shows at least a sliver of bar.
            const percent: number =
              value > 0 ? Math.max(fraction * 100, 1) : 0;
            const selected: boolean = selectedIds.includes(item.id);
            const content: ReactElement = (
              <>
                <span className="flex w-full min-w-0 items-baseline justify-between gap-3">
                  <span
                    className={cn("min-w-0 truncate text-sm", labelClassName)}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {item.valueLabel ?? formatValue(value)}
                  </span>
                </span>
                <span className="flex w-full items-center gap-2">
                  <span className="block h-2 min-w-0 flex-1">
                    <span
                      data-slot="bar-list-bar"
                      className={cn(
                        "block h-2 rounded-r-[4px]",
                        chartPaintClass(paint, "bg"),
                      )}
                      style={{
                        width: `${percent}%`,
                        ...chartPaintSwatchStyle(paint),
                      }}
                    />
                  </span>
                  {item.detail !== undefined && item.detail !== null ? (
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {item.detail}
                    </span>
                  ) : null}
                </span>
              </>
            );
            return (
              <li key={item.id} data-slot="bar-list-item">
                {onSelect ? (
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={(): void => onSelect(item)}
                    className={cn(
                      "flex w-full flex-col gap-1 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected && "bg-muted",
                    )}
                  >
                    {content}
                  </button>
                ) : (
                  <div className="flex w-full flex-col gap-1 px-2 py-1.5">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
BarList.displayName = "BarList";

export { BarList };
