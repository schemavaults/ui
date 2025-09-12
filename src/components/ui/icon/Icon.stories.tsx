import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps, ReactElement } from "react";
import { fn } from "@storybook/test";
import Icon, { DEFAULT_ICON_SIZE } from "./Icon";
import parseSvgIcon from "./parseSvgIcon";

// Sample image within storybook-assets/ folder for demo purposes
const sampleSvg: string = "/media/example_images/calendar.svg";
const rawSampleSvg: string = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`;

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

/**
 * @description You can pass raw **'\<svg>...</svg>'** UTF-8 string
 */
export const InlinedInsteadOfFilepath: Story = {
  args: {
    src: rawSampleSvg,
    size: 48,
    className: "hover:scale-110 transition-transform cursor-pointer",
    style: {
      fill: "#9b7c02",
    },
  },
};

/**
 * @description Pass an initialized SVGSVGElement instance as the 'src' property
 *
 * @see parseSvgIcon
 */
export const PreloadedAsSrc: Story = {
  args: {
    src: parseSvgIcon(rawSampleSvg) satisfies SVGSVGElement,
    size: 48,
    style: {
      fill: "#00ffff",
    },
  },
  argTypes: {
    src: {
      table: {
        disable: true,
      },
    },
  },
};
