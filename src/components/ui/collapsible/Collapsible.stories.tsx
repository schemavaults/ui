import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { ChevronRight, Lock, Settings, Shield } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  collapsibleSizeIds,
  collapsibleVariantIds,
  type CollapsibleSizeId,
  type CollapsibleVariantId,
} from "./index";

interface PlaygroundProps {
  variant?: CollapsibleVariantId;
  size?: CollapsibleSizeId;
  disabled?: boolean;
  defaultOpen?: boolean;
  triggerLabel?: string;
  hideIcon?: boolean;
}

function PlaygroundDemo({
  variant = "default",
  size = "md",
  disabled = false,
  defaultOpen = false,
  triggerLabel = "Advanced settings",
  hideIcon = false,
}: PlaygroundProps): ReactElement {
  return (
    <div className="w-[28rem]">
      <Collapsible
        variant={variant}
        size={size}
        disabled={disabled}
        defaultOpen={defaultOpen}
      >
        <CollapsibleTrigger hideIcon={hideIcon}>
          {triggerLabel}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-muted-foreground">
            This region is revealed when the trigger above is activated. It is
            announced to assistive technologies via{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              aria-expanded
            </code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              aria-controls
            </code>
            , and the height animation is powered by framer-motion.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

const meta = {
  title: "Components/Collapsible",
  component: PlaygroundDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: collapsibleVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: collapsibleSizeIds,
      control: { type: "radio" },
    },
    disabled: { control: { type: "boolean" } },
    defaultOpen: { control: { type: "boolean" } },
    triggerLabel: { control: { type: "text" } },
    hideIcon: { control: { type: "boolean" } },
  },
  args: {
    variant: "outline",
    size: "md",
    disabled: false,
    defaultOpen: false,
    triggerLabel: "Advanced settings",
    hideIcon: false,
  },
} satisfies Meta<typeof PlaygroundDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: "default" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Subtle: Story = {
  args: { variant: "subtle" },
};

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Disabled: Story = {
  args: { variant: "outline", disabled: true },
};

export const DefaultOpen: Story = {
  args: { variant: "outline", defaultOpen: true },
};

function AllVariantsDemo(): ReactElement {
  return (
    <div className="flex w-[28rem] flex-col gap-4">
      {collapsibleVariantIds.map((variant) => (
        <Collapsible key={variant} variant={variant} defaultOpen>
          <CollapsibleTrigger>
            <span className="capitalize">{variant}</span> variant
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="text-muted-foreground">
              Body content for the <strong>{variant}</strong> variant of the
              collapsible component.
            </p>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

export const AllVariants: StoryObj = {
  render: (): ReactElement => <AllVariantsDemo />,
};

function AllSizesDemo(): ReactElement {
  return (
    <div className="flex w-[28rem] flex-col gap-4">
      {collapsibleSizeIds.map((size) => (
        <Collapsible key={size} variant="outline" size={size} defaultOpen>
          <CollapsibleTrigger>
            <span className="uppercase tracking-wide">{size}</span> size
          </CollapsibleTrigger>
          <CollapsibleContent>
            Body content for size <strong>{size}</strong>.
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

export const AllSizes: StoryObj = {
  render: (): ReactElement => <AllSizesDemo />,
};

function ControlledDemo(): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="flex w-[28rem] flex-col gap-3">
      <Collapsible variant="outline" open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>
          <span className="flex items-center gap-2">
            <Shield className="size-4" />
            Security details
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li>End-to-end encryption is enabled.</li>
            <li>Two-factor authentication is required.</li>
            <li>Access logs are retained for 90 days.</li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
      <p className="text-sm text-muted-foreground">
        External state:{" "}
        <span className="font-mono font-medium text-foreground">
          {String(open)}
        </span>
      </p>
    </div>
  );
}

export const Controlled: StoryObj = {
  render: (): ReactElement => <ControlledDemo />,
};

function CustomIconDemo(): ReactElement {
  return (
    <div className="w-[28rem]">
      <Collapsible variant="subtle" defaultOpen>
        <CollapsibleTrigger icon={<ChevronRight />}>
          <span className="flex items-center gap-2">
            <Settings className="size-4" />
            Workspace preferences
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-muted-foreground">
            The default chevron has been replaced with a right-pointing chevron
            that rotates 180° on open. Pass any{" "}
            <code className="rounded bg-background px-1 py-0.5 font-mono text-xs">
              ReactNode
            </code>{" "}
            to the{" "}
            <code className="rounded bg-background px-1 py-0.5 font-mono text-xs">
              icon
            </code>{" "}
            prop.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export const CustomIcon: StoryObj = {
  render: (): ReactElement => <CustomIconDemo />,
};

function NestedDemo(): ReactElement {
  return (
    <div className="w-[28rem]">
      <Collapsible variant="outline" defaultOpen>
        <CollapsibleTrigger>
          <span className="flex items-center gap-2">
            <Lock className="size-4" />
            Vault permissions
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          <p className="text-muted-foreground">
            Permissions can be grouped by scope.
          </p>
          <Collapsible variant="subtle" size="sm">
            <CollapsibleTrigger>Read access</CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
                <li>vault:read</li>
                <li>secret:list</li>
                <li>schema:read</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible variant="subtle" size="sm">
            <CollapsibleTrigger>Write access</CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
                <li>vault:write</li>
                <li>secret:create</li>
                <li>schema:update</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export const Nested: StoryObj = {
  render: (): ReactElement => <NestedDemo />,
};
