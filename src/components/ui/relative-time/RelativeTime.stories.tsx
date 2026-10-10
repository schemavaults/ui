import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  RelativeTime,
  relativeTimeVariantIds,
  relativeTimeColorIds,
  relativeTimeSizeIds,
} from "./relative-time";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** A fixed reference time so static stories render identically every run. */
const FIXED_NOW: number = Date.UTC(2026, 9, 10, 12, 0, 0);

const meta = {
  title: "Date & Time/Relative Time",
  component: RelativeTime,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Human-friendly relative timestamp (\"3 minutes ago\", \"in 2 hours\", \"yesterday\") rendered as a semantic `<time>` element. Built on `Intl.RelativeTimeFormat`, so it is localised for free.\n\nWhen `live` (the default) it re-renders exactly when the text would change — once a second for seconds, once a minute for minutes, and so on — instead of polling. Hover or focus shows the absolute date/time in a tooltip. Pass `now` to pin the reference time for tests and snapshots, and `absoluteAfterMs` to fall back to a calendar date for old entries.\n\nShips `text` and `badge` variants, five colour intents themed via `@schemavaults/theme`, and three sizes. The pure `formatRelativeTime()` helper is exported for non-React use. For counting down to a deadline, see [Countdown](?path=/docs/date-time-countdown--docs).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    date: {
      control: { type: "date" },
      description: "The moment to describe. Accepts a Date, ISO string, or epoch-ms number.",
    },
    variant: { options: relativeTimeVariantIds, control: { type: "radio" } },
    color: { options: relativeTimeColorIds, control: { type: "radio" } },
    size: { options: relativeTimeSizeIds, control: { type: "radio" } },
    formatStyle: { options: ["long", "short", "narrow"], control: { type: "radio" } },
    numeric: { options: ["auto", "always"], control: { type: "radio" } },
    live: { control: { type: "boolean" } },
    tooltip: { control: { type: "boolean" } },
    icon: { control: { type: "boolean" } },
    locale: { control: { type: "text" } },
  },
  args: {
    date: Date.now() - 3 * MINUTE_MS,
    variant: "text",
    color: "muted",
    size: "default",
    formatStyle: "long",
    numeric: "auto",
    live: true,
    tooltip: true,
    icon: false,
  },
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Starts a few seconds in the past so you can watch it tick from "now" to seconds. */
export const LiveTicking: Story = {
  args: {
    date: Date.now(),
    nowThresholdMs: 0,
    icon: true,
    label: "Saved",
  },
};

