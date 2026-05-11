"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

export const calendarHeatmapColorIds = [
  "default",
  "primary",
  "positive",
  "warning",
  "destructive",
] as const satisfies string[];
export type CalendarHeatmapColorId = (typeof calendarHeatmapColorIds)[number];

export const calendarHeatmapSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies string[];
export type CalendarHeatmapSizeId = (typeof calendarHeatmapSizeIds)[number];

export type CalendarHeatmapWeekStart = 0 | 1;

export interface CalendarHeatmapValue {
  /** The day this value applies to. May be a Date or an ISO `yyyy-mm-dd` string. */
  date: Date | string;
  /** Numeric activity level for the day. */
  count: number;
}

const SIZE_TO_DIMENSIONS: Record<
  CalendarHeatmapSizeId,
  { cell: number; gap: number; radius: number; fontSize: number }
> = {
  sm: { cell: 9, gap: 2, radius: 1.5, fontSize: 9 },
  md: { cell: 12, gap: 3, radius: 2, fontSize: 10 },
  lg: { cell: 16, gap: 4, radius: 3, fontSize: 11 },
};

const calendarHeatmapVariants = cva(
  "inline-flex w-fit min-w-0 max-w-full flex-col gap-2 text-foreground",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-xs",
        lg: "text-sm",
      } satisfies Record<CalendarHeatmapSizeId, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type LevelClassMap = Readonly<Record<0 | 1 | 2 | 3 | 4, string>>;

/**
 * Per-color level → Tailwind class lookup. Classes are written in full so that
 * Tailwind's content scanner picks them up — never build them via interpolation.
 * Level 0 is the empty/no-activity cell.
 */
const COLOR_LEVEL_CLASSES: Record<CalendarHeatmapColorId, LevelClassMap> = {
  default: {
    0: "bg-muted/40 dark:bg-muted/30",
    1: "bg-schemavaults-brand-blue/20",
    2: "bg-schemavaults-brand-blue/40",
    3: "bg-schemavaults-brand-blue/65",
    4: "bg-schemavaults-brand-blue",
  },
  primary: {
    0: "bg-muted/40 dark:bg-muted/30",
    1: "bg-primary/20",
    2: "bg-primary/40",
    3: "bg-primary/65",
    4: "bg-primary",
  },
  positive: {
    0: "bg-muted/40 dark:bg-muted/30",
    1: "bg-emerald-500/20 dark:bg-emerald-400/20",
    2: "bg-emerald-500/40 dark:bg-emerald-400/40",
    3: "bg-emerald-500/65 dark:bg-emerald-400/65",
    4: "bg-emerald-500 dark:bg-emerald-400",
  },
  warning: {
    0: "bg-muted/40 dark:bg-muted/30",
    1: "bg-warning/20",
    2: "bg-warning/40",
    3: "bg-warning/65",
    4: "bg-warning",
  },
  destructive: {
    0: "bg-muted/40 dark:bg-muted/30",
    1: "bg-destructive/20",
    2: "bg-destructive/40",
    3: "bg-destructive/65",
    4: "bg-destructive",
  },
};

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseToUtcDay(input: Date | string): Date {
  if (input instanceof Date) {
    return new Date(
      Date.UTC(input.getFullYear(), input.getMonth(), input.getDate()),
    );
  }
  if (ISO_DATE_RE.test(input)) {
    const [yStr, mStr, dStr] = input.split("-") as [string, string, string];
    return new Date(Date.UTC(Number(yStr), Number(mStr) - 1, Number(dStr)));
  }
  const parsed = new Date(input);
  return new Date(
    Date.UTC(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate(),
    ),
  );
}

function toIsoDay(date: Date): string {
  const y: string = String(date.getUTCFullYear()).padStart(4, "0");
  const m: string = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d: string = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addUtcDays(date: Date, n: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + n);
  return next;
}

function diffInDaysUtc(a: Date, b: Date): number {
  const ms: number = a.getTime() - b.getTime();
  return Math.round(ms / 86_400_000);
}

function startOfWeekUtc(date: Date, weekStart: CalendarHeatmapWeekStart): Date {
  const dow: number = date.getUTCDay();
  const offset: number = (dow - weekStart + 7) % 7;
  return addUtcDays(date, -offset);
}

function defaultThresholds(values: ReadonlyArray<number>): readonly number[] {
  if (values.length === 0) return [1, 2, 3, 4] as const;
  const positives: number[] = values.filter((v) => v > 0).sort((a, b) => a - b);
  if (positives.length === 0) return [1, 2, 3, 4] as const;
  const max: number = positives[positives.length - 1]!;
  if (max <= 4) {
    return [1, 2, 3, 4] as const;
  }
  // Quartile-based thresholds across positive values.
  const q = (p: number): number => {
    const idx: number = Math.min(
      positives.length - 1,
      Math.max(0, Math.floor(p * (positives.length - 1))),
    );
    return Math.max(1, Math.ceil(positives[idx]!));
  };
  const t1: number = Math.max(1, q(0.25));
  const t2: number = Math.max(t1 + 1, q(0.5));
  const t3: number = Math.max(t2 + 1, q(0.75));
  const t4: number = Math.max(t3 + 1, max);
  return [t1, t2, t3, t4] as const;
}

