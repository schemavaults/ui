"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useMemo,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import {
  markSizeIds,
  markStyleIds,
  markVariantIds,
  type MarkSize,
  type MarkStyle,
  type MarkVariant,
} from "./mark-variants";

const markVariants = cva(
  "inline rounded-sm font-[inherit] decoration-skip-ink-auto transition-colors",
  {
    variants: {
      variant: {
        // The classic highlighter look — explicit yellow, intentionally not themed.
        default: "",
        primary: "",
        secondary: "",
        info: "",
        success: "",
        warning: "",
        destructive: "",
        accent: "",
      } satisfies Record<MarkVariant, string>,
      markStyle: {
        solid: "",
        soft: "",
        underline: "bg-transparent border-b-2",
        outline: "bg-transparent border",
      } satisfies Record<MarkStyle, string>,
      size: {
        sm: "px-0.5 text-[0.95em]",
        default: "px-1 text-[1em]",
        lg: "px-1.5 py-0.5 text-[1.05em] font-medium",
      } satisfies Record<MarkSize, string>,
      rounded: {
        true: "rounded-md",
        false: "rounded-sm",
      },
      animate: {
        // Uses tailwindcss-animate's `animate-in` enter utilities, which are
        // registered globally via @schemavaults/theme. The mark fades and
        // slides in from a slight left offset — a natural reveal that does
        // not depend on custom keyframes.
        true: "animate-in fade-in slide-in-from-left-1 duration-500",
        false: "",
      },
    },
    compoundVariants: [
      // === solid: explicit colors (highlighter feel) ===
      {
        markStyle: "solid",
        variant: "default",
        class: "bg-yellow-200 text-yellow-950 dark:bg-yellow-400/80 dark:text-yellow-950",
      },
      {
        markStyle: "solid",
        variant: "primary",
        class: "bg-primary text-primary-foreground",
      },
      {
        markStyle: "solid",
        variant: "secondary",
        class: "bg-secondary text-secondary-foreground",
      },
      {
        markStyle: "solid",
        variant: "info",
        class: "bg-sky-300 text-sky-950 dark:bg-sky-400/80 dark:text-sky-950",
      },
      {
        markStyle: "solid",
        variant: "success",
        class: "bg-emerald-300 text-emerald-950 dark:bg-emerald-400/80 dark:text-emerald-950",
      },
      {
        markStyle: "solid",
        variant: "warning",
        class: "bg-warning text-warning-foreground",
      },
      {
        markStyle: "solid",
        variant: "destructive",
        class: "bg-destructive text-destructive-foreground",
      },
      {
        markStyle: "solid",
        variant: "accent",
        class: "bg-accent text-accent-foreground",
      },

      // === soft: subtle tinted background ===
      {
        markStyle: "soft",
        variant: "default",
        class: "bg-yellow-200/50 text-foreground dark:bg-yellow-400/20 dark:text-yellow-100",
      },
      {
        markStyle: "soft",
        variant: "primary",
        class: "bg-primary/15 text-foreground dark:text-primary-foreground/90",
      },
      {
        markStyle: "soft",
        variant: "secondary",
        class: "bg-secondary/60 text-secondary-foreground",
      },
      {
        markStyle: "soft",
        variant: "info",
        class: "bg-sky-300/30 text-foreground dark:text-sky-100",
      },
      {
        markStyle: "soft",
        variant: "success",
        class: "bg-emerald-300/30 text-foreground dark:text-emerald-100",
      },
      {
        markStyle: "soft",
        variant: "warning",
        class: "bg-warning/25 text-foreground",
      },
      {
        markStyle: "soft",
        variant: "destructive",
        class: "bg-destructive/15 text-destructive dark:text-destructive-foreground/90",
      },
      {
        markStyle: "soft",
        variant: "accent",
        class: "bg-accent/60 text-accent-foreground",
      },

      // === underline: colored bottom border only ===
      {
        markStyle: "underline",
        variant: "default",
        class: "border-yellow-400 text-foreground",
      },
      {
        markStyle: "underline",
        variant: "primary",
        class: "border-primary text-foreground",
      },
      {
        markStyle: "underline",
        variant: "secondary",
        class: "border-muted-foreground/60 text-foreground",
      },
      {
        markStyle: "underline",
        variant: "info",
        class: "border-sky-400 text-foreground",
      },
      {
        markStyle: "underline",
        variant: "success",
        class: "border-emerald-500 text-foreground",
      },
      {
        markStyle: "underline",
        variant: "warning",
        class: "border-warning text-foreground",
      },
      {
        markStyle: "underline",
        variant: "destructive",
        class: "border-destructive text-foreground",
      },
      {
        markStyle: "underline",
        variant: "accent",
        class: "border-accent-foreground/60 text-foreground",
      },

      // === outline: colored border only ===
      {
        markStyle: "outline",
        variant: "default",
        class: "border-yellow-400 text-yellow-700 dark:text-yellow-300",
      },
      {
        markStyle: "outline",
        variant: "primary",
        class: "border-primary text-foreground",
      },
      {
        markStyle: "outline",
        variant: "secondary",
        class: "border-muted-foreground/40 text-muted-foreground",
      },
      {
        markStyle: "outline",
        variant: "info",
        class: "border-sky-400 text-sky-700 dark:text-sky-300",
      },
      {
        markStyle: "outline",
        variant: "success",
        class: "border-emerald-500 text-emerald-700 dark:text-emerald-300",
      },
      {
        markStyle: "outline",
        variant: "warning",
        class: "border-warning text-warning-foreground",
      },
      {
        markStyle: "outline",
        variant: "destructive",
        class: "border-destructive text-destructive",
      },
      {
        markStyle: "outline",
        variant: "accent",
        class: "border-accent text-accent-foreground",
      },

    ],
    defaultVariants: {
      variant: "default",
      markStyle: "solid",
      size: "default",
      rounded: false,
      animate: false,
    },
  },
);

