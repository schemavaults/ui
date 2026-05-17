import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { fn } from "storybook/test";
import {
  BarChart,
  barChartSizeIds,
  barChartOrientationIds,
  type BarChartBar,
  type BarChartBarColorId,
} from "./bar-chart";

const LEGEND_SWATCH_CLASSES: Record<BarChartBarColorId, string> = {
  default: "bg-schemavaults-brand-blue",
  primary: "bg-primary",
  positive: "bg-emerald-500 dark:bg-emerald-400",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground",
};

const meta = {
  title: "Components/BarChart",
  component: BarChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "SVG bar chart built from an array of bars with absolute values. Supports vertical and horizontal orientation, theme-aware preset colors (or raw `fill` overrides), optional value/category labels, gridlines, and per-bar `onClick` handlers (falling back to the chart-level `onBarClick`).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: barChartSizeIds,
      control: { type: "radio" },
    },
    orientation: {
      options: barChartOrientationIds,
      control: { type: "radio" },
    },
    max: {
      control: { type: "number" },
    },
    barGap: {
      control: { type: "range", min: 0, max: 0.9, step: 0.05 },
    },
    cornerRadius: {
      control: { type: "number", min: 0, max: 24, step: 1 },
    },
    gridLineCount: {
      control: { type: "number", min: 0, max: 8, step: 1 },
    },
    showAxis: { control: { type: "boolean" } },
    showCategoryLabels: { control: { type: "boolean" } },
    showValueLabels: { control: { type: "boolean" } },
    width: { control: { type: "number" } },
    height: { control: { type: "number" } },
  },
  args: {
    label: "Sample metrics",
    size: "md",
    orientation: "vertical",
    barGap: 0.3,
    cornerRadius: 4,
    gridLineCount: 0,
    showAxis: true,
    showCategoryLabels: true,
    showValueLabels: false,
    onBarClick: fn(),
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_BARS: ReadonlyArray<BarChartBar> = [
  { id: "mon", value: 42, label: "Mon", color: "default" },
  { id: "tue", value: 68, label: "Tue", color: "default" },
  { id: "wed", value: 51, label: "Wed", color: "default" },
  { id: "thu", value: 89, label: "Thu", color: "default" },
  { id: "fri", value: 73, label: "Fri", color: "default" },
];

const STATUS_BARS: ReadonlyArray<BarChartBar> = [
  { id: "passed", value: 124, label: "Passed", color: "positive" },
  { id: "flaky", value: 18, label: "Flaky", color: "warning" },
  { id: "failed", value: 7, label: "Failed", color: "destructive" },
  { id: "skipped", value: 31, label: "Skipped", color: "muted" },
];

export const Default: Story = {
  args: {
    bars: SAMPLE_BARS,
  },
};

export const WithValueLabels: Story = {
  args: {
    bars: SAMPLE_BARS,
    size: "lg",
    showValueLabels: true,
  },
};

export const WithGridlines: Story = {
  args: {
    bars: SAMPLE_BARS,
    size: "lg",
    gridLineCount: 4,
    showValueLabels: true,
  },
};

export const Horizontal: Story = {
  args: {
    bars: STATUS_BARS,
    size: "lg",
    orientation: "horizontal",
    showValueLabels: true,
  },
};

export const SemanticColors: Story = {
  args: {
    bars: STATUS_BARS,
    size: "lg",
    showValueLabels: true,
  },
};

export const PercentageLabels: Story = {
  args: {
    bars: SAMPLE_BARS,
    size: "lg",
    max: 100,
    showValueLabels: true,
    valueLabelFormatter: ({ value }): string => `${value}%`,
  },
};

export const CustomFillColors: Story = {
  args: {
    bars: [
      { id: "r", value: 30, label: "Red", fill: "#ef4444" },
      { id: "g", value: 55, label: "Green", fill: "#22c55e" },
      { id: "b", value: 40, label: "Blue", fill: "#3b82f6" },
      { id: "p", value: 70, label: "Purple", fill: "#a855f7" },
    ],
    size: "lg",
    showValueLabels: true,
  },
};

export const SharedScale: Story = {
  args: {
    bars: SAMPLE_BARS,
  },
  render: (args): ReactElement => (
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-2">
        <BarChart
          {...args}
          label="This week"
          bars={SAMPLE_BARS}
          max={120}
          showValueLabels
        />
        <span className="text-xs text-muted-foreground">This week</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BarChart
          {...args}
          label="Last week"
          bars={[
            { id: "mon", value: 110, label: "Mon", color: "muted" },
            { id: "tue", value: 60, label: "Tue", color: "muted" },
            { id: "wed", value: 95, label: "Wed", color: "muted" },
            { id: "thu", value: 40, label: "Thu", color: "muted" },
            { id: "fri", value: 80, label: "Fri", color: "muted" },
          ]}
          max={120}
          showValueLabels
        />
        <span className="text-xs text-muted-foreground">Last week</span>
      </div>
    </div>
  ),
};

export const Empty: Story = {
  args: {
    bars: [],
  },
};

export const SingleBar: Story = {
  args: {
    bars: [{ id: "only", value: 64, label: "Total", color: "primary" }],
    size: "lg",
    showValueLabels: true,
  },
};

export const Sizes: Story = {
  args: {
    bars: SAMPLE_BARS,
  },
  render: (args): ReactElement => (
    <div className="flex flex-col items-start gap-6">
      {barChartSizeIds.map((s) => (
        <div key={s} className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {s}
          </span>
          <BarChart {...args} size={s} label={`Metrics (${s})`} />
        </div>
      ))}
    </div>
  ),
};

export const ClickableBars: Story = {
  args: {
    bars: STATUS_BARS,
    size: "lg",
    showValueLabels: true,
  },
  render: (args): ReactElement => {
    const Interactive = (): ReactElement => {
      const [selected, setSelected] = useState<BarChartBar | null>(null);
      const bars: ReadonlyArray<BarChartBar> = args.bars.map((bar) => ({
        ...bar,
        onClick: (b, event) => {
          // Per-bar `onClick` shadows the chart-level `onBarClick`
          // (see bar-chart.tsx: `bar.onClick ?? onBarClick`), so forward to
          // the spy explicitly to keep the Actions panel wired up.
          args.onBarClick?.(b, event);
          setSelected(b);
        },
      }));
      return (
        <div className="flex flex-col items-center gap-4">
          <BarChart {...args} bars={bars} label="Click a bar" />
          <p className="text-sm text-muted-foreground">
            Selected:{" "}
            <strong>
              {selected ? `${selected.label} (${selected.value})` : "—"}
            </strong>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {args.bars.map((bar) => {
              const swatchClass: string = bar.color
                ? LEGEND_SWATCH_CLASSES[bar.color]
                : LEGEND_SWATCH_CLASSES.default;
              return (
                <span
                  key={bar.id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1"
                >
                  <span
                    aria-hidden="true"
                    className={`inline-block h-2 w-2 rounded-full ${swatchClass}`}
                    style={
                      bar.fill ? { backgroundColor: bar.fill } : undefined
                    }
                  />
                  {bar.label}
                </span>
              );
            })}
          </div>
        </div>
      );
    };
    return <Interactive />;
  },
};
