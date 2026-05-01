import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { LazyFramerMotionProvider } from "@/providers/lazy_framer";
import {
  CircularProgress,
  circularProgressSizeIds,
  circularProgressColorIds,
} from "./circular-progress";

const meta = {
  title: "Components/CircularProgress",
  component: CircularProgress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Circular / ring-style progress indicator. A drop-in alternative to [`ProgressBar`](?path=/docs/components-progressbar--docs) for compact, fixed-width areas (dashboard tiles, sync indicators, storage gauges, completion rings). Same API conventions as `ProgressBar` (`value`, `label`, `min`, `max`, `color`, `size`).\n\n**See also:** [ProgressBar](?path=/docs/components-progressbar--docs) — the horizontal-bar counterpart.",
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
      options: circularProgressSizeIds,
      control: {
        type: "radio",
      },
    },
    color: {
      options: circularProgressColorIds,
      control: {
        type: "radio",
      },
    },
    showValue: {
      control: {
        type: "boolean",
      },
    },
    strokeWidth: {
      control: {
        type: "number",
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
    showValue: true,
  },
  decorators: [
    (Story): ReactElement => {
      return (
        <LazyFramerMotionProvider>
          <Story />
        </LazyFramerMotionProvider>
      );
    },
  ],
} satisfies Meta<typeof CircularProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 65,
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
    color: "positive",
  },
};

export const Small: Story = {
  args: {
    value: 40,
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

export const ExtraLarge: Story = {
  args: {
    value: 80,
    label: "Upload progress",
    size: "xl",
  },
};

export const Positive: Story = {
  args: {
    value: 100,
    label: "Sync complete",
    color: "positive",
  },
};

export const Warning: Story = {
  args: {
    value: 60,
    label: "Storage usage",
    color: "warning",
  },
};

export const Destructive: Story = {
  args: {
    value: 92,
    label: "Storage usage",
    color: "destructive",
  },
};

export const WithoutValue: Story = {
  args: {
    value: 33,
    label: "Indeterminate-looking progress",
    showValue: false,
  },
};

export const CustomRange: Story = {
  args: {
    value: 7,
    label: "Steps completed",
    min: 0,
    max: 10,
    size: "lg",
  },
};

export const CustomCenterContent: Story = {
  args: {
    value: 42,
    label: "Tasks completed",
    size: "xl",
    children: (
      <div className="flex flex-col items-center justify-center leading-tight">
        <span className="text-2xl font-bold">42</span>
        <span className="text-xs text-muted-foreground">tasks</span>
      </div>
    ),
  },
};

export const ThickStroke: Story = {
  args: {
    value: 70,
    label: "Bold progress",
    size: "lg",
    strokeWidth: 14,
  },
};

export const AllColors: Story = {
  args: {
    value: 75,
    label: "Sample",
  },
  render: (args): ReactElement => (
    <div className="flex flex-wrap items-center gap-6">
      {circularProgressColorIds.map((color) => (
        <CircularProgress
          key={color}
          {...args}
          color={color}
          label={`${color} progress`}
        />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  args: {
    value: 65,
    label: "Sample",
  },
  render: (args): ReactElement => (
    <div className="flex flex-wrap items-center gap-6">
      {circularProgressSizeIds.map((size) => (
        <CircularProgress
          key={size}
          {...args}
          size={size}
          label={`${size} progress`}
        />
      ))}
    </div>
  ),
};
