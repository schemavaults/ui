import type { Meta, StoryObj } from "@storybook/react";
import Label from "./label";
import type { ReactElement } from "react";
import Input from "@/components/ui/input";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Label",
  component: Label,
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
  decorators: [
    (Story, context): ReactElement => {
      const args = context.args;
      const htmlFor = args.htmlFor;
      const children = args.children;
      return (
        <div className="flex flex-row gap-4 flex-nowrap items-center">
          <Label htmlFor={htmlFor} {...args}>
            {children}
          </Label>
          <Input
            id={htmlFor}
            placeholder="Click label to select this"
            className="grow"
          />
        </div>
      );
    },
  ],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ExampleLabelForInput: Story = {
  args: {
    children: "Name:",
    htmlFor: "example-name-input-id",
  },
};
