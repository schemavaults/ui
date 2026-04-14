import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement, ReactNode } from "react";

import { Kbd, KbdGroup } from "./kbd";
import {
  kbdSizeIds,
  kbdVariantIds,
  type KbdSize,
  type KbdVariant,
} from "./kbd-variants";

interface KbdExampleProps {
  variant?: KbdVariant;
  size?: KbdSize;
  children?: ReactNode;
}

function KbdExample({
  children = "⌘K",
  ...props
}: KbdExampleProps): ReactElement {
  return <Kbd {...props}>{children}</Kbd>;
}

const meta = {
  title: "Components/Kbd",
  component: KbdExample,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: kbdVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: kbdSizeIds,
      control: { type: "radio" },
    },
    children: {
      control: { type: "text" },
    },
  },
  args: {
    children: "⌘K",
    variant: "default",
    size: "md",
  },
} satisfies Meta<typeof KbdExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "⌘",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Enter",
  },
};

export const Solid: Story = {
  args: {
    variant: "solid",
    children: "Esc",
  },
};

export const Subtle: Story = {
  args: {
    variant: "subtle",
    children: "Tab",
  },
};

export const Small: Story = {
  args: {
    variant: "default",
    size: "sm",
    children: "⌘",
  },
};

export const Large: Story = {
  args: {
    variant: "default",
    size: "lg",
    children: "Shift",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      {kbdVariantIds.map((variant) => (
        <div key={variant} className="flex items-center gap-4">
          <span className="w-20 text-sm text-muted-foreground capitalize">
            {variant}
          </span>
          {kbdSizeIds.map((size) => (
            <Kbd key={size} variant={variant} size={size}>
              ⌘K
            </Kbd>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const KeyboardShortcut: Story = {
  render: () => (
    <KbdGroup separator="+">
      <Kbd>⌘</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  ),
};

export const CommandPaletteShortcut: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Open the command palette with</span>
      <KbdGroup separator="+">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  ),
};

export const SequenceShortcut: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Press</span>
      <KbdGroup separator="then">
        <Kbd>g</Kbd>
        <Kbd>d</Kbd>
      </KbdGroup>
      <span>to go to dashboard</span>
    </div>
  ),
};

export const InlineInText: Story = {
  render: () => (
    <p className="max-w-md text-sm text-foreground leading-6">
      Press <Kbd size="sm">Esc</Kbd> at any time to close this dialog, or hit{" "}
      <KbdGroup separator="+" size="sm">
        <Kbd size="sm">⌘</Kbd>
        <Kbd size="sm">Enter</Kbd>
      </KbdGroup>{" "}
      to submit.
    </p>
  ),
};

export const AllSizesSideBySide: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {kbdSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {size}
          </span>
          <KbdGroup separator="+" size={size}>
            <Kbd size={size}>Ctrl</Kbd>
            <Kbd size={size}>C</Kbd>
          </KbdGroup>
        </div>
      ))}
    </div>
  ),
};
