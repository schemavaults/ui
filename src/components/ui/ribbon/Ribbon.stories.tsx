import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Ribbon, RibbonContainer } from "./ribbon";
import {
  ribbonIntentIds,
  ribbonPositionIds,
  ribbonSizeIds,
  type RibbonIntent,
  type RibbonPosition,
  type RibbonSize,
} from "./ribbon-variants";

interface RibbonExampleProps {
  intent?: RibbonIntent;
  size?: RibbonSize;
  position?: RibbonPosition;
  label?: string;
  rounded?: boolean;
}

function RibbonExample({
  intent = "primary",
  size = "md",
  position = "top-right",
  label = "New",
  rounded = true,
}: RibbonExampleProps): ReactElement {
  return (
    <div style={{ width: 320 }}>
      <RibbonContainer rounded={rounded}>
        <Card className="flex h-40 flex-col justify-end p-4">
          <h3 className="text-base font-semibold">Feature card</h3>
          <p className="text-sm text-muted-foreground">
            Add a ribbon to draw attention to a corner of any container.
          </p>
        </Card>
        <Ribbon intent={intent} size={size} position={position}>
          {label}
        </Ribbon>
      </RibbonContainer>
    </div>
  );
}

const meta = {
  title: "Components/Ribbon",
  component: RibbonExample,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      options: ribbonIntentIds,
      control: { type: "select" },
    },
    size: {
      options: ribbonSizeIds,
      control: { type: "radio" },
    },
    position: {
      options: ribbonPositionIds,
      control: { type: "select" },
    },
    label: {
      control: { type: "text" },
    },
    rounded: {
      control: { type: "boolean" },
    },
  },
  args: {
    intent: "primary",
    size: "md",
    position: "top-right",
    label: "New",
    rounded: true,
  },
} satisfies Meta<typeof RibbonExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Brand: Story = {
  args: {
    intent: "brand",
    label: "Pro",
  },
};

export const Success: Story = {
  args: {
    intent: "success",
    label: "Verified",
  },
};

export const Warning: Story = {
  args: {
    intent: "warning",
    label: "Beta",
  },
};

export const Destructive: Story = {
  args: {
    intent: "destructive",
    label: "Sale",
  },
};

export const Info: Story = {
  args: {
    intent: "info",
    label: "Preview",
  },
};

export const TopLeft: Story = {
  args: {
    position: "top-left",
    intent: "success",
    label: "Free",
  },
};

export const BottomRight: Story = {
  args: {
    position: "bottom-right",
    intent: "warning",
    label: "Draft",
  },
};

export const BottomLeft: Story = {
  args: {
    position: "bottom-left",
    intent: "info",
    label: "Copy",
  },
};

export const AllIntents: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-4 sm:grid-cols-3 lg:grid-cols-4">
      {ribbonIntentIds.map((intent) => (
        <div key={intent} style={{ width: 220 }}>
          <RibbonContainer rounded>
            <Card className="flex h-36 flex-col justify-end p-4">
              <span className="text-xs font-medium text-muted-foreground capitalize">
                {intent}
              </span>
              <span className="mt-1 text-sm font-semibold">Preview card</span>
            </Card>
            <Ribbon intent={intent}>{intent}</Ribbon>
          </RibbonContainer>
        </div>
      ))}
    </div>
  ),
};

export const AllPositions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-4">
      {ribbonPositionIds.map((position) => (
        <div key={position} style={{ width: 220 }}>
          <RibbonContainer rounded>
            <Card className="flex h-36 items-center justify-center p-4">
              <span className="text-sm font-medium text-muted-foreground">
                {position}
              </span>
            </Card>
            <Ribbon position={position} intent="brand">
              {position.replace("-", " ")}
            </Ribbon>
          </RibbonContainer>
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6 p-4">
      {ribbonSizeIds.map((size) => (
        <div key={size} style={{ width: 220 }}>
          <RibbonContainer rounded>
            <Card className="flex h-36 items-center justify-center p-4">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {size}
              </span>
            </Card>
            <Ribbon size={size} intent="primary">
              {size}
            </Ribbon>
          </RibbonContainer>
        </div>
      ))}
    </div>
  ),
};

export const OnImage: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <RibbonContainer rounded>
        <AspectRatio ratio={4 / 3}>
          <div
            className="h-full w-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"
            aria-hidden
          />
        </AspectRatio>
        <Ribbon intent="destructive" position="top-left" size="md">
          -25%
        </Ribbon>
      </RibbonContainer>
    </div>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <div style={{ width: 260 }}>
      <RibbonContainer rounded>
        <Card className="overflow-hidden">
          <AspectRatio ratio={1}>
            <div
              className="h-full w-full bg-gradient-to-br from-amber-400 to-rose-500"
              aria-hidden
            />
          </AspectRatio>
          <div className="p-4">
            <h3 className="text-sm font-semibold">Vault Starter Kit</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Get up and running with SchemaVaults in minutes.
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-lg font-bold">$29</span>
              <span className="text-xs line-through text-muted-foreground">
                $49
              </span>
            </div>
          </div>
        </Card>
        <Ribbon intent="brand" position="top-right" size="md">
          Popular
        </Ribbon>
      </RibbonContainer>
    </div>
  ),
};
