import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { LazyFramerMotionProvider } from "@/providers/lazy_framer";
import { ProgressBar, progressBarSizeIds } from "./progress-bar";

const meta = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
      },
    },
    size: {
      options: progressBarSizeIds,
      control: {
        type: "radio",
      },
    },
    min: {
      control: {
        type: "number",
      },
    },
    max: {
      control: {
        type: "number",
      },
    },
  },
  args: {
    value: 50,
    label: "Progress",
    min: 0,
    max: 100,
  },
  decorators: [
    (Story): ReactElement => {
      return (
        <LazyFramerMotionProvider>
          <div style={{ width: "320px" }}>
            <Story />
          </div>
        </LazyFramerMotionProvider>
      );
    },
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
    label: "Upload progress",
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    label: "Upload progress",
  },
};

export const Full: Story = {
  args: {
    value: 100,
    label: "Upload progress",
  },
};

export const Small: Story = {
  args: {
    value: 65,
    label: "Upload progress",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    value: 75,
    label: "Upload progress",
    size: "lg",
  },
};

export const CustomRange: Story = {
  args: {
    value: 7,
    label: "Steps completed",
    min: 0,
    max: 10,
  },
};
