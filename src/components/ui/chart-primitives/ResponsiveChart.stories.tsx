import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { CHART_OTHER_COLOR, CHART_SERIES_COLORS } from "./chart-colors";
import { ChartLegend } from "./chart-legend";
import { ChartTooltip, ChartTooltipRow } from "./chart-tooltip";
import { ResponsiveChart } from "./responsive-chart";

/**
 * The visual readout. The tooltip is `aria-hidden`; screen readers hear
 * keyboard moves through the chart's live region (`role="status"`) instead.
 */
function readoutOf(canvasElement: HTMLElement): HTMLElement | null {
  return canvasElement.querySelector<HTMLElement>('[data-slot="chart-tooltip"]');
}

/** Daily uptime (%) for two services over 30 days. */
const DAYS: ReadonlyArray<{ day: number; api: number; web: number }> = Array.from(
  { length: 30 },
  (_, i) => ({
    day: i + 1,
    api: i === 11 ? 97.2 : i === 23 ? 98.9 : 99.9 - ((i * 7) % 5) / 100,
    web: i === 17 ? 96.4 : 99.95 - ((i * 3) % 4) / 100,
  }),
);

/**
 * A custom chart built from the building blocks: `ResponsiveChart` hands it
 * the container's width, the palette gives the series colours, and
 * `ChartTooltip` / `ChartTooltipRow` give it the same readout as the
 * library's charts.
 */
function UptimeStrip({ width }: { width: number }): ReactElement {
  const [active, setActive] = useState<number | null>(null);
  const height: number = 64;
  const gap: number = 2;
  const cell: number = (width - gap * (DAYS.length - 1)) / DAYS.length;
  const rows = [
    { id: "api", label: "API", color: CHART_SERIES_COLORS[0]!, y: 8 },
    { id: "web", label: "Web", color: CHART_SERIES_COLORS[1]!, y: 36 },
  ] as const;
  const day = active === null ? undefined : DAYS[active];
  return (
    <div className="relative" style={{ height }}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label="Daily uptime, last 30 days"
        onPointerLeave={(): void => setActive(null)}
      >
        {DAYS.map((d, index) =>
          rows.map((row) => {
            const value: number = d[row.id];
            return (
              <rect
                key={`${row.id}-${d.day}`}
                x={index * (cell + gap)}
                y={row.y}
                width={Math.max(0, cell)}
                height={20}
                rx={3}
                style={{ fill: value < 99.5 ? row.color : CHART_OTHER_COLOR }}
                opacity={active === null || active === index ? 1 : 0.4}
                onPointerEnter={(): void => setActive(index)}
              />
            );
          }),
        )}
      </svg>
      {day && active !== null ? (
        <ChartTooltip
          x={active * (cell + gap) + cell / 2}
          y={8}
          containerWidth={width}
        >
          <div className="mb-0.5 text-muted-foreground">Day {day.day}</div>
          {rows.map((row) => (
            <ChartTooltipRow
              key={row.id}
              value={`${day[row.id].toFixed(2)}%`}
              label={row.label}
              color={row.color}
            />
          ))}
        </ChartTooltip>
      ) : null}
    </div>
  );
}

const meta = {
  title: "Charts & Graphs/ResponsiveChart",
  component: ResponsiveChart,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The building block behind every chart's `width=\"auto\"`, for custom charts: `<ResponsiveChart height={…}>{(width) => …}</ResponsiveChart>` measures its container with a `ResizeObserver` and calls its children with the width, again on every resize. Until the first measurement (the server render and the first client render) it is an empty box at `height`, so nothing is drawn at a guessed width and hydration stays clean. `useMeasuredWidth(fallbackWidth)` is the hook underneath. Pair it with `ChartTooltip` / `ChartTooltipRow`, `ChartLegend` and the palette (`CHART_SERIES_COLORS`, `getChartColorClasses`) to match the library's charts.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    height: 64,
    children: (width: number): ReactElement => <UptimeStrip width={width} />,
  },
  render: (args): ReactElement => (
    <div className="w-full max-w-3xl rounded-lg border bg-card p-4">
      <p className="mb-2 text-sm font-medium">Daily uptime, last 30 days</p>
      <ChartLegend
        className="mb-3"
        items={[
          { id: "api", label: "API (below 99.5%)", paint: { colorId: "chart-1" }, swatch: "square" },
          { id: "web", label: "Web (below 99.5%)", paint: { colorId: "chart-2" }, swatch: "square" },
          { id: "ok", label: "99.5% or better", paint: { colorId: "other" }, swatch: "square" },
        ]}
      />
      <ResponsiveChart {...args} />
    </div>
  ),
} satisfies Meta<typeof ResponsiveChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomChart: Story = {
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const container = canvasElement.querySelector<HTMLElement>(
      '[data-slot="responsive-chart"]',
    )!;
    await waitFor(() => {
      expect(container).toHaveAttribute("data-measured", "true");
    });
    const svg = canvas.getByRole("img", { name: "Daily uptime, last 30 days" });
    expect(Number(svg.getAttribute("width"))).toBe(container.clientWidth);

    await userEvent.hover(svg.querySelectorAll("rect")[24]!);
    await waitFor(() => {
      expect(readoutOf(canvasElement)).toHaveTextContent("Day 13");
    });
  },
};
