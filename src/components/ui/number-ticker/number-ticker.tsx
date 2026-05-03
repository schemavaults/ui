"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ComponentProps,
  type ReactElement,
  type Ref,
} from "react";

import {
  animate,
  useMotionValue,
  useReducedMotion,
} from "@/framer-motion";
import { cn } from "@/lib/utils";
import {
  type NumberTickerSize,
  type NumberTickerVariant,
} from "./number-ticker-variants";

const numberTickerVariants = cva(
  "inline-block tabular-nums font-semibold tracking-tight",
  {
    variants: {
      variant: {
        default: "text-foreground",
        primary: "text-primary",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
        warning: "text-warning",
        success: "text-emerald-600 dark:text-emerald-400",
      } satisfies Record<NumberTickerVariant, string>,
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
        xl: "text-2xl",
        "2xl": "text-4xl",
        "3xl": "text-6xl",
      } satisfies Record<NumberTickerSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type NumberTickerEase =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "circIn"
  | "circOut"
  | "circInOut"
  | "backIn"
  | "backOut"
  | "backInOut"
  | "anticipate";

export interface NumberTickerProps
  extends Omit<ComponentProps<"span">, "children">,
    VariantProps<typeof numberTickerVariants> {
  /** The target number to animate to. */
  value: number;
  /** The starting number for the animation. Defaults to `0`. */
  from?: number;
  /** Animation duration in seconds. Defaults to `1.5`. */
  duration?: number;
  /** Delay before the animation begins, in seconds. Defaults to `0`. */
  delay?: number;
  /** Number of decimal places to display. Defaults to `0`. */
  decimals?: number;
  /** String prepended to the formatted number (e.g. `$`). */
  prefix?: string;
  /** String appended to the formatted number (e.g. `%`). */
  suffix?: string;
  /** BCP-47 locale tag(s) used for `Intl.NumberFormat`. Defaults to `"en-US"`. */
  locale?: string | string[];
  /** Whether to use grouping separators (e.g. thousands commas). Defaults to `true`. */
  useGrouping?: boolean;
  /** When `true`, animation only starts once the element scrolls into the viewport. Defaults to `true`. */
  startOnInView?: boolean;
  /** Easing curve. Defaults to `"easeOut"`. */
  ease?: NumberTickerEase;
  ref?: Ref<HTMLSpanElement>;
}

export function NumberTicker({
  value,
  from = 0,
  duration = 1.5,
  delay = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "en-US",
  useGrouping = true,
  startOnInView = true,
  ease = "easeOut",
  variant,
  size,
  className,
  ref,
  ...props
}: NumberTickerProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue<number>(from);
  const innerRef = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef<boolean>(false);

  const formatter = useMemo<Intl.NumberFormat>(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping,
      }),
    [locale, decimals, useGrouping],
  );

  const format = useCallback(
    (n: number): string => `${prefix}${formatter.format(n)}${suffix}`,
    [formatter, prefix, suffix],
  );

  const setRefs = useCallback(
    (node: HTMLSpanElement | null): void => {
      innerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as { current: HTMLSpanElement | null }).current = node;
      }
    },
    [ref],
  );

  // Subscribe to motion value updates and write the formatted text into the
  // span imperatively. This avoids re-rendering the React tree on every frame.
  useEffect((): (() => void) => {
    const node = innerRef.current;
    if (node) {
      node.textContent = format(motionValue.get());
    }
    return motionValue.on("change", (latest: number): void => {
      const el = innerRef.current;
      if (el) {
        el.textContent = format(latest);
      }
    });
  }, [motionValue, format]);

  useEffect((): (() => void) | void => {
    if (prefersReducedMotion) {
      motionValue.set(value);
      startedRef.current = true;
      return;
    }

    const runAnimation = (): (() => void) => {
      const controls = animate(motionValue, value, {
        type: "tween",
        duration,
        delay,
        ease,
      });
      return controls.stop;
    };

    if (startedRef.current || !startOnInView) {
      startedRef.current = true;
      return runAnimation();
    }

    const el = innerRef.current;
    if (!el) {
      startedRef.current = true;
      return runAnimation();
    }

    let stopAnimation: (() => void) | undefined;
    const observer = new IntersectionObserver(
      (entries): void => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startedRef.current = true;
            observer.disconnect();
            stopAnimation = runAnimation();
            break;
          }
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);

    return (): void => {
      observer.disconnect();
      stopAnimation?.();
    };
  }, [
    value,
    duration,
    delay,
    ease,
    prefersReducedMotion,
    startOnInView,
    motionValue,
  ]);

  return (
    <span
      ref={setRefs}
      data-slot="number-ticker"
      aria-label={format(value)}
      className={cn(numberTickerVariants({ variant, size }), className)}
      {...props}
    >
      {format(from)}
    </span>
  );
}
NumberTicker.displayName = "NumberTicker";

export { numberTickerVariants };
