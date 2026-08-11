"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";

export const bentoGridColumnCounts = [2, 3, 4, 6] as const;

export type BentoGridColumnCount = (typeof bentoGridColumnCounts)[number];

export const bentoGridGapIds = [
  "none",
  "sm",
  "md",
  "lg",
] as const satisfies string[];

export type BentoGridGapId = (typeof bentoGridGapIds)[number];

const bentoGridVariants = cva("grid w-full auto-rows-fr", {
  variants: {
    columns: {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6",
    } satisfies Record<BentoGridColumnCount, string>,
    gap: {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    } satisfies Record<BentoGridGapId, string>,
    dense: {
      true: "grid-flow-dense",
      false: "",
    },
  },
  defaultVariants: {
    columns: 3,
    gap: "md",
    dense: false,
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
  dense,
  ref,
  ...props
}: BentoGridProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid"
      className={cn(bentoGridVariants({ columns, gap, dense }), className)}
      {...props}
    />
  );
}
BentoGrid.displayName = "BentoGrid";

export const bentoGridItemSurfaceIds = [
  "card",
  "muted",
  "primary",
  "accent",
  "outline",
  "none",
] as const satisfies string[];

export type BentoGridItemSurfaceId = (typeof bentoGridItemSurfaceIds)[number];

export const bentoGridItemColSpans = [1, 2, 3, 4, 5, 6] as const;

export type BentoGridItemColSpan = (typeof bentoGridItemColSpans)[number];

export const bentoGridItemRowSpans = [1, 2, 3] as const;

export type BentoGridItemRowSpan = (typeof bentoGridItemRowSpans)[number];

export const bentoGridItemSmColSpans = [1, 2] as const;

export type BentoGridItemSmColSpan = (typeof bentoGridItemSmColSpans)[number];

const bentoGridItemVariants = cva(
  "relative flex flex-col overflow-hidden rounded-lg transition-colors",
  {
    variants: {
      surface: {
        card: "border border-border bg-card text-card-foreground shadow-sm",
        muted: "border border-border bg-muted/40 text-foreground",
        primary:
          "border border-primary/30 bg-primary/5 text-foreground dark:bg-primary/10",
        accent:
          "border border-border/60 bg-accent text-accent-foreground",
        outline: "border border-dashed border-border bg-transparent text-foreground",
        none: "bg-transparent text-foreground",
      } satisfies Record<BentoGridItemSurfaceId, string>,
      padded: {
        true: "p-4 gap-3",
        false: "",
      },
      interactive: {
        true: "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:border-primary/40",
        false: "",
      },
      colSpan: {
        1: "lg:col-span-1",
        2: "lg:col-span-2",
        3: "lg:col-span-3",
        4: "lg:col-span-4",
        5: "lg:col-span-5",
        6: "lg:col-span-6",
      } satisfies Record<BentoGridItemColSpan, string>,
      smColSpan: {
        1: "sm:col-span-1",
        2: "sm:col-span-2",
      } satisfies Record<BentoGridItemSmColSpan, string>,
      rowSpan: {
        1: "row-span-1",
        2: "row-span-2",
        3: "row-span-3",
      } satisfies Record<BentoGridItemRowSpan, string>,
    },
    defaultVariants: {
      surface: "card",
      padded: true,
      interactive: false,
      colSpan: 1,
      smColSpan: 1,
      rowSpan: 1,
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
  surface,
  padded,
  interactive,
  colSpan,
  smColSpan,
  rowSpan,
  ref,
  ...props
}: BentoGridItemProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid-item"
      data-surface={surface ?? "card"}
      data-col-span={colSpan ?? 1}
      data-row-span={rowSpan ?? 1}
      className={cn(
        bentoGridItemVariants({
          surface,
          padded,
          interactive,
          colSpan,
          smColSpan,
          rowSpan,
        }),
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
        "flex w-full items-start justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}
BentoGridItemHeader.displayName = "BentoGridItemHeader";

export interface BentoGridItemIconProps
  extends HTMLAttributes<HTMLDivElement> {
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
      data-slot="bento-grid-item-icon"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&>svg]:size-5",
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
      className={cn("text-sm text-muted-foreground", className)}
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
      className={cn("flex flex-1 flex-col", className)}
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
        "flex w-full items-center justify-between gap-2 pt-2 text-sm text-muted-foreground",
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
