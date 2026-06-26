import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { fn } from "storybook/test";
import {
  LineChart,
  lineChartSizeIds,
  lineChartCurveIds,
  type LineChartColorId,
  type LineChartPoint,
  type LineChartSeries,
} from "./line-chart";

const LEGEND_SWATCH_CLASSES: Record<LineChartColorId, string> = {
  default: "bg-schemavaults-brand-blue",
  primary: "bg-primary",
  positive: "bg-emerald-500 dark:bg-emerald-400",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground",
};

const meta = {
  title: "Components/LineChart",
  component: LineChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "SVG line chart for trend data. Plots one or more named series sharing a single x/y domain, with theme-aware preset colors (or raw `stroke` overrides), optional point markers, gap support (`y: NaN`), linear or smoothed interpolation, area fills, gridlines, and per-series `onPointClick` handlers (falling back to the chart-level `onPointClick`).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: lineChartSizeIds,
      control: { type: "radio" },
    },
    curve: {
      options: lineChartCurveIds,
      control: { type: "radio" },
    },
    gridLineCount: {
      control: { type: "number", min: 0, max: 8, step: 1 },
    },
    showAxis: { control: { type: "boolean" } },
    showPoints: { control: { type: "boolean" } },
    showValueLabels: { control: { type: "boolean" } },
    width: { control: { type: "number" } },
    height: { control: { type: "number" } },
  },
  args: {
    label: "Sample metrics",
    size: "md",
    curve: "linear",
    gridLineCount: 0,
    showAxis: true,
    showPoints: false,
    showValueLabels: false,
    onPointClick: fn(),
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const WEEK_LABELS: ReadonlyArray<string> = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const SINGLE_SERIES: ReadonlyArray<LineChartSeries> = [
  {
    id: "active-users",
    label: "Active users",
    color: "default",
    points: [
      { y: 320 },
      { y: 412 },
      { y: 380 },
      { y: 504 },
      { y: 478 },
      { y: 560 },
      { y: 612 },
    ],
  },
];

const MULTI_SERIES: ReadonlyArray<LineChartSeries> = [
  {
    id: "active-users",
    label: "Active users",
    color: "default",
    points: [
      { y: 320 },
      { y: 412 },
      { y: 380 },
      { y: 504 },
      { y: 478 },
      { y: 560 },
      { y: 612 },
    ],
  },
  {
    id: "new-signups",
    label: "New signups",
    color: "positive",
    points: [
      { y: 40 },
      { y: 62 },
      { y: 58 },
      { y: 80 },
      { y: 95 },
      { y: 110 },
      { y: 132 },
    ],
  },
  {
    id: "churned",
    label: "Churned",
    color: "destructive",
    points: [
      { y: 18 },
      { y: 22 },
      { y: 14 },
      { y: 28 },
      { y: 31 },
      { y: 19 },
      { y: 24 },
    ],
  },
];

const GAP_SERIES: ReadonlyArray<LineChartSeries> = [
  {
    id: "latency",
    label: "p95 latency (ms)",
    color: "warning",
    points: [
      { y: 120 },
      { y: 135 },
      { y: 128 },
      { y: Number.NaN },
      { y: Number.NaN },
      { y: 150 },
      { y: 142 },
    ],
  },
];

export const Default: Story = {
  args: {
    series: SINGLE_SERIES,
    categories: WEEK_LABELS,
  },
};

export const WithPointMarkers: Story = {
  args: {
    series: SINGLE_SERIES,
    categories: WEEK_LABELS,
    size: "lg",
    showPoints: true,
  },
};

export const Smoothed: Story = {
  args: {
    series: SINGLE_SERIES,
    categories: WEEK_LABELS,
    size: "lg",
    curve: "smooth",
    showPoints: true,
  },
};

export const AreaFill: Story = {
  args: {
    series: SINGLE_SERIES.map((s) => ({ ...s, area: true })),
    categories: WEEK_LABELS,
    size: "lg",
    curve: "smooth",
    showPoints: true,
  },
};

export const WithGridlines: Story = {
  args: {
    series: SINGLE_SERIES,
    categories: WEEK_LABELS,
    size: "lg",
    gridLineCount: 4,
    showValueLabels: true,
    showPoints: true,
  },
};

export const MultipleSeries: Story = {
  args: {
    series: MULTI_SERIES,
    categories: WEEK_LABELS,
    size: "lg",
    gridLineCount: 3,
    showPoints: true,
  },
  render: (args): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      <LineChart {...args} />
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {args.series.map((s) => {
          const swatchClass: string = s.color
            ? LEGEND_SWATCH_CLASSES[s.color]
            : LEGEND_SWATCH_CLASSES.default;
          return (
            <span
              key={s.id}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1"
            >
              <span
                aria-hidden="true"
                className={`inline-block h-2 w-2 rounded-full ${swatchClass}`}
                style={s.stroke ? { backgroundColor: s.stroke } : undefined}
              />
              {s.label ?? s.id}
            </span>
          );
        })}
      </div>
    </div>
  ),
};

