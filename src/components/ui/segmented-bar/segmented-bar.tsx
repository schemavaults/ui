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

import { m } from "@/framer-motion";
import { cn } from "@/lib/utils";

export const segmentedBarSizeIds = [
  "sm",
  "default",
  "lg",
  "xl",
] as const satisfies string[];
export type SegmentedBarSizeId = (typeof segmentedBarSizeIds)[number];

export const segmentedBarShapeIds = [
  "rounded",
  "pill",
  "square",
] as const satisfies string[];
export type SegmentedBarShapeId = (typeof segmentedBarShapeIds)[number];

/**
 * Preset colours available for segments. Mirrors the palette used by
 * `PieChart` so a `SegmentedBar` and a `PieChart` visualising the same data
 * agree on which slice is which.
 */
export const segmentedBarSegmentColorIds = [
  "default",
  "primary",
  "positive",
  "warning",
  "destructive",
  "muted",
] as const satisfies string[];
export type SegmentedBarSegmentColorId =
  (typeof segmentedBarSegmentColorIds)[number];

const SEGMENT_BG_CLASSES: Record<SegmentedBarSegmentColorId, string> = {
  default: "bg-schemavaults-brand-blue",
  primary: "bg-primary",
  positive: "bg-emerald-500 dark:bg-emerald-400",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground/60",
};

/**
 * Fallback colour rotation when a segment doesn't specify its own colour.
 * Index is the segment position in the input array, modulo palette length.
 */
const DEFAULT_COLOR_ROTATION: ReadonlyArray<SegmentedBarSegmentColorId> = [
  "default",
  "positive",
  "warning",
  "destructive",
  "primary",
  "muted",
];

export const segmentedBarTrackVariants = cva(
  "relative isolate flex w-full overflow-hidden bg-secondary",
  {
    variants: {
      size: {
        sm: "h-1.5",
        default: "h-2.5",
        lg: "h-4",
        xl: "h-6",
      } satisfies Record<SegmentedBarSizeId, string>,
      shape: {
        rounded: "rounded-md",
        pill: "rounded-full",
        square: "rounded-none",
      } satisfies Record<SegmentedBarShapeId, string>,
    },
    defaultVariants: {
      size: "default",
      shape: "pill",
    },
  },
);

export interface SegmentedBarSegment {
  /** Stable identifier for the segment. Used as React key and click payload. */
  id: string;
  /** Human-readable label used in the legend and as the segment's `aria-label`. */
  label: string;
  /** Non-negative numeric size. Non-positive values are skipped. */
  value: number;
  /** Preset colour token from the shared palette. Ignored if `fill` is set. */
  color?: SegmentedBarSegmentColorId;
  /**
   * Override the background with a raw CSS colour (e.g. `"#ff0080"` or
   * `"hsl(var(--chart-1))"`). Takes precedence over `color`.
   */
  fill?: string;
  /** Extra classes applied to this segment element. */
  className?: string;
  /** Fired when the segment is clicked or activated via keyboard. */
  onClick?: (
    segment: SegmentedBarSegment,
    event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
  ) => void;
}

/**
 * Args for a custom legend renderer. `total` reflects the effective total
 * (i.e. the `total` prop when supplied, otherwise the sum of segment values).
 */
export interface SegmentedBarLegendRenderArgs {
  segments: ReadonlyArray<SegmentedBarSegment>;
  total: number;
  /** Sum of `value` across `segments` (may be less than `total`). */
  segmentsTotal: number;
  /** `total - segmentsTotal`, clamped to 0. */
  remainder: number;
}

