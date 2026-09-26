import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import {
  ScatterPlot,
  scatterPlotColorIds,
  scatterPlotShapeIds,
  scatterPlotSizeIds,
  scatterPlotYScaleIds,
  type ScatterPlotPoint,
  type ScatterPlotSeries,
} from "./scatter-plot";

/**
 * The visual readout. The tooltip is `aria-hidden`; screen readers hear
 * keyboard moves through the chart's live region (`role="status"`) instead.
 */
function readoutOf(canvasElement: HTMLElement): HTMLElement | null {
  return canvasElement.querySelector<HTMLElement>('[data-slot="chart-tooltip"]');
}

const meta = {
  title: "Charts & Graphs/ScatterPlot",
  component: ScatterPlot,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "SVG scatter / bubble chart for correlating two numeric dimensions. Hover reads out the nearest point within 24px (no need to land on the dot), and the arrow keys walk the points left to right. Series take palette slots 1–3 (no four hues stay distinguishable when every pair can sit side by side, so a fourth series is grey) plus rotating marker shapes, so identity never rests on colour alone. Also: `width=\"auto\"`, `formatX` / `formatY` (a time axis reads as times), `yScale=\"log\"` with decade ticks, per-point `group`s that fade the rest on hover, reference lines drawn above the points, bubble sizing, trend lines, and `onPointClick` handlers.",
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
    yScale: {
      options: scatterPlotYScaleIds,
      control: { type: "radio" },
    },
    width: { control: { type: "number" } },
    height: { control: { type: "number" } },
  },
  args: {
    label: "Sample correlation",
    size: "md",
    pointRadius: 4,
    pointOpacity: 0.8,
    showAxis: true,
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
    points: makeCloud(7, 40, 0.6, 40),
  },
];

const TWO_COHORTS: ReadonlyArray<ScatterPlotSeries> = [
  {
    id: "free",
    label: "Free tier",
    points: makeCloud(11, 30, 0.3, 30),
  },
  {
    id: "pro",
    label: "Pro tier",
    points: makeCloud(23, 30, 0.8, 30),
  },
  {
    id: "enterprise",
    label: "Enterprise",
    points: makeCloud(41, 20, 0.5, 60),
  },
];

const BUBBLE_SERIES: ReadonlyArray<ScatterPlotSeries> = [
  {
    id: "vaults",
    label: "Vaults",
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
  parameters: {
    docs: {
      description: {
        story:
          "Each series picks up the next palette slot *and* marker shape, and two or more series get a legend whose swatches are the marker shapes, so overlapping clouds remain readable in greyscale or for color-blind viewers.",
      },
    },
  },
};

const TRACE_WINDOW_START: number = Date.UTC(2026, 8, 24, 14, 0, 0);
const MINUTE_MS: number = 60_000;
const CLOCK: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "UTC",
});
const CLOCK_TICK: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

function formatDuration(ms: number): string {
  if (ms >= 1_000) return `${(ms / 1_000).toFixed(ms >= 10_000 ? 0 : 1)} s`;
  return `${Math.round(ms)} ms`;
}

const OPERATIONS: ReadonlyArray<{ name: string; typicalMs: number }> = [
  { name: "GET /api/session", typicalMs: 8 },
  { name: "POST /api/auth/login", typicalMs: 90 },
  { name: "SELECT users", typicalMs: 3 },
  { name: "POST /api/auth/reset-password/confirm", typicalMs: 240 },
  { name: "GET /api/vaults/:id", typicalMs: 35 },
];

/** An hour of request traces: start time across, duration up, one group per operation. */
function makeTraces(count: number, seed: number): ScatterPlotPoint[] {
  const rng = makeRng(seed);
  return Array.from({ length: count }, (_, i): ScatterPlotPoint => {
    const operation = OPERATIONS[Math.floor(rng() * OPERATIONS.length)]!;
    // Log-normal-ish spread around the operation's typical duration, with
    // the odd zero (sub-millisecond) and a rare slow outlier.
    const spread: number = Math.exp((rng() + rng() + rng() - 1.5) * 1.6);
    const outlier: number = rng() < 0.01 ? 25 : 1;
    const duration: number =
      operation.typicalMs < 5 && rng() < 0.15
        ? 0
        : Math.round(operation.typicalMs * spread * outlier);
    return {
      id: `trace-${seed}-${i}`,
      x: TRACE_WINDOW_START + Math.round(rng() * 60 * MINUTE_MS),
      y: duration,
      group: operation.name,
    };
  });
}

const TRACE_TICKS: ReadonlyArray<number> = Array.from(
  { length: 7 },
  (_, i): number => TRACE_WINDOW_START + i * 10 * MINUTE_MS,
);

const TRACES: ReadonlyArray<ScatterPlotSeries> = [
  { id: "traces", label: "Traces", points: makeTraces(600, 17) },
];

