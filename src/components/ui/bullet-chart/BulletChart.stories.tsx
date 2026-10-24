import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import type { ReactElement } from "react";
import {
  BulletChart,
  bulletChartBandToneIds,
  bulletChartPolarityIds,
  bulletChartSizeIds,
  type BulletChartItem,
} from "./bullet-chart";

const meta = {
  title: "Charts & Graphs/BulletChart",
  component: BulletChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Stephen Few's bullet chart: a measure bar, a target tick and qualitative bands (poor / satisfactory / good) in one compact row. Stack rows to compare KPIs against their goals on a dashboard, where a wall of [`Gauge`](?path=/docs/charts-graphs-gauge--docs) dials would take several times the space. Reach for [`Meter`](?path=/docs/charts-graphs-meter--docs) when there is no target to compare against. The measure bar uses the shared `--chart-*` palette from `@schemavaults/theme`; bands are neutral greys (darkest = worst) or `status` tints from the theme's `destructive` / `warning` / positive colours, ordered by `polarity`. Each row is a `role=\"img\"` with a full text description, backed by a visually hidden data table.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { options: bulletChartSizeIds, control: { type: "radio" } },
    bandTone: { options: bulletChartBandToneIds, control: { type: "radio" } },
    polarity: { options: bulletChartPolarityIds, control: { type: "radio" } },
    labelPosition: { options: ["inline", "stacked"], control: { type: "radio" } },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    showAxis: { control: { type: "boolean" } },
    showValues: { control: { type: "boolean" } },
  },
  args: {
    label: "Quarterly KPIs",
    items: [],
    size: "default",
    bandTone: "neutral",
    polarity: "higher-is-better",
    labelPosition: "inline",
    showAxis: true,
    showValues: true,
  },
  decorators: [
    (Story): ReactElement => (
      <div style={{ width: "min(560px, calc(100vw - 2rem))" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BulletChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const KPIS: ReadonlyArray<BulletChartItem> = [
  {
    id: "revenue",
    label: "Revenue",
    description: "USD, thousands",
    value: 270,
    target: 250,
    ranges: [150, 225],
    rangeLabels: ["Poor", "Satisfactory", "Good"],
    max: 300,
  },
  {
    id: "profit",
    label: "Profit",
    description: "%",
    value: 22.5,
    target: 27,
    ranges: [20, 25],
    rangeLabels: ["Poor", "Satisfactory", "Good"],
    max: 30,
  },
  {
    id: "order-size",
    label: "Avg. order size",
    description: "USD",
    value: 320,
    target: 550,
    ranges: [350, 500],
    rangeLabels: ["Poor", "Satisfactory", "Good"],
    max: 600,
  },
  {
    id: "new-customers",
    label: "New customers",
    description: "count",
    value: 1650,
    target: 2100,
    ranges: [1400, 2000],
    rangeLabels: ["Poor", "Satisfactory", "Good"],
    max: 2500,
  },
];

export const Default: Story = {
  args: { items: KPIS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("group", { name: "Quarterly KPIs" }),
    ).toBeInTheDocument();
    const revenue = canvas.getByRole("img", { name: /^Revenue: 270/ });
    await expect(revenue).toHaveAccessibleName(
      "Revenue: 270; target 250; ranges: Poor 0–150, Satisfactory 150–225, Good 225–300; scale 0–300",
    );
    await expect(
      revenue.querySelectorAll('[data-slot="bullet-chart-band"]'),
    ).toHaveLength(3);
    const measure = revenue.querySelector<HTMLElement>(
      '[data-slot="bullet-chart-measure"]',
    );
    await expect(measure?.style.width).toBe("90%");
    const target = revenue.querySelector<HTMLElement>(
      '[data-slot="bullet-chart-target"]',
    );
    await expect(target?.style.left).toContain("83.3");
    // The numbers are also in the hidden table.
    await expect(
      canvas.getByRole("table", { hidden: true }),
    ).toHaveTextContent("Satisfactory: 150–225");
  },
};

export const StatusBands: Story = {
  name: "Status bands",
  args: { items: KPIS, bandTone: "status", color: "primary" },
  parameters: {
    docs: {
      description: {
        story:
          "`bandTone=\"status\"` tints the bands with the theme's destructive, warning and positive colours. Pair it with a neutral measure colour (here `primary`) so the bar doesn't fight the bands.",
      },
    },
  },
};

export const LowerIsBetter: Story = {
  name: "Lower is better (latency SLOs)",
  args: {
    label: "API latency",
    bandTone: "status",
    polarity: "lower-is-better",
    color: "chart-7",
    formatValue: (value: number): string => `${Math.round(value)} ms`,
    items: [
      {
        id: "p50",
        label: "p50",
        value: 84,
        target: 100,
        ranges: [100, 200],
        rangeLabels: ["Good", "Degraded", "Breaching"],
        max: 400,
      },
      {
        id: "p95",
        label: "p95",
        value: 240,
        target: 200,
        ranges: [100, 200],
        rangeLabels: ["Good", "Degraded", "Breaching"],
        max: 400,
      },
      {
        id: "p99",
        label: "p99",
        value: 362,
        target: 300,
        ranges: [200, 300],
        rangeLabels: ["Good", "Degraded", "Breaching"],
        max: 400,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "`polarity=\"lower-is-better\"` flips the band order so the green band sits at the low end of the scale.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const p50 = canvas.getByRole("img", { name: /^p50/ });
    const bands = p50.querySelectorAll('[data-slot="bullet-chart-band"]');
    await expect(bands[0]!.className).toContain("emerald");
    await expect(bands[2]!.className).toContain("destructive");
  },
};

export const SharedScale: Story = {
  name: "Shared scale",
  args: {
    label: "Storage by region (TB)",
    max: 100,
    color: "chart-3",
    items: [
      { id: "us-east", label: "us-east-1", value: 72, target: 80, ranges: [50, 85] },
      { id: "eu-west", label: "eu-west-1", value: 41, target: 60, ranges: [50, 85] },
      { id: "ap-south", label: "ap-south-1", value: 18, target: 30, ranges: [50, 85] },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `max` to put every row on one scale so the bars compare with each other, not just with their own targets.",
      },
    },
  },
};

export const AutoScale: Story = {
  name: "Auto-scaled rows",
  args: {
    label: "Usage this month",
    items: [
      { id: "requests", label: "API requests", value: 8_420_000, target: 10_000_000 },
      { id: "seats", label: "Seats", value: 37, target: 50, ranges: [25, 45] },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Without `max`, each row rounds its largest value, target or range up to a nice number. A row with no `ranges` draws a single muted band.",
      },
    },
  },
};

export const Stacked: Story = {
  name: "Stacked labels",
  args: { items: KPIS.slice(0, 2), labelPosition: "stacked", size: "lg" },
};

export const Sizes: Story = {
  render: (args): ReactElement => (
    <div className="flex flex-col gap-8">
      {bulletChartSizeIds.map(
        (size): ReactElement => (
          <BulletChart
            key={size}
            {...args}
            size={size}
            label={`Size ${size}`}
            items={[{ ...KPIS[0]!, label: `Revenue (${size})` }]}
          />
        ),
      )}
    </div>
  ),
};

export const Colors: Story = {
  name: "Measure colours",
  args: {
    label: "Measure colours",
    items: (
      ["chart-1", "chart-2", "chart-3", "chart-7", "brand", "primary"] as const
    ).map(
      (color): BulletChartItem => ({
        id: color,
        label: color,
        value: 68,
        target: 80,
        ranges: [40, 70],
        max: 100,
        color,
      }),
    ),
    showAxis: false,
  },
};

export const Mobile: Story = {
  args: { items: KPIS },
  globals: { viewport: { value: "mobile1", isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          "Below the `sm` breakpoint the inline label moves above its bar, with the readout at the row's end.",
      },
    },
  },
};

export const Empty: Story = {
  args: { items: [], emptyMessage: "No KPIs configured" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("No KPIs configured")).toBeInTheDocument();
  },
};
