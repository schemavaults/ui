import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { DataTypeBadge } from "./data-type-badge";
import {
  dataTypeBadgeAppearanceIds,
  dataTypeBadgeSizeIds,
  dataTypeCategoryIds,
  type DataTypeCategory,
} from "./data-type-badge-variants";

const meta = {
  title: "Components/DataTypeBadge",
  component: DataTypeBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "text" },
    },
    category: {
      options: [undefined, ...dataTypeCategoryIds],
      control: { type: "select" },
    },
    appearance: {
      options: dataTypeBadgeAppearanceIds,
      control: { type: "radio" },
    },
    size: {
      options: dataTypeBadgeSizeIds,
      control: { type: "radio" },
    },
    width: {
      options: ["auto", "fixed"],
      control: { type: "radio" },
    },
    label: {
      control: { type: "text" },
    },
  },
  args: {
    type: "VARCHAR(255)",
    appearance: "soft",
    size: "md",
    width: "auto",
  },
} satisfies Meta<typeof DataTypeBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Varchar: Story = {
  args: { type: "VARCHAR(255)" },
};

export const Integer: Story = {
  args: { type: "INTEGER" },
};

export const Boolean: Story = {
  args: { type: "BOOLEAN" },
};

export const Timestamp: Story = {
  args: { type: "TIMESTAMP" },
};

export const Json: Story = {
  args: { type: "JSONB" },
};

export const Uuid: Story = {
  args: { type: "UUID" },
};

export const ArrayType: Story = {
  name: "Array (TEXT[])",
  args: { type: "TEXT[]" },
};

export const SolidAppearance: Story = {
  args: { type: "INTEGER", appearance: "solid" },
};

export const OutlineAppearance: Story = {
  args: { type: "INTEGER", appearance: "outline" },
};

export const LowercaseInput: Story = {
  name: "Accepts lowercase input",
  args: { type: "varchar(64)" },
};

export const UnknownType: Story = {
  name: "Unknown type → muted",
  args: { type: "CUSTOM_DOMAIN" },
};

export const CategoryOverride: Story = {
  name: "Category override",
  args: { type: "OBJECT_ID", category: "uuid" },
};

export const CustomLabel: Story = {
  args: { type: "VARCHAR(255)", label: "VARCHAR*" },
};

// Demonstrates every category × every appearance in one grid.
export const AllCategories: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => {
    // One representative type per category, chosen to be unambiguously
    // recognised by the resolver (no `category` override needed).
    const samples: Record<DataTypeCategory, string> = {
      numeric: "INTEGER",
      text: "VARCHAR",
      boolean: "BOOLEAN",
      datetime: "TIMESTAMP",
      binary: "BLOB",
      json: "JSONB",
      uuid: "UUID",
      array: "TEXT[]",
      enum: "ENUM",
      geo: "GEOMETRY",
      xml: "XML",
      money: "MONEY",
      other: "CUSTOM_DOMAIN",
    };
    return (
      <div className="flex flex-col gap-3 p-4">
        {dataTypeBadgeAppearanceIds.map((appearance) => (
          <div key={appearance} className="flex flex-wrap items-center gap-2">
            <span className="w-16 text-xs text-muted-foreground capitalize">
              {appearance}
            </span>
            {dataTypeCategoryIds.map((category) => (
              <DataTypeBadge
                key={category}
                type={samples[category]}
                appearance={appearance}
              />
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const AllSizes: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex flex-col gap-4 p-4">
      {dataTypeBadgeSizeIds.map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-10 text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          {(["INTEGER", "VARCHAR(255)", "BOOLEAN", "TIMESTAMP", "JSONB"]).map(
            (type) => (
              <DataTypeBadge key={type} type={type} size={size} />
            ),
          )}
        </div>
      ))}
    </div>
  ),
};

// Realistic schema preview — mirrors how this badge is intended to be used
// in column lists alongside primary-key / nullable annotations.
interface MockColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey?: boolean;
}

const mockColumns: MockColumn[] = [
  { name: "id", type: "UUID", nullable: false, primaryKey: true },
  { name: "email", type: "VARCHAR(320)", nullable: false },
  { name: "display_name", type: "TEXT", nullable: true },
  { name: "is_active", type: "BOOLEAN", nullable: false },
  { name: "metadata", type: "JSONB", nullable: true },
  { name: "balance", type: "MONEY", nullable: false },
  { name: "tags", type: "TEXT[]", nullable: true },
  { name: "location", type: "GEOGRAPHY", nullable: true },
  { name: "created_at", type: "TIMESTAMPTZ", nullable: false },
  { name: "avatar", type: "BYTEA", nullable: true },
];

export const SchemaPreview: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-4 text-card-foreground">
      <h3 className="mb-3 text-sm font-semibold">
        Table:{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
          users
        </code>
      </h3>
      <ul className="divide-y divide-border">
        {mockColumns.map((column) => (
          <li key={column.name} className="flex items-center gap-3 py-2">
            <DataTypeBadge type={column.type} size="sm" width="fixed" />
            <code className="font-mono text-sm">{column.name}</code>
            <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              {column.primaryKey ? (
                <span className="rounded bg-warning/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-warning-foreground">
                  PK
                </span>
              ) : null}
              {column.nullable ? "nullable" : "NOT NULL"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  ),
};

export const InlineWithText: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <p className="max-w-md text-sm text-foreground leading-7">
      The <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">id</code>{" "}
      column is a <DataTypeBadge type="UUID" size="sm" /> primary key. The{" "}
      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
        metadata
      </code>{" "}
      column accepts <DataTypeBadge type="JSONB" size="sm" /> documents up to
      1 MiB.
    </p>
  ),
};

export const FixedWidthAlignment: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex flex-col gap-1.5 p-4 font-mono text-sm">
      {(["UUID", "VARCHAR", "BOOLEAN", "TIMESTAMP", "JSONB", "MONEY"]).map(
        (type) => (
          <div key={type} className="flex items-center gap-2">
            <DataTypeBadge type={type} width="fixed" size="sm" />
            <span>column_name</span>
          </div>
        ),
      )}
    </div>
  ),
};