export interface SegmentedBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onClick">,
    VariantProps<typeof segmentedBarTrackVariants> {
  /** Segments to render, left to right. */
  segments: ReadonlyArray<SegmentedBarSegment>;
  /** Accessible label describing what the bar represents. */
  label: string;
  /**
   * Total the segments should be measured against. Defaults to the sum of
   * segment values. When `total` exceeds the sum, the remainder shows as an
   * unfilled tail — useful for quotas (`used + reserved` of a `capacity`).
   */
  total?: number;
  /**
   * Whether to render the built-in legend below the bar. Defaults to `false`.
   * Ignored when `renderLegend` is provided.
   */
  showLegend?: boolean;
  /**
   * Show the value alongside each label in the default legend. Defaults to
   * `true`.
   */
  showLegendValues?: boolean;
  /**
   * Show the percentage share alongside each value in the default legend.
   * Defaults to `false`.
   */
  showLegendPercentages?: boolean;
  /** Unit appended to values in the default legend (e.g. `"GB"`, `"$"`). */
  unit?: string;
  /**
   * Format a segment value shown in the default legend. Return a string or
   * React node. Defaults to `value + unit`.
   */
  formatValue?: (value: number, segment: SegmentedBarSegment) => ReactNode;
  /**
   * Custom legend renderer. Overrides the default legend entirely and
   * bypasses `showLegend`.
   */
  renderLegend?: (args: SegmentedBarLegendRenderArgs) => ReactNode;
  /**
   * Render a thin divider between adjacent segments. Defaults to `true`.
   * Only visible when segments have distinct colours.
   */
  showDividers?: boolean;
  /**
   * When true (default), animates segment widths in on mount using
   * framer-motion. Set to `false` for a static bar.
   */
  animate?: boolean;
  /**
   * Header label rendered above the bar. If omitted, the bar has no visible
   * header (the `label` prop is still announced via `aria-label`).
   */
  headerLabel?: ReactNode;
  /**
   * Value rendered at the end of the header row (e.g. `"84 / 100 GB"`).
   * Only shown when a header label is present.
   */
  headerValue?: ReactNode;
  /** Extra classes for the header row. */
  headerClassName?: string;
  /** Extra classes for the legend wrapper. */
  legendClassName?: string;
  /** Extra classes applied to the bar track element. */
  trackClassName?: string;
  /** Fallback handler invoked for segments without their own `onClick`. */
  onSegmentClick?: (
    segment: SegmentedBarSegment,
    event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
  ) => void;
  ref?: Ref<HTMLDivElement>;
}

interface ResolvedSegment {
  segment: SegmentedBarSegment;
  index: number;
  percentage: number;
  bgClass: string | undefined;
  style: { backgroundColor?: string } | undefined;
}

function resolveBackground(
  segment: SegmentedBarSegment,
  index: number,
): Pick<ResolvedSegment, "bgClass" | "style"> {
  if (segment.fill) {
    return { bgClass: undefined, style: { backgroundColor: segment.fill } };
  }
  const preset: SegmentedBarSegmentColorId =
    segment.color ??
    DEFAULT_COLOR_ROTATION[index % DEFAULT_COLOR_ROTATION.length]!;
  return { bgClass: SEGMENT_BG_CLASSES[preset], style: undefined };
}

