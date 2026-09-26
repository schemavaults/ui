import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";

import {
  TreeMap,
  treeMapSizeIds,
  treeMapVariantIds,
  type TreeMapNode,
  type TreeMapTileContext,
} from "./treemap";

/** Bytes stored per collection in a vault — the flat, single-level case. */
const storageByCollection: ReadonlyArray<TreeMapNode> = [
  { id: "events", label: "events", value: 412 },
  { id: "documents", label: "documents", value: 268 },
  { id: "embeddings", label: "embeddings", value: 194 },
  { id: "audit-log", label: "audit_log", value: 96 },
  { id: "users", label: "users", value: 41 },
  { id: "api-keys", label: "api_keys", value: 12 },
  { id: "migrations", label: "migrations", value: 5 },
];

/** Rows per table, grouped by schema — the nested case. */
const rowsBySchema: ReadonlyArray<TreeMapNode> = [
  {
    id: "analytics",
    label: "analytics",
    color: "default",
    children: [
      { id: "analytics.events", label: "events", value: 4_820_000 },
      { id: "analytics.sessions", label: "sessions", value: 1_240_000 },
      { id: "analytics.pageviews", label: "pageviews", value: 940_000 },
      { id: "analytics.funnels", label: "funnels", value: 88_000 },
    ],
  },
  {
    id: "vault",
    label: "vault",
    color: "positive",
    children: [
      { id: "vault.documents", label: "documents", value: 1_860_000 },
      { id: "vault.revisions", label: "revisions", value: 1_410_000 },
      { id: "vault.embeddings", label: "embeddings", value: 620_000 },
      { id: "vault.tags", label: "tags", value: 74_000 },
    ],
  },
  {
    id: "iam",
    label: "iam",
    color: "warning",
    children: [
      { id: "iam.users", label: "users", value: 320_000 },
      { id: "iam.sessions", label: "sessions", value: 210_000 },
      { id: "iam.api_keys", label: "api_keys", value: 26_000 },
    ],
  },
  {
    id: "ops",
    label: "ops",
    color: "destructive",
    children: [
      { id: "ops.jobs", label: "jobs", value: 180_000 },
      { id: "ops.job_logs", label: "job_logs", value: 142_000 },
    ],
  },
];

function formatGigabytes({ value }: TreeMapTileContext): string {
  return `${value} GB`;
}

function formatCompact({ value }: TreeMapTileContext): string {
  return value.toLocaleString(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  });
}

const meta = {
  title: "Charts & Graphs/TreeMap",
  component: TreeMap,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A squarified treemap (Bruls, Huizing & van Wijk, 2000) for showing " +
          "how a whole divides into parts: storage per collection, rows per " +
          "table, spend per project. Every tile's **area** is proportional to " +
          "its value, and nodes can nest arbitrarily deep via `children`, so " +
          "one chart shows both a group's total and its internal breakdown. " +
          "Rows are grown only while they improve the worst aspect ratio, " +
          "which keeps tiles close to square and therefore comparable by eye. " +
          "\n\nColors come from the shared @schemavaults/theme palette, so the " +
          "chart tracks light and dark mode automatically; descendants inherit " +
          "their ancestor's color at a reduced fill opacity so each branch " +
          "reads as one family. " +
          "\n\nReach for a treemap when you have more parts than a pie chart " +
          "can label legibly (see " +
          "[PieChart](?path=/docs/charts-graphs-piechart--docs)) or when the " +
          "parts are hierarchical. For hierarchy without magnitude, use " +
          "[TreeView](?path=/docs/data-display-treeview--docs) instead.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    nodes: storageByCollection,
    label: "Storage used per collection",
    valueFormatter: formatGigabytes,
  },
  argTypes: {
    size: {
      options: treeMapSizeIds,
      control: { type: "radio" },
    },
    variant: {
      options: treeMapVariantIds,
      control: { type: "radio" },
    },
    tileGap: {
      control: { type: "range", min: 0, max: 16, step: 1 },
    },
    groupPadding: {
      control: { type: "range", min: 0, max: 16, step: 1 },
    },
    groupHeaderHeight: {
      control: { type: "range", min: 0, max: 32, step: 1 },
    },
    cornerRadius: {
      control: { type: "range", min: 0, max: 16, step: 1 },
    },
    depthFillFalloff: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
    },
    tileFillOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
    },
    maxDepth: {
      control: { type: "number", min: 0, max: 5, step: 1 },
    },
  },
} satisfies Meta<typeof TreeMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Nesting: each schema is a labelled group containing its tables. */
export const Nested: Story = {
  args: {
    nodes: rowsBySchema,
    label: "Rows per table, grouped by schema",
    size: "xl",
    valueFormatter: formatCompact,
  },
  play: async ({ canvasElement }): Promise<void> => {
    const chart = canvasElement.querySelector('[data-slot="treemap"]');
    expect(chart).not.toBeNull();

    const groups = Array.from(
      chart!.querySelectorAll('rect[data-slot="treemap-group"]'),
    );
    expect(groups).toHaveLength(rowsBySchema.length);

    // Every schema gets a header band carrying its name. `groupHeaderHeight`
    // defaults below `minLabelHeight`, so this is the regression guard for the
    // leaf threshold leaking onto branches and blanking every group name.
    const labelText = Array.from(
      chart!.querySelectorAll('[data-slot="treemap-labels"] text'),
    ).map((node) => node.textContent);
    for (const schema of rowsBySchema) {
      expect(labelText).toContain(schema.label);
    }

    // Each leaf must sit strictly inside the group it belongs to.
    const box = (node: Element) => ({
      x: Number(node.getAttribute("x")),
      y: Number(node.getAttribute("y")),
      w: Number(node.getAttribute("width")),
      h: Number(node.getAttribute("height")),
    });
    for (const group of groups) {
      const outer = box(group);
      const schema = rowsBySchema.find(
        (node) => node.id === group.getAttribute("data-node-id"),
      );
      expect(schema).toBeDefined();
      for (const child of schema!.children ?? []) {
        const tile = chart!.querySelector(
          `rect[data-slot="treemap-tile"][data-node-id="${child.id}"]`,
        );
        expect(tile).not.toBeNull();
        const inner = box(tile!);
        expect(inner.x).toBeGreaterThanOrEqual(outer.x - 1e-6);
        expect(inner.y).toBeGreaterThanOrEqual(outer.y - 1e-6);
        expect(inner.x + inner.w).toBeLessThanOrEqual(outer.x + outer.w + 1e-6);
        expect(inner.y + inner.h).toBeLessThanOrEqual(outer.y + outer.h + 1e-6);
      }
    }
  },
};

