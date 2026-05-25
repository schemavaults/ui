"use client";

import {
  Children,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useRef,
} from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cva, type VariantProps } from "class-variance-authority";
import { Info, AlertTriangle, AlertOctagon, Sparkles } from "lucide-react";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "@/framer-motion";

import { cn } from "@/lib/utils";

/**
 * Native HTML div attributes without the handlers that framer-motion's
 * `m.div` overloads (drag/animation events). Spreading these props onto
 * `m.div` otherwise causes a type conflict.
 */
type MotionDivAttributes = Omit<
  HTMLAttributes<HTMLDivElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

/* ------------------------------------------------------------------ */
/* Container                                                          */
/* ------------------------------------------------------------------ */

export const agentChatMessagesSpacingIds = [
  "compact",
  "default",
  "relaxed",
] as const satisfies readonly string[];
export type AgentChatMessagesSpacingId =
  (typeof agentChatMessagesSpacingIds)[number];

const agentChatMessagesStackVariants = cva(
  "flex flex-col px-4 py-4 min-h-full",
  {
    variants: {
      spacing: {
        compact: "gap-2",
        default: "gap-4",
        relaxed: "gap-6",
      } satisfies Record<AgentChatMessagesSpacingId, string>,
    },
    defaultVariants: {
      spacing: "default",
    },
  },
);

export interface AgentChatMessagesProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "dir">,
    VariantProps<typeof agentChatMessagesStackVariants> {
  /**
   * Each direct child should have a stable `key`. Animated entrance and exit
   * are driven by `AnimatePresence`, which relies on keys to track items.
   */
  children?: ReactNode;
  /** Auto-scroll to the latest message when children change. Suppressed when
   * the user has scrolled away from the bottom. Default: true. */
  autoScroll?: boolean;
  /** Pixel threshold for "near bottom" detection. Default: 64. */
  autoScrollThreshold?: number;
  /** Class applied to the inner stack of messages. */
  stackClassName?: string;
  /** Aria label for the live region wrapping the message list. */
  "aria-label"?: string;
  ref?: Ref<HTMLDivElement>;
}

function AgentChatMessages({
  children,
  className,
  stackClassName,
  spacing,
  autoScroll = true,
  autoScrollThreshold = 64,
  ref,
  ...props
}: AgentChatMessagesProps): ReactElement {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);
  const hasMountedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const childCount = Children.count(children);
  const ariaLabel = props["aria-label"] ?? "Chat transcript";

  const handleScroll = useCallback((): void => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const distanceFromBottom =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    stickToBottomRef.current = distanceFromBottom <= autoScrollThreshold;
  }, [autoScrollThreshold]);

  useEffect(() => {
    if (!autoScroll) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const behavior: ScrollBehavior =
      !hasMountedRef.current || prefersReducedMotion ? "auto" : "smooth";

    if (!hasMountedRef.current || stickToBottomRef.current) {
      sentinel.scrollIntoView({ block: "end", behavior });
    }

    hasMountedRef.current = true;
  }, [autoScroll, childCount, prefersReducedMotion]);

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-slot="agent-chat-messages"
      className={cn("relative h-full w-full overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        onScroll={handleScroll}
        data-slot="agent-chat-messages-viewport"
        className="h-full w-full focus-visible:outline-none"
      >
        <LazyMotion features={domAnimation} strict>
          <div
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-atomic="false"
            aria-label={ariaLabel}
            className={cn(
              agentChatMessagesStackVariants({ spacing }),
              stackClassName,
            )}
          >
            <AnimatePresence initial={false}>{children}</AnimatePresence>
            <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
          </div>
        </LazyMotion>
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        orientation="vertical"
        className="flex h-full w-2.5 touch-none border-l border-l-transparent p-px transition-colors select-none"
      >
        <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
AgentChatMessages.displayName = "AgentChatMessages";

/* ------------------------------------------------------------------ */
/* Shared motion props                                                */
/* ------------------------------------------------------------------ */

const messageMotionProps = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.18, ease: "easeOut" as const },
};

const reducedMotionProps = {
  initial: false as const,
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0 },
};

function useMessageMotionProps(): typeof messageMotionProps | typeof reducedMotionProps {
  const reduced = useReducedMotion();
  return reduced ? reducedMotionProps : messageMotionProps;
}

/* ------------------------------------------------------------------ */
/* Bubble                                                             */
/* ------------------------------------------------------------------ */

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
  avatar,
  senderName,
  timestamp,
  className,
  bubbleClassName,
  children,
  ref,
  ...props
}: AgentChatBubbleProps): ReactElement {
  const motionProps = useMessageMotionProps();
  const hasHeader = senderName !== undefined || timestamp !== undefined;

  return (
    <m.div
      ref={ref}
      data-slot="agent-chat-bubble"
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
          "flex flex-col gap-1",
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
        <div className={cn(agentChatBubbleVariants({ from }), bubbleClassName)}>
          {children}
        </div>
      </div>
    </m.div>
  );
}
AgentChatBubble.displayName = "AgentChatBubble";

/* ------------------------------------------------------------------ */
/* Typing indicator                                                   */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Announcement                                                       */
/* ------------------------------------------------------------------ */

export const agentChatAnnouncementVariantIds = [
  "default",
  "info",
  "warning",
  "destructive",
] as const satisfies readonly string[];
export type AgentChatAnnouncementVariantId =
  (typeof agentChatAnnouncementVariantIds)[number];

const agentChatAnnouncementVariants = cva(
  "mx-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium [&>svg]:size-3.5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-border bg-muted/60 text-muted-foreground",
        info: "border-primary/20 bg-primary/10 text-primary [&>svg]:text-primary",
        warning:
          "border-warning/30 bg-warning/10 text-warning [&>svg]:text-warning",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive [&>svg]:text-destructive",
      } satisfies Record<AgentChatAnnouncementVariantId, string>,
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const announcementDefaultIcons: Record<
  AgentChatAnnouncementVariantId,
  ReactElement | null
> = {
  default: null,
  info: <Info />,
  warning: <AlertTriangle />,
  destructive: <AlertOctagon />,
};

export interface AgentChatAnnouncementProps
  extends MotionDivAttributes,
    VariantProps<typeof agentChatAnnouncementVariants> {
  /** Override the default icon. Pass `null` to hide the icon. */
  icon?: ReactNode | null;
  ref?: Ref<HTMLDivElement>;
}

function AgentChatAnnouncement({
  className,
  variant = "default",
  icon,
  children,
  ref,
  ...props
}: AgentChatAnnouncementProps): ReactElement {
  const motionProps = useMessageMotionProps();
  const resolvedIcon =
    icon === null
      ? null
      : icon ?? announcementDefaultIcons[variant ?? "default"];

  return (
    <m.div
      ref={ref}
      data-slot="agent-chat-announcement"
      role="status"
      className={cn("flex w-full justify-center", className)}
      {...motionProps}
    >
      <div className={cn(agentChatAnnouncementVariants({ variant }))} {...props}>
        {resolvedIcon}
        <span>{children}</span>
      </div>
    </m.div>
  );
}
AgentChatAnnouncement.displayName = "AgentChatAnnouncement";

/* ------------------------------------------------------------------ */
/* Human-in-the-loop message                                          */
/* ------------------------------------------------------------------ */

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

export {
  AgentChatMessages,
  AgentChatBubble,
  AgentTypingIndicator,
  AgentChatAnnouncement,
  AgentChatHILMessage,
};
