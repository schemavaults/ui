import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import type { ReactElement } from "react";
import { LazyFramerMotionProvider } from "@/providers/lazy_framer";
import { chartColorIds } from "@/components/ui/chart-primitives/chart-colors";
import {
  BulletChart,
  bulletChartLabelPositionIds,
  bulletChartSizeIds,
  type BulletChartRange,
} from "./bullet-chart";

const meta = {
  title: "Charts & Graphs/BulletChart",
  component: BulletChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A bullet chart: one measure (the bar) against a target (the vertical marker), drawn over neutral qualitative bands such as poor / satisfactory / good. It packs what a [`Gauge`](?path=/docs/charts-graphs-gauge--docs) shows into a single line, so a stack of them reads as a KPI table. Use it when a value only means something relative to a goal — revenue vs. plan, p95 latency vs. an SLO, storage vs. a quota. Set `higherIsBetter={false}` for metrics where lower wins; the darkest band then sits at the high end and `colorByTarget` treats staying *under* the target as success. Compare [`Meter`](?path=/docs/charts-graphs-meter--docs) (a scalar with thresholds, no target) and [`ProgressBar`](?path=/docs/charts-graphs-progressbar--docs) (progress toward completion).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { options: bulletChartSizeIds, control: { type: "radio" } },
    labelPosition: {
      options: bulletChartLabelPositionIds,
      control: { type: "radio" },
    },
    color: { options: chartColorIds, control: { type: "select" } },
    value: { control: { type: "number" } },
    target: { control: { type: "number" } },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    higherIsBetter: { control: { type: "boolean" } },
    colorByTarget: { control: { type: "boolean" } },
    showLabel: { control: { type: "boolean" } },
    showValue: { control: { type: "boolean" } },
    showDelta: { control: { type: "boolean" } },
    showTicks: { control: { type: "boolean" } },
    animate: { control: { type: "boolean" } },
    unit: { control: { type: "text" } },
  },
  args: {
    label: "Revenue",
    value: 270,
    target: 250,
    size: "default",
    labelPosition: "top",
    higherIsBetter: true,
    colorByTarget: false,
    showLabel: true,
    showValue: true,
    showDelta: false,
    showTicks: false,
    animate: true,
  },
  decorators: [
    (Story): ReactElement => (
      <LazyFramerMotionProvider>
        <div style={{ width: "min(520px, calc(100vw - 32px))" }}>
          <Story />
        </div>
      </LazyFramerMotionProvider>
    ),
  ],
} satisfies Meta<typeof BulletChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const REVENUE_RANGES: BulletChartRange[] = [
  { to: 150, label: "Poor" },
  { to: 225, label: "Satisfactory" },
  { to: 300, label: "Good" },
];

function formatThousands(n: number): string {
  return `$${n}k`;
}

export const Default: Story = {
  args: {
    description: "Q3, USD thousands",
    ranges: REVENUE_RANGES,
    formatValue: formatThousands,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const meter = canvas.getByRole("meter", { name: "Revenue" });
    await expect(meter).toHaveAttribute("aria-valuenow", "270");
    await expect(meter).toHaveAttribute("aria-valuemax", "300");
    await expect(meter).toHaveAttribute(
      "aria-valuetext",
      "$270k, target $250k, target met, Good",
    );
    await expect(
      canvasElement.querySelectorAll('[data-slot="bullet-chart-band"]'),
    ).toHaveLength(3);
    // 250 on a 0–300 scale sits five sixths of the way along.
    await expect(
      canvasElement
        .querySelector('[data-slot="bullet-chart-target"]')!
        .getAttribute("style"),
    ).toContain("83.333");
  },
};

export const WithTicksAndDelta: Story = {
  args: {
    description: "Q3, USD thousands",
    ranges: REVENUE_RANGES,
    formatValue: formatThousands,
    showTicks: true,
    showDelta: true,
    colorByTarget: true,
  },
  play: async ({ canvasElement }) => {
    const ticks = canvasElement.querySelector(
      '[data-slot="bullet-chart-ticks"]',
    );
    await expect(ticks).not.toBeNull();
    await expect(ticks!.textContent).toContain("$0k");
    await expect(ticks!.textContent).toContain("$300k");
    await expect(
      canvasElement.querySelector('[data-slot="bullet-chart-delta"]'),
    ).toHaveTextContent("+8%");
    await expect(
      canvasElement.querySelector('[data-slot="bullet-chart-bar"]'),
    ).toHaveAttribute("data-color", "positive");
  },
};

