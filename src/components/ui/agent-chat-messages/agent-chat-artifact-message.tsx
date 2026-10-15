"use client";

import type { ReactElement, ReactNode, Ref } from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  AgentChatMessageRow,
  type AgentChatBubbleFromId,
} from "./agent-chat-message-row";
import type { MotionDivAttributes } from "./agent-chat-motion";

export const agentChatArtifactMessageLayoutIds = [
  "stack",
  "grid",
] as const satisfies readonly string[];
export type AgentChatArtifactMessageLayoutId =
  (typeof agentChatArtifactMessageLayoutIds)[number];

const agentChatArtifactMessageContentVariants = cva("w-full max-w-[80%]", {
  variants: {
    layout: {
      stack: "flex flex-col gap-2",
      grid: "grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-2",
    } satisfies Record<AgentChatArtifactMessageLayoutId, string>,
    from: {
      user: "items-end",
      assistant: "items-start",
    } satisfies Record<AgentChatBubbleFromId, string>,
  },
  defaultVariants: {
    layout: "stack",
    from: "assistant",
  },
});

export interface AgentChatArtifactMessageProps extends MotionDivAttributes {
  /** Who shared the artifacts. Drives alignment. Default: "assistant". */
  from?: AgentChatBubbleFromId;
  /** Optional avatar slot — render `<Avatar />` here. */
  avatar?: ReactNode;
  /** Optional sender name rendered above the artifacts. */
  senderName?: ReactNode;
  /** Optional timestamp rendered next to the sender name. */
  timestamp?: ReactNode;
  /**
   * `"stack"` lists artifacts one under another at their own size.
   * `"grid"` tiles them in columns at least 10rem wide — give each
   * `AgentChatImage` an `aspectRatio` so the tiles line up. Default: "stack".
   */
  layout?: AgentChatArtifactMessageLayoutId;
  /** Class applied to the element that lays out the artifacts. */
  contentClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A transcript row for images and other artifacts — the same avatar and
 * sender header as `AgentChatBubble`, without the colored bubble. Children
 * are typically `AgentChatImage` and `AgentChatArtifact`, but any content
 * works. (Both can also be placed inside an `AgentChatBubble` alongside text.)
 */
function AgentChatArtifactMessage({
  from = "assistant",
  layout = "stack",
  contentClassName,
  children,
  ...props
}: AgentChatArtifactMessageProps): ReactElement {
  return (
    <AgentChatMessageRow
      slot="agent-chat-artifact-message"
      from={from}
      {...props}
    >
      <div
        data-slot="agent-chat-artifact-message-content"
        data-layout={layout}
        className={cn(
          agentChatArtifactMessageContentVariants({ layout, from }),
          contentClassName,
        )}
      >
        {children}
      </div>
    </AgentChatMessageRow>
  );
}
AgentChatArtifactMessage.displayName = "AgentChatArtifactMessage";

export { AgentChatArtifactMessage };
