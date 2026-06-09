import type { Meta, StoryObj } from "@storybook/react";
import { Fragment, type ReactElement } from "react";

import { RelativeTime } from "./relative-time";
import {
  relativeTimeFormatIds,
  relativeTimeSizeIds,
  relativeTimeVariantIds,
} from "./relative-time-variants";

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

function offset(deltaMs: number): Date {
  return new Date(Date.now() + deltaMs);
}

const meta = {
  title: "Components/RelativeTime",
  component: RelativeTime,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Renders a timestamp as a human-readable relative phrase (e.g. \"5 minutes ago\", \"in 3 hours\"). " +
          "Uses `Intl.RelativeTimeFormat` for localization, auto-refreshes at a cadence appropriate to the magnitude of the delta, " +
          "and exposes the absolute timestamp via the `title` attribute (and the underlying `<time dateTime>` for assistive tech).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
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
    weight: {
      options: ["normal", "medium", "semibold"],
      control: { type: "radio" },
    },
    autoUpdate: { control: { type: "boolean" } },
    showTitle: { control: { type: "boolean" } },
    justNowText: { control: { type: "text" } },
    invalidText: { control: { type: "text" } },
    date: { control: false },
    now: { control: false },
  },
  args: {
    date: offset(-5 * MINUTES),
    variant: "muted",
    size: "md",
    weight: "normal",
    format: "long",
    autoUpdate: true,
    showTitle: true,
    justNowText: "just now",
  },
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const JustNow: Story = {
  args: {
    date: offset(-2 * SECONDS),
  },
};

export const MinutesAgo: Story = {
  args: {
    date: offset(-12 * MINUTES),
  },
};

export const HoursAgo: Story = {
  args: {
    date: offset(-3 * HOURS),
  },
};

export const YesterdayLong: Story = {
  name: "Yesterday (long)",
  args: {
    date: offset(-1 * DAYS),
    format: "long",
  },
};

export const YesterdayShort: Story = {
  name: "Yesterday (short)",
  args: {
    date: offset(-1 * DAYS),
    format: "short",
  },
};

export const YesterdayNarrow: Story = {
  name: "Yesterday (narrow)",
  args: {
    date: offset(-1 * DAYS),
    format: "narrow",
  },
};

export const InTheFuture: Story = {
  args: {
    date: offset(45 * MINUTES),
    variant: "brand",
  },
};

export const ExpiresSoon: Story = {
  name: "Expires soon (warning)",
  args: {
    date: offset(90 * SECONDS),
    variant: "warning",
    weight: "medium",
  },
};

export const Expired: Story = {
  name: "Expired (destructive)",
  args: {
    date: offset(-5 * DAYS),
    variant: "destructive",
    weight: "medium",
  },
};

export const FixedReferencePoint: Story = {
  name: "Static (with explicit `now`)",
  args: {
    date: new Date("2026-01-01T12:00:00Z"),
    now: new Date("2026-06-09T12:00:00Z"),
    autoUpdate: false,
  },
};

export const FrenchLocale: Story = {
  name: "Locale: French",
  args: {
    date: offset(-2 * HOURS),
    locale: "fr-FR",
  },
};

export const JapaneseLocale: Story = {
  name: "Locale: Japanese",
  args: {
    date: offset(-2 * HOURS),
    locale: "ja-JP",
  },
};

export const InvalidDate: Story = {
  args: {
    date: "not-a-real-date",
    invalidText: "Unknown",
    variant: "muted",
  },
};

export const AllFormats: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => {
    const samples: { label: string; delta: number }[] = [
      { label: "Just now", delta: -2 * SECONDS },
      { label: "5 min ago", delta: -5 * MINUTES },
      { label: "2 hr ago", delta: -2 * HOURS },
      { label: "Yesterday", delta: -1 * DAYS },
      { label: "Last week", delta: -7 * DAYS },
      { label: "In 30 min", delta: 30 * MINUTES },
      { label: "Tomorrow", delta: 1 * DAYS },
    ];

    return (
      <div className="grid grid-cols-[max-content_repeat(3,_1fr)] items-baseline gap-x-6 gap-y-3 text-sm">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          Sample
        </span>
        {relativeTimeFormatIds.map((format) => (
          <span
            key={format}
            className="text-xs uppercase tracking-wide text-muted-foreground"
          >
            {format}
          </span>
        ))}
        {samples.map(({ label, delta }) => (
          <Fragment key={label}>
            <span className="text-muted-foreground">{label}</span>
            {relativeTimeFormatIds.map((format) => (
              <RelativeTime
                key={`${label}-${format}`}
                date={offset(delta)}
                format={format}
              />
            ))}
          </Fragment>
        ))}
      </div>
    );
  },
};

export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex flex-col gap-3">
      {relativeTimeVariantIds.map((variant) => (
        <div key={variant} className="flex items-baseline gap-4">
          <span className="w-28 text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          <RelativeTime
            date={offset(-7 * MINUTES)}
            variant={variant}
            weight="medium"
          />
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex items-baseline gap-6">
      {relativeTimeSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-start gap-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <RelativeTime date={offset(-30 * MINUTES)} size={size} />
        </div>
      ))}
    </div>
  ),
};

export const InContextRow: Story = {
  name: "In context: list row",
  parameters: { layout: "padded" },
  render: (): ReactElement => {
    const rows: { name: string; delta: number }[] = [
      { name: "prod-db-credentials", delta: -42 * SECONDS },
      { name: "github-deploy-key", delta: -8 * MINUTES },
      { name: "stripe-webhook-secret", delta: -3 * HOURS },
      { name: "legacy-api-token", delta: -9 * DAYS },
      { name: "ci-rotation-token", delta: 2 * HOURS },
    ];
    return (
      <div className="w-[480px] divide-y divide-border rounded-md border border-border bg-card">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex items-baseline justify-between px-4 py-3"
          >
            <span className="font-mono text-sm text-foreground">
              {row.name}
            </span>
            <RelativeTime date={offset(row.delta)} size="sm" />
          </div>
        ))}
      </div>
    );
  },
};
