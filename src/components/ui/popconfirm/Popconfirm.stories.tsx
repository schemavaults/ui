import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";
import { Trash2 } from "lucide-react";

import {
  Popconfirm,
  PopconfirmContent,
  PopconfirmTrigger,
  popconfirmIntentIds,
  type PopconfirmIntentId,
} from "./popconfirm";
import { Button } from "@/components/ui/button";

interface BasicExampleProps {
  intent?: PopconfirmIntentId;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  triggerLabel?: string;
}

function BasicExample({
  intent,
  title = "Delete this vault?",
  description = "The vault and its snapshots will be permanently removed. This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  triggerLabel = "Delete vault",
}: BasicExampleProps): ReactElement {
  return (
    <div className="flex h-40 items-center justify-center">
      <Popconfirm>
        <PopconfirmTrigger asChild>
          <Button variant="destructive">{triggerLabel}</Button>
        </PopconfirmTrigger>
        <PopconfirmContent
          intent={intent}
          title={title}
          description={description}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel}
          onConfirm={fn()}
          onCancel={fn()}
        />
      </Popconfirm>
    </div>
  );
}

const meta = {
  title: "Components/Popconfirm",
  component: BasicExample,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A lightweight confirmation popover attached to a trigger. Use " +
          "Popconfirm for reversible-ish destructive actions where a full " +
          "AlertDialog would be overkill (row deletes, unpublish, reset). " +
          "Supports intent variants, custom labels/icons, controlled state, " +
          "and async confirm handlers that keep the popover open while a " +
          "request is in flight.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      options: popconfirmIntentIds,
      control: { type: "radio" },
    },
    title: { control: { type: "text" } },
    description: { control: { type: "text" } },
    confirmLabel: { control: { type: "text" } },
    cancelLabel: { control: { type: "text" } },
    triggerLabel: { control: { type: "text" } },
  },
  args: {
    intent: "danger",
    title: "Delete this vault?",
    description:
      "The vault and its snapshots will be permanently removed. This action cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    triggerLabel: "Delete vault",
  },
} satisfies Meta<typeof BasicExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {};

export const Warning: Story = {
  args: {
    intent: "warning",
    title: "Revoke API key?",
    description:
      "Applications using this key will start receiving 401 responses immediately.",
    confirmLabel: "Revoke",
    triggerLabel: "Revoke key",
  },
};

export const Question: Story = {
  args: {
    intent: "question",
    title: "Reset draft to the last saved version?",
    description: "Your unsaved edits will be discarded.",
    confirmLabel: "Reset",
    triggerLabel: "Reset draft",
  },
};

export const Info: Story = {
  args: {
    intent: "info",
    title: "Publish this schema?",
    description:
      "Once published, subscribers will be notified and the version becomes read-only.",
    confirmLabel: "Publish",
    triggerLabel: "Publish schema",
  },
};

export const AllIntents: Story = {
  render: (): ReactElement => (
    <div className="flex flex-wrap items-center gap-4">
      {popconfirmIntentIds.map((intent) => (
        <Popconfirm key={intent}>
          <PopconfirmTrigger asChild>
            <Button
              variant={intent === "danger" ? "destructive" : "outline"}
              className="capitalize"
            >
              {intent}
            </Button>
          </PopconfirmTrigger>
          <PopconfirmContent
            intent={intent}
            title={`${intent[0].toUpperCase()}${intent.slice(1)} intent`}
            description="Preview of how this intent renders in a Popconfirm."
            onConfirm={fn()}
          />
        </Popconfirm>
      ))}
    </div>
  ),
};

export const WithIconTrigger: Story = {
  render: (): ReactElement => (
    <div className="flex h-40 items-center justify-center">
      <Popconfirm>
        <PopconfirmTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete row"
          >
            <Trash2 className="size-4" />
          </Button>
        </PopconfirmTrigger>
        <PopconfirmContent
          intent="danger"
          title="Delete row?"
          confirmLabel="Delete"
          onConfirm={fn()}
        />
      </Popconfirm>
    </div>
  ),
};

export const WithoutIcon: Story = {
  args: {},
  render: (args): ReactElement => (
    <div className="flex h-40 items-center justify-center">
      <Popconfirm>
        <PopconfirmTrigger asChild>
          <Button variant="destructive">{args.triggerLabel}</Button>
        </PopconfirmTrigger>
        <PopconfirmContent
          intent={args.intent}
          icon={null}
          title={args.title}
          description={args.description}
          confirmLabel={args.confirmLabel}
          cancelLabel={args.cancelLabel}
          onConfirm={fn()}
        />
      </Popconfirm>
    </div>
  ),
};

