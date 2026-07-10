"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Container                                                          */
/* ------------------------------------------------------------------ */

export const bentoGridColumnIds = [
  "1",
  "2",
  "3",
  "4",
  "6",
] as const satisfies readonly string[];
export type BentoGridColumnId = (typeof bentoGridColumnIds)[number];

export const bentoGridGapIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type BentoGridGapId = (typeof bentoGridGapIds)[number];

const bentoGridVariants = cva("grid w-full auto-rows-[minmax(9rem,auto)]", {
  variants: {
    columns: {
      "1": "grid-cols-1",
      "2": "grid-cols-1 sm:grid-cols-2",
      "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      "6": "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    } satisfies Record<BentoGridColumnId, string>,
    gap: {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    } satisfies Record<BentoGridGapId, string>,
  },
  defaultVariants: {
    columns: "3",
    gap: "md",
  },
});

export interface BentoGridProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoGridVariants> {
  ref?: Ref<HTMLDivElement>;
}

function BentoGrid({
  className,
  columns,
  gap,
  ref,
  ...props
}: BentoGridProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid"
      className={cn(bentoGridVariants({ columns, gap }), className)}
      {...props}
    />
  );
}
BentoGrid.displayName = "BentoGrid";

/* ------------------------------------------------------------------ */
/* Item                                                               */
/* ------------------------------------------------------------------ */

export const bentoGridItemVariantIds = [
  "default",
  "muted",
  "primary",
  "accent",
  "destructive",
  "warning",
  "outline",
] as const satisfies readonly string[];
export type BentoGridItemVariantId = (typeof bentoGridItemVariantIds)[number];

export const bentoGridItemPaddingIds = [
  "none",
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type BentoGridItemPaddingId = (typeof bentoGridItemPaddingIds)[number];

export const bentoGridItemColSpanIds = [
  "1",
  "2",
  "3",
  "4",
  "6",
  "full",
] as const satisfies readonly string[];
export type BentoGridItemColSpanId = (typeof bentoGridItemColSpanIds)[number];

export const bentoGridItemRowSpanIds = [
  "1",
  "2",
  "3",
] as const satisfies readonly string[];
export type BentoGridItemRowSpanId = (typeof bentoGridItemRowSpanIds)[number];

const bentoGridItemVariants = cva(
  "group/bento relative flex flex-col overflow-hidden rounded-xl border shadow-sm transition-colors",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        muted: "bg-muted/40 text-foreground border-border",
        primary:
          "bg-primary/5 text-foreground border-primary/30 dark:bg-primary/10",
        accent:
          "bg-accent/40 text-accent-foreground border-accent-foreground/10",
        destructive:
          "bg-destructive/5 text-foreground border-destructive/40 dark:border-destructive",
        warning:
          "bg-warning/5 text-foreground border-warning/40 dark:border-warning",
        outline: "bg-transparent text-foreground border-border",
      } satisfies Record<BentoGridItemVariantId, string>,
      padding: {
        none: "",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      } satisfies Record<BentoGridItemPaddingId, string>,
      colSpan: {
        "1": "col-span-1",
        "2": "col-span-1 sm:col-span-2",
        "3": "col-span-1 sm:col-span-2 lg:col-span-3",
        "4": "col-span-1 sm:col-span-2 lg:col-span-4",
        "6": "col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-6",
        full: "col-span-full",
      } satisfies Record<BentoGridItemColSpanId, string>,
      rowSpan: {
        "1": "row-span-1",
        "2": "row-span-2",
        "3": "row-span-3",
      } satisfies Record<BentoGridItemRowSpanId, string>,
      interactive: {
        true: "cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        false: "",
      },
    },
    compoundVariants: [
      {
        interactive: true,
        variant: "default",
        class: "hover:border-primary/40 hover:bg-card/80",
      },
      {
        interactive: true,
        variant: "muted",
        class: "hover:bg-muted/60",
      },
      {
        interactive: true,
        variant: "primary",
        class: "hover:bg-primary/10 dark:hover:bg-primary/15",
      },
      {
        interactive: true,
        variant: "accent",
        class: "hover:bg-accent/60",
      },
      {
        interactive: true,
        variant: "destructive",
        class: "hover:bg-destructive/10",
      },
      {
        interactive: true,
        variant: "warning",
        class: "hover:bg-warning/10",
      },
      {
        interactive: true,
        variant: "outline",
        class: "hover:bg-muted/40",
      },
    ],
    defaultVariants: {
      variant: "default",
      padding: "md",
      colSpan: "1",
      rowSpan: "1",
      interactive: false,
    },
  },
);

type BaseBentoGridItemProps = VariantProps<typeof bentoGridItemVariants> & {
  className?: string;
};

