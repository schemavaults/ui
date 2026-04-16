import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { LazyFramerMotionProvider } from "@/providers/lazy_framer";
import { progressBarSizeIds } from "@/components/ui/progress-bar";
import {
  SecurePasswordCreationInput,
  type SecurePasswordCreationInputProps,
  type PasswordRequirement,
} from "./index";

function SecurePasswordCreationInputWrapper(
  props: Omit<SecurePasswordCreationInputProps, "value" | "onChange">,
): ReactElement {
  const [value, setValue] = useState<string>("");
  return (
    <SecurePasswordCreationInput
      {...props}
      value={value}
      onChange={(e): void => setValue(e.target.value)}
    />
  );
}

const meta = {
  title: "Components/SecurePasswordCreationInput",
  component: SecurePasswordCreationInputWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      type: "string",
      control: { type: "text" },
      description: "Placeholder text for the password input",
    },
    hideChecklist: {
      control: { type: "boolean" },
      description: "Hide the requirement checklist",
    },
    hideProgressBar: {
      control: { type: "boolean" },
      description: "Hide the progress bar",
    },
    progressBarSize: {
      options: progressBarSizeIds,
      control: { type: "radio" },
      description: "Size of the progress bar",
    },
  },
  args: {
    placeholder: "Create a strong password",
  },
  decorators: [
    (Story): ReactElement => (
      <LazyFramerMotionProvider>
        <div style={{ width: "360px" }}>
          <Story />
        </div>
      </LazyFramerMotionProvider>
    ),
  ],
} satisfies Meta<typeof SecurePasswordCreationInputWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Enter your new password",
  },
};

export const ProgressBarOnly: Story = {
  args: {
    hideChecklist: true,
    placeholder: "Password (checklist hidden)",
  },
};

export const ChecklistOnly: Story = {
  args: {
    hideProgressBar: true,
    placeholder: "Password (progress bar hidden)",
  },
};

export const LargeProgressBar: Story = {
  args: {
    progressBarSize: "lg",
    placeholder: "Password with large bar",
  },
};

export const CustomRequirements: Story = {
  args: {
    placeholder: "Custom requirements demo",
    requirements: [
      {
        id: "min-length-12",
        label: "At least 12 characters",
        validate: (password: string): boolean => password.length >= 12,
      },
      {
        id: "no-spaces",
        label: "No spaces allowed",
        validate: (password: string): boolean => !/\s/.test(password),
      },
      {
        id: "number",
        label: "At least one number",
        validate: (password: string): boolean => /\d/.test(password),
      },
    ] satisfies PasswordRequirement[],
  },
};
