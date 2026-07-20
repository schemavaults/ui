import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState, type ReactElement } from "react";

import {
  RelativeTime,
  relativeTimeVariantIds,
  relativeTimeSizeIds,
  relativeTimeWeightIds,
  relativeTimeFormatIds,
} from "./relative-time";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** Returns an epoch-ms timestamp `ms` milliseconds in the past. */
function ago(ms: number): number {
  return Date.now() - ms;
}

/** Returns an epoch-ms timestamp `ms` milliseconds in the future. */
function fromNow(ms: number): number {
  return Date.now() + ms;
}

const meta = {
  title: "Components/RelativeTime",
  component: RelativeTime,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Renders a live-updating relative timestamp — `\"3 minutes ago\"`, `\"in 2 hours\"`, `\"just now\"` — for use in feeds, comment threads, activity logs, notifications, and tables. Complements `Countdown` (which counts down to a specific target) by covering the general \"how long ago / how long until\" case.\n\nUses the browser-native `Intl.RelativeTimeFormat` (no external date library needed), locale-aware, and picks the largest sensible unit (year → month → week → day → hour → minute → second). Renders as a semantic `<time>` element with a machine-readable `dateTime` attribute and a native title-attribute tooltip showing the absolute date/time.\n\nBy default the value refreshes at an interval that scales with the timestamp's age (every second under a minute, every 30 seconds under an hour, every 5 minutes under a day, hourly beyond that) — pass `updateInterval={false}` to freeze it or a fixed number of ms to override.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    date: {
      control: { type: "date" },
      description:
        "Timestamp to render. Accepts a Date, ISO string, or epoch-ms number.",
    },
    variant: {
      options: relativeTimeVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: relativeTimeSizeIds,
      control: { type: "radio" },
    },
    weight: {
      options: relativeTimeWeightIds,
      control: { type: "radio" },
    },
    format: {
      options: relativeTimeFormatIds,
      control: { type: "radio" },
    },
    numeric: {
      options: ["auto", "always"],
      control: { type: "radio" },
    },
    tabular: { control: { type: "boolean" } },
    capitalize: { control: { type: "boolean" } },
    hideAbsoluteTooltip: { control: { type: "boolean" } },
    justNowThreshold: { control: { type: "number" } },
    prefix: { control: { type: "text" } },
    suffix: { control: { type: "text" } },
  },
  args: {
    date: ago(5 * MINUTE_MS),
    variant: "muted",
    size: "default",
    weight: "normal",
    format: "long",
    numeric: "auto",
    tabular: false,
    capitalize: false,
    hideAbsoluteTooltip: false,
  },
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const JustNow: Story = {
  args: {
    date: ago(4 * SECOND_MS),
  },
};

export const InTheFuture: Story = {
  args: {
    date: fromNow(3 * HOUR_MS),
  },
};

const PastScale: readonly { label: string; date: number }[] = [
  { label: "just now", date: ago(3 * SECOND_MS) },
  { label: "seconds ago", date: ago(45 * SECOND_MS) },
  { label: "minutes ago", date: ago(6 * MINUTE_MS) },
  { label: "hours ago", date: ago(3 * HOUR_MS) },
  { label: "yesterday", date: ago(28 * HOUR_MS) },
  { label: "days ago", date: ago(3 * DAY_MS) },
  { label: "last week", date: ago(9 * DAY_MS) },
  { label: "months ago", date: ago(65 * DAY_MS) },
  { label: "years ago", date: ago(400 * DAY_MS) },
] as const;

export const PastRange: Story = {
  render: (): ReactElement => (
    <div className="grid grid-cols-[max-content_auto] items-baseline gap-x-6 gap-y-2 font-sans">
      {PastScale.map((row) => (
        <PastScaleRow key={row.label} label={row.label} date={row.date} />
      ))}
    </div>
  ),
};

function PastScaleRow({
  label,
  date,
}: {
  label: string;
  date: number;
}): ReactElement {
  return (
    <>
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <RelativeTime date={date} />
    </>
  );
}

const FutureScale: readonly { label: string; date: number }[] = [
  { label: "in seconds", date: fromNow(45 * SECOND_MS) },
  { label: "in minutes", date: fromNow(12 * MINUTE_MS) },
  { label: "in hours", date: fromNow(4 * HOUR_MS) },
  { label: "tomorrow", date: fromNow(28 * HOUR_MS) },
  { label: "in days", date: fromNow(5 * DAY_MS) },
  { label: "next week", date: fromNow(10 * DAY_MS) },
  { label: "in months", date: fromNow(90 * DAY_MS) },
] as const;

