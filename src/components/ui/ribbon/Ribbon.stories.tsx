import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { Rocket, Star, Zap } from "lucide-react";

import { Ribbon } from "./ribbon";
import {
  ribbonPositionIds,
  ribbonSizeIds,
  ribbonVariantIds,
  type RibbonPosition,
  type RibbonVariant,
} from "./ribbon-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import { Button } from "../button";

const meta = {
  title: "Components/Ribbon",
  component: Ribbon,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A decorative corner ribbon that slashes across a container's corner to highlight state such as NEW, BETA, PRO, or SALE. **The parent container MUST have `relative overflow-hidden`** for the ribbon to appear correctly clipped to the corner. Distinct from Badge (inline) and Banner (full-width strip): Ribbon is a corner-affixed marker suited to cards and tiles.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    position: { options: ribbonPositionIds, control: { type: "radio" } },
    size: { options: ribbonSizeIds, control: { type: "radio" } },
    variant: { options: ribbonVariantIds, control: { type: "select" } },
    children: { control: { type: "text" } },
  },
  args: {
    children: "New",
    position: "top-right",
    size: "default",
    variant: "default",
  },
  decorators: [
    (Story): ReactElement => (
      <div className="relative overflow-hidden w-80 h-56 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
        <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
          Container (relative overflow-hidden)
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Ribbon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TopLeft: Story = {
  args: {
    position: "top-left",
    variant: "secondary",
    children: "Beta",
  },
};

export const TopRight: Story = {
  args: {
    position: "top-right",
    variant: "default",
    children: "New",
  },
};

export const BottomLeft: Story = {
  args: {
    position: "bottom-left",
    variant: "warning",
    children: "Draft",
  },
};

export const BottomRight: Story = {
  args: {
    position: "bottom-right",
    variant: "success",
    children: "Live",
  },
};

export const Small: Story = {
  args: { size: "sm", children: "Pro" },
};

export const Large: Story = {
  args: { size: "lg", children: "Sale" },
};

export const DestructiveVariant: Story = {
  args: { variant: "destructive", children: "-50%" },
};

export const SuccessVariant: Story = {
  args: { variant: "success", children: "Free" },
};

export const WarningVariant: Story = {
  args: { variant: "warning", children: "Beta" },
};

export const AccentVariant: Story = {
  args: { variant: "accent", children: "Popular" },
};

export const AllVariants: Story = {
  decorators: [(Story): ReactElement => <Story />],
  render: (): ReactElement => (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
      {ribbonVariantIds.map((variant) => (
        <div
          key={variant}
          className="relative h-40 w-56 overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm"
        >
          <div className="flex h-full items-center justify-center p-4 text-xs text-muted-foreground">
            {variant}
          </div>
          <Ribbon variant={variant as RibbonVariant}>{variant}</Ribbon>
        </div>
      ))}
    </div>
  ),
};

export const AllPositions: Story = {
  decorators: [(Story): ReactElement => <Story />],
  render: (): ReactElement => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {ribbonPositionIds.map((position) => (
        <div
          key={position}
          className="relative h-40 w-64 overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm"
        >
          <div className="flex h-full items-center justify-center p-4 text-xs text-muted-foreground">
            {position}
          </div>
          <Ribbon position={position as RibbonPosition} variant="secondary">
            {position.replace("-", " ")}
          </Ribbon>
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  decorators: [(Story): ReactElement => <Story />],
  render: (): ReactElement => (
    <div className="flex flex-col gap-6 md:flex-row">
      {ribbonSizeIds.map((size) => (
        <div
          key={size}
          className="relative h-44 w-56 overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm"
        >
          <div className="flex h-full items-center justify-center p-4 text-xs text-muted-foreground">
            size: {size}
          </div>
          <Ribbon size={size}>{size}</Ribbon>
        </div>
      ))}
    </div>
  ),
};

export const OnCard: Story = {
  decorators: [(Story): ReactElement => <Story />],
  render: (): ReactElement => (
    <Card className="relative w-80 overflow-hidden">
      <Ribbon variant="success" size="default">
        <Rocket className="mr-1 size-3" />
        Live
      </Ribbon>
      <CardHeader>
        <CardTitle>SchemaVaults Pro</CardTitle>
        <CardDescription>
          Advanced schema tooling for growing teams.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Unlock version history, role-based access, and priority support with the
        Pro tier.
      </CardContent>
      <CardFooter className="justify-end">
        <Button size="sm">Upgrade</Button>
      </CardFooter>
    </Card>
  ),
};

export const PricingGrid: Story = {
  decorators: [(Story): ReactElement => <Story />],
  render: (): ReactElement => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle>Starter</CardTitle>
          <CardDescription>For individuals getting started.</CardDescription>
        </CardHeader>
        <CardContent className="text-2xl font-bold">$0</CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Choose Starter
          </Button>
        </CardFooter>
      </Card>
      <Card className="relative overflow-hidden border-primary/40 shadow-md">
        <Ribbon variant="default" size="default">
          <Star className="mr-1 size-3" />
          Popular
        </Ribbon>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>For small collaborating teams.</CardDescription>
        </CardHeader>
        <CardContent className="text-2xl font-bold">$29</CardContent>
        <CardFooter>
          <Button className="w-full">Choose Team</Button>
        </CardFooter>
      </Card>
      <Card className="relative overflow-hidden">
        <Ribbon variant="warning" size="default">
          Beta
        </Ribbon>
        <CardHeader>
          <CardTitle>Enterprise</CardTitle>
          <CardDescription>Custom deployments & SLAs.</CardDescription>
        </CardHeader>
        <CardContent className="text-2xl font-bold">Contact</CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Contact sales
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const ProductThumbnail: Story = {
  decorators: [(Story): ReactElement => <Story />],
  render: (): ReactElement => (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {[
        { title: "Compact Kit", price: "$19", ribbon: "New", variant: "default" as const },
        { title: "Studio Pack", price: "$49", ribbon: "-30%", variant: "destructive" as const },
        { title: "Prime Bundle", price: "$99", ribbon: "Hot", variant: "warning" as const },
      ].map((item) => (
        <div
          key={item.title}
          className="relative w-44 overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm"
        >
          <Ribbon variant={item.variant} size="sm">
            {item.ribbon}
          </Ribbon>
          <div className="flex h-28 items-center justify-center bg-muted text-muted-foreground">
            <Zap className="size-6" />
          </div>
          <div className="p-3">
            <div className="text-sm font-medium">{item.title}</div>
            <div className="text-xs text-muted-foreground">{item.price}</div>
          </div>
        </div>
      ))}
    </div>
  ),
};
