import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";
import ErrorPage, { type ErrorPageProps } from "./ErrorPage";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Error Page",
  component: ErrorPage,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    error: {
      table: {
        type: {
          summary: "Error | number | string",
        },
      },
    },
    message: {
      control: "text",
      table: {
        type: {
          summary: "string | undefined",
        },
      },
      description:
        "Pass an additional message (for when 'error' is a string/number error code rather than a detailed 'Error' instance.",
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {} satisfies Partial<ErrorPageProps>,
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const FromErrorObject: Story = {
  args: {
    error: new Error("This error is from a JavaScript 'Error' instance!"),
  },
};

export const FromStatusCode: Story = {
  args: {
    error: 500,
    message: "Internal Server Error",
  },
};

export const FromErrorCode: Story = {
  args: {
    error: "NOT_FOUND",
    message: "Resource was not found!",
  },
};
