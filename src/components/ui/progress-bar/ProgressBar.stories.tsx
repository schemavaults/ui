import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { LazyFramerMotionProvider } from "@/providers/lazy_framer";
import {
  ProgressBar,
  progressBarSizeIds,
  progressBarColorIds,
} from "./progress-bar";

const meta = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Horizontal progress bar. For a circular/ring-style progress indicator with the same API and theming, see [`CircularProgress`](?path=/docs/components-circularprogress--docs) — useful for compact dashboard tiles and fixed-width areas where a horizontal bar would not fit.\n\n**See also:** [CircularProgress](?path=/docs/components-circularprogress--docs) — the circular counterpart.",
      },
    },
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
    color: {
      options: progressBarColorIds,
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

export const Positive: Story = {
  args: {
    value: 100,
    label: "Success",
    color: "positive",
  },
};

export const Warning: Story = {
  args: {
    value: 60,
    label: "Moderate progress",
    color: "warning",
  },
};

export const Destructive: Story = {
  args: {
    value: 25,
    label: "Low progress",
    color: "destructive",
  },
};
