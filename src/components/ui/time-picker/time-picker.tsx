"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { Clock } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export const timePickerSizeIds = ["sm", "default", "lg"] as const satisfies string[];
export type TimePickerSizeId = (typeof timePickerSizeIds)[number];

export const timePickerFormatIds = ["12h", "24h"] as const satisfies string[];
export type TimePickerFormatId = (typeof timePickerFormatIds)[number];

export interface TimeValue {
  /** 0-23 hours (always stored in 24-hour form regardless of display format). */
  hours: number;
  /** 0-59 minutes. */
  minutes: number;
  /** 0-59 seconds. Only populated when `showSeconds` is enabled. */
  seconds?: number;
}

const triggerSizeClasses = {
  sm: "h-9 px-3 text-xs",
  default: "h-10 px-4",
  lg: "h-11 px-5 text-base",
} as const satisfies Record<TimePickerSizeId, string>;

const cellSizeClasses = {
  sm: "h-7 text-xs",
  default: "h-8 text-sm",
  lg: "h-9 text-base",
} as const satisfies Record<TimePickerSizeId, string>;

const panelHeightClasses = {
  sm: "h-44",
  default: "h-52",
  lg: "h-56",
} as const satisfies Record<TimePickerSizeId, string>;

const triggerVariants = cva(
  "justify-start gap-2 font-normal tabular-nums",
  {
    variants: {
      size: {
        sm: "w-44",
        default: "w-52",
        lg: "w-60",
      } satisfies Record<TimePickerSizeId, string>,
    },
    defaultVariants: { size: "default" },
  },
);

