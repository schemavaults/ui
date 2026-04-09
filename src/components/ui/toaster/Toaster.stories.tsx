import type { Meta, StoryObj } from "@storybook/react";

import type { ReactElement } from "react";
import Button from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { Toaster } from "./toaster";

function ToasterDemo(): ReactElement {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        onClick={(e): void => {
          e.preventDefault();
          toast({
            variant: "default",
            title: "Default notification",
            description: "This is a default toast rendered by the Toaster.",
          });
        }}
      >
        Show Default Toast
      </Button>
      <Button
        variant="outline"
        onClick={(e): void => {
          e.preventDefault();
          toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong. Please try again.",
          });
        }}
      >
        Show Destructive Toast
      </Button>
      <Button
        variant="outline"
        onClick={(e): void => {
          e.preventDefault();
          toast({
            variant: "warning",
            title: "Warning",
            description: "This action may have unintended side effects.",
          });
        }}
      >
        Show Warning Toast
      </Button>
    </div>
  );
}

const meta = {
  title: "Components/Toaster",
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
  component: ToasterDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ToasterDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {};
