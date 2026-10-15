"use client";

import type { ReactElement, ReactNode, Ref } from "react";
import { m, useReducedMotion } from "@/framer-motion";

import { cn } from "@/lib/utils";
import {
  type MotionDivAttributes,
  useMessageMotionProps,
} from "./agent-chat-motion";

export interface AgentTypingIndicatorProps extends MotionDivAttributes {
  /** Optional avatar slot — render `<Avatar />` here. */
  avatar?: ReactNode;
  /** Accessible label announced by screen readers. */
  label?: string;
  ref?: Ref<HTMLDivElement>;
}

function AgentTypingIndicator({
  avatar,
  label = "Assistant is typing",
  className,
  ref,
  ...props
}: AgentTypingIndicatorProps): ReactElement {
  const motionProps = useMessageMotionProps();
  const prefersReducedMotion = useReducedMotion();

  return (
    <m.div
      ref={ref}
      data-slot="agent-typing-indicator"
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("flex w-full items-end gap-2", className)}
      {...motionProps}
      {...props}
    >
      {avatar ? (
        <div className="shrink-0" aria-hidden="true">
          {avatar}
        </div>
      ) : null}
      <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-foreground shadow-sm">
        {prefersReducedMotion ? (
          <span
            aria-hidden="true"
            className="text-sm leading-none text-muted-foreground"
          >
            …
          </span>
        ) : (
          <>
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce motion-reduce:animate-none"
            />
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms] motion-reduce:animate-none"
            />
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms] motion-reduce:animate-none"
            />
          </>
        )}
      </div>
    </m.div>
  );
}
AgentTypingIndicator.displayName = "AgentTypingIndicator";

export { AgentTypingIndicator };
