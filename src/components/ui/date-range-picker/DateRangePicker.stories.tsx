import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";

import { DateRangePicker } from "./date-range-picker";
import { calendarSizeIds, type DateRange } from "@/components/ui/calendar";

const meta = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A ready-made start/end-date input that wraps a Popover + Button + " +
          "Calendar (`mode=\"range\"`). Pick a start day, then an end day; the " +
          "popover closes automatically once both ends are chosen. Supports " +
          "controlled (`value`) and uncontrolled (`defaultValue`) usage, date " +
          "bounds (`fromDate`/`toDate`), and a `disabledDates` predicate. See " +
          "`DatePicker` for single-date selection.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: calendarSizeIds,
      control: { type: "radio" },
    },
    align: {
      options: ["start", "center", "end"],
      control: { type: "radio" },
    },
    placeholder: { control: { type: "text" } },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    size: "default",
    align: "start",
    placeholder: "Pick a date range",
    disabled: false,
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args): ReactElement => {
    function Example(): ReactElement {
      const [value, setValue] = useState<DateRange | undefined>(undefined);
      return (
        <DateRangePicker {...args} value={value} onValueChange={setValue} />
      );
    }
    return <Example />;
  },
};

export const WithInitialRange: Story = {
  render: (args): ReactElement => {
    function Example(): ReactElement {
      const today = new Date();
      const [value, setValue] = useState<DateRange | undefined>({
        from: today,
        to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      });
      return (
        <DateRangePicker {...args} value={value} onValueChange={setValue} />
      );
    }
    return <Example />;
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Bounded: Story = {
  render: (args): ReactElement => {
    function Example(): ReactElement {
      const now = new Date();
      const fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const toDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      const [value, setValue] = useState<DateRange | undefined>(undefined);
      return (
        <div className="flex flex-col items-center gap-3">
          <DateRangePicker
            {...args}
            value={value}
            onValueChange={setValue}
            fromDate={fromDate}
            toDate={toDate}
            disabledDates={(date): boolean => {
              const day = date.getDay();
              return day === 0 || day === 6;
            }}
          />
          <p className="max-w-72 text-center text-sm text-muted-foreground">
            Selection is clamped to this month and the next, and weekends are
            disabled.
          </p>
        </div>
      );
    }
    return <Example />;
  },
};
