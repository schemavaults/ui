import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import {
  RelativeTime,
  relativeTimeFormatIds,
  relativeTimeSizeIds,
  relativeTimeVariantIds,
} from "./relative-time";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

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
          "Displays a timestamp as a human-readable relative phrase like `5 minutes ago` or `in 3 days`, auto-refreshing at the appropriate cadence (every second for sub-minute values, every minute for sub-hour, and so on).\n\n" +
          "Built on top of [`Intl.RelativeTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat), so it supports any browser-recognised BCP-47 locale and three format widths (`long`, `short`, `narrow`). Renders as a semantic `<time>` element with a machine-readable `dateTime` attribute and an optional `title` showing the absolute date.\n\n" +
          "Six theme-driven color variants (`default`, `muted`, `brand`, `success`, `warning`, `destructive`) pull from `@schemavaults/theme` so the component automatically respects light/dark mode and SchemaVaults brand colours.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    date: {
      control: { type: "date" },
      description: "Reference timestamp. Accepts a Date, ISO string, or epoch-ms number.",
    },
    variant: {
      options: relativeTimeVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: relativeTimeSizeIds,
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
    locale: { control: { type: "text" } },
    prefix: { control: { type: "text" } },
    suffix: { control: { type: "text" } },
    showTitle: { control: { type: "boolean" } },
  },
  args: {
    date: fromNow(-5 * MINUTE_MS),
    variant: "default",
    size: "default",
    format: "long",
    numeric: "auto",
    showTitle: true,
  },
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const JustNow: Story = {
  args: {
    date: fromNow(-2 * SECOND_MS),
  },
};

export const FutureDate: Story = {
  args: {
    date: fromNow(3 * DAY_MS),
    prefix: "Renews ",
  },
};

export const Variants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      {relativeTimeVariantIds.map((variant) => (
        <div key={variant} className="flex items-baseline gap-3">
          <span className="w-24 text-xs font-medium text-muted-foreground">
            {variant}
          </span>
          <RelativeTime date={fromNow(-12 * MINUTE_MS)} variant={variant} />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      {relativeTimeSizeIds.map((size) => (
        <div key={size} className="flex items-baseline gap-3">
          <span className="w-16 text-xs font-medium text-muted-foreground">
            {size}
          </span>
          <RelativeTime date={fromNow(-2 * HOUR_MS)} size={size} />
        </div>
      ))}
    </div>
  ),
};

export const Formats: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      {relativeTimeFormatIds.map((format) => (
        <div key={format} className="flex items-baseline gap-3">
          <span className="w-20 text-xs font-medium text-muted-foreground">
            {format}
          </span>
          <RelativeTime date={fromNow(-45 * MINUTE_MS)} format={format} />
        </div>
      ))}
    </div>
  ),
};

export const TimeScale: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Shows how the component selects the most natural unit for the magnitude of the difference — seconds, minutes, hours, days, weeks, months, years.",
      },
    },
  },
  render: (): ReactElement => {
    const samples: { label: string; date: number }[] = [
      { label: "2 seconds ago", date: fromNow(-2 * SECOND_MS) },
      { label: "3 minutes ago", date: fromNow(-3 * MINUTE_MS) },
      { label: "1 hour ago", date: fromNow(-HOUR_MS) },
      { label: "Yesterday", date: fromNow(-DAY_MS) },
      { label: "5 days ago", date: fromNow(-5 * DAY_MS) },
      { label: "3 weeks ago", date: fromNow(-3 * WEEK_MS) },
      { label: "4 months ago", date: fromNow(-4 * MONTH_MS) },
      { label: "2 years ago", date: fromNow(-2 * YEAR_MS) },
      { label: "In 30 seconds", date: fromNow(30 * SECOND_MS) },
      { label: "In 2 hours", date: fromNow(2 * HOUR_MS) },
      { label: "In 4 days", date: fromNow(4 * DAY_MS) },
    ];
    return (
      <div className="flex flex-col items-start gap-2 font-mono">
        {samples.map((sample) => (
          <div key={sample.label} className="flex items-baseline gap-4">
            <span className="w-36 text-xs text-muted-foreground">
              {sample.label}
            </span>
            <RelativeTime date={sample.date} variant="muted" />
          </div>
        ))}
      </div>
    );
  },
};

