"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";

export const bentoGridColumnCounts = [2, 3, 4] as const satisfies number[];

export type BentoGridColumnCount = (typeof bentoGridColumnCounts)[number];

export const bentoGridGapIds = ["sm", "md", "lg"] as const satisfies string[];

export type BentoGridGapId = (typeof bentoGridGapIds)[number];

const bentoGridVariants = cva("grid grid-flow-row-dense auto-rows-[minmax(0,1fr)] w-full", {
  variants: {
    columns: {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    } satisfies Record<BentoGridColumnCount, string>,
    gap: {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    } satisfies Record<BentoGridGapId, string>,
  },
  defaultVariants: {
    columns: 3,
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

export const bentoGridItemVariantIds = [
  "default",
  "muted",
  "primary",
  "accent",
  "destructive",
  "warning",
  "outline",
] as const satisfies string[];

export type BentoGridItemVariantId = (typeof bentoGridItemVariantIds)[number];

export const bentoGridItemColSpans = [1, 2, 3, 4] as const satisfies number[];
export type BentoGridItemColSpan = (typeof bentoGridItemColSpans)[number];

export const bentoGridItemRowSpans = [1, 2, 3] as const satisfies number[];
export type BentoGridItemRowSpan = (typeof bentoGridItemRowSpans)[number];

const bentoGridItemVariants = cva(
  "group relative flex h-full min-h-[10rem] flex-col overflow-hidden rounded-xl border shadow-sm transition-all",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        muted: "bg-muted/40 text-foreground border-border",
        primary:
          "bg-primary/5 text-foreground border-primary/30 dark:bg-primary/10",
        accent:
          "bg-accent/40 text-accent-foreground border-accent",
        destructive:
          "bg-destructive/5 text-foreground border-destructive/40 dark:border-destructive",
        warning:
          "bg-warning/5 text-foreground border-warning/40 dark:border-warning",
        outline: "bg-transparent text-foreground border-border",
      } satisfies Record<BentoGridItemVariantId, string>,
      colSpan: {
        1: "sm:col-span-1",
        2: "sm:col-span-2",
        3: "sm:col-span-2 lg:col-span-3",
        4: "sm:col-span-2 lg:col-span-4",
      } satisfies Record<BentoGridItemColSpan, string>,
      rowSpan: {
        1: "row-span-1",
        2: "row-span-2",
        3: "row-span-3",
      } satisfies Record<BentoGridItemRowSpan, string>,
      interactive: {
        true: "cursor-pointer hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      colSpan: 1,
      rowSpan: 1,
      interactive: false,
    },
  },
);

export interface BentoGridItemProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoGridItemVariants> {
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItem({
  className,
  variant,
  colSpan,
  rowSpan,
  interactive,
  ref,
  ...props
}: BentoGridItemProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid-item"
      data-variant={variant ?? "default"}
      className={cn(
        bentoGridItemVariants({ variant, colSpan, rowSpan, interactive }),
        className,
      )}
      {...props}
    />
  );
}
BentoGridItem.displayName = "BentoGridItem";

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
        "flex min-h-[7rem] flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10",
        className,
      )}
      {...props}
    />
  );
}
BentoGridItemHeader.displayName = "BentoGridItemHeader";

const bentoGridItemIconVariants = cva(
  "inline-flex size-9 shrink-0 items-center justify-center rounded-md [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        muted: "bg-background text-muted-foreground",
        primary:
          "bg-primary/10 text-primary dark:text-primary-foreground",
        accent: "bg-accent-foreground/10 text-accent-foreground",
        destructive: "bg-destructive/10 text-destructive",
        warning: "bg-warning/15 text-warning",
        outline: "bg-muted text-muted-foreground",
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
      className={cn("flex flex-col gap-1.5 p-5", className)}
      {...props}
    />
  );
}
BentoGridItemContent.displayName = "BentoGridItemContent";

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
        "text-base font-semibold leading-tight tracking-tight",
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
      className={cn("text-sm text-muted-foreground leading-snug", className)}
      {...props}
    />
  );
}
BentoGridItemDescription.displayName = "BentoGridItemDescription";

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
        "mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
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
  BentoGridItemContent,
  BentoGridItemTitle,
  BentoGridItemDescription,
  BentoGridItemFooter,
  bentoGridVariants,
  bentoGridItemVariants,
  bentoGridItemIconVariants,
};
