import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { LazyFramerMotionProvider } from "@/providers/lazy_framer";
import { Meter, meterSizeIds, meterColorIds } from "./meter";

const meta = {
  title: "Components/Meter",
  component: Meter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A scalar meter that displays a value within a known range, following the semantics of the HTML `<meter>` element. Configure `low`, `high`, and `optimum` thresholds to define which sub-range is preferable; enable `autoColorFromThresholds` to have the fill automatically switch between the `positive`, `warning`, and `destructive` theme colors as the value crosses those thresholds. Use for capacity indicators (storage / RAM / quota), health scores, or ratings — reserve [`ProgressBar`](?path=/docs/components-progressbar--docs) for progress toward completion and [`Gauge`](?path=/docs/components-gauge--docs) for arc-style dial displays.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    size: {
      options: meterSizeIds,
      control: { type: "radio" },
    },
    color: {
      options: meterColorIds,
      control: { type: "radio" },
    },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    low: { control: { type: "number" } },
    high: { control: { type: "number" } },
    optimum: { control: { type: "number" } },
    autoColorFromThresholds: { control: { type: "boolean" } },
    showLabel: { control: { type: "boolean" } },
    showValue: { control: { type: "boolean" } },
    showThresholdMarks: { control: { type: "boolean" } },
    unit: { control: { type: "text" } },
  },
  args: {
    value: 50,
    label: "Meter",
    min: 0,
    max: 100,
  },
  decorators: [
    (Story): ReactElement => {
      return (
        <LazyFramerMotionProvider>
          <div style={{ width: "360px" }}>
            <Story />
          </div>
        </LazyFramerMotionProvider>
      );
    },
  ],
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 62,
    label: "Meter value",
    unit: "%",
  },
};

export const Small: Story = {
  args: {
    value: 40,
    label: "CPU",
    unit: "%",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    value: 78,
    label: "Memory",
    unit: "%",
    size: "lg",
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
    value: 78,
    label: "Storage",
    unit: "%",
    color: "warning",
  },
};

export const Destructive: Story = {
  args: {
    value: 96,
    label: "Disk usage",
    unit: "%",
    color: "destructive",
  },
};

export const StorageQuota_LowerIsBetter: Story = {
  name: "Storage quota (auto-color, lower is better)",
  args: {
    value: 34,
    label: "Storage used",
    unit: "GB",
    min: 0,
    max: 100,
    low: 60,
    high: 85,
    optimum: 0,
    autoColorFromThresholds: true,
    showThresholdMarks: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Auto-colors the fill based on the resolved quality: values below `low` are optimum (positive), between `low` and `high` are sub-optimum (warning), and above `high` are worst (destructive). Because `optimum = 0`, the low band is preferred — perfect for storage / quota indicators where less usage is better.",
      },
    },
  },
};

export const StorageQuota_Warning: Story = {
  name: "Storage quota — warning band",
  args: {
    value: 72,
    label: "Storage used",
    unit: "GB",
    min: 0,
    max: 100,
    low: 60,
    high: 85,
    optimum: 0,
    autoColorFromThresholds: true,
    showThresholdMarks: true,
  },
};

export const StorageQuota_Critical: Story = {
  name: "Storage quota — critical",
  args: {
    value: 94,
    label: "Storage used",
    unit: "GB",
    min: 0,
    max: 100,
    low: 60,
    high: 85,
    optimum: 0,
    autoColorFromThresholds: true,
    showThresholdMarks: true,
  },
};

export const HealthScore_MiddleIsBest: Story = {
  name: "Health score (middle is optimum)",
  args: {
    value: 65,
    label: "System health",
    unit: "%",
    min: 0,
    max: 100,
    low: 40,
    high: 80,
    optimum: 60,
    autoColorFromThresholds: true,
    showThresholdMarks: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `optimum` sits inside `[low, high]`, the middle band is optimum. Both outer bands are treated as sub-optimum — useful for numbers like humidity, pH, or capacity utilization where too little and too much are both undesirable but neither is catastrophic.",
      },
    },
  },
};

export const ApiLatency_LowerIsBetter: Story = {
  name: "API latency (ms)",
  args: {
    value: 180,
    label: "p95 latency",
    unit: "ms",
    min: 0,
    max: 1000,
    low: 200,
    high: 500,
    optimum: 0,
    autoColorFromThresholds: true,
    showThresholdMarks: true,
  },
};

export const CustomRange: Story = {
  args: {
    value: 4.2,
    label: "Rating",
    min: 0,
    max: 5,
    low: 2,
    high: 4,
    optimum: 5,
    autoColorFromThresholds: true,
    formatValue: (v): string => `${v.toFixed(1)} / 5`,
  },
};

export const HiddenLabel: Story = {
  args: {
    value: 50,
    label: "Signal strength",
    showLabel: false,
    showValue: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The visible label and numeric readout are hidden, but the meter remains accessible — `label` is still announced via `aria-label` on the meter role.",
      },
    },
  },
};

export const CustomValueFormatter: Story = {
  args: {
    value: 4200,
    label: "Records processed",
    min: 0,
    max: 10_000,
    formatValue: (v): string => `${v.toLocaleString()} of 10,000`,
  },
};
