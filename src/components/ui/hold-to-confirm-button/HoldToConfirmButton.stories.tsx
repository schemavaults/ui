import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import {
  AlertTriangle,
  CheckCircle2,
  PowerOff,
  Send,
  Trash2,
} from "lucide-react";
import { useState, type ReactElement } from "react";

import {
  HoldToConfirmButton,
  holdToConfirmButtonSizeIds,
  holdToConfirmButtonVariantIds,
  type HoldToConfirmButtonSizeId,
  type HoldToConfirmButtonVariantId,
} from "./hold-to-confirm-button";

interface HoldToConfirmButtonExampleProps {
  variant?: HoldToConfirmButtonVariantId;
  size?: HoldToConfirmButtonSizeId;
  holdDurationMs?: number;
  fullWidth?: boolean;
  disabled?: boolean;
  label?: string;
  holdingLabel?: string;
  confirmedLabel?: string;
  latchConfirmed?: boolean;
  onConfirm?: () => void;
  onCancel?: (progress: number) => void;
}

function HoldToConfirmButtonExample({
  label = "Hold to delete",
  holdingLabel = "Keep holding…",
  confirmedLabel = "Deleted",
  ...props
}: HoldToConfirmButtonExampleProps): ReactElement {
  return (
    <div className="flex min-h-[140px] w-full max-w-md items-center justify-center rounded-md border border-dashed border-border bg-muted/30 p-6">
      <HoldToConfirmButton
        {...props}
        icon={<Trash2 />}
        holdingLabel={holdingLabel}
        confirmedLabel={confirmedLabel}
      >
        {label}
      </HoldToConfirmButton>
    </div>
  );
}

