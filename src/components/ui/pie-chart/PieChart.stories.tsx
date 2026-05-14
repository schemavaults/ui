import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { fn } from "storybook/test";
import {
  PieChart,
  pieChartSizeIds,
  type PieChartSegment,
  type PieChartSegmentColorId,
} from "./pie-chart";

const LEGEND_SWATCH_CLASSES: Record<PieChartSegmentColorId, string> = {
  default: "bg-schemavaults-brand-blue",
  primary: "bg-primary",
  positive: "bg-emerald-500 dark:bg-emerald-400",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground",
};

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
            {args.segments.map((segment) => {
              const swatchClass: string = segment.color
                ? LEGEND_SWATCH_CLASSES[segment.color]
                : LEGEND_SWATCH_CLASSES.default;
              return (
                <span
                  key={segment.id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1"
                >
                  <span
                    aria-hidden="true"
                    className={`inline-block h-2 w-2 rounded-full ${swatchClass}`}
                    style={segment.fill ? { backgroundColor: segment.fill } : undefined}
                  />
                  {segment.label}
                </span>
              );
            })}
          </div>
        </div>
      );
    };
    return <InteractiveChart />;
  },
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
      { id: "a", value: 50, label: "Major", color: "default" },
      { id: "b", value: 30, label: "Medium", color: "positive" },
      { id: "c", value: 15, label: "Minor", color: "warning" },
      { id: "d", value: 3, label: "Tiny", color: "destructive" },
      { id: "e", value: 2, label: "Trace", color: "muted" },
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
