import type { Meta, StoryObj } from "@storybook/react";
import type { FC, ReactElement, ReactNode } from "react";

import ThemedPageContainer from "./themed-page-container";
import LoremIpsumText from "@/stories/LoremImpsumText";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";

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

function ExampleCardSection({
  title,
  n_paragraphs = 3,
}: {
  title: string;
  n_paragraphs?: number;
}): ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>This is an example description for {title}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <ExampleChildrenForContainer n_paragraphs={n_paragraphs} />
      </CardContent>

      <CardFooter>
        <p>This is the footer for {title}!</p>
      </CardFooter>
    </Card>
  )
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
    backgroundClassName: {
      control: {
        type: 'text'
      },
      description: "Classname to apply to the background container",
    },
    contentContainerClassName: {
      control: {
        type: 'text'
      },
      description: "Classname to apply to the content container within the themed page container",
    },
    additionalContentContainerClassName: {
      control: {
        type: 'text'
      },
      description: "Classname that is added to either the default or provided 'contentContainerClassName'",
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
  args: {
    additionalContentContainerClassName: "bg-background p-2 sm:p-4 lg:p-6",
  },
};

export const MultipleCardSections: Story = {
  args: {
    children: (
      <>
        <ExampleCardSection title="Section 1" />
        <ExampleCardSection title="Section 2" />
        <ExampleCardSection title="Section 3" />
      </>
    )
  },
};
