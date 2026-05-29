"use client";

import { useState, type ReactElement } from "react";
import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar,
  type CalendarRangeProps,
  type DateRange,
} from "@/components/ui/calendar";

export interface DateRangePickerProps
  extends Pick<
    CalendarRangeProps,
    | "size"
    | "weekStartsOn"
    | "fromDate"
    | "toDate"
    | "showOutsideDays"
    | "fixedWeeks"
    | "locale"
  > {
  /** Controlled selected range. */
  value?: DateRange;
  /** Initial selected range when uncontrolled. */
  defaultValue?: DateRange;
  /** Called whenever the selected range changes. */
  onValueChange?: (range: DateRange | undefined) => void;
  /** Text shown in the trigger when no range is selected. Defaults to "Pick a date range". */
  placeholder?: string;
  /** Disables the trigger button. */
  disabled?: boolean;
  /** Predicate marking individual days as non-selectable in the calendar. */
  disabledDates?: (date: Date) => boolean;
  /** Format a single date for display in the trigger. */
  formatDate?: (date: Date) => string;
  /** Alignment of the popover relative to the trigger. Defaults to "start". */
  align?: "start" | "center" | "end";
  /** Controlled popover open state. */
  open?: boolean;
  /** Called when the popover open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Forwarded to the trigger button. */
  id?: string;
  /** Class name applied to the trigger button. */
  className?: string;
}

function defaultFormatDate(locale: string | undefined, date: Date): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * A start/end-date input that composes a `Popover`, `Button`, and `Calendar`
 * (`mode="range"`) into a ready-made date-range-picker field. The popover
 * closes automatically once both ends of the range are selected. Supports both
 * controlled (`value`/`open`) and uncontrolled (`defaultValue`) usage.
 */
function DateRangePicker(props: DateRangePickerProps): ReactElement {
  const {
    value,
    defaultValue,
    onValueChange,
    placeholder = "Pick a date range",
    disabled,
    disabledDates,
    formatDate,
    align = "start",
    open,
    onOpenChange,
    id,
    className,
    size,
    weekStartsOn,
    fromDate,
    toDate,
    showOutsideDays,
    fixedWeeks,
    locale,
  } = props;

  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const [internalSelected, setInternalSelected] = useState<
    DateRange | undefined
  >(defaultValue);

  const isOpenControlled = open !== undefined;
  const isOpen = isOpenControlled ? open : internalOpen;
  const setOpen = (next: boolean): void => {
    if (!isOpenControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const isValueControlled = value !== undefined;
  const selected = isValueControlled ? value : internalSelected;

  const format = formatDate ?? ((date: Date): string =>
    defaultFormatDate(locale, date));

  function renderLabel(): ReactElement | string {
    if (!selected?.from) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }
    if (!selected.to) {
      return `${format(selected.from)} – …`;
    }
    return `${format(selected.from)} – ${format(selected.to)}`;
  }

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn("w-72 justify-start gap-2 font-normal", className)}
        >
          <CalendarDays className="size-4 opacity-70" />
          {renderLabel()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          mode="range"
          size={size}
          weekStartsOn={weekStartsOn}
          fromDate={fromDate}
          toDate={toDate}
          showOutsideDays={showOutsideDays}
          fixedWeeks={fixedWeeks}
          locale={locale}
          disabled={disabledDates}
          selected={selected}
          defaultMonth={selected?.from}
          onSelect={(range): void => {
            if (!isValueControlled) setInternalSelected(range);
            onValueChange?.(range);
            if (range?.from && range.to) setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };
export default DateRangePicker;
