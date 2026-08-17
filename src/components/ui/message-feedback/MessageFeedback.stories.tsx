import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";

import {
  MessageFeedback,
  type MessageFeedbackCommentPayload,
} from "./message-feedback";
import {
  messageFeedbackSizeIds,
  messageFeedbackVariantIds,
  type MessageFeedbackRating,
} from "./message-feedback-variants";

const meta = {
  title: "Components/MessageFeedback",
  component: MessageFeedback,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Thumbs-up / thumbs-down feedback control for rating AI messages, search results, docs, or any other unit of content. Clicking again unselects. When `showCommentPanel` is enabled, an inline comment textarea opens after a rating is chosen so the user can attach optional context; `autoOpenCommentOnDown` restricts that behaviour to negative ratings only — the most common pattern for LLM feedback flows. All colours resolve to `@schemavaults/theme` tokens (`primary`, `destructive`, `accent`, `muted`, `card`, `border`) so the control tracks the active brightness theme automatically.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: messageFeedbackVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: messageFeedbackSizeIds,
      control: { type: "radio" },
    },
    value: {
      options: [null, "up", "down"],
      control: { type: "radio" },
    },
    defaultValue: {
      options: [null, "up", "down"],
      control: { type: "radio" },
    },
    disabled: { control: { type: "boolean" } },
    hideUp: { control: { type: "boolean" } },
    hideDown: { control: { type: "boolean" } },
    showCommentPanel: { control: { type: "boolean" } },
    autoOpenCommentOnDown: { control: { type: "boolean" } },
    commentPlaceholder: { control: { type: "text" } },
  },
  args: {
    variant: "ghost",
    size: "md",
    onValueChange: fn(),
    onCommentSubmit: fn(),
  },
} satisfies Meta<typeof MessageFeedback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Subtle: Story = {
  args: { variant: "subtle" },
};

export const Filled: Story = {
  args: { variant: "default" },
};

export const PreselectedThumbsUp: Story = {
  name: "Preselected thumbs up",
  args: {
    defaultValue: "up",
    variant: "outline",
  },
};

export const PreselectedThumbsDown: Story = {
  name: "Preselected thumbs down",
  args: {
    defaultValue: "down",
    variant: "outline",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "up",
    variant: "outline",
  },
};

export const OnlyThumbsDown: Story = {
  name: "Only thumbs down",
  args: {
    hideUp: true,
    variant: "outline",
  },
};

export const WithCommentPanel: Story = {
  name: "With comment panel",
  args: {
    variant: "outline",
    showCommentPanel: true,
    commentLabel: "Tell us more (optional)",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Selecting any rating opens the inline comment panel; the panel closes when the user submits or cancels, or when they unselect the rating.",
      },
    },
  },
};

export const AutoOpenOnNegative: Story = {
  name: "Auto-open on negative",
  args: {
    variant: "outline",
    showCommentPanel: true,
    autoOpenCommentOnDown: true,
    commentLabel: "What went wrong? (optional)",
    commentPlaceholder: "Describe the issue…",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Thumbs up records silently; thumbs down expands a comment panel so users can add context.",
      },
    },
  },
  play: async ({ canvasElement, args }): Promise<void> => {
    const canvas = within(canvasElement);

    const downButton = await waitFor(() =>
      canvas.getByRole("button", { name: /bad response/i }),
    );
    await userEvent.click(downButton);

    await waitFor(() => {
      expect(args.onValueChange).toHaveBeenCalledWith("down");
    });

    const textarea = await waitFor(() =>
      canvas.getByPlaceholderText(/describe the issue/i),
    );
    await userEvent.type(textarea, "Answer was off-topic.");

    const submit = canvas.getByRole("button", { name: /submit/i });
    await userEvent.click(submit);

    await waitFor(() => {
      expect(args.onCommentSubmit).toHaveBeenCalledWith({
        rating: "down",
        comment: "Answer was off-topic.",
      });
    });
  },
};

export const AllSizes: Story = {
  name: "All sizes",
  render: (): ReactElement => (
    <div className="flex flex-col gap-6 p-4">
      {messageFeedbackSizeIds.map((s) => (
        <div key={s} className="flex items-center gap-4">
          <span className="w-10 text-xs uppercase text-muted-foreground">
            {s}
          </span>
          <MessageFeedback variant="ghost" size={s} />
          <MessageFeedback variant="outline" size={s} />
          <MessageFeedback variant="subtle" size={s} />
          <MessageFeedback
            variant="outline"
            size={s}
            defaultValue="up"
          />
          <MessageFeedback
            variant="outline"
            size={s}
            defaultValue="down"
          />
        </div>
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  name: "All variants",
  render: (): ReactElement => (
    <div className="flex flex-col gap-4 p-4">
      {messageFeedbackVariantIds.map((v) => (
        <div key={v} className="flex items-center gap-4">
          <span className="w-16 text-sm capitalize text-muted-foreground">
            {v}
          </span>
          <MessageFeedback variant={v} />
          <MessageFeedback variant={v} defaultValue="up" />
          <MessageFeedback variant={v} defaultValue="down" />
          <MessageFeedback variant={v} disabled defaultValue="up" />
        </div>
      ))}
    </div>
  ),
};

function ControlledDemo(): ReactElement {
  const [rating, setRating] = useState<MessageFeedbackRating | null>(null);
  const [lastComment, setLastComment] = useState<string | null>(null);
  return (
    <div className="flex w-96 flex-col gap-4">
      <div className="rounded-md border border-border bg-card p-4 text-sm text-foreground">
        <p className="mb-3 text-muted-foreground">
          Sure — here&apos;s a summary of the vault contents you asked about.
          There are 12 records in the primary schema and 3 in the archived
          schema. Let me know if you&apos;d like the breakdown by owner.
        </p>
        <MessageFeedback
          variant="outline"
          value={rating}
          onValueChange={setRating}
          showCommentPanel
          autoOpenCommentOnDown
          commentLabel="What went wrong? (optional)"
          onCommentSubmit={(payload: MessageFeedbackCommentPayload): void => {
            setLastComment(payload.comment || "(no comment)");
          }}
        />
      </div>
      <div className="rounded-md border border-dashed border-border p-3 font-mono text-xs text-muted-foreground">
        <div>rating = {rating ?? "null"}</div>
        <div>lastComment = {lastComment ?? "—"}</div>
      </div>
    </div>
  );
}

export const ControlledWithChatMessage: Story = {
  name: "Controlled in a chat message",
  render: (): ReactElement => <ControlledDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Fully controlled example that mirrors the common LLM chat pattern: a message bubble with feedback buttons below it. Thumbs down opens the comment panel (auto-open on negative); thumbs up is recorded silently.",
      },
    },
  },
};

export const RatingCycles: Story = {
  name: "Click same rating to un-select",
  args: {
    variant: "outline",
  },
  play: async ({ canvasElement, args }): Promise<void> => {
    const canvas = within(canvasElement);

    const upButton = await waitFor(() =>
      canvas.getByRole("button", { name: /good response/i }),
    );
    await userEvent.click(upButton);
    await waitFor(() => {
      expect(args.onValueChange).toHaveBeenLastCalledWith("up");
    });
    expect(upButton).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(upButton);
    await waitFor(() => {
      expect(args.onValueChange).toHaveBeenLastCalledWith(null);
    });
    expect(upButton).toHaveAttribute("aria-pressed", "false");
  },
};
