"use client";

import {
  Children,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { animate, m, useMotionValue, useReducedMotion } from "@/framer-motion";

import { cn } from "@/lib/utils";

export const carouselSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type CarouselSizeId = (typeof carouselSizeIds)[number];

export const carouselArrowPositionIds = [
  "inside",
  "outside",
] as const satisfies readonly string[];
export type CarouselArrowPositionId =
  (typeof carouselArrowPositionIds)[number];

const arrowButtonVariants = cva(
  "absolute top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      size: {
        sm: "h-7 w-7 [&>svg]:h-3.5 [&>svg]:w-3.5",
        default: "h-9 w-9 [&>svg]:h-4 [&>svg]:w-4",
        lg: "h-11 w-11 [&>svg]:h-5 [&>svg]:w-5",
      } satisfies Record<CarouselSizeId, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const indicatorVariants = cva(
  "rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      size: {
        sm: "h-1.5",
        default: "h-2",
        lg: "h-2.5",
      } satisfies Record<CarouselSizeId, string>,
      active: {
        true: "bg-primary",
        false: "bg-muted-foreground/30 hover:bg-muted-foreground/50",
      },
    },
    defaultVariants: {
      size: "default",
      active: false,
    },
  },
);

const indicatorWidth: Record<CarouselSizeId, { active: string; idle: string }> =
  {
    sm: { active: "w-4", idle: "w-1.5" },
    default: { active: "w-5", idle: "w-2" },
    lg: { active: "w-6", idle: "w-2.5" },
  };

export interface CarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange">,
    VariantProps<typeof arrowButtonVariants> {
  /** Each child is rendered as one full-width slide. */
  children: ReactNode;
  /** Controlled active slide index. Pair with `onIndexChange`. */
  index?: number;
  /** Initial active slide index when uncontrolled. Default: `0`. */
  defaultIndex?: number;
  /** Called whenever the active slide changes. */
  onIndexChange?: (index: number) => void;
  /** Wrap around past the first/last slide. Default: `false`. */
  loop?: boolean;
  /** Advance automatically. Disabled when the user prefers reduced motion. Default: `false`. */
  autoplay?: boolean;
  /** Milliseconds between autoplay advances. Default: `4000`. */
  autoplayInterval?: number;
  /** Pause autoplay while the pointer is over the carousel. Default: `true`. */
  pauseOnHover?: boolean;
  /** Show the previous/next arrow buttons. Default: `true`. */
  showArrows?: boolean;
  /** Show the dot indicators. Default: `true`. */
  showIndicators?: boolean;
  /** Where to render the arrow buttons relative to the viewport. Default: `"inside"`. */
  arrowPosition?: CarouselArrowPositionId;
  /** Control + indicator sizing. Default: `"default"`. */
  size?: CarouselSizeId;
  /** Accessible label for the carousel region. */
  "aria-label"?: string;
}

const SWIPE_DISTANCE_RATIO = 0.2;
const SWIPE_VELOCITY = 0.5;
const DRAG_START_THRESHOLD = 5;

