import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";
import SplitPane, { type SplitPaneProps } from "./split-pane";
import type { ReactElement } from "react";
import {
  defaultSplitPaneDirection,
  type SplitPaneDirection,
  validSplitPaneDirections,
} from "./split-pane-directions";
import { useArgs } from "@storybook/preview-api";
import {
  EVEN_SPLIT_PERCENTAGE,
  MAX_SPLIT_PERCENTAGE,
  MIN_SPLIT_PERCENTAGE,
} from "./split-pane-acceptable-split-range";

function ExamplePane({ message }: { message: string }): ReactElement {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <p>{message}</p>
    </div>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Split Pane",
  component: SplitPane,
  decorators: [
    (Story, context) => {
      const [args, setArgs] = useArgs<SplitPaneProps>();
      // Use the wrapper component instead of modifying Story args

      const handleSplitChange = (newSplit: number): void => {
        console.log("[handleSplitChange] newSplit: ", newSplit);
        setArgs({ splitPercentage: newSplit });
      };

      return (
        <Story
          {...context}
          args={{ ...args, setSplitPercentage: handleSplitChange }}
        />
      );
    },
  ],
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    direction: {
      control: {
        type: "radio",
        options:
          validSplitPaneDirections satisfies readonly SplitPaneDirection[],
      },
      description: "Should the panes be arranged as a column or as a row?",
      defaultValue: defaultSplitPaneDirection,
      type: "string",
      options: validSplitPaneDirections,
      table: {
        type: {
          summary: "SplitPaneDirection",
          detail: `${validSplitPaneDirections.map((s) => `'${s}'`).join(", ")}`,
        },
        defaultValue: {
          summary: defaultSplitPaneDirection,
        },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disable allowing adjustment of the pane sizes.",
      type: "boolean",
      defaultValue: false,
    },
    containerClassName: {
      control: "text",
      description: "Apply TailwindCSS class names to the container element.",
    },
    splitPercentage: {
      control: {
        type: "range",
        min: MIN_SPLIT_PERCENTAGE,
        max: MAX_SPLIT_PERCENTAGE,
        step: 1,
      },
      type: "number",
      defaultValue: EVEN_SPLIT_PERCENTAGE,
    },
    // Hide setSplitPercentage from controls since it's handled by the decorator
    setSplitPercentage: {
      table: {
        disable: true,
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    First: () => <ExamplePane message="<FirstPane />" />,
    Second: () => <ExamplePane message="<SecondPane />" />,
    containerClassName: "w-full h-screen",
    splitPercentage: EVEN_SPLIT_PERCENTAGE,
  } satisfies SplitPaneProps,
} satisfies Meta<typeof SplitPane>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ColumnSplit: Story = {
  args: {
    direction: "col",
  },
};

export const RowSplit: Story = {
  args: {
    direction: "row",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
