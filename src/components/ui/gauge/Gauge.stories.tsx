import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { LazyFramerMotionProvider } from "@/providers/lazy_framer";

import {
  Gauge,
  gaugeSizeIds,
  gaugeColorIds,
  type GaugeZone,
} from "./gauge";

const meta = {
  title: "Components/Gauge",
  component: Gauge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Semi-circular meter (a.k.a. half-gauge / radial dial) for dashboard tiles, SLO views, and resource-usage panels. Distinct from [`CircularProgress`](?path=/docs/components-circularprogress--docs) (full ring, percentage-only) and [`ProgressBar`](?path=/docs/components-progressbar--docs) (linear). Supports an optional needle, color zones (good / warning / danger bands), and automatic color selection based on which zone the current value falls into.\n\n**See also:** [CircularProgress](?path=/docs/components-circularprogress--docs), [ProgressBar](?path=/docs/components-progressbar--docs).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    size: {
      options: gaugeSizeIds,
      control: { type: "radio" },
    },
    color: {
      options: gaugeColorIds,
      control: { type: "radio" },
    },
    showValue: { control: { type: "boolean" } },
    showRange: { control: { type: "boolean" } },
    showNeedle: { control: { type: "boolean" } },
    autoColorFromZones: { control: { type: "boolean" } },
    strokeWidth: { control: { type: "number" } },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    unit: { control: { type: "text" } },
  },
  args: {
    value: 60,
    label: "Gauge",
    min: 0,
    max: 100,
    showValue: true,
    showRange: false,
    showNeedle: true,
  },
  decorators: [
    (Story): ReactElement => {
      return (
        <LazyFramerMotionProvider>
          <Story />
        </LazyFramerMotionProvider>
      );
    },
  ],
} satisfies Meta<typeof Gauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 62,
    label: "CPU usage",
    unit: "%",
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    label: "Idle",
    unit: "%",
  },
};

export const Full: Story = {
  args: {
    value: 100,
    label: "Disk usage",
    unit: "%",
    color: "destructive",
  },
};

export const Positive: Story = {
  args: {
    value: 92,
    label: "Uptime",
    unit: "%",
    color: "positive",
  },
};

export const Warning: Story = {
  args: {
    value: 74,
    label: "Memory usage",
    unit: "%",
    color: "warning",
  },
};

export const Destructive: Story = {
  args: {
    value: 95,
    label: "Error rate",
    unit: "%",
    color: "destructive",
  },
};

export const WithoutNeedle: Story = {
  args: {
    value: 50,
    label: "Storage usage",
    unit: "%",
    showNeedle: false,
  },
};

export const WithRangeLabels: Story = {
  args: {
    value: 42,
    label: "Server load",
    unit: "%",
    showRange: true,
  },
};

export const CustomRange: Story = {
  args: {
    value: 320,
    label: "Latency",
    min: 0,
    max: 1000,
    unit: "ms",
    showRange: true,
  },
};

const HEALTH_ZONES: ReadonlyArray<GaugeZone> = [
  { from: 0, to: 60, color: "positive" },
  { from: 60, to: 85, color: "warning" },
  { from: 85, to: 100, color: "destructive" },
];

export const WithZones: Story = {
  args: {
    value: 55,
    label: "System health",
    unit: "%",
    zones: HEALTH_ZONES,
    showRange: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Color zones drawn behind the indicator track to communicate acceptable / warning / danger ranges. The indicator itself still uses the `color` prop.",
      },
    },
  },
};

export const AutoColorFromZones: Story = {
  args: {
    value: 78,
    label: "Risk score",
    unit: "%",
    zones: HEALTH_ZONES,
    autoColorFromZones: true,
    showRange: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `autoColorFromZones` is enabled, the indicator + needle color is automatically chosen from whichever zone contains the current value. Move the slider to watch it switch.",
      },
    },
  },
};

export const CustomContent: Story = {
  args: {
    value: 87,
    label: "Conversion",
    showValue: false,
    color: "positive",
  },
  render: (args): ReactElement => (
    <Gauge {...args}>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-3xl font-bold tabular-nums text-foreground">
          87%
        </span>
        <span className="text-xs text-muted-foreground">↑ 4.2 pts vs. last week</span>
      </div>
    </Gauge>
  ),
};

export const AllColors: Story = {
  args: {
    value: 70,
    label: "Sample",
    unit: "%",
  },
  render: (args): ReactElement => (
    <div className="flex flex-wrap items-end gap-6">
      {gaugeColorIds.map((c) => (
        <Gauge key={c} {...args} color={c} label={`${c} gauge`} />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  args: {
    value: 65,
    label: "Sample",
    unit: "%",
  },
  render: (args): ReactElement => (
    <div className="flex flex-wrap items-end gap-6">
      {gaugeSizeIds.map((s) => (
        <Gauge key={s} {...args} size={s} label={`${s} gauge`} />
      ))}
    </div>
  ),
};

export const Dashboard: Story = {
  args: {
    value: 0,
    label: "Dashboard",
  },
  parameters: {
    docs: {
      description: {
        story:
          "An example dashboard composition mixing several gauges with zone-based auto-coloring.",
      },
    },
  },
  render: (): ReactElement => (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
      <Gauge
        size="sm"
        value={28}
        label="CPU"
        unit="%"
        zones={HEALTH_ZONES}
        autoColorFromZones
        showRange
      />
      <Gauge
        size="sm"
        value={71}
        label="Memory"
        unit="%"
        zones={HEALTH_ZONES}
        autoColorFromZones
        showRange
      />
      <Gauge
        size="sm"
        value={94}
        label="Disk"
        unit="%"
        zones={HEALTH_ZONES}
        autoColorFromZones
        showRange
      />
    </div>
  ),
};
