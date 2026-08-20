import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useState, type ComponentProps, type ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TimePicker,
  timePickerFormatIds,
  timePickerSizeIds,
  type TimeValue,
} from "./time-picker";

const meta = {
  title: "Components/TimePicker",
  component: TimePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A time-of-day input that composes a Popover + Button + scrollable " +
          "hour/minute/second columns. Supports controlled (`value`) and " +
          "uncontrolled (`defaultValue`) usage, 12h/24h display, optional " +
          "seconds, and configurable minute/second steps. Companion to " +
          "`DatePicker` for time selection.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: timePickerSizeIds,
      control: { type: "radio" },
    },
    format: {
      options: timePickerFormatIds,
      control: { type: "radio" },
    },
    align: {
      options: ["start", "center", "end"],
      control: { type: "radio" },
    },
    showSeconds: { control: { type: "boolean" } },
    minuteStep: { control: { type: "number", min: 1, max: 30, step: 1 } },
    secondStep: { control: { type: "number", min: 1, max: 30, step: 1 } },
    placeholder: { control: { type: "text" } },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    size: "default",
    format: "24h",
    align: "start",
    showSeconds: false,
    minuteStep: 1,
    secondStep: 1,
    placeholder: "Pick a time",
    disabled: false,
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledExample(
  args: ComponentProps<typeof TimePicker>,
): ReactElement {
  const [value, setValue] = useState<TimeValue | undefined>(undefined);
  return (
    <div className="flex flex-col items-start gap-3">
      <TimePicker {...args} value={value} onValueChange={setValue} />
      <p className="text-xs text-muted-foreground tabular-nums">
        {value
          ? `value = { hours: ${value.hours}, minutes: ${value.minutes}${
              value.seconds !== undefined ? `, seconds: ${value.seconds}` : ""
            } }`
          : "value = undefined"}
      </p>
    </div>
  );
}

export const Default: Story = {
  render: (args): ReactElement => <ControlledExample {...args} />,
};

export const TwelveHourFormat: Story = {
  args: { format: "12h" },
  render: (args): ReactElement => <ControlledExample {...args} />,
};

export const WithSeconds: Story = {
  args: { showSeconds: true },
  render: (args): ReactElement => <ControlledExample {...args} />,
};

export const FifteenMinuteSteps: Story = {
  args: { minuteStep: 15 },
  render: (args): ReactElement => <ControlledExample {...args} />,
};

export const PrefilledDefault: Story = {
  args: { defaultValue: { hours: 14, minutes: 30 } },
};

export const Small: Story = {
  args: { size: "sm" },
  render: (args): ReactElement => <ControlledExample {...args} />,
};

export const Large: Story = {
  args: { size: "lg", format: "12h", showSeconds: true },
  render: (args): ReactElement => <ControlledExample {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: { hours: 9, minutes: 0 } },
};

export const CustomFormat: Story = {
  args: {
    formatValue: (value): string => {
      const h = value.hours.toString().padStart(2, "0");
      const m = value.minutes.toString().padStart(2, "0");
      return `T-minus ${h}h ${m}m`;
    },
  },
  render: (args): ReactElement => <ControlledExample {...args} />,
};

function InsideDialogDemo(): ReactElement {
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Schedule a run</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule a run</DialogTitle>
          <DialogDescription>
            The hour and minute columns must stay scrollable with a mouse
            wheel or trackpad even though the dialog locks page scrolling.
          </DialogDescription>
        </DialogHeader>
        <TimePicker defaultValue={{ hours: 9, minutes: 30 }} id="run-time" />
      </DialogContent>
    </Dialog>
  );
}

/**
 * Regression coverage for the panel being wheel-dead inside a modal `Dialog`.
 * A non-modal popover portals outside the dialog's `react-remove-scroll`
 * shard, so wheel events over the hour/minute columns were cancelled; the
 * modal popover owns the innermost scroll lock instead.
 */
export const InsideDialog: Story = {
  render: () => <InsideDialogDemo />,
  play: async ({ step }) => {
    const body = within(document.body);
    const trigger = document.getElementById("run-time");
    expect(trigger).not.toBeNull();
    if (!trigger) throw new Error("time picker trigger not found");

    await step("Open the panel inside the dialog", async () => {
      await userEvent.click(trigger);
    });

    const hours = await waitFor(() =>
      body.findByRole("listbox", { name: /^hour$/i }),
    );
    const viewport = hours.closest<HTMLElement>(
      "[data-slot='scroll-area-viewport']",
    );
    expect(viewport).not.toBeNull();
    if (!viewport) throw new Error("scroll area viewport not found");

    await waitFor(() => {
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    });

    await step("Wheel events over the column are not cancelled", async () => {
      const wheelEvent = new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaY: 120,
      });
      viewport.dispatchEvent(wheelEvent);
      expect(wheelEvent.defaultPrevented).toBe(false);
    });

    await step("Escape closes the panel but not the dialog", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(body.queryByRole("listbox", { name: /^hour$/i })).toBeNull();
      });
      expect(body.getByRole("dialog")).toBeInTheDocument();
    });
  },
};
