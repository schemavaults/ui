import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";
import { DatabaseBackup, GitCommitHorizontal, KeyRound } from "lucide-react";

import {
  RelativeTime,
  relativeTimeSizeIds,
  relativeTimeVariantIds,
} from "./relative-time";
import { relativeTimeUnitIds } from "./format-relative-time";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/**
 * A fixed reference time, so the gallery stories render the same labels on
 * every run (and in the test runner's snapshots).
 */
const NOW: number = Date.UTC(2026, 9, 31, 15, 30, 0);

function ago(ms: number): number {
  return NOW - ms;
}

const meta = {
  title: "Date & Time/RelativeTime",
  component: RelativeTime,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A semantic `<time>` element that reads \"3 minutes ago\" or \"in 2 days\" and keeps itself current. Instead of ticking every second, it computes exactly when its label will next change and sleeps until then (and catches up when a background tab becomes visible again).\n\nHover or focus it to see the exact date in a tooltip. Built on `Intl.RelativeTimeFormat`, so `locale`, `formatStyle` (`long` / `short` / `narrow`) and `numeric: \"auto\"` (\"yesterday\") all work without extra dependencies.\n\nSet `staleAfter` / `expiredAfter` to colour \"last synced\" / \"last backup\" style timestamps with the theme's `warning` and `destructive` tokens as they age. Three variants (`plain`, `muted`, `pill`) and three sizes.\n\nPass `now` to pin the reference time (snapshots, SSR); live updates stop while it is set. The formatter is exported on its own as `formatRelativeTime()`. For counting *down* to a deadline, see [Countdown](?path=/docs/date-time-countdown--docs).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    date: {
      control: { type: "date" },
      description: "The moment to describe. Accepts a Date, ISO string, or epoch-ms number.",
    },
    now: { control: { type: "date" } },
    variant: { options: relativeTimeVariantIds, control: { type: "radio" } },
    size: { options: relativeTimeSizeIds, control: { type: "radio" } },
    formatStyle: {
      options: ["long", "short", "narrow"],
      control: { type: "radio" },
    },
    numeric: { options: ["always", "auto"], control: { type: "radio" } },
    minUnit: { options: relativeTimeUnitIds, control: { type: "select" } },
    maxUnit: { options: relativeTimeUnitIds, control: { type: "select" } },
    locale: { control: { type: "text" } },
    icon: { control: { type: "boolean" } },
    showTooltip: { control: { type: "boolean" } },
  },
  args: {
    date: ago(3 * MINUTE_MS),
    now: NOW,
    variant: "plain",
    size: "default",
    formatStyle: "long",
    numeric: "always",
    showTooltip: true,
    icon: false,
    locale: "en-US",
  },
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // Pin the tooltip's zone so the assertion holds on any runner's timezone.
  args: { absoluteFormat: { dateStyle: "full", timeStyle: "long", timeZone: "UTC" } },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const time = canvasElement.querySelector("time");
    await expect(time, "renders a <time> element").not.toBeNull();
    await expect(time?.getAttribute("datetime")).toBe(
      new Date(ago(3 * MINUTE_MS)).toISOString(),
    );
    await expect(canvas.getByText("3 minutes ago")).toBeVisible();

    await step("Focus shows the absolute date in a tooltip", async () => {
      await userEvent.tab();
      const tooltip = await waitFor(() =>
        within(document.body).findByRole("tooltip"),
      );
      await expect(tooltip.textContent ?? "").toMatch(/Saturday, October 31, 2026/);
    });
  },
};

const SCALE: { label: string; offset: number }[] = [
  { label: "10 seconds", offset: -10 * SECOND_MS },
  { label: "50 seconds", offset: -50 * SECOND_MS },
  { label: "5 minutes", offset: -5 * MINUTE_MS },
  { label: "3 hours", offset: -3 * HOUR_MS },
  { label: "1 day", offset: -26 * HOUR_MS },
  { label: "2 weeks", offset: -15 * DAY_MS },
  { label: "4 months", offset: -125 * DAY_MS },
  { label: "2 years", offset: -800 * DAY_MS },
  { label: "+2 hours", offset: 2 * HOUR_MS + 5 * MINUTE_MS },
  { label: "+3 days", offset: 3 * DAY_MS + HOUR_MS },
];

