"use client";

import {
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Quote } from "lucide-react";

import { cn } from "@/lib/utils";

export const blockquoteVariantIds = [
  "default",
  "accent",
  "primary",
  "success",
  "warning",
  "danger",
  "muted",
] as const satisfies readonly string[];
export type BlockquoteVariantId = (typeof blockquoteVariantIds)[number];

export const blockquoteEmphasisIds = [
  "border",
  "card",
  "ghost",
  "pull",
] as const satisfies readonly string[];
export type BlockquoteEmphasisId = (typeof blockquoteEmphasisIds)[number];

export const blockquoteSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type BlockquoteSizeId = (typeof blockquoteSizeIds)[number];

export const blockquoteVariants = cva(
  "relative text-foreground/90",
  {
    variants: {
      variant: {
        default:
          "[--quote-color:hsl(var(--foreground))] [--quote-tint:hsl(var(--muted))]",
        accent:
          "[--quote-color:hsl(var(--accent-foreground))] [--quote-tint:hsl(var(--accent))]",
        primary:
          "[--quote-color:hsl(var(--primary))] [--quote-tint:hsl(var(--primary)/0.08)]",
        success:
          "[--quote-color:hsl(142_71%_45%)] [--quote-tint:hsl(142_71%_45%/0.08)]",
        warning:
          "[--quote-color:hsl(var(--warning))] [--quote-tint:hsl(var(--warning)/0.10)]",
        danger:
          "[--quote-color:hsl(var(--destructive))] [--quote-tint:hsl(var(--destructive)/0.10)]",
        muted:
          "[--quote-color:hsl(var(--muted-foreground))] [--quote-tint:hsl(var(--muted))]",
      } satisfies Record<BlockquoteVariantId, string>,
      emphasis: {
        border:
          "border-l-4 border-l-[var(--quote-color)] pl-4 py-1 italic",
        card: "rounded-md border border-[var(--quote-color)]/25 bg-[var(--quote-tint)] p-4 italic",
        ghost: "px-4 italic",
        pull: "border-y border-[var(--quote-color)]/25 px-2 py-4 text-center font-serif not-italic",
      } satisfies Record<BlockquoteEmphasisId, string>,
      size: {
        sm: "text-sm leading-relaxed",
        default: "text-base leading-relaxed",
        lg: "text-xl leading-relaxed",
      } satisfies Record<BlockquoteSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      emphasis: "border",
      size: "default",
    },
  },
);

export interface BlockquoteProps
  extends Omit<HTMLAttributes<HTMLQuoteElement>, "cite">,
    VariantProps<typeof blockquoteVariants> {
  /** Optional author / attribution text rendered below the quote */
  author?: ReactNode;
  /** Optional source / role / work title rendered after the author */
  source?: ReactNode;
  /** Optional URL — passed through as the native HTML `cite` attribute on <blockquote> */
  cite?: string;
  /** Optional icon override. Pass `null` to hide the decorative quote glyph. */
  icon?: ReactNode | null;
  ref?: Ref<HTMLQuoteElement>;
}

function Blockquote({
  className,
  variant = "default",
  emphasis = "border",
  size = "default",
  author,
  source,
  cite,
  icon,
  children,
  ref,
  ...props
}: BlockquoteProps): ReactElement {
  const resolvedIcon =
    icon === null ? null : icon ?? <Quote aria-hidden className="size-4" />;
  const hasAttribution = author !== undefined || source !== undefined;

  return (
    <blockquote
      ref={ref}
      cite={cite}
      data-slot="blockquote"
      data-variant={variant}
      data-emphasis={emphasis}
      className={cn(
        blockquoteVariants({ variant, emphasis, size }),
        className,
      )}
      {...props}
    >
      {resolvedIcon !== null && (
        <span
          aria-hidden
          data-slot="blockquote-icon"
          className="mr-1.5 inline-flex items-center align-middle text-[var(--quote-color)]"
        >
          {resolvedIcon}
        </span>
      )}
      <span data-slot="blockquote-content">{children}</span>
      {hasAttribution && (
        <BlockquoteFooter>
          {author !== undefined && (
            <span data-slot="blockquote-author" className="font-medium text-foreground">
              {author}
            </span>
          )}
          {author !== undefined && source !== undefined && (
            <span aria-hidden className="text-muted-foreground/60">·</span>
          )}
          {source !== undefined && (
            <BlockquoteCite>{source}</BlockquoteCite>
          )}
        </BlockquoteFooter>
      )}
    </blockquote>
  );
}
Blockquote.displayName = "Blockquote";

export interface BlockquoteFooterProps
  extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
}

function BlockquoteFooter({
  className,
  children,
  ref,
  ...props
}: BlockquoteFooterProps): ReactElement {
  return (
    <footer
      ref={ref}
      data-slot="blockquote-footer"
      className={cn(
        "mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm not-italic text-muted-foreground",
        "before:mr-1 before:content-['—']",
        className,
      )}
      {...props}
    >
      {children}
    </footer>
  );
}
BlockquoteFooter.displayName = "BlockquoteFooter";

export interface BlockquoteCiteProps
  extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
}

function BlockquoteCite({
  className,
  children,
  ref,
  ...props
}: BlockquoteCiteProps): ReactElement {
  return (
    <cite
      ref={ref}
      data-slot="blockquote-cite"
      className={cn(
        "text-muted-foreground [font-style:normal]",
        className,
      )}
      {...props}
    >
      {children}
    </cite>
  );
}
BlockquoteCite.displayName = "BlockquoteCite";

export { Blockquote, BlockquoteFooter, BlockquoteCite };
