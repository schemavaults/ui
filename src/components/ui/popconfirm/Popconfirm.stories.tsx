import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { KeyRound, Send, Trash2 } from "lucide-react";
import { useState, type ReactElement } from "react";

import {
  Popconfirm,
  PopconfirmAction,
  PopconfirmBody,
  PopconfirmCancel,
  PopconfirmContent,
  PopconfirmDescription,
  PopconfirmFooter,
  PopconfirmHeader,
  PopconfirmIcon,
  PopconfirmTitle,
  PopconfirmTrigger,
  popconfirmToneIds,
  type PopconfirmToneId,
} from "./popconfirm";
import { Button } from "../button";

const meta = {
  title: "Components/Popconfirm",
  component: Popconfirm,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An inline confirmation popover for lightweight, easily-recoverable actions — removing a row, discarding a draft, revoking an API key preview. Anchored to its trigger and dismissible on outside click, so it's less interrupting than an `AlertDialog`. Tones (default/destructive/warning/success/info) coordinate the optional leading icon and the confirm button styling using @schemavaults/theme tokens. Reach for `AlertDialog` when the action is consequential and hard to undo; reach for `Popconfirm` for the fast, in-context Yes/No.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Popconfirm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The canonical destructive inline confirmation — removing something recoverable. */
export const Destructive: Story = {
  render: (args): ReactElement => (
    <Popconfirm {...args}>
      <PopconfirmTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-1.5 size-4" />
          Remove tag
        </Button>
      </PopconfirmTrigger>
      <PopconfirmContent tone="destructive">
        <PopconfirmHeader>
          <PopconfirmIcon />
          <PopconfirmBody>
            <PopconfirmTitle>Remove this tag?</PopconfirmTitle>
            <PopconfirmDescription>
              The tag will be unassigned from 12 vaults. You can re-tag them later.
            </PopconfirmDescription>
          </PopconfirmBody>
        </PopconfirmHeader>
        <PopconfirmFooter>
          <PopconfirmCancel>Cancel</PopconfirmCancel>
          <PopconfirmAction onClick={fn()}>Remove</PopconfirmAction>
        </PopconfirmFooter>
      </PopconfirmContent>
    </Popconfirm>
  ),
};

/** Neutral default tone, no icon — a simple "are you sure?" prompt. */
export const Default: Story = {
  render: (args): ReactElement => (
    <Popconfirm {...args}>
      <PopconfirmTrigger asChild>
        <Button variant="outline" size="sm">Publish draft</Button>
      </PopconfirmTrigger>
      <PopconfirmContent>
        <PopconfirmBody>
          <PopconfirmTitle>Publish this draft?</PopconfirmTitle>
          <PopconfirmDescription>
            It will become visible to everyone in the workspace.
          </PopconfirmDescription>
        </PopconfirmBody>
        <PopconfirmFooter>
          <PopconfirmCancel>Cancel</PopconfirmCancel>
          <PopconfirmAction onClick={fn()}>Publish</PopconfirmAction>
        </PopconfirmFooter>
      </PopconfirmContent>
    </Popconfirm>
  ),
};

/** Warning tone — reversible but the user should think before acting. */
export const Warning: Story = {
  render: (args): ReactElement => (
    <Popconfirm {...args}>
      <PopconfirmTrigger asChild>
        <Button variant="outline" size="sm">
          <KeyRound className="mr-1.5 size-4" />
          Rotate key
        </Button>
      </PopconfirmTrigger>
      <PopconfirmContent tone="warning">
        <PopconfirmHeader>
          <PopconfirmIcon />
          <PopconfirmBody>
            <PopconfirmTitle>Rotate this API key?</PopconfirmTitle>
            <PopconfirmDescription>
              The previous key stops working immediately. Update any dependent
              services before you rotate.
            </PopconfirmDescription>
          </PopconfirmBody>
        </PopconfirmHeader>
        <PopconfirmFooter>
          <PopconfirmCancel>Not now</PopconfirmCancel>
          <PopconfirmAction onClick={fn()}>Rotate</PopconfirmAction>
        </PopconfirmFooter>
      </PopconfirmContent>
    </Popconfirm>
  ),
};

/** Every tone rendered side by side so the icon + confirm-button coordination is visible. */
export const AllTones: Story = {
  render: (): ReactElement => (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {popconfirmToneIds.map((tone: PopconfirmToneId) => (
        <Popconfirm key={tone}>
          <PopconfirmTrigger asChild>
            <Button variant="outline" size="sm" className="capitalize">
              {tone}
            </Button>
          </PopconfirmTrigger>
          <PopconfirmContent tone={tone}>
            <PopconfirmHeader>
              <PopconfirmIcon />
              <PopconfirmBody>
                <PopconfirmTitle className="capitalize">
                  {tone} confirmation
                </PopconfirmTitle>
                <PopconfirmDescription>
                  The leading icon and the confirm button both pick up the{" "}
                  <code>{tone}</code> tone from the surrounding{" "}
                  <code>PopconfirmContent</code>.
                </PopconfirmDescription>
              </PopconfirmBody>
            </PopconfirmHeader>
            <PopconfirmFooter>
              <PopconfirmCancel>Cancel</PopconfirmCancel>
              <PopconfirmAction onClick={fn()}>Confirm</PopconfirmAction>
            </PopconfirmFooter>
          </PopconfirmContent>
        </Popconfirm>
      ))}
    </div>
  ),
};

/** Controlled open state coordinated with an async handler — the popover
 *  stays open while the confirm is in flight, then closes on completion. */
export const AsyncConfirm: Story = {
  render: (): ReactElement => {
    function AsyncExample(): ReactElement {
      const [open, setOpen] = useState<boolean>(false);
      const [pending, setPending] = useState<boolean>(false);
      const [sentAt, setSentAt] = useState<string | null>(null);

      async function handleConfirm(): Promise<void> {
        setPending(true);
        await new Promise((resolve): number =>
          window.setTimeout(resolve, 900),
        );
        setPending(false);
        setSentAt(new Date().toLocaleTimeString());
        setOpen(false);
      }

      return (
        <div className="flex flex-col items-center gap-3">
          <Popconfirm open={open} onOpenChange={setOpen}>
            <PopconfirmTrigger asChild>
              <Button size="sm">
                <Send className="mr-1.5 size-4" />
                Send invoice
              </Button>
            </PopconfirmTrigger>
            <PopconfirmContent tone="info">
              <PopconfirmHeader>
                <PopconfirmIcon />
                <PopconfirmBody>
                  <PopconfirmTitle>Send this invoice now?</PopconfirmTitle>
                  <PopconfirmDescription>
                    We&apos;ll email it to the workspace billing contact.
                  </PopconfirmDescription>
                </PopconfirmBody>
              </PopconfirmHeader>
              <PopconfirmFooter>
                <PopconfirmCancel disabled={pending}>Cancel</PopconfirmCancel>
                <PopconfirmAction loading={pending} onClick={handleConfirm}>
                  {pending ? "Sending" : "Send"}
                </PopconfirmAction>
              </PopconfirmFooter>
            </PopconfirmContent>
          </Popconfirm>
          <p className="text-xs text-muted-foreground">
            {sentAt === null
              ? "The confirm handler resolves after 900ms."
              : `Invoice sent at ${sentAt}.`}
          </p>
        </div>
      );
    }
    return <AsyncExample />;
  },
};

/** Slot-based composition without the leading icon — for the tightest layout. */
export const NoIcon: Story = {
  render: (args): ReactElement => (
    <Popconfirm {...args}>
      <PopconfirmTrigger asChild>
        <Button variant="ghost" size="sm">Discard draft</Button>
      </PopconfirmTrigger>
      <PopconfirmContent tone="destructive" className="w-64">
        <PopconfirmBody>
          <PopconfirmTitle>Discard unsaved changes?</PopconfirmTitle>
          <PopconfirmDescription>You can&apos;t recover them.</PopconfirmDescription>
        </PopconfirmBody>
        <PopconfirmFooter>
          <PopconfirmCancel>Keep editing</PopconfirmCancel>
          <PopconfirmAction onClick={fn()}>Discard</PopconfirmAction>
        </PopconfirmFooter>
      </PopconfirmContent>
    </Popconfirm>
  ),
};

/** Interaction test: opening the popover, cancelling closes it, confirming
 *  fires the handler and closes it. Ensures the composition wires up as
 *  expected in headless CI. */
export const OpenAndConfirmInteraction: Story = {
  render: (): ReactElement => {
    function InteractionExample(): ReactElement {
      const [count, setCount] = useState<number>(0);
      return (
        <div className="flex flex-col items-center gap-2">
          <Popconfirm>
            <PopconfirmTrigger asChild>
              <Button variant="destructive" size="sm">
                Remove item
              </Button>
            </PopconfirmTrigger>
            <PopconfirmContent tone="destructive">
              <PopconfirmHeader>
                <PopconfirmIcon />
                <PopconfirmBody>
                  <PopconfirmTitle>Remove this item?</PopconfirmTitle>
                  <PopconfirmDescription>
                    It can be restored from the trash within 30 days.
                  </PopconfirmDescription>
                </PopconfirmBody>
              </PopconfirmHeader>
              <PopconfirmFooter>
                <PopconfirmCancel>Cancel</PopconfirmCancel>
                <PopconfirmAction
                  onClick={(): void => setCount((prev): number => prev + 1)}
                >
                  Remove
                </PopconfirmAction>
              </PopconfirmFooter>
            </PopconfirmContent>
          </Popconfirm>
          <span data-testid="popconfirm-confirm-count" className="text-xs">
            Confirms: {count}
          </span>
        </div>
      );
    }
    return <InteractionExample />;
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const trigger = await canvas.findByRole("button", { name: "Remove item" });

    // Cancel path.
    await userEvent.click(trigger);
    const cancelButton = await body.findByRole("button", { name: "Cancel" });
    await userEvent.click(cancelButton);
    await waitFor((): void => {
      expect(body.queryByRole("button", { name: "Cancel" })).toBeNull();
    });
    expect(canvas.getByTestId("popconfirm-confirm-count")).toHaveTextContent(
      "Confirms: 0",
    );

    // Confirm path.
    await userEvent.click(trigger);
    const confirmButton = await body.findByRole("button", { name: "Remove" });
    await userEvent.click(confirmButton);
    await waitFor((): void => {
      expect(canvas.getByTestId("popconfirm-confirm-count")).toHaveTextContent(
        "Confirms: 1",
      );
    });
  },
};
