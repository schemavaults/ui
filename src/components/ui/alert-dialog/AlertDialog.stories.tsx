import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { LogOut, Trash2 } from "lucide-react";
import { useState, type ReactElement } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogTitle,
  AlertDialogTrigger,
  alertDialogToneIds,
  type AlertDialogToneId,
} from "./alert-dialog";
import { Button } from "../button";

const meta = {
  title: "Components/AlertDialog",
  component: AlertDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A modal confirmation dialog for consequential actions. Built on Radix Dialog but rendered with `role=\"alertdialog\"`: it traps focus, focuses the safe Cancel button on open, omits the corner close button, and refuses to dismiss on an outside click so the user must make an explicit choice. Tones (default/destructive/warning/success/info) coordinate the optional leading icon and the confirm button styling using @schemavaults/theme tokens.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: { control: { type: "boolean" } },
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The canonical destructive confirmation — deleting something irreversible. */
export const Destructive: Story = {
  render: (args): ReactElement => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 size-4" />
          Delete project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent tone="destructive">
        <AlertDialogHeader>
          <AlertDialogIcon />
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the project and all of its schemas. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={fn()}>
            Yes, delete it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/** Default tone with no icon — a neutral confirmation prompt. */
export const Default: Story = {
  render: (args): ReactElement => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show confirmation</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will apply your changes to all team members in the workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={fn()}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/** A warning-tone confirmation, e.g. signing out of an active session. */
export const Warning: Story = {
  render: (args): ReactElement => (
    <AlertDialog {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <LogOut className="mr-2 size-4" />
          Sign out everywhere
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent tone="warning">
        <AlertDialogHeader>
          <AlertDialogIcon />
          <AlertDialogTitle>Sign out of all devices?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to sign in again on every device, including this one.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay signed in</AlertDialogCancel>
          <AlertDialogAction onClick={fn()}>Sign out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/** Every tone side by side so the icon + confirm-button coordination is visible. */
export const AllTones: Story = {
  render: (): ReactElement => (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {alertDialogToneIds.map((tone: AlertDialogToneId) => (
        <AlertDialog key={tone}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="capitalize">
              {tone}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent tone={tone}>
            <AlertDialogHeader>
              <AlertDialogIcon />
              <AlertDialogTitle className="capitalize">
                {tone} confirmation
              </AlertDialogTitle>
              <AlertDialogDescription>
                The leading icon and the confirm button both pick up the{" "}
                <code>{tone}</code> tone from the surrounding{" "}
                <code>AlertDialogContent</code>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={fn()}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  ),
};

/** Controlled open state with an async-style confirm handler. */
export const Controlled: Story = {
  render: (): ReactElement => {
    function ControlledExample(): ReactElement {
      const [open, setOpen] = useState<boolean>(false);
      const [deleted, setDeleted] = useState<boolean>(false);

      return (
        <div className="flex flex-col items-center gap-3">
          <Button variant="destructive" onClick={(): void => setOpen(true)}>
            Delete account
          </Button>
          <p className="text-sm text-muted-foreground">
            {deleted ? "Account deleted." : "Account active."}
          </p>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent tone="destructive">
              <AlertDialogHeader>
                <AlertDialogIcon />
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  All of your data will be erased. This cannot be reversed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep account</AlertDialogCancel>
                <AlertDialogAction onClick={(): void => setDeleted(true)}>
                  Delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    }

    return <ControlledExample />;
  },
};
