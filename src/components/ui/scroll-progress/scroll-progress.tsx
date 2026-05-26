"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  m,
  useScroll,
  useSpring,
  useReducedMotion,
} from "@/framer-motion";
import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactElement, RefObject } from "react";

export const scrollProgressPositionIds = [
  "top",
  "bottom",
  "static",
] as const satisfies string[];

export type ScrollProgressPositionId =
  (typeof scrollProgressPositionIds)[number];

export const scrollProgressSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies string[];

export type ScrollProgressSizeId = (typeof scrollProgressSizeIds)[number];

export const scrollProgressColorIds = [
  "default",
  "brand",
  "primary",
  "positive",
  "warning",
  "destructive",
] as const satisfies string[];

export type ScrollProgressColorId = (typeof scrollProgressColorIds)[number];

export const scrollProgressVariants = cva(
  "z-50 w-full origin-left bg-secondary/40 backdrop-blur-sm pointer-events-none",
  {
    variants: {
      position: {
        top: "fixed left-0 right-0 top-0",
        bottom: "fixed left-0 right-0 bottom-0",
        static: "relative",
      } satisfies Record<ScrollProgressPositionId, string>,
      size: {
        sm: "h-0.5",
        default: "h-1",
        lg: "h-1.5",
      } satisfies Record<ScrollProgressSizeId, string>,
    },
    defaultVariants: {
      position: "top",
      size: "default",
    },
  },
);

export const scrollProgressIndicatorVariants = cva(
  "h-full w-full origin-left transition-colors duration-300",
  {
    variants: {
      color: {
        default:
          "bg-gradient-to-r from-schemavaults-brand-blue to-schemavaults-brand-red",
        brand: "bg-schemavaults-brand-blue",
        primary: "bg-primary",
        positive: "bg-green-500",
        warning: "bg-yellow-500",
        destructive: "bg-destructive",
      } satisfies Record<ScrollProgressColorId, string>,
    },
    defaultVariants: {
      color: "default",
    },
  },
);

export interface ScrollProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof scrollProgressVariants>,
    VariantProps<typeof scrollProgressIndicatorVariants> {
  /**
   * Optional ref to a scroll container to track. When omitted, the component
   * tracks the document/window scroll.
   */
  containerRef?: RefObject<HTMLElement | null>;
  /** Accessible label describing what the progress represents. */
  label?: string;
  /** Additional classes applied to the filled indicator. */
  indicatorClassName?: string;
}

/**
 * A horizontal scroll progress indicator that fills as the user scrolls a
 * page or a scroll container. Useful for long-form content like articles,
 * documentation, and changelogs to give the reader a sense of progress.
 *
 * When `containerRef` is omitted, the component tracks document/window scroll.
 * Otherwise, it tracks the referenced element's vertical scroll progress.
 *
 * Animation uses a spring for a smooth follow, and respects
 * `prefers-reduced-motion` by snapping directly to the scroll value.
 */
export function ScrollProgress({
  position,
  size,
  color,
  containerRef,
  label = "Page scroll progress",
  className,
  indicatorClassName,
  ...props
}: ScrollProgressProps): ReactElement {
  const reduceMotion: boolean | null = useReducedMotion();
  const { scrollYProgress } = useScroll(
    containerRef ? { container: containerRef } : undefined,
  );
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.4,
    restDelta: 0.001,
  });

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(scrollProgressVariants({ position, size }), className)}
      {...props}
    >
      <m.div
        style={{ scaleX: reduceMotion ? scrollYProgress : smoothProgress }}
        className={cn(
          scrollProgressIndicatorVariants({ color }),
          indicatorClassName,
        )}
      />
    </div>
  );
}

ScrollProgress.displayName = "ScrollProgress";
