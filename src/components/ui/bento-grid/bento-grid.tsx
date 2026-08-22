"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";

/**
 * BentoGrid is a responsive, "dense" CSS-grid layout suitable for feature
 * showcases, marketing pages, and dashboards where individual cells may
 * span multiple columns or rows. Cells are rendered as {@link BentoCard}
 * components which pick their own span via typed props so that Tailwind
 * can statically discover every class.
 */

export const bentoGridColumnCounts = [2, 3, 4, 6] as const satisfies number[];
export type BentoGridColumnCount = (typeof bentoGridColumnCounts)[number];

export const bentoGridGapIds = ["sm", "md", "lg"] as const satisfies string[];
export type BentoGridGapId = (typeof bentoGridGapIds)[number];

const bentoGridVariants = cva("grid w-full auto-rows-[minmax(10rem,auto)]", {
  variants: {
    columns: {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
    } satisfies Record<BentoGridColumnCount, string>,
    gap: {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    } satisfies Record<BentoGridGapId, string>,
    flowDense: {
      true: "grid-flow-row-dense",
      false: "",
    },
  },
  defaultVariants: {
    columns: 3,
    gap: "md",
    flowDense: true,
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
  flowDense,
  ref,
  ...props
}: BentoGridProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid"
      className={cn(
        bentoGridVariants({ columns, gap, flowDense }),
        className,
      )}
      {...props}
    />
  );
}
BentoGrid.displayName = "BentoGrid";

export const bentoCardVariantIds = [
  "default",
  "muted",
  "primary",
  "accent",
  "outline",
  "gradient",
  "glass",
] as const satisfies string[];
export type BentoCardVariantId = (typeof bentoCardVariantIds)[number];

export const bentoCardColSpans = [1, 2, 3, 4, 6] as const satisfies number[];
export type BentoCardColSpan = (typeof bentoCardColSpans)[number];

export const bentoCardRowSpans = [1, 2, 3] as const satisfies number[];
export type BentoCardRowSpan = (typeof bentoCardRowSpans)[number];

const bentoCardVariants = cva(
  "group relative flex flex-col overflow-hidden rounded-xl border p-5 text-card-foreground transition-colors",
  {
    variants: {
      variant: {
        default: "bg-card border-border shadow-sm",
        muted: "bg-muted/40 border-border",
        primary:
          "bg-primary/5 border-primary/30 text-foreground dark:bg-primary/10",
        accent:
          "bg-accent/60 border-accent text-accent-foreground dark:bg-accent/40",
        outline: "bg-transparent border-border/70",
        gradient:
          "border-transparent bg-gradient-to-br from-primary/15 via-primary/5 to-background text-foreground shadow-sm dark:from-primary/25 dark:via-primary/10 dark:to-background",
        glass:
          "border-border/60 bg-background/60 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-background/40",
      } satisfies Record<BentoCardVariantId, string>,
      interactive: {
        true: "cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        false: "",
      },
      colSpan: {
        1: "",
        2: "sm:col-span-2",
        3: "sm:col-span-2 lg:col-span-3",
        4: "sm:col-span-2 lg:col-span-4",
        6: "sm:col-span-2 lg:col-span-6",
      } satisfies Record<BentoCardColSpan, string>,
      rowSpan: {
        1: "",
        2: "row-span-2",
        3: "row-span-3",
      } satisfies Record<BentoCardRowSpan, string>,
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
      colSpan: 1,
      rowSpan: 1,
    },
  },
);

export interface BentoCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoCardVariants> {
  ref?: Ref<HTMLDivElement>;
}

function BentoCard({
  className,
  variant,
  interactive,
  colSpan,
  rowSpan,
  ref,
  ...props
}: BentoCardProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-card"
      data-variant={variant ?? "default"}
      className={cn(
        bentoCardVariants({ variant, interactive, colSpan, rowSpan }),
        className,
      )}
      {...props}
    />
  );
}
BentoCard.displayName = "BentoCard";

export interface BentoCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function BentoCardHeader({
  className,
  ref,
  ...props
}: BentoCardHeaderProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-card-header"
      className={cn("flex items-start gap-3", className)}
      {...props}
    />
  );
}
BentoCardHeader.displayName = "BentoCardHeader";

export interface BentoCardIconProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function BentoCardIcon({
  className,
  ref,
  ...props
}: BentoCardIconProps): ReactElement {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="bento-card-icon"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary [&>svg]:size-5 dark:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}
BentoCardIcon.displayName = "BentoCardIcon";

export interface BentoCardTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  ref?: Ref<HTMLHeadingElement>;
}

function BentoCardTitle({
  className,
  children,
  ref,
  ...props
}: BentoCardTitleProps): ReactElement {
  return (
    <h3
      ref={ref}
      data-slot="bento-card-title"
      className={cn(
        "font-semibold leading-tight tracking-tight text-base",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
BentoCardTitle.displayName = "BentoCardTitle";

export interface BentoCardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
}

function BentoCardDescription({
  className,
  ref,
  ...props
}: BentoCardDescriptionProps): ReactElement {
  return (
    <p
      ref={ref}
      data-slot="bento-card-description"
      className={cn("text-sm text-muted-foreground leading-snug", className)}
      {...props}
    />
  );
}
BentoCardDescription.displayName = "BentoCardDescription";

export interface BentoCardContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function BentoCardContent({
  className,
  ref,
  ...props
}: BentoCardContentProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-card-content"
      className={cn("mt-4 flex-1", className)}
      {...props}
    />
  );
}
BentoCardContent.displayName = "BentoCardContent";

export interface BentoCardFooterProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function BentoCardFooter({
  className,
  ref,
  ...props
}: BentoCardFooterProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-card-footer"
      className={cn(
        "mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
BentoCardFooter.displayName = "BentoCardFooter";

/**
 * A decorative slot that lets a card use its full inner area for imagery
 * or a custom visualization. Absolutely positioned behind the card's
 * content so headers and footers stay legible on top.
 */
export interface BentoCardVisualProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * When true, the visual is anchored to the bottom of the card and
   * clipped by the card's rounded corners. Useful for cropped previews.
   */
  bottom?: boolean;
}

function BentoCardVisual({
  className,
  bottom = false,
  ref,
  ...props
}: BentoCardVisualProps): ReactElement {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="bento-card-visual"
      className={cn(
        "pointer-events-none absolute inset-x-0",
        bottom ? "bottom-0" : "inset-y-0",
        className,
      )}
      {...props}
    />
  );
}
BentoCardVisual.displayName = "BentoCardVisual";

export {
  BentoGrid,
  BentoCard,
  BentoCardHeader,
  BentoCardIcon,
  BentoCardTitle,
  BentoCardDescription,
  BentoCardContent,
  BentoCardFooter,
  BentoCardVisual,
  bentoGridVariants,
  bentoCardVariants,
};
