"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";

import { cn } from "@/lib/utils";

/**
 * BentoGrid renders a responsive, mosaic-style grid of cards ("cells") that
 * can span multiple columns and rows. It is intended for feature showcases,
 * marketing pages, dashboard summaries, and gallery-style layouts.
 */

export const bentoGridColumnCounts = [1, 2, 3, 4, 6] as const;
export type BentoGridColumnCount = (typeof bentoGridColumnCounts)[number];

export const bentoGridGapIds = ["sm", "md", "lg"] as const satisfies string[];
export type BentoGridGapId = (typeof bentoGridGapIds)[number];

const bentoGridVariants = cva("grid auto-rows-[minmax(10rem,auto)]", {
  variants: {
    gap: {
      sm: "gap-2 sm:gap-3",
      md: "gap-3 sm:gap-4",
      lg: "gap-4 sm:gap-6",
    } satisfies Record<BentoGridGapId, string>,
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    } satisfies Record<BentoGridColumnCount, string>,
  },
  defaultVariants: {
    gap: "md",
    columns: 3,
  },
});

export interface BentoGridProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof bentoGridVariants> {
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

function BentoGrid({
  className,
  gap,
  columns,
  ref,
  children,
  ...props
}: BentoGridProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid"
      className={cn(bentoGridVariants({ gap, columns }), className)}
      {...props}
    >
      {children}
    </div>
  );
}
BentoGrid.displayName = "BentoGrid";

export const bentoGridItemVariantIds = [
  "default",
  "muted",
  "primary",
  "outline",
  "gradient",
  "destructive",
  "warning",
] as const satisfies string[];
export type BentoGridItemVariantId = (typeof bentoGridItemVariantIds)[number];

export const bentoGridItemColSpans = [1, 2, 3, 4, 6] as const;
export type BentoGridItemColSpan = (typeof bentoGridItemColSpans)[number];

export const bentoGridItemRowSpans = [1, 2, 3] as const;
export type BentoGridItemRowSpan = (typeof bentoGridItemRowSpans)[number];

const bentoGridItemVariants = cva(
  "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border p-5 transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-border bg-card text-card-foreground hover:bg-accent/40",
        muted:
          "border-border bg-muted/60 text-foreground hover:bg-muted",
        primary:
          "border-primary/30 bg-primary/10 text-foreground hover:bg-primary/15 dark:bg-primary/15",
        outline:
          "border-border bg-transparent text-foreground hover:bg-accent/40",
        gradient:
          "border-border bg-gradient-to-br from-muted/60 via-background to-background text-foreground hover:from-muted",
        destructive:
          "border-destructive/30 bg-destructive/10 text-foreground hover:bg-destructive/15 dark:bg-destructive/15",
        warning:
          "border-warning/30 bg-warning/10 text-foreground hover:bg-warning/15",
      } satisfies Record<BentoGridItemVariantId, string>,
      interactive: {
        true: "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        false: "",
      },
      colSpan: {
        1: "sm:col-span-1",
        2: "sm:col-span-2",
        3: "sm:col-span-2 lg:col-span-3",
        4: "sm:col-span-2 lg:col-span-4",
        6: "sm:col-span-2 md:col-span-3 lg:col-span-6",
      } satisfies Record<BentoGridItemColSpan, string>,
      rowSpan: {
        1: "row-span-1",
        2: "row-span-2",
        3: "row-span-3",
      } satisfies Record<BentoGridItemRowSpan, string>,
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
      colSpan: 1,
      rowSpan: 1,
    },
  },
);

export interface BentoGridItemProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoGridItemVariants> {
  ref?: Ref<HTMLDivElement>;
  asChild?: boolean;
}

function BentoGridItem({
  className,
  variant,
  interactive,
  colSpan,
  rowSpan,
  ref,
  children,
  ...props
}: BentoGridItemProps): ReactElement {
  const isInteractive: boolean =
    interactive ??
    ((props.onClick !== undefined || props.role === "button") ? true : false);

  return (
    <div
      ref={ref}
      data-slot="bento-grid-item"
      data-variant={variant ?? "default"}
      tabIndex={isInteractive ? (props.tabIndex ?? 0) : props.tabIndex}
      className={cn(
        bentoGridItemVariants({
          variant,
          interactive: isInteractive,
          colSpan,
          rowSpan,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
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
        "relative flex min-h-[6rem] flex-1 items-stretch justify-stretch overflow-hidden rounded-lg bg-muted/40",
        className,
      )}
      {...props}
    />
  );
}
BentoGridItemHeader.displayName = "BentoGridItemHeader";

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
      className={cn("mt-4 flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}
BentoGridItemContent.displayName = "BentoGridItemContent";

const bentoGridItemIconVariants = cva(
  "inline-flex size-9 items-center justify-center rounded-md [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground",
        muted: "bg-background text-muted-foreground",
        primary: "bg-primary/15 text-primary dark:text-primary-foreground",
        outline: "bg-muted text-foreground",
        gradient: "bg-muted text-foreground",
        destructive: "bg-destructive/15 text-destructive",
        warning: "bg-warning/20 text-warning",
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
  children,
  ...props
}: BentoGridItemTitleProps): ReactElement {
  return (
    <h3
      ref={ref}
      data-slot="bento-grid-item-title"
      className={cn(
        "text-base font-semibold leading-tight tracking-tight text-foreground",
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
        "text-sm leading-relaxed text-muted-foreground [&_p]:leading-relaxed",
        className,
      )}
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
        "mt-4 flex items-center justify-between gap-2 text-sm text-muted-foreground",
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
  BentoGridItemContent,
  BentoGridItemIcon,
  BentoGridItemTitle,
  BentoGridItemDescription,
  BentoGridItemFooter,
  bentoGridVariants,
  bentoGridItemVariants,
  bentoGridItemIconVariants,
};
