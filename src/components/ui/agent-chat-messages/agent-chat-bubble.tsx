"use client";

import type { ReactElement, ReactNode, Ref } from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  AgentChatMessageRow,
  type AgentChatBubbleFromId,
} from "./agent-chat-message-row";
import type { MotionDivAttributes } from "./agent-chat-motion";

export {
  agentChatBubbleFromIds,
  type AgentChatBubbleFromId,
} from "./agent-chat-message-row";

const agentChatBubbleVariants = cva(
  "max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm shadow-sm",
  {
    variants: {
      from: {
        user: "bg-primary text-primary-foreground rounded-br-sm",
        assistant: "bg-muted text-foreground rounded-bl-sm",
      } satisfies Record<AgentChatBubbleFromId, string>,
    },
    defaultVariants: {
      from: "assistant",
    },
  },
);

export interface AgentChatBubbleProps extends MotionDivAttributes {
  /** Who sent the message. Drives alignment and color. */
  from: AgentChatBubbleFromId;
  /** Optional avatar slot — render `<Avatar />` here. */
  avatar?: ReactNode;
  /** Optional sender name rendered above the bubble. */
  senderName?: ReactNode;
  /** Optional timestamp rendered next to the sender name. */
  timestamp?: ReactNode;
  /** Class applied directly to the colored bubble element. */
  bubbleClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

function AgentChatBubble({
  from,
  bubbleClassName,
  children,
  ...props
}: AgentChatBubbleProps): ReactElement {
  return (
    <AgentChatMessageRow slot="agent-chat-bubble" from={from} {...props}>
      <div className={cn(agentChatBubbleVariants({ from }), bubbleClassName)}>
        {children}
      </div>
    </AgentChatMessageRow>
  );
}
AgentChatBubble.displayName = "AgentChatBubble";

export { AgentChatBubble };