export interface MarkProps
  extends Omit<ComponentProps<"mark">, "style">,
    VariantProps<typeof markVariants> {
  /**
   * Override the rendered tag. Defaults to the semantic `<mark>` element.
   * Use `"span"` if you need decorative-only highlighting without the
   * implicit ARIA `mark` semantics.
   */
  as?: "mark" | "span";
  /** Pass-through `style` prop (preserved so consumers can layer custom CSS). */
  style?: ComponentProps<"mark">["style"];
}

function MarkImpl(
  {
    className,
    variant,
    markStyle,
    size,
    rounded,
    animate,
    as = "mark",
    children,
    ...props
  }: MarkProps,
  ref: Ref<HTMLElement>,
): ReactElement {
  const Comp = as;
  return (
    <Comp
      ref={ref as Ref<HTMLElement>}
      data-slot="mark"
      data-variant={variant ?? "default"}
      data-mark-style={markStyle ?? "solid"}
      className={cn(
        markVariants({ variant, markStyle, size, rounded, animate }),
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export const Mark = forwardRef<HTMLElement, MarkProps>(MarkImpl);
Mark.displayName = "Mark";

// =============================================================================
// HighlightedText — auto-wrap matches of `match` inside `text` with <Mark>
// =============================================================================

export interface HighlightedTextProps
  extends Omit<ComponentProps<"span">, "children">,
    Pick<
      MarkProps,
      "variant" | "markStyle" | "size" | "rounded" | "animate"
    > {
  /** The full text to render. */
  text: string;
  /** A string token (or RegExp) to highlight inside `text`. */
  match: string | RegExp | readonly string[];
  /** When `match` is a string, control case sensitivity. Defaults to false. */
  caseSensitive?: boolean;
  /** When true, only highlight whole-word matches. Defaults to false. */
  wholeWord?: boolean;
  /** Optional class applied to each rendered <Mark>. */
  markClassName?: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildHighlightRegExp(
  match: HighlightedTextProps["match"],
  caseSensitive: boolean,
  wholeWord: boolean,
): RegExp | null {
  if (match instanceof RegExp) {
    // Ensure we have the global flag so we can iterate every match.
    const flags = match.flags.includes("g") ? match.flags : `${match.flags}g`;
    return new RegExp(match.source, flags);
  }
  const tokens = (Array.isArray(match) ? match : [match])
    .map((token) => String(token))
    .filter((token) => token.length > 0)
    .map(escapeRegExp);
  if (tokens.length === 0) return null;
  const body = tokens.join("|");
  const pattern = wholeWord ? `\\b(?:${body})\\b` : `(?:${body})`;
  return new RegExp(pattern, caseSensitive ? "g" : "gi");
}

export function HighlightedText({
  text,
  match,
  caseSensitive = false,
  wholeWord = false,
  variant,
  markStyle,
  size,
  rounded,
  animate,
  markClassName,
  className,
  ...props
}: HighlightedTextProps): ReactElement {
  const segments = useMemo<ReactNode[]>(() => {
    const regex = buildHighlightRegExp(match, caseSensitive, wholeWord);
    if (regex === null) return [text];

    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;
    // Defensive guard — RegExp.exec can loop forever on zero-width matches.
    for (const result of text.matchAll(regex)) {
      if (result.index === undefined) continue;
      if (result[0].length === 0) continue;
      if (result.index > lastIndex) {
        parts.push(text.slice(lastIndex, result.index));
      }
      parts.push(
        <Mark
          key={`m-${key++}`}
          variant={variant}
          markStyle={markStyle}
          size={size}
          rounded={rounded}
          animate={animate}
          className={markClassName}
        >
          {result[0]}
        </Mark>,
      );
      lastIndex = result.index + result[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts;
  }, [
    text,
    match,
    caseSensitive,
    wholeWord,
    variant,
    markStyle,
    size,
    rounded,
    animate,
    markClassName,
  ]);

  return (
    <span data-slot="highlighted-text" className={className} {...props}>
      {segments}
    </span>
  );
}
HighlightedText.displayName = "HighlightedText";

export { markVariants, markVariantIds, markStyleIds, markSizeIds };
export type { MarkVariant, MarkStyle, MarkSize };

export default Mark;
