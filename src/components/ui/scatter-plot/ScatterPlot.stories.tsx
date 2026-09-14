import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import {
  ScatterPlot,
  scatterPlotColorIds,
  scatterPlotShapeIds,
  scatterPlotSizeIds,
  type ScatterPlotColorId,
  type ScatterPlotPoint,
  type ScatterPlotSeries,
} from "./scatter-plot";

const LEGEND_SWATCH_CLASSES: Record<ScatterPlotColorId, string> = {
  default: "bg-schemavaults-brand-blue",
  primary: "bg-primary",
  positive: "bg-emerald-500 dark:bg-emerald-400",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground",
};

const meta = {
  title: "Components/ScatterPlot",
  component: ScatterPlot,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "SVG scatter / bubble chart for correlating two numeric dimensions. Plots one or more named series on a shared x/y domain with theme-aware preset colors (or raw `color` overrides), rotating marker shapes so series stay distinguishable without relying on color alone, optional `size`-driven bubble scaling, least-squares trend lines, quadrant reference lines, axis ticks/titles, and per-series `onPointClick` handlers (falling back to the chart-level `onPointClick`).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: scatterPlotSizeIds,
      control: { type: "radio" },
    },
    gridLineCount: {
      control: { type: "number", min: 0, max: 8, step: 1 },
    },
    verticalGridLineCount: {
      control: { type: "number", min: 0, max: 8, step: 1 },
    },
    pointRadius: { control: { type: "number", min: 1, max: 20, step: 1 } },
    pointOpacity: { control: { type: "number", min: 0.1, max: 1, step: 0.05 } },
    showAxis: { control: { type: "boolean" } },
    showXAxisLabels: { control: { type: "boolean" } },
    showYAxisLabels: { control: { type: "boolean" } },
    showValueLabels: { control: { type: "boolean" } },
    xTickCount: { control: { type: "number", min: 2, max: 10, step: 1 } },
    yTickCount: { control: { type: "number", min: 2, max: 10, step: 1 } },
    yTickLabelWidth: { control: { type: "number", min: 16, max: 96, step: 1 } },
    width: { control: { type: "number" } },
    height: { control: { type: "number" } },
  },
  args: {
    label: "Sample correlation",
    size: "md",
    pointRadius: 4,
    pointOpacity: 0.8,
    showAxis: true,
    showXAxisLabels: false,
    showYAxisLabels: false,
    showValueLabels: false,
    gridLineCount: 0,
    verticalGridLineCount: 0,
    xTickCount: 5,
    yTickCount: 5,
    onPointClick: fn(),
  },
} satisfies Meta<typeof ScatterPlot>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deterministic pseudo-random generator so stories render identically on
 * every reload (important for the visual snapshots / test runner). */
function makeRng(seed: number): () => number {
  let state: number = seed;
  return (): number => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function makeCloud(
  seed: number,
  count: number,
  slope: number,
  noise: number,
): ScatterPlotPoint[] {
  const rng = makeRng(seed);
  return Array.from({ length: count }, (_, i): ScatterPlotPoint => {
    const x: number = Math.round(rng() * 100);
    const y: number = Math.round(
      Math.max(0, Math.min(100, x * slope + (rng() - 0.5) * noise + 20)),
    );
    return { id: `p-${seed}-${i}`, x, y };
  });
}

const QUERY_LATENCY: ReadonlyArray<ScatterPlotSeries> = [
  {
    id: "queries",
    label: "Queries",
    colorId: "default",
    points: makeCloud(7, 40, 0.6, 40),
  },
];

const TWO_COHORTS: ReadonlyArray<ScatterPlotSeries> = [
  {
    id: "free",
    label: "Free tier",
    colorId: "muted",
    points: makeCloud(11, 30, 0.3, 30),
  },
  {
    id: "pro",
    label: "Pro tier",
    colorId: "default",
    points: makeCloud(23, 30, 0.8, 30),
  },
  {
    id: "enterprise",
    label: "Enterprise",
    colorId: "positive",
    points: makeCloud(41, 20, 0.5, 60),
  },
];

const BUBBLE_SERIES: ReadonlyArray<ScatterPlotSeries> = [
  {
    id: "vaults",
    label: "Vaults",
    colorId: "primary",
    points: [
      { id: "billing", x: 12, y: 78, size: 420, label: "billing" },
      { id: "analytics", x: 34, y: 45, size: 1200, label: "analytics" },
      { id: "identity", x: 48, y: 92, size: 240, label: "identity" },
      { id: "catalog", x: 66, y: 30, size: 2400, label: "catalog" },
      { id: "telemetry", x: 81, y: 63, size: 860, label: "telemetry" },
      { id: "archive", x: 94, y: 18, size: 140, label: "archive" },
    ],
  },
];

function Legend({
  series,
}: {
  series: ReadonlyArray<ScatterPlotSeries>;
}): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {series.map((s) => {
        const swatchClass: string = s.colorId
          ? LEGEND_SWATCH_CLASSES[s.colorId]
          : LEGEND_SWATCH_CLASSES.default;
        return (
          <span
            key={s.id}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1"
          >
            <span
              aria-hidden="true"
              className={`inline-block h-2 w-2 rounded-full ${swatchClass}`}
              style={s.color ? { backgroundColor: s.color } : undefined}
            />
            {s.label ?? s.id}
          </span>
        );
      })}
    </div>
  );
}

