import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import type { ReactElement } from "react";
import {
  WaffleChart,
  waffleChartFillDirectionIds,
  waffleChartGapIds,
  waffleChartShapeIds,
  type WaffleChartSegment,
} from "./waffle-chart";

const meta = {
  title: "Charts & Graphs/WaffleChart",
  component: WaffleChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A grid of unit cells — 100 by default, so one cell reads as one percent — coloured by segment to show the composition of a whole. Easier to count than a pie and more tangible than a bar for headline shares (\"38 in 100 requests were cached\"). Cells are split with the largest-remainder method so they always add up exactly. Colours come from the shared `--chart-*` palette in `@schemavaults/theme`, so a waffle agrees with [`PieChart`](?path=/docs/charts-graphs-piechart--docs) and [`SegmentedBar`](?path=/docs/charts-graphs-segmentedbar--docs) on which segment is which. The grid is a single `role=\"img\"` with a full text description plus a visually hidden data table.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    shape: { options: waffleChartShapeIds, control: { type: "radio" } },
    gap: { options: waffleChartGapIds, control: { type: "radio" } },
    fillDirection: {
      options: waffleChartFillDirectionIds,
      control: { type: "radio" },
    },
    cells: { control: { type: "number", min: 1, max: 400 } },
    columns: { control: { type: "number", min: 1, max: 40 } },
    total: { control: { type: "number" } },
    showLegend: { control: { type: "boolean" } },
    showLegendValues: { control: { type: "boolean" } },
    showLegendPercentages: { control: { type: "boolean" } },
    highlightOnHover: { control: { type: "boolean" } },
    animate: { control: { type: "boolean" } },
  },
  args: {
    label: "Object distribution",
    segments: [],
    shape: "rounded",
    gap: "default",
    fillDirection: "row",
    cells: 100,
    columns: 10,
    showLegend: true,
    showLegendValues: false,
    showLegendPercentages: true,
    highlightOnHover: true,
    animate: true,
  },
  decorators: [
    (Story): ReactElement => (
      <div style={{ width: "320px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WaffleChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_SEGMENTS: ReadonlyArray<WaffleChartSegment> = [
  { id: "schemas", label: "Schemas", value: 40 },
  { id: "tables", label: "Tables", value: 25 },
  { id: "indexes", label: "Indexes", value: 18 },
  { id: "views", label: "Views", value: 12 },
  { id: "other", label: "Other", value: 5, color: "other" },
];

export const Default: Story = {
  args: { segments: SAMPLE_SEGMENTS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole("img", { name: /Object distribution/ });
    const cells = grid.querySelectorAll('[data-slot="waffle-chart-cell"]');
    await expect(cells).toHaveLength(100);
    await expect(
      grid.querySelectorAll('[data-segment-id="schemas"]'),
    ).toHaveLength(40);
    await expect(grid).toHaveAccessibleName(/Schemas: 40 \(40%\)/);

    // Hovering a cell dims every other segment.
    await userEvent.hover(cells[0]!);
    await expect(cells[99]!.className).toContain("opacity-25");
    await expect(cells[0]!.className).not.toContain("opacity-25");
    await userEvent.unhover(grid);
    await expect(cells[99]!.className).not.toContain("opacity-25");
  },
};

export const WithValues: Story = {
  name: "Legend with values",
  args: {
    label: "Traffic sources",
    showLegendValues: true,
    segments: [
      { id: "organic", label: "Organic", value: 11800 },
      { id: "direct", label: "Direct", value: 6200 },
      { id: "social", label: "Social", value: 3900 },
      { id: "referral", label: "Referral", value: 1800 },
      { id: "other", label: "Other", value: 682, color: "other" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Raw values are scaled to the grid; the 24,382 sessions here still fill exactly 100 cells.",
      },
    },
  },
};

export const SeatsRemaining: Story = {
  name: "Partial whole (with remainder)",
  args: {
    label: "Seats",
    total: 100,
    showLegendValues: true,
    showLegendPercentages: false,
    remainderLabel: "Available",
    segments: [
      { id: "taken", label: "Taken", value: 62, color: "brand" },
      { id: "reserved", label: "Reserved", value: 22, color: "warning" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "A `total` above the sum leaves the remaining cells empty and adds a `remainderLabel` legend entry.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole("img", { name: /Seats/ });
    await expect(
      grid.querySelectorAll('[data-slot="waffle-chart-cell"][data-empty]'),
    ).toHaveLength(16);
    const legend = canvas.getByRole("list", { name: "Legend" });
    await expect(within(legend).getByText("Available")).toBeInTheDocument();
  },
};

export const StatusColors: Story = {
  name: "Status colours",
  args: {
    label: "Health checks",
    shape: "circle",
    segments: [
      { id: "passing", label: "Passing", value: 91, color: "positive" },
      { id: "degraded", label: "Degraded", value: 6, color: "warning" },
      { id: "failing", label: "Failing", value: 3, color: "destructive" },
    ],
  },
};

export const Circles: Story = {
  args: { segments: SAMPLE_SEGMENTS, shape: "circle", gap: "lg" },
};

export const Square: Story = {
  args: { segments: SAMPLE_SEGMENTS, shape: "square", gap: "none" },
};

export const ColumnFill: Story = {
  name: "Column fill",
  args: { segments: SAMPLE_SEGMENTS, fillDirection: "column" },
};

export const WideGrid: Story = {
  name: "Wide grid (200 cells)",
  args: {
    segments: SAMPLE_SEGMENTS,
    cells: 200,
    columns: 20,
    gap: "sm",
  },
  decorators: [
    (Story): ReactElement => (
      <div style={{ width: "560px" }}>
        <Story />
      </div>
    ),
  ],
};

export const StableColors: Story = {
  name: "Stable colours (segmentOrder)",
  args: {
    label: "Filtered distribution",
    segmentOrder: ["schemas", "tables", "indexes", "views"],
    segments: [
      { id: "tables", label: "Tables", value: 25 },
      { id: "views", label: "Views", value: 12 },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass the full `segmentOrder` so filtering keeps each segment on its palette slot: Tables stays slot 2 and Views slot 4.",
      },
    },
  },
};

export const CustomFill: Story = {
  name: "Custom fill colours",
  args: {
    label: "Custom colours",
    segments: [
      { id: "a", label: "Aurora", value: 30, fill: "#7c3aed" },
      { id: "b", label: "Beacon", value: 25, fill: "#0ea5e9" },
      { id: "c", label: "Coral", value: 20, fill: "#f43f5e" },
      { id: "d", label: "Dune", value: 25, fill: "#f59e0b" },
    ],
  },
};

export const ClickableLegend: Story = {
  name: "Clickable legend",
  args: {
    segments: SAMPLE_SEGMENTS,
    onSegmentClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Tables/ });
    await userEvent.click(button);
    await expect(args.onSegmentClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "tables" }),
      expect.anything(),
    );
    // Focusing a legend entry highlights its segment.
    const grid = canvas.getByRole("img");
    const schemaCell = grid.querySelector('[data-segment-id="schemas"]')!;
    await expect(schemaCell.className).toContain("opacity-25");
  },
};

export const NoLegend: Story = {
  args: { segments: SAMPLE_SEGMENTS, showLegend: false, animate: false },
};
