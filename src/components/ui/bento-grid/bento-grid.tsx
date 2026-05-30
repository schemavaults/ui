"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";

export const bentoGridColumnIds = [
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

const bentoGridVariants = cva("grid w-full auto-rows-[minmax(10rem,_auto)]", {
  variants: {
    columns: {
      "2": "grid-cols-1 sm:grid-cols-2",
      "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      "6": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
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

export const bentoGridItemSizeIds = [
  "1x1",
  "2x1",
  "1x2",
  "2x2",
  "3x1",
  "3x2",
] as const satisfies readonly string[];
export type BentoGridItemSizeId = (typeof bentoGridItemSizeIds)[number];

export const bentoGridItemVariantIds = [
  "default",
  "muted",
  "primary",
  "accent",
  "gradient",
  "outline",
] as const satisfies readonly string[];
export type BentoGridItemVariantId = (typeof bentoGridItemVariantIds)[number];

const bentoGridItemVariants = cva(
  "group relative flex flex-col overflow-hidden rounded-xl border p-5 transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-card text-card-foreground border-border shadow-sm",
        muted:
          "bg-muted/40 text-foreground border-border shadow-sm",
        primary:
          "bg-primary/5 text-foreground border-primary/30 shadow-sm dark:bg-primary/10",
        accent:
          "bg-accent text-accent-foreground border-border shadow-sm",
        gradient:
          "bg-gradient-to-br from-primary/10 via-card to-accent text-foreground border-border shadow-sm",
        outline:
          "bg-transparent text-foreground border-border",
      } satisfies Record<BentoGridItemVariantId, string>,
      size: {
        "1x1": "col-span-1 row-span-1",
        "2x1": "col-span-1 sm:col-span-2 row-span-1",
        "1x2": "col-span-1 row-span-1 sm:row-span-2",
        "2x2": "col-span-1 sm:col-span-2 row-span-1 sm:row-span-2",
        "3x1": "col-span-1 sm:col-span-2 lg:col-span-3 row-span-1",
        "3x2": "col-span-1 sm:col-span-2 lg:col-span-3 row-span-1 sm:row-span-2",
      } satisfies Record<BentoGridItemSizeId, string>,
      interactive: {
        true: "cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "1x1",
      interactive: false,
    },
  },
);

export interface BentoGridItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "size">,
    VariantProps<typeof bentoGridItemVariants> {
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItem({
  className,
  variant,
  size,
  interactive,
  ref,
  ...props
}: BentoGridItemProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid-item"
      data-size={size ?? "1x1"}
      data-variant={variant ?? "default"}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      className={cn(
        bentoGridItemVariants({ variant, size, interactive }),
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
        "mb-3 flex items-center justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}
BentoGridItemHeader.displayName = "BentoGridItemHeader";

const bentoGridItemIconVariants = cva(
  "flex size-10 shrink-0 items-center justify-center rounded-lg [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        muted: "bg-background text-muted-foreground",
        primary:
          "bg-primary/15 text-primary dark:bg-primary/20 dark:text-primary-foreground",
        accent: "bg-background/60 text-foreground",
        gradient: "bg-primary/15 text-primary dark:text-primary-foreground",
        outline: "border border-border bg-background text-foreground",
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
  children,
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
      className={cn("mt-4 flex flex-1 flex-col", className)}
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
  bentoGridItemIconVariants,
};
