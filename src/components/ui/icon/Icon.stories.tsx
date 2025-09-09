import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps, ReactElement } from "react";
import { fn } from "@storybook/test";
import Icon, { DEFAULT_ICON_SIZE } from "./Icon";

// Sample images for demo purposes
const sampleSvg = "/media/example_images/calendar.svg";

const meta = {
  title: "Components/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "The Icon components loads a .svg file and renders it with styling",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Source for the SVG icon",
    },
    size: {
      control: "range",
      type: "number",
      defaultValue: DEFAULT_ICON_SIZE,
    },
  },
  args: {
    size: DEFAULT_ICON_SIZE,
    src: sampleSvg,
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: sampleSvg,
  },
};

export const Large: Story = {
  args: {
    src: sampleSvg,
    size: 96,
  },
};

export const CustomStyle: Story = {
  args: {
    src: sampleSvg,
    className: "text-red-500",
    size: 48,
    style: {
      fill: "currentColor",
    },
  },
};

export const BlueStyled: Story = {
  args: {
    src: sampleSvg,
    size: 64,
    style: {
      fill: "#3b82f6",
      stroke: "#1e40af",
      strokeWidth: 1,
    },
  },
};

export const Small: Story = {
  args: {
    src: sampleSvg,
    size: 16,
  },
};

export const ExtraLarge: Story = {
  args: {
    src: sampleSvg,
    size: 128,
    style: {
      fill: "#10b981",
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    src: sampleSvg,
    size: 48,
    className: "hover:scale-110 transition-transform cursor-pointer",
    style: {
      fill: "#8b5cf6",
    },
  },
};
