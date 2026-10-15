"use client";

import {
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  useCallback,
  useState,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ImageOff, Maximize2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { AgentChatImageViewer } from "./agent-chat-image-viewer";
import { useImageLoadState } from "./use-image-load-state";

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

export { AgentChatImage };
