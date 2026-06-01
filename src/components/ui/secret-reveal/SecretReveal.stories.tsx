import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { useState, type ReactElement } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SecretReveal } from "./secret-reveal";
import {
  secretRevealMaskStyleIds,
  secretRevealSizeIds,
  secretRevealVariantIds,
} from "./secret-reveal-variants";

const EXAMPLE_API_KEY: string = "sv_live_4f7a9b2c3d8e1f5a6b9c0d2e3f4a5b6c";
const EXAMPLE_SHORT_TOKEN: string = "abc123-xyz789";

const meta = {
  title: "Components/SecretReveal",
  component: SecretReveal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Display a sensitive value (API keys, tokens, secrets) masked " +
          "by default with a click-to-reveal toggle. Supports a built-in copy " +
          "button, an auto-hide timer, and three masking styles (dots, " +
          "asterisks, blur). The unmasked value is selectable and copyable; " +
          "the masked value is not, so users can't accidentally leak it via " +
          "select-all/copy.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: secretRevealVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: secretRevealSizeIds,
      control: { type: "radio" },
    },
    maskStyle: {
      options: secretRevealMaskStyleIds,
      control: { type: "radio" },
    },
    maskLength: {
      options: ["match", "fixed", 8, 16, 32],
      control: { type: "select" },
    },
    value: { control: { type: "text" } },
    label: { control: { type: "text" } },
    showCopyButton: { control: { type: "boolean" } },
    showRevealToggle: { control: { type: "boolean" } },
    defaultRevealed: { control: { type: "boolean" } },
    autoHideAfter: {
      options: [false, 2000, 5000, 10000],
      control: { type: "select" },
    },
  },
  args: {
    value: EXAMPLE_API_KEY,
    variant: "default",
    size: "md",
    maskStyle: "dots",
    maskLength: "match",
    showCopyButton: true,
    showRevealToggle: true,
    defaultRevealed: false,
    autoHideAfter: false,
    onRevealChange: fn(),
  },
} satisfies Meta<typeof SecretReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default appearance: dot-masked, with reveal and copy buttons. */
export const Default: Story = {
  args: {
    variant: "default",
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/** Outlined variant — useful inside forms or read-only summary panels. */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/** Subtle/ghost variant for dense lists of secrets. */
export const Subtle: Story = {
  args: {
    variant: "subtle",
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/** Terminal variant — dark monospace surface for CLI-style contexts. */
export const Terminal: Story = {
  args: {
    variant: "terminal",
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/** Brand-tinted variant, themed with the SchemaVaults brand blue. */
export const Brand: Story = {
  args: {
    variant: "brand",
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/** Asterisks mask style — the classic password masking look. */
export const AsteriskMask: Story = {
  args: {
    variant: "outline",
    maskStyle: "asterisks",
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Blur mask style — applies a CSS blur to the real value instead of
 * substituting characters. Smoother visual transition when revealing.
 */
export const BlurMask: Story = {
  args: {
    variant: "outline",
    maskStyle: "blur",
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * `maskLength="fixed"` renders a fixed number of mask characters, hiding
 * the true length of the secret — useful when you don't want to leak any
 * information about the secret while it's hidden.
 */
export const FixedMaskLength: Story = {
  args: {
    variant: "outline",
    maskLength: "fixed",
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Pair with a `<Label>` to use inside forms. The reveal control is keyboard
 * accessible and announces its state to screen readers.
 */
export const WithLabel: Story = {
  args: {
    variant: "outline",
    label: undefined,
  },
  render: (args): ReactElement => (
    <div className="flex w-[420px] flex-col gap-1.5">
      <Label htmlFor="api-key-secret">Production API key</Label>
      <SecretReveal id="api-key-secret" {...args} />
      <span className="text-xs text-muted-foreground">
        Click the eye to reveal. The value will remain visible until you hide it.
      </span>
    </div>
  ),
};

/** A short label can be rendered inline, to the left of the value. */
export const InlineLabel: Story = {
  args: {
    variant: "outline",
    label: "API key",
    value: EXAMPLE_SHORT_TOKEN,
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * `autoHideAfter` re-masks the value automatically after the given
 * duration (in ms). Helpful when a secret should never linger on-screen.
 */
export const AutoHide: Story = {
  args: {
    variant: "outline",
    autoHideAfter: 3000,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Reveal the secret and watch it re-mask automatically after 3 " +
          "seconds. The countdown resets every time you reveal.",
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

/**
 * All three sizes side by side. The action buttons scale with the size of
 * the surrounding row.
 */
export const Sizes: Story = {
  args: {
    variant: "outline",
  },
  render: (args): ReactElement => (
    <div className="flex w-[480px] flex-col gap-3">
      <SecretReveal {...args} size="sm" />
      <SecretReveal {...args} size="md" />
      <SecretReveal {...args} size="lg" />
    </div>
  ),
};

/**
 * All available variants in one place. Useful for visual regression and
 * design-system reviews.
 */
export const AllVariants: Story = {
  args: {},
  render: (args): ReactElement => (
    <div className="flex w-[520px] flex-col gap-3">
      {secretRevealVariantIds.map((variant): ReactElement => (
        <div key={variant} className="flex flex-col gap-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </Label>
          <SecretReveal {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};

/**
 * Controlled mode: own the revealed state and drive it from external UI.
 * The example below toggles the secret from a separate button.
 */
function ControlledExample(): ReactElement {
  const [revealed, setRevealed] = useState<boolean>(false);
  return (
    <div className="flex w-[480px] flex-col gap-3">
      <SecretReveal
        value={EXAMPLE_API_KEY}
        variant="outline"
        label="Token"
        revealed={revealed}
        onRevealChange={setRevealed}
      />
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(): void => setRevealed((prev) => !prev)}
        >
          {revealed ? "Hide externally" : "Reveal externally"}
        </Button>
        <span className="text-xs text-muted-foreground">
          State: {revealed ? "revealed" : "hidden"}
        </span>
      </div>
    </div>
  );
}

export const Controlled: Story = {
  render: (): ReactElement => <ControlledExample />,
};

/**
 * Realistic "vault entry" composition: stacked secrets with leading icons,
 * inline labels, and per-row reveal. Demonstrates the component inside a
 * compact list — the same layout you'd use in a credential or API-key
 * management screen.
 */
export const VaultEntryList: Story = {
  render: (): ReactElement => (
    <div className="flex w-[520px] flex-col gap-3 rounded-lg border border-border bg-background p-4">
      <div className="flex flex-col gap-1.5">
        <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
          <KeyRound className="size-3.5" aria-hidden="true" />
          Live API key
        </Label>
        <SecretReveal
          variant="outline"
          value="sv_live_4f7a9b2c3d8e1f5a6b9c0d2e3f4a5b6c"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
          <KeyRound className="size-3.5" aria-hidden="true" />
          Test API key
        </Label>
        <SecretReveal
          variant="outline"
          value="sv_test_8d2f6a4b1e9c7d3a5b8c1d4e7f2a9b6c"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Webhook signing secret
        </Label>
        <SecretReveal
          variant="brand"
          maskStyle="asterisks"
          maskLength="fixed"
          autoHideAfter={5000}
          value="whsec_2c4b8a1f9e3d6c2b5a8f1e4d7c0b3a6f"
        />
      </div>
    </div>
  ),
};
