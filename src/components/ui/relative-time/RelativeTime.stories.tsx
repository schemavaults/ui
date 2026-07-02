import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import {
  RelativeTime,
  relativeTimeSizeIds,
  relativeTimeVariantIds,
} from "./relative-time";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** A pinned "now" so stories render deterministically in review + Chromatic. */
const FROZEN_NOW = new Date("2026-07-02T14:30:00Z");

function offset(ms: number): Date {
  return new Date(FROZEN_NOW.getTime() + ms);
}

const meta = {
  title: "Components/RelativeTime",
  component: RelativeTime,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays an absolute date as a human-readable relative string (\"3 minutes ago\", \"in 2 hours\", \"yesterday\"). Renders as a semantic `<time>` element with a full ISO `dateTime` attribute for accessibility and screen-reader support, and exposes the absolute date in the `title` attribute for hover-review.\n\n" +
          "Under the hood it uses `Intl.RelativeTimeFormat` for i18n-aware phrasing and self-updates on a smart interval that adapts to how far off the date is: every 5s while within a minute, 30s within an hour, 5m within a day, 30m within a month, then no updates for anything larger. Ships four visual variants (`default`, `muted`, `subtle`, `emphasis`) and three sizes themed through `@schemavaults/theme`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    date: {
      control: { type: "date" },
      description: "The absolute date/time to display. Accepts a Date, ISO string, or epoch-ms number.",
    },
    variant: {
      options: relativeTimeVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: relativeTimeSizeIds,
      control: { type: "radio" },
    },
    numeric: {
      options: ["auto", "always"],
      control: { type: "radio" },
    },
    formatStyle: {
      options: ["long", "short", "narrow"],
      control: { type: "radio" },
    },
    capitalize: { control: { type: "boolean" } },
    showTitle: { control: { type: "boolean" } },
    justNowText: { control: { type: "text" } },
    justNowThreshold: { control: { type: "number" } },
    locale: { control: { type: "text" } },
    now: { control: false },
    updateInterval: { control: false },
    absoluteFormatOptions: { control: false },
    children: { control: false },
  },
  args: {
    date: offset(-3 * MINUTE_MS),
    now: FROZEN_NOW,
    variant: "default",
    size: "md",
    numeric: "auto",
    formatStyle: "long",
    capitalize: false,
    showTitle: true,
    justNowText: "just now",
    justNowThreshold: 15 * SECOND_MS,
  },
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PastAndFuture: Story = {
  name: "Past and future",
  render: (): ReactElement => (
    <div className="grid grid-cols-[max-content_1fr] items-baseline gap-x-6 gap-y-2 text-sm">
      <span className="text-muted-foreground">a moment ago</span>
      <RelativeTime date={offset(-5 * SECOND_MS)} now={FROZEN_NOW} />
      <span className="text-muted-foreground">3 minutes ago</span>
      <RelativeTime date={offset(-3 * MINUTE_MS)} now={FROZEN_NOW} />
      <span className="text-muted-foreground">2 hours ago</span>
      <RelativeTime date={offset(-2 * HOUR_MS)} now={FROZEN_NOW} />
      <span className="text-muted-foreground">yesterday</span>
      <RelativeTime date={offset(-1 * DAY_MS)} now={FROZEN_NOW} />
      <span className="text-muted-foreground">last week</span>
      <RelativeTime date={offset(-7 * DAY_MS)} now={FROZEN_NOW} />
      <span className="text-muted-foreground">last quarter</span>
      <RelativeTime date={offset(-95 * DAY_MS)} now={FROZEN_NOW} />
      <span className="text-muted-foreground">last year</span>
      <RelativeTime date={offset(-400 * DAY_MS)} now={FROZEN_NOW} />
      <span className="text-muted-foreground">in 45 seconds</span>
      <RelativeTime date={offset(45 * SECOND_MS)} now={FROZEN_NOW} />
      <span className="text-muted-foreground">in 2 hours</span>
      <RelativeTime date={offset(2 * HOUR_MS)} now={FROZEN_NOW} />
      <span className="text-muted-foreground">tomorrow</span>
      <RelativeTime date={offset(1 * DAY_MS)} now={FROZEN_NOW} />
      <span className="text-muted-foreground">next month</span>
      <RelativeTime date={offset(35 * DAY_MS)} now={FROZEN_NOW} />
    </div>
  ),
};

