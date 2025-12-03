import type { Meta, StoryObj } from "@storybook/react";
import type { FC, ReactNode } from "react";

import ThemedPageContainer from "./themed-page-container";
import LoremIpsumText from "@/stories/LoremImpsumText";

function ExampleChildrenForContainer({
  n_paragraphs = 12,
}: {
  n_paragraphs: number;
}): ReactNode {
  const paragraphs: FC[] = [];
  for (let i = 0; i < n_paragraphs; i++) {
    paragraphs.push(() => <p>{LoremIpsumText}</p>);
  }
  return (
    <>
      {paragraphs.map((Paragraph, index: number) => (
        <Paragraph key={`paragraph-${index}`} />
      ))}
    </>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Layouts/Themed Page Container",
  component: ThemedPageContainer,
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
    children: <ExampleChildrenForContainer n_paragraphs={12} />,
  },
} satisfies Meta<typeof ThemedPageContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const LayoutPreview: Story = {
  args: {},
};
