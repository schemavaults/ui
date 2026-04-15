import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { Button } from "../button";
import { Spinner } from "./spinner";
import {
  spinnerSizeIds,
  spinnerVariantIds,
  type SpinnerSize,
  type SpinnerVariant,
} from "./spinner-variants";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: spinnerSizeIds,
      control: { type: "radio" },
    },
    variant: {
      options: spinnerVariantIds,
      control: { type: "radio" },
    },
    showLabel: {
      control: { type: "boolean" },
    },
    label: {
      control: { type: "text" },
    },
  },
  args: {
    size: "md",
    variant: "default",
    label: "Loading",
    showLabel: false,
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const ExtraLarge: Story = {
  args: { size: "xl" },
};

export const Brand: Story = {
  args: { variant: "brand", size: "lg" },
};

export const Destructive: Story = {
  args: { variant: "destructive", size: "lg" },
};

export const Warning: Story = {
  args: { variant: "warning", size: "lg" },
};

export const Muted: Story = {
  args: { variant: "muted", size: "lg" },
};

export const WithVisibleLabel: Story = {
  args: {
    size: "md",
    variant: "default",
    showLabel: true,
    label: "Loading…",
  },
};

export const WithCustomLabel: Story = {
  args: {
    size: "md",
    variant: "primary",
    showLabel: true,
    label: "Saving changes…",
  },
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex items-end gap-8 p-4">
      {spinnerSizeIds.map(
        (size: SpinnerSize): ReactElement => (
          <div key={size} className="flex flex-col items-center gap-3">
            <Spinner size={size} />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {size}
            </span>
          </div>
        ),
      )}
    </div>
  ),
};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="grid grid-cols-2 gap-x-10 gap-y-6 p-4 sm:grid-cols-4">
      {spinnerVariantIds.map(
        (variant: SpinnerVariant): ReactElement => (
          <div key={variant} className="flex flex-col items-center gap-3">
            <Spinner variant={variant} size="lg" />
            <span className="text-xs text-muted-foreground capitalize">
              {variant}
            </span>
          </div>
        ),
      )}
    </div>
  ),
};

export const VariantsAndSizesGrid: Story = {
  render: (): ReactElement => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-[8rem_repeat(5,minmax(0,1fr))] items-center gap-x-6 gap-y-4">
        <span />
        {spinnerSizeIds.map(
          (size: SpinnerSize): ReactElement => (
            <span
              key={size}
              className="text-xs uppercase tracking-wide text-muted-foreground text-center"
            >
              {size}
            </span>
          ),
        )}
        {spinnerVariantIds.map(
          (variant: SpinnerVariant): ReactElement => (
            <Row key={variant} variant={variant} />
          ),
        )}
      </div>
    </div>
  ),
};

function Row({ variant }: { variant: SpinnerVariant }): ReactElement {
  return (
    <>
      <span className="text-sm font-medium capitalize text-foreground">
        {variant}
      </span>
      {spinnerSizeIds.map(
        (size: SpinnerSize): ReactElement => (
          <div key={size} className="flex justify-center">
            <Spinner variant={variant} size={size} />
          </div>
        ),
      )}
    </>
  );
}

export const InsideButton: Story = {
  render: (): ReactElement => (
    <div className="flex items-center gap-3">
      <Button disabled>
        <Spinner size="sm" variant="default" />
        <span className="ml-2">Saving</span>
      </Button>
      <Button variant="secondary" disabled>
        <Spinner size="sm" variant="secondary" />
        <span className="ml-2">Loading</span>
      </Button>
      <Button variant="destructive" disabled>
        <Spinner size="sm" variant="default" />
        <span className="ml-2">Deleting</span>
      </Button>
    </div>
  ),
};

export const InlineWithText: Story = {
  render: (): ReactElement => (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner size="xs" variant="muted" />
      Fetching the latest results from the server…
    </p>
  ),
};

export const CenteredOnCard: Story = {
  render: (): ReactElement => (
    <div className="flex h-48 w-80 items-center justify-center rounded-lg border border-border bg-card text-card-foreground">
      <Spinner size="lg" variant="brand" showLabel label="Loading dashboard…" />
    </div>
  ),
};

export const OnDarkBackground: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: (): ReactElement => (
    <div className="flex h-48 w-80 items-center justify-center rounded-lg bg-zinc-900 text-zinc-100">
      <Spinner size="lg" variant="brand" showLabel label="Loading…" />
    </div>
  ),
};
