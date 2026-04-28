import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";

import { Rating } from "./rating";
import {
  ratingColorIds,
  ratingSizeIds,
} from "./rating-variants";

const meta = {
  title: "Components/Rating",
  component: Rating,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ratingSizeIds,
      control: { type: "radio" },
    },
    color: {
      options: ratingColorIds,
      control: { type: "radio" },
    },
    max: {
      control: { type: "number", min: 1, max: 10, step: 1 },
    },
    value: {
      control: { type: "number", min: 0, step: 0.5 },
    },
    allowHalf: {
      control: { type: "boolean" },
    },
    readOnly: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
  args: {
    defaultValue: 3,
    max: 5,
    size: "md",
    color: "warning",
    allowHalf: false,
    readOnly: false,
    disabled: false,
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 3,
  },
};

export const ReadOnly: Story = {
  args: {
    value: 4,
    readOnly: true,
  },
};

export const HalfStars: Story = {
  args: {
    value: 3.5,
    allowHalf: true,
    readOnly: true,
  },
};

export const InteractiveHalfStars: Story = {
  args: {
    defaultValue: 2.5,
    allowHalf: true,
  },
};

export const Disabled: Story = {
  args: {
    value: 2,
    disabled: true,
  },
};

export const TenStars: Story = {
  args: {
    defaultValue: 7,
    max: 10,
  },
};

export const PrimaryColor: Story = {
  args: {
    defaultValue: 4,
    color: "primary",
  },
};

export const DestructiveColor: Story = {
  args: {
    defaultValue: 2,
    color: "destructive",
  },
};

export const ForegroundColor: Story = {
  args: {
    defaultValue: 3,
    color: "foreground",
  },
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-4">
      {ratingSizeIds.map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-8 text-xs text-muted-foreground uppercase tracking-wide">
            {size}
          </span>
          <Rating defaultValue={3.5} size={size} allowHalf readOnly />
        </div>
      ))}
    </div>
  ),
};

export const AllColors: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-4">
      {ratingColorIds.map((color) => (
        <div key={color} className="flex items-center gap-4">
          <span className="w-24 text-xs text-muted-foreground capitalize">
            {color}
          </span>
          <Rating defaultValue={4} color={color} readOnly />
        </div>
      ))}
    </div>
  ),
};

function ControlledExample(): ReactElement {
  const [value, setValue] = useState<number>(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <Rating value={value} onValueChange={setValue} allowHalf size="lg" />
      <p className="text-sm text-muted-foreground">
        Selected:{" "}
        <span className="font-medium text-foreground">{value.toFixed(1)}</span>{" "}
        / 5
      </p>
      <button
        type="button"
        onClick={() => setValue(0)}
        className="text-xs text-primary underline-offset-4 hover:underline"
      >
        Reset
      </button>
    </div>
  );
}

export const Controlled: Story = {
  render: (): ReactElement => <ControlledExample />,
};

export const ProductCard: Story = {
  render: (): ReactElement => (
    <div className="w-72 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="mb-2 aspect-video rounded bg-muted" />
      <h3 className="text-sm font-medium">Premium Schema Pack</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Curated schemas for production workloads.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Rating value={4.5} allowHalf readOnly size="sm" />
        <span className="text-xs text-muted-foreground">(128 reviews)</span>
      </div>
    </div>
  ),
};
