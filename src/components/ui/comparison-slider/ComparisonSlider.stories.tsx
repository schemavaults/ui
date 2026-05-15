import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";
import type { ReactElement } from "react";

import {
  ComparisonSlider,
  comparisonSliderHandleVariantIds,
  comparisonSliderOrientations,
  type ComparisonSliderProps,
} from "./comparison-slider";

function BeforePane({
  text = "Before",
}: {
  text?: string;
}): ReactElement {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
      <div className="text-center">
        <div className="text-3xl font-semibold tracking-tight">{text}</div>
        <div className="mt-1 text-sm">muted background</div>
      </div>
    </div>
  );
}

function AfterPane({
  text = "After",
}: {
  text?: string;
}): ReactElement {
  return (
    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
      <div className="text-center">
        <div className="text-3xl font-semibold tracking-tight">{text}</div>
        <div className="mt-1 text-sm">primary background</div>
      </div>
    </div>
  );
}

const meta = {
  title: "Components/Comparison Slider",
  component: ComparisonSlider,
  decorators: [
    (Story, context) => {
      const [args, setArgs] = useArgs<ComparisonSliderProps>();
      const spy = context.args.onPositionChange;

      const handlePositionChange = (next: number): void => {
        spy?.(next);
        setArgs({ position: next });
      };

      return (
        <div className="mx-auto w-full max-w-2xl p-6">
          <Story
            {...context}
            args={{ ...args, onPositionChange: handlePositionChange }}
          />
        </div>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A before/after comparison slider. Drag the handle (or use the keyboard arrow keys) to wipe between two layers of content. Useful for image comparisons, theme previews, configuration diffs, and so on.",
      },
    },
  },
  tags: ["autodocs"],
  args: { onPositionChange: fn() },
  argTypes: {
    orientation: {
      control: { type: "radio" },
      options: comparisonSliderOrientations,
      description: "Direction the divider slides in.",
      table: {
        type: { summary: "ComparisonSliderOrientation" },
        defaultValue: { summary: "horizontal" },
      },
    },
    handleVariant: {
      control: { type: "radio" },
      options: comparisonSliderHandleVariantIds,
      description: "Visual style of the divider line and drag handle.",
      table: {
        type: { summary: "ComparisonSliderHandleVariantId" },
        defaultValue: { summary: "default" },
      },
    },
    position: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description:
        "Current divider position (0-100). Controlled by the decorator in Storybook.",
      table: { type: { summary: "number" } },
    },
    defaultPosition: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Initial position when uncontrolled.",
      table: { defaultValue: { summary: "50" } },
    },
    keyboardStep: {
      control: { type: "number", min: 1, max: 25, step: 1 },
      description:
        "Percentage step applied when the user presses arrow keys on the handle.",
      table: { defaultValue: { summary: "2" } },
    },
    disabled: { control: "boolean" },
    label: { control: "text" },
    beforeLabel: { control: "text" },
    afterLabel: { control: "text" },
    before: { table: { disable: true } },
    after: { table: { disable: true } },
  },
} satisfies Meta<typeof ComparisonSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    position: 50,
    before: <BeforePane />,
    after: <AfterPane />,
    label: "Default comparison",
  },
};

export const WithCaptions: Story = {
  args: {
    position: 50,
    before: <BeforePane text="Light theme" />,
    after: <AfterPane text="Dark theme" />,
    beforeLabel: "Before",
    afterLabel: "After",
    label: "Light vs dark theme",
  },
};

export const Vertical: Story = {
  args: {
    position: 50,
    orientation: "vertical",
    before: <BeforePane text="Top" />,
    after: <AfterPane text="Bottom" />,
    beforeLabel: "Before",
    afterLabel: "After",
    label: "Vertical comparison",
  },
};

export const MinimalHandle: Story = {
  args: {
    position: 50,
    handleVariant: "minimal",
    before: <BeforePane />,
    after: <AfterPane />,
    label: "Minimal handle variant",
  },
};

export const BrandHandle: Story = {
  args: {
    position: 35,
    handleVariant: "brand",
    before: <BeforePane />,
    after: <AfterPane />,
    label: "Brand handle variant",
  },
};

export const Disabled: Story = {
  args: {
    position: 65,
    disabled: true,
    before: <BeforePane />,
    after: <AfterPane />,
    label: "Disabled comparison",
  },
};

function ImageBefore(): ReactElement {
  return (
    <div className="h-full w-full bg-gradient-to-br from-amber-100 via-orange-200 to-rose-200">
      <div className="flex h-full w-full items-end p-4 text-rose-900">
        <div className="text-sm font-medium opacity-80">Sunset palette</div>
      </div>
    </div>
  );
}

function ImageAfter(): ReactElement {
  return (
    <div className="h-full w-full bg-gradient-to-br from-sky-900 via-indigo-800 to-violet-900">
      <div className="flex h-full w-full items-end p-4 text-sky-100">
        <div className="text-sm font-medium opacity-80">Night palette</div>
      </div>
    </div>
  );
}

export const ImageLikeContent: Story = {
  args: {
    position: 50,
    before: <ImageBefore />,
    after: <ImageAfter />,
    beforeLabel: "Day",
    afterLabel: "Night",
    label: "Sunset and night palette comparison",
  },
};
