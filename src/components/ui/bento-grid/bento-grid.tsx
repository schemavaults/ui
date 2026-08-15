"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  ReactElement,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

export const bentoGridColumnCounts = [1, 2, 3, 4, 6] as const;
export type BentoGridColumnCount = (typeof bentoGridColumnCounts)[number];

export const bentoGridGapIds = ["none", "sm", "md", "lg"] as const;
export type BentoGridGapId = (typeof bentoGridGapIds)[number];

const bentoGridBaseColumnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
  6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
} as const satisfies Record<BentoGridColumnCount, string>;

const bentoGridVariants = cva("grid w-full auto-rows-[minmax(11rem,auto)]", {
  variants: {
    gap: {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    } satisfies Record<BentoGridGapId, string>,
  },
  defaultVariants: {
    gap: "md",
  },
});

export interface BentoGridProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoGridVariants> {
  /**
   * Max number of grid columns on `md`+ viewports. Smaller viewports
   * scale down to one or two columns so items reflow gracefully on
   * mobile. Defaults to `3`.
   */
  columns?: BentoGridColumnCount;
  ref?: Ref<HTMLDivElement>;
}

function BentoGrid({
  className,
  columns = 3,
  gap,
  ref,
  ...props
}: BentoGridProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid"
      data-columns={columns}
      className={cn(
        bentoGridVariants({ gap }),
        bentoGridBaseColumnClasses[columns],
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
  "primary",
  "accent",
  "gradient",
  "outlined",
  "destructive",
  "warning",
] as const;
export type BentoGridItemVariantId = (typeof bentoGridItemVariantIds)[number];

export const bentoGridItemPaddingIds = [
  "none",
  "sm",
  "md",
  "lg",
] as const;
export type BentoGridItemPaddingId = (typeof bentoGridItemPaddingIds)[number];

const bentoGridItemVariants = cva(
  "group/bento-item relative flex h-full w-full flex-col overflow-hidden rounded-xl border shadow-sm transition-all",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        muted: "bg-muted/40 text-foreground border-border",
        primary:
          "bg-primary/5 text-foreground border-primary/30 dark:bg-primary/10",
        accent:
          "bg-accent/50 text-accent-foreground border-border dark:bg-accent/30",
        gradient:
          "bg-gradient-to-br from-primary/10 via-card to-accent/40 text-foreground border-border dark:from-primary/20 dark:via-card dark:to-accent/30",
        outlined:
          "bg-transparent text-foreground border-border shadow-none",
        destructive:
          "bg-destructive/5 text-foreground border-destructive/40 dark:border-destructive",
        warning:
          "bg-warning/5 text-foreground border-warning/40 dark:border-warning",
      } satisfies Record<BentoGridItemVariantId, string>,
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-6",
      } satisfies Record<BentoGridItemPaddingId, string>,
      interactive: {
        true: "cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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

const bentoGridItemColSpanClasses = {
  1: "col-span-1",
  2: "col-span-1 sm:col-span-2",
  3: "col-span-1 sm:col-span-2 md:col-span-3",
  4: "col-span-1 sm:col-span-2 md:col-span-4",
  5: "col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-5",
  6: "col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-6",
} as const;

const bentoGridItemRowSpanClasses = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
} as const;

export type BentoGridItemColSpan = keyof typeof bentoGridItemColSpanClasses;
export type BentoGridItemRowSpan = keyof typeof bentoGridItemRowSpanClasses;

export interface BentoGridItemProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoGridItemVariants> {
  /**
   * Number of columns the cell spans on `md`+ viewports. On smaller
   * viewports the value automatically clamps to keep the grid legible.
   * Defaults to `1`.
   */
  colSpan?: BentoGridItemColSpan;
  /**
   * Number of rows the cell spans. Defaults to `1`.
   */
  rowSpan?: BentoGridItemRowSpan;
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItem({
  className,
  variant,
  padding,
  interactive,
  colSpan = 1,
  rowSpan = 1,
  ref,
  ...props
}: BentoGridItemProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid-item"
      data-variant={variant ?? "default"}
      data-padding={padding ?? "md"}
      data-col-span={colSpan}
      data-row-span={rowSpan}
      data-interactive={interactive ? "true" : undefined}
      className={cn(
        bentoGridItemVariants({ variant, padding, interactive }),
        bentoGridItemColSpanClasses[colSpan],
        bentoGridItemRowSpanClasses[rowSpan],
        className,
      )}
      {...props}
    />
  );
}
BentoGridItem.displayName = "BentoGridItem";

export interface BentoGridItemMediaProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItemMedia({
  className,
  ref,
  ...props
}: BentoGridItemMediaProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid-item-media"
      className={cn(
        "-mx-5 -mt-5 mb-4 flex min-h-[6rem] items-center justify-center overflow-hidden border-b border-border/60 bg-muted/40",
        "group-data-[padding=none]/bento-item:m-0 group-data-[padding=none]/bento-item:border-0",
        "group-data-[padding=sm]/bento-item:-mx-3 group-data-[padding=sm]/bento-item:-mt-3 group-data-[padding=sm]/bento-item:mb-3",
        "group-data-[padding=lg]/bento-item:-mx-6 group-data-[padding=lg]/bento-item:-mt-6 group-data-[padding=lg]/bento-item:mb-5",
        className,
      )}
      {...props}
    />
  );
}
BentoGridItemMedia.displayName = "BentoGridItemMedia";

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
      aria-hidden="true"
      data-slot="bento-grid-item-icon"
      className={cn(
        "mb-3 inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&>svg]:size-5 [&>svg]:shrink-0",
        "group-data-[variant=primary]/bento-item:bg-primary/10 group-data-[variant=primary]/bento-item:text-primary dark:group-data-[variant=primary]/bento-item:text-primary-foreground",
        "group-data-[variant=accent]/bento-item:bg-background/70 group-data-[variant=accent]/bento-item:text-foreground",
        "group-data-[variant=gradient]/bento-item:bg-background/70 group-data-[variant=gradient]/bento-item:text-primary dark:group-data-[variant=gradient]/bento-item:text-primary-foreground",
        "group-data-[variant=destructive]/bento-item:bg-destructive/10 group-data-[variant=destructive]/bento-item:text-destructive",
        "group-data-[variant=warning]/bento-item:bg-warning/15 group-data-[variant=warning]/bento-item:text-warning",
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
  /**
   * Heading level to render. Defaults to `h3` since bento items typically
   * live under a page-level heading.
   */
  as?: "h2" | "h3" | "h4";
}

function BentoGridItemTitle({
  className,
  as: Comp = "h3",
  ref,
  ...props
}: BentoGridItemTitleProps): ReactElement {
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
      className={cn("mt-3 flex-1", className)}
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
  BentoGridItemMedia,
  BentoGridItemIcon,
  BentoGridItemTitle,
  BentoGridItemDescription,
  BentoGridItemContent,
  BentoGridItemFooter,
  bentoGridVariants,
  bentoGridItemVariants,
};
