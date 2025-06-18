import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import KeyValueWithSkeleton from "./key-value-with-skeleton";
import type { ReactElement } from "react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Key Value with Skeleton",
  component: KeyValueWithSkeleton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof KeyValueWithSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const NeverResolves: Story = {
  args: {
    label: "Null Value",
  },
};

export const FixedValue: Story = {
  args: {
    label: "Fixed Value",
    value: "some fixed string value!",
  },
};

function createExamplePromise(): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("value resolved from timeout promise after 2s!");
    }, 2000);
  });
}

export const PromiseValue: Story = {
  args: {
    label: "Promise Value",
    value: null,
  },
  argTypes: {
    value: {
      table: {
        disable: true,
      },
    },
  },
  decorators: [
    (Story, context): ReactElement => {
      return (
        <Story
          {...context}
          args={{
            ...context.args,
            value: createExamplePromise(),
          }}
        />
      );
    },
  ],
};
