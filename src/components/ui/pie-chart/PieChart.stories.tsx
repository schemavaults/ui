import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  PieChart,
  pieChartSizeIds,
  type PieChartSegment,
} from "./pie-chart";

const meta = {
  title: "Charts & Graphs/PieChart",
  component: PieChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "SVG pie / donut chart built from an array of segments with relative sizes. Segments take the chart palette in slot order (a ninth and beyond are grey; pass `segmentOrder` so colour follows the segment). Hover a segment, or focus the chart and use the arrow keys, to read its value and share; `showLegend` adds a legend and `diameter=\"auto\"` fits a narrow container. Each segment can attach its own `onClick` handler (or fall back to the chart-level `onSegmentClick`).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: pieChartSizeIds,
      control: { type: "radio" },
    },
    innerRadius: {
      control: { type: "range", min: 0, max: 0.95, step: 0.05 },
    },
    segmentGap: {
      control: { type: "number", min: 0, max: 8, step: 0.5 },
    },
    diameter: {
      control: { type: "number" },
    },
    showSegmentLabels: {
      control: { type: "boolean" },
    },
    minSegmentLabelAngle: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
    },
  },
  args: {
    label: "Sample distribution",
    size: "md",
    innerRadius: 0,
    segmentGap: 1,
    onSegmentClick: fn(),
  },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_SEGMENTS: ReadonlyArray<PieChartSegment> = [
  { id: "a", value: 40, label: "Schemas" },
  { id: "b", value: 25, label: "Tables" },
  { id: "c", value: 18, label: "Indexes" },
  { id: "d", value: 12, label: "Views" },
  { id: "e", value: 5, label: "Other", color: "other" },
];

export const Default: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
  },
};

export const Donut: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    innerRadius: 0.6,
    size: "lg",
    children: (
      <div className="flex flex-col leading-tight">
        <span className="text-2xl font-bold">100</span>
        <span className="text-xs text-muted-foreground">objects</span>
      </div>
    ),
  },
};

export const SingleSegment: Story = {
  args: {
    segments: [{ id: "only", value: 1, label: "All" }],
  },
};

export const TwoSegments: Story = {
  args: {
    segments: [
      { id: "used", value: 72, label: "Used" },
      { id: "free", value: 28, label: "Free", color: "other" },
    ],
    innerRadius: 0.5,
  },
};

export const CustomFillColors: Story = {
  args: {
    segments: [
      { id: "r", value: 30, label: "Red", fill: "#ef4444" },
      { id: "g", value: 30, label: "Green", fill: "#22c55e" },
      { id: "b", value: 30, label: "Blue", fill: "#3b82f6" },
      { id: "p", value: 10, label: "Purple", fill: "#a855f7" },
    ],
  },
};

export const Empty: Story = {
  args: {
    segments: [],
  },
};

export const Small: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    size: "sm",
  },
};

export const ExtraLarge: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    size: "xl",
    innerRadius: 0.55,
  },
};

export const ClickableSegments: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    size: "lg",
    innerRadius: 0.55,
  },
  render: (args): ReactElement => {
    const InteractiveChart = (): ReactElement => {
      const [selected, setSelected] = useState<PieChartSegment | null>(null);
      const segments: ReadonlyArray<PieChartSegment> = args.segments.map(
        (segment) => ({
          ...segment,
          onClick: (s, event) => {
            // Per-segment `onClick` shadows the chart-level `onSegmentClick`
            // (see pie-chart.tsx: `segment.onClick ?? onSegmentClick`), so
            // forward to the spy explicitly to keep the Actions panel wired up.
            args.onSegmentClick?.(s, event);
            setSelected(s);
          },
        }),
      );
      return (
        <div className="flex flex-col items-center gap-4">
          <PieChart
            {...args}
            segments={segments}
            label="Click a segment"
            showLegend
          >
            {selected ? (
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-semibold">
                  {selected.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  value: {selected.value}
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                Click a slice
              </span>
            )}
          </PieChart>
        </div>
      );
    };
    return <InteractiveChart />;
  },
};

export const HoverReadout: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    size: "lg",
    innerRadius: 0.55,
    showLegend: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Hover a segment to read its value and share of the total; the others dim. Focus the chart and use the arrow keys for the same readout. `showLegend` names every segment, so identity never rests on colour alone.",
      },
    },
  },
  render: ({ onSegmentClick: _onSegmentClick, ...args }): ReactElement => (
    <PieChart {...args} />
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const chart = canvas.getByRole("img", { name: "Sample distribution" });
    chart.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => {
      const readout = canvas.getByRole("status");
      expect(readout).toHaveTextContent("40Schemas");
      expect(readout).toHaveTextContent("40% of the total");
    });
    await userEvent.keyboard("{ArrowLeft}");
    await waitFor(() => {
      expect(canvas.getByRole("status")).toHaveTextContent("5Other");
    });
  },
};

export const FitsContainer: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    size: "xl",
    innerRadius: 0.55,
    diameter: "auto",
    showLegend: true,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "`diameter=\"auto\"` fits the container's width, never growing past the size preset: in a narrow column the pie shrinks instead of overflowing.",
      },
    },
  },
  render: (args): ReactElement => (
    <div className="flex flex-wrap gap-4">
      <div className="w-[200px] rounded-lg border bg-card p-3">
        <PieChart {...args} label="Narrow card" />
      </div>
      <div className="w-full max-w-md rounded-lg border bg-card p-3">
        <PieChart {...args} label="Wide card" />
      </div>
    </div>
  ),
};

export const WithSegmentLabels: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    size: "lg",
    showSegmentLabels: true,
  },
};

export const WithSegmentLabelsDonut: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    size: "lg",
    innerRadius: 0.55,
    showSegmentLabels: true,
  },
};

export const PercentageLabels: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    size: "lg",
    showSegmentLabels: true,
    segmentLabelFormatter: ({ percentage }): string =>
      `${percentage.toFixed(0)}%`,
  },
};

export const NameAndPercentageLabels: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    size: "xl",
    innerRadius: 0.4,
    showSegmentLabels: true,
    segmentLabelFormatter: ({ segment, percentage }): string =>
      `${segment.label} (${percentage.toFixed(0)}%)`,
  },
};

export const SkipSmallSegmentLabels: Story = {
  args: {
    segments: [
      { id: "a", value: 50, label: "Major" },
      { id: "b", value: 30, label: "Medium" },
      { id: "c", value: 15, label: "Minor" },
      { id: "d", value: 3, label: "Tiny" },
      { id: "e", value: 2, label: "Trace" },
    ],
    size: "lg",
    showSegmentLabels: true,
    // ~17° threshold — segments under that will not be labeled.
    minSegmentLabelAngle: 0.3,
    segmentLabelFormatter: ({ segment, percentage }): string =>
      `${segment.label} ${percentage.toFixed(0)}%`,
  },
};

export const ChartLevelClickHandler: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    size: "lg",
  },
  render: (args): ReactElement => {
    const Wrapper = (): ReactElement => {
      const [lastClicked, setLastClicked] = useState<string | null>(null);
      return (
        <div className="flex flex-col items-center gap-3">
          <PieChart
            {...args}
            onSegmentClick={(segment): void => {
              setLastClicked(segment.label ?? segment.id);
            }}
          />
          <p className="text-sm text-muted-foreground">
            Last clicked: <strong>{lastClicked ?? "—"}</strong>
          </p>
        </div>
      );
    };
    return <Wrapper />;
  },
};
