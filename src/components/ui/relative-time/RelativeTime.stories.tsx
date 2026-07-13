import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Badge } from "../badge";
import { Card, CardContent, CardHeader, CardTitle } from "../card";

import {
  RelativeTime,
  relativeTimeVariantIds,
  relativeTimeSizeIds,
  relativeTimeColorIds,
  relativeTimeModeIds,
} from "./relative-time";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/**
 * Storybook stories are snapshotted at build time by `@storybook/test-runner`,
 * so we frame every example with a **frozen** `now` prop. The component still
 * auto-refreshes when `now` is omitted — the "Live" story below exercises that.
 */
const NOW = new Date("2026-07-13T14:32:00Z").getTime();
function ago(ms: number): number {
  return NOW - ms;
}
function ahead(ms: number): number {
  return NOW + ms;
}

const meta = {
  title: "Components/RelativeTime",
  component: RelativeTime,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Renders a timestamp as a human-readable phrase — `\"5 minutes ago\"`, `\"just now\"`, `\"in 3 days\"` — and refreshes itself on an adaptive interval (1s while inside the minute, 15m once you're days out, and everything in between). Wraps a semantic `<time dateTime=…>` element with the ISO timestamp so screen readers and RSS-style consumers still see the underlying value; the full absolute date is available in the browser tooltip.\n\nUses `Intl.RelativeTimeFormat` (locale-aware, plural-aware) with an English fallback. Themed with `@schemavaults/theme` tokens — the three variants (`plain`, `muted`, `chip`) and five colour intents (`default`, `brand`, `success`, `warning`, `destructive`) all track light/dark automatically. `mode=\"auto\"` (default) shows relative up to a week out, then flips to an absolute date; force one or the other with `mode`.\n\nPass a `now` prop to freeze the reference point for tests, SSR snapshots, or story-runner smoke tests.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    date: {
      control: { type: "date" },
      description: "The moment to display. Accepts a Date, ISO string, or epoch-ms number.",
    },
    variant: { options: relativeTimeVariantIds, control: { type: "radio" } },
    size: { options: relativeTimeSizeIds, control: { type: "radio" } },
    color: { options: relativeTimeColorIds, control: { type: "select" } },
    mode: { options: relativeTimeModeIds, control: { type: "radio" } },
    numeric: {
      options: ["auto", "always"] as const,
      control: { type: "inline-radio" },
    },
    prefix: { control: { type: "text" } },
    suffix: { control: { type: "text" } },
    showTitle: { control: { type: "boolean" } },
  },
  args: {
    date: ago(5 * MINUTE_MS),
    now: NOW,
    variant: "muted",
    size: "default",
    color: "default",
    mode: "auto",
    numeric: "auto",
    showTitle: true,
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

export const Variants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-3">
        <span className="w-16 text-xs font-medium text-muted-foreground">plain</span>
        <RelativeTime date={ago(3 * HOUR_MS)} now={NOW} variant="plain" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-16 text-xs font-medium text-muted-foreground">muted</span>
        <RelativeTime date={ago(3 * HOUR_MS)} now={NOW} variant="muted" />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-16 text-xs font-medium text-muted-foreground">chip</span>
        <RelativeTime date={ago(3 * HOUR_MS)} now={NOW} variant="chip" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      <RelativeTime date={ago(2 * HOUR_MS)} now={NOW} size="sm" />
      <RelativeTime date={ago(2 * HOUR_MS)} now={NOW} size="default" />
      <RelativeTime date={ago(2 * HOUR_MS)} now={NOW} size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      <RelativeTime date={ago(2 * HOUR_MS)} now={NOW} color="default" />
      <RelativeTime date={ago(2 * HOUR_MS)} now={NOW} color="brand" />
      <RelativeTime date={ago(2 * HOUR_MS)} now={NOW} color="success" />
      <RelativeTime date={ago(2 * HOUR_MS)} now={NOW} color="warning" />
      <RelativeTime date={ago(2 * HOUR_MS)} now={NOW} color="destructive" />
    </div>
  ),
};

