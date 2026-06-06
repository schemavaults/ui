import type { Meta, StoryObj } from "@storybook/react";
import PackageVersion from "./package-version";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/PackageVersion",
  component: PackageVersion,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    className: {
      control: "text",
    },
    packageJsonUrl: {
      control: "text",
    },
    prefix: {
      control: "text",
    },
  },
  args: {},
} satisfies Meta<typeof PackageVersion>;

export default meta;
type Story = StoryObj<typeof meta>;

// Fetches the live version from the Storybook site's own `/package.json`.
export const Default: Story = {
  args: {},
};

export const WithoutPrefix: Story = {
  args: {
    prefix: "",
  },
};
