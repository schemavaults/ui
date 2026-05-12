import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import {
  CalendarHeatmap,
  calendarHeatmapColorIds,
  calendarHeatmapSizeIds,
  type CalendarHeatmapColorId,
  type CalendarHeatmapValue,
} from "./calendar-heatmap";

/**
 * Deterministic pseudo-random generator so stories render identically across
 * reloads — Storybook snapshots and visual review need stable output.
 */
function mulberry32(seed: number): () => number {
  let a: number = seed >>> 0;
  return (): number => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t: number = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface SyntheticDatasetOptions {
  readonly start: string;
  readonly end: string;
  readonly seed: number;
  /** 0..1 chance any given day has activity. */
  readonly density?: number;
  /** Max possible count for an active day. */
  readonly maxCount?: number;
  /** Optional weekday weighting (Sun..Sat). */
  readonly weekdayWeights?: ReadonlyArray<number>;
}

function buildSyntheticDataset({
  start,
  end,
  seed,
  density = 0.55,
  maxCount = 12,
  weekdayWeights,
}: SyntheticDatasetOptions): ReadonlyArray<CalendarHeatmapValue> {
  const rng = mulberry32(seed);
  const startMs: number = Date.UTC(
    Number(start.slice(0, 4)),
    Number(start.slice(5, 7)) - 1,
    Number(start.slice(8, 10)),
  );
  const endMs: number = Date.UTC(
    Number(end.slice(0, 4)),
    Number(end.slice(5, 7)) - 1,
    Number(end.slice(8, 10)),
  );
  const out: CalendarHeatmapValue[] = [];
  for (let t = startMs; t <= endMs; t += 86_400_000) {
    const day = new Date(t);
    const dow: number = day.getUTCDay();
    const weight: number = weekdayWeights?.[dow] ?? 1;
    if (rng() > density * weight) continue;
    const count: number = 1 + Math.floor(rng() * maxCount);
    out.push({
      date: day.toISOString().slice(0, 10),
      count,
    });
  }
  return out;
}

const ONE_YEAR_START = "2025-05-12";
const ONE_YEAR_END = "2026-05-11";

const oneYearOfActivity: ReadonlyArray<CalendarHeatmapValue> =
  buildSyntheticDataset({
    start: ONE_YEAR_START,
    end: ONE_YEAR_END,
    seed: 42,
    density: 0.65,
    maxCount: 18,
    // Weekday-heavy schedule, lighter on weekends.
    weekdayWeights: [0.4, 1.0, 1.2, 1.2, 1.1, 1.0, 0.5],
  });

const meta = {
  title: "Components/CalendarHeatmap",
  component: CalendarHeatmap,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A GitHub-style calendar heatmap for visualising daily activity " +
          "across a date range. Useful for contribution graphs, audit log " +
          "frequency, API usage, login density, and similar time-series " +
          "metrics where a single number per day is meaningful. Cell colour " +
          "intensity scales across five levels — by default, thresholds are " +
          "auto-derived from the dataset's quartiles.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      options: calendarHeatmapColorIds,
      control: { type: "select" },
    },
    size: {
      options: calendarHeatmapSizeIds,
      control: { type: "radio" },
    },
    weekStart: {
      options: [0, 1],
      control: { type: "inline-radio" },
    },
    showWeekdayLabels: { control: { type: "boolean" } },
    showMonthLabels: { control: { type: "boolean" } },
    showLegend: { control: { type: "boolean" } },
    label: { control: { type: "text" } },
  },
  args: {
    startDate: ONE_YEAR_START,
    endDate: ONE_YEAR_END,
    values: oneYearOfActivity,
    color: "default",
    size: "md",
    weekStart: 0,
    showWeekdayLabels: true,
    showMonthLabels: true,
    showLegend: true,
    label: "Schema activity over the last year",
  },
} satisfies Meta<typeof CalendarHeatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: { color: "primary" },
};

export const Positive: Story = {
  args: { color: "positive", label: "Successful deploys" },
};

export const Warning: Story = {
  args: {
    color: "warning",
    label: "Elevated API latency days",
    values: buildSyntheticDataset({
      start: ONE_YEAR_START,
      end: ONE_YEAR_END,
      seed: 7,
      density: 0.3,
      maxCount: 9,
    }),
  },
};

