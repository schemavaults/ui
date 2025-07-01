import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import type { ReactElement } from "react";
import Button from "@/components/ui/button";
import { validToastVariantIds } from "./toast-variants";
import { useToast } from "@/components/hooks/use-toast";
import Toaster from "@/components/ui/toaster";

type ToastOptions = Parameters<ReturnType<typeof useToast>["toast"]>[0];

function ToastPlayground(props: ToastOptions): ReactElement {
  const { toast } = useToast();

  return (
    <Button
      variant={"outline"}
      onClick={(e): void => {
        e.preventDefault();
        toast(props);
      }}
    >
      Click to display a toast 🫡
    </Button>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Toast",
  decorators: [
    (Story) => {
      return (
        <>
          <Story />
          <Toaster />
        </>
      );
    },
  ],
  component: ToastPlayground,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      options: validToastVariantIds,
      control: {
        type: "radio",
      },
      type: "string",
    },
    title: {
      type: "string",
      control: "text",
    },
    description: {
      type: "string",
      control: "text",
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    title: "This is a toast title!",
    description: "This is a toast description!",
  },
} satisfies Meta<typeof ToastPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultToast: Story = {
  args: {
    variant: "default",
  },
};

export const DestructiveToast: Story = {
  args: {
    variant: "destructive",
    title: "This is a 'destructive' toast title!",
  },
};

export const WarningToast: Story = {
  args: {
    variant: "warning",
    title: "This is a 'warning' toast title!",
  },
};
