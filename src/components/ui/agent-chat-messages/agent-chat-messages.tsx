"use client";

import {
  Children,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Info,
  AlertTriangle,
  AlertOctagon,
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileVideo,
  ImageOff,
  LoaderCircle,
  Maximize2,
  Sparkles,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "@/framer-motion";

import {
  inferAttachmentFileKind,
  type AttachmentCardFileKindId,
} from "@/components/ui/attachment-card";
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

interface AgentChatMessageRowProps extends MotionDivAttributes {
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
function AgentChatMessageRow({
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

/* ------------------------------------------------------------------ */
/* Artifact message                                                   */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Image                                                              */
/* ------------------------------------------------------------------ */

type ImageLoadStatus = "loading" | "loaded" | "error";

interface ImageLoadState {
  status: ImageLoadStatus;
  onLoad: () => void;
  onError: () => void;
  /** Ref for the `<img>`, catching an image that loaded before `onLoad` was attached. */
  imgRef: (node: HTMLImageElement | null) => void;
}

/**
 * Tracks whether `src` has loaded. The settled state remembers which source
 * it settled for, so a new `src` reads as loading again without an effect.
 */
function useImageLoadState(src: string): ImageLoadState {
  const [settled, setSettled] = useState<{
    src: string;
    status: Exclude<ImageLoadStatus, "loading">;
  } | null>(null);

  const onLoad = useCallback((): void => {
    setSettled({ src, status: "loaded" });
  }, [src]);
  const onError = useCallback((): void => {
    setSettled({ src, status: "error" });
  }, [src]);

  // A cached image, or one that finished before hydration, may never fire
  // `load` at a handler attached after the fact.
  const imgRef = useCallback(
    (node: HTMLImageElement | null): void => {
      if (node?.complete && node.naturalWidth > 0) onLoad();
    },
    [onLoad],
  );

  return {
    status: settled?.src === src ? settled.status : "loading",
    onLoad,
    onError,
    imgRef,
  };
}

export const agentChatImageFitIds = [
  "cover",
  "contain",
] as const satisfies readonly string[];
export type AgentChatImageFitId = (typeof agentChatImageFitIds)[number];

export const agentChatImageRenderVariantIds = [
  "preview",
  "fullscreen",
] as const satisfies readonly string[];
export type AgentChatImageRenderVariantId =
  (typeof agentChatImageRenderVariantIds)[number];

/** What `AgentChatImage` hands to `renderImage`. */
export interface AgentChatImageRenderProps {
  /** Which surface is being drawn: the inline preview or the fullscreen viewer. */
  variant: AgentChatImageRenderVariantId;
  /** `src` for the preview, `fullscreenSrc ?? src` for the viewer. */
  src: string;
  alt: string;
  /** Sizing classes the surface relies on. Put them on your image element. */
  className: string;
  /** Call when the image has loaded. Until then a loading state is shown. */
  onLoad: () => void;
  /** Call if the image fails to load, to show the error state. */
  onError: () => void;
}

export interface AgentChatImageProps
  extends Omit<HTMLAttributes<HTMLElement>, "children" | "onClick"> {
  /** Source of the inline preview — typically a downscaled thumbnail. */
  src: string;
  /** Alt text. Also titles the fullscreen viewer for screen readers. */
  alt: string;
  /**
   * Source shown in the fullscreen viewer — typically the full-resolution
   * original. Only fetched once the viewer opens. Default: `src`.
   */
  fullscreenSrc?: string;
  /**
   * Intrinsic width of the preview image, in px. Together with `height` it
   * reserves the preview's space before the image loads, so the transcript
   * doesn't jump.
   */
  width?: number;
  /** Intrinsic height of the preview image, in px. See `width`. */
  height?: number;
  /**
   * Fit the preview into a box of this aspect ratio (e.g. `"4 / 3"` or
   * `16 / 9`) that fills the available width. Takes precedence over
   * `width`/`height`. Use it to line images up in a grid.
   */
  aspectRatio?: number | string;
  /**
   * How the image fills an `aspectRatio` box that doesn't match its own
   * shape. Default: "cover".
   */
  fit?: AgentChatImageFitId;
  /** The tallest the preview may grow. Numbers are px. Default: 320. */
  previewMaxHeight?: number | string;
  /** Caption shown under the preview and in the fullscreen viewer. */
  caption?: ReactNode;
  /**
   * Controls overlaid on the preview's top-right corner, e.g. a download
   * button. They appear on hover or focus on devices that can hover, and
   * stay visible on touch screens.
   */
  actions?: ReactNode;
  /**
   * Fires when the preview is clicked, before the fullscreen viewer opens.
   * Call `event.preventDefault()` to keep the viewer closed and handle the
   * click yourself — open a side panel, an annotation tool, anything.
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Turn off the built-in fullscreen viewer. The preview stays clickable
   * when `onClick` is set, and is static otherwise.
   */
  disableFullscreen?: boolean;
  /** Controlled open state of the fullscreen viewer. */
  open?: boolean;
  /** Initial open state of the fullscreen viewer when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the fullscreen viewer opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Render the image element yourself — e.g. with `next/image` — for the
   * preview and the viewer. Apply the `className` you're given, and call
   * `onLoad` / `onError`, or the loading state never clears.
   */
  renderImage?: (props: AgentChatImageRenderProps) => ReactNode;
  /** Accessible label of the preview button. Default: "View full size: {alt}". */
  expandLabel?: string;
  /** Accessible label of the viewer's close button. Default: "Close". */
  closeLabel?: string;
  /** Shown in place of an image that failed to load. Default: "Image unavailable". */
  errorLabel?: ReactNode;
  /** Class applied to the preview `<img>`. */
  imageClassName?: string;
  /** Class applied to the `<img>` in the fullscreen viewer. */
  fullscreenClassName?: string;
  ref?: Ref<HTMLElement>;
}

interface AgentChatImageViewerProps {
  src: string;
  alt: string;
  caption?: ReactNode;
  renderImage?: (props: AgentChatImageRenderProps) => ReactNode;
  closeLabel: string;
  errorLabel: ReactNode;
  className?: string;
  onClose: () => void;
}

/** The fullscreen lightbox. Rendered inside the image's `DialogPrimitive.Root`. */
function AgentChatImageViewer({
  src,
  alt,
  caption,
  renderImage,
  closeLabel,
  errorLabel,
  className,
  onClose,
}: AgentChatImageViewerProps): ReactElement {
  const { status, onLoad, onError, imgRef } = useImageLoadState(src);
  const imageClassName = cn(
    "min-h-0 max-h-full max-w-full object-contain",
    status === "error" && "hidden",
    className,
  );

  // Without a caption there's no Description, so opt out of Radix's
  // missing-description warning.
  const describedByProps =
    caption === undefined ? { "aria-describedby": undefined } : {};

  // The content spans the screen, so a click on the dark area around the
  // image lands on the content element itself.
  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        data-slot="agent-chat-image-viewer"
        {...describedByProps}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 p-4 outline-none sm:p-10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
      >
        <DialogPrimitive.Title className="sr-only">{alt}</DialogPrimitive.Title>
        {renderImage ? (
          renderImage({
            variant: "fullscreen",
            src,
            alt,
            className: imageClassName,
            onLoad,
            onError,
          })
        ) : (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            onLoad={onLoad}
            onError={onError}
            className={imageClassName}
          />
        )}
        {status === "loading" ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/70"
          >
            <LoaderCircle className="size-8 animate-spin motion-reduce:animate-none" />
          </span>
        ) : null}
        {status === "error" ? (
          <span className="flex flex-col items-center gap-2 text-sm text-white/80">
            <ImageOff aria-hidden="true" className="size-8" />
            {errorLabel}
          </span>
        ) : null}
        {caption !== undefined ? (
          <DialogPrimitive.Description className="max-w-prose shrink-0 text-center text-sm text-white/80">
            {caption}
          </DialogPrimitive.Description>
        ) : null}
        <DialogPrimitive.Close
          aria-label={closeLabel}
          className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <X aria-hidden="true" className="size-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/**
 * An image in the transcript — a screenshot, a chart, a generated diagram.
 * Shows a lightweight preview inline and opens `fullscreenSrc` in a
 * fullscreen viewer when clicked. Use `onClick` to add to or replace that.
 */
function AgentChatImage({
  src,
  alt,
  fullscreenSrc,
  width,
  height,
  aspectRatio,
  fit = "cover",
  previewMaxHeight = 320,
  caption,
  actions,
  onClick,
  disableFullscreen = false,
  open,
  defaultOpen = false,
  onOpenChange,
  renderImage,
  expandLabel,
  closeLabel = "Close",
  errorLabel = "Image unavailable",
  imageClassName,
  fullscreenClassName,
  className,
  style,
  ref,
  ...props
}: AgentChatImageProps): ReactElement {
  const preview = useImageLoadState(src);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;

  const handleOpenChange = useCallback(
    (next: boolean): void => {
      if (open === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );

  // "fill": an `aspectRatio` box as wide as the space allows.
  // "intrinsic": the known `width`/`height`, reserved before load.
  // "natural": whatever size the image turns out to be.
  const sizing: "fill" | "intrinsic" | "natural" =
    aspectRatio !== undefined
      ? "fill"
      : width && height
        ? "intrinsic"
        : "natural";

  const figureStyle = {
    "--agent-chat-image-max-height":
      typeof previewMaxHeight === "number"
        ? `${previewMaxHeight}px`
        : previewMaxHeight,
    ...style,
  } as CSSProperties;

  let frameStyle: CSSProperties | undefined;
  if (sizing === "fill") {
    frameStyle = { aspectRatio };
  } else if (sizing === "intrinsic" && width && height) {
    frameStyle = {
      aspectRatio: `${width} / ${height}`,
      // As wide as the image, unless that would make it taller than the cap.
      width: `min(${width}px, calc(var(--agent-chat-image-max-height) * ${width / height}))`,
    };
  }

  const hasViewer = !disableFullscreen;
  const isInteractive = hasViewer || onClick !== undefined;
  const isSettled = preview.status !== "loading";

  const frameClassName = cn(
    "relative block max-w-full overflow-hidden bg-muted/50",
    sizing === "fill" && "w-full",
    sizing === "natural" && preview.status !== "loaded" && "min-h-24 min-w-40",
    isInteractive &&
      "group/agent-chat-image-frame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
    isInteractive && (hasViewer ? "cursor-zoom-in" : "cursor-pointer"),
  );

  const previewClassName = cn(
    sizing === "natural"
      ? "relative block h-auto w-auto max-w-full max-h-[var(--agent-chat-image-max-height)]"
      : "absolute inset-0 h-full w-full",
    fit === "contain" ? "object-contain" : "object-cover",
    preview.status === "error" && "invisible",
    imageClassName,
  );

  const frameContent = (
    <>
      {!isSettled ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-muted motion-reduce:animate-none"
        />
      ) : null}
      {renderImage ? (
        renderImage({
          variant: "preview",
          src,
          alt,
          className: previewClassName,
          onLoad: preview.onLoad,
          onError: preview.onError,
        })
      ) : (
        <img
          ref={preview.imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          onLoad={preview.onLoad}
          onError={preview.onError}
          className={previewClassName}
        />
      )}
      {preview.status === "error" ? (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2 text-center text-xs text-muted-foreground">
          <ImageOff aria-hidden="true" className="size-5" />
          {errorLabel}
        </span>
      ) : null}
      {isInteractive ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover/agent-chat-image-frame:bg-black/15"
        >
          {hasViewer ? (
            <span className="flex size-9 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover/agent-chat-image-frame:opacity-100 group-focus-visible/agent-chat-image-frame:opacity-100">
              <Maximize2 className="size-4" />
            </span>
          ) : null}
        </span>
      ) : null}
    </>
  );

  let frame: ReactElement;
  if (hasViewer) {
    frame = (
      <DialogPrimitive.Trigger
        data-slot="agent-chat-image-trigger"
        aria-label={expandLabel ?? `View full size: ${alt}`}
        onClick={onClick}
        className={frameClassName}
        style={frameStyle}
      >
        {frameContent}
      </DialogPrimitive.Trigger>
    );
  } else if (onClick) {
    frame = (
      <button
        type="button"
        data-slot="agent-chat-image-trigger"
        aria-label={alt}
        onClick={onClick}
        className={frameClassName}
        style={frameStyle}
      >
        {frameContent}
      </button>
    );
  } else {
    frame = (
      <div className={frameClassName} style={frameStyle}>
        {frameContent}
      </div>
    );
  }

  const figure = (
    <figure
      ref={ref}
      data-slot="agent-chat-image"
      data-status={preview.status}
      className={cn(
        "group/agent-chat-image relative max-w-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
        sizing === "fill" ? "flex w-full" : "inline-flex",
        className,
      )}
      style={figureStyle}
      {...props}
    >
      {frame}
      {actions !== undefined ? (
        <div
          data-slot="agent-chat-image-actions"
          className="absolute right-2 top-2 flex items-center gap-1 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within/agent-chat-image:opacity-100 [@media(hover:hover)]:group-hover/agent-chat-image:opacity-100"
        >
          {actions}
        </div>
      ) : null}
      {caption !== undefined ? (
        // Inline-size containment keeps a long caption from widening the
        // figure past its image; the caption wraps to the image's width.
        <figcaption className="border-t px-3 py-2 text-xs text-muted-foreground [contain:inline-size]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );

  if (!hasViewer) return figure;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      {figure}
      <AgentChatImageViewer
        src={fullscreenSrc ?? src}
        alt={alt}
        caption={caption}
        renderImage={renderImage}
        closeLabel={closeLabel}
        errorLabel={errorLabel}
        className={fullscreenClassName}
        onClose={(): void => handleOpenChange(false)}
      />
    </DialogPrimitive.Root>
  );
}
AgentChatImage.displayName = "AgentChatImage";

/* ------------------------------------------------------------------ */
/* Artifact card                                                      */
/* ------------------------------------------------------------------ */

const agentChatArtifactIconVariants = cva(
  "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md [&>svg]:size-5",
  {
    variants: {
      kind: {
        image: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
        video: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
        audio: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
        text: "bg-muted text-muted-foreground",
        code: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        archive: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        spreadsheet:
          "bg-lime-500/10 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300",
        json: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
        pdf: "bg-red-500/10 text-red-600 dark:text-red-400",
        generic: "bg-muted text-muted-foreground",
      } satisfies Record<AttachmentCardFileKindId, string>,
    },
    defaultVariants: {
      kind: "generic",
    },
  },
);

const agentChatArtifactKindIcons: Record<AttachmentCardFileKindId, ElementType> =
  {
    image: FileImage,
    video: FileVideo,
    audio: FileAudio,
    text: FileText,
    code: FileCode,
    archive: FileArchive,
    spreadsheet: FileSpreadsheet,
    json: FileJson,
    pdf: FileText,
    generic: FileIcon,
  };

export interface AgentChatArtifactProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onClick"> {
  /** The artifact's name — usually a file name. Labels the card's open action. */
  title: ReactNode;
  /** Secondary line, e.g. `"CSV · 8 rows"`. */
  description?: ReactNode;
  /**
   * The artifact's kind, which picks its icon and color. Inferred from
   * `fileType`, then from `title` when it's a string with an extension.
   */
  kind?: AttachmentCardFileKindId;
  /** File extension (`"csv"`) or MIME type (`"text/csv"`) used to infer `kind`. */
  fileType?: string;
  /** Replaces the kind icon. */
  icon?: ReactNode;
  /** Thumbnail image shown in place of the icon. */
  previewSrc?: string;
  /**
   * Makes the whole card a button — open a dialog, a side panel, a canvas.
   * Ignored when `href` is set (the link's own click handler instead).
   */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Makes the whole card a link. */
  href?: string;
  /** Passed to the link when `href` is set. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  /** Passed to the link when `href` is set. Default with `target="_blank"`: "noopener noreferrer". */
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  /**
   * Controls at the card's right edge — download, copy, a menu. They sit
   * above the card's own click target, so clicking them doesn't open it.
   */
  actions?: ReactNode;
  /** Accessible label of the card's open action. Default: the title's text. */
  openLabel?: string;
  /** Disables the card's open action. */
  disabled?: boolean;
  /** Class applied to the icon box. */
  iconClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A file or artifact the agent produced — a CSV, a report, a code bundle —
 * as a compact card. Give it `onClick` or `href` and the whole card opens it;
 * `actions` add secondary controls alongside.
 */
function AgentChatArtifact({
  title,
  description,
  kind,
  fileType,
  icon,
  previewSrc,
  onClick,
  href,
  target,
  rel,
  actions,
  openLabel,
  disabled = false,
  className,
  iconClassName,
  ref,
  ...props
}: AgentChatArtifactProps): ReactElement {
  const descriptionId = useId();
  const resolvedKind: AttachmentCardFileKindId =
    kind ??
    inferAttachmentFileKind(typeof title === "string" ? title : "", fileType);
  const KindIcon = agentChatArtifactKindIcons[resolvedKind];
  const hasDescription =
    description !== undefined && description !== null && description !== "";
  const isInteractive = !disabled && (href !== undefined || onClick !== undefined);

  // The open action is stretched over the whole card by its `::after`, so
  // the card is one big click target while `actions` stay clickable above it.
  const triggerClassName =
    "min-w-0 rounded-sm text-left font-medium outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring";
  const titleContent = <span className="block truncate">{title}</span>;
  const triggerProps = {
    "data-slot": "agent-chat-artifact-trigger",
    "aria-label": openLabel,
    "aria-describedby": hasDescription ? descriptionId : undefined,
    className: triggerClassName,
  };

  let primary: ReactElement;
  if (href !== undefined && !disabled) {
    primary = (
      <a
        {...triggerProps}
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        onClick={onClick}
      >
        {titleContent}
      </a>
    );
  } else if (onClick !== undefined) {
    primary = (
      <button
        {...triggerProps}
        type="button"
        disabled={disabled}
        onClick={onClick}
      >
        {titleContent}
      </button>
    );
  } else {
    primary = (
      <span className="min-w-0 font-medium">{titleContent}</span>
    );
  }

  return (
    <div
      ref={ref}
      data-slot="agent-chat-artifact"
      data-kind={resolvedKind}
      data-disabled={disabled || undefined}
      className={cn(
        "relative flex w-full max-w-sm items-center gap-3 rounded-lg border bg-card p-3 text-sm text-card-foreground shadow-sm transition-colors",
        isInteractive && "cursor-pointer hover:bg-accent/40",
        disabled && "opacity-60",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          agentChatArtifactIconVariants({ kind: resolvedKind }),
          iconClassName,
        )}
      >
        {previewSrc ? (
          <img
            src={previewSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          icon ?? <KindIcon />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        {primary}
        {hasDescription ? (
          <span
            id={descriptionId}
            className="truncate text-xs text-muted-foreground"
          >
            {description}
          </span>
        ) : null}
      </span>
      {actions !== undefined ? (
        <div
          data-slot="agent-chat-artifact-actions"
          className="relative z-10 flex shrink-0 items-center gap-1"
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
AgentChatArtifact.displayName = "AgentChatArtifact";

export {
  AgentChatMessages,
  AgentChatBubble,
  AgentTypingIndicator,
  AgentChatAnnouncement,
  AgentChatHILMessage,
  AgentChatArtifactMessage,
  AgentChatImage,
  AgentChatArtifact,
};
