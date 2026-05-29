import type { Meta, StoryObj } from "@storybook/react";
import { CalendarDays } from "lucide-react";
import { useState, type ReactElement } from "react";

import { Calendar } from "./calendar";
import {
  calendarSizeIds,
  type CalendarSizeId,
  type DateRange,
} from "./calendar";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Accessible month-grid date picker supporting single, multiple, and range selection. " +
          "Built with zero date-library dependencies and styled entirely with @schemavaults/theme tokens. " +
          "Full keyboard support: arrow keys move by day, Up/Down by week, Home/End to week edges, " +
          "PageUp/PageDown by month (hold Shift for years), and Enter/Space to select. " +
          "Compose it inside a Popover + Button for a classic date-picker field.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: calendarSizeIds,
      control: { type: "radio" },
    },
    mode: {
      options: ["single", "multiple", "range"],
      control: { type: "radio" },
    },
    weekStartsOn: {
      options: [0, 1, 2, 3, 4, 5, 6],
      control: { type: "select" },
    },
    showOutsideDays: { control: { type: "boolean" } },
    fixedWeeks: { control: { type: "boolean" } },
  },
  args: {
    size: "default",
    showOutsideDays: true,
    fixedWeeks: false,
    weekStartsOn: 0,
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

function formatDate(date: Date | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export const Default: Story = {
  render: (args): ReactElement => {
    const { size, weekStartsOn, showOutsideDays, fixedWeeks } = args;
    function SingleExample(): ReactElement {
      const [selected, setSelected] = useState<Date | undefined>(new Date());
      return (
        <div className="flex flex-col items-center gap-3">
          <Calendar
            mode="single"
            size={size}
            weekStartsOn={weekStartsOn}
            showOutsideDays={showOutsideDays}
            fixedWeeks={fixedWeeks}
            selected={selected}
            onSelect={setSelected}
          />
          <p className="text-sm text-muted-foreground">
            Selected:{" "}
            <span className="font-medium text-foreground">
              {formatDate(selected)}
            </span>
          </p>
        </div>
      );
    }
    return <SingleExample />;
  },
};

export const Sizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-wrap items-start gap-6">
      {calendarSizeIds.map((size: CalendarSizeId) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <Calendar mode="single" size={size} defaultSelected={new Date()} />
        </div>
      ))}
    </div>
  ),
};

export const WeekStartsOnMonday: Story = {
  render: (): ReactElement => (
    <Calendar mode="single" weekStartsOn={1} defaultSelected={new Date()} />
  ),
};

export const RangeSelection: Story = {
  render: (): ReactElement => {
    function RangeExample(): ReactElement {
      const today = new Date();
      const [range, setRange] = useState<DateRange | undefined>({
        from: today,
        to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      });
      return (
        <div className="flex flex-col items-center gap-3">
          <Calendar mode="range" selected={range} onSelect={setRange} />
          <p className="text-sm text-muted-foreground">
            {formatDate(range?.from)} → {formatDate(range?.to)}
          </p>
        </div>
      );
    }
    return <RangeExample />;
  },
};

export const MultipleSelection: Story = {
  render: (): ReactElement => {
    function MultipleExample(): ReactElement {
      const [dates, setDates] = useState<Date[]>([]);
      return (
        <div className="flex flex-col items-center gap-3">
          <Calendar mode="multiple" selected={dates} onSelect={setDates} />
          <p className="max-w-72 text-center text-sm text-muted-foreground">
            {dates.length === 0
              ? "Click days to toggle them on or off."
              : dates
                  .slice()
                  .sort((a, b) => a.getTime() - b.getTime())
                  .map((d) => formatDate(d))
                  .join(", ")}
          </p>
        </div>
      );
    }
    return <MultipleExample />;
  },
};

export const WithDisabledDates: Story = {
  render: (): ReactElement => {
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const toDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    return (
      <div className="flex flex-col items-center gap-3">
        <Calendar
          mode="single"
          defaultSelected={now}
          fromDate={fromDate}
          toDate={toDate}
          disabled={(date): boolean => {
            const day = date.getDay();
            return day === 0 || day === 6;
          }}
        />
        <p className="max-w-72 text-center text-sm text-muted-foreground">
          Weekends are disabled and navigation is clamped to this month and the
          next.
        </p>
      </div>
    );
  },
};

export const DatePickerField: Story = {
  render: (): ReactElement => {
    function DatePickerExample(): ReactElement {
      const [open, setOpen] = useState<boolean>(false);
      const [selected, setSelected] = useState<Date | undefined>(undefined);
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-60 justify-start gap-2 font-normal"
            >
              <CalendarDays className="size-4 opacity-70" />
              {selected ? (
                formatDate(selected)
              ) : (
                <span className="text-muted-foreground">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selected}
              defaultMonth={selected}
              onSelect={(date): void => {
                setSelected(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      );
    }
    return <DatePickerExample />;
  },
};
