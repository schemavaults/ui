import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import FileInput from "./FileInput";
import { fn } from "@storybook/test";
import Toaster from "@/components/ui/toaster";
import bufferToBase64Url from "./bufferToBase64Url";
import { Buffer } from "buffer";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/File Input",
  component: FileInput,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    id: "file-input",
    onBlur: fn(),
    setValue: fn(),
    bufferToBase64Url: (buffer: Buffer, debug?: boolean) =>
      bufferToBase64Url(buffer, debug ?? false),
    debug: process.env.NODE_ENV === "development",
  },
  decorators: [
    (Story) => {
      return (
        <>
          <Story />
          <Toaster />
        </>
      );
    },
  ],
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultFileInput: Story = {
  args: {},
};

export const OnlyForCertainExtensions: Story = {
  args: {
    expectedFileExtensions: [".png"],
  },
};
