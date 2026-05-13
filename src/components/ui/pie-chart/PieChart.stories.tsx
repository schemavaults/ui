import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import {
  PieChart,
  pieChartSizeIds,
  type PieChartSegment,
} from "./pie-chart";

const meta = {
  title: "Components/PieChart",
  component: PieChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "SVG pie / donut chart built from an array of segments with relative sizes. Each segment can attach its own `onClick` handler (or fall back to the chart-level `onSegmentClick`), making it a drop-in chart for setting state on click.",
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
  },
  args: {
    label: "Sample distribution",
    size: "md",
    innerRadius: 0,
    segmentGap: 1,
  },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_SEGMENTS: ReadonlyArray<PieChartSegment> = [
  { id: "a", value: 40, label: "Schemas", color: "default" },
  { id: "b", value: 25, label: "Tables", color: "positive" },
  { id: "c", value: 18, label: "Indexes", color: "warning" },
  { id: "d", value: 12, label: "Views", color: "destructive" },
  { id: "e", value: 5, label: "Other", color: "muted" },
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
    segments: [{ id: "only", value: 1, label: "All", color: "primary" }],
  },
};

export const TwoSegments: Story = {
  args: {
    segments: [
      { id: "used", value: 72, label: "Used", color: "destructive" },
      { id: "free", value: 28, label: "Free", color: "muted" },
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
          onClick: (s) => {
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
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {args.segments.map((segment) => (
              <span
                key={segment.id}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-2 w-2 rounded-full bg-current"
                />
                {segment.label}
              </span>
            ))}
          </div>
        </div>
      );
    };
    return <InteractiveChart />;
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
