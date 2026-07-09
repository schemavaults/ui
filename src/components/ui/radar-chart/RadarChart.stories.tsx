import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { fn } from "storybook/test";
import {
  RadarChart,
  radarChartSizeIds,
  radarChartGridShapeIds,
  type RadarChartAxis,
  type RadarChartColorId,
  type RadarChartSeries,
} from "./radar-chart";

const LEGEND_SWATCH_CLASSES: Record<RadarChartColorId, string> = {
  default: "bg-schemavaults-brand-blue",
  primary: "bg-primary",
  positive: "bg-emerald-500 dark:bg-emerald-400",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground",
};

const meta = {
  title: "Components/RadarChart",
  component: RadarChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "SVG radar (spider) chart for comparing multi-dimensional data across a shared set of axes. Each series draws one closed shape over the axes; the chart supports polygon or circular grid rings, area fills with per-series opacity, per-axis min/max overrides for mixed-scale data, theme-aware preset colors (or raw `stroke` overrides), point markers, value labels, and per-vertex `onPointClick` handlers (falling back to the chart-level `onPointClick`).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: radarChartSizeIds,
      control: { type: "radio" },
    },
    gridShape: {
      options: radarChartGridShapeIds,
      control: { type: "radio" },
    },
    gridLevels: {
      control: { type: "number", min: 0, max: 8, step: 1 },
    },
    diameter: {
      control: { type: "number" },
    },
    startAngle: {
      control: { type: "range", min: -180, max: 180, step: 5 },
    },
    min: {
      control: { type: "number" },
    },
    max: {
      control: { type: "number" },
    },
    area: { control: { type: "boolean" } },
    showAxis: { control: { type: "boolean" } },
    showAxisLabels: { control: { type: "boolean" } },
    showBoundary: { control: { type: "boolean" } },
    showPoints: { control: { type: "boolean" } },
    showValueLabels: { control: { type: "boolean" } },
  },
  args: {
    label: "Sample multi-dimensional comparison",
    size: "md",
    gridShape: "polygon",
    gridLevels: 4,
    startAngle: 0,
    min: 0,
    max: 100,
    area: true,
    showAxis: true,
    showAxisLabels: true,
    showBoundary: true,
    showPoints: false,
    showValueLabels: false,
    onPointClick: fn(),
  },
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const QUALITY_AXES: ReadonlyArray<RadarChartAxis> = [
  { id: "completeness", label: "Completeness" },
  { id: "accuracy", label: "Accuracy" },
  { id: "consistency", label: "Consistency" },
  { id: "timeliness", label: "Timeliness" },
  { id: "uniqueness", label: "Uniqueness" },
  { id: "validity", label: "Validity" },
];

const QUALITY_SERIES: ReadonlyArray<RadarChartSeries> = [
  {
    id: "customers",
    label: "customers",
    color: "default",
    values: [92, 88, 74, 80, 96, 90],
  },
  {
    id: "orders",
    label: "orders",
    color: "positive",
    values: [78, 65, 82, 90, 88, 72],
  },
];

export const Default: Story = {
  args: {
    axes: QUALITY_AXES,
    series: QUALITY_SERIES,
  },
};

export const SingleSeries: Story = {
  args: {
    axes: QUALITY_AXES,
    series: [QUALITY_SERIES[0]!],
    size: "lg",
  },
};

export const ThreeSeriesLarge: Story = {
  args: {
    size: "lg",
    axes: QUALITY_AXES,
    series: [
      ...QUALITY_SERIES,
      {
        id: "events",
        label: "events",
        color: "warning",
        values: [55, 72, 60, 68, 45, 82],
      },
    ],
  },
};

export const CircularGrid: Story = {
  args: {
    axes: QUALITY_AXES,
    series: QUALITY_SERIES,
    size: "lg",
    gridShape: "circle",
    gridLevels: 5,
  },
};

export const NoAreaFill: Story = {
  args: {
    axes: QUALITY_AXES,
    series: QUALITY_SERIES.map((s) => ({ ...s, area: false })),
    size: "lg",
  },
};

export const WithPointsAndValues: Story = {
  args: {
    axes: QUALITY_AXES,
    series: QUALITY_SERIES,
    size: "lg",
    showPoints: true,
    showValueLabels: true,
    valueLabelFormatter: ({ value }): string => value.toFixed(0),
  },
};

export const FourAxes: Story = {
  args: {
    size: "lg",
    axes: [
      { id: "speed", label: "Speed" },
      { id: "cost", label: "Cost" },
      { id: "quality", label: "Quality" },
      { id: "scope", label: "Scope" },
    ],
    series: [
      {
        id: "proposal-a",
        label: "Proposal A",
        color: "default",
        values: [82, 40, 90, 60],
      },
      {
        id: "proposal-b",
        label: "Proposal B",
        color: "destructive",
        values: [60, 85, 70, 90],
      },
    ],
  },
};

export const DashedSeries: Story = {
  args: {
    axes: QUALITY_AXES,
    size: "lg",
    series: [
      {
        id: "target",
        label: "target",
        color: "muted",
        area: false,
        strokeDasharray: "4 3",
        values: [80, 80, 80, 80, 80, 80],
      },
      {
        id: "actual",
        label: "actual",
        color: "default",
        values: [92, 88, 74, 80, 96, 90],
      },
    ],
  },
};

