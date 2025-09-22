import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import type { ReactElement } from "react";
import Slider from "./slider";

import { useArgs } from "@storybook/preview-api";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Slider",
  component: Slider,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    className: {
      control: {
        type: "text",
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
    value: {
      control: {
        type: "number",
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
  decorators: [
    (Story, { ...context }) => {
      const [{ value }, updateArgs] = useArgs();
      return (
        <Story
          {...context}
          args={{
            ...context.args,
            value: typeof value === "number" ? [value] : value,
            onValueChange: (value: number[]) => {
              updateArgs({
                ...context.args,
                value,
              });
            },
          }}
        />
      );
    },
    (Story) => {
      return (
        <div className="w-full h-full min-h-screen flex items-center justify-center">
          <div className="w-[40vw] h-40">
            <Story />
          </div>
        </div>
      );
    },
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const SliderExample: Story = {
  args: {
    className: "w-60 rounded-md",
    min: 0,
    max: 100,
    value: 50 as any,
  },
};