function SegmentedBar({
  segments,
  label,
  total,
  size,
  shape,
  showLegend = false,
  showLegendValues = true,
  showLegendPercentages = false,
  unit,
  formatValue,
  renderLegend,
  showDividers = true,
  animate = true,
  headerLabel,
  headerValue,
  className,
  headerClassName,
  legendClassName,
  trackClassName,
  onSegmentClick,
  ref,
  ...props
}: SegmentedBarProps): ReactElement {
  const validSegments: ReadonlyArray<SegmentedBarSegment> = segments.filter(
    (s) => Number.isFinite(s.value) && s.value > 0,
  );

  const segmentsTotal: number = validSegments.reduce(
    (acc, s) => acc + s.value,
    0,
  );
  const effectiveTotal: number = total ?? segmentsTotal;
  const safeTotal: number = effectiveTotal > 0 ? effectiveTotal : 1;
  const remainder: number = Math.max(0, effectiveTotal - segmentsTotal);
  const filledPercentage: number = Math.min(
    100,
    (segmentsTotal / safeTotal) * 100,
  );

  const resolvedSegments: ReadonlyArray<ResolvedSegment> = validSegments.map(
    (segment, index) => ({
      segment,
      index,
      percentage: (segment.value / safeTotal) * 100,
      ...resolveBackground(segment, index),
    }),
  );

  const titleId: string = useId();
  const showHeader: boolean = headerLabel !== undefined || headerValue !== undefined;

  function handleSegmentClick(
    segment: SegmentedBarSegment,
    event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
  ): void {
    if (segment.onClick) {
      segment.onClick(segment, event);
      return;
    }
    if (onSegmentClick) {
      onSegmentClick(segment, event);
    }
  }

  const defaultFormatValue = (
    v: number,
    _s: SegmentedBarSegment,
  ): ReactNode => (
    <>
      {v}
      {unit ? <span className="ml-0.5 text-muted-foreground">{unit}</span> : null}
    </>
  );

  return (
    <div
      ref={ref}
      data-slot="segmented-bar"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {showHeader && (
        <div
          className={cn(
            "flex items-baseline justify-between gap-2 text-sm",
            headerClassName,
          )}
        >
          {headerLabel !== undefined && (
            <span
              id={titleId}
              className="font-medium text-muted-foreground"
              data-slot="segmented-bar-header-label"
            >
              {headerLabel}
            </span>
          )}
          {headerValue !== undefined && (
            <span
              className="font-medium tabular-nums text-foreground"
              data-slot="segmented-bar-header-value"
            >
              {headerValue}
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-labelledby={headerLabel !== undefined ? titleId : undefined}
        aria-valuenow={Math.round(filledPercentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${segmentsTotal} of ${effectiveTotal}`}
        data-slot="segmented-bar-track"
        className={cn(
          segmentedBarTrackVariants({ size, shape }),
          trackClassName,
        )}
      >
        {resolvedSegments.map((r, i) => {
          const isInteractive: boolean =
            r.segment.onClick !== undefined || onSegmentClick !== undefined;
          const showDivider: boolean =
            showDividers && (i > 0 || (remainder > 0 && i === 0 && false));
          const commonClass: string = cn(
            "h-full min-w-0 first:rounded-l-[inherit]",
            remainder <= 0 && "last:rounded-r-[inherit]",
            r.bgClass,
            showDivider &&
              "border-l border-background/50 dark:border-background/70",
            isInteractive &&
              "cursor-pointer transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            r.segment.className,
          );
          const initialWidth: string = "0%";
          const animatedWidth: string = `${r.percentage}%`;
          const commonProps = {
            "data-slot": "segmented-bar-segment",
            "data-segment-id": r.segment.id,
            "aria-label": r.segment.label,
            title: r.segment.label,
            style: r.style,
            className: commonClass,
          } as const;

          if (isInteractive) {
            return (
              <m.button
                key={r.segment.id}
                type="button"
                onClick={(e) => handleSegmentClick(r.segment, e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSegmentClick(r.segment, e);
                  }
                }}
                initial={animate ? { width: initialWidth } : false}
                animate={{ width: animatedWidth }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                {...commonProps}
              />
            );
          }

          return (
            <m.div
              key={r.segment.id}
              initial={animate ? { width: initialWidth } : false}
              animate={{ width: animatedWidth }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              {...commonProps}
            />
          );
        })}
      </div>
      {renderLegend
        ? renderLegend({
            segments: validSegments,
            total: effectiveTotal,
            segmentsTotal,
            remainder,
          })
        : showLegend && (
            <ul
              data-slot="segmented-bar-legend"
              className={cn(
                "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs",
                legendClassName,
              )}
            >
              {resolvedSegments.map((r) => {
                const pct: number = safeTotal > 0 ? (r.segment.value / safeTotal) * 100 : 0;
                return (
                  <li
                    key={r.segment.id}
                    data-slot="segmented-bar-legend-item"
                    className="inline-flex items-center gap-1.5"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "inline-block size-2.5 shrink-0 rounded-[3px]",
                        r.bgClass,
                      )}
                      style={r.style}
                    />
                    <span className="font-medium text-foreground">
                      {r.segment.label}
                    </span>
                    {showLegendValues && (
                      <span className="tabular-nums text-muted-foreground">
                        {formatValue
                          ? formatValue(r.segment.value, r.segment)
                          : defaultFormatValue(r.segment.value, r.segment)}
                      </span>
                    )}
                    {showLegendPercentages && (
                      <span className="tabular-nums text-muted-foreground">
                        ({pct.toFixed(pct < 10 ? 1 : 0)}%)
                      </span>
                    )}
                  </li>
                );
              })}
              {remainder > 0 && (
                <li
                  data-slot="segmented-bar-legend-remainder"
                  className="inline-flex items-center gap-1.5"
                >
                  <span
                    aria-hidden="true"
                    className="inline-block size-2.5 shrink-0 rounded-[3px] bg-secondary"
                  />
                  <span className="font-medium text-muted-foreground">
                    Remaining
                  </span>
                  {showLegendValues && (
                    <span className="tabular-nums text-muted-foreground">
                      {formatValue
                        ? formatValue(remainder, {
                            id: "__remainder__",
                            label: "Remaining",
                            value: remainder,
                          })
                        : defaultFormatValue(remainder, {
                            id: "__remainder__",
                            label: "Remaining",
                            value: remainder,
                          })}
                    </span>
                  )}
                </li>
              )}
            </ul>
          )}
    </div>
  );
}
SegmentedBar.displayName = "SegmentedBar";

export { SegmentedBar };
