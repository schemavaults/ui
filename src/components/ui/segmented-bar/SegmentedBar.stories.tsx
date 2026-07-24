import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import type { ReactElement } from "react";
import { LazyFramerMotionProvider } from "@/providers/lazy_framer";
import {
  SegmentedBar,
  segmentedBarSizeIds,
  segmentedBarShapeIds,
  type SegmentedBarSegment,
} from "./segmented-bar";

const meta = {
  title: "Components/SegmentedBar",
  component: SegmentedBar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A stacked horizontal bar composed of multiple coloured segments — one visualisation for showing the composition of a whole. Use for capacity breakdowns (used / reserved / free of a quota), traffic sources, cost distribution, task status counts, or any other categorical split. Complements [`ProgressBar`](?path=/docs/components-progressbar--docs) (single value toward a goal) and [`Meter`](?path=/docs/components-meter--docs) (scalar with thresholds); pairs naturally with [`PieChart`](?path=/docs/components-piechart--docs) when a numeric legend is easier to read than a pie. Segment colours use the same palette as `PieChart` so both visualisations agree on which segment is which.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { options: segmentedBarSizeIds, control: { type: "radio" } },
    shape: { options: segmentedBarShapeIds, control: { type: "radio" } },
    showLegend: { control: { type: "boolean" } },
    showLegendValues: { control: { type: "boolean" } },
    showLegendPercentages: { control: { type: "boolean" } },
    showDividers: { control: { type: "boolean" } },
    animate: { control: { type: "boolean" } },
    unit: { control: { type: "text" } },
    total: { control: { type: "number" } },
  },
  args: {
    label: "Sample distribution",
    size: "default",
    shape: "pill",
    showLegend: false,
    showLegendValues: true,
    showLegendPercentages: false,
    showDividers: true,
    animate: true,
  },
  decorators: [
    (Story): ReactElement => (
      <LazyFramerMotionProvider>
        <div style={{ width: "480px" }}>
          <Story />
        </div>
      </LazyFramerMotionProvider>
    ),
  ],
} satisfies Meta<typeof SegmentedBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_SEGMENTS: ReadonlyArray<SegmentedBarSegment> = [
  { id: "schemas", label: "Schemas", value: 40, color: "default" },
  { id: "tables", label: "Tables", value: 25, color: "positive" },
  { id: "indexes", label: "Indexes", value: 18, color: "warning" },
  { id: "views", label: "Views", value: 12, color: "destructive" },
  { id: "other", label: "Other", value: 5, color: "muted" },
];

export const Default: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    label: "Object distribution",
  },
};

export const WithHeader: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    label: "Object distribution",
    headerLabel: "Object distribution",
    headerValue: "100 objects",
  },
};

export const WithLegend: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    label: "Object distribution",
    showLegend: true,
    showLegendPercentages: true,
  },
};

export const StorageQuota: Story = {
  name: "Storage quota (with remainder)",
  args: {
    label: "Storage quota",
    headerLabel: "Storage quota",
    headerValue: "84 / 100 GB",
    total: 100,
    unit: "GB",
    showLegend: true,
    size: "lg",
    segments: [
      { id: "used", label: "Used", value: 62, color: "primary" },
      { id: "reserved", label: "Reserved", value: 22, color: "warning" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Set `total` above the sum of segments to reserve unfilled space — perfect for a capacity/quota bar where the tail represents free space.",
      },
    },
  },
};

export const TrafficSources: Story = {
  name: "Traffic sources",
  args: {
    label: "Traffic sources",
    headerLabel: "Traffic sources",
    headerValue: "24,382 sessions",
    showLegend: true,
    showLegendPercentages: true,
    segments: [
      { id: "organic", label: "Organic", value: 11800 },
      { id: "direct", label: "Direct", value: 6200 },
      { id: "social", label: "Social", value: 3900 },
      { id: "referral", label: "Referral", value: 1800 },
      { id: "other", label: "Other", value: 682 },
    ],
  },
};

export const Pill: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    shape: "pill",
    size: "lg",
  },
};

export const Rounded: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    shape: "rounded",
    size: "lg",
  },
};

export const Square: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    shape: "square",
    size: "lg",
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
    shape: "rounded",
  },
};

export const CustomFillColors: Story = {
  args: {
    label: "Custom colours",
    showLegend: true,
    size: "lg",
    segments: [
      { id: "a", label: "Aurora", value: 30, fill: "#7c3aed" },
      { id: "b", label: "Beacon", value: 25, fill: "#0ea5e9" },
      { id: "c", label: "Coral", value: 20, fill: "#f43f5e" },
      { id: "d", label: "Dune", value: 25, fill: "#f59e0b" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Set `fill` on a segment to override the preset palette with any CSS colour — hex, `hsl(var(--chart-1))`, or a gradient token.",
      },
    },
  },
};

export const NoAnimation: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    animate: false,
  },
};

export const NoDividers: Story = {
  args: {
    segments: SAMPLE_SEGMENTS,
    showDividers: false,
    shape: "pill",
    size: "lg",
  },
};

export const InteractiveSegments: Story = {
  name: "Interactive segments (onClick)",
  args: {
    label: "CI/CD pipeline duration by stage",
    headerLabel: "Pipeline duration",
    headerValue: "8m 42s",
    showLegend: true,
    size: "lg",
    onSegmentClick: fn(),
    segments: [
      { id: "install", label: "Install", value: 62, color: "muted" },
      { id: "build", label: "Build", value: 148, color: "primary" },
      { id: "test", label: "Test", value: 210, color: "positive" },
      { id: "deploy", label: "Deploy", value: 102, color: "warning" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Segments become clickable buttons when a segment-level `onClick` or the bar's `onSegmentClick` is provided. Each segment stays keyboard-focusable and activates on Enter/Space.",
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const buildSegment = await waitFor(() =>
      canvas.getByRole("button", { name: "Build" }),
    );
    await userEvent.click(buildSegment);
    await waitFor(() => {
      expect(args.onSegmentClick).toHaveBeenCalledTimes(1);
    });
    const [clickedSegment] = (args.onSegmentClick as ReturnType<typeof fn>).mock
      .calls[0]!;
    expect(clickedSegment.id).toBe("build");
  },
};

export const EmptyState: Story = {
  name: "Empty (no segments)",
  args: {
    label: "No usage yet",
    headerLabel: "Storage quota",
    headerValue: "0 / 100 GB",
    total: 100,
    segments: [],
    size: "lg",
    showLegend: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "When no segments are provided, the bar renders as an empty track — useful before any data is available.",
      },
    },
  },
};
