"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Star } from "lucide-react";
import {
  useMemo,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import { Rating } from "../rating/rating";
import type { RatingColor } from "../rating/rating-variants";
import {
  ratingBreakdownLayoutIds,
  ratingBreakdownSizeIds,
  ratingBreakdownBarScaleIds,
  ratingBreakdownBarVariantIds,
  ratingBreakdownValueFormatIds,
  type RatingBreakdownBarScale,
  type RatingBreakdownBarVariant,
  type RatingBreakdownLayout,
  type RatingBreakdownSize,
  type RatingBreakdownValueFormat,
} from "./rating-breakdown-variants";

const barColorClasses: Record<RatingColor, string> = {
  warning: "bg-warning",
  primary: "bg-primary",
  destructive: "bg-destructive",
  foreground: "bg-foreground",
};

const starColorClasses: Record<RatingColor, string> = {
  warning: "text-warning",
  primary: "text-primary",
  destructive: "text-destructive",
  foreground: "text-foreground",
};

const containerVariants = cva("w-full", {
  variants: {
    layout: {
      horizontal:
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6",
      vertical: "flex flex-col gap-4",
    } satisfies Record<RatingBreakdownLayout, string>,
  },
  defaultVariants: {
    layout: "horizontal",
  },
});

const rowSizeClasses: Record<RatingBreakdownSize, string> = {
  sm: "gap-2 text-xs",
  md: "gap-2 text-sm",
  lg: "gap-3 text-base",
};

const barTrackSizeClasses: Record<RatingBreakdownSize, string> = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-2.5",
};

const averageValueSizeClasses: Record<RatingBreakdownSize, string> = {
  sm: "text-3xl",
  md: "text-4xl",
  lg: "text-5xl",
};

const totalTextSizeClasses: Record<RatingBreakdownSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
};

const valueMinWidthClasses: Record<RatingBreakdownSize, string> = {
  sm: "min-w-10",
  md: "min-w-12",
  lg: "min-w-16",
};

function formatPercent(n: number): string {
  if (!Number.isFinite(n)) return "0%";
  return `${Math.round(n)}%`;
}

function defaultTotalLabel(total: number): string {
  const formatted = new Intl.NumberFormat("en-US").format(total);
  return `${formatted} ${total === 1 ? "review" : "reviews"}`;
}

