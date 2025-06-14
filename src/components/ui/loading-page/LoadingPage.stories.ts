import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";
import LoadingPage, { type LoadingPageProps } from "./loading-page";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Loading Page",
  component: LoadingPage,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    message: {
      control: "text",
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {} satisfies LoadingPageProps,
} satisfies Meta<typeof LoadingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {},
};

export const WithCustomMessage: Story = {
  args: {
    message: "Waiting for something to load...",
  },
};
