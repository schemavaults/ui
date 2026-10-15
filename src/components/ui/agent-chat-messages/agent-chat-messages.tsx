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
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  useReducedMotion,
} from "@/framer-motion";

import { cn } from "@/lib/utils";

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
  const stackRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);
  const lastScrollTopRef = useRef(0);
  const hasMountedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const childCount = Children.count(children);
  const ariaLabel = props["aria-label"] ?? "Chat transcript";

  // Scrolls only the transcript's own viewport. `scrollIntoView` would also
  // scroll every scrollable ancestor, jumping the whole page to the chat.
  const scrollToBottom = useCallback((behavior: ScrollBehavior): void => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTo({ top: viewport.scrollHeight, behavior });
  }, []);

  const handleScroll = useCallback((): void => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    if (distanceFromBottom <= autoScrollThreshold) {
      stickToBottomRef.current = true;
    } else if (scrollTop < lastScrollTopRef.current) {
      // Only scrolling up unpins. A smooth scroll toward the bottom passes
      // through positions far from it, and must stay pinned on the way down.
      stickToBottomRef.current = false;
    }
    lastScrollTopRef.current = scrollTop;
  }, [autoScrollThreshold]);

  useEffect(() => {
    if (!autoScroll) return;

    const behavior: ScrollBehavior =
      !hasMountedRef.current || prefersReducedMotion ? "auto" : "smooth";

    if (!hasMountedRef.current || stickToBottomRef.current) {
      scrollToBottom(behavior);
    }

    hasMountedRef.current = true;
  }, [autoScroll, childCount, prefersReducedMotion, scrollToBottom]);

  // Messages also grow without a new one arriving: an image finishes
  // loading, or a reply streams in. Keep a pinned transcript pinned.
  useEffect(() => {
    if (!autoScroll) return;
    const stack = stackRef.current;
    if (!stack || typeof ResizeObserver === "undefined") return;

    let lastHeight = stack.offsetHeight;
    const observer = new ResizeObserver((): void => {
      const height = stack.offsetHeight;
      const grew = height > lastHeight;
      lastHeight = height;
      if (grew && stickToBottomRef.current) {
        scrollToBottom(prefersReducedMotion ? "auto" : "smooth");
      }
    });
    observer.observe(stack);
    return (): void => observer.disconnect();
  }, [autoScroll, prefersReducedMotion, scrollToBottom]);

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
            ref={stackRef}
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

export { AgentChatMessages };
