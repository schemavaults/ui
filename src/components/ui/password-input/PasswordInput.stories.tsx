import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import PasswordInput from "./password-input";

const meta = {
  title: "Components/PasswordInput",
  component: PasswordInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      type: "string",
      control: {
        type: "text",
      },
      description: "Placeholder text for the password input",
    },
  },
  args: {
    onChange: (): void => {
      fn();
    },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Enter your password",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled password input",
    disabled: true,
  },
};
