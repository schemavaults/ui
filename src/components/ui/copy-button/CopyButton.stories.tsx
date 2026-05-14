import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import type { ReactElement } from "react";

import { useToast } from "@/components/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { CopyButton } from "./copy-button";
import {
  copyButtonSizeIds,
  copyButtonVariantIds,
} from "./copy-button-variants";

const meta = {
  title: "Components/CopyButton",
  component: CopyButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: copyButtonVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: copyButtonSizeIds,
      control: { type: "radio" },
    },
    value: { control: { type: "text" } },
    label: { control: { type: "text" } },
    copiedLabel: { control: { type: "text" } },
    resetDelay: { control: { type: "number" } },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    value: "npm install @schemavaults/ui",
    variant: "ghost",
    size: "icon-md",
    resetDelay: 2000,
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "ghost",
    size: "icon-md",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    size: "icon-md",
  },
};

export const Solid: Story = {
  args: {
    variant: "default",
    size: "icon-md",
  },
};

export const Brand: Story = {
  args: {
    variant: "brand",
    size: "icon-md",
  },
};

export const WithLabel: Story = {
  args: {
    variant: "outline",
    size: "md",
    label: "Copy",
    copiedLabel: "Copied!",
  },
};

export const BrandWithLabel: Story = {
  args: {
    variant: "brand",
    size: "md",
    label: "Copy snippet",
    copiedLabel: "Copied!",
  },
};

export const Disabled: Story = {
  args: {
    variant: "outline",
    size: "md",
    label: "Copy",
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-4 p-4">
      {copyButtonVariantIds.map((variant) => (
        <div key={variant} className="flex items-center gap-4">
          <span className="w-20 text-sm text-muted-foreground capitalize">
            {variant}
          </span>
          <CopyButton
            variant={variant}
            size="icon-sm"
            value={`Copied using "${variant}" variant`}
          />
          <CopyButton
            variant={variant}
            size="icon-md"
            value={`Copied using "${variant}" variant`}
          />
          <CopyButton
            variant={variant}
            size="icon-lg"
            value={`Copied using "${variant}" variant`}
          />
          <CopyButton
            variant={variant}
            size="md"
            value={`Copied using "${variant}" variant`}
            label="Copy"
          />
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase">sm</span>
          <CopyButton variant="outline" size="sm" label="Copy" value="sm" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase">md</span>
          <CopyButton variant="outline" size="md" label="Copy" value="md" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase">lg</span>
          <CopyButton variant="outline" size="lg" label="Copy" value="lg" />
        </div>
      </div>
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase">
            icon-sm
          </span>
          <CopyButton variant="outline" size="icon-sm" value="icon-sm" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase">
            icon-md
          </span>
          <CopyButton variant="outline" size="icon-md" value="icon-md" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase">
            icon-lg
          </span>
          <CopyButton variant="outline" size="icon-lg" value="icon-lg" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Typical usage: pairing the CopyButton with an inline code snippet. This is
 * the canonical pattern for displaying API keys, database connection strings,
 * or vault secrets in SchemaVaults UIs.
 */
export const InlineWithCodeSnippet: Story = {
  render: (): ReactElement => {
    const snippet: string = "npm install @schemavaults/ui";
    return (
      <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 p-1 pl-3 font-mono text-sm text-foreground">
        <code>{snippet}</code>
        <CopyButton variant="ghost" size="icon-sm" value={snippet} />
      </div>
    );
  },
};

/**
 * A "secret" style input paired with a copy button - common pattern for
 * revealing API keys, tokens, and other sensitive values.
 */
export const InlineWithSecret: Story = {
  render: (): ReactElement => {
    const secret: string = "svlt_demo_placeholder_not_a_real_secret_value";
    return (
      <div className="flex w-[420px] items-center gap-2">
        <div className="flex-1 truncate rounded-md border border-input bg-background px-3 py-2 font-mono text-sm text-foreground">
          {secret}
        </div>
        <CopyButton variant="outline" size="icon-md" value={secret} />
      </div>
    );
  },
};

/**
 * Wires the `onCopy` prop to Storybook's `fn()` spy so every call appears in
 * the Actions panel with both of its arguments (`success: boolean`,
 * `value: string`). Click the button and switch to the Actions tab to see
 * the captured invocations.
 */
export const WithOnCopyCallback: Story = {
  args: {
    variant: "outline",
    size: "md",
    label: "Copy",
    value: "onCopy fires with (success, value)",
    onCopy: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Click the button and switch to the **Actions** tab to see each " +
          "`onCopy(success, value)` invocation captured by Storybook's " +
          "`fn()` spy.",
      },
    },
  },
};

export const LongResetDelay: Story = {
  args: {
    variant: "outline",
    size: "md",
    label: "Copy",
    copiedLabel: "Copied — visible for 5s",
    resetDelay: 5000,
    value: "Copied with a 5s reset delay",
  },
};

function CopyButtonWithToastDemo(): ReactElement {
  const { toast } = useToast();
  const snippet: string = "npm install @schemavaults/ui";

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 p-1 pl-3 font-mono text-sm text-foreground">
      <code>{snippet}</code>
      <CopyButton
        variant="ghost"
        size="icon-sm"
        value={snippet}
        onCopy={(success, value): void => {
          if (success) {
            toast({
              variant: "default",
              title: "Copied successfully",
              description: `"${value}" was copied to your clipboard.`,
            });
          } else {
            toast({
              variant: "destructive",
              title: "Copy failed",
              description:
                "We couldn't access the clipboard. Try again or copy manually.",
            });
          }
        }}
      />
    </div>
  );
}

/**
 * Pairs the CopyButton with the Toaster to surface a success notification
 * after the clipboard write completes. Uses the onCopy callback to dispatch
 * the toast — the CopyButton's own "copied" state (icon swap) and the toast
 * are independent surfaces that stack naturally.
 */
export const WithSuccessToast: Story = {
  render: (): ReactElement => <CopyButtonWithToastDemo />,
  decorators: [
    (Story): ReactElement => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Click the copy button to fire a \"Copied successfully\" toast. " +
          "The toast is dispatched from the `onCopy` callback, which receives " +
          "the success flag and the original value written to the clipboard. " +
          "If the clipboard write fails, a destructive toast is shown instead.",
      },
    },
  },
};
