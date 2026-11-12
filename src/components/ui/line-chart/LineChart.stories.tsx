import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  LineChart,
  lineChartSizeIds,
  lineChartCurveIds,
  type LineChartPoint,
  type LineChartSeries,
} from "./line-chart";

/**
 * The visual readout. The tooltip is `aria-hidden`; screen readers hear
 * keyboard moves through the chart's live region (`role="status"`) instead.
 */
function readoutOf(canvasElement: HTMLElement): HTMLElement | null {
  return canvasElement.querySelector<HTMLElement>('[data-slot="chart-tooltip"]');
}

const meta = {
  title: "Charts & Graphs/LineChart",
  component: LineChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "SVG line chart for trend data. Plots one or more named series sharing a single x/y domain. Series take the chart palette in slot order (`--chart-1` …, never cycled; pass `seriesOrder` so colour follows the series id), with a legend for two or more. A crosshair snaps to the nearest x and one readout lists every series there, on hover or with the arrow keys. Also: `width=\"auto\"`, `formatX` / `formatY`, point markers, gaps (`y: NaN`), smoothing, area fills, gridlines, reference lines (`xReferenceLines` for e.g. a \"today\" marker, `yReferenceLines` for a target or threshold), and `onPointClick` handlers.",
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
    showYAxisLabels: { control: { type: "boolean" } },
    yTickCount: { control: { type: "number", min: 2, max: 10, step: 1 } },
    yTickLabelWidth: { control: { type: "number", min: 16, max: 96, step: 1 } },
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
    yTickCount: 5,
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
  play: async ({ canvasElement }): Promise<void> => {
    const seriesGroup = canvasElement.querySelector(
      '[data-slot="line-chart-series"]',
    );
    const areaPath = seriesGroup?.querySelector('path[fill^="url("]');
    const linePath = seriesGroup?.querySelector('path[fill="none"]');
    const lineD: string = linePath?.getAttribute("d") ?? "";

    // The fill's top edge must trace the smoothed stroke, not straight lines.
    await expect(lineD).toContain(" C ");
    await expect(areaPath?.getAttribute("d")).toContain(lineD);
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

export const WithYAxisLabels: Story = {
  args: {
    series: SINGLE_SERIES,
    categories: WEEK_LABELS,
    size: "lg",
    showPoints: true,
    showYAxisLabels: true,
    gridLineCount: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Set `showYAxisLabels` to render raw value ticks along the y-axis. The chart reserves a left gutter automatically — adjust with `yTickLabelWidth` if your labels need more room.",
      },
    },
  },
};

