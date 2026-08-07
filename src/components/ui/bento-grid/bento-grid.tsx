"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";

export const bentoGridColumnsIds = ["2", "3", "4", "6"] as const satisfies string[];
export type BentoGridColumnsId = (typeof bentoGridColumnsIds)[number];

export const bentoGridGapIds = ["sm", "md", "lg", "xl"] as const satisfies string[];
export type BentoGridGapId = (typeof bentoGridGapIds)[number];

const bentoGridVariants = cva(
  "grid w-full grid-flow-row-dense auto-rows-[minmax(9rem,auto)]",
  {
    variants: {
      columns: {
        "2": "grid-cols-1 sm:grid-cols-2",
        "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        "6": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
      } satisfies Record<BentoGridColumnsId, string>,
      gap: {
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      } satisfies Record<BentoGridGapId, string>,
    },
    defaultVariants: {
      columns: "4",
      gap: "md",
    },
  },
);

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

export const bentoGridItemVariantIds = [
  "default",
  "muted",
  "primary",
  "accent",
  "gradient",
  "outline",
  "glass",
] as const satisfies string[];

export type BentoGridItemVariantId = (typeof bentoGridItemVariantIds)[number];

export const bentoGridItemColSpanIds = [
  "1",
  "2",
  "3",
  "4",
  "full",
] as const satisfies string[];

export type BentoGridItemColSpanId = (typeof bentoGridItemColSpanIds)[number];

export const bentoGridItemRowSpanIds = ["1", "2", "3"] as const satisfies string[];
export type BentoGridItemRowSpanId = (typeof bentoGridItemRowSpanIds)[number];

const bentoGridItemVariants = cva(
  "group/bento-item relative flex flex-col overflow-hidden rounded-xl border p-5 text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border bg-card",
        muted: "border-border bg-muted/40",
        primary:
          "border-primary/30 bg-primary/5 dark:border-primary/40 dark:bg-primary/10",
        accent:
          "border-accent/60 bg-accent/40 dark:border-accent/40 dark:bg-accent/20",
        gradient:
          "border-transparent bg-gradient-to-br from-primary/15 via-accent/40 to-background dark:from-primary/25 dark:via-accent/20 dark:to-background",
        outline: "border-border bg-transparent",
        glass:
          "border-border/60 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40",
      } satisfies Record<BentoGridItemVariantId, string>,
      colSpan: {
        "1": "col-span-1",
        "2": "col-span-1 sm:col-span-2",
        "3": "col-span-1 sm:col-span-2 lg:col-span-3",
        "4": "col-span-1 sm:col-span-2 lg:col-span-4",
        full: "col-span-full",
      } satisfies Record<BentoGridItemColSpanId, string>,
      rowSpan: {
        "1": "row-span-1",
        "2": "sm:row-span-2",
        "3": "sm:row-span-3",
      } satisfies Record<BentoGridItemRowSpanId, string>,
      interactive: {
        true: "cursor-pointer hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      colSpan: "1",
      rowSpan: "1",
      interactive: false,
    },
  },
);

export interface BentoGridItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role" | "tabIndex">,
    VariantProps<typeof bentoGridItemVariants> {
  /** When true, renders as a keyboard-focusable button-like tile. */
  interactive?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItem({
  className,
  variant,
  colSpan,
  rowSpan,
  interactive = false,
  ref,
  ...props
}: BentoGridItemProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid-item"
      data-variant={variant ?? "default"}
      data-interactive={interactive ? "true" : "false"}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        bentoGridItemVariants({ variant, colSpan, rowSpan, interactive }),
        className,
      )}
      {...props}
    />
  );
}
BentoGridItem.displayName = "BentoGridItem";

export interface BentoGridItemHeaderProps extends HTMLAttributes<HTMLDivElement> {
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
        "mb-3 flex items-start justify-between gap-3",
        className,
      )}
      {...props}
    />
  );
}
BentoGridItemHeader.displayName = "BentoGridItemHeader";

export interface BentoGridItemIconProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItemIcon({
  className,
  ref,
  ...props
}: BentoGridItemIconProps): ReactElement {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="bento-grid-item-icon"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground [&>svg]:size-5 [&>svg]:shrink-0",
        className,
      )}
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
  children,
  ...props
}: BentoGridItemTitleProps): ReactElement {
  return (
    <h3
      ref={ref}
      data-slot="bento-grid-item-title"
      className={cn(
        "font-semibold leading-tight tracking-tight text-foreground",
        className,
      )}
      {...props}
    >
      {children}
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
      className={cn(
        "mt-1 text-sm leading-snug text-muted-foreground",
        className,
      )}
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
      className={cn("mt-4 flex-1 text-sm text-foreground/90", className)}
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
        "mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
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
  BentoGridItemHeader,
  BentoGridItemIcon,
  BentoGridItemTitle,
  BentoGridItemDescription,
  BentoGridItemContent,
  BentoGridItemFooter,
  bentoGridVariants,
  bentoGridItemVariants,
};
