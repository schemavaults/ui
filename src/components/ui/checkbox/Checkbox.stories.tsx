import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import Checkbox from "./checkbox";
import type { ReactElement } from "react";
import { CheckboxProps, CheckedState } from "@radix-ui/react-checkbox";
import { useArgs } from "@storybook/preview-api";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    checked: {
      control: "inline-radio",
      options: [true, false, "indeterminate"] satisfies readonly CheckedState[],
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    checked: false,
    onChange: fn(),
    onCheckedChange: fn(),
  },
  decorators: [
    (Story, context): ReactElement => {
      const [args, setArgs] = useArgs<CheckboxProps>();

      function onCheckedChange(checked: CheckedState): void {
        fn();
        setArgs({ checked });
      }

      return (
        <Story
          {...context}
          args={{ ...args, checked: args.checked, onCheckedChange }}
        />
      );
    },
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultCheckbox: Story = {
  args: {},
};

export const StartAsChecked: Story = {
  args: {
    checked: true,
  },
};

export const StyledCheckbox: Story = {
  args: {
    className:
      "w-16 h-16 bg-red-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-blue-500",
  },
};
