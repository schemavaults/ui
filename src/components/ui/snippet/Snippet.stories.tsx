import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { Snippet } from "./snippet";
import {
  snippetSizeIds,
  snippetSymbolIds,
  snippetVariantIds,
} from "./snippet-variants";

const meta = {
  title: "Components/Snippet",
  component: Snippet,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: snippetVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: snippetSizeIds,
      control: { type: "radio" },
    },
    symbol: {
      options: [
        ...snippetSymbolIds,
        "false",
      ] as const,
      mapping: {
        ...Object.fromEntries(snippetSymbolIds.map((s) => [s, s])),
        false: false,
      },
      control: { type: "select" },
    },
    value: { control: { type: "text" } },
    copyValue: { control: { type: "text" } },
    hideCopyButton: { control: { type: "boolean" } },
  },
  args: {
    value: "bun install @schemavaults/ui",
    variant: "default",
    size: "md",
    symbol: "dollar",
    hideCopyButton: false,
  },
} satisfies Meta<typeof Snippet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Terminal: Story = {
  args: {
    variant: "terminal",
    value: "ssh deploy@schemavaults.io",
    symbol: "dollar",
  },
};

export const Subtle: Story = {
  args: {
    variant: "subtle",
    value: "GET /api/v1/vaults/:id/schemas",
    symbol: false,
  },
};

export const Contrast: Story = {
  args: {
    variant: "contrast",
    value: "git checkout -b feature/snippet-component",
    symbol: "git",
  },
};

export const Brand: Story = {
  args: {
    variant: "brand",
    value: "bun add @schemavaults/ui",
    symbol: "bun",
  },
};

export const WithoutSymbol: Story = {
  args: {
    value: "svlt_demo_placeholder_not_a_real_secret_value",
    symbol: false,
  },
};

export const CustomSymbol: Story = {
  args: {
    value: "deploy --env production",
    symbol: "[prod]",
    variant: "terminal",
  },
};

export const WithoutCopyButton: Story = {
  args: {
    value: "echo $SCHEMAVAULTS_API_KEY",
    hideCopyButton: true,
    variant: "terminal",
  },
};

export const CopyDifferentValue: Story = {
  args: {
    value: "bun add @schemavaults/ui",
    copyValue: "bun add @schemavaults/ui --save-exact",
    symbol: "bun",
    variant: "default",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Displays `bun add @schemavaults/ui` but copies " +
          "`bun add @schemavaults/ui --save-exact` to the clipboard. Use " +
          "`copyValue` whenever the canonical, copy-pasteable form of a " +
          "command differs from what's shown to the reader.",
      },
    },
  },
};

export const LongCommandTruncates: Story = {
  args: {
    value:
      "psql 'postgres://schemavaults_admin:redacted@db.internal.schemavaults.io:5432/production?sslmode=require'",
    symbol: "psql",
    variant: "terminal",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Long values are truncated with an ellipsis to keep the snippet " +
          "single-line. The full value is preserved in the tooltip (via the " +
          "native `title` attribute) and is what gets copied.",
      },
    },
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="flex w-[420px] flex-col gap-3 p-4">
      {snippetVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          <Snippet
            variant={variant}
            value={`# ${variant} variant — bun add @schemavaults/ui`}
            symbol={false}
          />
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex w-[420px] flex-col gap-3 p-4">
      {snippetSizeIds.map((size) => (
        <div key={size} className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <Snippet
            size={size}
            value={`bun add @schemavaults/ui  # size=${size}`}
            symbol="bun"
          />
        </div>
      ))}
    </div>
  ),
};

export const AllSymbols: Story = {
  render: (): ReactElement => (
    <div className="flex w-[480px] flex-col gap-2 p-4">
      {snippetSymbolIds.map((symbol) => (
        <Snippet
          key={symbol}
          symbol={symbol}
          value={`symbol="${symbol}"`}
        />
      ))}
      <Snippet symbol={false} value={`symbol={false}`} />
      <Snippet symbol="[custom]" value={`symbol="[custom]"`} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All built-in symbol presets, plus the `false` and custom-string " +
          "escape hatches. Use a preset for common shells and package " +
          "managers; pass any other string for one-off prompts like " +
          "environment labels (`[prod]`) or branch names.",
      },
    },
  },
};

/**
 * The InstallCommands story showcases the most common SchemaVaults use case:
 * a docs page that lists install commands for multiple package managers.
 */
export const InstallCommands: Story = {
  render: (): ReactElement => (
    <div className="flex w-[420px] flex-col gap-2 p-4">
      <Snippet symbol="bun" value="bun add @schemavaults/ui" />
      <Snippet symbol="pnpm" value="pnpm add @schemavaults/ui" />
      <Snippet symbol="npm" value="npm install @schemavaults/ui" />
      <Snippet symbol="yarn" value="yarn add @schemavaults/ui" />
    </div>
  ),
};
