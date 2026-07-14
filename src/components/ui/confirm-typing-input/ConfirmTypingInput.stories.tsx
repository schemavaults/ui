import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
  ConfirmTypingInput,
  confirmTypingInputSizeIds,
  confirmTypingInputVariantIds,
} from "./confirm-typing-input";

const meta = {
  title: "Components/ConfirmTypingInput",
  component: ConfirmTypingInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A type-to-confirm input for destructive or irreversible actions " +
          "— the pattern popularized by GitHub's \"type repository name to " +
          "delete\" flow and by Vercel, DigitalOcean and Netlify's project " +
          "deletion dialogs. The user must type an exact `phrase` into the " +
          "input before the surrounding action can proceed. The component " +
          "shows a live match indicator, is fully controlled or uncontrolled, " +
          "and integrates with a footer slot so a submit button can be " +
          "disabled until the phrase matches.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: confirmTypingInputVariantIds,
      control: { type: "radio" },
      description:
        "Colour intent for the prompt, input border and icons. Defaults to " +
        "`destructive`.",
    },
    size: {
      options: confirmTypingInputSizeIds,
      control: { type: "radio" },
    },
    phrase: {
      control: { type: "text" },
      description: "The exact phrase the user must type to confirm.",
    },
    caseSensitive: { control: { type: "boolean" } },
    trim: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    showStatusIcon: { control: { type: "boolean" } },
    showLeadingIcon: { control: { type: "boolean" } },
    placeholder: { control: { type: "text" } },
  },
  args: {
    phrase: "delete-my-vault",
    variant: "destructive",
    size: "md",
    caseSensitive: true,
    trim: true,
    showStatusIcon: true,
    disabled: false,
    placeholder: "Type the phrase above",
    onChange: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof ConfirmTypingInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default appearance — destructive intent, medium size, live match indicator
 * on the right-hand side of the input.
 */
export const Default: Story = {
  args: {},
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Warning intent is a slightly softer signal than destructive — appropriate
 * for irreversible-but-not-destructive actions like archiving or rotating a
 * key.
 */
export const Warning: Story = {
  args: {
    variant: "warning",
    phrase: "rotate-api-key",
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Neutral intent — no colored border, no leading warning icon. Useful when
 * the surrounding UI already conveys the severity of the action.
 */
export const Neutral: Story = {
  args: {
    variant: "neutral",
    phrase: "acknowledge",
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/** Three sizes rendered side-by-side. */
export const Sizes: Story = {
  args: {},
  render: (args): ReactElement => (
    <div className="flex w-[480px] flex-col gap-4">
      <ConfirmTypingInput {...args} size="sm" />
      <ConfirmTypingInput {...args} size="md" />
      <ConfirmTypingInput {...args} size="lg" />
    </div>
  ),
};

/** All variants shown at once for design-system review. */
export const AllVariants: Story = {
  args: {},
  render: (args): ReactElement => (
    <div className="flex w-[480px] flex-col gap-4">
      {confirmTypingInputVariantIds.map((variant): ReactElement => (
        <ConfirmTypingInput
          key={variant}
          {...args}
          variant={variant}
          phrase={`confirm-${variant}`}
        />
      ))}
    </div>
  ),
};

/**
 * `caseSensitive={false}` accepts any capitalization of the phrase — useful
 * when the phrase is a natural-language word rather than an identifier.
 */
export const CaseInsensitive: Story = {
  args: {
    phrase: "PERMANENTLY DELETE",
    caseSensitive: false,
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/** Disabled state — no interaction, muted appearance. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/** Custom prompt content via the render function form. */
export const CustomPrompt: Story = {
  args: {
    phrase: "acme-prod",
    prompt: ({ phraseElement }): ReactElement => (
      <span>
        Enter the project slug {phraseElement} to permanently delete the
        environment and all associated data.
      </span>
    ),
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[440px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * The `footer` slot receives the current match state. A common pattern is
 * to render a disabled submit button that becomes actionable once the phrase
 * is matched.
 */
function DeleteVaultDialogExample(): ReactElement {
  const [status, setStatus] = useState<"idle" | "deleted">("idle");
  const [value, setValue] = useState<string>("");
  const phrase = "delete-production-vault";

  return (
    <div className="flex w-[460px] flex-col gap-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-destructive">
          Delete production vault
        </h3>
        <p className="text-xs text-muted-foreground">
          This action is permanent and cannot be undone. All secrets, schemas
          and access tokens will be destroyed.
        </p>
      </div>
      <ConfirmTypingInput
        phrase={phrase}
        value={value}
        onChange={setValue}
        footer={(matched): ReactElement => (
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(): void => setValue("")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={!matched || status === "deleted"}
              onClick={(): void => setStatus("deleted")}
            >
              {status === "deleted" ? "Deleted" : "Delete vault"}
            </Button>
          </div>
        )}
      />
    </div>
  );
}

export const DeleteVaultDialog: Story = {
  render: (): ReactElement => <DeleteVaultDialogExample />,
};

/**
 * Interaction test — driven by Storybook's test runner. Types the phrase
 * character-by-character and asserts that `onConfirm` fires exactly once,
 * at the moment the input transitions to matched.
 */
function InteractionExample(): ReactElement {
  const [matched, setMatched] = useState<boolean>(false);
  const [confirmCount, setConfirmCount] = useState<number>(0);
  const phrase = "confirm-test";

  return (
    <div className="flex w-[420px] flex-col gap-2">
      <ConfirmTypingInput
        phrase={phrase}
        aria-label="Interaction target"
        onChange={(next): void => {
          setMatched(next === phrase);
        }}
        onConfirm={(): void => {
          setConfirmCount((prev): number => prev + 1);
        }}
      />
      <span
        data-testid="confirm-typing-input-state"
        className="text-xs text-muted-foreground"
      >
        matched={matched ? "true" : "false"} confirms={confirmCount}
      </span>
    </div>
  );
}

export const MatchInteraction: Story = {
  render: (): ReactElement => <InteractionExample />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);

    const input = await canvas.findByLabelText("Interaction target");
    await userEvent.type(input, "confirm-tes");

    await waitFor((): void => {
      expect(canvas.getByTestId("confirm-typing-input-state")).toHaveTextContent(
        "matched=false confirms=0",
      );
    });

    await userEvent.type(input, "t");

    await waitFor((): void => {
      expect(canvas.getByTestId("confirm-typing-input-state")).toHaveTextContent(
        "matched=true confirms=1",
      );
    });

    // Backspace and retype — onConfirm should fire again on the next match.
    await userEvent.type(input, "{Backspace}");
    await waitFor((): void => {
      expect(canvas.getByTestId("confirm-typing-input-state")).toHaveTextContent(
        "matched=false confirms=1",
      );
    });
    await userEvent.type(input, "t");
    await waitFor((): void => {
      expect(canvas.getByTestId("confirm-typing-input-state")).toHaveTextContent(
        "matched=true confirms=2",
      );
    });
  },
};
