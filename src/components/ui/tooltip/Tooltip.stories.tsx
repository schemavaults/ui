import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import {
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
  Tooltip,
  TooltipArrow,
} from "./tooltip";
import type { ReactElement } from "react";
import Button from "@/components/ui/button";

interface TooltipExampleProps {
  withArrow: boolean;
}

function TooltipExampleComponent(props: TooltipExampleProps): ReactElement {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Hover over me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
        {props.withArrow && <TooltipArrow />}
      </TooltipContent>
    </Tooltip>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Tooltip",
  component: TooltipExampleComponent,
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
    withArrow: false,
  },
  decorators: [
    (Story, context): ReactElement => {
      return (
        <TooltipProvider>
          <Story {...context} />
        </TooltipProvider>
      );
    },
  ],
} satisfies Meta<typeof TooltipExampleComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const TooltipExample: Story = {
  args: {},
};

export const WithArrow: Story = {
  args: {
    withArrow: true,
  },
};
