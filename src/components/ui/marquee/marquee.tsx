"use client";

import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "@/framer-motion";

import { cn } from "@/lib/utils";

export const marqueeDirectionIds = [
  "left",
  "right",
  "up",
  "down",
] as const satisfies readonly string[];
export type MarqueeDirectionId = (typeof marqueeDirectionIds)[number];

export const marqueeFadeIds = [
  "none",
  "background",
  "muted",
  "card",
] as const satisfies readonly string[];
export type MarqueeFadeId = (typeof marqueeFadeIds)[number];

export const marqueeGapIds = [
  "sm",
  "default",
  "lg",
  "xl",
] as const satisfies readonly string[];
export type MarqueeGapId = (typeof marqueeGapIds)[number];

const gapPx: Record<MarqueeGapId, number> = {
  sm: 16,
  default: 32,
  lg: 48,
  xl: 64,
};

const fadeFromColor: Record<MarqueeFadeId, string> = {
  none: "",
  background: "from-background",
  muted: "from-muted",
  card: "from-card",
};

const marqueeRootVariants = cva("group/marquee relative flex overflow-hidden", {
  variants: {
    orientation: {
      horizontal: "w-full flex-row",
      vertical: "h-full flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

interface FadeMaskProps {
  orientation: "horizontal" | "vertical";
  fade: Exclude<MarqueeFadeId, "none">;
  size: number;
}

function FadeMasks({ orientation, fade, size }: FadeMaskProps): ReactElement {
  const fromClass = fadeFromColor[fade];
  if (orientation === "horizontal") {
    return (
      <>
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 bg-gradient-to-r to-transparent",
            fromClass,
          )}
          style={{ width: size }}
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 bg-gradient-to-l to-transparent",
            fromClass,
          )}
          style={{ width: size }}
        />
      </>
    );
  }
  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b to-transparent",
          fromClass,
        )}
        style={{ height: size }}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t to-transparent",
          fromClass,
        )}
        style={{ height: size }}
      />
    </>
  );
}

export interface MarqueeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof marqueeRootVariants> {
  /** Items to scroll. Each child is rendered as one cell of the rail. */
  children: ReactNode;
  /** Scroll direction. `left`/`right` scroll horizontally, `up`/`down` scroll vertically. Default: `"left"`. */
  direction?: MarqueeDirectionId;
  /** Seconds for one full loop. Lower = faster. Default: `30`. */
  duration?: number;
  /** How many copies of the content to render for a seamless loop. Default: `2`. Minimum: `2`. */
  repeat?: number;
  /** Pause animation on hover. Default: `true`. */
  pauseOnHover?: boolean;
  /** Edge fade mask color. Match this to the surface the marquee sits on. Default: `"none"`. */
  fade?: MarqueeFadeId;
  /** Length of the fade mask in pixels. Default: `64`. */
  fadeSize?: number;
  /** Spacing between items. Default: `"default"` (32px). */
  gap?: MarqueeGapId;
}

export function Marquee({
  className,
  children,
  direction = "left",
  duration = 30,
  repeat = 2,
  pauseOnHover = true,
  fade = "none",
  fadeSize = 64,
  gap = "default",
  ...props
}: MarqueeProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const orientation: "horizontal" | "vertical" =
    direction === "up" || direction === "down" ? "vertical" : "horizontal";
  const isReversed: boolean = direction === "right" || direction === "down";

  const childArray = Children.toArray(children);
  const safeRepeat = Math.max(2, Math.floor(repeat));
  const gapSize = gapPx[gap];

  // Spacing is baked into each item via margin so the total track width is an exact
  // integer multiple of one copy's width. This keeps the -50% loop perfectly seamless.
  const itemSpacingStyle: CSSProperties =
    orientation === "horizontal"
      ? { marginRight: gapSize }
      : { marginBottom: gapSize };

  const copies: ReactNode[] = Array.from({ length: safeRepeat }, (_, copyIndex) => (
    <div
      key={`marquee-copy-${copyIndex}`}
      aria-hidden={copyIndex > 0 ? "true" : undefined}
      className={cn(
        "flex shrink-0",
        orientation === "horizontal" ? "flex-row" : "flex-col",
      )}
    >
      {childArray.map((child, itemIndex) => (
        <div
          key={`marquee-item-${copyIndex}-${itemIndex}`}
          className="shrink-0"
          style={itemSpacingStyle}
        >
          {child}
        </div>
      ))}
    </div>
  ));

  const loopEnd: string = `-${100 / safeRepeat}%`;
  const animateProp = orientation === "horizontal"
    ? { x: isReversed ? [loopEnd, "0%"] : ["0%", loopEnd] }
    : { y: isReversed ? [loopEnd, "0%"] : ["0%", loopEnd] };

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        role="marquee"
        aria-label={props["aria-label"] ?? "Scrolling content"}
        className={cn(marqueeRootVariants({ orientation }), className)}
        {...props}
      >
        {fade !== "none" ? (
          <FadeMasks orientation={orientation} fade={fade} size={fadeSize} />
        ) : null}

        <m.div
          className={cn(
            "flex w-max",
            orientation === "horizontal" ? "flex-row" : "h-max flex-col",
          )}
          animate={prefersReducedMotion ? undefined : animateProp}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                }
          }
          whileHover={
            pauseOnHover && !prefersReducedMotion
              ? { transition: { duration: 0 } }
              : undefined
          }
          style={{ willChange: "transform" }}
        >
          {copies}
        </m.div>
      </div>
    </LazyMotion>
  );
}
Marquee.displayName = "Marquee";

export interface MarqueeItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Optional convenience wrapper. You can pass plain children to <Marquee /> directly,
 * but <MarqueeItem> gives you a styled, theme-aware "card" cell out of the box.
 */
export function MarqueeItem({
  className,
  children,
  ...props
}: MarqueeItemProps): ReactElement {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
MarqueeItem.displayName = "MarqueeItem";

export default Marquee;
