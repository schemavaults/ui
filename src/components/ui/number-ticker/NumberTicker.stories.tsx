import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react";

import { NumberTicker } from "./number-ticker";
import {
  numberTickerSizeIds,
  numberTickerVariantIds,
} from "./number-ticker-variants";
import { Button } from "../button";
import {
  StatCard,
  StatCardHeader,
  StatCardLabel,
  StatCardValue,
  StatCardDescription,
} from "../stat-card";

const meta = {
  title: "Components/NumberTicker",
  component: NumberTicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An animated counter that smoothly tweens from a starting number to a target value. Supports localized formatting via `Intl.NumberFormat`, prefix/suffix decoration (currency, percent), configurable easing/duration, and viewport-triggered playback. Honors `prefers-reduced-motion`. Useful for dashboards, hero sections, and stat cards.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: numberTickerVariantIds,
      control: { type: "select" },
    },
    size: {
      options: numberTickerSizeIds,
      control: { type: "radio" },
    },
    value: { control: { type: "number" } },
    from: { control: { type: "number" } },
    duration: { control: { type: "number", min: 0, step: 0.1 } },
    delay: { control: { type: "number", min: 0, step: 0.1 } },
    decimals: { control: { type: "number", min: 0, max: 6, step: 1 } },
    prefix: { control: { type: "text" } },
    suffix: { control: { type: "text" } },
    locale: { control: { type: "text" } },
    useGrouping: { control: { type: "boolean" } },
    startOnInView: { control: { type: "boolean" } },
    ease: {
      options: [
        "linear",
        "easeIn",
        "easeOut",
        "easeInOut",
        "circIn",
        "circOut",
        "circInOut",
        "backIn",
        "backOut",
        "backInOut",
        "anticipate",
      ],
      control: { type: "select" },
    },
  },
  args: {
    value: 1234,
    from: 0,
    duration: 1.5,
    delay: 0,
    decimals: 0,
    prefix: "",
    suffix: "",
    locale: "en-US",
    useGrouping: true,
    startOnInView: false,
    ease: "easeOut",
    variant: "default",
    size: "2xl",
  },
} satisfies Meta<typeof NumberTicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Currency: Story = {
  args: {
    value: 8421337,
    prefix: "$",
    decimals: 2,
    duration: 2,
    variant: "primary",
    size: "3xl",
  },
};

export const Percentage: Story = {
  args: {
    value: 98.7,
    suffix: "%",
    decimals: 1,
    duration: 1.8,
    variant: "success",
    size: "3xl",
  },
};

export const NegativeValue: Story = {
  args: {
    value: -42.5,
    decimals: 1,
    suffix: "%",
    duration: 1.5,
    variant: "destructive",
    size: "2xl",
  },
};

export const LargeNumber: Story = {
  args: {
    value: 12_847_392,
    duration: 2.5,
    size: "3xl",
    variant: "primary",
  },
};

export const NoGrouping: Story = {
  args: {
    value: 1000000,
    useGrouping: false,
    size: "2xl",
  },
};

export const LocaleFormatting: Story = {
  name: "Localized (de-DE)",
  args: {
    value: 1234567.89,
    locale: "de-DE",
    decimals: 2,
    suffix: " €",
    size: "2xl",
    variant: "primary",
  },
};

export const WithDelay: Story = {
  args: {
    value: 500,
    delay: 1,
    duration: 1.5,
    size: "2xl",
  },
};

export const FastEase: Story = {
  name: "Bounce easing (backOut)",
  args: {
    value: 9001,
    duration: 1.2,
    ease: "backOut",
    variant: "warning",
    size: "3xl",
  },
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-center gap-3 py-8">
      {numberTickerSizeIds.map((size) => (
        <div key={size} className="flex items-baseline gap-3">
          <span className="text-muted-foreground text-xs uppercase tracking-wider w-16">
            {size}
          </span>
          <NumberTicker
            value={42_069}
            size={size}
            duration={1.5}
            startOnInView={false}
          />
        </div>
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-center gap-3 py-8">
      {numberTickerVariantIds.map((variant) => (
        <div key={variant} className="flex items-baseline gap-3">
          <span className="text-muted-foreground text-xs uppercase tracking-wider w-24">
            {variant}
          </span>
          <NumberTicker
            value={1234}
            variant={variant}
            size="xl"
            duration={1.5}
            startOnInView={false}
          />
        </div>
      ))}
    </div>
  ),
};

function ReactiveExample(): ReactElement {
  const [value, setValue] = useState<number>(100);
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <NumberTicker
        value={value}
        size="3xl"
        variant="primary"
        duration={0.8}
        startOnInView={false}
      />
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(): void => setValue((v) => v - 50)}
        >
          <ArrowDown className="size-4" />
          -50
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(): void => setValue(100)}
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(): void => setValue((v) => v + 50)}
        >
          <ArrowUp className="size-4" />
          +50
        </Button>
      </div>
      <p className="text-muted-foreground text-xs max-w-xs text-center">
        Value updates re-trigger the animation, tweening from the current
        displayed number to the new target.
      </p>
    </div>
  );
}

export const Reactive: Story = {
  render: (): ReactElement => <ReactiveExample />,
};

export const InsideStatCard: Story = {
  render: (): ReactElement => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
      <StatCard variant="primary">
        <StatCardHeader>
          <StatCardLabel>Monthly revenue</StatCardLabel>
        </StatCardHeader>
        <StatCardValue>
          <NumberTicker
            value={48_290.55}
            prefix="$"
            decimals={2}
            duration={1.8}
            variant="primary"
            size="2xl"
            startOnInView={false}
          />
        </StatCardValue>
        <StatCardDescription>+12.4% vs last month</StatCardDescription>
      </StatCard>
      <StatCard>
        <StatCardHeader>
          <StatCardLabel>Active users</StatCardLabel>
        </StatCardHeader>
        <StatCardValue>
          <NumberTicker
            value={12_873}
            duration={1.6}
            size="2xl"
            startOnInView={false}
          />
        </StatCardValue>
        <StatCardDescription>across 42 organizations</StatCardDescription>
      </StatCard>
      <StatCard variant="warning">
        <StatCardHeader>
          <StatCardLabel>Failed jobs</StatCardLabel>
        </StatCardHeader>
        <StatCardValue>
          <NumberTicker
            value={37}
            duration={1.2}
            variant="warning"
            size="2xl"
            startOnInView={false}
          />
        </StatCardValue>
        <StatCardDescription>last 24 hours</StatCardDescription>
      </StatCard>
    </div>
  ),
};

export const ScrollIntoViewToTrigger: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-center gap-6 py-2">
      <p className="text-muted-foreground text-sm max-w-md text-center">
        Scroll down — the number below will start animating only once it enters
        the viewport.
      </p>
      <div className="h-[80vh] w-full border border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center text-muted-foreground text-xs">
        scroll past me ↓
      </div>
      <NumberTicker
        value={1_000_000}
        duration={2.5}
        startOnInView
        size="3xl"
        variant="success"
      />
      <div className="h-[40vh] w-full" />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
