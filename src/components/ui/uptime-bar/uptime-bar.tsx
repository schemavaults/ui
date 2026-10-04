"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { useId } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const uptimeBarSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies string[];
export type UptimeBarSizeId = (typeof uptimeBarSizeIds)[number];

export const uptimeBarShapeIds = [
  "rounded",
  "pill",
  "square",
] as const satisfies string[];
export type UptimeBarShapeId = (typeof uptimeBarShapeIds)[number];

/**
 * Status of a single period (usually a day) on the bar. `no-data` covers
 * periods before monitoring started or gaps in collection.
 */
export const uptimeBarStatusIds = [
  "operational",
  "degraded",
  "outage",
  "maintenance",
  "no-data",
] as const satisfies string[];
export type UptimeBarStatusId = (typeof uptimeBarStatusIds)[number];

const STATUS_BG_CLASSES: Record<UptimeBarStatusId, string> = {
  operational: "bg-emerald-500 dark:bg-emerald-400",
  degraded: "bg-warning",
  outage: "bg-destructive",
  maintenance: "bg-schemavaults-brand-blue",
  "no-data": "bg-muted-foreground/25",
};

const DEFAULT_STATUS_LABELS: Record<UptimeBarStatusId, string> = {
  operational: "Operational",
  degraded: "Degraded performance",
  outage: "Outage",
  maintenance: "Scheduled maintenance",
  "no-data": "No data",
};

export const uptimeBarTickVariants = cva(
  "block w-full transition-[opacity,transform] duration-150 hover:scale-y-110 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:scale-y-100",
  {
    variants: {
      size: {
        sm: "h-5",
        default: "h-8",
        lg: "h-11",
      } satisfies Record<UptimeBarSizeId, string>,
      shape: {
        rounded: "rounded-[3px]",
        pill: "rounded-full",
        square: "rounded-none",
      } satisfies Record<UptimeBarShapeId, string>,
    },
    defaultVariants: {
      size: "default",
      shape: "rounded",
    },
  },
);

export interface UptimeBarPeriod {
  /** The period this tick represents. Used as React key and tooltip title. */
  date: Date | string;
  /** Overall status for the period. */
  status: UptimeBarStatusId;
  /**
   * Measured uptime for the period, 0–100. When omitted the period counts as
   * 100% unless its status is `outage` (0%). `no-data` periods are always
   * excluded from the overall percentage.
   */
  uptime?: number;
  /** Extra detail shown in the tooltip (e.g. incident titles). */
  description?: ReactNode;
}