export const AcrossTheScale: Story = {
  render: (): ReactElement => (
    <div className="w-80">
      <table className="w-full border-separate border-spacing-y-2 text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th>Offset</th>
            <th>Rendered</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: "-2s", date: ago(2 * SECOND_MS) },
            { label: "-45s", date: ago(45 * SECOND_MS) },
            { label: "-3m", date: ago(3 * MINUTE_MS) },
            { label: "-1h", date: ago(HOUR_MS) },
            { label: "-6h", date: ago(6 * HOUR_MS) },
            { label: "-1d", date: ago(DAY_MS) },
            { label: "-3d", date: ago(3 * DAY_MS) },
            { label: "-2w", date: ago(14 * DAY_MS) },
            { label: "-3mo", date: ago(90 * DAY_MS) },
            { label: "-2y", date: ago(730 * DAY_MS) },
            { label: "+2m", date: ahead(2 * MINUTE_MS) },
            { label: "+1d", date: ahead(DAY_MS) },
          ].map((row) => (
            <tr key={row.label}>
              <td className="pr-4 font-mono text-xs text-muted-foreground">
                {row.label}
              </td>
              <td>
                <RelativeTime date={row.date} now={NOW} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const Future: Story = {
  args: {
    date: ahead(2 * DAY_MS + 4 * HOUR_MS),
    color: "brand",
  },
};

export const ForceAbsolute: Story = {
  args: {
    mode: "absolute",
    date: ago(15 * MINUTE_MS),
  },
};

export const ForceRelativeFarPast: Story = {
  name: "Force Relative (far past)",
  args: {
    mode: "relative",
    date: ago(300 * DAY_MS),
  },
};

export const AutoFlipsToAbsolute: Story = {
  args: {
    mode: "auto",
    date: ago(60 * DAY_MS),
  },
  parameters: {
    docs: {
      description: {
        story:
          "`mode=\"auto\"` (default) renders relative up to `autoAbsoluteThresholdMs` (default 7 days) and flips to an absolute date beyond that. Hover to see the full timestamp.",
      },
    },
  },
};

export const NumericAlways: Story = {
  args: {
    numeric: "always",
    date: ago(DAY_MS),
  },
  parameters: {
    docs: {
      description: {
        story:
          "With `numeric=\"always\"`, the formatter renders `\"1 day ago\"` instead of the locale's colloquial phrasing (e.g. `\"yesterday\"`).",
      },
    },
  },
};

export const WithPrefix: Story = {
  args: {
    prefix: "Updated",
    date: ago(12 * MINUTE_MS),
  },
};

export const InAContextRow: Story = {
  render: (): ReactElement => (
    <div className="w-96 rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src="" alt="Ada Lovelace" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Ada Lovelace</span>
            <span className="text-xs text-muted-foreground">
              Pushed a new deploy to <span className="font-mono">production</span>
            </span>
          </div>
        </div>
        <RelativeTime date={ago(11 * MINUTE_MS)} now={NOW} variant="chip" size="sm" />
      </div>
    </div>
  ),
};

export const ActivityFeed: Story = {
  render: (): ReactElement => (
    <Card className="w-[28rem]">
      <CardHeader>
        <CardTitle className="text-base">Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          {
            actor: "vault-worker-01",
            action: "Rotated encryption keys",
            when: ago(45 * SECOND_MS),
            tone: "success" as const,
          },
          {
            actor: "ada@schemavaults.com",
            action: "Approved schema migration #482",
            when: ago(6 * MINUTE_MS),
            tone: "default" as const,
          },
          {
            actor: "gh-actions",
            action: "Failed to deploy staging",
            when: ago(50 * MINUTE_MS),
            tone: "destructive" as const,
          },
          {
            actor: "billing-cron",
            action: "Sent monthly invoice batch",
            when: ago(2 * DAY_MS + 3 * HOUR_MS),
            tone: "default" as const,
          },
          {
            actor: "vault-bootstrap",
            action: "Cluster initialized",
            when: ago(45 * DAY_MS),
            tone: "default" as const,
          },
        ].map((row, i) => (
          <div key={i} className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">{row.action}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {row.actor}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {row.tone !== "default" ? (
                <Badge
                  variant={row.tone === "destructive" ? "destructive" : "secondary"}
                >
                  {row.tone === "success" ? "ok" : "error"}
                </Badge>
              ) : null}
              <RelativeTime
                date={row.when}
                now={NOW}
                size="sm"
                color={row.tone === "destructive" ? "destructive" : "default"}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  ),
};

export const LiveTicking: Story = {
  name: "Live (auto-refreshing)",
  args: {
    // Anchor slightly in the past so the label crosses "just now" → seconds
    // → minutes while you watch.
    date: new Date(Date.now() - 25 * SECOND_MS),
    now: undefined,
    variant: "chip",
    color: "brand",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Omit the `now` prop to let the component drive its own clock. The label starts inside the `justNow` window and rolls forward on the adaptive tick interval.",
      },
    },
  },
};
