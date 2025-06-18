import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import Separator, { type SeparatorProps } from "./separator";
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Separator",
  component: Separator,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    orientation: {
      options: ["horizontal", "vertical"],
      control: {
        type: "inline-radio",
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
  decorators: [
    (Story, context): ReactElement => {
      const args = context.args;
      const orientation = args.orientation;

      const isColumnContainer = orientation === "horizontal";

      return (
        <div
          className={cn(
            "flex",
            isColumnContainer ? "flex-col" : "flex-row",
            isColumnContainer
              ? "justify-center items-stretch"
              : "justify-start items-center",

            "gap-4",
            "border p-4 rounded-md",
          )}
        >
          <p>Item 1</p>
          <Story {...context} />
          <p>Item 2</p>
          <Story {...context} />
          <p>Item 3</p>
        </div>
      );
    },
  ],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const VerticalSeparator: Story = {
  args: {
    orientation: "vertical",
    decorative: true,
    style: {
      height: "24px",
    },
  },
};

export const HorizontalSeparator: Story = {
  args: {
    orientation: "horizontal",
    decorative: true,
  },
};