export const Destructive: Story = {
  args: {
    color: "destructive",
    label: "Failed authentications per day",
    values: buildSyntheticDataset({
      start: ONE_YEAR_START,
      end: ONE_YEAR_END,
      seed: 99,
      density: 0.25,
      maxCount: 14,
    }),
  },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg", color: "primary" },
};

export const MondayWeekStart: Story = {
  args: { weekStart: 1 },
};

export const NoLabels: Story = {
  args: {
    showWeekdayLabels: false,
    showMonthLabels: false,
    showLegend: false,
  },
};

export const ShortRange: Story = {
  args: {
    startDate: "2026-02-01",
    endDate: "2026-04-30",
    color: "primary",
    label: "Q1 2026 deployments",
    values: buildSyntheticDataset({
      start: "2026-02-01",
      end: "2026-04-30",
      seed: 13,
      density: 0.7,
      maxCount: 10,
    }),
  },
};

export const Sparse: Story = {
  args: {
    color: "positive",
    label: "Schema migrations",
    values: buildSyntheticDataset({
      start: ONE_YEAR_START,
      end: ONE_YEAR_END,
      seed: 5,
      density: 0.06,
      maxCount: 4,
    }),
  },
};

export const WithCustomThresholds: Story = {
  args: {
    color: "primary",
    label: "Pull requests opened",
    thresholds: [1, 3, 6, 10],
    legendExtra: (
      <span className="text-muted-foreground">Thresholds: 1 / 3 / 6 / 10</span>
    ) as unknown as never,
  },
};

export const WithCustomTooltip: Story = {
  args: {
    color: "primary",
    label: "API requests per day",
    tooltipText: (date, count): string => {
      const iso: string = date.toISOString().slice(0, 10);
      const formattedCount: string = (count * 1_000).toLocaleString();
      return count > 0
        ? `${iso} — ${formattedCount} API requests`
        : `${iso} — quiet day`;
    },
  },
};

const COLORS_FOR_MATRIX: ReadonlyArray<{
  id: CalendarHeatmapColorId;
  caption: string;
}> = [
  { id: "default", caption: "default (brand blue)" },
  { id: "primary", caption: "primary" },
  { id: "positive", caption: "positive" },
  { id: "warning", caption: "warning" },
  { id: "destructive", caption: "destructive" },
];

function ColorMatrix(): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      {COLORS_FOR_MATRIX.map(({ id, caption }) => (
        <div key={id} className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {caption}
          </p>
          <CalendarHeatmap
            startDate={ONE_YEAR_START}
            endDate={ONE_YEAR_END}
            values={oneYearOfActivity}
            color={id}
            label={`Activity heatmap (${id})`}
          />
        </div>
      ))}
    </div>
  );
}

export const ColorVariantMatrix: StoryObj = {
  render: (): ReactElement => <ColorMatrix />,
  parameters: { layout: "padded" },
};

function SizeMatrix(): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            size = {size}
          </p>
          <CalendarHeatmap
            startDate={ONE_YEAR_START}
            endDate={ONE_YEAR_END}
            values={oneYearOfActivity}
            color="primary"
            size={size}
            label={`Activity heatmap (${size})`}
          />
        </div>
      ))}
    </div>
  );
}

export const SizeMatrixStory: StoryObj = {
  name: "Size Matrix",
  render: (): ReactElement => <SizeMatrix />,
  parameters: { layout: "padded" },
};

function DashboardComposition(): ReactElement {
  return (
    <div className="flex max-w-[960px] flex-col gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold">Schema activity</h3>
          <p className="text-xs text-muted-foreground">
            Daily schema mutations across all vaults — last 12 months.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tabular-nums leading-none">
            {oneYearOfActivity
              .reduce((sum, v) => sum + v.count, 0)
              .toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">total events</p>
        </div>
      </div>
      <CalendarHeatmap
        startDate={ONE_YEAR_START}
        endDate={ONE_YEAR_END}
        values={oneYearOfActivity}
        color="primary"
        label="Schema activity over the last year"
        legendExtra={
          <span>
            {ONE_YEAR_START} → {ONE_YEAR_END}
          </span>
        }
      />
    </div>
  );
}

export const InsideCard: StoryObj = {
  render: (): ReactElement => <DashboardComposition />,
  parameters: { layout: "padded" },
};

export const Empty: Story = {
  args: {
    values: [],
    color: "primary",
    label: "No activity recorded",
  },
};