export const FutureRange: Story = {
  render: (): ReactElement => (
    <div className="grid grid-cols-[max-content_auto] items-baseline gap-x-6 gap-y-2 font-sans">
      {FutureScale.map((row) => (
        <PastScaleRow key={row.label} label={row.label} date={row.date} />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-2 font-sans">
      {relativeTimeVariantIds.map((variant) => (
        <div key={variant} className="flex items-baseline gap-3">
          <span className="w-24 text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          <RelativeTime date={ago(7 * MINUTE_MS)} variant={variant} />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-3 font-sans">
      {relativeTimeSizeIds.map((size) => (
        <div key={size} className="flex items-baseline gap-3">
          <span className="w-16 text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <RelativeTime date={ago(42 * MINUTE_MS)} size={size} />
        </div>
      ))}
    </div>
  ),
};

export const FormatStyles: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-3 font-sans">
      {relativeTimeFormatIds.map((format) => (
        <div key={format} className="flex items-baseline gap-3">
          <span className="w-16 text-xs uppercase tracking-wide text-muted-foreground">
            {format}
          </span>
          <RelativeTime date={ago(3 * HOUR_MS)} format={format} />
        </div>
      ))}
    </div>
  ),
};

export const NumericAlways: Story = {
  args: {
    numeric: "always",
    date: ago(28 * HOUR_MS),
  },
  parameters: {
    docs: {
      description: {
        story:
          "With `numeric: \"always\"` the component renders exact quantities (`\"1 day ago\"`) instead of using words like `\"yesterday\"`. Handy when you want stability in tables.",
      },
    },
  },
};

export const WithPrefix: Story = {
  args: {
    prefix: "Updated",
    date: ago(11 * MINUTE_MS),
  },
};

export const CapitalizedAndBold: Story = {
  args: {
    capitalize: true,
    weight: "semibold",
    variant: "default",
    date: ago(2 * SECOND_MS),
  },
};

export const StaticSnapshot: Story = {
  args: {
    updateInterval: false,
    date: ago(35 * SECOND_MS),
  },
  parameters: {
    docs: {
      description: {
        story:
          "`updateInterval={false}` freezes the value at mount. Useful for print views, PDFs, and rendered emails where a re-render loop would be wasteful or wrong.",
      },
    },
  },
};

export const ActivityFeed: Story = {
  render: (): ReactElement => (
    <ol className="flex w-72 flex-col gap-3 rounded-md border border-border bg-card p-4 font-sans">
      <FeedItem
        who="Alice Chen"
        what="opened pull request #1204"
        date={ago(12 * SECOND_MS)}
      />
      <FeedItem
        who="Marcus Reid"
        what="approved 3 comments"
        date={ago(4 * MINUTE_MS)}
      />
      <FeedItem
        who="Priya Nair"
        what="merged main into feat/schema-v2"
        date={ago(38 * MINUTE_MS)}
      />
      <FeedItem
        who="deploy-bot"
        what="rolled out v0.86.2 to production"
        date={ago(4 * HOUR_MS)}
      />
      <FeedItem
        who="Diego Rossi"
        what="closed issue #841"
        date={ago(26 * HOUR_MS)}
      />
    </ol>
  ),
  parameters: {
    docs: {
      description: {
        story: "A realistic feed usage — one `RelativeTime` per row.",
      },
    },
  },
};

function FeedItem({
  who,
  what,
  date,
}: {
  who: string;
  what: string;
  date: number;
}): ReactElement {
  return (
    <li className="flex flex-col text-sm">
      <span className="text-foreground">
        <span className="font-medium">{who}</span> {what}
      </span>
      <RelativeTime date={date} size="sm" />
    </li>
  );
}

/**
 * A story that advances a synthetic timestamp forward so reviewers can watch
 * the live tick without waiting a real minute. Every 1s the story bumps the
 * displayed timestamp 10 s further into the past.
 */
export const LiveTicking: Story = {
  render: (): ReactElement => <LiveTickingDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the auto-refresh: this story fast-forwards a synthetic timestamp by 10 seconds each second so you can watch the value tick over from `just now` → seconds → minutes without waiting in real time.",
      },
    },
  },
};

function LiveTickingDemo(): ReactElement {
  const [offset, setOffset] = useState<number>(0);
  useEffect(() => {
    const id = setInterval(() => {
      setOffset((prev) => prev + 10 * SECOND_MS);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex flex-col items-start gap-2 font-sans">
      <RelativeTime
        date={ago(offset)}
        variant="accent"
        weight="medium"
        tabular
      />
      <span className="text-xs text-muted-foreground">
        Advancing +10s / second
      </span>
    </div>
  );
}