export const UnitScale: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The largest fitting unit is picked automatically and the count is floored, so \"1 hour ago\" covers 60–119 minutes. Anything within 45 s either side of now reads `just now` (tune with `justNowThresholdMs`).",
      },
    },
  },
  render: (args): ReactElement => (
    <table className="text-sm">
      <thead>
        <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
          <th className="pb-2 pr-8 font-medium">Offset</th>
          <th className="pb-2 pr-8 font-medium">long</th>
          <th className="pb-2 pr-8 font-medium">short</th>
          <th className="pb-2 font-medium">narrow</th>
        </tr>
      </thead>
      <tbody>
        {SCALE.map((row) => (
          <tr key={row.label} className="border-t border-border">
            <td className="py-1.5 pr-8 text-muted-foreground">{row.label}</td>
            {(["long", "short", "narrow"] as const).map((style) => (
              <td key={style} className="py-1.5 pr-8">
                <RelativeTime {...args} date={NOW + row.offset} formatStyle={style} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Variants: Story = {
  render: (args): ReactElement => (
    <div className="flex flex-col gap-6">
      {relativeTimeVariantIds.map((variant) => (
        <div key={variant} className="flex items-center gap-6">
          <span className="w-14 text-xs font-medium text-muted-foreground">
            {variant}
          </span>
          {relativeTimeSizeIds.map((size) => (
            <RelativeTime
              key={size}
              {...args}
              variant={variant}
              size={size}
              icon
              date={ago(12 * MINUTE_MS)}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Freshness: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`staleAfter` and `expiredAfter` (milliseconds of age) colour the timestamp with the theme's `warning` and `destructive` tokens. Here: stale after 1 day, expired after 7 days. The current state is also exposed as `data-freshness` for custom styling.",
      },
    },
  },
  render: (args): ReactElement => (
    <div className="flex flex-col gap-4">
      {[
        { name: "prod-primary", age: 40 * MINUTE_MS },
        { name: "prod-replica", age: 30 * HOUR_MS },
        { name: "staging", age: 9 * DAY_MS },
      ].map((row) => (
        <div
          key={row.name}
          className="flex w-96 items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <DatabaseBackup className="size-4 text-muted-foreground" />
            {row.name}
          </span>
          <RelativeTime
            {...args}
            variant="pill"
            size="sm"
            date={ago(row.age)}
            staleAfter={DAY_MS}
            expiredAfter={7 * DAY_MS}
            prefix="Backed up"
          />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const states = Array.from(canvasElement.querySelectorAll("time")).map(
      (el) => el.getAttribute("data-freshness"),
    );
    await expect(states).toEqual(["fresh", "stale", "expired"]);
  },
};

export const ActivityFeed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A typical feed. `numeric=\"auto\"` lets Intl say \"yesterday\" and \"last week\".",
      },
    },
  },
  args: { variant: "muted", size: "sm", numeric: "auto" },
  render: (args): ReactElement => (
    <ul className="w-96 divide-y divide-border rounded-lg border border-border bg-card">
      {[
        { icon: GitCommitHorizontal, text: "Schema users.v4 published", age: 20 * SECOND_MS },
        { icon: KeyRound, text: "API key svlts_…9f2a rotated", age: 7 * MINUTE_MS },
        { icon: DatabaseBackup, text: "Vault snapshot completed", age: 5 * HOUR_MS },
        { icon: GitCommitHorizontal, text: "Schema orders.v2 deprecated", age: 30 * HOUR_MS },
        { icon: KeyRound, text: "Member invited to the team", age: 9 * DAY_MS },
      ].map((item) => (
        <li key={item.text} className="flex items-center gap-3 px-4 py-3">
          <item.icon className="size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-sm">{item.text}</span>
          <RelativeTime {...args} date={ago(item.age)} />
        </li>
      ))}
    </ul>
  ),
};

export const Locales: Story = {
  render: (args): ReactElement => (
    <div className="grid grid-cols-[auto_auto_auto] gap-x-8 gap-y-2 text-sm">
      {["en-US", "fr-FR", "de-DE", "ja-JP", "es-ES"].map((locale) => (
        <div key={locale} className="contents">
          <span className="font-mono text-xs text-muted-foreground">{locale}</span>
          <RelativeTime {...args} locale={locale} date={ago(2 * HOUR_MS)} />
          <RelativeTime {...args} locale={locale} numeric="auto" date={NOW + 26 * HOUR_MS} />
        </div>
      ))}
    </div>
  ),
};

function LiveDemo(): ReactElement {
  // Captured once on mount, so the label genuinely ages while you watch.
  const [mountedAt] = useState<number>(() => Date.now() - 40 * SECOND_MS);
  return (
    <div className="flex flex-col items-center gap-2">
      <RelativeTime date={mountedAt} variant="pill" icon prefix="Opened" size="lg" />
      <span className="text-xs text-muted-foreground">
        Rolls over from &quot;just now&quot; within a few seconds, then once a
        minute.
      </span>
    </div>
  );
}

export const Live: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Without `now`, the component updates itself. It schedules a single timeout for the moment the label will next change, rather than polling.",
      },
    },
  },
  render: (): ReactElement => <LiveDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("just now")).toBeVisible();
    await waitFor(
      () => expect(canvas.getByText("45 seconds ago")).toBeVisible(),
      { timeout: 8000 },
    );
  },
};
