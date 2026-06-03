import type { Meta, StoryObj } from "@storybook/react";

import {
  DiffViewer,
  diffViewerModeIds,
  diffViewerSizeIds,
  diffViewerVariantIds,
} from "./diff-viewer";

const beforeJson: string = `{
  "schema": "user.profile",
  "version": 3,
  "fields": [
    { "name": "id", "type": "uuid", "primary": true },
    { "name": "email", "type": "text", "unique": true },
    { "name": "createdAt", "type": "timestamptz" }
  ]
}`;

const afterJson: string = `{
  "schema": "user.profile",
  "version": 4,
  "fields": [
    { "name": "id", "type": "uuid", "primary": true },
    { "name": "email", "type": "text", "unique": true },
    { "name": "displayName", "type": "text" },
    { "name": "createdAt", "type": "timestamptz" },
    { "name": "updatedAt", "type": "timestamptz" }
  ]
}`;

const beforeTs: string = `export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export function describeUser(user: User): string {
  return user.email;
}
`;

const afterTs: string = `export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export function describeUser(user: User): string {
  return user.displayName || user.email;
}
`;

const beforeSql: string = `CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);`;

const afterSql: string = `CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX users_email_idx ON users (email);`;

const meta = {
  title: "Components/DiffViewer",
  component: DiffViewer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: diffViewerVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: diffViewerSizeIds,
      control: { type: "radio" },
    },
    mode: {
      options: diffViewerModeIds,
      control: { type: "radio" },
    },
    showLineNumbers: { control: { type: "boolean" } },
    showStats: { control: { type: "boolean" } },
    wrap: { control: { type: "boolean" } },
    title: { control: { type: "text" } },
    oldLabel: { control: { type: "text" } },
    newLabel: { control: { type: "text" } },
    maxHeight: { control: { type: "text" } },
  },
  args: {
    oldValue: beforeJson,
    newValue: afterJson,
    mode: "unified",
    title: "user.profile.schema.json",
    oldLabel: "Before",
    newLabel: "After",
    showLineNumbers: true,
    showStats: true,
    wrap: false,
  },
} satisfies Meta<typeof DiffViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UnifiedDefault: Story = {};

export const SplitView: Story = {
  args: {
    mode: "split",
    oldValue: beforeJson,
    newValue: afterJson,
    title: "user.profile.schema.json",
  },
};

export const TypeScriptUnified: Story = {
  args: {
    oldValue: beforeTs,
    newValue: afterTs,
    title: "src/types/user.ts",
    mode: "unified",
  },
};

export const TypeScriptSplit: Story = {
  args: {
    oldValue: beforeTs,
    newValue: afterTs,
    title: "src/types/user.ts",
    mode: "split",
  },
};

export const SqlMigration: Story = {
  args: {
    oldValue: beforeSql,
    newValue: afterSql,
    title: "migrations/0042_users.sql",
    mode: "unified",
  },
};

export const WithoutLineNumbers: Story = {
  args: {
    oldValue: beforeJson,
    newValue: afterJson,
    showLineNumbers: false,
  },
};

export const WithoutHeaderStats: Story = {
  args: {
    oldValue: beforeJson,
    newValue: afterJson,
    showStats: false,
    title: undefined,
  },
};

export const SubtleVariant: Story = {
  args: {
    oldValue: beforeJson,
    newValue: afterJson,
    variant: "subtle",
    title: "user.profile.schema.json",
  },
};

export const ContrastVariant: Story = {
  args: {
    oldValue: beforeJson,
    newValue: afterJson,
    variant: "contrast",
    title: "user.profile.schema.json",
  },
};

export const SmallSize: Story = {
  args: {
    oldValue: beforeJson,
    newValue: afterJson,
    size: "sm",
    title: "user.profile.schema.json",
  },
};

export const LargeSize: Story = {
  args: {
    oldValue: beforeJson,
    newValue: afterJson,
    size: "lg",
    title: "user.profile.schema.json",
  },
};

export const NoChanges: Story = {
  args: {
    oldValue: beforeJson,
    newValue: beforeJson,
    title: "Unchanged file",
  },
};

export const AllAdditions: Story = {
  args: {
    oldValue: "",
    newValue: afterTs,
    title: "src/types/user.ts (new file)",
  },
};

export const AllDeletions: Story = {
  args: {
    oldValue: beforeTs,
    newValue: "",
    title: "src/types/user.ts (deleted)",
  },
};

export const ScrollableLargeDiff: Story = {
  args: {
    oldValue: Array.from(
      { length: 80 },
      (_, i): string => `// line ${i + 1} of the original file`,
    ).join("\n"),
    newValue: Array.from(
      { length: 80 },
      (_, i): string =>
        i % 7 === 0
          ? `// modified line ${i + 1} of the updated file`
          : `// line ${i + 1} of the original file`,
    ).join("\n"),
    maxHeight: "24rem",
    title: "long-file.txt",
  },
};

export const WrappedLongLines: Story = {
  args: {
    oldValue:
      "This is a very long single line of text that would normally scroll horizontally but with wrap enabled it should wrap onto the next visual line for readability.",
    newValue:
      "This is a very long single line of text that has been edited and with wrap enabled it should wrap onto multiple visual lines so the reviewer can read every character without scrolling sideways.",
    wrap: true,
    title: "long-line.txt",
  },
};
