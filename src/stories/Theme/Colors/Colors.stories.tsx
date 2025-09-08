// colors.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import TailwindColorDemo from "./TailwindColorDemo";

const meta: Meta<typeof TailwindColorDemo> = {
  title: "Theme/Colors",
  component: TailwindColorDemo,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllColors: Story = {};
