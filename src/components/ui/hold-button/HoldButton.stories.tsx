import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Trash2, AlertTriangle, ShieldCheck, Power, Rocket } from "lucide-react";
import { useState, type ReactElement } from "react";

import { useToast } from "@/components/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { HoldButton } from "./hold-button";
import { holdButtonSizeIds, holdButtonVariantIds } from "./hold-button";

const meta = {
  title: "Components/HoldButton",
  component: HoldButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A press-and-hold confirmation button. The user must hold the " +
          "button down for `duration` milliseconds for `onConfirm` to fire. " +
          "Releasing early cancels the action. Use for destructive or " +
          "irreversible operations such as deleting an account, force-pushing " +
          "to `main`, or detonating a vault. Works with mouse, touch, and " +
          "keyboard (Space / Enter).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: holdButtonVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: holdButtonSizeIds,
      control: { type: "radio" },
    },
    duration: { control: { type: "number", min: 250, step: 250 } },
    disabled: { control: { type: "boolean" } },
    completed: { control: { type: "boolean" } },
    holdingLabel: { control: { type: "text" } },
    onConfirm: { action: "confirmed" },
    onHoldStart: { action: "holdStart" },
    onHoldCancel: { action: "holdCancel" },
  },
  args: {
    children: "Hold to confirm",
    variant: "default",
    size: "md",
    duration: 1500,
    onConfirm: fn(),
    onHoldStart: fn(),
    onHoldCancel: fn(),
  },
} satisfies Meta<typeof HoldButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Hold to confirm",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    icon: <Trash2 />,
    children: "Hold to delete",
    holdingLabel: "Keep holding…",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    icon: <AlertTriangle />,
    children: "Hold to override",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    icon: <ShieldCheck />,
    children: "Hold to approve",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    icon: <Rocket />,
    children: "Hold to deploy",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    icon: <Power />,
    children: "Hold to shut down",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    variant: "destructive",
    children: "Hold to delete",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    variant: "destructive",
    icon: <Trash2 />,
    children: "Hold to delete forever",
  },
};

export const QuickHold: Story = {
  args: {
    duration: 750,
    variant: "warning",
    children: "Hold (0.75s)",
  },
};

export const SlowHold: Story = {
  args: {
    duration: 3000,
    variant: "destructive",
    icon: <Trash2 />,
    children: "Hold for 3 seconds",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    variant: "destructive",
    icon: <Trash2 />,
    children: "Cannot delete",
  },
};

export const Completed: Story = {
  args: {
    completed: true,
    variant: "success",
    icon: <ShieldCheck />,
    children: "Confirmed",
  },
};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="grid grid-cols-2 gap-3 p-4">
      {holdButtonVariantIds.map((variant) => (
        <HoldButton key={variant} variant={variant}>
          {`Hold (${variant})`}
        </HoldButton>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex items-end gap-4 p-4">
      {holdButtonSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase text-muted-foreground">{size}</span>
          <HoldButton size={size} variant="destructive" icon={<Trash2 />}>
            Hold to delete
          </HoldButton>
        </div>
      ))}
    </div>
  ),
};

function StatefulConfirmDemo(): ReactElement {
  const { toast } = useToast();
  const [deletedCount, setDeletedCount] = useState<number>(0);

  return (
    <div className="flex w-[360px] flex-col items-stretch gap-3 rounded-md border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">Delete API key</p>
        <p className="text-xs text-muted-foreground">
          Press-and-hold to confirm. Releasing early cancels.
        </p>
      </div>
      <HoldButton
        variant="destructive"
        icon={<Trash2 />}
        duration={1500}
        holdingLabel="Releasing cancels…"
        onConfirm={(): void => {
          setDeletedCount((c): number => c + 1);
          toast({
            variant: "destructive",
            title: "API key revoked",
            description: "The key has been permanently deleted.",
          });
        }}
      >
        Hold to delete
      </HoldButton>
      <p className="text-xs text-muted-foreground">
        Confirmed deletions: <span className="font-mono">{deletedCount}</span>
      </p>
    </div>
  );
}

/**
 * Pairs the HoldButton with the Toaster to surface a destructive confirmation
 * after the user successfully completes the press-and-hold gesture. A live
 * counter tracks confirmed invocations to demonstrate that `onConfirm` only
 * fires on a completed hold (not on every pointer down).
 */
export const RealisticDeleteFlow: Story = {
  render: (): ReactElement => <StatefulConfirmDemo />,
  decorators: [
    (Story): ReactElement => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};
