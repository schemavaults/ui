"use client";

/**
 * Internal: the row layout shared by `AgentChatBubble` and
 * `AgentChatArtifactMessage`, and the `from` ids both accept. The ids are
 * public through `agent-chat-bubble`; the row itself is not part of the API.
 */

import type { ReactElement, ReactNode, Ref } from "react";
import { cva } from "class-variance-authority";
import { m } from "@/framer-motion";

import { cn } from "@/lib/utils";
import {
  type MotionDivAttributes,
  useMessageMotionProps,
} from "./agent-chat-motion";

export const agentChatBubbleFromIds = ["user", "assistant"] as const satisfies
  readonly string[];
export type AgentChatBubbleFromId = (typeof agentChatBubbleFromIds)[number];

const agentChatBubbleRowVariants = cva("flex w-full items-end gap-2", {
  variants: {
    from: {
      user: "flex-row-reverse",
      assistant: "flex-row",
    } satisfies Record<AgentChatBubbleFromId, string>,
  },
  defaultVariants: {
    from: "assistant",
  },
});

export interface AgentChatMessageRowProps extends MotionDivAttributes {
  /** `data-slot` of the row: names the public component that rendered it. */
  slot: string;
  from: AgentChatBubbleFromId;
  avatar?: ReactNode;
  senderName?: ReactNode;
  timestamp?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/**
 * The animated row every sender-attributed message shares — avatar, sender
 * and timestamp header, and the column the message body sits in — mirrored
 * for the user's side of the conversation.
 */
export function AgentChatMessageRow({
  slot,
  from,
  avatar,
  senderName,
  timestamp,
  className,
  children,
  ref,
  ...props
}: AgentChatMessageRowProps): ReactElement {
  const motionProps = useMessageMotionProps();
  const hasHeader = senderName !== undefined || timestamp !== undefined;

  return (
    <m.div
      ref={ref}
      data-slot={slot}
      data-from={from}
      className={cn(agentChatBubbleRowVariants({ from }), className)}
      {...motionProps}
      {...props}
    >
      {avatar ? (
        <div className="shrink-0" aria-hidden="true">
          {avatar}
        </div>
      ) : null}
      <div
        className={cn(
          "flex w-full min-w-0 flex-col gap-1",
          from === "user" ? "items-end" : "items-start",
        )}
      >
        {hasHeader ? (
          <div
            className={cn(
              "flex items-baseline gap-2 px-1 text-xs text-muted-foreground",
              from === "user" ? "flex-row-reverse" : "flex-row",
            )}
          >
            {senderName ? (
              <span className="font-medium text-foreground">{senderName}</span>
            ) : null}
            {timestamp ? <span>{timestamp}</span> : null}
          </div>
        ) : null}
        {children}
      </div>
    </m.div>
  );
}