export const Variants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-6">
      {relativeTimeVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">{variant}</span>
          <div className="flex flex-wrap items-center gap-3">
            {relativeTimeColorIds.map((color) => (
              <RelativeTime
                key={color}
                date={FIXED_NOW - 2 * HOUR_MS}
                now={FIXED_NOW}
                variant={variant}
                color={color}
                icon
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      {relativeTimeSizeIds.map((size) => (
        <div key={size} className="flex items-center gap-3">
          <RelativeTime date={FIXED_NOW - 5 * MINUTE_MS} now={FIXED_NOW} size={size} icon />
          <RelativeTime
            date={FIXED_NOW - 5 * MINUTE_MS}
            now={FIXED_NOW}
            size={size}
            variant="badge"
            color="brand"
            icon
          />
        </div>
      ))}
    </div>
  ),
};

const SCALE: { label: string; offset: number }[] = [
  { label: "5 seconds ago", offset: -5 * SECOND_MS },
  { label: "40 seconds ago", offset: -40 * SECOND_MS },
  { label: "12 minutes ago", offset: -12 * MINUTE_MS },
  { label: "5 hours ago", offset: -5 * HOUR_MS },
  { label: "1 day ago", offset: -DAY_MS },
  { label: "10 days ago", offset: -10 * DAY_MS },
  { label: "3 months ago", offset: -95 * DAY_MS },
  { label: "2 years ago", offset: -800 * DAY_MS },
  { label: "in 30 minutes", offset: 30 * MINUTE_MS },
  { label: "in 1 day", offset: DAY_MS },
];

/** Every unit, rendered against a fixed `now` in three `Intl` styles. */
export const UnitScale: Story = {
  render: (): ReactElement => (
    <table className="text-sm">
      <thead>
        <tr className="text-left text-xs text-muted-foreground">
          <th className="pr-6 font-medium">Offset</th>
          <th className="pr-6 font-medium">long</th>
          <th className="pr-6 font-medium">short</th>
          <th className="font-medium">narrow · numeric=always</th>
        </tr>
      </thead>
      <tbody>
        {SCALE.map(({ label, offset }) => (
          <tr key={label}>
            <td className="py-1 pr-6 text-muted-foreground">{label}</td>
            <td className="py-1 pr-6">
              <RelativeTime date={FIXED_NOW + offset} now={FIXED_NOW} color="default" />
            </td>
            <td className="py-1 pr-6">
              <RelativeTime date={FIXED_NOW + offset} now={FIXED_NOW} formatStyle="short" color="default" />
            </td>
            <td className="py-1">
              <RelativeTime
                date={FIXED_NOW + offset}
                now={FIXED_NOW}
                formatStyle="narrow"
                numeric="always"
                color="default"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Locales: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-2 text-sm">
      {["en-US", "fr-FR", "de-DE", "es-ES", "ja-JP"].map((locale) => (
        <div key={locale} className="flex items-center gap-4">
          <span className="w-14 font-mono text-xs text-muted-foreground">{locale}</span>
          <RelativeTime date={FIXED_NOW - DAY_MS} now={FIXED_NOW} locale={locale} color="default" />
          <RelativeTime date={FIXED_NOW + 3 * HOUR_MS} now={FIXED_NOW} locale={locale} color="default" />
        </div>
      ))}
    </div>
  ),
};

/** Entries older than a week fall back to a calendar date via `absoluteAfterMs`. */
export const AbsoluteFallback: Story = {
  render: (): ReactElement => (
    <ul className="flex flex-col gap-2 text-sm">
      {[2 * HOUR_MS, 3 * DAY_MS, 9 * DAY_MS, 120 * DAY_MS].map((age) => (
        <li key={age} className="flex items-center justify-between gap-8">
          <span>Deployment #{Math.round(age / HOUR_MS)}</span>
          <RelativeTime
            date={FIXED_NOW - age}
            now={FIXED_NOW}
            absoluteAfterMs={7 * DAY_MS}
            absoluteFormat={{ dateStyle: "medium", timeZone: "UTC" }}
          />
        </li>
      ))}
    </ul>
  ),
};

export const InvalidDate: Story = {
  args: { date: "not-a-date" },
};

const ACTIVITY: { actor: string; action: string; age: number }[] = [
  { actor: "alex", action: "rotated the production API key", age: 25 * SECOND_MS },
  { actor: "sam", action: "updated the billing schema", age: 14 * MINUTE_MS },
  { actor: "jordan", action: "invited 3 members", age: 6 * HOUR_MS },
  { actor: "ci-bot", action: "deployed v2.4.1", age: 2 * DAY_MS },
];

/** A typical audit-log row: muted relative time on the right, absolute time on hover. */
export const ActivityFeed: StoryObj = {
  render: (): ReactElement => (
    <ul className="w-[28rem] divide-y divide-border rounded-lg border border-border bg-card text-sm">
      {ACTIVITY.map((item) => (
        <li key={item.actor} className="flex items-center justify-between gap-4 px-4 py-3">
          <span>
            <span className="font-medium text-foreground">{item.actor}</span>{" "}
            <span className="text-muted-foreground">{item.action}</span>
          </span>
          <RelativeTime date={Date.now() - item.age} size="sm" />
        </li>
      ))}
    </ul>
  ),
};

export const ShowsAbsoluteTimeOnFocus: Story = {
  args: {
    date: FIXED_NOW - 3 * HOUR_MS,
    now: FIXED_NOW,
    locale: "en-US",
    tooltipFormat: { dateStyle: "long", timeStyle: "short", timeZone: "UTC" },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const time = canvas.getByText("3 hours ago").closest("time");
    await expect(time).not.toBeNull();
    await expect(time).toHaveAttribute(
      "datetime",
      new Date(FIXED_NOW - 3 * HOUR_MS).toISOString(),
    );

    await userEvent.tab();
    await expect(time).toHaveFocus();

    const body = within(canvasElement.ownerDocument.body);
    await waitFor(async () => {
      await expect(
        body.getAllByText("October 10, 2026 at 9:00 AM").length,
      ).toBeGreaterThan(0);
    });
  },
};