/** Latency: lower wins, so the dark band is at the top end and exceeding the SLO is a miss. */
export const LowerIsBetter: Story = {
  args: {
    label: "p95 latency",
    description: "SLO 300 ms",
    value: 340,
    target: 300,
    max: 500,
    unit: " ms",
    higherIsBetter: false,
    colorByTarget: true,
    showDelta: true,
    showTicks: true,
    ranges: [
      { to: 200, label: "Fast" },
      { to: 350, label: "Acceptable" },
      { to: 500, label: "Slow" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const meter = canvas.getByRole("meter", { name: "p95 latency" });
    await expect(meter).toHaveAttribute(
      "aria-valuetext",
      "340 ms, target 300 ms, target missed, Acceptable",
    );
    await expect(
      canvasElement.querySelector('[data-slot="bullet-chart-bar"]'),
    ).toHaveAttribute("data-color", "destructive");
    const bands = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="bullet-chart-band"]',
    );
    // The bad end ("Slow") gets the darkest shade.
    await expect(bands[2]!.className).toContain("bg-foreground/[0.16]");
    await expect(bands[0]!.className).toContain("bg-foreground/[0.06]");
  },
};

export const Sizes: Story = {
  render: (args): ReactElement => (
    <div className="flex flex-col gap-6">
      {bulletChartSizeIds.map((size) => (
        <BulletChart
          key={size}
          {...args}
          size={size}
          label={`Size: ${size}`}
          ranges={REVENUE_RANGES}
          formatValue={formatThousands}
        />
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args): ReactElement => (
    <div className="flex flex-col gap-4">
      {(
        ["default", "brand", "chart-3", "chart-7", "warning", "muted"] as const
      ).map((color) => (
        <BulletChart
          key={color}
          {...args}
          color={color}
          label={color}
          size="sm"
          ranges={REVENUE_RANGES}
          formatValue={formatThousands}
        />
      ))}
    </div>
  ),
};

interface KpiRow {
  label: string;
  description: string;
  value: number;
  target: number;
  max?: number;
  unit?: string;
  higherIsBetter?: boolean;
  ranges: BulletChartRange[];
}

const KPI_ROWS: KpiRow[] = [
  {
    label: "Revenue",
    description: "USD thousands",
    value: 270,
    target: 250,
    ranges: REVENUE_RANGES,
  },
  {
    label: "Active vaults",
    description: "count",
    value: 1840,
    target: 2200,
    max: 2500,
    ranges: [{ to: 1500 }, { to: 2000 }, { to: 2500 }],
  },
  {
    label: "Uptime",
    description: "30 days",
    value: 99.95,
    target: 99.9,
    unit: "%",
    max: 100,
    ranges: [{ to: 99 }, { to: 99.5 }, { to: 100 }],
  },
  {
    label: "Error rate",
    description: "5xx / requests",
    value: 0.4,
    target: 0.5,
    unit: "%",
    max: 2,
    higherIsBetter: false,
    ranges: [{ to: 0.5 }, { to: 1 }, { to: 2 }],
  },
];

/**
 * `labelPosition="left"` gives every chart the same label column, so a stack
 * of them lines up into a scannable KPI table.
 */
export const KpiTable: Story = {
  args: { labelPosition: "left" },
  render: (args): ReactElement => (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
      {KPI_ROWS.map((row) => (
        <BulletChart
          key={row.label}
          {...args}
          label={row.label}
          description={row.description}
          value={row.value}
          target={row.target}
          max={row.max}
          min={row.label === "Uptime" ? 98 : 0}
          unit={row.unit}
          higherIsBetter={row.higherIsBetter ?? true}
          ranges={row.ranges}
          colorByTarget
          showDelta
          size="sm"
          labelClassName="w-28"
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("meter")).toHaveLength(4);
    const errorRate = canvas.getByRole("meter", { name: "Error rate" });
    await expect(errorRate).toHaveAttribute(
      "aria-valuetext",
      "0.4%, target 0.5%, target met",
    );
    const uptime = canvas.getByRole("meter", { name: "Uptime" });
    await expect(uptime).toHaveAttribute("aria-valuemin", "98");
  },
};

/** The default scale rounds up past the largest of value, target and ranges. */
export const AutoScale: Story = {
  args: { label: "Storage", value: 37, target: 42, unit: " GB", showTicks: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("meter")).toHaveAttribute(
      "aria-valuemax",
      "50",
    );
  },
};

export const ReducedMotion: Story = {
  args: { ranges: REVENUE_RANGES, formatValue: formatThousands },
  parameters: { emulateReducedMotion: true },
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector<HTMLElement>(
      '[data-slot="bullet-chart-bar"]',
    );
    // 270 / 300 = 90%, painted immediately with no grow-in animation.
    await expect(bar!.style.width).toBe("90%");
  },
};

export const PhoneWidth: Story = {
  args: {
    description: "Q3, USD thousands",
    ranges: REVENUE_RANGES,
    formatValue: formatThousands,
    showTicks: true,
    showDelta: true,
  },
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    await expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(
      doc.documentElement.clientWidth,
    );
  },
};