const meta = {
  title: "Components/HoldToConfirmButton",
  component: HoldToConfirmButtonExample,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A button that requires the user to press and hold for a configurable duration before firing `onConfirm`. Useful for destructive or irreversible actions where a single click feels too dangerous. Renders a progress fill that visualises hold progress, supports keyboard activation (Space / Enter), pointer events, and announces progress to assistive tech via `aria-valuenow`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: holdToConfirmButtonVariantIds,
      control: { type: "select" },
    },
    size: {
      options: holdToConfirmButtonSizeIds,
      control: { type: "radio" },
    },
    holdDurationMs: {
      control: { type: "number", min: 200, max: 5000, step: 100 },
    },
    fullWidth: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    latchConfirmed: {
      control: { type: "boolean" },
    },
    label: {
      control: { type: "text" },
    },
    holdingLabel: {
      control: { type: "text" },
    },
    confirmedLabel: {
      control: { type: "text" },
    },
  },
  args: {
    variant: "destructive",
    size: "default",
    holdDurationMs: 1500,
    fullWidth: false,
    disabled: false,
    latchConfirmed: false,
    label: "Hold to delete",
    holdingLabel: "Keep holding…",
    confirmedLabel: "Deleted",
    onConfirm: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof HoldToConfirmButtonExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Destructive: Story = {
  args: {},
};

export const Default: Story = {
  args: {
    variant: "default",
    label: "Hold to confirm",
    confirmedLabel: "Confirmed",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    label: "Hold to publish",
    holdingLabel: "Releasing publish…",
    confirmedLabel: "Published",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    label: "Hold to archive",
    confirmedLabel: "Archived",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    label: "Hold to confirm",
    confirmedLabel: "Confirmed",
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
  },
};

export const QuickHold: Story = {
  args: {
    holdDurationMs: 500,
    label: "Hold (0.5s)",
  },
};

export const SlowHold: Story = {
  args: {
    holdDurationMs: 3000,
    label: "Hold (3s)",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const LatchedConfirmation: Story = {
  args: {
    latchConfirmed: true,
    label: "Hold to power off",
    holdingLabel: "Powering off…",
    confirmedLabel: "Powered off",
  },
};

function AllVariantsExample(): ReactElement {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {holdToConfirmButtonVariantIds.map((variant) => (
        <div
          key={variant}
          className="flex flex-col items-stretch gap-3 rounded-md border border-border bg-card p-6"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          <HoldToConfirmButton
            variant={variant}
            icon={<Trash2 />}
            holdingLabel="Keep holding…"
            confirmedLabel="Confirmed"
          >
            Hold to confirm
          </HoldToConfirmButton>
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
    <div className="flex flex-wrap items-end gap-4">
      {holdToConfirmButtonSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <HoldToConfirmButton
            size={size}
            variant="destructive"
            icon={<Trash2 />}
          >
            Hold to delete
          </HoldToConfirmButton>
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

function RealWorldUseCaseExample(): ReactElement {
  const [status, setStatus] = useState<
    "idle" | "deleted" | "sent" | "shutdown"
  >("idle");

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div className="flex flex-col gap-3 rounded-md border border-destructive/30 bg-card p-6">
        <h3 className="text-sm font-semibold">Delete account</h3>
        <p className="text-xs text-muted-foreground">
          This action permanently removes the account and all associated data.
        </p>
        <HoldToConfirmButton
          variant="destructive"
          icon={<Trash2 />}
          holdingLabel="Deleting…"
          confirmedLabel="Account deleted"
          latchConfirmed
          disabled={status === "deleted"}
          onConfirm={() => setStatus("deleted")}
          fullWidth
        >
          Hold to delete account
        </HoldToConfirmButton>
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-6">
        <h3 className="text-sm font-semibold">Send broadcast</h3>
        <p className="text-xs text-muted-foreground">
          Sends a message to every subscriber. Hold to confirm.
        </p>
        <HoldToConfirmButton
          variant="default"
          icon={<Send />}
          holdingLabel="Sending…"
          confirmedLabel="Sent!"
          onConfirm={() => setStatus("sent")}
          fullWidth
        >
          Hold to send
        </HoldToConfirmButton>
        {status === "sent" ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Broadcast queued
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-6">
        <h3 className="text-sm font-semibold">Power down node</h3>
        <p className="text-xs text-muted-foreground">
          Gracefully terminates the running workload. Hold for 2 seconds.
        </p>
        <HoldToConfirmButton
          variant="warning"
          icon={<PowerOff />}
          holdDurationMs={2000}
          holdingLabel="Shutting down…"
          confirmedLabel="Powered off"
          latchConfirmed
          disabled={status === "shutdown"}
          onConfirm={() => setStatus("shutdown")}
          fullWidth
        >
          Hold to power off
        </HoldToConfirmButton>
      </div>
    </div>
  );
}

export const RealWorldUseCases: Story = {
  render: () => <RealWorldUseCaseExample />,
  args: {},
};

function ProgressFeedbackExample(): ReactElement {
  const [progress, setProgress] = useState<number>(0);
  const [released, setReleased] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-start gap-4 rounded-md border border-border bg-card p-6">
      <HoldToConfirmButton
        variant="destructive"
        icon={<AlertTriangle />}
        holdDurationMs={2000}
        holdingLabel="Keep holding…"
        confirmedLabel="Confirmed!"
        onHoldStart={() => {
          setConfirmed(false);
          setReleased(null);
        }}
        onHoldProgress={setProgress}
        onCancel={(p) => {
          setReleased(p);
          setProgress(0);
        }}
        onConfirm={() => {
          setConfirmed(true);
          setProgress(1);
        }}
      >
        Hold for 2 seconds
      </HoldToConfirmButton>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
        <dt className="text-muted-foreground">Live progress</dt>
        <dd className="font-mono">{(progress * 100).toFixed(0)}%</dd>
        <dt className="text-muted-foreground">Released at</dt>
        <dd className="font-mono">
          {released === null ? "—" : `${(released * 100).toFixed(0)}%`}
        </dd>
        <dt className="text-muted-foreground">Confirmed</dt>
        <dd className="font-mono">{confirmed ? "yes" : "no"}</dd>
      </dl>
    </div>
  );
}

export const ProgressFeedback: Story = {
  render: () => <ProgressFeedbackExample />,
  args: {},
};
