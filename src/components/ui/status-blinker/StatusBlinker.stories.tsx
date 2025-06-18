import type { Meta, StoryObj } from "@storybook/react";

import { availableStatusBlinkerColors, StatusBlinker } from "./status-blinker";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Status Blinker",
  component: StatusBlinker,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    status: {
      options: availableStatusBlinkerColors,
      control: {
        type: "radio",
      },
      table: {
        type: {
          summary: "AvailableStatusBlinkerColors",
          detail: availableStatusBlinkerColors.map((s) => `'${s}'`).join(" | "),
        },
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof StatusBlinker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultStatusBlinker: Story = {
  args: {},
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ErrorStatus: Story = {
  args: {
    status: "red",
  },
};

export const WarningStatus: Story = {
  args: {
    status: "yellow",
  },
};

export const SuccessStatus: Story = {
  args: {
    status: "green",
  },
};