export const FormattedYAxisLabels: Story = {
  args: {
    size: "lg",
    showPoints: true,
    gridLineCount: 3,
    categories: WEEK_LABELS,
    yTickCount: 5,
    yTickLabelWidth: 44,
    yTickFormatter: (value): string =>
      value >= 1000
        ? `$${(value / 1000).toFixed(1)}k`
        : `$${Math.round(value)}`,
    series: [
      {
        id: "revenue",
        label: "Daily revenue",
        area: true,
        points: [
          { y: 1240 },
          { y: 1380 },
          { y: 1620 },
          { y: 1180 },
          { y: 2040 },
          { y: 2310 },
          { y: 2580 },
        ],
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass a `yTickFormatter` to render currency, percentages, or any other y-axis unit. The default tick set spans the full y domain (`yMin` -> `yMax`) and includes both endpoints.",
      },
    },
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
  parameters: {
    docs: {
      description: {
        story:
          "Series take palette slots 1, 2, 3 … in order, and two or more series get a legend whose keys mirror the mark (a short line).",
      },
    },
  },
};

const HOUR_MS: number = 3_600_000;
const DAY_START_UTC: number = Date.UTC(2026, 8, 24);
const TIME_FORMAT: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

/** A tick every four hours, on the hour. */
const FOUR_HOURLY_TICKS: ReadonlyArray<number> = Array.from(
  { length: 7 },
  (_, i): number => DAY_START_UTC + i * 4 * HOUR_MS,
);

const REQUESTS_BY_HOUR: ReadonlyArray<LineChartSeries> = [
  {
    id: "requests",
    label: "Requests",
    points: Array.from({ length: 24 }, (_, hour): LineChartPoint => ({
      x: DAY_START_UTC + hour * HOUR_MS,
      y: Math.round(1_200 + 900 * Math.sin((hour - 6) / 3.8) + (hour % 5) * 70),
    })),
  },
  {
    id: "errors",
    label: "Errors × 10",
    points: Array.from({ length: 24 }, (_, hour): LineChartPoint => ({
      x: DAY_START_UTC + hour * HOUR_MS,
      y: hour === 14 || hour === 15 ? Number.NaN : 200 + ((hour * 37) % 160),
    })),
  },
];

export const Crosshair: Story = {
  args: {
    series: MULTI_SERIES,
    categories: WEEK_LABELS,
    size: "lg",
    showYAxisLabels: true,
    gridLineCount: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Move the pointer anywhere over the plot: a vertical crosshair snaps to the nearest x, a dot marks every series there, and one readout lists them all (value first, series second). Focus the chart with Tab and use the left / right arrow keys (Home / End, Escape) for the same readout.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const chart = canvas.getByRole("img", { name: "Sample metrics" });

    chart.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => {
      const readout = readoutOf(canvasElement);
      expect(readout).toHaveTextContent("Mon");
      expect(readout).toHaveTextContent("320Active users");
      expect(readout).toHaveTextContent("40New signups");
      expect(readout).toHaveTextContent("18Churned");
      expect(canvas.getByRole("status")).toHaveTextContent(
        "Mon: Active users 320, New signups 40, Churned 18",
      );
    });
    await userEvent.keyboard("{End}");
    await waitFor(() => {
      expect(readoutOf(canvasElement)).toHaveTextContent("Sun");
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(readoutOf(canvasElement)).toBeNull();
    });

    // The pointer only has to be near an x, not on a line.
    const bounds = chart.getBoundingClientRect();
    await userEvent.pointer({
      target: chart,
      coords: {
        clientX: bounds.left + bounds.width * 0.52,
        clientY: bounds.top + 10,
      },
    });
    await waitFor(() => {
      expect(readoutOf(canvasElement)).toHaveTextContent("Thu");
    });
  },
};

export const TimeAxis: Story = {
  args: {
    series: REQUESTS_BY_HOUR,
    size: "xl",
    showYAxisLabels: true,
    xTickValues: FOUR_HOURLY_TICKS,
    formatX: (x: number): string => TIME_FORMAT.format(x),
    formatY: (y: number): string => y.toLocaleString("en-US"),
    yTickLabelWidth: 44,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`formatX` formats the x-axis ticks and the readout heading, so a timestamp axis reads as times rather than epoch milliseconds; `formatY` does the same for values, and y ticks land on round numbers. `xTickValues` puts the x ticks on whole hours. A gap (`NaN`) shows as a dash in the readout.",
      },
    },
  },
};

const DAY_MS: number = 24 * HOUR_MS;
const SPRINT_START_UTC: number = Date.UTC(2026, 10, 2);
/** "Today" for the story: fixed, so the render is the same every day. */
const SPRINT_TODAY_UTC: number = SPRINT_START_UTC + 8.5 * DAY_MS;
const DATE_FORMAT: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const ACTUAL_OPEN_ISSUES: ReadonlyArray<number> = [
  96, 91, 88, 80, 77, 71, 64, 60, 52,
];

const BURNDOWN: ReadonlyArray<LineChartSeries> = [
  {
    id: "actual",
    label: "Actual",
    points: ACTUAL_OPEN_ISSUES.map(
      (y, day): LineChartPoint => ({ x: SPRINT_START_UTC + day * DAY_MS, y }),
    ),
  },
  {
    id: "forecast",
    label: "Forecast",
    color: "other",
    strokeDasharray: "5 4",
    points: [52, 44, 35, 27, 18, 9, 0].map(
      (y, i): LineChartPoint => ({
        x: SPRINT_START_UTC + (i + 8) * DAY_MS,
        y,
      }),
    ),
  },
];

