import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { fn } from "storybook/test";
import Slider from "./slider";
import { useArgs } from "storybook/preview-api";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Slider",
  component: Slider,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    className: {
      control: {
        type: "text",
      },
    },
    min: {
      control: {
        type: "number",
      },
    },
    max: {
      control: {
        type: "number",
      },
    },
    value: {
      control: {
        type: "number",
      },
    },
  },
  // Use `fn` to spy on the onValueChange arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onValueChange: fn(),
  },
  decorators: [
    (Story, { ...context }) => {
      const [{ value }, updateArgs] = useArgs();
      const spy = context.args.onValueChange;
      return (
        <Story
          {...context}
          args={{
            ...context.args,
            value: typeof value === "number" ? [value] : value,
            onValueChange: (value: number[]) => {
              spy?.(value);
              updateArgs({
                ...context.args,
                value,
              });
            },
          }}
        />
      );
    },
    (Story) => {
      return (
        <div className="w-full h-full min-h-screen flex items-center justify-center">
          <div className="w-[40vw] h-40">
            <Story />
          </div>
        </div>
      );
    },
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const SliderExample: Story = {
  args: {
    className: "w-60 rounded-md",
    min: 0,
    max: 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: 50 satisfies number as any,
  },
};

function RangeSliderDemo(): ReactElement {
  const [range, setRange] = useState<number[]>([25, 75]);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Slider
        className="w-60 rounded-md"
        min={0}
        max={100}
        step={1}
        value={range}
        onValueChange={setRange}
      />
      <div className="text-sm text-muted-foreground tabular-nums">
        {range[0]} – {range[1]}
      </div>
    </div>
  );
}

/**
 * A dual-thumb range slider. The Slider component renders one thumb per
 * entry in the value/defaultValue array, so passing a 2-element array turns
 * it into a range picker with min/max thumbs.
 */
export const Range: Story = {
  decorators: [
    (_Story) => (
      <div className="w-full h-full min-h-screen flex items-center justify-center">
        <div className="w-[40vw] h-40">
          <RangeSliderDemo />
        </div>
      </div>
    ),
  ],
  render: () => <RangeSliderDemo />,
};

function MultiThumbDemo(): ReactElement {
  const [values, setValues] = useState<number[]>([20, 50, 80]);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Slider
        className="w-60 rounded-md"
        min={0}
        max={100}
        step={1}
        value={values}
        onValueChange={setValues}
      />
      <div className="text-sm text-muted-foreground tabular-nums">
        {values.join(" · ")}
      </div>
    </div>
  );
}

/**
 * The Slider supports any number of thumbs. Pass a 3+ element array to
 * create a multi-thumb slider, useful for splitting a range into buckets.
 */
export const MultiThumb: Story = {
  decorators: [
    (_Story) => (
      <div className="w-full h-full min-h-screen flex items-center justify-center">
        <div className="w-[40vw] h-40">
          <MultiThumbDemo />
        </div>
      </div>
    ),
  ],
  render: () => <MultiThumbDemo />,
};

function PriceRangeDemo(): ReactElement {
  const [range, setRange] = useState<number[]>([200, 750]);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Price range
        </span>
        <span className="text-sm font-medium tabular-nums">
          {formatter.format(range[0] ?? 0)} – {formatter.format(range[1] ?? 0)}
        </span>
      </div>
      <Slider
        className="w-full rounded-md"
        min={0}
        max={1000}
        step={10}
        minStepsBetweenThumbs={1}
        value={range}
        onValueChange={setRange}
      />
    </div>
  );
}

/**
 * A common e-commerce filter pattern: a price-range slider with formatted
 * currency labels and a minimum gap between thumbs.
 */
export const PriceRange: Story = {
  decorators: [
    (_Story) => (
      <div className="w-full h-full min-h-screen flex items-center justify-center">
        <div className="w-[40vw] h-40">
          <PriceRangeDemo />
        </div>
      </div>
    ),
  ],
  render: () => <PriceRangeDemo />,
};