export const Default: Story = {
  args: {
    series: QUERY_LATENCY,
    label: "Query cost vs. latency",
  },
};

export const WithAxes: Story = {
  args: {
    series: QUERY_LATENCY,
    label: "Query cost vs. latency",
    size: "lg",
    showXAxisLabels: true,
    showYAxisLabels: true,
    gridLineCount: 3,
    verticalGridLineCount: 3,
    xAxisTitle: "Rows scanned (k)",
    yAxisTitle: "p95 latency (ms)",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Turn on `showXAxisLabels` / `showYAxisLabels` for raw-value ticks, and pass `xAxisTitle` / `yAxisTitle` to name the dimensions. Gutters for ticks and titles are reserved automatically.",
      },
    },
  },
};

export const FormattedTicks: Story = {
  args: {
    series: QUERY_LATENCY,
    label: "Query cost vs. latency",
    size: "lg",
    gridLineCount: 3,
    yTickLabelWidth: 44,
    xTickFormatter: (x): string => `${Math.round(x)}k`,
    yTickFormatter: (y): string => `${Math.round(y)}ms`,
    xAxisTitle: "Rows scanned",
    yAxisTitle: "p95 latency",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Supply `xTickFormatter` / `yTickFormatter` to render units. Return `null` from a formatter to skip an individual tick.",
      },
    },
  },
};

export const MultipleSeries: Story = {
  args: {
    series: TWO_COHORTS,
    label: "Session depth by plan tier",
    size: "lg",
    gridLineCount: 3,
    pointOpacity: 0.75,
    showXAxisLabels: true,
    showYAxisLabels: true,
  },
  render: (args): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      <ScatterPlot {...args} />
      <Legend series={args.series} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Each series picks up the next color *and* marker shape from the default rotation, so overlapping clouds remain readable in greyscale or for color-blind viewers.",
      },
    },
  },
};

export const WithTrendLine: Story = {
  args: {
    series: QUERY_LATENCY.map((s) => ({ ...s, trendLine: true })),
    label: "Query cost vs. latency, with trend",
    size: "lg",
    gridLineCount: 3,
    showXAxisLabels: true,
    showYAxisLabels: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Set `trendLine` on a series to overlay an ordinary least-squares fit of its points, drawn dashed in the series color.",
      },
    },
  },
};

export const BubbleChart: Story = {
  args: {
    series: BUBBLE_SERIES,
    label: "Vault growth vs. read volume",
    size: "lg",
    sizeRange: [5, 22],
    pointOpacity: 0.6,
    gridLineCount: 3,
    showXAxisLabels: true,
    showYAxisLabels: true,
    showValueLabels: true,
    xAxisTitle: "Growth (%)",
    yAxisTitle: "Reads / sec",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Give points a `size` to turn the chart into a bubble chart. Values are mapped through a square-root scale onto `sizeRange`, so marker **area** — not radius — is proportional to the value.",
      },
    },
  },
};

export const QuadrantView: Story = {
  args: {
    series: [
      {
        id: "features",
        label: "Features",
        colorId: "primary",
        points: [
          { id: "sso", x: 82, y: 74, label: "SSO" },
          { id: "audit", x: 68, y: 88, label: "Audit log" },
          { id: "webhooks", x: 44, y: 62, label: "Webhooks" },
          { id: "themes", x: 26, y: 31, label: "Themes" },
          { id: "cli", x: 58, y: 24, label: "CLI" },
          { id: "mobile", x: 18, y: 79, label: "Mobile" },
        ],
      },
    ],
    label: "Feature impact vs. effort",
    size: "lg",
    xMin: 0,
    xMax: 100,
    yMin: 0,
    yMax: 100,
    pointRadius: 6,
    showValueLabels: true,
    showXAxisLabels: true,
    showYAxisLabels: true,
    xAxisTitle: "Effort",
    yAxisTitle: "Impact",
    xReferenceLines: [{ value: 50, label: "median effort" }],
    yReferenceLines: [{ value: 50, label: "median impact" }],
  },
  parameters: {
    docs: {
      description: {
        story:
          "`xReferenceLines` / `yReferenceLines` draw dashed guides at fixed domain positions — handy for turning a scatter plot into a 2x2 prioritization quadrant.",
      },
    },
  },
};