function AsyncExample(): ReactElement {
  const [deletedAt, setDeletedAt] = useState<string | null>(null);

  return (
    <div className="flex h-40 flex-col items-center justify-center gap-2">
      <Popconfirm>
        <PopconfirmTrigger asChild>
          <Button variant="destructive">Delete vault</Button>
        </PopconfirmTrigger>
        <PopconfirmContent
          intent="danger"
          title="Delete this vault?"
          description="The delete request takes ~800ms to resolve; the popover stays open until it does."
          confirmLabel="Delete"
          onConfirm={async (): Promise<void> => {
            await new Promise((resolve): number =>
              window.setTimeout(resolve, 800),
            );
            setDeletedAt(new Date().toISOString());
          }}
        />
      </Popconfirm>
      <span className="text-xs text-muted-foreground">
        {deletedAt === null
          ? "No deletes yet."
          : `Last deleted at ${deletedAt}`}
      </span>
    </div>
  );
}

export const AsyncConfirm: Story = {
  render: (): ReactElement => <AsyncExample />,
  parameters: {
    docs: {
      description: {
        story:
          "When `onConfirm` returns a promise the confirm button shows a " +
          "spinner and both buttons disable until the promise settles. On " +
          "resolve the popover closes; on reject it stays open so the caller " +
          "can render an error message.",
      },
    },
  },
};

function AsyncErrorExample(): ReactElement {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex h-40 flex-col items-center justify-center gap-2">
      <Popconfirm onOpenChange={(open): void => { if (open) setError(null); }}>
        <PopconfirmTrigger asChild>
          <Button variant="destructive">Delete vault</Button>
        </PopconfirmTrigger>
        <PopconfirmContent
          intent="danger"
          title="Delete this vault?"
          description={
            error !== null
              ? error
              : "This handler rejects after 500ms so you can see the error path."
          }
          confirmLabel="Delete"
          onConfirm={async (): Promise<void> => {
            await new Promise((resolve): number =>
              window.setTimeout(resolve, 500),
            );
            setError("The server refused: vault has active subscribers.");
            throw new Error("subscribers exist");
          }}
        />
      </Popconfirm>
    </div>
  );
}

export const AsyncConfirmWithError: Story = {
  render: (): ReactElement => <AsyncErrorExample />,
};

function ControlledExample(): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-2">
        <Popconfirm open={open} onOpenChange={setOpen}>
          <PopconfirmTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </PopconfirmTrigger>
          <PopconfirmContent
            intent="danger"
            title="Really delete?"
            description="This confirmation is fully controlled from outside."
            confirmLabel="Delete"
            onConfirm={fn()}
          />
        </Popconfirm>
        <Button
          variant="outline"
          size="sm"
          onClick={(): void => setOpen((v): boolean => !v)}
        >
          Toggle from outside
        </Button>
      </div>
      <span className="text-xs text-muted-foreground">
        Open: {String(open)}
      </span>
    </div>
  );
}

export const ControlledOpenState: Story = {
  render: (): ReactElement => <ControlledExample />,
};

function InteractionExample(): ReactElement {
  const [confirmed, setConfirmed] = useState<number>(0);
  return (
    <div className="flex flex-col items-start gap-2">
      <Popconfirm>
        <PopconfirmTrigger asChild>
          <Button variant="destructive">Delete row</Button>
        </PopconfirmTrigger>
        <PopconfirmContent
          intent="danger"
          title="Delete this row?"
          description="This action can't be undone."
          confirmLabel="Delete"
          onConfirm={(): void => setConfirmed((c): number => c + 1)}
        />
      </Popconfirm>
      <span data-testid="confirm-count" className="text-xs">
        Confirmed: {confirmed}
      </span>
    </div>
  );
}

export const ConfirmInteraction: Story = {
  render: (): ReactElement => <InteractionExample />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const trigger = await canvas.findByRole("button", { name: "Delete row" });
    await userEvent.click(trigger);

    const confirm = await body.findByRole("button", { name: "Delete" });
    await userEvent.click(confirm);

    await waitFor((): void => {
      expect(canvas.getByTestId("confirm-count")).toHaveTextContent(
        "Confirmed: 1",
      );
    });
  },
};

export const CancelInteraction: Story = {
  render: (): ReactElement => <InteractionExample />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const trigger = await canvas.findByRole("button", { name: "Delete row" });
    await userEvent.click(trigger);

    const cancel = await body.findByRole("button", { name: "Cancel" });
    await userEvent.click(cancel);

    await waitFor((): void => {
      expect(canvas.getByTestId("confirm-count")).toHaveTextContent(
        "Confirmed: 0",
      );
    });
  },
};
