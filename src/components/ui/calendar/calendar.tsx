"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactElement,
  type Ref,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const calendarSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type CalendarSizeId = (typeof calendarSizeIds)[number];

export const calendarModeIds = [
  "single",
  "multiple",
  "range",
] as const satisfies readonly string[];
export type CalendarMode = (typeof calendarModeIds)[number];

/** A start/end date pair used by `mode="range"`. */
export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/* -------------------------------------------------------------------------- */
/*  Date helpers (no external dependency)                                      */
/* -------------------------------------------------------------------------- */

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addDays(date: Date, amount: number): Date {
  const next = startOfDay(date);
  next.setDate(next.getDate() + amount);
  return next;
}

/** Add whole months while clamping the day-of-month (Jan 31 + 1mo -> Feb 28). */
function addMonthsKeepDay(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = endOfMonth(target).getDate();
  target.setDate(Math.min(date.getDate(), lastDay));
  return startOfDay(target);
}

function startOfWeek(date: Date, weekStartsOn: number): Date {
  const day = startOfDay(date);
  const diff = (day.getDay() - weekStartsOn + 7) % 7;
  return addDays(day, -diff);
}

function isSameDay(a: Date | undefined, b: Date | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Negative if `a` is an earlier day than `b`, positive if later, 0 if same. */
function compareDay(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

function toISODateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildWeeks(
  month: Date,
  weekStartsOn: number,
  fixedWeeks: boolean,
): Date[][] {
  const firstDay = startOfMonth(month);
  const leading = (firstDay.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(firstDay, -leading);
  const daysInMonth = endOfMonth(month).getDate();
  const span = leading + daysInMonth;
  const weekCount = fixedWeeks ? 6 : Math.ceil(span / 7);

  const weeks: Date[][] = [];
  let cursor = gridStart;
  for (let w = 0; w < weekCount; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function getWeekdayLabels(
  weekStartsOn: number,
  weekday: "short" | "long",
  locale?: string,
): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday });
  // 2021-08-01 is a Sunday — a stable anchor for weekday names.
  const sunday = new Date(2021, 7, 1);
  const labels: string[] = [];
  for (let i = 0; i < 7; i++) {
    labels.push(formatter.format(addDays(sunday, weekStartsOn + i)));
  }
  return labels;
}

/* -------------------------------------------------------------------------- */
/*  Variants                                                                   */
/* -------------------------------------------------------------------------- */

const calendarCellVariants = cva("relative p-0 text-center", {
  variants: {
    size: {
      sm: "h-8 w-8",
      default: "h-9 w-9",
      lg: "h-11 w-11",
    } satisfies Record<CalendarSizeId, string>,
  },
  defaultVariants: { size: "default" },
});

const calendarWeekdayVariants = cva(
  "inline-flex items-center justify-center font-medium text-muted-foreground",
  {
    variants: {
      size: {
        sm: "h-7 w-8 text-[0.65rem]",
        default: "h-8 w-9 text-xs",
        lg: "h-9 w-11 text-sm",
      } satisfies Record<CalendarSizeId, string>,
    },
    defaultVariants: { size: "default" },
  },
);

const calendarDayVariants = cva(
  "inline-flex h-full w-full items-center justify-center rounded-md font-normal text-foreground ring-offset-background transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:z-20",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      } satisfies Record<CalendarSizeId, string>,
    },
    defaultVariants: { size: "default" },
  },
);

const navButtonClass =
  "inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-transparent text-foreground opacity-80 ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-30";

/* -------------------------------------------------------------------------- */
/*  Props                                                                      */
/* -------------------------------------------------------------------------- */

type CalendarBaseProps = Omit<ComponentProps<"div">, "onSelect"> & {
  size?: CalendarSizeId;
  /** Controlled displayed month (any day within it). */
  month?: Date;
  /** Initial displayed month when uncontrolled. */
  defaultMonth?: Date;
  /** Called when the user navigates to a different month. */
  onMonthChange?: (month: Date) => void;
  /** First day of the week: 0 (Sunday) … 6 (Saturday). Defaults to 0. */
  weekStartsOn?: WeekStartsOn;
  /** Earliest selectable day (inclusive). */
  fromDate?: Date;
  /** Latest selectable day (inclusive). */
  toDate?: Date;
  /** Predicate marking individual days as non-selectable. */
  disabled?: (date: Date) => boolean;
  /** Render leading/trailing days from adjacent months. Defaults to true. */
  showOutsideDays?: boolean;
  /** Always render six week rows for a stable height. Defaults to false. */
  fixedWeeks?: boolean;
  /** BCP-47 locale used for month/weekday labels. */
  locale?: string;
  ref?: Ref<HTMLDivElement>;
};

