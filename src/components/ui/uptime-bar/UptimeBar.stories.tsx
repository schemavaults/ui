import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import type { ReactElement } from "react";
import {
  UptimeBar,
  uptimeBarShapeIds,
  uptimeBarSizeIds,
  type UptimeBarPeriod,
  type UptimeBarStatusId,
} from "./uptime-bar";

const meta = {
  title: "Charts & Graphs/UptimeBar",
  component: UptimeBar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A status-page style history bar: one tick per period (usually a day), coloured by that period's status — operational, degraded, outage, scheduled maintenance, or no data. Hovering or focusing a tick shows a tooltip with the date, status, uptime and any incident notes. The header shows the overall uptime, averaged over every period that has data. Use it on service health pages, API dashboards, and vault replication monitors. Where [`SegmentedBar`](?path=/docs/charts-graphs-segmentedbar--docs) shows how a whole splits into parts, `UptimeBar` shows how something changed over time.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { options: uptimeBarSizeIds, control: { type: "radio" } },
    shape: { options: uptimeBarShapeIds, control: { type: "radio" } },
    showUptime: { control: { type: "boolean" } },
    showFooter: { control: { type: "boolean" } },
    showLegend: { control: { type: "boolean" } },
    uptimeDecimals: { control: { type: "number", min: 0, max: 4 } },
  },
  args: {
    label: "API uptime, last 90 days",
    size: "default",
    shape: "rounded",
    showUptime: true,
    showFooter: true,
    showLegend: false,
    uptimeDecimals: 2,
  },
  decorators: [
    (Story): ReactElement => (
      <div style={{ width: "560px", maxWidth: "calc(100vw - 32px)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UptimeBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fixed "today" so stories (and visual snapshots) are stable. */
const END_DATE: Date = new Date(2026, 9, 3);

function buildPeriods(
  days: number,
  overrides: Record<number, Partial<UptimeBarPeriod>> = {},
): UptimeBarPeriod[] {
  return Array.from({ length: days }, (_, i) => {
    const date: Date = new Date(END_DATE);
    date.setDate(END_DATE.getDate() - (days - 1 - i));
    const daysAgo: number = days - 1 - i;
    return {
      date,
      status: "operational" as UptimeBarStatusId,
      ...overrides[daysAgo],
    };
  });
}

/** Keys are "days ago" (0 = today). */
const INCIDENTS: Record<number, Partial<UptimeBarPeriod>> = {
  71: {
    status: "degraded",
    uptime: 99.4,
    description: "Elevated latency on schema validation endpoints.",
  },
  52: {
    status: "maintenance",
    description: "Planned database upgrade (02:00–02:45 UTC).",
  },
  33: {
    status: "outage",
    uptime: 96.8,
    description: "Vault sync unavailable for 46 minutes in us-east-1.",
  },
  32: {
    status: "degraded",
    uptime: 99.7,
    description: "Residual replication lag after yesterday's outage.",
  },
  9: { status: "degraded", uptime: 99.9, description: "Intermittent 502s." },
};

const SAMPLE_PERIODS: UptimeBarPeriod[] = buildPeriods(90, INCIDENTS);

export const Default: Story = {
  args: {
    periods: SAMPLE_PERIODS,
    headerLabel: "Schema Registry API",
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const ticks = canvas.getAllByRole("button");
    await expect(ticks).toHaveLength(90);
    await expect(canvas.getByText(/% uptime$/)).toBeInTheDocument();

    const outage = ticks.find((t) => t.dataset.status === "outage");
    await expect(outage).toBeDefined();
    await userEvent.hover(outage!);
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(async () => {
      await expect(
        (await body.findAllByText(/Vault sync unavailable/)).length,
      ).toBeGreaterThan(0);
    });
    await userEvent.unhover(outage!);
  },
};

export const WithLegend: Story = {
  args: {
    periods: SAMPLE_PERIODS,
    headerLabel: "Schema Registry API",
    showLegend: true,
  },
};

export const AllOperational: Story = {
  args: {
    periods: buildPeriods(90),
    headerLabel: "Authentication",
  },
};

export const MonitoringRecentlyStarted: Story = {
  name: "Monitoring recently started (no data)",
  args: {
    periods: buildPeriods(
      60,
      Object.fromEntries(
        Array.from({ length: 40 }, (_, i) => [
          59 - i,
          { status: "no-data" as UptimeBarStatusId },
        ]),
      ),
    ),
    headerLabel: "Edge cache (beta)",
    startLabel: "60 days ago",
    showLegend: true,
  },
};

export const Sizes: Story = {
  args: { periods: SAMPLE_PERIODS },
  render: (args): ReactElement => (
    <div className="flex flex-col gap-6">
      {uptimeBarSizeIds.map((size) => (
        <UptimeBar
          key={size}
          {...args}
          size={size}
          headerLabel={`size="${size}"`}
          label={`Uptime, size ${size}`}
        />
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  args: { periods: buildPeriods(45, INCIDENTS), startLabel: "45 days ago" },
  render: (args): ReactElement => (
    <div className="flex flex-col gap-6">
      {uptimeBarShapeIds.map((shape) => (
        <UptimeBar
          key={shape}
          {...args}
          shape={shape}
          headerLabel={`shape="${shape}"`}
          label={`Uptime, shape ${shape}`}
        />
      ))}
    </div>
  ),
};

export const StatusPage: Story = {
  name: "Status page (multiple services)",
  args: { periods: SAMPLE_PERIODS },
  render: (args): ReactElement => (
    <div className="flex flex-col divide-y rounded-lg border bg-card p-4 text-card-foreground">
      <UptimeBar
        {...args}
        className="pb-4"
        headerLabel="Schema Registry API"
        label="Schema Registry API uptime"
      />
      <UptimeBar
        {...args}
        className="py-4"
        periods={buildPeriods(90, { 12: { status: "maintenance" } })}
        headerLabel="Dashboard"
        label="Dashboard uptime"
      />
      <UptimeBar
        {...args}
        className="pt-4"
        periods={buildPeriods(90, {
          4: { status: "outage", uptime: 91.2, description: "Webhook queue stalled." },
          3: { status: "degraded", uptime: 98.5 },
        })}
        headerLabel="Webhooks"
        label="Webhooks uptime"
        showLegend
      />
    </div>
  ),
};

export const CustomLabelsAndFormatting: Story = {
  args: {
    periods: buildPeriods(30, INCIDENTS),
    headerLabel: "Vault replication",
    startLabel: "30 days ago",
    endLabel: "Now",
    uptimeDecimals: 3,
    statusLabels: { operational: "All systems go", outage: "Major outage" },
    formatDate: (d: Date): string => d.toISOString().slice(0, 10),
  },
};

export const ClickablePeriods: Story = {
  args: {
    periods: buildPeriods(30, INCIDENTS),
    headerLabel: "Click a day to open its incident report",
    startLabel: "30 days ago",
    onPeriodClick: fn(),
  },
  play: async ({ args, canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const ticks = canvas.getAllByRole("button");
    await userEvent.click(ticks[ticks.length - 1]!);
    await expect(args.onPeriodClick).toHaveBeenCalledTimes(1);

    ticks[0]!.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onPeriodClick).toHaveBeenCalledTimes(2);
  },
};
