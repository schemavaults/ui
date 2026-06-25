import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { FieldTypeBadge } from "./field-type-badge";
import {
  fieldTypeBadgeAppearanceIds,
  fieldTypeBadgeSizeIds,
  fieldTypeIds,
  type FieldType,
} from "./field-type-badge-variants";

const meta = {
  title: "Components/FieldTypeBadge",
  component: FieldTypeBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Compact badge for displaying schema field / data types — strings, integers, objects, dates, UUIDs, etc. " +
          "Companion to `HttpMethodBadge` for SchemaVaults schema viewers, table column headers, JSON Schema docs, " +
          "and API parameter lists. Accepts canonical names (`string`, `integer`) and common aliases " +
          "(`int`, `bool`, `timestamp`). Unknown types fall back to the `any` palette.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      options: fieldTypeIds,
      control: { type: "select" },
    },
    appearance: {
      options: fieldTypeBadgeAppearanceIds,
      control: { type: "radio" },
    },
    size: {
      options: fieldTypeBadgeSizeIds,
      control: { type: "radio" },
    },
    width: {
      options: ["auto", "fixed"],
      control: { type: "radio" },
    },
    hideIcon: {
      control: { type: "boolean" },
    },
    nullable: {
      control: { type: "boolean" },
    },
    label: {
      control: { type: "text" },
    },
  },
  args: {
    type: "string",
    appearance: "soft",
    size: "md",
    width: "auto",
    hideIcon: false,
    nullable: false,
  },
} satisfies Meta<typeof FieldTypeBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StringType: Story = {
  args: { type: "string" },
};

export const IntegerType: Story = {
  args: { type: "integer" },
};

export const BooleanType: Story = {
  args: { type: "boolean" },
};

export const ObjectType: Story = {
  args: { type: "object" },
};

export const ArrayType: Story = {
  args: { type: "array" },
};

export const UuidType: Story = {
  args: { type: "uuid" },
};

export const DateTimeType: Story = {
  args: { type: "datetime" },
};

export const NullableField: Story = {
  args: { type: "string", nullable: true },
};

export const SolidAppearance: Story = {
  args: { type: "object", appearance: "solid" },
};

export const OutlineAppearance: Story = {
  args: { type: "integer", appearance: "outline" },
};

export const WithoutIcon: Story = {
  args: { type: "string", hideIcon: true },
};

export const AllTypes: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex flex-col gap-3 p-4">
      {fieldTypeBadgeAppearanceIds.map((appearance) => (
        <div key={appearance} className="flex flex-wrap items-center gap-2">
          <span className="w-16 text-xs text-muted-foreground capitalize">
            {appearance}
          </span>
          {fieldTypeIds.map((type) => (
            <FieldTypeBadge key={type} type={type} appearance={appearance} />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex flex-col gap-4 p-4">
      {fieldTypeBadgeSizeIds.map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          <span className="w-10 text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          {(
            [
              "string",
              "integer",
              "boolean",
              "object",
              "array",
              "uuid",
              "datetime",
            ] satisfies FieldType[]
          ).map((type) => (
            <FieldTypeBadge key={type} type={type} size={size} />
          ))}
        </div>
      ))}
    </div>
  ),
};

interface MockField {
  name: string;
  type: FieldType;
  description: string;
  nullable?: boolean;
}

const mockSchemaFields: MockField[] = [
  { name: "id", type: "uuid", description: "Primary key" },
  { name: "name", type: "string", description: "Vault display name" },
  { name: "description", type: "string", description: "Long description", nullable: true },
  { name: "owner_id", type: "uuid", description: "Foreign key → users.id" },
  { name: "tags", type: "array", description: "List of tag strings" },
  { name: "metadata", type: "object", description: "Free-form JSON metadata" },
  { name: "is_public", type: "boolean", description: "Whether the vault is public" },
  { name: "item_count", type: "integer", description: "Cached item count" },
  { name: "size_bytes", type: "number", description: "Total storage size" },
  { name: "created_at", type: "datetime", description: "Creation timestamp" },
  { name: "deleted_at", type: "datetime", description: "Soft-delete tombstone", nullable: true },
  { name: "schema_version", type: "enum", description: "v1 | v2 | v3" },
];

export const SchemaTable: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="w-full max-w-3xl rounded-lg border border-border bg-card p-4 text-card-foreground">
      <h3 className="mb-3 text-sm font-semibold">vaults</h3>
      <ul className="divide-y divide-border">
        {mockSchemaFields.map((field) => (
          <li
            key={field.name}
            className="flex items-center gap-3 py-2"
          >
            <code className="font-mono text-sm text-foreground w-40">
              {field.name}
            </code>
            <FieldTypeBadge
              type={field.type}
              size="sm"
              width="fixed"
              nullable={field.nullable}
            />
            <span className="ml-auto text-xs text-muted-foreground">
              {field.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  ),
};

export const FixedWidthAlignment: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex flex-col gap-1.5 p-4 font-mono text-sm">
      {(
        ["string", "integer", "boolean", "object", "array", "uuid", "datetime"] satisfies FieldType[]
      ).map((type) => (
        <div key={type} className="flex items-center gap-2">
          <FieldTypeBadge type={type} width="fixed" size="sm" />
          <span className="text-foreground">field_{type}</span>
        </div>
      ))}
    </div>
  ),
};

export const InlineWithText: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <p className="max-w-md text-sm text-foreground leading-7">
      The <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">id</code>{" "}
      field is a <FieldTypeBadge type="uuid" size="sm" />, while{" "}
      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">tags</code>{" "}
      is an <FieldTypeBadge type="array" size="sm" /> of{" "}
      <FieldTypeBadge type="string" size="sm" />. Timestamps like{" "}
      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">created_at</code>{" "}
      use <FieldTypeBadge type="datetime" size="sm" />.
    </p>
  ),
};

export const AliasedInput: Story = {
  name: "Accepts aliases (int, bool, timestamp, …)",
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex flex-wrap items-center gap-2 p-4">
      <FieldTypeBadge type="int" />
      <FieldTypeBadge type="bool" />
      <FieldTypeBadge type="float" />
      <FieldTypeBadge type="timestamp" />
      <FieldTypeBadge type="guid" />
      <FieldTypeBadge type="bytes" />
      <FieldTypeBadge type="list" />
      <FieldTypeBadge type="map" />
    </div>
  ),
};

export const UnknownTypeFallsBackToAny: Story = {
  args: { type: "some_unknown_type", label: "some_unknown_type" },
};

export const CustomLabel: Story = {
  args: { type: "object", label: "JSONB" },
};
