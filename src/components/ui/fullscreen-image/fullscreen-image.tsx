"use client";

import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentType,
  ReactElement,
  ReactNode,
} from "react";
import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "@/framer-motion";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BaseImageComponentForFullscreenImageProps {
  src: string;
  alt: string;
  className?: string;
}

type DefaultImageComponentProps = ComponentProps<"img"> &
  BaseImageComponentForFullscreenImageProps;

export interface FullscreenImageProps<
  P extends
    BaseImageComponentForFullscreenImageProps = DefaultImageComponentProps,
> extends Omit<ComponentPropsWithoutRef<"img">, "onClick"> {
  /** Image source for the thumbnail/regular view */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** Optional high-resolution image source for fullscreen view */
  fullscreenSrc?: string;
  /** Optional Next.js Image component for advanced image handling */
  ImageComponent?: ComponentType<P>;
  /** Props to pass to the Next.js Image component */
  imageProps?: Partial<P>;
  /** Props to pass to the fullscreen Next.js Image component */
  fullscreenImageProps?: Partial<P>;
  /** Custom thumbnail content instead of default image */
  thumbnail?: ReactNode;
  /** Custom className for the thumbnail container */
  thumbnailClassName?: string;
  /** Custom className for the fullscreen image */
  fullscreenClassName?: string;
  /** Custom className for the fullscreen image's container */
  fullscreenContainerClassName?: string;
  /** Disable the zoom cursor on hover */
  disableZoomCursor?: boolean;
  /** Custom loading component */
  loadingComponent?: ReactNode;
  /** Callback fired when fullscreen opens */
  onOpen?: () => void;
  /** Callback fired when fullscreen closes */
  onClose?: () => void;
}

/**
 * @name FullscreenImage
 *
 * @returns A React component that displays an enlargeable image. Click the normal/inline image to view it within a fullscreen modal.
 */
function FullscreenImage<
  P extends
    BaseImageComponentForFullscreenImageProps = DefaultImageComponentProps,
>({
  src,
  alt,
  fullscreenSrc,
  ImageComponent,
  imageProps,
  fullscreenImageProps,
  thumbnail,
  thumbnailClassName,
  fullscreenClassName,
  disableZoomCursor = false,
  loadingComponent,
  onOpen,
  onClose,
  className,
  ...props
}: FullscreenImageProps<P>): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openFullscreen = useCallback(() => {
    setIsOpen(true);
    setIsLoading(true);
    onOpen?.();
  }, [onOpen]);

  const closeFullscreen = useCallback(() => {
    setIsOpen(false);
    setIsLoading(false);
    onClose?.();
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeFullscreen();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when fullscreen is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeFullscreen]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  let thumbnailContent: ReactNode;
  if (thumbnail) {
    thumbnailContent = thumbnail;
  } else {
    if (ImageComponent) {
      const customThumbnailProps = {
        src,
        alt,
        ...imageProps,
        className: cn("w-full h-full object-cover", imageProps?.className),
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      thumbnailContent = <ImageComponent {...(customThumbnailProps as any)} />;
    } else {
      thumbnailContent = (
        <img
          src={src}
          alt={alt}
          {...props}
          className={cn("w-full h-full object-cover", className)}
        />
      );
    }
  }

  let fullscreenImageClassName: string;
  if (typeof fullscreenImageProps?.className === "string") {
    fullscreenImageClassName = cn(
      fullscreenImageProps.className,
      fullscreenClassName,
    );
  } else {
    fullscreenImageClassName = cn(
      "max-w-full max-h-full object-contain rounded-lg shadow-2xl",
      fullscreenClassName,
    );
  }

  return (
    <>
      {/* Thumbnail/Trigger */}
      <m.div
        className={cn(
          "relative group overflow-hidden rounded-lg",
          !disableZoomCursor && "cursor-zoom-in",
          thumbnailClassName,
        )}
        onClick={openFullscreen}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {thumbnailContent}

        {/* Hover overlay */}
        {!disableZoomCursor && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8" />
          </div>
        )}
      </m.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={closeFullscreen}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90" />

            {/* Close button */}
            <button
              onClick={closeFullscreen}
              className={cn(
                "absolute",
                "top-4 right-4",
                "z-[1000]",
                "p-2",
                "rounded-full",
                "bg-black/50 hover:bg-black/70",
                "text-white",
                "transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-white/50",
              )}
              aria-label="Close fullscreen image"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-50">
                {loadingComponent || (
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
              </div>
            )}

            {/* Fullscreen Image */}
            <m.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.32, 0.72, 0, 1], // Custom easing for smooth animation
              }}
              className={cn(
                "fullscreen-image-component-container",
                "relative",
                "max-w-[95vw] max-h-[95vh]",
                "flex",
                "items-center justify-center",
                props.fullscreenContainerClassName,
              )}
              onClick={(e): void => e.stopPropagation()}
            >
              {ImageComponent ? (
                <ImageComponent
                  src={fullscreenSrc || src}
                  alt={alt}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {...(fullscreenImageProps as any)}
                  onLoad={handleImageLoad}
                  className={fullscreenImageClassName}
                />
              ) : (
                <img
                  src={fullscreenSrc || src}
                  alt={alt}
                  onLoad={handleImageLoad}
                  className={fullscreenImageClassName}
                />
              )}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

FullscreenImage.displayName = "FullscreenImage";

export { FullscreenImage };