export const TimeAxisLogScale: Story = {
  args: {
    series: TRACES,
    label: "Trace durations over the last hour",
    size: "xl",
    yScale: "log",
    pointOpacity: 0.7,
    xTickValues: TRACE_TICKS,
    formatX: (x: number): string => CLOCK.format(x),
    xTickFormatter: (x: number): string => CLOCK_TICK.format(x),
    formatY: formatDuration,
    yTickLabelWidth: 44,
    yReferenceLines: [
      { value: 30, label: "p50 · 30 ms" },
      { value: 480, label: "p95 · 480 ms" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Durations over time on a log scale: ticks at whole decades, zero durations on the bottom one. Hover near a trace (within 24px) to read it: its duration, its start time formatted by `formatX` (not epoch milliseconds) and its operation; the other operations fade so the hovered one's spread stands out. Reference lines sit above the points, labelled on a halo.",
      },
    },
  },
  // Points are read out, not clicked: the chart is one tab stop.
  render: ({ onPointClick: _onPointClick, ...args }): ReactElement => (
    <ScatterPlot {...args} />
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const chart = canvas.getByRole("img", {
      name: "Trace durations over the last hour",
    });

    chart.focus();
    await userEvent.keyboard("{Home}");
    await waitFor(() => {
      const readout = readoutOf(canvasElement);
      // A formatted time, never the raw epoch number.
      expect(readout).toHaveTextContent(/2:00:\d\d PM/);
      expect(readout?.textContent ?? "").not.toMatch(/\d{10,}/);
      expect(readout).toHaveTextContent(/ms|s/);
    });

    // Other operations fade while one is read out; its own stay opaque.
    const opacities: number[] = Array.from(
      canvasElement.querySelectorAll('[data-slot="scatter-plot-points"] path'),
      (point) => Number(getComputedStyle(point).fillOpacity),
    );
    expect(opacities.filter((o) => o <= 0.12).length).toBeGreaterThan(0);
    expect(opacities.filter((o) => o > 0.5).length).toBeGreaterThan(0);
  },
};

export const NearestPointReadout: Story = {
  args: {
    series: [
      {
        id: "features",
        label: "Features",
        points: [
          { id: "sso", x: 82, y: 74, label: "SSO" },
          { id: "audit", x: 68, y: 88, label: "Audit log" },
          { id: "themes", x: 26, y: 31, label: "Themes" },
        ],
      },
    ],
    label: "Feature impact vs. effort",
    size: "lg",
    xMin: 0,
    xMax: 100,
    yMin: 0,
    yMax: 100,
    showXAxisLabels: true,
    showYAxisLabels: true,
    xAxisTitle: "Effort",
    yAxisTitle: "Impact",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The pointer need not land on a dot: the nearest point within `hitRadius` (24px) is read out and ringed.",
      },
    },
  },
  render: ({ onPointClick: _onPointClick, ...args }): ReactElement => (
    <ScatterPlot {...args} />
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const chart = canvas.getByRole("img", { name: "Feature impact vs. effort" });
    const themes = canvasElement.querySelector(
      '[data-testid="scatter-plot-point-themes"]',
    )!;
    const box = themes.getBoundingClientRect();
    // 14px right of the dot's centre: a miss for the dot, a hit for the readout.
    await userEvent.pointer({
      target: chart,
      coords: {
        clientX: box.left + box.width / 2 + 14,
        clientY: box.top + box.height / 2,
      },
    });
    await waitFor(() => {
      expect(readoutOf(canvasElement)).toHaveTextContent("Themes");
    });
  },
};

export const DensePoints: Story = {
  args: {
    series: [
      { id: "traces", label: "Traces", points: makeTraces(5_000, 29) },
    ],
    label: "5,000 traces",
    size: "xl",
    yScale: "log",
    pointRadius: 3,
    pointOpacity: 0.5,
    xTickValues: TRACE_TICKS,
    xTickFormatter: (x: number): string => CLOCK_TICK.format(x),
    formatX: (x: number): string => CLOCK.format(x),
    formatY: formatDuration,
    yTickLabelWidth: 44,
  },
  parameters: {
    docs: {
      description: {
        story:
          "5,000 points stay smooth under the pointer: the points layer is memoized, so a pointer move re-renders only the readout (a linear nearest-point scan is fast at this size).",
      },
    },
  },
  render: ({ onPointClick: _onPointClick, ...args }): ReactElement => (
    <ScatterPlot {...args} />
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const chart = canvas.getByRole("img", { name: "5,000 traces" });
    const points = canvasElement.querySelector(
      '[data-slot="scatter-plot-points"]',
    )!;
    expect(points.querySelectorAll("path").length).toBe(5_000);

    // Moving the pointer changes the readout but never touches the points.
    let mutations: number = 0;
    const observer = new MutationObserver((records) => {
      mutations += records.length;
    });
    observer.observe(points, {
      subtree: true,
      attributes: true,
      childList: true,
    });
    const bounds = chart.getBoundingClientRect();
    for (let step = 1; step <= 8; step += 1) {
      await userEvent.pointer({
        target: chart,
        coords: {
          clientX: bounds.left + (bounds.width * step) / 9,
          clientY: bounds.top + bounds.height * 0.6,
        },
      });
    }
    await waitFor(() => {
      expect(readoutOf(canvasElement)).toBeInTheDocument();
    });
    observer.disconnect();
    expect(mutations).toBe(0);
  },
};

export const FillsContainer: Story = {
  args: {
    series: TWO_COHORTS,
    label: "Session depth by plan tier",
    width: "auto",
    height: 280,
    showXAxisLabels: true,
    showYAxisLabels: true,
    xAxisTitle: "Sessions",
    yAxisTitle: "Depth",
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "`width=\"auto\"` fills the card and redraws on resize; until it is measured it is an empty box at its height.",
      },
    },
  },
  render: ({ onPointClick: _onPointClick, ...args }): ReactElement => (
    <div className="w-full max-w-3xl rounded-lg border bg-card p-4">
      <ScatterPlot {...args} />
    </div>
  ),
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
