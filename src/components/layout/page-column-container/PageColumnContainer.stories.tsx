import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import type { ReactElement, ReactNode } from "react";

import PageColumnContainer, {
  type PageColumnContainerProps,
} from "./page-column-container";
import LoremIpsumText from "@/stories/LoremImpsumText";

function ExampleChildrenForContainer(): ReactNode {
  return (
    <div>
      <p>{LoremIpsumText}</p>
    </div>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Layouts/Page Column Container",
  component: PageColumnContainer,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    children: {
      control: {},
      description: "React children to render within container component",
      table: {
        disable: true,
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    children: <ExampleChildrenForContainer />,
  },
} satisfies Meta<typeof PageColumnContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const LayoutPreview: Story = {
  args: {},
};