function levelForCount(
  count: number,
  thresholds: ReadonlyArray<number>,
): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count >= thresholds[3]!) return 4;
  if (count >= thresholds[2]!) return 3;
  if (count >= thresholds[1]!) return 2;
  if (count >= thresholds[0]!) return 1;
  return 1;
}

const MONTH_LABELS: ReadonlyArray<string> = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAY_LABELS: ReadonlyArray<string> = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function defaultTooltipText(date: Date, count: number): string {
  const iso: string = toIsoDay(date);
  if (count <= 0) return `${iso}: No activity`;
  if (count === 1) return `${iso}: 1 contribution`;
  return `${iso}: ${count.toLocaleString()} contributions`;
}

export interface CalendarHeatmapProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof calendarHeatmapVariants> {
  /** First day shown (inclusive). */
  startDate: Date | string;
  /** Last day shown (inclusive). */
  endDate: Date | string;
  /** Activity values keyed by date. Days not provided are treated as 0. */
  values?: ReadonlyArray<CalendarHeatmapValue>;
  /** Cell color theme. */
  color?: CalendarHeatmapColorId;
  /** First day of the week (0=Sun, 1=Mon). Defaults to Sunday. */
  weekStart?: CalendarHeatmapWeekStart;
  /** Show short weekday labels along the left edge. Defaults to true. */
  showWeekdayLabels?: boolean;
  /** Show month labels above the grid. Defaults to true. */
  showMonthLabels?: boolean;
  /** Show the "Less / More" intensity legend. Defaults to true. */
  showLegend?: boolean;
  /**
   * Custom thresholds for the four non-zero intensity levels (ascending).
   * If omitted, thresholds are inferred from the dataset's quartiles.
   */
  thresholds?: ReadonlyArray<number>;
  /** Accessible label describing what the heatmap represents. */
  label: string;
  /** Override the per-cell tooltip text. */
  tooltipText?: (date: Date, count: number) => string;
  /**
   * Slot rendered to the right of the legend (e.g. a date range hint).
   * Useful for composing footers.
   */
  legendExtra?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

interface DayCell {
  readonly date: Date;
  readonly inRange: boolean;
  readonly count: number;
  readonly level: 0 | 1 | 2 | 3 | 4;
}

interface WeekColumn {
  readonly days: ReadonlyArray<DayCell>;
  /** Month label to show above this column, or null. */
  readonly monthLabel: string | null;
}

function CalendarHeatmap({
  startDate,
  endDate,
  values = [],
  color = "default",
  size = "md",
  weekStart = 0,
  showWeekdayLabels = true,
  showMonthLabels = true,
  showLegend = true,
  thresholds: thresholdsProp,
  label,
  tooltipText = defaultTooltipText,
  legendExtra,
  className,
  ref,
  ...props
}: CalendarHeatmapProps): ReactElement {
  const resolvedSize: CalendarHeatmapSizeId = size ?? "md";
  const dims = SIZE_TO_DIMENSIONS[resolvedSize];

  const start: Date = parseToUtcDay(startDate);
  const end: Date = parseToUtcDay(endDate);
  const valueMap: Map<string, number> = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of values) {
      const day: Date = parseToUtcDay(v.date);
      map.set(toIsoDay(day), (map.get(toIsoDay(day)) ?? 0) + v.count);
    }
    return map;
  }, [values]);

  const thresholds: ReadonlyArray<number> = useMemo(() => {
    if (thresholdsProp && thresholdsProp.length === 4) {
      return [...thresholdsProp].sort((a, b) => a - b);
    }
    return defaultThresholds(Array.from(valueMap.values()));
  }, [thresholdsProp, valueMap]);

  const weeks: ReadonlyArray<WeekColumn> = useMemo(() => {
    if (end.getTime() < start.getTime()) return [];
    const gridStart: Date = startOfWeekUtc(start, weekStart);
    const gridEnd: Date = addUtcDays(
      startOfWeekUtc(end, weekStart),
      6,
    );
    const totalDays: number = diffInDaysUtc(gridEnd, gridStart) + 1;
    const totalWeeks: number = Math.ceil(totalDays / 7);

    let lastMonthSeen: number = -1;
    const out: WeekColumn[] = [];
    for (let w = 0; w < totalWeeks; w += 1) {
      const days: DayCell[] = [];
      let firstInRangeMonth: number | null = null;
      for (let d = 0; d < 7; d += 1) {
        const cellDate: Date = addUtcDays(gridStart, w * 7 + d);
        const inRange: boolean =
          cellDate.getTime() >= start.getTime() &&
          cellDate.getTime() <= end.getTime();
        const iso: string = toIsoDay(cellDate);
        const count: number = inRange ? (valueMap.get(iso) ?? 0) : 0;
        const level: 0 | 1 | 2 | 3 | 4 = inRange
          ? levelForCount(count, thresholds)
          : 0;
        days.push({ date: cellDate, inRange, count, level });
        if (inRange && firstInRangeMonth === null) {
          firstInRangeMonth = cellDate.getUTCMonth();
        }
      }
      let monthLabel: string | null = null;
      if (firstInRangeMonth !== null && firstInRangeMonth !== lastMonthSeen) {
        monthLabel = MONTH_LABELS[firstInRangeMonth] ?? null;
        lastMonthSeen = firstInRangeMonth;
      }
      out.push({ days, monthLabel });
    }
    return out;
  }, [start, end, weekStart, valueMap, thresholds]);

  const orderedWeekdayLabels: ReadonlyArray<string> = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i < 7; i += 1) {
      out.push(WEEKDAY_LABELS[(weekStart + i) % 7]!);
    }
    return out;
  }, [weekStart]);

  const colorLevels: LevelClassMap = COLOR_LEVEL_CLASSES[color];

  const cellPx: number = dims.cell;
  const gapPx: number = dims.gap;
  const radiusPx: number = dims.radius;
  const monthRowHeight: number = showMonthLabels ? dims.fontSize + 6 : 0;
  const weekdayLabelWidth: number = showWeekdayLabels ? 28 : 0;

  return (
    <div
      ref={ref}
      role="figure"
      aria-label={label}
      data-slot="calendar-heatmap"
      data-color={color}
      data-size={resolvedSize}
      className={cn(calendarHeatmapVariants({ size }), className)}
      {...props}
    >
      <div
        className="flex max-w-full min-w-0 overflow-x-auto"
        style={{ gap: gapPx }}
        data-slot="calendar-heatmap-scroll"
      >
        {showWeekdayLabels ? (
          <div
            aria-hidden="true"
            className="flex flex-col text-muted-foreground tabular-nums"
            style={{
              width: weekdayLabelWidth,
              gap: gapPx,
              paddingTop: monthRowHeight,
              fontSize: dims.fontSize,
              lineHeight: `${cellPx}px`,
            }}
          >
            {orderedWeekdayLabels.map((dayLabel, idx) => (
              <div
                key={`${dayLabel}-${idx}`}
                style={{ height: cellPx }}
                className={cn(
                  // GitHub convention: only show labels for alternating rows
                  // (Mon, Wed, Fri) to avoid visual noise.
                  idx % 2 === 0 ? "opacity-0" : "opacity-100",
                )}
              >
                {dayLabel}
              </div>
            ))}
          </div>
        ) : null}

        <div
          className="flex"
          style={{ gap: gapPx }}
          data-slot="calendar-heatmap-grid"
        >
          {weeks.map((week, wIdx) => (
            <div
              key={wIdx}
              className="flex flex-col"
              style={{ gap: gapPx }}
              data-slot="calendar-heatmap-week"
            >
              {showMonthLabels ? (
                <div
                  aria-hidden="true"
                  className="text-muted-foreground"
                  style={{
                    height: monthRowHeight,
                    fontSize: dims.fontSize,
                    lineHeight: `${monthRowHeight}px`,
                    minWidth: cellPx,
                  }}
                >
                  {week.monthLabel ?? ""}
                </div>
              ) : null}
              {week.days.map((day, dIdx) => {
                if (!day.inRange) {
                  return (
                    <div
                      key={dIdx}
                      aria-hidden="true"
                      style={{
                        width: cellPx,
                        height: cellPx,
                        borderRadius: radiusPx,
                      }}
                    />
                  );
                }
                const cellClass: string = colorLevels[day.level];
                const tooltip: string = tooltipText(day.date, day.count);
                return (
                  <div
                    key={dIdx}
                    role="gridcell"
                    aria-label={tooltip}
                    title={tooltip}
                    data-slot="calendar-heatmap-cell"
                    data-date={toIsoDay(day.date)}
                    data-count={day.count}
                    data-level={day.level}
                    className={cn(
                      "transition-colors",
                      "ring-1 ring-inset ring-border/40",
                      cellClass,
                    )}
                    style={{
                      width: cellPx,
                      height: cellPx,
                      borderRadius: radiusPx,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {showLegend ? (
        <div
          className="flex items-center justify-end gap-2 text-muted-foreground"
          style={{ fontSize: dims.fontSize }}
          data-slot="calendar-heatmap-legend"
        >
          {legendExtra ? (
            <span className="mr-auto">{legendExtra}</span>
          ) : null}
          <span>Less</span>
          <div className="flex" style={{ gap: gapPx }}>
            {[0, 1, 2, 3, 4].map((lvl) => (
              <div
                key={lvl}
                aria-hidden="true"
                className={cn(
                  "ring-1 ring-inset ring-border/40",
                  colorLevels[lvl as 0 | 1 | 2 | 3 | 4],
                )}
                style={{
                  width: cellPx,
                  height: cellPx,
                  borderRadius: radiusPx,
                }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      ) : null}
    </div>
  );
}
CalendarHeatmap.displayName = "CalendarHeatmap";

export { CalendarHeatmap, calendarHeatmapVariants };

export default CalendarHeatmap;