export interface CalendarSingleProps extends CalendarBaseProps {
  mode?: "single";
  selected?: Date;
  defaultSelected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

export interface CalendarMultipleProps extends CalendarBaseProps {
  mode: "multiple";
  selected?: Date[];
  defaultSelected?: Date[];
  onSelect?: (dates: Date[]) => void;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  mode: "range";
  selected?: DateRange;
  defaultSelected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
}

export type CalendarProps =
  | CalendarSingleProps
  | CalendarMultipleProps
  | CalendarRangeProps;

export type { VariantProps };

const MODE_PROP_KEYS = new Set([
  "mode",
  "selected",
  "defaultSelected",
  "onSelect",
  "children",
]);

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

function Calendar(props: CalendarProps): ReactElement {
  const {
    className,
    size = "default",
    month: monthProp,
    defaultMonth,
    onMonthChange,
    weekStartsOn = 0,
    fromDate,
    toDate,
    disabled,
    showOutsideDays = true,
    fixedWeeks = false,
    locale,
    ref,
    ...rest
  } = props;

  const mode: CalendarMode = props.mode ?? "single";

  /* ----------------------------- selection state ------------------------- */

  const [internalSingle, setInternalSingle] = useState<Date | undefined>(() =>
    props.mode === "multiple" || props.mode === "range"
      ? undefined
      : props.defaultSelected,
  );
  const [internalMultiple, setInternalMultiple] = useState<Date[]>(() =>
    props.mode === "multiple" ? (props.defaultSelected ?? []) : [],
  );
  const [internalRange, setInternalRange] = useState<DateRange | undefined>(() =>
    props.mode === "range" ? props.defaultSelected : undefined,
  );

  const isControlled = "selected" in props;

  let controlledSingle: Date | undefined;
  let controlledMultiple: Date[] | undefined;
  let controlledRange: DateRange | undefined;
  switch (props.mode) {
    case "multiple":
      controlledMultiple = props.selected;
      break;
    case "range":
      controlledRange = props.selected;
      break;
    default:
      controlledSingle = props.selected;
  }

  const currentSingle = isControlled ? controlledSingle : internalSingle;
  const currentMultiple = useMemo<Date[]>(
    () => (isControlled ? (controlledMultiple ?? []) : internalMultiple),
    [isControlled, controlledMultiple, internalMultiple],
  );
  const currentRange = isControlled ? controlledRange : internalRange;

  /* ------------------------------- month state --------------------------- */

  const [internalMonth, setInternalMonth] = useState<Date>(() => {
    const basis =
      defaultMonth ??
      (props.mode === "range"
        ? props.defaultSelected?.from
        : props.mode === "multiple"
          ? props.defaultSelected?.[0]
          : props.defaultSelected) ??
      new Date();
    return startOfMonth(basis);
  });

  const displayMonth = monthProp ? startOfMonth(monthProp) : internalMonth;

  const goToMonth = useCallback(
    (next: Date): void => {
      const normalized = startOfMonth(next);
      if (!monthProp) setInternalMonth(normalized);
      onMonthChange?.(normalized);
    },
    [monthProp, onMonthChange],
  );

  /* ------------------------------- focus state --------------------------- */

  const rootRef = useRef<HTMLDivElement | null>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const shouldFocusRef = useRef<boolean>(false);

  const setRootRef = useCallback(
    (node: HTMLDivElement | null): void => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as { current: HTMLDivElement | null }).current = node;
    },
    [ref],
  );

  useEffect(() => {
    if (!shouldFocusRef.current || !focusedDate || !rootRef.current) return;
    const selector = `[data-day="${toISODateKey(focusedDate)}"]`;
    const el = rootRef.current.querySelector<HTMLButtonElement>(selector);
    el?.focus();
    shouldFocusRef.current = false;
  }, [focusedDate, displayMonth]);

  /* ------------------------------- derived ------------------------------- */

  const today = startOfDay(new Date());

  const isDateDisabled = useCallback(
    (day: Date): boolean => {
      if (fromDate && compareDay(day, fromDate) < 0) return true;
      if (toDate && compareDay(day, toDate) > 0) return true;
      return disabled ? disabled(day) : false;
    },
    [fromDate, toDate, disabled],
  );

  const weeks = useMemo<Date[][]>(
    () => buildWeeks(displayMonth, weekStartsOn, fixedWeeks),
    [displayMonth, weekStartsOn, fixedWeeks],
  );

  const weekdayShort = useMemo<string[]>(
    () => getWeekdayLabels(weekStartsOn, "short", locale),
    [weekStartsOn, locale],
  );
  const weekdayLong = useMemo<string[]>(
    () => getWeekdayLabels(weekStartsOn, "long", locale),
    [weekStartsOn, locale],
  );

  const monthLabel = useMemo<string>(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }).format(displayMonth),
    [displayMonth, locale],
  );

  const dayLabelFormatter = useMemo<Intl.DateTimeFormat>(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [locale],
  );

  /** Range currently shown, including the in-progress hover preview. */
  const displayRange = useMemo<{ from: Date; to: Date } | null>(() => {
    if (mode !== "range") return null;
    const from = currentRange?.from;
    const to = currentRange?.to;
    if (from && to) return { from, to };
    if (from && hoveredDate && !to) {
      return compareDay(hoveredDate, from) < 0
        ? { from: hoveredDate, to: from }
        : { from, to: hoveredDate };
    }
    if (from) return { from, to: from };
    return null;
  }, [mode, currentRange, hoveredDate]);

  const tabStopDate = useMemo<Date>(() => {
    if (focusedDate && isSameMonth(focusedDate, displayMonth)) {
      return focusedDate;
    }
    const selectedCandidate =
      mode === "single"
        ? currentSingle
        : mode === "range"
          ? currentRange?.from
          : currentMultiple[0];
    if (
      selectedCandidate &&
      isSameMonth(selectedCandidate, displayMonth) &&
      !isDateDisabled(selectedCandidate)
    ) {
      return startOfDay(selectedCandidate);
    }
    if (isSameMonth(today, displayMonth) && !isDateDisabled(today)) {
      return today;
    }
    const last = endOfMonth(displayMonth).getDate();
    for (let d = 1; d <= last; d++) {
      const candidate = new Date(
        displayMonth.getFullYear(),
        displayMonth.getMonth(),
        d,
      );
      if (!isDateDisabled(candidate)) return candidate;
    }
    return startOfMonth(displayMonth);
  }, [
    focusedDate,
    displayMonth,
    mode,
    currentSingle,
    currentRange,
    currentMultiple,
    isDateDisabled,
    today,
  ]);

  /* ------------------------------- handlers ------------------------------ */

  const handleSelectDay = useCallback(
    (day: Date): void => {
      switch (props.mode) {
        case "multiple": {
          const exists = currentMultiple.some((d) => isSameDay(d, day));
          const next = exists
            ? currentMultiple.filter((d) => !isSameDay(d, day))
            : [...currentMultiple, day];
          if (!isControlled) setInternalMultiple(next);
          props.onSelect?.(next);
          break;
        }
        case "range": {
          const from = currentRange?.from;
          const to = currentRange?.to;
          let next: DateRange;
          if (!from || (from && to)) {
            next = { from: day, to: undefined };
          } else {
            next =
              compareDay(day, from) < 0
                ? { from: day, to: from }
                : { from, to: day };
          }
          if (!isControlled) setInternalRange(next);
          props.onSelect?.(next);
          break;
        }
        default: {
          if (!isControlled) setInternalSingle(day);
          props.onSelect?.(day);
        }
      }
    },
    [props, currentMultiple, currentRange, isControlled],
  );

  const handleDayKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, day: Date): void => {
      let next: Date | null = null;
      switch (event.key) {
        case "ArrowLeft":
          next = addDays(day, -1);
          break;
        case "ArrowRight":
          next = addDays(day, 1);
          break;
        case "ArrowUp":
          next = addDays(day, -7);
          break;
        case "ArrowDown":
          next = addDays(day, 7);
          break;
        case "Home":
          next = startOfWeek(day, weekStartsOn);
          break;
        case "End":
          next = addDays(startOfWeek(day, weekStartsOn), 6);
          break;
        case "PageUp":
          next = addMonthsKeepDay(day, event.shiftKey ? -12 : -1);
          break;
        case "PageDown":
          next = addMonthsKeepDay(day, event.shiftKey ? 12 : 1);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (!isDateDisabled(day)) handleSelectDay(day);
          return;
        default:
          return;
      }
      event.preventDefault();
      setFocusedDate(next);
      if (!isSameMonth(next, displayMonth)) goToMonth(next);
      shouldFocusRef.current = true;
    },
    [weekStartsOn, isDateDisabled, handleSelectDay, displayMonth, goToMonth],
  );

  /* ------------------------------- nav guards ---------------------------- */

  const prevDisabled = fromDate
    ? compareDay(endOfMonth(addMonthsKeepDay(displayMonth, -1)), fromDate) < 0
    : false;
  const nextDisabled = toDate
    ? compareDay(startOfMonth(addMonthsKeepDay(displayMonth, 1)), toDate) > 0
    : false;

  /* ------------------------------- rendering ----------------------------- */

  const divProps: Record<string, unknown> = {};
  for (const key of Object.keys(rest)) {
    if (MODE_PROP_KEYS.has(key)) continue;
    divProps[key] = (rest as Record<string, unknown>)[key];
  }

  function renderDay(day: Date): ReactElement {
    const key = toISODateKey(day);
    const outside = !isSameMonth(day, displayMonth);

    if (outside && !showOutsideDays) {
      return (
        <div
          key={key}
          role="gridcell"
          aria-hidden="true"
          className={cn(calendarCellVariants({ size }))}
        />
      );
    }

    if (outside) {
      return (
        <div
          key={key}
          role="gridcell"
          aria-hidden="true"
          className={cn(calendarCellVariants({ size }))}
        >
          <span
            className={cn(
              calendarDayVariants({ size }),
              "cursor-default text-muted-foreground opacity-50",
            )}
          >
            {day.getDate()}
          </span>
        </div>
      );
    }

    const isDisabled = isDateDisabled(day);
    const isToday = isSameDay(day, today);

    const inRange = displayRange
      ? compareDay(day, displayRange.from) >= 0 &&
        compareDay(day, displayRange.to) <= 0
      : false;
    const isRangeStart = displayRange
      ? isSameDay(day, displayRange.from)
      : false;
    const isRangeEnd = displayRange ? isSameDay(day, displayRange.to) : false;

    let isSelected = false;
    if (mode === "single") {
      isSelected = isSameDay(day, currentSingle);
    } else if (mode === "multiple") {
      isSelected = currentMultiple.some((d) => isSameDay(d, day));
    } else {
      isSelected =
        isSameDay(day, currentRange?.from) || isSameDay(day, currentRange?.to);
    }

    const isRangeMiddle = mode === "range" && inRange && !isSelected;
    const tabIndex = isSameDay(day, tabStopDate) ? 0 : -1;

    const cellClass = cn(
      calendarCellVariants({ size }),
      mode === "range" && inRange && "bg-accent",
      mode === "range" && inRange && isRangeStart && "rounded-l-md",
      mode === "range" && inRange && isRangeEnd && "rounded-r-md",
    );

    const dayClass = cn(
      calendarDayVariants({ size }),
      "hover:bg-accent hover:text-accent-foreground",
      isToday && "border border-input",
      isRangeMiddle &&
        "rounded-none bg-transparent text-accent-foreground hover:bg-accent/60",
      isSelected &&
        "border-transparent bg-primary font-medium text-primary-foreground hover:bg-primary/90 focus-visible:bg-primary/90",
      isDisabled &&
        "pointer-events-none text-muted-foreground opacity-40 hover:bg-transparent hover:text-muted-foreground",
    );

    return (
      <div
        key={key}
        role="gridcell"
        aria-selected={isSelected || undefined}
        className={cellClass}
      >
        <button
          type="button"
          data-day={key}
          data-slot="calendar-day"
          data-selected={isSelected || undefined}
          data-today={isToday || undefined}
          data-disabled={isDisabled || undefined}
          aria-label={dayLabelFormatter.format(day)}
          aria-disabled={isDisabled || undefined}
          aria-current={isToday ? "date" : undefined}
          tabIndex={tabIndex}
          className={dayClass}
          onClick={(): void => {
            if (!isDisabled) handleSelectDay(day);
          }}
          onMouseEnter={(): void => {
            if (mode === "range" && !isDisabled) setHoveredDate(day);
          }}
          onFocus={(): void => setFocusedDate(day)}
          onKeyDown={(event): void => handleDayKeyDown(event, day)}
        >
          {day.getDate()}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setRootRef}
      data-slot="calendar"
      data-mode={mode}
      className={cn(
        "inline-block w-fit select-none space-y-3 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-sm",
        className,
      )}
      {...(divProps as ComponentProps<"div">)}
    >
      <div className="flex items-center justify-between gap-2 px-0.5">
        <button
          type="button"
          aria-label="Go to previous month"
          disabled={prevDisabled}
          onClick={(): void => goToMonth(addMonthsKeepDay(displayMonth, -1))}
          className={navButtonClass}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <div
          aria-live="polite"
          aria-atomic="true"
          className="text-sm font-medium capitalize"
        >
          {monthLabel}
        </div>
        <button
          type="button"
          aria-label="Go to next month"
          disabled={nextDisabled}
          onClick={(): void => goToMonth(addMonthsKeepDay(displayMonth, 1))}
          className={navButtonClass}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div
        role="grid"
        aria-label={monthLabel}
        aria-multiselectable={mode !== "single" ? true : undefined}
      >
        <div role="row" className="flex">
          {weekdayShort.map((label, index) => (
            <div
              key={label + index}
              role="columnheader"
              aria-label={weekdayLong[index]}
              className={cn(calendarWeekdayVariants({ size }))}
            >
              {label}
            </div>
          ))}
        </div>
        <div onMouseLeave={(): void => setHoveredDate(null)}>
          {weeks.map((week, index) => (
            <div key={index} role="row" className="mt-1 flex">
              {week.map((day) => renderDay(day))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar, calendarCellVariants, calendarDayVariants };

export default Calendar;
