import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { CalendarDays, LayoutGrid, List, Moon, Sun, Laptop } from "lucide-react";

import {
  SegmentedControl,
  SegmentedControlItem,
  segmentedControlSizeIds,
  segmentedControlVariantIds,
} from "./segmented-control";

interface DemoProps {
  variant?: (typeof segmentedControlVariantIds)[number];
  size?: (typeof segmentedControlSizeIds)[number];
  fullWidth?: boolean;
  disabled?: boolean;
}

function ViewSwitcherDemo({
  variant,
  size,
  fullWidth,
  disabled,
}: DemoProps): ReactElement {
  const [value, setValue] = useState<string>("week");
  return (
    <div className={fullWidth ? "w-[420px]" : undefined}>
      <SegmentedControl
        value={value}
        onValueChange={setValue}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        aria-label="Calendar view"
      >
        <SegmentedControlItem value="day">Day</SegmentedControlItem>
        <SegmentedControlItem value="week">Week</SegmentedControlItem>
        <SegmentedControlItem value="month">Month</SegmentedControlItem>
        <SegmentedControlItem value="year">Year</SegmentedControlItem>
      </SegmentedControl>
      <p className="mt-3 text-sm text-muted-foreground">
        Currently selected: <span className="font-medium text-foreground">{value}</span>
      </p>
    </div>
  );
}

const meta = {
  title: "Components/SegmentedControl",
  component: ViewSwitcherDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: segmentedControlVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: segmentedControlSizeIds,
      control: { type: "radio" },
    },
    fullWidth: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    variant: "default",
    size: "default",
    fullWidth: false,
    disabled: false,
  },
} satisfies Meta<typeof ViewSwitcherDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OutlineVariant: Story = {
  args: { variant: "outline" },
};

export const GhostVariant: Story = {
  args: { variant: "ghost" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

function IconDemo(): ReactElement {
  const [layout, setLayout] = useState<string>("grid");
  return (
    <SegmentedControl
      value={layout}
      onValueChange={setLayout}
      aria-label="Layout"
    >
      <SegmentedControlItem value="grid" aria-label="Grid view">
        <LayoutGrid className="h-3.5 w-3.5" />
        Grid
      </SegmentedControlItem>
      <SegmentedControlItem value="list" aria-label="List view">
        <List className="h-3.5 w-3.5" />
        List
      </SegmentedControlItem>
      <SegmentedControlItem value="calendar" aria-label="Calendar view">
        <CalendarDays className="h-3.5 w-3.5" />
        Calendar
      </SegmentedControlItem>
    </SegmentedControl>
  );
}

export const WithIcons: Story = {
  render: () => <IconDemo />,
};

function ThemeDemo(): ReactElement {
  const [theme, setTheme] = useState<string>("system");
  return (
    <SegmentedControl
      value={theme}
      onValueChange={setTheme}
      variant="outline"
      size="sm"
      aria-label="Theme preference"
    >
      <SegmentedControlItem value="light" aria-label="Light theme">
        <Sun className="h-3.5 w-3.5" />
      </SegmentedControlItem>
      <SegmentedControlItem value="system" aria-label="System theme">
        <Laptop className="h-3.5 w-3.5" />
      </SegmentedControlItem>
      <SegmentedControlItem value="dark" aria-label="Dark theme">
        <Moon className="h-3.5 w-3.5" />
      </SegmentedControlItem>
    </SegmentedControl>
  );
}

export const IconOnly: Story = {
  render: () => <ThemeDemo />,
};

function UncontrolledDemo(): ReactElement {
  return (
    <SegmentedControl defaultValue="weekly" aria-label="Billing period">
      <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
      <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
      <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
    </SegmentedControl>
  );
}

export const Uncontrolled: Story = {
  render: () => <UncontrolledDemo />,
};

function AllVariantsDemo(): ReactElement {
  const [value, setValue] = useState<string>("b");
  return (
    <div className="flex flex-col gap-6">
      {segmentedControlVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          <SegmentedControl
            value={value}
            onValueChange={setValue}
            variant={variant}
          >
            <SegmentedControlItem value="a">Option A</SegmentedControlItem>
            <SegmentedControlItem value="b">Option B</SegmentedControlItem>
            <SegmentedControlItem value="c">Option C</SegmentedControlItem>
          </SegmentedControl>
        </div>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  render: () => <AllVariantsDemo />,
};