export const TodayLine: Story = {
  args: {
    label: "Open issues this sprint",
    series: BURNDOWN,
    size: "xl",
    yMin: 0,
    showYAxisLabels: true,
    gridLineCount: 3,
    xTickValues: Array.from(
      { length: 8 },
      (_, i): number => SPRINT_START_UTC + i * 2 * DAY_MS,
    ),
    formatX: (x: number): string => DATE_FORMAT.format(x),
    xReferenceLines: [{ value: SPRINT_TODAY_UTC, label: "Today" }],
  },
  parameters: {
    docs: {
      description: {
        story:
          "`xReferenceLines` draws a dashed vertical rule at any x in domain units, with an optional label: pass `Date.now()` on a timestamp axis for a \"today\" line between actuals and a forecast. The value need not match a data point. In categorical mode it is a point index (fractions allowed). Restyle a line with `className` / `strokeDasharray`; a line outside the x domain is not drawn.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const svg = canvasElement.querySelector<SVGSVGElement>(
      '[data-slot="line-chart"] svg',
    )!;
    const group = svg.querySelector(
      '[data-slot="line-chart-x-reference-lines"]',
    )!;
    const rule = group.querySelector("line")!;
    const labelText = group.querySelector("text")!;
    expect(labelText).toHaveTextContent("Today");

    // The rule is vertical and sits between the ninth and tenth day's points.
    expect(rule.getAttribute("x1")).toBe(rule.getAttribute("x2"));
    const x: number = Number(rule.getAttribute("x1"));
    const actualPath: string =
      svg
        .querySelector('[data-series-id="actual"] path')
        ?.getAttribute("d") ?? "";
    const forecastPath: string =
      svg
        .querySelector('[data-series-id="forecast"] path')
        ?.getAttribute("d") ?? "";
    const xsOf = (d: string): number[] =>
      Array.from(d.matchAll(/[ML] (-?[\d.]+) /g), (m) => Number(m[1]));
    const lastActualX: number = xsOf(actualPath).at(-1)!;
    const secondForecastX: number = xsOf(forecastPath)[1]!;
    expect(x).toBeGreaterThan(lastActualX);
    expect(x).toBeLessThan(secondForecastX);
    expect(x - lastActualX).toBeCloseTo(secondForecastX - x, 0);

    // Screen readers get it through the table view's caption.
    expect(
      canvasElement.querySelector('[data-slot="chart-data-table"] caption'),
    ).toHaveTextContent("Open issues this sprint (Today at Nov 10)");
  },
};

export const ReferenceLinesOnCategories: Story = {
  args: {
    series: SINGLE_SERIES,
    categories: WEEK_LABELS,
    size: "lg",
    showPoints: true,
    xReferenceLines: [
      { value: 1, label: "v2.4 deployed" },
      {
        value: 4.5,
        label: "Weekend",
        strokeDasharray: "none",
        className: "stroke-destructive",
        labelClassName: "fill-destructive",
      },
      // Outside the x domain (0 – 6): not drawn.
      { value: 9, label: "Next week" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Without explicit `x` values, a reference line's `value` is a point index: `1` lands on Tue, `4.5` halfway between Fri and Sat. A label past the middle of the plot hangs to the left of its line so it stays inside the chart.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const lines = canvasElement.querySelectorAll(
      '[data-slot="line-chart-x-reference-line"]',
    );
    expect(lines).toHaveLength(2);
    expect(lines[0]!.querySelector("text")).toHaveAttribute(
      "text-anchor",
      "start",
    );
    expect(lines[1]!.querySelector("text")).toHaveAttribute(
      "text-anchor",
      "end",
    );
  },
};

export const TargetAndThresholdLines: Story = {
  args: {
    label: "p95 latency this week",
    categories: WEEK_LABELS,
    size: "lg",
    showPoints: true,
    yMin: 0,
    yMax: 400,
    formatY: (y: number): string => `${y} ms`,
    yTickLabelWidth: 48,
    series: [
      {
        id: "latency",
        label: "p95 latency",
        points: [
          { y: 182 },
          { y: 204 },
          { y: 240 },
          { y: 318 },
          { y: 210 },
          { y: 140 },
          { y: 120 },
        ],
      },
    ],
    yReferenceLines: [
      { value: 200, label: "Target · 200 ms" },
      {
        value: 300,
        label: "SLO · 300 ms",
        className: "stroke-destructive",
        labelClassName: "fill-destructive",
      },
      // At the top of the plot: its label hangs below the line.
      { value: 400, label: "Timeout" },
      // Outside the y domain (0 – 400): not drawn.
      { value: 1_000, label: "Hard limit" },
    ],
    xReferenceLines: [{ value: 3, label: "Incident" }],
  },
  parameters: {
    docs: {
      description: {
        story:
          "`yReferenceLines` draws dashed horizontal rules at fixed y values, labelled at the right end: a target, an SLO, an average. The y domain is not stretched to reach a line, so set `yMin` / `yMax` when the data may not get there. It combines with `xReferenceLines`.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const svg = canvasElement.querySelector<SVGSVGElement>(
      '[data-slot="line-chart"] svg',
    )!;
    const lines = svg.querySelectorAll(
      '[data-slot="line-chart-y-reference-line"]',
    );
    expect(lines).toHaveLength(3);

    // Each rule is horizontal and sits on its y-axis tick's height.
    const tickYOf = (text: string): number => {
      const tick = Array.from(
        svg.querySelectorAll('[data-slot="line-chart-y-ticks"] text'),
      ).find((el) => el.textContent === text)!;
      return Number(tick.getAttribute("y"));
    };
    const target = lines[0]!.querySelector("line")!;
    expect(target.getAttribute("y1")).toBe(target.getAttribute("y2"));
    expect(Number(target.getAttribute("y1"))).toBeCloseTo(tickYOf("200 ms"), 5);
    expect(
      Number(lines[1]!.querySelector("line")!.getAttribute("y1")),
    ).toBeCloseTo(tickYOf("300 ms"), 5);

    // Labels sit above their line, except at the top edge of the plot.
    expect(lines[0]!.querySelector("text")).toHaveAttribute(
      "dominant-baseline",
      "auto",
    );
    expect(lines[2]!.querySelector("text")).toHaveAttribute(
      "dominant-baseline",
      "hanging",
    );

    expect(
      canvasElement.querySelector('[data-slot="chart-data-table"] caption'),
    ).toHaveTextContent(
      "p95 latency this week (Incident at Thu, Target · 200 ms at 200 ms, SLO · 300 ms at 300 ms, Timeout at 400 ms)",
    );
  },
};

const MONTH_MS: number = 30 * DAY_MS;
/** "Today" for the story: fixed, so the render is the same every day. */
const NET_WORTH_TODAY_UTC: number = Date.UTC(2026, 10, 12);
const LONG_DATE_FORMAT: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const USD_FORMAT: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const NET_WORTH_ACTUALS: ReadonlyArray<number> = [
  18_240, 19_105, 19_870, 20_412, 21_890, 22_604, 23_950, 24_710, 25_985,
  27_120, 28_430, 29_749.3,
];
const NET_WORTH_FORECAST: ReadonlyArray<number> = [
  29_749.3, 30_900, 32_050, 33_200, 34_350, 35_500, 36_650,
];
const NET_WORTH: ReadonlyArray<LineChartSeries> = [
  {
    id: "actual",
    label: "Net Worth",
    points: NET_WORTH_ACTUALS.map(
      (y, i): LineChartPoint => ({
        x: NET_WORTH_TODAY_UTC - (NET_WORTH_ACTUALS.length - 1 - i) * MONTH_MS,
        y,
      }),
    ),
  },
  {
    id: "forecast",
    label: "Forecast",
    color: "other",
    strokeDasharray: "5 4",
    points: NET_WORTH_FORECAST.map(
      (y, i): LineChartPoint => ({ x: NET_WORTH_TODAY_UTC + i * MONTH_MS, y }),
    ),
  },
];

/**
 * Regression: the hidden table view must not widen a phone-width page. Its
 * caption runs on one unwrapped line (`sr-only` sets `white-space: nowrap`),
 * and a `<table>` never renders narrower than its content, so it has to be
 * clipped by a wrapper that does honour `width: 1px` and `overflow: hidden`.
 */
export const ReferenceLinesOnAPhone: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  args: {
    label: "Net Worth over time, with the forecast ahead",
    series: NET_WORTH,
    width: "auto",
    height: 200,
    showYAxisLabels: true,
    yTickLabelWidth: 52,
    formatX: (x: number): string => LONG_DATE_FORMAT.format(x),
    formatY: (y: number): string => USD_FORMAT.format(y),
    xReferenceLines: [
      {
        value: NET_WORTH_TODAY_UTC,
        label: `Today · ${USD_FORMAT.format(29_749.3)}`,
      },
    ],
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "On a 320px phone, a chart with a long label and a labelled reference line still fits the page: its table view (caption included) is clipped out of the layout, so the page never scrolls sideways, while screen readers still read the whole table.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(
        canvasElement.querySelector('[data-slot="chart-data-table"]'),
      ).not.toBeNull();
    });

    // The caption is far wider than the phone once unwrapped…
    const caption = canvasElement.querySelector(
      '[data-slot="chart-data-table"] caption',
    )!;
    expect(caption).toHaveTextContent(
      "Net Worth over time, with the forecast ahead (Today · $29,749.30 at Nov 12, 2026)",
    );

    // …but the page does not scroll sideways.
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );

    // The table is still in the accessibility tree, named by its caption.
    expect(
      canvas.getByRole("table", {
        name: /^Net Worth over time, with the forecast ahead \(Today/,
      }),
    ).toBeInTheDocument();
  },
};

