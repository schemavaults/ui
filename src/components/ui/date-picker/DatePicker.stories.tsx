import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";

import { DatePicker } from "./date-picker";
import { calendarSizeIds } from "@/components/ui/calendar";

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A ready-made single-date input that wraps a Popover + Button + " +
          "Calendar (`mode=\"single\"`). Selecting a day fills the trigger and " +
          "closes the popover. Supports controlled (`value`) and uncontrolled " +
          "(`defaultValue`) usage, date bounds (`fromDate`/`toDate`), and a " +
          "`disabledDates` predicate. See `DateRangePicker` for range selection.",
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
    placeholder: "Pick a date",
    disabled: false,
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args): ReactElement => {
    function Example(): ReactElement {
      const [value, setValue] = useState<Date | undefined>(undefined);
      return <DatePicker {...args} value={value} onValueChange={setValue} />;
    }
    return <Example />;
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Select your birthday",
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
      const [value, setValue] = useState<Date | undefined>(undefined);
      return (
        <div className="flex flex-col items-center gap-3">
          <DatePicker
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