export interface TimePickerProps extends VariantProps<typeof triggerVariants> {
  /** Controlled selected time. */
  value?: TimeValue;
  /** Initial selected time when uncontrolled. */
  defaultValue?: TimeValue;
  /** Called whenever the selected time changes. */
  onValueChange?: (value: TimeValue | undefined) => void;
  /** Text shown in the trigger when no time is selected. Defaults to "Pick a time". */
  placeholder?: string;
  /** Disables the trigger button. */
  disabled?: boolean;
  /** Display format. Defaults to "24h". */
  format?: TimePickerFormatId;
  /** Whether to include a seconds column. Defaults to false. */
  showSeconds?: boolean;
  /** Minute step shown in the panel. Defaults to 1. */
  minuteStep?: number;
  /** Second step shown in the panel. Defaults to 1. */
  secondStep?: number;
  /** Format the selected time for display in the trigger. */
  formatValue?: (value: TimeValue) => string;
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

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function defaultFormatValue(
  value: TimeValue,
  format: TimePickerFormatId,
  showSeconds: boolean,
): string {
  const { hours, minutes, seconds } = value;
  if (format === "24h") {
    return showSeconds
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds ?? 0)}`
      : `${pad(hours)}:${pad(minutes)}`;
  }
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const base = `${pad(displayHour)}:${pad(minutes)}`;
  return showSeconds ? `${base}:${pad(seconds ?? 0)} ${period}` : `${base} ${period}`;
}

function range(from: number, to: number, step: number): number[] {
  const result: number[] = [];
  for (let i = from; i <= to; i += step) result.push(i);
  return result;
}

interface ColumnProps {
  label: string;
  items: number[];
  active: number;
  onSelect: (value: number) => void;
  formatItem: (value: number) => string;
  size: TimePickerSizeId;
}

function TimeColumn({
  label,
  items,
  active,
  onSelect,
  formatItem,
  size,
}: ColumnProps): ReactElement {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const node = activeRef.current;
    if (!node) return;
    node.scrollIntoView({ block: "center" });
  }, [active]);

  return (
    <div className="flex flex-col items-stretch min-w-0">
      <div
        className="px-2 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground text-center"
        aria-hidden="true"
      >
        {label}
      </div>
      <ScrollArea
        className={cn("w-14 rounded-md border border-border bg-muted/30", panelHeightClasses[size])}
      >
        <div className="flex flex-col gap-0.5 p-1" ref={viewportRef} role="listbox" aria-label={label}>
          {items.map((item): ReactElement => {
            const isActive = item === active;
            return (
              <button
                key={item}
                type="button"
                role="option"
                aria-selected={isActive}
                ref={isActive ? activeRef : undefined}
                onClick={(): void => onSelect(item)}
                className={cn(
                  "w-full rounded-sm tabular-nums transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "hover:bg-accent hover:text-accent-foreground",
                  cellSizeClasses[size],
                  isActive &&
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
              >
                {formatItem(item)}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

/**
 * A time-of-day input that composes a `Popover`, `Button`, and scrollable
 * hour/minute/second columns. Supports both controlled (`value`/`open`) and
 * uncontrolled (`defaultValue`) usage, 12h/24h display, optional seconds, and
 * configurable minute/second steps. Complements `DatePicker` and
 * `DateRangePicker`.
 */
function TimePicker(props: TimePickerProps): ReactElement {
  const {
    value,
    defaultValue,
    onValueChange,
    placeholder = "Pick a time",
    disabled,
    format = "24h",
    showSeconds = false,
    minuteStep = 1,
    secondStep = 1,
    formatValue,
    align = "start",
    open,
    onOpenChange,
    id,
    className,
    size,
  } = props;

  const resolvedSize: TimePickerSizeId = size ?? "default";

  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const [internalValue, setInternalValue] = useState<TimeValue | undefined>(
    defaultValue,
  );

  const isOpenControlled = open !== undefined;
  const isOpen = isOpenControlled ? open : internalOpen;
  const setOpen = useCallback(
    (next: boolean): void => {
      if (!isOpenControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange],
  );

  const isValueControlled = value !== undefined;
  const selected = isValueControlled ? value : internalValue;

  const emit = useCallback(
    (next: TimeValue): void => {
      if (!isValueControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isValueControlled, onValueChange],
  );

  const format12 = format === "12h";
  const hourItems = useMemo(
    () => (format12 ? range(1, 12, 1) : range(0, 23, 1)),
    [format12],
  );
  const minuteItems = useMemo(
    () => range(0, 59, Math.max(1, minuteStep)),
    [minuteStep],
  );
  const secondItems = useMemo(
    () => range(0, 59, Math.max(1, secondStep)),
    [secondStep],
  );

  const activeHour24 = selected?.hours ?? 0;
  const activeHourDisplay = format12
    ? activeHour24 % 12 === 0
      ? 12
      : activeHour24 % 12
    : activeHour24;
  const activeMinute = selected?.minutes ?? 0;
  const activeSecond = selected?.seconds ?? 0;
  const isPm = activeHour24 >= 12;

  const handleHour = useCallback(
    (hour: number): void => {
      const next24 = format12
        ? (hour % 12) + (isPm ? 12 : 0)
        : hour;
      emit({
        hours: next24,
        minutes: activeMinute,
        ...(showSeconds ? { seconds: activeSecond } : {}),
      });
    },
    [emit, format12, isPm, activeMinute, activeSecond, showSeconds],
  );

  const handleMinute = useCallback(
    (minute: number): void => {
      emit({
        hours: activeHour24,
        minutes: minute,
        ...(showSeconds ? { seconds: activeSecond } : {}),
      });
    },
    [emit, activeHour24, activeSecond, showSeconds],
  );

  const handleSecond = useCallback(
    (second: number): void => {
      emit({ hours: activeHour24, minutes: activeMinute, seconds: second });
    },
    [emit, activeHour24, activeMinute],
  );

  const handlePeriod = useCallback(
    (period: "AM" | "PM"): void => {
      const base = activeHour24 % 12;
      const next24 = period === "PM" ? base + 12 : base;
      emit({
        hours: next24,
        minutes: activeMinute,
        ...(showSeconds ? { seconds: activeSecond } : {}),
      });
    },
    [emit, activeHour24, activeMinute, activeSecond, showSeconds],
  );

  const display = formatValue
    ? selected
      ? formatValue(selected)
      : undefined
    : selected
      ? defaultFormatValue(selected, format, showSeconds)
      : undefined;

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            triggerVariants({ size: resolvedSize }),
            triggerSizeClasses[resolvedSize],
            className,
          )}
        >
          <Clock className="size-4 opacity-70" />
          {display ? (
            display
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align={align}>
        <div className="flex items-start gap-2">
          <TimeColumn
            label="Hour"
            items={hourItems}
            active={activeHourDisplay}
            onSelect={handleHour}
            formatItem={pad}
            size={resolvedSize}
          />
          <TimeColumn
            label="Min"
            items={minuteItems}
            active={activeMinute}
            onSelect={handleMinute}
            formatItem={pad}
            size={resolvedSize}
          />
          {showSeconds ? (
            <TimeColumn
              label="Sec"
              items={secondItems}
              active={activeSecond}
              onSelect={handleSecond}
              formatItem={pad}
              size={resolvedSize}
            />
          ) : null}
          {format12 ? (
            <div className="flex flex-col items-stretch">
              <div
                className="px-2 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground text-center"
                aria-hidden="true"
              >
                AM/PM
              </div>
              <div
                className={cn(
                  "flex flex-col gap-1 rounded-md border border-border bg-muted/30 p-1",
                  panelHeightClasses[resolvedSize],
                )}
                role="radiogroup"
                aria-label="AM/PM"
              >
                {(["AM", "PM"] as const).map((period): ReactElement => {
                  const isActive = isPm ? period === "PM" : period === "AM";
                  return (
                    <button
                      key={period}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={(): void => handlePeriod(period)}
                      className={cn(
                        "w-12 rounded-sm font-medium transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        "hover:bg-accent hover:text-accent-foreground",
                        cellSizeClasses[resolvedSize],
                        isActive &&
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      )}
                    >
                      {period}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(): void => {
              const now = new Date();
              emit({
                hours: now.getHours(),
                minutes: now.getMinutes(),
                ...(showSeconds ? { seconds: now.getSeconds() } : {}),
              });
            }}
          >
            Now
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={(): void => setOpen(false)}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

TimePicker.displayName = "TimePicker";

export { TimePicker, triggerVariants as timePickerTriggerVariants };
export default TimePicker;