export interface RatingBreakdownProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof containerVariants> {
  /**
   * Counts per star level, ordered ascending
   * (index 0 = 1-star, index `max - 1` = `max`-star).
   * Shorter arrays are padded with zeros; longer arrays are truncated.
   */
  distribution: number[];
  /** Maximum star level. Defaults to 5. */
  max?: number;
  /**
   * Override the computed average. Useful when `distribution` is a sample
   * of a much larger dataset whose true average is known.
   */
  average?: number;
  /** Override the computed total review count. */
  total?: number;
  /** Component size. */
  size?: RatingBreakdownSize;
  /** Color applied to the average stars and distribution bars. */
  color?: RatingColor;
  /** Visual style for the distribution bars. */
  barVariant?: RatingBreakdownBarVariant;
  /**
   * How bar length is normalized:
   * - `"total"` — bar shows the level's share of all responses (default).
   * - `"max"` — bar shows the level's count relative to the largest bucket.
   */
  barScale?: RatingBreakdownBarScale;
  /** How to display the count/percentage beside each bar. */
  valueFormat?: RatingBreakdownValueFormat;
  /** Digits after the decimal in the average value. Defaults to 1. */
  precision?: number;
  /** Show the average stars display. Defaults to true. */
  showStars?: boolean;
  /** Show the total count under the average. Defaults to true. */
  showTotal?: boolean;
  /** When provided, distribution rows become clickable buttons. */
  onLevelClick?: (level: number) => void;
  /** Custom formatter for the "N reviews" text under the average. */
  totalLabel?: (total: number) => ReactNode;
  /** Rendered in place of the bars when the resolved total is 0. */
  emptyMessage?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

interface RatingBreakdownRowProps {
  level: number;
  count: number;
  pctOfTotal: number;
  width: number;
  color: RatingColor;
  size: RatingBreakdownSize;
  barVariant: RatingBreakdownBarVariant;
  valueFormat: RatingBreakdownValueFormat;
  onSelect: ((level: number) => void) | undefined;
}

function RatingBreakdownRow({
  level,
  count,
  pctOfTotal,
  width,
  color,
  size,
  barVariant,
  valueFormat,
  onSelect,
}: RatingBreakdownRowProps): ReactElement {
  const interactive = typeof onSelect === "function";

  const label = (
    <span className="flex shrink-0 items-center gap-1 tabular-nums text-muted-foreground">
      <span
        aria-hidden="true"
        className="font-medium tabular-nums text-foreground/80"
      >
        {level}
      </span>
      <Star
        aria-hidden="true"
        className={cn("size-3 fill-current", starColorClasses[color])}
      />
    </span>
  );

  const track = (
    <div
      className={cn(
        "relative min-w-0 flex-1 overflow-hidden rounded-full bg-muted",
        barTrackSizeClasses[size],
      )}
    >
      <div
        data-slot="rating-breakdown-bar"
        className={cn(
          "h-full rounded-full transition-[width] duration-300 ease-out",
          barColorClasses[color],
          barVariant === "subtle" && "opacity-40",
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  );

  let valueContent: string | null = null;
  if (valueFormat !== "none") {
    const countText = new Intl.NumberFormat("en-US").format(count);
    const percentText = formatPercent(pctOfTotal);
    if (valueFormat === "count") valueContent = countText;
    else if (valueFormat === "percent") valueContent = percentText;
    else valueContent = `${countText} · ${percentText}`;
  }

  const value = valueContent ? (
    <span
      data-slot="rating-breakdown-value"
      className={cn(
        "shrink-0 text-right tabular-nums text-muted-foreground",
        valueMinWidthClasses[size],
      )}
    >
      {valueContent}
    </span>
  ) : null;

  const rowClassName = cn(
    "flex items-center leading-none",
    rowSizeClasses[size],
    interactive &&
      "-mx-1 cursor-pointer rounded-md px-1 py-0.5 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  );

  const ariaLabel = `${level} star: ${new Intl.NumberFormat("en-US").format(count)} (${formatPercent(pctOfTotal)})`;

  if (interactive) {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        data-slot="rating-breakdown-row"
        data-level={level}
        onClick={() => onSelect(level)}
        className={cn(rowClassName, "w-full text-left")}
      >
        {label}
        {track}
        {value}
      </button>
    );
  }

  return (
    <div
      role="listitem"
      aria-label={ariaLabel}
      data-slot="rating-breakdown-row"
      data-level={level}
      className={rowClassName}
    >
      {label}
      {track}
      {value}
    </div>
  );
}

export function RatingBreakdown({
  distribution,
  max = 5,
  average,
  total,
  size = "md",
  layout = "horizontal",
  color = "warning",
  barVariant = "solid",
  barScale = "total",
  valueFormat = "count",
  precision = 1,
  showStars = true,
  showTotal = true,
  onLevelClick,
  totalLabel,
  emptyMessage,
  className,
  ref,
  ...props
}: RatingBreakdownProps): ReactElement {
  const normalized = useMemo<number[]>(() => {
    const arr = new Array<number>(max).fill(0);
    const len = Math.min(distribution.length, max);
    for (let i = 0; i < len; i++) {
      const v = distribution[i];
      arr[i] = typeof v === "number" && v >= 0 && Number.isFinite(v) ? v : 0;
    }
    return arr;
  }, [distribution, max]);

  const computedTotal = useMemo(
    () => normalized.reduce((acc, n) => acc + n, 0),
    [normalized],
  );

  const resolvedTotal = total ?? computedTotal;

  const computedAverage = useMemo(() => {
    if (computedTotal === 0) return 0;
    const sum = normalized.reduce(
      (acc, count, idx) => acc + count * (idx + 1),
      0,
    );
    return sum / computedTotal;
  }, [normalized, computedTotal]);

  const resolvedAverage = average ?? computedAverage;

  const barMax = useMemo(() => {
    if (barScale === "max") {
      return Math.max(0, ...normalized);
    }
    return resolvedTotal;
  }, [barScale, normalized, resolvedTotal]);

  const rows: ReactElement[] = [];
  for (let level = max; level >= 1; level--) {
    const count = normalized[level - 1] ?? 0;
    const pctOfTotal = resolvedTotal > 0 ? (count / resolvedTotal) * 100 : 0;
    const width =
      barMax > 0 ? Math.max(0, Math.min(100, (count / barMax) * 100)) : 0;
    rows.push(
      <RatingBreakdownRow
        key={level}
        level={level}
        count={count}
        pctOfTotal={pctOfTotal}
        width={width}
        color={color}
        size={size}
        barVariant={barVariant}
        valueFormat={valueFormat}
        onSelect={onLevelClick}
      />,
    );
  }

  const showEmpty = resolvedTotal === 0 && emptyMessage !== undefined;
  const renderTotalLabel = totalLabel ?? defaultTotalLabel;

  return (
    <div
      ref={ref}
      data-slot="rating-breakdown"
      className={cn(containerVariants({ layout }), className)}
      {...props}
    >
      <div
        data-slot="rating-breakdown-summary"
        className={cn(
          "flex flex-col items-start gap-2",
          layout === "horizontal" && "sm:w-40 sm:shrink-0",
        )}
      >
        <div className="flex items-baseline gap-1">
          <span
            data-slot="rating-breakdown-average"
            className={cn(
              "font-semibold leading-none tracking-tight tabular-nums text-foreground",
              averageValueSizeClasses[size],
            )}
          >
            {resolvedAverage.toFixed(precision)}
          </span>
          <span
            className={cn(
              "tabular-nums text-muted-foreground",
              totalTextSizeClasses[size],
            )}
          >
            / {max}
          </span>
        </div>
        {showStars ? (
          <Rating
            value={resolvedAverage}
            max={max}
            color={color}
            size={size === "lg" ? "md" : "sm"}
            readOnly
            allowHalf
            aria-label={`Average rating: ${resolvedAverage.toFixed(precision)} out of ${max}`}
          />
        ) : null}
        {showTotal ? (
          <span
            data-slot="rating-breakdown-total"
            className={cn(
              "tabular-nums text-muted-foreground",
              totalTextSizeClasses[size],
            )}
          >
            {renderTotalLabel(resolvedTotal)}
          </span>
        ) : null}
      </div>

      <div
        data-slot="rating-breakdown-bars"
        role="list"
        aria-label="Rating distribution"
        className="flex min-w-0 flex-1 flex-col gap-1.5"
      >
        {showEmpty ? emptyMessage : rows}
      </div>
    </div>
  );
}
RatingBreakdown.displayName = "RatingBreakdown";

export {
  ratingBreakdownLayoutIds,
  ratingBreakdownSizeIds,
  ratingBreakdownBarScaleIds,
  ratingBreakdownBarVariantIds,
  ratingBreakdownValueFormatIds,
  containerVariants as ratingBreakdownContainerVariants,
};

export type {
  RatingBreakdownBarScale,
  RatingBreakdownBarVariant,
  RatingBreakdownLayout,
  RatingBreakdownSize,
  RatingBreakdownValueFormat,
};

export default RatingBreakdown;
