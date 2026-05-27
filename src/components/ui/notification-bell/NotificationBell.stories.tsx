import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { useState, type ReactElement } from "react";

import { NotificationBell } from "./notification-bell";
import {
  notificationBellIndicatorVariantIds,
  notificationBellSizeIds,
  notificationBellVariantIds,
} from "./notification-bell-variants";

const meta = {
  title: "Components/NotificationBell",
  component: NotificationBell,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: notificationBellVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: notificationBellSizeIds,
      control: { type: "radio" },
    },
    indicatorVariant: {
      options: notificationBellIndicatorVariantIds,
      control: { type: "radio" },
    },
    count: { control: { type: "number", min: 0 } },
    maxCount: { control: { type: "number", min: 1 } },
    dot: { control: { type: "boolean" } },
    forceIndicator: { control: { type: "boolean" } },
    ping: { control: { type: "boolean" } },
    ringWhenActive: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    variant: "ghost",
    size: "md",
    indicatorVariant: "destructive",
    count: 3,
    maxCount: 99,
    dot: false,
    forceIndicator: false,
    ping: false,
    ringWhenActive: false,
    onClick: fn(),
  },
} satisfies Meta<typeof NotificationBell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 3,
  },
};

export const NoUnread: Story = {
  args: {
    count: 0,
  },
};

export const SingleUnread: Story = {
  args: {
    count: 1,
  },
};

export const OverflowCount: Story = {
  args: {
    count: 142,
    maxCount: 99,
  },
};

export const DotOnly: Story = {
  args: {
    dot: true,
    count: 0,
    forceIndicator: true,
  },
};

export const WithPing: Story = {
  args: {
    count: 5,
    ping: true,
  },
};

export const RingWhenActive: Story = {
  args: {
    count: 7,
    ringWhenActive: true,
    ping: true,
  },
};

export const BrandVariant: Story = {
  args: {
    variant: "brand",
    indicatorVariant: "destructive",
    count: 4,
  },
};

export const OutlineVariant: Story = {
  args: {
    variant: "outline",
    count: 12,
  },
};

export const SubtleVariant: Story = {
  args: {
    variant: "subtle",
    count: 8,
  },
};

export const SolidVariant: Story = {
  args: {
    variant: "default",
    count: 4,
    indicatorVariant: "warning",
  },
};

export const Disabled: Story = {
  args: {
    count: 3,
    disabled: true,
  },
};

export const AllTriggerVariants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-6 p-4">
      {notificationBellVariantIds.map((variant) => (
        <div key={variant} className="flex items-center gap-6">
          <span className="w-20 text-sm text-muted-foreground capitalize">
            {variant}
          </span>
          {notificationBellSizeIds.map((size) => (
            <NotificationBell
              key={size}
              variant={variant}
              size={size}
              count={5}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const AllIndicatorVariants: Story = {
  render: (): ReactElement => (
    <div className="flex items-center gap-6 p-4">
      {notificationBellIndicatorVariantIds.map((indicatorVariant) => (
        <div
          key={indicatorVariant}
          className="flex flex-col items-center gap-2"
        >
          <NotificationBell
            variant="outline"
            size="lg"
            count={3}
            indicatorVariant={indicatorVariant}
          />
          <span className="text-xs text-muted-foreground capitalize">
            {indicatorVariant}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex items-end gap-6 p-4">
      {notificationBellSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <NotificationBell variant="outline" size={size} count={9} />
          <span className="text-xs text-muted-foreground uppercase">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const CountProgression: Story = {
  render: (): ReactElement => (
    <div className="flex items-center gap-6 p-4">
      {[0, 1, 7, 42, 99, 100, 1234].map((value) => (
        <div key={value} className="flex flex-col items-center gap-2">
          <NotificationBell variant="outline" size="lg" count={value} />
          <span className="text-xs text-muted-foreground tabular-nums">
            count={value}
          </span>
        </div>
      ))}
    </div>
  ),
};

function InteractiveDemo(): ReactElement {
  const [count, setCount] = useState<number>(0);
  return (
    <div className="flex flex-col items-center gap-4">
      <NotificationBell
        variant="ghost"
        size="lg"
        count={count}
        ping={count > 0}
        ringWhenActive
        onClick={(): void => setCount(0)}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={(): void => setCount((value) => value + 1)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        >
          Add notification
        </button>
        <button
          type="button"
          onClick={(): void => setCount(0)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
        >
          Mark all read
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Click the bell, or use the buttons, to update the unread count.
      </p>
    </div>
  );
}

/**
 * Wire up the NotificationBell to a stateful counter so reviewers can
 * exercise the indicator transitions (empty → dot/count → ping) without
 * leaving the canvas. Clicking the bell itself resets the count to zero.
 */
export const Interactive: Story = {
  render: (): ReactElement => <InteractiveDemo />,
};

/**
 * The NotificationBell is most often placed in an application top bar. This
 * story shows it sitting alongside other header affordances using the same
 * theme tokens (`bg-background`, `border-border`, `text-muted-foreground`)
 * as the rest of the SchemaVaults shell.
 */
export const InHeader: Story = {
  render: (): ReactElement => (
    <div className="flex w-[540px] items-center justify-between rounded-lg border border-border bg-background px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-md bg-schemavaults-brand-blue" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            SchemaVaults
          </span>
          <span className="text-xs text-muted-foreground">
            Production · us-east-1
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell
          variant="ghost"
          size="md"
          count={5}
          ping
          ringWhenActive
        />
        <div className="h-8 w-8 rounded-full bg-muted" />
      </div>
    </div>
  ),
};
