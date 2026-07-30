import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { fn } from "storybook/test";

import { ratingColorIds, type RatingColor } from "../rating/rating-variants";
import { RatingBreakdown } from "./rating-breakdown";
import {
  ratingBreakdownBarScaleIds,
  ratingBreakdownBarVariantIds,
  ratingBreakdownLayoutIds,
  ratingBreakdownSizeIds,
  ratingBreakdownValueFormatIds,
} from "./rating-breakdown-variants";

const meta = {
  title: "Components/RatingBreakdown",
  component: RatingBreakdown,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ratingBreakdownSizeIds,
      control: { type: "radio" },
    },
    layout: {
      options: ratingBreakdownLayoutIds,
      control: { type: "radio" },
    },
    color: {
      options: ratingColorIds,
      control: { type: "radio" },
    },
    barVariant: {
      options: ratingBreakdownBarVariantIds,
      control: { type: "radio" },
    },
    barScale: {
      options: ratingBreakdownBarScaleIds,
      control: { type: "radio" },
    },
    valueFormat: {
      options: ratingBreakdownValueFormatIds,
      control: { type: "radio" },
    },
    max: {
      control: { type: "number", min: 3, max: 10, step: 1 },
    },
    precision: {
      control: { type: "number", min: 0, max: 3, step: 1 },
    },
    showStars: { control: { type: "boolean" } },
    showTotal: { control: { type: "boolean" } },
  },
  args: {
    distribution: [3, 8, 20, 60, 145],
    max: 5,
    size: "md",
    layout: "horizontal",
    color: "warning",
    barVariant: "solid",
    barScale: "total",
    valueFormat: "count",
    precision: 1,
    showStars: true,
    showTotal: true,
    onLevelClick: undefined,
  },
} satisfies Meta<typeof RatingBreakdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const HorizontalLayout: Story = {
  args: {
    layout: "horizontal",
  },
};

export const VerticalLayout: Story = {
  args: {
    layout: "vertical",
  },
  decorators: [
    (Story): ReactElement => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export const PrimaryColor: Story = {
  args: {
    color: "primary",
  },
};

export const DestructiveColor: Story = {
  args: {
    color: "destructive",
    distribution: [120, 40, 15, 8, 3],
  },
};

export const ForegroundColor: Story = {
  args: {
    color: "foreground",
  },
};

export const SubtleBars: Story = {
  args: {
    barVariant: "subtle",
  },
};

export const PercentValues: Story = {
  args: {
    valueFormat: "percent",
  },
};

export const CountAndPercent: Story = {
  args: {
    valueFormat: "both",
  },
};

export const NoValueLabels: Story = {
  args: {
    valueFormat: "none",
  },
};

export const BarScaleMax: Story = {
  args: {
    barScale: "max",
    distribution: [2, 4, 9, 21, 38],
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `barScale='max'`, the largest bucket fills the track and every other bar is drawn proportionally against it — better for surfacing shape when the top bucket dominates counts.",
      },
    },
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    distribution: [12, 30, 84, 210, 512],
  },
};

export const OverriddenAverage: Story = {
  args: {
    distribution: [3, 8, 20, 60, 145],
    average: 4.72,
    total: 12904,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The `average` and `total` props take precedence over values derived from `distribution`, useful when the histogram is a sampled slice of a much larger dataset.",
      },
    },
  },
};

export const TenPointScale: Story = {
  args: {
    max: 10,
    distribution: [1, 2, 3, 4, 8, 15, 32, 60, 90, 40],
    color: "primary",
  },
};

const emptyMessage = (
  <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
    No reviews yet. Be the first to leave feedback.
  </div>
);

export const EmptyState: Story = {
  args: {
    distribution: [0, 0, 0, 0, 0],
    emptyMessage,
  },
};

export const NoStarsOrTotal: Story = {
  args: {
    showStars: false,
    showTotal: false,
    valueFormat: "both",
  },
};

function InteractiveExample(): ReactElement {
  const [distribution] = useState<number[]>([3, 8, 20, 60, 145]);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <RatingBreakdown
        distribution={distribution}
        onLevelClick={(level) => setSelected(level)}
        valueFormat="both"
      />
      <p className="text-sm text-muted-foreground">
        {selected === null ? (
          "Click a star row to filter reviews by that rating."
        ) : (
          <>
            Filter active:{" "}
            <span className="font-medium text-foreground">
              {selected} star
              {selected === 1 ? "" : "s"}
            </span>{" "}
            (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-primary underline-offset-4 hover:underline"
            >
              clear
            </button>
            )
          </>
        )}
      </p>
    </div>
  );
}

export const Interactive: Story = {
  args: {
    onLevelClick: fn(),
  },
  render: (): ReactElement => <InteractiveExample />,
};

export const AllColors: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-8">
      {ratingColorIds.map((color: RatingColor) => (
        <div key={color} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {color}
          </span>
          <RatingBreakdown
            distribution={[3, 8, 20, 60, 145]}
            color={color}
            valueFormat="both"
          />
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-8">
      {ratingBreakdownSizeIds.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <RatingBreakdown
            distribution={[3, 8, 20, 60, 145]}
            size={size}
            valueFormat="both"
          />
        </div>
      ))}
    </div>
  ),
};

export const ProductReviewCard: Story = {
  render: (): ReactElement => (
    <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            Premium Schema Pack
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Customer reviews from the last 12 months.
          </p>
        </div>
        <button
          type="button"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          Write a review
        </button>
      </div>
      <RatingBreakdown
        distribution={[7, 12, 34, 128, 419]}
        valueFormat="both"
      />
    </div>
  ),
};
