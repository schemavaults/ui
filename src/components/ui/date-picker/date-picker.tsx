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
import { Calendar, type CalendarSingleProps } from "@/components/ui/calendar";

export interface DatePickerProps
  extends Pick<
    CalendarSingleProps,
    | "size"
    | "weekStartsOn"
    | "fromDate"
    | "toDate"
    | "showOutsideDays"
    | "fixedWeeks"
    | "locale"
  > {
  /** Controlled selected date. */
  value?: Date;
  /** Initial selected date when uncontrolled. */
  defaultValue?: Date;
  /** Called whenever the selected date changes. */
  onValueChange?: (date: Date | undefined) => void;
  /** Text shown in the trigger when no date is selected. Defaults to "Pick a date". */
  placeholder?: string;
  /** Disables the trigger button. */
  disabled?: boolean;
  /** Predicate marking individual days as non-selectable in the calendar. */
  disabledDates?: (date: Date) => boolean;
  /** Format the selected date for display in the trigger. */
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
 * A single-date input that composes a `Popover`, `Button`, and `Calendar`
 * (`mode="single"`) into a ready-made date-picker field. Supports both
 * controlled (`value`/`open`) and uncontrolled (`defaultValue`) usage.
 */
function DatePicker(props: DatePickerProps): ReactElement {
  const {
    value,
    defaultValue,
    onValueChange,
    placeholder = "Pick a date",
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
  const [internalSelected, setInternalSelected] = useState<Date | undefined>(
    defaultValue,
  );

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

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn("w-60 justify-start gap-2 font-normal", className)}
        >
          <CalendarDays className="size-4 opacity-70" />
          {selected ? (
            format(selected)
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          mode="single"
          size={size}
          weekStartsOn={weekStartsOn}
          fromDate={fromDate}
          toDate={toDate}
          showOutsideDays={showOutsideDays}
          fixedWeeks={fixedWeeks}
          locale={locale}
          disabled={disabledDates}
          selected={selected}
          defaultMonth={selected}
          onSelect={(date): void => {
            if (!isValueControlled) setInternalSelected(date);
            onValueChange?.(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

DatePicker.displayName = "DatePicker";

export { DatePicker };
export default DatePicker;
