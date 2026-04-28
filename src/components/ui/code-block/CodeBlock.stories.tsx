import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import {
  CodeBlock,
  codeBlockSizeIds,
  codeBlockVariantIds,
} from "./code-block";

const sampleTypeScript: string = `import { CodeBlock } from "@schemavaults/ui";

export function Example(): JSX.Element {
  const value = "hello, world";
  return <CodeBlock value={value} language="ts" />;
}
`;

const sampleJson: string = `{
  "schema": "user.profile",
  "version": 3,
  "fields": [
    { "name": "id", "type": "uuid", "primary": true },
    { "name": "email", "type": "text", "unique": true },
    { "name": "createdAt", "type": "timestamptz" }
  ]
}
`;

const sampleSql: string = `SELECT u.id, u.email, count(s.id) AS schema_count
FROM users u
LEFT JOIN schemas s ON s.owner_id = u.id
WHERE u.created_at > now() - interval '30 days'
GROUP BY u.id, u.email
ORDER BY schema_count DESC
LIMIT 25;
`;

const sampleBash: string = `# Install and run
bun add @schemavaults/ui
bun run storybook
`;

const longSample: string = Array.from(
  { length: 24 },
  (_, i): string =>
    `console.log("line ${i + 1}: example output for the CodeBlock component");`,
).join("\n");

const meta = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: codeBlockVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: codeBlockSizeIds,
      control: { type: "radio" },
    },
    language: { control: { type: "text" } },
    title: { control: { type: "text" } },
    showLineNumbers: { control: { type: "boolean" } },
    showCopyButton: { control: { type: "boolean" } },
    wrap: { control: { type: "boolean" } },
    maxHeight: { control: { type: "text" } },
  },
  args: {
    value: sampleTypeScript,
    language: "ts",
    title: "example.tsx",
    showLineNumbers: false,
    showCopyButton: true,
    wrap: false,
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLineNumbers: Story = {
  args: {
    value: sampleTypeScript,
    language: "ts",
    title: "example.tsx",
    showLineNumbers: true,
  },
};

export const Json: Story = {
  args: {
    value: sampleJson,
    language: "json",
    title: "user.profile.schema.json",
    showLineNumbers: true,
  },
};

export const Sql: Story = {
  args: {
    value: sampleSql,
    language: "sql",
    title: "active-users.sql",
  },
};

export const Terminal: Story = {
  args: {
    value: sampleBash,
    language: "bash",
    title: "shell",
    variant: "terminal",
  },
};

export const Subtle: Story = {
  args: {
    value: sampleTypeScript,
    language: "ts",
    title: undefined,
    variant: "subtle",
    showCopyButton: false,
  },
};

export const Contrast: Story = {
  args: {
    value: sampleJson,
    language: "json",
    title: "config.json",
    variant: "contrast",
  },
};

export const NoHeader: Story = {
  args: {
    value: sampleTypeScript,
    language: undefined,
    title: undefined,
    showCopyButton: false,
  },
};

export const Wrap: Story = {
  args: {
    value:
      "// This is an extremely long single-line comment used to demonstrate how the CodeBlock component wraps text instead of scrolling horizontally when the wrap prop is set to true.",
    language: "ts",
    title: undefined,
    wrap: true,
  },
};

export const ScrollableMaxHeight: Story = {
  args: {
    value: longSample,
    language: "ts",
    title: "output.log",
    showLineNumbers: true,
    maxHeight: "12rem",
  },
};

function AllVariantsExample(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {codeBlockVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {variant}
          </span>
          <CodeBlock
            value={sampleTypeScript}
            language="ts"
            title="example.tsx"
            variant={variant}
          />
        </div>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  render: (): ReactElement => <AllVariantsExample />,
};

function AllSizesExample(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {codeBlockSizeIds.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {size}
          </span>
          <CodeBlock
            value={sampleBash}
            language="bash"
            size={size}
          />
        </div>
      ))}
    </div>
  );
}

export const AllSizes: Story = {
  render: (): ReactElement => <AllSizesExample />,
};