export const FillsContainer: Story = {
  args: {
    series: REQUESTS_BY_HOUR,
    width: "auto",
    height: 240,
    showYAxisLabels: true,
    xTickValues: FOUR_HOURLY_TICKS,
    formatX: (x: number): string => TIME_FORMAT.format(x),
    formatY: (y: number): string => y.toLocaleString("en-US"),
    yTickLabelWidth: 44,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "`width=\"auto\"` fills the card and follows it as the window resizes. The server render (and the first client render) is an empty box at the chart's height: no guessed width and no tick labels formatted in the server's time zone.",
      },
    },
  },
  render: (args): ReactElement => (
    <div className="w-full max-w-4xl rounded-lg border bg-card p-4">
      <p className="mb-3 text-sm font-medium">Traffic today (UTC)</p>
      <LineChart {...args} />
    </div>
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const root = canvasElement.querySelector<HTMLElement>(
      '[data-slot="line-chart"]',
    )!;
    await waitFor(() => {
      expect(root.querySelector("svg")).not.toBeNull();
    });
    const svg = root.querySelector("svg")!;
    expect(Math.abs(svg.getBoundingClientRect().width - root.clientWidth)).toBeLessThanOrEqual(1);
  },
};

const ALL_REGIONS: ReadonlyArray<LineChartSeries> = [
  { id: "us-east", label: "us-east", points: [{ y: 42 }, { y: 48 }, { y: 45 }, { y: 51 }, { y: 58 }, { y: 55 }, { y: 61 }] },
  { id: "eu-west", label: "eu-west", points: [{ y: 30 }, { y: 34 }, { y: 39 }, { y: 36 }, { y: 41 }, { y: 44 }, { y: 43 }] },
  { id: "ap-south", label: "ap-south", points: [{ y: 18 }, { y: 16 }, { y: 22 }, { y: 27 }, { y: 25 }, { y: 29 }, { y: 33 }] },
  { id: "sa-east", label: "sa-east", points: [{ y: 9 }, { y: 12 }, { y: 11 }, { y: 14 }, { y: 13 }, { y: 17 }, { y: 16 }] },
];