export interface UptimeBarProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof uptimeBarTickVariants> {
  /** Periods to render, oldest first. */
  periods: ReadonlyArray<UptimeBarPeriod>;
  /** Accessible name for the whole bar, e.g. `"API uptime, last 90 days"`. */
  label: string;
  /** Visible heading above the bar (e.g. the service name). */
  headerLabel?: ReactNode;
  /**
   * Show the overall uptime percentage in the header. Defaults to `true`.
   * The value comes from `uptimePercentage` when supplied, otherwise from
   * `calculateUptimePercentage(periods)`.
   */
  showUptime?: boolean;
  /** Override the computed overall uptime percentage. */
  uptimePercentage?: number;
  /** Decimal places for the uptime percentage. Defaults to `2`. */
  uptimeDecimals?: number;
  /** Footer label under the first tick. Defaults to `"<n> days ago"`. */
  startLabel?: ReactNode;
  /** Footer label under the last tick. Defaults to `"Today"`. */
  endLabel?: ReactNode;
  /** Render the footer row (start / end labels). Defaults to `true`. */
  showFooter?: boolean;
  /** Render a legend for the statuses present in `periods`. Defaults to `false`. */
  showLegend?: boolean;
  /** Override the human-readable name of any status. */
  statusLabels?: Partial<Record<UptimeBarStatusId, string>>;
  /** Format a period's date for the tooltip and accessible label. */
  formatDate?: (date: Date) => string;
  /** Replace the default tooltip body for a period. */
  renderTooltip?: (period: UptimeBarPeriod, statusLabel: string) => ReactNode;
  /** Fired when a tick is clicked or activated via Enter / Space. */
  onPeriodClick?: (
    period: UptimeBarPeriod,
    event: MouseEvent<HTMLButtonElement>,
  ) => void;
  /** Extra classes for the row containing the ticks. */
  trackClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

function defaultFormatDate(date: Date): string {
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function periodUptime(period: UptimeBarPeriod): number {
  if (period.uptime !== undefined && Number.isFinite(period.uptime)) {
    return Math.min(100, Math.max(0, period.uptime));
  }
  return period.status === "outage" ? 0 : 100;
}

/**
 * Average uptime across every period that has data. Returns `null` when no
 * period has data, so callers can render a placeholder instead of `NaN%`.
 */
export function calculateUptimePercentage(
  periods: ReadonlyArray<UptimeBarPeriod>,
): number | null {
  const measured: ReadonlyArray<UptimeBarPeriod> = periods.filter(
    (p) => p.status !== "no-data",
  );
  if (measured.length === 0) return null;
  const sum: number = measured.reduce((acc, p) => acc + periodUptime(p), 0);
  return sum / measured.length;
}

function UptimeBar({
  periods,
  label,
  headerLabel,
  showUptime = true,
  uptimePercentage,
  uptimeDecimals = 2,
  startLabel,
  endLabel = "Today",
  showFooter = true,
  showLegend = false,
  statusLabels,
  formatDate = defaultFormatDate,
  renderTooltip,
  onPeriodClick,
  size,
  shape,
  className,
  trackClassName,
  ref,
  ...props
}: UptimeBarProps): ReactElement {
  const titleId: string = useId();
  const labels: Record<UptimeBarStatusId, string> = {
    ...DEFAULT_STATUS_LABELS,
    ...statusLabels,
  };

  const overall: number | null =
    uptimePercentage ?? calculateUptimePercentage(periods);
  const showHeader: boolean = headerLabel !== undefined || showUptime;
  const presentStatuses: ReadonlyArray<UptimeBarStatusId> =
    uptimeBarStatusIds.filter((id) => periods.some((p) => p.status === id));

  function handleActivate(
    period: UptimeBarPeriod,
    event: MouseEvent<HTMLButtonElement>,
  ): void {
    onPeriodClick?.(period, event);
  }

  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <div
        ref={ref}
        data-slot="uptime-bar"
        className={cn("flex w-full flex-col gap-2", className)}
        {...props}
      >
        {showHeader && (
          <div
            data-slot="uptime-bar-header"
            className="flex items-baseline justify-between gap-2 text-sm"
          >
            {headerLabel !== undefined ? (
              <span id={titleId} className="font-medium text-foreground">
                {headerLabel}
              </span>
            ) : (
              <span />
            )}
            {showUptime && (
              <span
                data-slot="uptime-bar-percentage"
                className="tabular-nums text-muted-foreground"
              >
                {overall === null
                  ? "—"
                  : `${overall.toFixed(uptimeDecimals)}% uptime`}
              </span>
            )}
          </div>
        )}

        <ul
          aria-label={label}
          data-slot="uptime-bar-track"
          className={cn("flex w-full items-end gap-[2px]", trackClassName)}
        >
          {periods.map((period, index) => {
            const date: Date = toDate(period.date);
            const dateLabel: string = formatDate(date);
            const statusLabel: string = labels[period.status];
            const uptimeText: string | undefined =
              period.status === "no-data"
                ? undefined
                : `${periodUptime(period).toFixed(uptimeDecimals)}%`;
            const ariaLabel: string = [dateLabel, statusLabel, uptimeText]
              .filter(Boolean)
              .join(", ");

            return (
              <li
                key={`${date.getTime()}-${index}`}
                data-slot="uptime-bar-period"
                className="flex min-w-[2px] flex-1"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={ariaLabel}
                      data-slot="uptime-bar-tick"
                      data-status={period.status}
                      className={cn(
                        uptimeBarTickVariants({ size, shape }),
                        STATUS_BG_CLASSES[period.status],
                        onPeriodClick ? "cursor-pointer" : "cursor-default",
                      )}
                      onClick={
                        onPeriodClick
                          ? (e): void => handleActivate(period, e)
                          : undefined
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    data-slot="uptime-bar-tooltip"
                    className="max-w-64"
                  >
                    {renderTooltip ? (
                      renderTooltip(period, statusLabel)
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{dateLabel}</span>
                        <span className="inline-flex items-center gap-1.5 text-xs">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "inline-block size-2 shrink-0 rounded-full",
                              STATUS_BG_CLASSES[period.status],
                            )}
                          />
                          {statusLabel}
                          {uptimeText && (
                            <span className="tabular-nums text-muted-foreground">
                              · {uptimeText}
                            </span>
                          )}
                        </span>
                        {period.description !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            {period.description}
                          </div>
                        )}
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </ul>

        {showFooter && (
          <div
            data-slot="uptime-bar-footer"
            aria-hidden="true"
            className="flex items-center justify-between gap-2 text-xs text-muted-foreground"
          >
            <span>
              {startLabel ??
                `${periods.length} ${periods.length === 1 ? "day" : "days"} ago`}
            </span>
            <span>{endLabel}</span>
          </div>
        )}

        {showLegend && presentStatuses.length > 0 && (
          <ul
            data-slot="uptime-bar-legend"
            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs"
          >
            {presentStatuses.map((status) => (
              <li
                key={status}
                className="inline-flex items-center gap-1.5 text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-block size-2.5 shrink-0 rounded-[3px]",
                    STATUS_BG_CLASSES[status],
                  )}
                />
                {labels[status]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </TooltipProvider>
  );
}
UptimeBar.displayName = "UptimeBar";

export { UptimeBar };
