import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Trash2, AlertTriangle, ShieldAlert, LogOut } from "lucide-react";
import { useState, type ReactElement } from "react";

import { HoldToConfirmButton } from "./hold-to-confirm-button";
import {
  holdToConfirmButtonSizeIds,
  holdToConfirmButtonVariantIds,
} from "./hold-to-confirm-button-variants";

const meta = {
  title: "Components/HoldToConfirmButton",
  component: HoldToConfirmButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A press-and-hold confirmation button intended for destructive or " +
          "otherwise irreversible actions. The user must hold the button " +
          "(pointer or keyboard) for `durationMs` before `onConfirm` fires; " +
          "releasing early cancels the action and rewinds the progress fill. " +
          "Uses the standard SchemaVaults theme tokens for variants and " +
          "supports the usual `sm` / `default` / `lg` sizes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: holdToConfirmButtonVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: holdToConfirmButtonSizeIds,
      control: { type: "radio" },
    },
    durationMs: { control: { type: "number", min: 250, step: 100 } },
    resetOnConfirm: { control: { type: "boolean" } },
    confirmedResetDelayMs: { control: { type: "number", min: 250, step: 100 } },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    children: "Hold to delete",
    variant: "destructive",
    size: "default",
    durationMs: 1500,
    resetOnConfirm: false,
    confirmedResetDelayMs: 1200,
    disabled: false,
    onConfirm: fn(),
    onHoldStart: fn(),
    onHoldCancel: fn(),
  },
} satisfies Meta<typeof HoldToConfirmButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: { variant: "primary", children: "Hold to publish" },
};

