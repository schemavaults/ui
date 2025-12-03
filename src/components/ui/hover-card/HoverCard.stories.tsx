import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import type { ReactElement } from "react";
import { fn } from "@storybook/test";
import Button from "@/components/ui/button";

function HoverCardDemo(): ReactElement {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@schemavaults</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <img
            src="/media/icon.png"
            alt="SchemaVaults icon for example hover card story"
            width={64}
            height={64}
          />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@schemavaults</h4>
            <p className="text-sm">The data storage solution</p>
            <div className="text-muted-foreground text-xs">
              Launching in 2025
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Hover Card",
  component: HoverCardDemo,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onChange: (): void => {
      fn();
    },
  },
} satisfies Meta<typeof HoverCardDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ExampleHoverCard: Story = {
  args: {},
};
