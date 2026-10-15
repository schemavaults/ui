"use client";

/**
 * Internal: the fullscreen viewer `AgentChatImage` opens. Not part of the
 * public API — the package index doesn't re-export this module.
 */

import type { MouseEvent, ReactElement, ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ImageOff, LoaderCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AgentChatImageRenderProps } from "./agent-chat-image";
import { useImageLoadState } from "./use-image-load-state";

export interface AgentChatImageViewerProps {
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
export function AgentChatImageViewer({
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