export function Carousel({
  className,
  children,
  index,
  defaultIndex = 0,
  onIndexChange,
  loop = false,
  autoplay = false,
  autoplayInterval = 4000,
  pauseOnHover = true,
  showArrows = true,
  showIndicators = true,
  arrowPosition = "inside",
  size = "default",
  ...props
}: CarouselProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  const slides = Children.toArray(children);
  const count = slides.length;
  const lastIndex = Math.max(0, count - 1);
  const clamp = useCallback(
    (value: number): number => Math.min(Math.max(value, 0), lastIndex),
    [lastIndex],
  );

  const isControlled = index != null;
  const [internalIndex, setInternalIndex] = useState<number>(
    clamp(defaultIndex),
  );
  const currentIndex = clamp(isControlled ? index : internalIndex);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const x = useMotionValue(0);

  // Refs that gesture/autoplay handlers read without re-subscribing.
  const widthRef = useRef<number>(0);
  widthRef.current = width;
  const indexRef = useRef<number>(currentIndex);
  indexRef.current = currentIndex;
  const seamJumpRef = useRef<boolean>(false);
  const animationRef = useRef<{ stop: () => void } | null>(null);
  const isPausedRef = useRef<boolean>(false);

  const moveTo = useCallback(
    (target: number, instant: boolean): void => {
      animationRef.current?.stop();
      if (instant || prefersReducedMotion) {
        x.set(target);
        return;
      }
      animationRef.current = animate(x, target, {
        type: "spring",
        stiffness: 320,
        damping: 36,
      });
    },
    [prefersReducedMotion, x],
  );

  const commitIndex = useCallback(
    (next: number): void => {
      const resolved = clamp(next);
      if (!isControlled) setInternalIndex(resolved);
      if (resolved !== indexRef.current) onIndexChange?.(resolved);
    },
    [clamp, isControlled, onIndexChange],
  );

  const goTo = useCallback(
    (target: number): void => {
      const resolved = clamp(target);
      if (resolved === indexRef.current) {
        moveTo(-resolved * widthRef.current, false);
        return;
      }
      commitIndex(resolved);
    },
    [clamp, commitIndex, moveTo],
  );

  const step = useCallback(
    (delta: 1 | -1): void => {
      const raw = indexRef.current + delta;
      if (raw < 0) {
        if (!loop) return;
        seamJumpRef.current = true;
        commitIndex(lastIndex);
        return;
      }
      if (raw > lastIndex) {
        if (!loop) return;
        seamJumpRef.current = true;
        commitIndex(0);
        return;
      }
      commitIndex(raw);
    },
    [commitIndex, lastIndex, loop],
  );

  // Keep slide widths in sync with the viewport.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = (): void => setWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reposition instantly when the viewport resizes.
  useEffect(() => {
    x.set(-indexRef.current * width);
  }, [width, x]);

  // Animate (or jump across the loop seam) on index change.
  useEffect(() => {
    const instant = seamJumpRef.current;
    seamJumpRef.current = false;
    moveTo(-currentIndex * width, instant);
  }, [currentIndex, width, moveTo]);

  // Autoplay.
  useEffect(() => {
    if (!autoplay || prefersReducedMotion || count <= 1) return;
    const id = window.setInterval(() => {
      if (isPausedRef.current) return;
      const atEnd = indexRef.current >= lastIndex;
      if (atEnd && !loop) return;
      step(1);
    }, Math.max(1000, autoplayInterval));
    return () => window.clearInterval(id);
  }, [
    autoplay,
    autoplayInterval,
    count,
    lastIndex,
    loop,
    prefersReducedMotion,
    step,
    currentIndex,
  ]);

  // Pointer-driven swipe.
  const dragStateRef = useRef<{
    startX: number;
    baseX: number;
    lastX: number;
    lastT: number;
    velocity: number;
    active: boolean;
    moved: boolean;
  } | null>(null);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>): void => {
      if (count <= 1 || event.button !== 0) return;
      animationRef.current?.stop();
      isPausedRef.current = true;
      dragStateRef.current = {
        startX: event.clientX,
        baseX: x.get(),
        lastX: event.clientX,
        lastT: event.timeStamp,
        velocity: 0,
        active: true,
        moved: false,
      };
    },
    [count, x],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>): void => {
      const drag = dragStateRef.current;
      if (!drag || !drag.active) return;
      const dx = event.clientX - drag.startX;
      if (!drag.moved && Math.abs(dx) < DRAG_START_THRESHOLD) return;
      if (!drag.moved) {
        drag.moved = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      const dt = event.timeStamp - drag.lastT;
      if (dt > 0) drag.velocity = (event.clientX - drag.lastX) / dt;
      drag.lastX = event.clientX;
      drag.lastT = event.timeStamp;

      let next = drag.baseX + dx;
      const min = -lastIndex * widthRef.current;
      const max = 0;
      if (!loop) {
        if (next > max) next = max + (next - max) * 0.35;
        else if (next < min) next = min + (next - min) * 0.35;
      }
      x.set(next);
    },
    [lastIndex, loop, x],
  );

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>): void => {
      const drag = dragStateRef.current;
      if (!drag || !drag.active) return;
      drag.active = false;
      dragStateRef.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      isPausedRef.current = false;
      if (!drag.moved) return;

      const dx = event.clientX - drag.startX;
      const w = widthRef.current || 1;
      const passedDistance = Math.abs(dx) > w * SWIPE_DISTANCE_RATIO;
      const passedVelocity = Math.abs(drag.velocity) > SWIPE_VELOCITY;
      if (passedDistance || passedVelocity) {
        step(dx < 0 ? 1 : -1);
      } else {
        moveTo(-indexRef.current * w, false);
      }
    },
    [moveTo, step],
  );

  const handleIndicatorKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>): void => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(lastIndex);
      }
    },
    [goTo, lastIndex, step],
  );

  const handleMouseEnter = useCallback((): void => {
    if (pauseOnHover) isPausedRef.current = true;
  }, [pauseOnHover]);
  const handleMouseLeave = useCallback((): void => {
    if (pauseOnHover && !dragStateRef.current?.active) {
      isPausedRef.current = false;
    }
  }, [pauseOnHover]);

  const canPrev = loop || currentIndex > 0;
  const canNext = loop || currentIndex < lastIndex;
  const slideStyle: CSSProperties = {
    flex: "0 0 100%",
    minWidth: 0,
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={props["aria-label"] ?? "Carousel"}
      className={cn(
        "relative",
        arrowPosition === "outside" && showArrows && count > 1
          ? "px-12"
          : undefined,
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        ref={viewportRef}
        className="overflow-hidden rounded-[var(--radius)]"
        style={{ touchAction: "pan-y" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <m.div
          className="flex select-none"
          style={{ x }}
          aria-live="polite"
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${count}`}
              aria-hidden={slideIndex !== currentIndex}
              style={slideStyle}
            >
              {slide}
            </div>
          ))}
        </m.div>
      </div>

      {showArrows && count > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            disabled={!canPrev}
            onClick={() => step(-1)}
            className={cn(
              arrowButtonVariants({ size }),
              arrowPosition === "outside" ? "left-0" : "left-3",
            )}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={!canNext}
            onClick={() => step(1)}
            className={cn(
              arrowButtonVariants({ size }),
              arrowPosition === "outside" ? "right-0" : "right-3",
            )}
          >
            <ChevronRight />
          </button>
        </>
      ) : null}

      {showIndicators && count > 1 ? (
        <div
          className="mt-3 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Choose slide"
        >
          {slides.map((_, dotIndex) => {
            const active = dotIndex === currentIndex;
            return (
              <button
                key={dotIndex}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Go to slide ${dotIndex + 1}`}
                tabIndex={active ? 0 : -1}
                onClick={() => goTo(dotIndex)}
                onKeyDown={handleIndicatorKeyDown}
                className={cn(
                  indicatorVariants({ size, active }),
                  active
                    ? indicatorWidth[size].active
                    : indicatorWidth[size].idle,
                )}
              />
            );
          })}
        </div>
      ) : null}

      <span className="sr-only" aria-live="polite">
        Slide {currentIndex + 1} of {count}
      </span>
    </div>
  );
}
Carousel.displayName = "Carousel";

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Optional convenience slide. You can pass any element to <Carousel /> directly,
 * but <CarouselItem> gives you a theme-aware, centered card panel out of the box.
 */
export function CarouselItem({
  className,
  children,
  ...props
}: CarouselItemProps): ReactElement {
  return (
    <div
      className={cn(
        "flex min-h-48 flex-col items-center justify-center gap-2 rounded-[var(--radius)] border border-border bg-card p-8 text-center text-card-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
CarouselItem.displayName = "CarouselItem";

export default Carousel;
