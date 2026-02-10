import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import Switch from "./switch";
import type { ReactElement } from "react";
import { SwitchProps } from "@radix-ui/react-switch";
import { useArgs } from "@storybook/preview-api";

const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "inline-radio",
      options: [true, false],
    },
  },
  args: {
    checked: false,
    onCheckedChange: fn(),
  },
  decorators: [
    (Story, context): ReactElement => {
      const [args, setArgs] = useArgs<SwitchProps>();

      function onCheckedChange(checked: boolean): void {
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
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
