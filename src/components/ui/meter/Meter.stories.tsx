import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { LazyFramerMotionProvider } from "@/providers/lazy_framer";

import {
  Meter,
  MeterField,
  meterAppearanceIds,
  meterColorIds,
  meterSizeIds,
} from "./meter";

const meta = {
  title: "Components/Meter",
  component: Meter,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Semantic meter for showing a measurement within a known range — disk usage, quota consumption, allocation, health, signal strength, and so on. Mirrors the HTML `<meter>` element's `low` / `high` / `optimum` threshold semantics for automatic color selection.\n\n**When to reach for `Meter` vs. its neighbours:**\n\n- **`Meter`** — a *measurement* within a fixed range. The value has meaning at any point; higher is not necessarily better. Emits `role=\"meter\"` for assistive tech.\n- [`ProgressBar`](?path=/docs/components-progressbar--docs) — *progress toward completion* of a task. Values only move forward.\n- [`Gauge`](?path=/docs/components-gauge--docs) — the same idea as `Meter` but drawn as a semicircular dial with a needle.\n\n`appearance=\"segmented\"` renders discrete blocks (battery / signal-strength style) instead of a continuous fill.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    low: { control: { type: "number" } },
    high: { control: { type: "number" } },
    optimum: { control: { type: "number" } },
    size: {
      options: meterSizeIds,
      control: { type: "radio" },
    },
    appearance: {
      options: meterAppearanceIds,
      control: { type: "radio" },
    },
    color: {
      options: meterColorIds,
      control: { type: "radio" },
    },
    autoColorFromThresholds: { control: { type: "boolean" } },
    segments: { control: { type: "number", min: 3, max: 20 } },
  },
  args: {
    value: 50,
    label: "Meter",
    min: 0,
    max: 100,
    appearance: "continuous",
    size: "md",
    segments: 10,
  },
  decorators: [
    (Story): ReactElement => (
      <LazyFramerMotionProvider>
        <div style={{ minWidth: 320, maxWidth: 520 }}>
          <Story />
        </div>
      </LazyFramerMotionProvider>
    ),
  ],
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 62,
    label: "Storage used",
  },
};

export const Sizes: Story = {
  render: (args): ReactElement => (
    <div className="flex flex-col gap-4">
      <Meter {...args} size="sm" label="Small meter" />
      <Meter {...args} size="md" label="Medium meter" />
      <Meter {...args} size="lg" label="Large meter" />
    </div>
  ),
  args: { value: 55 },
};

export const Colors: Story = {
  render: (args): ReactElement => (
    <div className="flex flex-col gap-4">
      {meterColorIds.map((color) => (
        <div key={color} className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {color}
          </span>
          <Meter {...args} color={color} label={`${color} meter`} />
        </div>
      ))}
    </div>
  ),
  args: { value: 65 },
};

/**
 * Automatic threshold-based coloring — mirrors the HTML `<meter>` element.
 *
 * The optimum sits in the middle band (30–70). Values inside that band
 * render `positive`; values outside render `warning`.
 */
export const AutoColorFromThresholds: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-6">
      <MeterField
        value={20}
        label="Low value"
        low={30}
        high={70}
        optimum={50}
        unit="%"
      />
      <MeterField
        value={55}
        label="Optimum value"
        low={30}
        high={70}
        optimum={50}
        unit="%"
      />
      <MeterField
        value={85}
        label="High value"
        low={30}
        high={70}
        optimum={50}
        unit="%"
      />
    </div>
  ),
};

/**
 * "Higher is worse" case (e.g. error rate) — optimum sits at 0, so
 * increasing values step through positive → warning → destructive.
 */
export const HigherIsWorse: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-6">
      <MeterField
        value={5}
        label="Error rate"
        min={0}
        max={100}
        low={20}
        high={60}
        optimum={0}
        unit="%"
      />
      <MeterField
        value={40}
        label="Error rate"
        min={0}
        max={100}
        low={20}
        high={60}
        optimum={0}
        unit="%"
      />
      <MeterField
        value={80}
        label="Error rate"
        min={0}
        max={100}
        low={20}
        high={60}
        optimum={0}
        unit="%"
      />
    </div>
  ),
};

/**
 * "Higher is better" case (e.g. uptime, cache hit rate) — optimum sits at
 * the top of the range.
 */
export const HigherIsBetter: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-6">
      <MeterField
        value={40}
        label="Uptime"
        min={0}
        max={100}
        low={90}
        high={99}
        optimum={100}
        unit="%"
      />
      <MeterField
        value={92}
        label="Uptime"
        min={0}
        max={100}
        low={90}
        high={99}
        optimum={100}
        unit="%"
      />
      <MeterField
        value={99.9}
        label="Uptime"
        min={0}
        max={100}
        low={90}
        high={99}
        optimum={100}
        unit="%"
      />
    </div>
  ),
};

export const Segmented: Story = {
  args: {
    value: 65,
    label: "Battery",
    appearance: "segmented",
    segments: 10,
  },
};

export const SegmentedSignalStrength: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-4">
      <MeterField
        value={20}
        label="Signal"
        appearance="segmented"
        segments={5}
        low={30}
        high={70}
        optimum={100}
      />
      <MeterField
        value={60}
        label="Signal"
        appearance="segmented"
        segments={5}
        low={30}
        high={70}
        optimum={100}
      />
      <MeterField
        value={95}
        label="Signal"
        appearance="segmented"
        segments={5}
        low={30}
        high={70}
        optimum={100}
      />
    </div>
  ),
};

/**
 * A common dashboard tile layout — label on the left, value on the right,
 * min/max ticks beneath the bar.
 */
export const StorageTile: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-4 shadow-sm">
      <MeterField
        value={128}
        label="Storage used"
        min={0}
        max={500}
        low={200}
        high={400}
        optimum={0}
        unit="GB"
        showRange
      />
      <MeterField
        value={340}
        label="Memory"
        min={0}
        max={512}
        low={256}
        high={450}
        optimum={0}
        unit="MB"
        showRange
      />
      <MeterField
        value={78}
        label="CPU"
        min={0}
        max={100}
        low={40}
        high={80}
        optimum={0}
        unit="%"
        showRange
      />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    value: 0,
    label: "Empty meter",
  },
};

export const Full: Story = {
  args: {
    value: 100,
    label: "Full meter",
  },
};

export const OutOfRange: Story = {
  args: {
    value: 150,
    label: "Out-of-range value is clamped",
    min: 0,
    max: 100,
  },
};

export const CustomRange: Story = {
  args: {
    value: 42,
    label: "Custom range",
    min: -20,
    max: 100,
    low: 0,
    high: 60,
    optimum: 40,
  },
};
