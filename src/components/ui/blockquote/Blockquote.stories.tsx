import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { Sparkles } from "lucide-react";

import {
  Blockquote,
  BlockquoteFooter,
  BlockquoteCite,
  blockquoteVariantIds,
  blockquoteEmphasisIds,
  blockquoteSizeIds,
  type BlockquoteVariantId,
  type BlockquoteEmphasisId,
  type BlockquoteSizeId,
} from "./blockquote";

interface BlockquoteExampleProps {
  variant?: BlockquoteVariantId;
  emphasis?: BlockquoteEmphasisId;
  size?: BlockquoteSizeId;
  author?: string;
  source?: string;
  showIcon?: boolean;
}

function BlockquoteExample({
  variant,
  emphasis,
  size,
  author,
  source,
  showIcon,
}: BlockquoteExampleProps): ReactElement {
  return (
    <div className="w-[640px] max-w-full">
      <Blockquote
        variant={variant}
        emphasis={emphasis}
        size={size}
        author={author === "" ? undefined : author}
        source={source === "" ? undefined : source}
        icon={showIcon === false ? null : undefined}
      >
        The best way to predict the future is to invent it. Schema-driven design
        gives you a way to encode that intent — once, in one place, where
        humans and machines agree.
      </Blockquote>
    </div>
  );
}

const meta = {
  title: "Components/Blockquote",
  component: BlockquoteExample,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: blockquoteVariantIds,
      control: { type: "select" },
    },
    emphasis: {
      options: blockquoteEmphasisIds,
      control: { type: "radio" },
    },
    size: {
      options: blockquoteSizeIds,
      control: { type: "radio" },
    },
    author: { control: { type: "text" } },
    source: { control: { type: "text" } },
    showIcon: { control: { type: "boolean" } },
  },
  args: {
    variant: "default",
    emphasis: "border",
    size: "default",
    author: "Alan Kay",
    source: "1971",
    showIcon: true,
  },
} satisfies Meta<typeof BlockquoteExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Accent: Story = {
  args: { variant: "accent" },
};

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Success: Story = {
  args: { variant: "success" },
};

export const Warning: Story = {
  args: { variant: "warning" },
};

export const Danger: Story = {
  args: { variant: "danger" },
};

export const Muted: Story = {
  args: { variant: "muted" },
};

export const CardEmphasis: Story = {
  args: { emphasis: "card", variant: "primary" },
};

export const GhostEmphasis: Story = {
  args: { emphasis: "ghost", variant: "muted" },
};

export const PullQuote: Story = {
  args: {
    emphasis: "pull",
    variant: "primary",
    size: "lg",
    showIcon: false,
    author: "Grace Hopper",
    source: undefined,
  },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const WithoutAttribution: Story = {
  args: { author: undefined, source: undefined },
};

export const WithoutIcon: Story = {
  args: { showIcon: false },
};

export const SourceOnly: Story = {
  args: { author: undefined, source: "RFC 9110, Section 8.3" },
};

export const AllVariantsBorder: Story = {
  render: () => (
    <div className="flex w-[640px] max-w-full flex-col gap-3">
      {blockquoteVariantIds.map((variant) => (
        <Blockquote
          key={variant}
          variant={variant}
          author={`The ${variant} variant`}
        >
          A short quote rendered with the{" "}
          <code className="font-mono text-xs not-italic">{variant}</code>{" "}
          variant. Theming colors come from{" "}
          <code className="font-mono text-xs not-italic">@schemavaults/theme</code>.
        </Blockquote>
      ))}
    </div>
  ),
};

export const AllEmphasisStyles: Story = {
  render: () => (
    <div className="flex w-[640px] max-w-full flex-col gap-4">
      {blockquoteEmphasisIds.map((emphasis) => (
        <Blockquote
          key={emphasis}
          variant="primary"
          emphasis={emphasis}
          author="Demo"
          source={emphasis}
        >
          A quote rendered with the{" "}
          <code className="font-mono text-xs not-italic">{emphasis}</code>{" "}
          emphasis style.
        </Blockquote>
      ))}
    </div>
  ),
};

export const TestimonialCard: Story = {
  render: () => (
    <div className="w-[640px] max-w-full">
      <Blockquote
        variant="primary"
        emphasis="card"
        size="lg"
        author="Ada Lovelace"
        source="Notes, 1843"
      >
        That brain of mine is something more than merely mortal; as time will
        show — schema-first thinking lets the machine carry what the mind cannot.
      </Blockquote>
    </div>
  ),
};

export const ComposedSubcomponents: Story = {
  render: () => (
    <div className="w-[640px] max-w-full">
      <Blockquote variant="accent" emphasis="card" icon={<Sparkles aria-hidden className="size-4" />}>
        Compose the footer manually when you need extra slots — for example,
        an avatar, a date, or a link to the original work.
        <BlockquoteFooter>
          <span className="font-medium text-foreground">Grace Hopper</span>
          <span aria-hidden className="text-muted-foreground/60">·</span>
          <BlockquoteCite>
            <a
              href="https://en.wikipedia.org/wiki/Grace_Hopper"
              className="underline underline-offset-2"
            >
              biography
            </a>
          </BlockquoteCite>
        </BlockquoteFooter>
      </Blockquote>
    </div>
  ),
};

export const LongFormProse: Story = {
  render: () => (
    <article className="w-[640px] max-w-full space-y-4 text-sm leading-relaxed text-foreground/80">
      <p>
        The pattern of separating presentation from data is older than the web
        itself, but the consequences are easiest to see today.
      </p>
      <Blockquote variant="muted" emphasis="ghost" size="lg">
        When the schema describes the shape, the UI follows. The UI never
        leads.
      </Blockquote>
      <p>
        That same principle is what makes this component library possible — the
        primitives know nothing about the data they will eventually render.
      </p>
    </article>
  ),
};
