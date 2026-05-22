import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import {
  Countdown,
  countdownVariantIds,
  countdownSizeIds,
  countdownColorIds,
} from "./countdown";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** Returns an epoch-ms timestamp `ms` milliseconds in the future. */
function fromNow(ms: number): number {
  return Date.now() + ms;
}

const meta = {
  title: "Components/Countdown",
  component: Countdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Live countdown timer that ticks down to a target date/time. Useful for trial expiry, scheduled maintenance windows, limited-time offers, and session timeouts.\n\nShips three layouts (`boxed`, `plain`, `compact`), four colour intents themed via `@schemavaults/theme`, and three sizes. The `to` target accepts a `Date`, an ISO string, or an epoch-ms number. Fires `onComplete` exactly once when the target is reached and can render custom `completedContent` in place of the timer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    to: {
      control: { type: "date" },
      description: "Target date/time. Accepts a Date, ISO string, or epoch-ms number.",
    },
    variant: {
      options: countdownVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: countdownSizeIds,
      control: { type: "radio" },
    },
    color: {
      options: countdownColorIds,
      control: { type: "radio" },
    },
    showLabels: { control: { type: "boolean" } },
    showDays: { control: { type: "boolean" } },
    showSeconds: { control: { type: "boolean" } },
    label: { control: { type: "text" } },
  },
  args: {
    to: fromNow(3 * DAY_MS + 4 * HOUR_MS + 12 * MINUTE_MS),
    variant: "boxed",
    size: "default",
    color: "default",
    showLabels: true,
    showDays: true,
    showSeconds: true,
    label: "Trial ends in",
  },
} satisfies Meta<typeof Countdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">boxed</span>
        <Countdown to={fromNow(2 * DAY_MS + 5 * HOUR_MS + 30 * MINUTE_MS)} variant="boxed" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">plain</span>
        <Countdown to={fromNow(2 * DAY_MS + 5 * HOUR_MS + 30 * MINUTE_MS)} variant="plain" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">compact</span>
        <Countdown to={fromNow(2 * DAY_MS + 5 * HOUR_MS + 30 * MINUTE_MS)} variant="compact" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-8">
      <Countdown to={fromNow(DAY_MS + 3 * HOUR_MS)} size="sm" />
      <Countdown to={fromNow(DAY_MS + 3 * HOUR_MS)} size="default" />
      <Countdown to={fromNow(DAY_MS + 3 * HOUR_MS)} size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-6">
      <Countdown to={fromNow(6 * HOUR_MS + 45 * MINUTE_MS)} color="default" />
      <Countdown to={fromNow(6 * HOUR_MS + 45 * MINUTE_MS)} color="brand" />
      <Countdown to={fromNow(6 * HOUR_MS + 45 * MINUTE_MS)} color="warning" />
      <Countdown to={fromNow(6 * HOUR_MS + 45 * MINUTE_MS)} color="destructive" />
    </div>
  ),
};

export const WithoutLabels: Story = {
  args: {
    showLabels: false,
    label: "Maintenance window opens in",
  },
};

export const HoursAndMinutesOnly: Story = {
  args: {
    showDays: false,
    showSeconds: false,
    to: fromNow(8 * HOUR_MS + 25 * MINUTE_MS),
    label: "Session expires in",
  },
};

export const ImminentDeadline: Story = {
  args: {
    variant: "compact",
    color: "destructive",
    showDays: false,
    to: fromNow(9 * MINUTE_MS + 30 * SECOND_MS),
    label: "Offer expires in",
  },
};

export const Completed: Story = {
  args: {
    to: Date.now() - SECOND_MS,
    completedContent: (
      <span className="text-sm font-semibold text-destructive">
        Offer expired
      </span>
    ),
  },
};
