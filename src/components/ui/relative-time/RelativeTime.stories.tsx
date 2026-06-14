import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState, type ReactElement } from "react";

import {
  RelativeTime,
  relativeTimeColorIds,
  relativeTimeSizeIds,
  relativeTimeUnits,
  relativeTimeWeightIds,
} from "./relative-time";

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function offsetFromNow(ms: number): Date {
  return new Date(Date.now() + ms);
}

const meta = {
  title: "Components/RelativeTime",
  component: RelativeTime,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An auto-updating relative timestamp (e.g. \"5 minutes ago\", \"in 2 hours\") with an absolute-timestamp tooltip on hover/focus. Uses `Intl.RelativeTimeFormat` for localization and picks a sensible refresh cadence based on the magnitude of the delta. Themed via `text-foreground`, `text-muted-foreground`, `text-primary`, `text-destructive`, and `text-warning` from `@schemavaults/theme`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    color: { options: relativeTimeColorIds, control: { type: "radio" } },
    size: { options: relativeTimeSizeIds, control: { type: "radio" } },
    weight: { options: relativeTimeWeightIds, control: { type: "radio" } },
    underline: { control: { type: "boolean" } },
    showTooltip: { control: { type: "boolean" } },
    numeric: { options: ["auto", "always"], control: { type: "radio" } },
    formatStyle: {
      options: ["long", "short", "narrow"],
      control: { type: "radio" },
    },
    maxUnit: { options: relativeTimeUnits, control: { type: "select" } },
    freeze: { control: { type: "boolean" } },
    locale: { control: { type: "text" } },
    refreshIntervalMs: { control: { type: "number", min: 0, step: 100 } },
  },
  args: {
    date: offsetFromNow(-5 * MINUTE),
    color: "muted",
    size: "sm",
    weight: "normal",
    underline: false,
    showTooltip: true,
    numeric: "auto",
    formatStyle: "long",
    maxUnit: "year",
    freeze: false,
  },
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FewSecondsAgo: Story = {
  args: { date: offsetFromNow(-30 * SECOND) },
};

export const FewMinutesAgo: Story = {
  args: { date: offsetFromNow(-5 * MINUTE) },
};

export const Hours: Story = {
  args: { date: offsetFromNow(-3 * HOUR) },
};

export const Yesterday: Story = {
  args: { date: offsetFromNow(-1 * DAY) },
};

export const LastWeek: Story = {
  args: { date: offsetFromNow(-7 * DAY) },
};

export const InTheFuture: Story = {
  args: { date: offsetFromNow(2 * HOUR) },
};

export const ShortStyle: Story = {
  args: {
    date: offsetFromNow(-45 * MINUTE),
    formatStyle: "short",
  },
};

export const NarrowStyle: Story = {
  args: {
    date: offsetFromNow(-45 * MINUTE),
    formatStyle: "narrow",
  },
};

export const Localized: Story = {
  args: {
    date: offsetFromNow(-3 * HOUR),
    locale: "fr-FR",
  },
};

export const NumericAlways: Story = {
  args: {
    date: offsetFromNow(-1 * DAY),
    numeric: "always",
  },
};

export const WithDottedUnderline: Story = {
  args: {
    date: offsetFromNow(-12 * MINUTE),
    underline: true,
  },
};

export const Frozen: Story = {
  args: {
    date: offsetFromNow(-30 * SECOND),
    freeze: true,
  },
};

function ColorMatrix(): ReactElement {
  return (
    <div className="flex flex-col gap-2 items-start">
      {relativeTimeColorIds.map((color) => (
        <div key={color} className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground w-20">
            {color}
          </span>
          <RelativeTime date={offsetFromNow(-15 * MINUTE)} color={color} />
        </div>
      ))}
    </div>
  );
}

export const Colors: Story = {
  render: (): ReactElement => <ColorMatrix />,
};

function SizeMatrix(): ReactElement {
  return (
    <div className="flex flex-col gap-2 items-start">
      {relativeTimeSizeIds.map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground w-20">
            {size}
          </span>
          <RelativeTime date={offsetFromNow(-2 * HOUR)} size={size} />
        </div>
      ))}
    </div>
  );
}

export const Sizes: Story = {
  render: (): ReactElement => <SizeMatrix />,
};

function LiveTickingExample(): ReactElement {
  const [origin] = useState<Date>(() => new Date());
  const [, setTick] = useState<number>(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1_000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex flex-col gap-1 items-start">
      <RelativeTime date={origin} weight="medium" color="default" />
      <span className="text-xs text-muted-foreground">
        (Story mounted at {origin.toLocaleTimeString()} — the component
        re-renders on its own schedule.)
      </span>
    </div>
  );
}

export const LiveTicking: Story = {
  render: (): ReactElement => <LiveTickingExample />,
};

function FeedExample(): ReactElement {
  const events = [
    { id: 1, user: "Avery", text: "deployed schema v3", ago: 8 * SECOND },
    { id: 2, user: "Jordan", text: "merged PR #482", ago: 4 * MINUTE },
    { id: 3, user: "Riley", text: "rotated the API key", ago: 47 * MINUTE },
    { id: 4, user: "Morgan", text: "renamed the vault", ago: 5 * HOUR },
    { id: 5, user: "Sam", text: "invited 2 collaborators", ago: 3 * DAY },
  ];
  return (
    <ul className="flex flex-col gap-3 min-w-[20rem]">
      {events.map((e) => (
        <li
          key={e.id}
          className="flex items-baseline justify-between gap-4 rounded-md border border-border bg-card px-3 py-2 text-card-foreground"
        >
          <span className="text-sm">
            <strong className="font-medium">{e.user}</strong> {e.text}
          </span>
          <RelativeTime
            date={offsetFromNow(-e.ago)}
            size="xs"
            color="muted"
          />
        </li>
      ))}
    </ul>
  );
}

export const ActivityFeed: Story = {
  render: (): ReactElement => <FeedExample />,
};
