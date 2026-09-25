import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  BarChart,
  barChartBarColorIds,
  barChartSizeIds,
  barChartOrientationIds,
  barChartSwatchProps,
  type BarChartBar,
} from "./bar-chart";

/**
 * The visual readout. The tooltip is `aria-hidden`; screen readers hear
 * keyboard moves through the chart's live region (`role="status"`) instead.
 */
function readoutOf(canvasElement: HTMLElement): HTMLElement | null {
  return canvasElement.querySelector<HTMLElement>('[data-slot="chart-tooltip"]');
}

const meta = {
  title: "Charts & Graphs/BarChart",
  component: BarChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "SVG bar chart built from an array of bars with absolute values: one series of unrelated categories. Every bar shares the chart's `color` (palette slot 1 by default); pass a status colour on a bar only when it means good or bad. Hover or focus a bar (its whole column is the target) to read its value; the arrow keys step through the bars. `width=\"auto\"` fills the container, `showValueAxis` adds a nice value axis, and bars stay at most 24px thick with a rounded free end. For a histogram use `Histogram`; for long category names use `BarList`.",
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
    color: {
      options: barChartBarColorIds,
      control: { type: "select" },
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
  { id: "mon", value: 42, label: "Mon" },
  { id: "tue", value: 68, label: "Tue" },
  { id: "wed", value: 51, label: "Wed" },
  { id: "thu", value: 89, label: "Thu" },
  { id: "fri", value: 73, label: "Fri" },
];

const MONTHLY_BARS: ReadonlyArray<BarChartBar> = [
  { id: "jan", value: 1240, label: "Jan" },
  { id: "feb", value: 1580, label: "Feb" },
  { id: "mar", value: 1320, label: "Mar" },
  { id: "apr", value: 2110, label: "Apr" },
  { id: "may", value: 1870, label: "May" },
  { id: "jun", value: 2460, label: "Jun" },
  { id: "jul", value: 2210, label: "Jul" },
  { id: "aug", value: 2690, label: "Aug" },
  { id: "sep", value: 2380, label: "Sep" },
  { id: "oct", value: 2920, label: "Oct" },
  { id: "nov", value: 3140, label: "Nov" },
  { id: "dec", value: 3480, label: "Dec" },
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

export const HoverReadout: Story = {
  args: {
    bars: SAMPLE_BARS,
    size: "lg",
    showValueAxis: true,
    formatValue: (value: number): string => `${value} deploys`,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Hover anywhere in a bar's column (not just the bar) to read it: the value leads, the category follows, and the other bars dim. Focus the chart with Tab and use the arrow keys for the same readout. (Without click handlers the chart itself takes focus; clickable bars are each a button instead.)",
      },
    },
  },
  // No click handler: the chart is one tab stop read with the arrow keys.
  render: ({ onBarClick: _onBarClick, ...args }): ReactElement => (
    <BarChart {...args} />
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const chart = canvas.getByRole("img", { name: "Sample metrics" });

    // Keyboard: focus the chart, then step through the bars.
    chart.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => {
      expect(readoutOf(canvasElement)).toHaveTextContent("42 deploys");
      expect(readoutOf(canvasElement)).toHaveTextContent("Mon");
      // Screen readers hear the same readout through the live region.
      expect(canvas.getByRole("status")).toHaveTextContent("Mon: 42 deploys");
    });
    await userEvent.keyboard("{End}");
    await waitFor(() => {
      expect(readoutOf(canvasElement)).toHaveTextContent("73 deploys");
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(readoutOf(canvasElement)).toBeNull();
    });

    // Pointer: the whole column is the hover target.
    const thursday = canvasElement.querySelector('[data-bar-id="thu"]');
    await userEvent.hover(thursday as Element);
    await waitFor(() => {
      expect(readoutOf(canvasElement)).toHaveTextContent("89 deploys");
    });
    // Hovering isn't announced.
    expect(canvas.getByRole("status")).toBeEmptyDOMElement();
  },
};

export const ValueAxis: Story = {
  args: {
    bars: MONTHLY_BARS,
    size: "xl",
    showValueAxis: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`showValueAxis` draws nice, thousands-separated ticks (0, 1,000, 2,000 …) with hairline gridlines; the scale's top rounds up to the next tick. Format them with `formatValue`.",
      },
    },
  },
};

export const FillsContainer: Story = {
  args: {
    bars: MONTHLY_BARS,
    width: "auto",
    height: 240,
    showValueAxis: true,
    formatValue: (value: number): string => `$${value.toLocaleString("en-US")}`,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "`width=\"auto\"` fills the container and redraws as it resizes (drag the viewport). Until it has been measured it renders an empty box at its height, so the server render holds no pixel width.",
      },
    },
  },
  render: (args): ReactElement => (
    <div className="w-full max-w-3xl rounded-lg border bg-card p-4">
      <p className="mb-3 text-sm font-medium">Monthly revenue</p>
      <BarChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const root = canvasElement.querySelector<HTMLElement>(
      '[data-slot="bar-chart"]',
    )!;
    await waitFor(() => {
      expect(root.querySelector("svg")).not.toBeNull();
    });
    const svg = root.querySelector("svg")!;
    // The drawing matches the container, to the pixel.
    expect(Math.abs(svg.getBoundingClientRect().width - root.clientWidth)).toBeLessThanOrEqual(1);
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
          color="other"
          bars={[
            { id: "mon", value: 110, label: "Mon" },
            { id: "tue", value: 60, label: "Tue" },
            { id: "wed", value: 95, label: "Wed" },
            { id: "thu", value: 40, label: "Thu" },
            { id: "fri", value: 80, label: "Fri" },
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
    bars: [{ id: "only", value: 64, label: "Total" }],
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
              const swatch = barChartSwatchProps(
                bar.color ?? args.color ?? "chart-1",
                bar.fill,
              );
              return (
                <span
                  key={bar.id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1"
                >
                  <span
                    aria-hidden="true"
                    className={`inline-block h-2 w-2 rounded-[2px] ${swatch.className ?? ""}`}
                    style={swatch.style}
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
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Flaky: 18" }));
    await waitFor(() => {
      expect(canvas.getByText("Flaky (18)")).toBeInTheDocument();
    });
    // Clickable bars are buttons: Tab reaches them, the arrow keys move
    // between them, Enter activates.
    canvas.getByRole("button", { name: "Passed: 124" }).focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{Enter}");
    await waitFor(() => {
      expect(canvas.getByText("Failed (7)")).toBeInTheDocument();
    });
  },
};
