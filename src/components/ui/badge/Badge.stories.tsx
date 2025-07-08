import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import type { ReactElement } from "react";
import Badge from "./badge";
import { badgeVariantIds } from "./badge-variants";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      options: badgeVariantIds,
      control: {
        type: "radio",
      },
    },
    children: {
      control: {
        type: "text",
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    children: "Badge Content",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultBadge: Story = {
  args: {
    variant: "default",
  },
};

export const DestructiveBadge: Story = {
  args: {
    variant: "destructive",
  },
};

export const SecondaryBadge: Story = {
  args: {
    variant: "secondary",
  },
};

export const OutlinedBadge: Story = {
  args: {
    variant: "outline",
  },
};
