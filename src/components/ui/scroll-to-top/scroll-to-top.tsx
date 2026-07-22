"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

export const scrollToTopVariantIds = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "brand",
] as const satisfies string[];

export type ScrollToTopVariantId = (typeof scrollToTopVariantIds)[number];

export const scrollToTopSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies string[];

export type ScrollToTopSizeId = (typeof scrollToTopSizeIds)[number];

export const scrollToTopPositionIds = [
  "bottom-right",
  "bottom-left",
  "bottom-center",
  "static",
] as const satisfies string[];

export type ScrollToTopPositionId = (typeof scrollToTopPositionIds)[number];

const scrollToTopVariants = cva(
  "group/scroll-to-top inline-flex items-center justify-center gap-2 rounded-full font-medium shadow-lg ring-offset-background transition-[background-color,border-color,color,box-shadow,opacity,transform] hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none z-40",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-secondary/25",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost:
          "bg-background/70 text-foreground backdrop-blur-md border border-border/50 hover:bg-accent hover:text-accent-foreground",
        brand:
          "bg-schemavaults-brand-blue text-primary-foreground hover:bg-schemavaults-brand-blue/90 shadow-schemavaults-brand-blue/30",
      } satisfies Record<ScrollToTopVariantId, string>,
      size: {
        sm: "h-10 w-10 text-sm [&_svg]:size-4",
        default: "h-12 w-12 text-base [&_svg]:size-5",
        lg: "h-14 w-14 text-base [&_svg]:size-6",
      } satisfies Record<ScrollToTopSizeId, string>,
      position: {
        "bottom-right": "fixed bottom-6 right-6",
        "bottom-left": "fixed bottom-6 left-6",
        "bottom-center":
          "fixed bottom-6 left-1/2 -translate-x-1/2",
        static: "",
      } satisfies Record<ScrollToTopPositionId, string>,
      extended: {
        true: "w-auto px-5",
        false: "",
      },
    },
    compoundVariants: [
      { extended: true, size: "sm", class: "h-10" },
      { extended: true, size: "default", class: "h-12" },
      { extended: true, size: "lg", class: "h-14" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
      position: "bottom-right",
      extended: false,
    },
  },
);

export interface ScrollToTopProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof scrollToTopVariants> {
  ref?: Ref<HTMLButtonElement>;
  /**
   * Pixel scroll offset at which the button becomes visible. Defaults to
   * `320` — roughly a viewport of scroll on a laptop.
   */
  threshold?: number;
  /**
   * Ref to a scroll container to observe and scroll. When omitted, the
   * component tracks and scrolls `window`. Useful for embedded scroll
   * areas such as dialogs, sheets, and split panes.
   */
  containerRef?: RefObject<HTMLElement | null>;
  /**
   * Custom icon rendered inside the button. Defaults to lucide's `ArrowUp`.
   */
  icon?: ReactNode;
  /**
   * Optional visible label. When provided, the button switches to its
   * extended (pill) layout unless `extended` is explicitly overridden.
   */
  label?: ReactNode;
  /**
   * Accessible label. Falls back to `label` (if string) or "Scroll to top".
   */
  "aria-label"?: string;
  /**
   * Scroll behaviour used when the button is clicked. Defaults to `"smooth"`
   * and is automatically downgraded to `"auto"` when the user has
   * `prefers-reduced-motion: reduce`.
   */
  behavior?: ScrollBehavior;
  /**
   * When `true`, the button is always rendered regardless of scroll position.
   * Useful for testing/showcasing in Storybook.
   */
  alwaysVisible?: boolean;
  /**
   * Called after the scroll-to-top action is invoked.
   */
  onScrolledToTop?: () => void;
}

function readScrollTop(container: HTMLElement | null): number {
  if (container) return container.scrollTop;
  if (typeof window === "undefined") return 0;
  return window.scrollY ?? window.pageYOffset ?? 0;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * A floating "back to top" button that appears once the user scrolls past a
 * configurable threshold and smoothly scrolls the page (or an embedded
 * container) back to the top when clicked.
 *
 * Respects `prefers-reduced-motion` by falling back to an instant scroll.
 */
function ScrollToTop({
  className,
  variant,
  size,
  position,
  extended,
  threshold = 320,
  containerRef,
  icon,
  label,
  behavior = "smooth",
  alwaysVisible = false,
  onScrolledToTop,
  onClick,
  type = "button",
  ref,
  ...props
}: ScrollToTopProps): ReactElement | null {
  const [visible, setVisible] = useState<boolean>(alwaysVisible);

  useEffect(() => {
    if (alwaysVisible) {
      setVisible(true);
      return;
    }
    const container: HTMLElement | null = containerRef?.current ?? null;
    const target: Window | HTMLElement =
      container ?? (typeof window !== "undefined" ? window : (null as never));

    if (!target) return;

    function update(): void {
      setVisible(readScrollTop(container) > threshold);
    }

    update();
    target.addEventListener("scroll", update, { passive: true });
    return () => {
      target.removeEventListener("scroll", update);
    };
  }, [alwaysVisible, containerRef, threshold]);

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>): void => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      const resolvedBehavior: ScrollBehavior = prefersReducedMotion()
        ? "auto"
        : behavior;

      const container: HTMLElement | null = containerRef?.current ?? null;
      if (container) {
        container.scrollTo({ top: 0, left: 0, behavior: resolvedBehavior });
      } else if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: resolvedBehavior });
      }

      onScrolledToTop?.();
    },
    [behavior, containerRef, onClick, onScrolledToTop],
  );

  const isExtended: boolean = extended ?? Boolean(label);
  const accessibleLabel: string =
    props["aria-label"] ??
    (typeof label === "string" ? label : "Scroll to top");

  const resolvedIcon: ReactNode = icon ?? <ArrowUp aria-hidden="true" />;

  if (!visible && position !== "static") {
    return null;
  }

  return (
    <button
      ref={ref}
      type={type}
      data-slot="scroll-to-top"
      data-visible={visible ? "true" : "false"}
      data-extended={isExtended || undefined}
      aria-label={accessibleLabel}
      onClick={handleClick}
      className={cn(
        scrollToTopVariants({ variant, size, position, extended: isExtended }),
        !visible && "pointer-events-none opacity-0",
        visible && "opacity-100",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="scroll-to-top-icon"
        className="inline-flex shrink-0 items-center justify-center transition-transform group-hover/scroll-to-top:-translate-y-0.5"
      >
        {resolvedIcon}
      </span>
      {isExtended && label != null ? (
        <span data-slot="scroll-to-top-label" className="truncate">
          {label}
        </span>
      ) : null}
    </button>
  );
}
ScrollToTop.displayName = "ScrollToTop";

export { ScrollToTop, scrollToTopVariants };

export default ScrollToTop;