export const CustomColorsAndShapes: Story = {
  args: {
    label: "Custom colors and shapes",
    size: "lg",
    gridLineCount: 3,
    pointRadius: 5,
    series: [
      {
        id: "a",
        label: "Series A",
        color: "#ef4444",
        shape: "diamond",
        points: makeCloud(3, 18, 0.7, 30),
      },
      {
        id: "b",
        label: "Series B",
        color: "#a855f7",
        shape: "square",
        points: makeCloud(9, 18, 0.2, 40),
      },
    ],
  },
  render: (args): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      <ScatterPlot {...args} />
      <Legend series={args.series} />
    </div>
  ),
};

export const Shapes: Story = {
  args: {
    series: [],
    label: "Marker shapes",
    size: "sm",
    pointRadius: 6,
  },
  render: (args): ReactElement => (
    <div className="flex flex-wrap items-start gap-6">
      {scatterPlotShapeIds.map((shape, index) => (
        <div key={shape} className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {shape}
          </span>
          <ScatterPlot
            {...args}
            label={`Marker shape: ${shape}`}
            series={[
              {
                id: shape,
                label: shape,
                shape,
                colorId: scatterPlotColorIds[index % scatterPlotColorIds.length],
                points: makeCloud(index + 1, 14, 0.6, 40),
              },
            ]}
          />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  args: {
    series: QUERY_LATENCY,
    label: "Query cost vs. latency",
  },
  render: (args): ReactElement => (
    <div className="flex flex-col items-start gap-6">
      {scatterPlotSizeIds.map((s) => (
        <div key={s} className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">{s}</span>
          <ScatterPlot {...args} size={s} label={`Correlation (${s})`} />
        </div>
      ))}
    </div>
  ),
};

export const Empty: Story = {
  args: {
    series: [],
    label: "No results",
    size: "lg",
    emptyMessage: "No matching queries",
  },
};

export const SkipsNonFinitePoints: Story = {
  args: {
    label: "Partial data",
    size: "lg",
    showXAxisLabels: true,
    showYAxisLabels: true,
    pointRadius: 6,
    series: [
      {
        id: "partial",
        label: "Partial",
        colorId: "warning",
        points: [
          { id: "ok-1", x: 10, y: 20 },
          { id: "bad-1", x: Number.NaN, y: 40 },
          { id: "ok-2", x: 30, y: 55 },
          { id: "bad-2", x: 50, y: Number.POSITIVE_INFINITY },
          { id: "ok-3", x: 70, y: 80 },
        ],
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Points with a non-finite `x` or `y` are dropped rather than rendered at a bogus coordinate, and they don't contribute to the auto-computed domain.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    expect(canvas.getByTestId("scatter-plot-point-ok-1")).toBeInTheDocument();
    expect(canvas.getByTestId("scatter-plot-point-ok-2")).toBeInTheDocument();
    expect(canvas.getByTestId("scatter-plot-point-ok-3")).toBeInTheDocument();
    expect(canvas.queryByTestId("scatter-plot-point-bad-1")).toBeNull();
    expect(canvas.queryByTestId("scatter-plot-point-bad-2")).toBeNull();
  },
};

export const ClickablePoints: Story = {
  args: {
    label: "Click a point",
    size: "lg",
    gridLineCount: 3,
    pointRadius: 7,
    showXAxisLabels: true,
    showYAxisLabels: true,
    series: [
      {
        id: "vaults",
        label: "Vaults",
        colorId: "default",
        points: [
          { id: "billing", x: 12, y: 78, label: "billing" },
          { id: "analytics", x: 34, y: 45, label: "analytics" },
          { id: "identity", x: 48, y: 92, label: "identity" },
          { id: "catalog", x: 66, y: 30, label: "catalog" },
          { id: "telemetry", x: 81, y: 63, label: "telemetry" },
        ],
      },
    ],
  },
  render: (args): ReactElement => {
    const Interactive = (): ReactElement => {
      const [selected, setSelected] = useState<{
        seriesId: string;
        point: ScatterPlotPoint;
      } | null>(null);
      return (
        <div className="flex flex-col items-center gap-4">
          <ScatterPlot
            {...args}
            onPointClick={(point, series, event): void => {
              args.onPointClick?.(point, series, event);
              setSelected({ seriesId: series.id, point });
            }}
          />
          <p className="text-sm text-muted-foreground">
            Selected:{" "}
            <strong data-testid="selection">
              {selected
                ? `${selected.seriesId} → ${selected.point.label ?? `(${selected.point.x}, ${selected.point.y})`}`
                : "—"}
            </strong>
          </p>
        </div>
      );
    };
    return <Interactive />;
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const selection = canvas.getByTestId("selection");
    expect(selection).toHaveTextContent("—");

    await userEvent.click(canvas.getByTestId("scatter-plot-point-catalog"));
    await waitFor(() => {
      expect(selection).toHaveTextContent("vaults → catalog");
    });

    // Markers are keyboard-operable when a click handler is wired up.
    canvas.getByTestId("scatter-plot-point-identity").focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(selection).toHaveTextContent("vaults → identity");
    });
  },
};
