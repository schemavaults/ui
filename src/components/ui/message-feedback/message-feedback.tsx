"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import {
  type MessageFeedbackRating,
  type MessageFeedbackSize,
  type MessageFeedbackVariant,
  messageFeedbackRatingIds,
  messageFeedbackSizeIds,
  messageFeedbackVariantIds,
} from "./message-feedback-variants";

const containerVariants = cva(
  "inline-flex items-center align-middle",
  {
    variants: {
      size: {
        sm: "gap-0.5",
        md: "gap-1",
        lg: "gap-1.5",
      } satisfies Record<MessageFeedbackSize, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true][data-rating=up]:bg-primary/10 data-[selected=true][data-rating=up]:text-primary data-[selected=true][data-rating=down]:bg-destructive/10 data-[selected=true][data-rating=down]:text-destructive",
        outline:
          "border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true][data-rating=up]:border-primary/50 data-[selected=true][data-rating=up]:bg-primary/10 data-[selected=true][data-rating=up]:text-primary data-[selected=true][data-rating=down]:border-destructive/50 data-[selected=true][data-rating=down]:bg-destructive/10 data-[selected=true][data-rating=down]:text-destructive",
        ghost:
          "bg-transparent text-muted-foreground hover:bg-accent/60 hover:text-foreground data-[selected=true][data-rating=up]:text-primary data-[selected=true][data-rating=down]:text-destructive",
        subtle:
          "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground data-[selected=true][data-rating=up]:bg-primary/15 data-[selected=true][data-rating=up]:text-primary data-[selected=true][data-rating=down]:bg-destructive/15 data-[selected=true][data-rating=down]:text-destructive",
      } satisfies Record<MessageFeedbackVariant, string>,
      size: {
        sm: "h-7 w-7 [&_svg]:size-3.5",
        md: "h-8 w-8 [&_svg]:size-4",
        lg: "h-10 w-10 [&_svg]:size-[18px]",
      } satisfies Record<MessageFeedbackSize, string>,
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  },
);

export interface MessageFeedbackCommentPayload {
  /** The rating currently selected when the comment was submitted. */
  rating: MessageFeedbackRating;
  /** Trimmed comment text submitted by the user. */
  comment: string;
}

