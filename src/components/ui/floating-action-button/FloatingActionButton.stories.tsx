import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import {
  ArrowUp,
  Bell,
  Edit,
  Heart,
  MessageCircle,
  Plus,
  Trash2,
} from "lucide-react";
import type { ReactElement } from "react";

import {
  FloatingActionButton,
  floatingActionButtonPositionIds,
  floatingActionButtonSizeIds,
  floatingActionButtonVariantIds,
  type FloatingActionButtonPositionId,
  type FloatingActionButtonSizeId,
  type FloatingActionButtonVariantId,
} from "./floating-action-button";

interface FloatingActionButtonExampleProps {
  variant?: FloatingActionButtonVariantId;
  size?: FloatingActionButtonSizeId;
  position?: FloatingActionButtonPositionId;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
}

function FloatingActionButtonExample({
  label,
  position,
  ...props
}: FloatingActionButtonExampleProps): ReactElement {
  const isFixed = position !== undefined && position !== "static";
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-md border border-dashed border-border bg-muted/30 p-6">
      <p className="text-sm text-muted-foreground">
        This box acts as a stand-in viewport so you can see how the FAB anchors
        to each corner without it escaping into the Storybook chrome. In a real
        app, non-<code>static</code> positions are <code>position: fixed</code>{" "}
        relative to the browser viewport.
      </p>
      <FloatingActionButton
        {...props}
        position={position}
        label={label}
        icon={<Plus />}
        aria-label="Create new item"
        className={isFixed ? "absolute" : undefined}
      />
    </div>
  );
}

const meta = {
  title: "Components/FloatingActionButton",
  component: FloatingActionButtonExample,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: floatingActionButtonVariantIds,
      control: { type: "select" },
    },
    size: {
      options: floatingActionButtonSizeIds,
      control: { type: "radio" },
    },
    position: {
      options: floatingActionButtonPositionIds,
      control: { type: "select" },
    },
    label: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
  args: {
    variant: "primary",
    size: "default",
    position: "bottom-right",
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof FloatingActionButtonExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Extended: Story = {
  args: {
    label: "New item",
  },
};

export const Brand: Story = {
  args: {
    variant: "brand",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    label: "Delete",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
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
    label: "Compose",
  },
};

export const BottomLeft: Story = {
  args: {
    position: "bottom-left",
  },
};

export const TopRight: Story = {
  args: {
    position: "top-right",
    variant: "secondary",
  },
};

function AllVariantsExample(): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
      {floatingActionButtonVariantIds.map((variant) => (
        <div
          key={variant}
          className="flex flex-col items-center gap-3 rounded-md border border-border bg-card p-6"
        >
          <FloatingActionButton
            position="static"
            variant={variant}
            icon={<Plus />}
            aria-label={`${variant} FAB`}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {variant}
          </span>
        </div>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  render: () => <AllVariantsExample />,
  args: {},
};

function AllSizesExample(): ReactElement {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {floatingActionButtonSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <FloatingActionButton
            position="static"
            size={size}
            icon={<Plus />}
            aria-label={`${size} FAB`}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {size}
          </span>
        </div>
      ))}
    </div>
  );
}

export const AllSizes: Story = {
  render: () => <AllSizesExample />,
  args: {},
};

function ExtendedShowcaseExample(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <FloatingActionButton
        position="static"
        variant="primary"
        icon={<Edit />}
        label="Compose"
      />
      <FloatingActionButton
        position="static"
        variant="brand"
        icon={<MessageCircle />}
        label="New message"
      />
      <FloatingActionButton
        position="static"
        variant="destructive"
        icon={<Trash2 />}
        label="Delete forever"
      />
      <FloatingActionButton
        position="static"
        variant="outline"
        icon={<Heart />}
        label="Favorite"
      />
      <FloatingActionButton
        position="static"
        size="sm"
        variant="secondary"
        icon={<Bell />}
        label="Notifications"
      />
    </div>
  );
}

export const ExtendedShowcase: Story = {
  render: () => <ExtendedShowcaseExample />,
  args: {},
};

function ScrollToTopExample(): ReactElement {
  return (
    <div className="relative h-[420px] w-full overflow-y-auto rounded-md border border-border bg-card p-6">
      <div className="space-y-4 pb-32">
        <h3 className="text-lg font-semibold">Long scrollable content</h3>
        {Array.from({ length: 14 }).map((_, idx) => (
          <p key={idx} className="text-sm leading-relaxed text-muted-foreground">
            Paragraph {idx + 1} - A floating action button is most useful when
            pinned to a fixed corner of the viewport. In this story it is pinned
            to the bottom-right of this container so reviewers can see how it
            stays anchored while the surrounding content scrolls underneath.
          </p>
        ))}
      </div>
      <FloatingActionButton
        position="bottom-right"
        variant="brand"
        icon={<ArrowUp />}
        aria-label="Scroll to top"
        className="absolute"
      />
    </div>
  );
}

export const PinnedToContainer: Story = {
  render: () => <ScrollToTopExample />,
  args: {},
};
