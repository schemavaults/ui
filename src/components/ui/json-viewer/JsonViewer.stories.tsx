import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import {
  JsonViewer,
  jsonViewerSizeIds,
  jsonViewerVariantIds,
  type JsonValue,
} from "./json-viewer";

const sampleSchema: JsonValue = {
  schema: "user.profile",
  version: 3,
  active: true,
  description:
    "Canonical user-profile schema used across the SchemaVaults monorepo.",
  fields: [
    { name: "id", type: "uuid", primary: true, nullable: false },
    { name: "email", type: "text", unique: true, nullable: false },
    {
      name: "preferences",
      type: "jsonb",
      nullable: true,
      defaultValue: { theme: "auto", emails: { weekly: false } },
    },
    { name: "createdAt", type: "timestamptz", nullable: false },
  ],
  indexes: ["users_email_idx", "users_created_at_idx"],
  metadata: null,
};

const sampleApiResponse: JsonValue = {
  ok: true,
  status: 200,
  data: {
    user: {
      id: "0d3b3f7a-8c1d-4d3a-9b2a-1a2b3c4d5e6f",
      email: "rey@schemavaults.com",
      roles: ["admin", "auditor"],
      lastSeen: "2026-05-12T18:42:11.000Z",
    },
    counts: {
      schemas: 42,
      vaults: 7,
      keys: 128,
    },
  },
  warnings: [],
};

const samplePrimitives: JsonValue = {
  text: "hello, world",
  emptyText: "",
  integer: 42,
  float: 3.14159,
  negative: -7,
  zero: 0,
  trueValue: true,
  falseValue: false,
  nothing: null,
};

const sampleEdges: JsonValue = {
  emptyObject: {},
  emptyArray: [],
  nestedEmpty: { a: { b: { c: [] } } },
  mixedArray: [1, "two", true, null, { four: 4 }, [5, 6]],
  unicode: "café — façade — 漢字 — 🚀",
  longString:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};

function buildDeep(depth: number): JsonValue {
  if (depth === 0) return { leaf: true, depth: 0 };
  return { depth, child: buildDeep(depth - 1) };
}
const sampleDeep: JsonValue = buildDeep(8);

const meta = {
  title: "Components/JsonViewer",
  component: JsonViewer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: jsonViewerVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: jsonViewerSizeIds,
      control: { type: "radio" },
    },
    title: { control: { type: "text" } },
    defaultExpandLevel: {
      control: { type: "number", min: 0, max: 10, step: 1 },
    },
    showCopyButton: { control: { type: "boolean" } },
    showHeader: { control: { type: "boolean" } },
    showItemCount: { control: { type: "boolean" } },
    maxHeight: { control: { type: "text" } },
  },
  args: {
    value: sampleSchema,
    title: "user.profile.schema.json",
    variant: "default",
    size: "md",
    defaultExpandLevel: 1,
    showCopyButton: true,
    showItemCount: true,
  },
} satisfies Meta<typeof JsonViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SchemaDocument: Story = {
  args: {
    value: sampleSchema,
    title: "user.profile.schema.json",
    defaultExpandLevel: 2,
  },
};

export const ApiResponse: Story = {
  args: {
    value: sampleApiResponse,
    title: "GET /api/v1/me",
    defaultExpandLevel: 3,
  },
};

export const Primitives: Story = {
  args: {
    value: samplePrimitives,
    title: "primitive types",
    defaultExpandLevel: 1,
  },
};

export const EdgeCases: Story = {
  args: {
    value: sampleEdges,
    title: "edge cases",
    defaultExpandLevel: 2,
  },
};

export const DeeplyNested: Story = {
  args: {
    value: sampleDeep,
    title: "8 levels deep",
    defaultExpandLevel: 0,
    maxHeight: "20rem",
  },
};

export const FullyExpanded: Story = {
  args: {
    value: sampleSchema,
    title: "fully expanded",
    defaultExpandLevel: 99,
  },
};

export const Collapsed: Story = {
  args: {
    value: sampleSchema,
    title: "collapsed root",
    defaultExpandLevel: 0,
  },
};

export const NoHeader: Story = {
  args: {
    value: sampleSchema,
    showHeader: false,
    defaultExpandLevel: 1,
  },
};

export const TerminalVariant: Story = {
  args: {
    value: sampleApiResponse,
    title: "POST /api/run",
    variant: "terminal",
    defaultExpandLevel: 2,
  },
};

export const SubtleVariant: Story = {
  args: {
    value: sampleSchema,
    title: "subtle inline view",
    variant: "subtle",
    defaultExpandLevel: 1,
  },
};

export const ContrastVariant: Story = {
  args: {
    value: sampleSchema,
    title: "contrast",
    variant: "contrast",
    defaultExpandLevel: 1,
  },
};

export const ScrollableLargePayload: Story = {
  args: {
    value: {
      items: Array.from({ length: 50 }, (_, i): JsonValue => ({
        id: i,
        label: `item-${i}`,
        active: i % 3 === 0,
        tags: i % 2 === 0 ? ["even", "sample"] : ["odd"],
      })),
    },
    title: "50 items",
    defaultExpandLevel: 2,
    maxHeight: "20rem",
  },
};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-6">
      {jsonViewerVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground capitalize">
            {variant}
          </span>
          <JsonViewer
            value={sampleSchema}
            variant={variant}
            title={`variant: ${variant}`}
            defaultExpandLevel={2}
          />
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-6">
      {jsonViewerSizeIds.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground capitalize">
            {size}
          </span>
          <JsonViewer
            value={sampleSchema}
            size={size}
            title={`size: ${size}`}
            defaultExpandLevel={1}
          />
        </div>
      ))}
    </div>
  ),
};
