import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import Input from "./input";
import type { ReactElement } from "react";
import { fn } from "@storybook/test";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    placeholder: {
      type: "string",
      control: {
        type: "text",
      },
      description:
        "Text that appears until the user has filled the text input with a string value",
      table: {
        defaultValue: undefined,
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onChange: (): void => {
      fn();
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultTextInput: Story = {
  args: {},
};

export const NumberInput: Story = {
  args: {
    type: "number",
  },
};

export const RangeInput: Story = {
  args: {
    type: "range",
    step: 1,
    min: 0,
    max: 100,
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "This text input has placeholder text!",
  },
};
