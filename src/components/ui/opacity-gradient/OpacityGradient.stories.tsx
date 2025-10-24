import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import OpacityGradient, { type OpacityGradientProps } from "./opacity-gradient";
import type { ReactElement } from "react";
import LoremIpsumText from "@/stories/LoremImpsumText";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "@/framer-motion";

interface OpacityGradientExampleProps extends OpacityGradientProps {}

function OpacityGradientExample(
  props: OpacityGradientExampleProps,
): ReactElement {
  const exampleText: string = new Array(5).fill(LoremIpsumText).join(" ");

  return (
    <div
      className={cn(
        "relative",
        "p-2 border border-black rounded-md h-48 w-80",
        "flex flex-col items-stretch justify-start",
      )}
    >
      <p className="w-full grow overflow-y-scroll">{exampleText}</p>
      <AnimatePresence initial={false}>
        <OpacityGradient key={"opacity-gradient"} className={props.className} />
      </AnimatePresence>
    </div>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Opacity Gradient",
  component: OpacityGradientExample,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
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
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof OpacityGradientExample>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {
    className: "h-24 absolute bottom-0 left-0 right-0 pointer-events-none",
  },
};
