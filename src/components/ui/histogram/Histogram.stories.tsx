import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { chartColorIds } from "@/components/ui/chart-primitives/chart-colors";

import { binValues, type HistogramBucket } from "./bin-values";
import { Histogram } from "./histogram";

/**
 * The visual readout. The tooltip is `aria-hidden`; screen readers hear
 * keyboard moves through the chart's live region (`role="status"`) instead.
 */
function readoutOf(canvasElement: HTMLElement): HTMLElement | null {
  return canvasElement.querySelector<HTMLElement>('[data-slot="chart-tooltip"]');
}

/**
 * 1,000 request durations (ms) shaped like a real trace sample: median
 * ~30 ms, p95 ~500 ms, a long tail out to ~4 s.
 */
const DURATIONS_MS: ReadonlyArray<number> = Array.from(
  { length: 1_000 },
  (_, i): number => {
    const u: number = i / 999;
    if (u <= 0.5) return Math.round((u / 0.5) * 30);
    if (u <= 0.95) return Math.round(30 + ((u - 0.5) / 0.45) * 469);
    return Math.round(500 + ((u - 0.95) / 0.05) ** 2 * 3_470);
  },
);

function formatMs(ms: number): string {
  if (ms >= 1_000) return `${(ms / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 })} s`;
  return `${ms.toLocaleString("en-US")} ms`;
}

const LINEAR_BUCKETS: HistogramBucket[] = binValues(DURATIONS_MS, {
  minBinWidth: 1,
});
const LOG_BUCKETS: HistogramBucket[] = binValues(DURATIONS_MS, {
  scale: "log",
  minBinWidth: 1,
});

const meta = {
  title: "Charts & Graphs/Histogram",
  component: Histogram,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A histogram: the counts of adjacent ranges of one quantity. It takes pre-binned `buckets` (`{ lower, upper, count }`, with `upper: null` for an open-ended overflow bucket); `binValues(values, { scale, minBinWidth })` makes them from raw values, with nice linear widths (folding a long tail past the p95 into one overflow bucket) or 1-2-5 log edges.\n\nUnlike `BarChart`, the x-axis is continuous: bars touch (a 2px surface gap between them), labels sit on the bucket edges (thinned to ~52px apart), and a count axis with nice ticks runs up the side. The tallest bar carries its count; the overflow bucket is grey with a caption. Hover or the arrow keys read out a bucket's range, count and share, and a visually hidden table lists every bucket. It fills its container by default (`width=\"auto\"`).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    color: { options: chartColorIds, control: { type: "select" } },
    overflowColor: { options: chartColorIds, control: { type: "select" } },
  },
  args: {
    label: "Request durations",
    buckets: LINEAR_BUCKETS,
    height: 240,
    formatBoundary: formatMs,
    countNoun: { singular: "request", plural: "requests" },
  },
  render: (args): ReactElement => (
    <div className="w-full max-w-3xl rounded-lg border bg-card p-4">
      <p className="mb-3 text-sm font-medium">Request durations</p>
      <Histogram {...args} />
    </div>
  ),
} satisfies Meta<typeof Histogram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "1,000 requests binned linearly: about 25 bins of 20 ms up to 500 ms, then one grey bar gathering the slowest 5%, so the tail doesn't squash everything into one tall bar at 0.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const chart = canvas.getByRole("img", { name: "Request durations" });

    chart.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => {
      const readout = readoutOf(canvasElement);
      expect(readout).toHaveTextContent("325 requests");
      expect(readout).toHaveTextContent("32.5%");
      expect(readout).toHaveTextContent("0 ms – 20 ms");
      expect(canvas.getByRole("status")).toHaveTextContent(
        "0 ms – 20 ms: 325 requests, 32.5%",
      );
    });
    await userEvent.keyboard("{End}");
    await waitFor(() => {
      expect(readoutOf(canvasElement)).toHaveTextContent("500 ms or more");
    });

    expect(
      canvas.getByText(/The last bar gathers the 50 largest requests/),
    ).toBeInTheDocument();
    // The table view lists every bucket.
    const rows = canvasElement.querySelectorAll(
      '[data-slot="chart-data-table"] tbody tr',
    );
    expect(rows.length).toBe(LINEAR_BUCKETS.length);
  },
};

export const LogScale: Story = {
  args: {
    buckets: LOG_BUCKETS,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same requests on 1-2-5 log edges (0, 1, 2, 5, 10, 20, 50 … ms): the tail spreads out instead of folding into an overflow bar.",
      },
    },
  },
};

export const CustomColors: Story = {
  args: {
    color: "chart-2",
    overflowColor: "muted",
  },
};

export const FixedWidth: Story = {
  args: {
    width: 360,
    height: 200,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A numeric `width` draws at exactly that many pixels; edge labels thin out to keep ~52px apart.",
      },
    },
  },
};

export const Empty: Story = {
  args: {
    buckets: [],
    emptyMessage: "No requests match the filters",
  },
};
