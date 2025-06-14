import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "./card";
import type { ReactElement } from "react";

interface CardExampleProps {}

function CardExample(props: CardExampleProps): ReactElement {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          This is a description for the card containing more information about
          why this card is being shown!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is content for the card!</p>
      </CardContent>
      <CardFooter>
        <p>This is the footer for the card!</p>
      </CardFooter>
    </Card>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Card",
  component: CardExample,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof CardExample>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultCard: Story = {
  args: {},
};