export const Locales: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Locale defaults to the runtime locale but can be overridden via `locale` (any BCP-47 tag accepted by `Intl.RelativeTimeFormat`).",
      },
    },
  },
  render: (): ReactElement => {
    const locales: { tag: string; label: string }[] = [
      { tag: "en-US", label: "English (US)" },
      { tag: "en-GB", label: "English (UK)" },
      { tag: "fr-FR", label: "French" },
      { tag: "de-DE", label: "German" },
      { tag: "es-ES", label: "Spanish" },
      { tag: "ja-JP", label: "Japanese" },
      { tag: "zh-CN", label: "Chinese (Simplified)" },
      { tag: "ar-EG", label: "Arabic" },
    ];
    return (
      <div className="flex flex-col items-start gap-2">
        {locales.map((entry) => (
          <div key={entry.tag} className="flex items-baseline gap-4">
            <span className="w-44 text-xs text-muted-foreground">
              {entry.label} ({entry.tag})
            </span>
            <RelativeTime date={fromNow(-3 * HOUR_MS)} locale={entry.tag} />
          </div>
        ))}
      </div>
    );
  },
};

export const NumericAlways: Story = {
  args: {
    date: fromNow(-DAY_MS),
    numeric: "always",
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `numeric` is `always`, output is strictly numeric (`1 day ago`) rather than using natural phrasing like `yesterday`.",
      },
    },
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    date: fromNow(-12 * MINUTE_MS),
    prefix: "Last synced ",
    suffix: " — auto-updates",
    variant: "muted",
    size: "sm",
  },
};

export const AbsoluteFallback: Story = {
  args: {
    date: fromNow(-90 * DAY_MS),
    thresholdMs: 30 * DAY_MS,
    variant: "muted",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Past a configurable `thresholdMs`, the component falls back to an absolute localized date instead of e.g. `3 months ago`. Useful for audit logs where exact dates matter for older entries.",
      },
    },
  },
};

export const ActivityFeed: Story = {
  parameters: {
    docs: {
      description: {
        story: "Realistic use case in a feed of recent activity.",
      },
    },
  },
  render: (): ReactElement => {
    const activity: { actor: string; action: string; date: number }[] = [
      {
        actor: "ada.lovelace",
        action: "deployed v0.71.1 to production",
        date: fromNow(-12 * SECOND_MS),
      },
      {
        actor: "grace.hopper",
        action: "opened a pull request",
        date: fromNow(-7 * MINUTE_MS),
      },
      {
        actor: "alan.turing",
        action: "rotated the API signing key",
        date: fromNow(-2 * HOUR_MS),
      },
      {
        actor: "barbara.liskov",
        action: "archived the legacy dashboard",
        date: fromNow(-3 * DAY_MS),
      },
      {
        actor: "edsger.dijkstra",
        action: "wrote the original ADR",
        date: fromNow(-8 * MONTH_MS),
      },
    ];
    return (
      <ul className="flex w-[420px] flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground">
        {activity.map((entry) => (
          <li
            key={entry.actor}
            className="flex items-baseline justify-between gap-4 border-b last:border-0 pb-2 last:pb-0"
          >
            <span className="text-sm">
              <span className="font-medium">{entry.actor}</span>{" "}
              <span className="text-muted-foreground">{entry.action}</span>
            </span>
            <RelativeTime
              date={entry.date}
              variant="muted"
              size="xs"
              format="short"
            />
          </li>
        ))}
      </ul>
    );
  },
};