export const Variants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      {relativeTimeVariantIds.map((v) => (
        <div key={v} className="flex items-baseline gap-4">
          <span className="w-20 text-xs font-medium text-muted-foreground">
            {v}
          </span>
          <RelativeTime
            date={offset(-42 * MINUTE_MS)}
            now={FROZEN_NOW}
            variant={v}
          />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      {relativeTimeSizeIds.map((s) => (
        <div key={s} className="flex items-baseline gap-4">
          <span className="w-20 text-xs font-medium text-muted-foreground">
            {s}
          </span>
          <RelativeTime
            date={offset(-2 * HOUR_MS)}
            now={FROZEN_NOW}
            size={s}
          />
        </div>
      ))}
    </div>
  ),
};

export const NumericStyles: Story = {
  name: "numeric: auto vs always",
  render: (): ReactElement => (
    <div className="grid grid-cols-[max-content_1fr_1fr] items-baseline gap-x-6 gap-y-2 text-sm">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        delta
      </span>
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        auto
      </span>
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        always
      </span>

      <span className="text-muted-foreground">−1 day</span>
      <RelativeTime date={offset(-1 * DAY_MS)} now={FROZEN_NOW} numeric="auto" />
      <RelativeTime date={offset(-1 * DAY_MS)} now={FROZEN_NOW} numeric="always" />

      <span className="text-muted-foreground">+1 day</span>
      <RelativeTime date={offset(1 * DAY_MS)} now={FROZEN_NOW} numeric="auto" />
      <RelativeTime date={offset(1 * DAY_MS)} now={FROZEN_NOW} numeric="always" />
    </div>
  ),
};

export const FormatStyles: Story = {
  name: "formatStyle: long / short / narrow",
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-2 text-sm">
      <RelativeTime
        date={offset(-3 * HOUR_MS)}
        now={FROZEN_NOW}
        formatStyle="long"
      />
      <RelativeTime
        date={offset(-3 * HOUR_MS)}
        now={FROZEN_NOW}
        formatStyle="short"
      />
      <RelativeTime
        date={offset(-3 * HOUR_MS)}
        now={FROZEN_NOW}
        formatStyle="narrow"
      />
    </div>
  ),
};

export const JustNow: Story = {
  name: "\"just now\" threshold",
  args: {
    date: offset(-5 * SECOND_MS),
  },
};

export const Capitalized: Story = {
  args: {
    date: offset(-1 * DAY_MS),
    capitalize: true,
    variant: "emphasis",
  },
};

export const CustomRender: Story = {
  name: "Custom render (icon + text)",
  render: (): ReactElement => (
    <RelativeTime date={offset(-8 * MINUTE_MS)} now={FROZEN_NOW} variant="muted">
      {(formatted): ReactElement => (
        <span className="inline-flex items-center gap-1.5">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="size-3.5"
          >
            <circle
              cx="8"
              cy="8"
              r="6.25"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 4.5V8L10.5 9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Updated {formatted}
        </span>
      )}
    </RelativeTime>
  ),
};

export const Locales: Story = {
  render: (): ReactElement => (
    <div className="grid grid-cols-[max-content_1fr] items-baseline gap-x-6 gap-y-2 text-sm">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        en
      </span>
      <RelativeTime date={offset(-2 * HOUR_MS)} now={FROZEN_NOW} locale="en" />
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        de
      </span>
      <RelativeTime date={offset(-2 * HOUR_MS)} now={FROZEN_NOW} locale="de" />
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        es
      </span>
      <RelativeTime date={offset(-2 * HOUR_MS)} now={FROZEN_NOW} locale="es" />
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        ja
      </span>
      <RelativeTime date={offset(-2 * HOUR_MS)} now={FROZEN_NOW} locale="ja" />
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        fr
      </span>
      <RelativeTime date={offset(-2 * HOUR_MS)} now={FROZEN_NOW} locale="fr" />
    </div>
  ),
};

export const InlineWithText: Story = {
  name: "Inline within prose",
  render: (): ReactElement => (
    <p className="max-w-md text-sm text-foreground">
      This vault was last synced{" "}
      <RelativeTime
        date={offset(-12 * MINUTE_MS)}
        now={FROZEN_NOW}
        variant="emphasis"
      />{" "}
      by <span className="font-medium">alex.w</span>. The next scheduled refresh runs{" "}
      <RelativeTime
        date={offset(48 * MINUTE_MS)}
        now={FROZEN_NOW}
        variant="emphasis"
      />
      .
    </p>
  ),
};

export const LiveTicking: Story = {
  name: "Live-ticking against real \"now\"",
  parameters: {
    docs: {
      description: {
        story:
          "Omits the `now` prop so the component ticks against the real `Date.now()`, using `updateInterval: \"auto\"`. Refreshes every 5 seconds while within a minute of the target, then slows down as the delta grows.",
      },
    },
  },
  args: {
    now: undefined,
    date: new Date(Date.now() - 30 * SECOND_MS),
  },
};