export const CustomStrokeColors: Story = {
  args: {
    size: "lg",
    axes: QUALITY_AXES,
    series: [
      {
        id: "red",
        label: "Red team",
        stroke: "#ef4444",
        values: [70, 40, 60, 80, 55, 50],
      },
      {
        id: "blue",
        label: "Blue team",
        stroke: "#3b82f6",
        values: [55, 75, 45, 60, 80, 65],
      },
    ],
  },
};

export const PerAxisScales: Story = {
  args: {
    size: "lg",
    // Different natural units per axis: latency ms vs percentages vs a $ score.
    axes: [
      { id: "latency", label: "Latency (ms, lower is better)", max: 250, min: 0 },
      { id: "uptime", label: "Uptime (%)", max: 100, min: 90 },
      { id: "cost", label: "Cost score", max: 10, min: 0 },
      { id: "coverage", label: "Coverage (%)", max: 100, min: 0 },
      { id: "throughput", label: "Throughput (rps)", max: 5000, min: 0 },
    ],
    // Values here are on each axis' own scale — the radar normalizes them.
    series: [
      {
        id: "east",
        label: "us-east",
        color: "default",
        values: [
          { value: 82, label: "82 ms" },
          { value: 99.9, label: "99.9%" },
          { value: 7.2, label: "$7.2" },
          { value: 88, label: "88%" },
          { value: 3800, label: "3.8k rps" },
        ],
      },
      {
        id: "west",
        label: "us-west",
        color: "warning",
        values: [
          { value: 120, label: "120 ms" },
          { value: 99.4, label: "99.4%" },
          { value: 5.5, label: "$5.5" },
          { value: 76, label: "76%" },
          { value: 3200, label: "3.2k rps" },
        ],
      },
    ],
  },
};

export const GappedSeries: Story = {
  args: {
    axes: QUALITY_AXES,
    size: "lg",
    series: [
      {
        id: "partial",
        label: "Partial coverage",
        color: "destructive",
        // NaN vertices are treated as gaps and split the closed shape.
        values: [92, Number.NaN, 74, 80, Number.NaN, 90],
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    axes: QUALITY_AXES,
    series: [],
  },
};

export const NotEnoughAxes: Story = {
  args: {
    axes: [{ id: "only", label: "Only axis" }],
    series: [
      { id: "s", label: "s", values: [50], color: "default" },
    ],
  },
};

export const Small: Story = {
  args: {
    axes: QUALITY_AXES,
    series: QUALITY_SERIES,
    size: "sm",
    showAxisLabels: false,
    gridLevels: 2,
  },
};

export const ExtraLarge: Story = {
  args: {
    axes: QUALITY_AXES,
    series: QUALITY_SERIES,
    size: "xl",
    showPoints: true,
  },
};

export const OverlayContent: Story = {
  args: {
    axes: QUALITY_AXES,
    series: QUALITY_SERIES,
    size: "lg",
    children: (
      <div className="flex flex-col leading-tight">
        <span className="text-3xl font-bold">83</span>
        <span className="text-xs text-muted-foreground">quality score</span>
      </div>
    ),
  },
};

export const WithLegend: Story = {
  args: {
    axes: QUALITY_AXES,
    series: QUALITY_SERIES,
    size: "lg",
    showPoints: true,
  },
  render: (args): ReactElement => (
    <div className="flex flex-col items-center gap-4">
      <RadarChart {...args} />
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        {args.series.map((series) => {
          const swatchClass: string = series.color
            ? LEGEND_SWATCH_CLASSES[series.color]
            : LEGEND_SWATCH_CLASSES.default;
          return (
            <span
              key={series.id}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1"
            >
              <span
                aria-hidden="true"
                className={`inline-block h-2 w-2 rounded-full ${swatchClass}`}
                style={
                  series.stroke ? { backgroundColor: series.stroke } : undefined
                }
              />
              {series.label ?? series.id}
            </span>
          );
        })}
      </div>
    </div>
  ),
};

export const ClickablePoints: Story = {
  args: {
    axes: QUALITY_AXES,
    series: QUALITY_SERIES,
    size: "lg",
    showPoints: true,
  },
  render: (args): ReactElement => {
    const Interactive = (): ReactElement => {
      const [selected, setSelected] = useState<{
        seriesId: string;
        axisId: string;
        value: number;
      } | null>(null);
      return (
        <div className="flex flex-col items-center gap-3">
          <RadarChart
            {...args}
            onPointClick={(axis, value, series, event): void => {
              args.onPointClick?.(axis, value, series, event);
              setSelected({
                seriesId: series.id,
                axisId: axis.id,
                value,
              });
            }}
          />
          <p className="text-sm text-muted-foreground">
            {selected ? (
              <>
                {selected.seriesId} · <strong>{selected.axisId}</strong>:{" "}
                {selected.value}
              </>
            ) : (
              "Click a vertex"
            )}
          </p>
        </div>
      );
    };
    return <Interactive />;
  },
};
