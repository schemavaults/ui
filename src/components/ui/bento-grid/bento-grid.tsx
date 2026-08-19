"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

export const bentoGridColumnCounts = [
  1, 2, 3, 4, 6, 12,
] as const satisfies readonly number[];
export type BentoGridColumnCount = (typeof bentoGridColumnCounts)[number];

export const bentoGridGapIds = [
  "none",
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type BentoGridGapId = (typeof bentoGridGapIds)[number];

const bentoGridColumnClasses: Record<BentoGridColumnCount, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-2 sm:grid-cols-4 lg:grid-cols-12",
};

const bentoGridGapClasses: Record<BentoGridGapId, string> = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns in the grid at the `lg` breakpoint. Smaller
   * breakpoints step down responsively.
   *
   * @default 3
   */
  columns?: BentoGridColumnCount;
  /**
   * Spacing between grid items.
   *
   * @default "md"
   */
  gap?: BentoGridGapId;
  /**
   * When true, rows automatically size to their content using
   * `grid-auto-rows: min-content`. When false (the default) rows share a
   * uniform min-height so items line up neatly.
   *
   * @default false
   */
  autoRows?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function BentoGrid({
  className,
  columns = 3,
  gap = "md",
  autoRows = false,
  ref,
  ...props
}: BentoGridProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid"
      data-columns={columns}
      data-gap={gap}
      className={cn(
        "grid w-full",
        bentoGridColumnClasses[columns],
        bentoGridGapClasses[gap],
        autoRows ? "auto-rows-min" : "auto-rows-[minmax(9rem,auto)]",
        className,
      )}
      {...props}
    />
  );
}
BentoGrid.displayName = "BentoGrid";

export const bentoGridItemVariantIds = [
  "default",
  "muted",
  "outline",
  "primary",
  "accent",
  "destructive",
  "warning",
  "gradient",
] as const satisfies readonly string[];
export type BentoGridItemVariantId = (typeof bentoGridItemVariantIds)[number];

export const bentoGridItemPaddingIds = [
  "none",
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type BentoGridItemPaddingId =
  (typeof bentoGridItemPaddingIds)[number];

const bentoGridItemVariants = cva(
  "group/bento-item relative flex h-full flex-col overflow-hidden rounded-xl border transition-colors",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        muted: "bg-muted/50 text-foreground border-border/60",
        outline: "bg-transparent text-foreground border-border",
        primary:
          "bg-primary/5 text-foreground border-primary/30 dark:bg-primary/10",
        accent:
          "bg-accent/50 text-accent-foreground border-accent dark:bg-accent/30",
        destructive:
          "bg-destructive/5 text-foreground border-destructive/40 dark:border-destructive",
        warning:
          "bg-warning/5 text-foreground border-warning/40 dark:border-warning",
        gradient:
          "border-border text-card-foreground bg-gradient-to-br from-primary/10 via-card to-accent/40 dark:from-primary/20 dark:via-card dark:to-accent/20",
      } satisfies Record<BentoGridItemVariantId, string>,
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-7",
      } satisfies Record<BentoGridItemPaddingId, string>,
      interactive: {
        true: "cursor-pointer hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      interactive: false,
    },
  },
);

export const bentoGridItemSpans = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
] as const satisfies readonly number[];
export type BentoGridItemSpan = (typeof bentoGridItemSpans)[number];

const colSpanClasses: Record<BentoGridItemSpan, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
  4: "sm:col-span-2 lg:col-span-4",
  5: "sm:col-span-2 lg:col-span-5",
  6: "sm:col-span-2 lg:col-span-6",
  7: "sm:col-span-2 lg:col-span-7",
  8: "sm:col-span-2 lg:col-span-8",
  9: "sm:col-span-2 lg:col-span-9",
  10: "sm:col-span-2 lg:col-span-10",
  11: "sm:col-span-2 lg:col-span-11",
  12: "sm:col-span-2 lg:col-span-12",
};

const rowSpanClasses: Record<BentoGridItemSpan, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
  7: "row-span-7",
  8: "row-span-8",
  9: "row-span-9",
  10: "row-span-10",
  11: "row-span-11",
  12: "row-span-12",
};

export interface BentoGridItemProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoGridItemVariants> {
  /**
   * Column span at the `lg` breakpoint. Below `sm` the item always fills
   * a single column; between `sm` and `lg` the item spans 1 or 2 columns
   * depending on the requested value.
   *
   * @default 1
   */
  colSpan?: BentoGridItemSpan;
  /**
   * Row span. Defaults to `1`. Combine with an ancestor `BentoGrid`
   * (which uses `grid-auto-rows`) to build asymmetric layouts.
   *
   * @default 1
   */
  rowSpan?: BentoGridItemSpan;
  /**
   * Render as a different element (e.g. an `<a>` or `<button>`) via
   * Radix `Slot`. Useful for making the entire item a link or an
   * interactive control.
   */
  asChild?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItem({
  className,
  variant,
  padding,
  interactive,
  colSpan = 1,
  rowSpan = 1,
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
      data-col-span={colSpan}
      data-row-span={rowSpan}
      className={cn(
        bentoGridItemVariants({ variant, padding, interactive }),
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
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
  "flex shrink-0 items-center justify-center rounded-md [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        muted: "bg-background text-muted-foreground",
        outline: "bg-muted text-muted-foreground",
        primary: "bg-primary/10 text-primary dark:text-primary-foreground",
        accent: "bg-background/60 text-accent-foreground",
        destructive: "bg-destructive/10 text-destructive",
        warning: "bg-warning/15 text-warning",
        gradient: "bg-background/70 text-primary dark:text-primary-foreground",
      } satisfies Record<BentoGridItemVariantId, string>,
      size: {
        sm: "size-7 [&>svg]:size-4",
        md: "size-9 [&>svg]:size-5",
        lg: "size-11 [&>svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
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
  size,
  ref,
  ...props
}: BentoGridItemIconProps): ReactElement {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="bento-grid-item-icon"
      className={cn(
        bentoGridItemIconVariants({ variant, size }),
        className,
      )}
      {...props}
    />
  );
}
BentoGridItemIcon.displayName = "BentoGridItemIcon";

export interface BentoGridItemTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
  ref?: Ref<HTMLHeadingElement>;
}

function BentoGridItemTitle({
  className,
  as = "h3",
  ref,
  ...props
}: BentoGridItemTitleProps): ReactElement {
  const Comp = as;
  return (
    <Comp
      ref={ref}
      data-slot="bento-grid-item-title"
      className={cn(
        "text-base font-semibold leading-tight tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
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
        "mt-1 text-sm leading-relaxed text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
BentoGridItemDescription.displayName = "BentoGridItemDescription";

export interface BentoGridItemContentProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * When true, the content region grows to fill remaining vertical
   * space, which is useful for pushing a footer to the bottom of the
   * item.
   *
   * @default true
   */
  fill?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItemContent({
  className,
  fill = true,
  ref,
  children,
  ...props
}: BentoGridItemContentProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid-item-content"
      className={cn(
        "flex flex-col text-sm text-foreground/90",
        fill && "flex-1",
        className,
      )}
      {...props}
    >
      {children as ReactNode}
    </div>
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
  bentoGridItemVariants,
  bentoGridItemIconVariants,
};