export const StableColorsWhenFiltering: Story = {
  args: {
    series: ALL_REGIONS,
    categories: WEEK_LABELS,
    size: "lg",
    showYAxisLabels: true,
    seriesOrder: ALL_REGIONS.map((s) => s.id),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Colour follows the series, not its position: pass the full, unfiltered `seriesOrder`, and toggling a region off leaves the others their colours.",
      },
    },
  },
  render: (args): ReactElement => {
    const Filterable = (): ReactElement => {
      const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set());
      return (
        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-wrap gap-2">
            {ALL_REGIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={!hidden.has(s.id)}
                onClick={(): void => {
                  const next = new Set(hidden);
                  if (next.has(s.id)) next.delete(s.id);
                  else next.add(s.id);
                  setHidden(next);
                }}
                className="rounded-md border px-2 py-1 text-xs aria-pressed:bg-muted"
              >
                {s.label}
              </button>
            ))}
          </div>
          <LineChart
            {...args}
            series={ALL_REGIONS.filter((s) => !hidden.has(s.id))}
          />
        </div>
      );
    };
    return <Filterable />;
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const strokeOf = (id: string): string | null =>
      canvasElement
        .querySelector(`[data-series-id="${id}"] path:not([fill^="url"])`)
        ?.getAttribute("class") ?? null;
    const before: string | null = strokeOf("ap-south");
    expect(before).toContain("--chart-3");

    await userEvent.click(canvas.getByRole("button", { name: "eu-west" }));
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-series-id="eu-west"]')).toBeNull();
    });
    expect(strokeOf("ap-south")).toBe(before);
  },
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
        points: SINGLE_SERIES[0]!.points,
      },
      {
        id: "forecast",
        label: "Forecast",
        color: "other",
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