export const GapsInData: Story = {
  args: {
    series: GAP_SERIES,
    categories: WEEK_LABELS,
    size: "lg",
    showPoints: true,
    gridLineCount: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Non-finite `y` values (e.g. `NaN`) create gaps in the line — useful for missing-data periods.",
      },
    },
  },
};

export const DashedAndSolid: Story = {
  args: {
    categories: WEEK_LABELS,
    size: "lg",
    showPoints: true,
    series: [
      {
        id: "actual",
        label: "Actual",
        color: "default",
        points: SINGLE_SERIES[0]!.points,
      },
      {
        id: "forecast",
        label: "Forecast",
        color: "muted",
        strokeDasharray: "5 4",
        points: [
          { y: 612 },
          { y: 640 },
          { y: 668 },
          { y: 690 },
          { y: 712 },
        ].map((p, i) => ({ ...p, x: i + 6 })),
      },
    ],
    xMin: 0,
    xMax: 10,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Mix solid + dashed strokes to overlay actuals and a forecast on a shared numeric x-axis.",
      },
    },
  },
};

export const PercentageLabels: Story = {
  args: {
    categories: WEEK_LABELS,
    size: "lg",
    showPoints: true,
    yMin: 0,
    yMax: 100,
    series: [
      {
        id: "conversion",
        label: "Conversion %",
        color: "primary",
        points: [
          { y: 12 },
          { y: 18 },
          { y: 24 },
          { y: 22 },
          { y: 31 },
          { y: 36 },
          { y: 41 },
        ],
      },
    ],
    showValueLabels: true,
    valueLabelFormatter: ({ value }): string => `${value}%`,
  },
};

export const NumericXAxis: Story = {
  args: {
    size: "lg",
    showPoints: true,
    gridLineCount: 3,
    xTickCount: 6,
    xTickFormatter: (x): string => `t${Math.round(x)}`,
    series: [
      {
        id: "signal",
        label: "Signal",
        color: "primary",
        points: Array.from({ length: 12 }, (_, i): LineChartPoint => {
          const x: number = i * 10;
          const y: number = 50 + 40 * Math.sin(i / 1.5);
          return { x, y };
        }),
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass explicit numeric `x` values on each point and a `xTickFormatter` to label arbitrary axis positions.",
      },
    },
  },
};

export const CustomStrokeColors: Story = {
  args: {
    categories: WEEK_LABELS,
    size: "lg",
    showPoints: true,
    series: [
      {
        id: "a",
        label: "Series A",
        stroke: "#ef4444",
        points: SINGLE_SERIES[0]!.points,
      },
      {
        id: "b",
        label: "Series B",
        stroke: "#a855f7",
        points: [
          { y: 220 },
          { y: 280 },
          { y: 312 },
          { y: 360 },
          { y: 402 },
          { y: 440 },
          { y: 480 },
        ],
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    series: [],
    categories: WEEK_LABELS,
  },
};

export const Sizes: Story = {
  args: {
    series: SINGLE_SERIES,
    categories: WEEK_LABELS,
  },
  render: (args): ReactElement => (
    <div className="flex flex-col items-start gap-6">
      {lineChartSizeIds.map((s) => (
        <div key={s} className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">{s}</span>
          <LineChart {...args} size={s} label={`Metrics (${s})`} />
        </div>
      ))}
    </div>
  ),
};

export const ClickablePoints: Story = {
  args: {
    series: SINGLE_SERIES,
    categories: WEEK_LABELS,
    size: "lg",
    showPoints: true,
    gridLineCount: 3,
  },
  render: (args): ReactElement => {
    const Interactive = (): ReactElement => {
      const [selected, setSelected] = useState<{
        seriesId: string;
        point: LineChartPoint;
      } | null>(null);
      const series: ReadonlyArray<LineChartSeries> = args.series.map((s) => ({
        ...s,
        onPointClick: (point, parentSeries, event) => {
          // Per-series `onPointClick` shadows the chart-level handler (see
          // line-chart.tsx: `series.onPointClick ?? onPointClick`), so forward
          // to the spy explicitly to keep the Actions panel wired up.
          args.onPointClick?.(point, parentSeries, event);
          setSelected({ seriesId: parentSeries.id, point });
        },
      }));
      return (
        <div className="flex flex-col items-center gap-4">
          <LineChart {...args} series={series} label="Click a point" />
          <p className="text-sm text-muted-foreground">
            Selected:{" "}
            <strong>
              {selected
                ? `${selected.seriesId} → ${selected.point.label ?? selected.point.y}`
                : "—"}
            </strong>
          </p>
        </div>
      );
    };
    return <Interactive />;
  },
};