export const Warning: Story = {
  args: { variant: "warning", children: "Hold to overwrite" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Hold to confirm" },
};

export const Neutral: Story = {
  args: { variant: "default", children: "Hold to acknowledge" },
};

export const WithLeadingIcon: Story = {
  args: {
    variant: "destructive",
    children: (
      <>
        <Trash2 aria-hidden="true" />
        Hold to delete vault
      </>
    ),
  },
};

export const FastHold: Story = {
  args: { durationMs: 600, children: "Hold (0.6s)" },
  parameters: {
    docs: {
      description: {
        story:
          "Short hold durations work for low-stakes confirmations - keep them " +
          "above ~300ms so a stray tap can't trigger them.",
      },
    },
  },
};

export const SlowHold: Story = {
  args: { durationMs: 3000, children: "Hold (3s)", variant: "warning" },
  parameters: {
    docs: {
      description: {
        story:
          "Longer durations are appropriate for irreversible actions like " +
          "wiping a production vault.",
      },
    },
  },
};

export const ResetsAfterConfirm: Story = {
  args: {
    resetOnConfirm: true,
    confirmedResetDelayMs: 1500,
    holdingLabel: "Keep holding…",
    confirmedLabel: "Deleted!",
    children: "Hold to delete",
  },
  parameters: {
    docs: {
      description: {
        story:
          "With `resetOnConfirm`, the button briefly shows its `confirmedLabel` " +
          "then returns to the idle state - useful when the same action is " +
          "available repeatedly (e.g. clearing items from a list).",
      },
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" },
};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="flex w-[20rem] flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground">
      {holdToConfirmButtonVariantIds.map((variant) => (
        <div key={variant} className="flex items-center justify-between gap-3">
          <span className="w-24 text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          <HoldToConfirmButton
            variant={variant}
            durationMs={1200}
            onConfirm={fn()}
          >
            Hold to confirm
          </HoldToConfirmButton>
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex w-[20rem] flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground">
      {holdToConfirmButtonSizeIds.map((size) => (
        <div key={size} className="flex items-center justify-between gap-3">
          <span className="w-24 text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <HoldToConfirmButton
            size={size}
            variant="destructive"
            durationMs={1200}
            onConfirm={fn()}
          >
            Hold to delete
          </HoldToConfirmButton>
        </div>
      ))}
    </div>
  ),
};

function DangerZoneStory(): ReactElement {
  const [status, setStatus] = useState<string>("ready");

  return (
    <div className="flex w-[26rem] flex-col gap-4 rounded-lg border border-destructive/40 bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex items-center gap-2 text-destructive">
        <ShieldAlert aria-hidden="true" className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          Danger zone
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Delete this vault</span>
        <span className="text-xs text-muted-foreground">
          This permanently removes all schemas, secrets, and audit history.
          This action cannot be undone.
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span
          data-testid="danger-zone-status"
          className="text-xs text-muted-foreground"
        >
          Status: {status}
        </span>
        <HoldToConfirmButton
          variant="destructive"
          durationMs={1500}
          resetOnConfirm
          confirmedResetDelayMs={2000}
          holdingLabel={
            <>
              <AlertTriangle aria-hidden="true" />
              Keep holding…
            </>
          }
          confirmedLabel="Vault deleted"
          onHoldStart={(): void => setStatus("holding")}
          onHoldCancel={(): void => setStatus("cancelled")}
          onConfirm={(): void => setStatus("deleted")}
        >
          <Trash2 aria-hidden="true" />
          Hold to delete vault
        </HoldToConfirmButton>
      </div>
    </div>
  );
}

export const DangerZone: Story = {
  render: (): ReactElement => <DangerZoneStory />,
  parameters: {
    docs: {
      description: {
        story:
          "A realistic destructive-action card combining a leading icon, " +
          "dynamic hold/confirmed labels, and `resetOnConfirm` so the surface " +
          "returns to its idle state after the toast/notification fires.",
      },
    },
  },
};

export const SignOutEverywhere: Story = {
  args: {
    variant: "warning",
    durationMs: 1200,
    resetOnConfirm: true,
    children: (
      <>
        <LogOut aria-hidden="true" />
        Hold to sign out everywhere
      </>
    ),
    holdingLabel: (
      <>
        <LogOut aria-hidden="true" />
        Releasing sessions…
      </>
    ),
    confirmedLabel: "All sessions ended",
  },
};

function ConfirmCounterStory(): ReactElement {
  const [confirms, setConfirms] = useState<number>(0);
  return (
    <div className="flex flex-col gap-2">
      <HoldToConfirmButton
        variant="destructive"
        durationMs={700}
        resetOnConfirm
        confirmedResetDelayMs={400}
        onConfirm={(): void => setConfirms((c): number => c + 1)}
      >
        Hold to confirm
      </HoldToConfirmButton>
      <span data-testid="hold-confirm-counter" className="text-xs">
        Confirmations: {confirms}
      </span>
    </div>
  );
}

export const HoldInteraction: Story = {
  render: (): ReactElement => <ConfirmCounterStory />,
  parameters: {
    docs: {
      description: {
        story:
          "Holds the button programmatically long enough to trigger " +
          "`onConfirm`, then verifies the counter incremented.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole("button", { name: /Hold to confirm/i });

    await userEvent.pointer([
      { keys: "[MouseLeft>]", target: button },
    ]);
    // Wait slightly longer than the 700ms duration before releasing.
    await new Promise((resolve): number =>
      window.setTimeout(resolve, 1100) as unknown as number,
    );
    await userEvent.pointer([{ keys: "[/MouseLeft]", target: button }]);

    await waitFor((): void => {
      expect(canvas.getByTestId("hold-confirm-counter")).toHaveTextContent(
        "Confirmations: 1",
      );
    });
  },
};

export const ReleaseCancelsInteraction: Story = {
  render: (): ReactElement => <ConfirmCounterStory />,
  parameters: {
    docs: {
      description: {
        story:
          "Releasing the pointer before the hold duration elapses cancels the " +
          "confirmation - the counter does not increment.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole("button", { name: /Hold to confirm/i });

    await userEvent.pointer([{ keys: "[MouseLeft>]", target: button }]);
    // Release well before 700ms.
    await new Promise((resolve): number =>
      window.setTimeout(resolve, 150) as unknown as number,
    );
    await userEvent.pointer([{ keys: "[/MouseLeft]", target: button }]);

    // Give the implementation time to clear timers and update state.
    await new Promise((resolve): number =>
      window.setTimeout(resolve, 200) as unknown as number,
    );

    expect(canvas.getByTestId("hold-confirm-counter")).toHaveTextContent(
      "Confirmations: 0",
    );
  },
};
