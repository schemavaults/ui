"use client";

import type { ReactElement, ReactNode, Ref } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Sparkles } from "lucide-react";
import { m } from "@/framer-motion";

import { cn } from "@/lib/utils";
import {
  type MotionDivAttributes,
  useMessageMotionProps,
} from "./agent-chat-motion";

export const agentChatHILMessageToneIds = [
  "default",
  "primary",
  "warning",
] as const satisfies readonly string[];
export type AgentChatHILMessageToneId =
  (typeof agentChatHILMessageToneIds)[number];

const agentChatHILMessageVariants = cva(
  "relative w-full rounded-lg border border-dashed bg-card text-card-foreground p-4 shadow-sm",
  {
    variants: {
      tone: {
        default: "border-border",
        primary: "border-primary/40 bg-primary/5",
        warning: "border-warning/40 bg-warning/5",
      } satisfies Record<AgentChatHILMessageToneId, string>,
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export interface AgentChatHILMessageProps
  extends MotionDivAttributes,
    VariantProps<typeof agentChatHILMessageVariants> {
  /** Small uppercase label rendered at the top of the container. */
  label?: ReactNode;
  /** Icon rendered next to the label. Defaults to a Sparkles glyph when label is set. */
  icon?: ReactNode | null;
  ref?: Ref<HTMLDivElement>;
}

function AgentChatHILMessage({
  className,
  tone,
  label,
  icon,
  children,
  ref,
  ...props
}: AgentChatHILMessageProps): ReactElement {
  const motionProps = useMessageMotionProps();
  const resolvedIcon =
    icon === null ? null : icon ?? (label ? <Sparkles className="size-3.5" /> : null);
  const ariaLabel = typeof label === "string" ? label : undefined;

  return (
    <m.div
      ref={ref}
      data-slot="agent-chat-hil-message"
      role="group"
      aria-label={ariaLabel ?? "Human-in-the-loop request"}
      className={cn(agentChatHILMessageVariants({ tone }), className)}
      {...motionProps}
      {...props}
    >
      {label !== undefined ? (
        <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {resolvedIcon}
          <span>{label}</span>
        </div>
      ) : null}
      <div>{children}</div>
    </m.div>
  );
}
AgentChatHILMessage.displayName = "AgentChatHILMessage";

export { AgentChatHILMessage };
