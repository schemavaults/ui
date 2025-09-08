import { cn } from "@/lib/utils";
import LoremIpsumText from "@/stories/LoremImpsumText";
import type { Meta, StoryObj } from "@storybook/react";
import { useMemo } from "react";

interface ExampleScrollableContentProps {
  className?: string;
}

function ExampleScrollableContent({
  className,
}: ExampleScrollableContentProps) {
  const hasNoScrollbarSet: boolean = useMemo(() => {
    if (typeof className === "string" && className.includes("no-scrollbar")) {
      return true;
    }
    return false;
  }, [className]);

  return (
    <div
      className={cn(
        "max-h-[450px]",
        "border border-black",
        "p-2 rounded-md",
        "overflow-scroll",
        className,
      )}
    >
      <p>
        This is an example of a container that has scrollable overflow content.
      </p>
      <p>
        You{" "}
        <span
          className={cn(hasNoScrollbarSet ? "text-red-500" : "text-green-300")}
        >
          {hasNoScrollbarSet ? "SHOULD NOT" : "SHOULD"}
        </span>{" "}
        see a scrollbar for this container as{" "}
        <code className="font-bold">no-scrollbar</code> className{" "}
        <span
          className={cn(hasNoScrollbarSet ? "text-red-500" : "text-green-300")}
        >
          {hasNoScrollbarSet ? "has" : "has not"}
        </span>{" "}
        been applied!
      </p>
      <p>{LoremIpsumText}</p>
      <p>{LoremIpsumText}</p>
      <p>{LoremIpsumText}</p>
      <p>{LoremIpsumText}</p>
      <p>{LoremIpsumText}</p>
      <p>{LoremIpsumText}</p>
      <p>{LoremIpsumText}</p>
      <p>{LoremIpsumText}</p>
      <p>{LoremIpsumText}</p>
      <p>{LoremIpsumText}</p>
      <p>{LoremIpsumText}</p>
      <p>{LoremIpsumText}</p>
    </div>
  );
}
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Theme/No Scrollbar",
  component: ExampleScrollableContent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: [],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    className: {
      control: {
        type: "text",
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof ExampleScrollableContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const WithoutNoScrollbarUtility: Story = {
  args: {
    className: undefined,
  },
};

export const WithNoScrollbarUtilityEnabled: Story = {
  args: {
    className: "no-scrollbar",
  },
};