// `maxDepth: 0` collapses every group into a single tile that keeps the
// group's aggregate value — the same data, zoomed out one level.
export const CollapsedToGroups: Story = {
  args: {
    nodes: rowsBySchema,
    label: "Rows per schema",
    size: "lg",
    maxDepth: 0,
    valueFormatter: formatCompact,
  },
};

function VariantsExample(): ReactElement {
  return (
    <div className="flex flex-wrap items-start justify-center gap-8">
      {treeMapVariantIds.map((variant) => (
        <figure key={variant} className="flex flex-col items-center gap-2">
          <TreeMap
            nodes={storageByCollection}
            label={`Storage used per collection (${variant})`}
            variant={variant}
            size="md"
            valueFormatter={formatGigabytes}
          />
          <figcaption className="text-muted-foreground text-xs">
            {variant}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/**
 * `soft` (the default) keeps labels on a near-background surface; `solid`
 * fills the tile and gives labels a background-colored halo so they stay
 * readable on saturated brand colors; `outline` draws borders only.
 */
export const Variants: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => <VariantsExample />,
};

function SizesExample(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-8">
      {treeMapSizeIds.map((size) => (
        <figure key={size} className="flex flex-col items-center gap-2">
          <TreeMap
            nodes={storageByCollection}
            label={`Storage used per collection (${size})`}
            size={size}
            valueFormatter={formatGigabytes}
          />
          <figcaption className="text-muted-foreground text-xs">
            {size}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export const Sizes: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => <SizesExample />,
};

/** Percentage labels, from each tile's `fraction`. */
export const PercentageLabels: Story = {
  args: {
    size: "lg",
    valueFormatter: ({ fraction }: TreeMapTileContext): string =>
      `${(fraction * 100).toFixed(1)}%`,
  },
};

/**
 * A raw `fill` bypasses the preset palette entirely — handy for pinning a
 * series to a color that already means something elsewhere in the product.
 */
export const RawFills: Story = {
  args: {
    size: "lg",
    variant: "solid",
    nodes: [
      { id: "hot", label: "Hot tier", value: 320, fill: "#0ea5e9" },
      { id: "warm", label: "Warm tier", value: 210, fill: "#8b5cf6" },
      { id: "cold", label: "Cold tier", value: 140, fill: "#f97316" },
      { id: "archive", label: "Archive", value: 64, fill: "#64748b" },
    ],
    valueFormatter: formatGigabytes,
  },
};

/** An empty `nodes` array renders a "No data" placeholder rather than nothing. */
export const NoData: Story = {
  args: {
    nodes: [],
    label: "Storage used per collection",
  },
};

function InteractiveExample(): ReactElement {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <TreeMap
        nodes={rowsBySchema}
        label="Rows per table, grouped by schema"
        size="xl"
        valueFormatter={formatCompact}
        onNodeClick={(node): void => {
          setSelected(node.label ?? node.id);
        }}
      />
      <p data-testid="treemap-selection" className="text-sm">
        {selected ? `Selected: ${selected}` : "Click a tile to drill in"}
      </p>
    </div>
  );
}

/**
 * Tiles become buttons as soon as a click handler is supplied, and are
 * reachable by keyboard: <kbd>Tab</kbd> to a tile, then
 * <kbd>Enter</kbd> or <kbd>Space</kbd>.
 */
export const Interactive: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => <InteractiveExample />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const selection = canvas.getByTestId("treemap-selection");

    expect(selection).toHaveTextContent("Click a tile to drill in");

    const embeddings = canvas.getByRole("button", { name: /^embeddings: / });
    await userEvent.click(embeddings);
    await waitFor(() => {
      expect(selection).toHaveTextContent("Selected: embeddings");
    });

    // Keyboard activation goes through the same handler.
    const revisions = canvas.getByRole("button", { name: /^revisions: / });
    revisions.focus();
    expect(revisions).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(selection).toHaveTextContent("Selected: revisions");
    });
  },
};

/**
 * Guards the layout itself: one tile per node, every tile inside the canvas,
 * and tile areas ordered the same way as the values they encode.
 */
export const LayoutInvariants: Story = {
  args: {
    size: "lg",
    valueFormatter: formatGigabytes,
  },
  play: async ({ canvasElement }): Promise<void> => {
    const chart = canvasElement.querySelector('[data-slot="treemap"]');
    expect(chart).not.toBeNull();

    const tiles = Array.from(
      chart!.querySelectorAll('rect[data-slot="treemap-tile"]'),
    );
    expect(tiles).toHaveLength(storageByCollection.length);

    const canvasWidth = 520;
    const canvasHeight = 340;

    const areas: Array<number> = [];
    for (const tile of tiles) {
      const x = Number(tile.getAttribute("x"));
      const y = Number(tile.getAttribute("y"));
      const w = Number(tile.getAttribute("width"));
      const h = Number(tile.getAttribute("height"));

      // No tile may escape the canvas (1e-6 of slack for float drift).
      expect(x).toBeGreaterThanOrEqual(-1e-6);
      expect(y).toBeGreaterThanOrEqual(-1e-6);
      expect(x + w).toBeLessThanOrEqual(canvasWidth + 1e-6);
      expect(y + h).toBeLessThanOrEqual(canvasHeight + 1e-6);
      expect(w).toBeGreaterThan(0);
      expect(h).toBeGreaterThan(0);

      areas.push(w * h);
    }

    // Default `sort` is on, so tiles are emitted largest-value first and their
    // areas must be non-increasing.
    for (let i = 1; i < areas.length; i++) {
      expect(areas[i]!).toBeLessThanOrEqual(areas[i - 1]! + 1e-6);
    }

    // Area is proportional to value: the biggest collection is ~82x the
    // smallest (412 GB vs 5 GB), and `tileGap` only trims each tile's
    // perimeter, so the ratio should land in a generous band around that.
    const ratio = areas[0]! / areas[areas.length - 1]!;
    expect(ratio).toBeGreaterThan(20);

    // The tiles should between them cover most of the canvas.
    const covered = areas.reduce((sum, area) => sum + area, 0);
    expect(covered).toBeGreaterThan(canvasWidth * canvasHeight * 0.8);
    expect(covered).toBeLessThanOrEqual(canvasWidth * canvasHeight + 1e-6);
  },
};

/** Groups nest one more level: schema → table → column family. */
export const DeepNesting: Story = {
  args: {
    size: "xl",
    label: "Storage by schema, table and column family",
    variant: "soft",
    groupHeaderHeight: 18,
    valueFormatter: formatGigabytes,
    nodes: [
      {
        id: "analytics",
        label: "analytics",
        color: "default",
        children: [
          {
            id: "analytics.events",
            label: "events",
            children: [
              { id: "analytics.events.payload", label: "payload", value: 240 },
              { id: "analytics.events.headers", label: "headers", value: 86 },
              { id: "analytics.events.meta", label: "meta", value: 34 },
            ],
          },
          {
            id: "analytics.sessions",
            label: "sessions",
            children: [
              { id: "analytics.sessions.trace", label: "trace", value: 92 },
              { id: "analytics.sessions.device", label: "device", value: 28 },
            ],
          },
        ],
      },
      {
        id: "vault",
        label: "vault",
        color: "positive",
        children: [
          {
            id: "vault.documents",
            label: "documents",
            children: [
              { id: "vault.documents.body", label: "body", value: 310 },
              { id: "vault.documents.index", label: "index", value: 74 },
            ],
          },
          { id: "vault.embeddings", label: "embeddings", value: 128 },
        ],
      },
    ],
  },
};