export interface BentoGridItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    BaseBentoGridItemProps {
  /**
   * When true, renders as a Radix `Slot` so the caller can supply a custom
   * element (e.g. an `<a>` or a `<Link>`) while still receiving the
   * BentoGridItem styles.
   */
  asChild?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItem({
  className,
  variant,
  padding,
  colSpan,
  rowSpan,
  interactive,
  asChild = false,
  ref,
  ...props
}: BentoGridItemProps): ReactElement {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      data-slot="bento-grid-item"
      data-variant={variant ?? "default"}
      className={cn(
        bentoGridItemVariants({
          variant,
          padding,
          colSpan,
          rowSpan,
          interactive,
        }),
        className,
      )}
      {...props}
    />
  );
}
BentoGridItem.displayName = "BentoGridItem";

/* ------------------------------------------------------------------ */
/* Item — button variant                                              */
/* ------------------------------------------------------------------ */

export interface BentoGridItemButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    BaseBentoGridItemProps {
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Convenience wrapper that renders a BentoGridItem as a `<button>` and
 * defaults `interactive` to `true`. Use when the whole tile should be
 * activatable (e.g. an action tile in a dashboard).
 */
function BentoGridItemButton({
  className,
  variant,
  padding,
  colSpan,
  rowSpan,
  interactive = true,
  type = "button",
  ref,
  ...props
}: BentoGridItemButtonProps): ReactElement {
  return (
    <button
      ref={ref}
      type={type}
      data-slot="bento-grid-item"
      data-variant={variant ?? "default"}
      className={cn(
        "text-left",
        bentoGridItemVariants({
          variant,
          padding,
          colSpan,
          rowSpan,
          interactive,
        }),
        className,
      )}
      {...props}
    />
  );
}
BentoGridItemButton.displayName = "BentoGridItemButton";

/* ------------------------------------------------------------------ */
/* Item subcomponents                                                 */
/* ------------------------------------------------------------------ */

export interface BentoGridItemHeaderProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItemHeader({
  className,
  ref,
  ...props
}: BentoGridItemHeaderProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid-item-header"
      className={cn(
        "flex w-full items-start justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}
BentoGridItemHeader.displayName = "BentoGridItemHeader";

const bentoGridItemIconVariants = cva(
  "flex size-9 shrink-0 items-center justify-center rounded-md [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        muted: "bg-background text-muted-foreground",
        primary: "bg-primary/10 text-primary dark:text-primary-foreground",
        accent: "bg-accent-foreground/10 text-accent-foreground",
        destructive: "bg-destructive/10 text-destructive",
        warning: "bg-warning/15 text-warning",
        outline: "border border-border bg-transparent text-muted-foreground",
      } satisfies Record<BentoGridItemVariantId, string>,
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BentoGridItemIconProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoGridItemIconVariants> {
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItemIcon({
  className,
  variant,
  ref,
  ...props
}: BentoGridItemIconProps): ReactElement {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="bento-grid-item-icon"
      className={cn(bentoGridItemIconVariants({ variant }), className)}
      {...props}
    />
  );
}
BentoGridItemIcon.displayName = "BentoGridItemIcon";

export interface BentoGridItemTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  ref?: Ref<HTMLHeadingElement>;
}

function BentoGridItemTitle({
  className,
  ref,
  ...props
}: BentoGridItemTitleProps): ReactElement {
  return (
    <h3
      ref={ref}
      data-slot="bento-grid-item-title"
      className={cn(
        "text-base font-semibold leading-tight tracking-tight",
        className,
      )}
      {...props}
    >
      {props.children}
    </h3>
  );
}
BentoGridItemTitle.displayName = "BentoGridItemTitle";

export interface BentoGridItemDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
}

function BentoGridItemDescription({
  className,
  ref,
  ...props
}: BentoGridItemDescriptionProps): ReactElement {
  return (
    <p
      ref={ref}
      data-slot="bento-grid-item-description"
      className={cn("text-sm text-muted-foreground leading-snug", className)}
      {...props}
    />
  );
}
BentoGridItemDescription.displayName = "BentoGridItemDescription";

export interface BentoGridItemContentProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItemContent({
  className,
  ref,
  ...props
}: BentoGridItemContentProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid-item-content"
      className={cn("mt-3 flex flex-1 flex-col gap-2", className)}
      {...props}
    />
  );
}
BentoGridItemContent.displayName = "BentoGridItemContent";

export interface BentoGridItemFooterProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItemFooter({
  className,
  ref,
  ...props
}: BentoGridItemFooterProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid-item-footer"
      className={cn(
        "mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
BentoGridItemFooter.displayName = "BentoGridItemFooter";

export {
  BentoGrid,
  BentoGridItem,
  BentoGridItemButton,
  BentoGridItemHeader,
  BentoGridItemIcon,
  BentoGridItemTitle,
  BentoGridItemDescription,
  BentoGridItemContent,
  BentoGridItemFooter,
  bentoGridVariants,
  bentoGridItemVariants,
  bentoGridItemIconVariants,
};