export interface MessageFeedbackProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    VariantProps<typeof containerVariants> {
  /** Controlled current rating. Pass `null` for "no rating". */
  value?: MessageFeedbackRating | null;
  /** Default (uncontrolled) rating. */
  defaultValue?: MessageFeedbackRating | null;
  /** Visual variant applied to both thumbs buttons. */
  variant?: MessageFeedbackVariant;
  /** Fired when the rating changes. Null when the user un-selects. */
  onValueChange?: (value: MessageFeedbackRating | null) => void;
  /** Disable interaction and mute the buttons. */
  disabled?: boolean;
  /** Hide the "up" (thumbs-up) button entirely. */
  hideUp?: boolean;
  /** Hide the "down" (thumbs-down) button entirely. */
  hideDown?: boolean;
  /**
   * When true, selecting a rating reveals an inline comment textarea and
   * submit button so the user can attach optional context to their feedback.
   */
  showCommentPanel?: boolean;
  /** Placeholder shown inside the comment textarea. */
  commentPlaceholder?: string;
  /** Label rendered above the comment textarea when open. */
  commentLabel?: ReactNode;
  /** Label for the submit button. Defaults to "Submit". */
  commentSubmitLabel?: ReactNode;
  /** Label for the cancel button. Defaults to "Cancel". */
  commentCancelLabel?: ReactNode;
  /**
   * When true, the comment panel opens automatically on selecting the "down"
   * rating (the common case where negative feedback needs context) but stays
   * closed for "up". Requires `showCommentPanel` to be true.
   */
  autoOpenCommentOnDown?: boolean;
  /**
   * Fired when the user submits the comment textarea. Receives the rating
   * and trimmed comment text. The panel is closed automatically after.
   */
  onCommentSubmit?: (payload: MessageFeedbackCommentPayload) => void;
  /** Accessible label for the thumbs-up button. */
  upAriaLabel?: string;
  /** Accessible label for the thumbs-down button. */
  downAriaLabel?: string;
  /** Optional class name for the root container. */
  className?: string;
  /** Optional class name for the buttons row (inside the root). */
  buttonsClassName?: string;
  /** Optional class name for the comment panel. */
  commentPanelClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

function MessageFeedback({
  value,
  defaultValue = null,
  variant,
  size,
  onValueChange,
  disabled = false,
  hideUp = false,
  hideDown = false,
  showCommentPanel = false,
  commentPlaceholder = "What could be better? (optional)",
  commentLabel,
  commentSubmitLabel = "Submit",
  commentCancelLabel = "Cancel",
  autoOpenCommentOnDown = false,
  onCommentSubmit,
  upAriaLabel = "Good response",
  downAriaLabel = "Bad response",
  className,
  buttonsClassName,
  commentPanelClassName,
  ref,
  ...rest
}: MessageFeedbackProps): ReactElement {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<MessageFeedbackRating | null>(
    defaultValue,
  );
  const current: MessageFeedbackRating | null = isControlled
    ? (value as MessageFeedbackRating | null)
    : internal;

  const [comment, setComment] = useState<string>("");
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const textareaId = useId();

  const updateRating = useCallback(
    (next: MessageFeedbackRating | null): void => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const handleClick = useCallback(
    (rating: MessageFeedbackRating): void => {
      if (disabled) return;
      const next: MessageFeedbackRating | null =
        current === rating ? null : rating;
      updateRating(next);

      if (!showCommentPanel) return;

      if (next === null) {
        setPanelOpen(false);
        setComment("");
        return;
      }

      if (autoOpenCommentOnDown && next === "down") {
        setPanelOpen(true);
      } else if (!autoOpenCommentOnDown) {
        setPanelOpen(true);
      }
    },
    [autoOpenCommentOnDown, current, disabled, showCommentPanel, updateRating],
  );

  useEffect((): void => {
    if (panelOpen) {
      textareaRef.current?.focus();
    }
  }, [panelOpen]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      if (current === null) return;
      const trimmed: string = comment.trim();
      onCommentSubmit?.({ rating: current, comment: trimmed });
      setComment("");
      setPanelOpen(false);
    },
    [comment, current, onCommentSubmit],
  );

  const handleCancel = useCallback((): void => {
    setComment("");
    setPanelOpen(false);
  }, []);

  const canRenderPanel: boolean =
    showCommentPanel && panelOpen && current !== null && !disabled;

  return (
    <div
      ref={ref}
      data-slot="message-feedback"
      data-rating={current ?? "none"}
      data-disabled={disabled ? "true" : "false"}
      className={cn("inline-flex flex-col gap-2", className)}
      {...rest}
    >
      <div
        role="group"
        aria-label="Message feedback"
        className={cn(containerVariants({ size }), buttonsClassName)}
      >
        {!hideUp ? (
          <button
            type="button"
            data-slot="message-feedback-up"
            data-rating="up"
            data-selected={current === "up" ? "true" : "false"}
            aria-label={upAriaLabel}
            aria-pressed={current === "up"}
            disabled={disabled}
            onClick={(): void => handleClick("up")}
            className={cn(buttonVariants({ variant, size }))}
          >
            <ThumbsUp aria-hidden="true" />
          </button>
        ) : null}
        {!hideDown ? (
          <button
            type="button"
            data-slot="message-feedback-down"
            data-rating="down"
            data-selected={current === "down" ? "true" : "false"}
            aria-label={downAriaLabel}
            aria-pressed={current === "down"}
            disabled={disabled}
            onClick={(): void => handleClick("down")}
            className={cn(buttonVariants({ variant, size }))}
          >
            <ThumbsDown aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {canRenderPanel ? (
        <form
          data-slot="message-feedback-comment"
          data-rating={current}
          onSubmit={handleSubmit}
          className={cn(
            "flex w-72 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm",
            commentPanelClassName,
          )}
        >
          {commentLabel !== undefined ? (
            <label
              htmlFor={textareaId}
              className="text-xs font-medium text-muted-foreground"
            >
              {commentLabel}
            </label>
          ) : null}
          <textarea
            id={textareaId}
            ref={textareaRef}
            value={comment}
            onChange={(event): void => setComment(event.target.value)}
            placeholder={commentPlaceholder}
            rows={3}
            data-slot="message-feedback-textarea"
            className={cn(
              "flex min-h-[72px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              data-slot="message-feedback-cancel"
              className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
              {commentCancelLabel}
            </button>
            <button
              type="submit"
              data-slot="message-feedback-submit"
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
              {commentSubmitLabel}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
MessageFeedback.displayName = "MessageFeedback";

export {
  MessageFeedback,
  containerVariants as messageFeedbackContainerVariants,
  buttonVariants as messageFeedbackButtonVariants,
  messageFeedbackRatingIds,
  messageFeedbackSizeIds,
  messageFeedbackVariantIds,
};
export type {
  MessageFeedbackRating,
  MessageFeedbackSize,
  MessageFeedbackVariant,
};

export default MessageFeedback;
