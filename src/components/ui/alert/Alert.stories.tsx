import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import {
  Alert,
  AlertTitle,
  AlertDescription,
  alertVariantIds,
  type AlertVariantId,
} from "./alert";
import type { ReactElement } from "react";

interface AlertExampleProps {
  variant?: AlertVariantId;
}

function AlertExample(props: AlertExampleProps): ReactElement {
  return (
    <Alert {...props}>
      <AlertTitle>{"This is an <Alert />"}</AlertTitle>
      <AlertDescription>
        This is a description for the alert containing more information about
        why an alert is being shown!
      </AlertDescription>
    </Alert>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Alert",
  component: AlertExample,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      options: alertVariantIds,
      control: {
        type: "radio",
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof AlertExample>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultAlert: Story = {
  args: {
    variant: "default",
  },
};

export const DestructiveAlert: Story = {
  args: {
    variant: "destructive",
  },
};

export const WarningAlert: Story = {
  args: {
    variant: "warning",
  },
};
