"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

export const bentoGridColumnIds = [2, 3, 4, 6] as const satisfies readonly number[];
export type BentoGridColumnId = (typeof bentoGridColumnIds)[number];

export const bentoGridGapIds = ["sm", "md", "lg"] as const satisfies readonly string[];
export type BentoGridGapId = (typeof bentoGridGapIds)[number];

const bentoGridGapClasses = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
} satisfies Record<BentoGridGapId, string>;

const bentoGridColumnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  6: "sm:grid-cols-3 lg:grid-cols-6",
} satisfies Record<BentoGridColumnId, string>;

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns rendered on the largest breakpoint. Smaller
   * breakpoints scale down: `2` uses one column on mobile; `3`, `4`, and
   * `6` step through 1/2/3–4/6 as the viewport widens.
   */
  columns?: BentoGridColumnId;
  /** Gap size between grid items. */
  gap?: BentoGridGapId;
  /**
   * Uniform row height. Defaults to `auto`, which lets each row size to
   * its own content. Pass a fixed value (e.g. `"12rem"`) for perfectly
   * regular row heights.
   */
  autoRows?: string;
  ref?: Ref<HTMLDivElement>;
}

function BentoGrid({
  className,
  columns = 3,
  gap = "md",
  autoRows = "auto",
  style,
  ref,
  ...props
}: BentoGridProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid"
      data-columns={columns}
      className={cn(
        "grid w-full auto-rows-[minmax(0,auto)] grid-cols-1",
        bentoGridColumnClasses[columns],
        bentoGridGapClasses[gap],
        className,
      )}
      style={{
        gridAutoRows: autoRows,
        ...style,
      }}
      {...props}
    />
  );
}
BentoGrid.displayName = "BentoGrid";

export const bentoGridItemSizeIds = [
  "sm",
  "md",
  "lg",
  "wide",
  "tall",
  "hero",
] as const satisfies readonly string[];
export type BentoGridItemSizeId = (typeof bentoGridItemSizeIds)[number];

export const bentoGridItemVariantIds = [
  "default",
  "muted",
  "primary",
  "accent",
  "outlined",
] as const satisfies readonly string[];
export type BentoGridItemVariantId = (typeof bentoGridItemVariantIds)[number];

const bentoGridItemVariants = cva(
  "group/bento-item relative flex flex-col overflow-hidden rounded-xl border p-5 text-left transition-colors [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground shadow-sm",
        muted: "border-border bg-muted/40 text-foreground",
        primary:
          "border-primary/30 bg-primary/5 text-foreground dark:bg-primary/10",
        accent:
          "border-accent bg-accent/60 text-accent-foreground dark:bg-accent/30",
        outlined: "border-border bg-transparent text-foreground",
      } satisfies Record<BentoGridItemVariantId, string>,
      size: {
        sm: "col-span-1 row-span-1",
        md: "col-span-1 row-span-1 sm:col-span-2",
        lg: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2",
        wide: "col-span-1 row-span-1 sm:col-span-2 lg:col-span-3",
        tall: "col-span-1 row-span-2",
        hero: "col-span-1 row-span-2 sm:col-span-2 lg:col-span-3",
      } satisfies Record<BentoGridItemSizeId, string>,
      interactive: {
        true: "cursor-pointer hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      interactive: false,
    },
  },
);

export interface BentoGridItemProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoGridItemVariants> {
  /**
   * Optional media/decoration rendered above the header. Typically an
   * illustration, chart, or gradient block.
   */
  media?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

function BentoGridItem({
  className,
  variant,
  size,
  interactive,
  media,
  children,
  ref,
  ...props
}: BentoGridItemProps): ReactElement {
  const isInteractive = interactive === true;
  return (
    <div
      ref={ref}
      data-slot="bento-grid-item"
      data-variant={variant ?? "default"}
      data-size={size ?? "sm"}
      data-interactive={isInteractive ? "true" : "false"}
      {...(isInteractive ? { tabIndex: 0, role: "button" } : {})}
      className={cn(
        bentoGridItemVariants({ variant, size, interactive }),
        className,
      )}
      {...props}
    >
      {media !== undefined && (
        <div
          data-slot="bento-grid-item-media"
          className="-mx-5 -mt-5 mb-4 aspect-[16/9] w-[calc(100%+2.5rem)] overflow-hidden bg-muted/60"
        >
          {media}
        </div>
      )}
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
        "mb-3 flex items-start justify-between gap-3",
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
      aria-hidden="true"
      data-slot="bento-grid-item-icon"
      className={cn(
        "flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary [&>svg]:size-5 dark:text-primary-foreground",
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
      className={cn("mt-3 flex-1 text-sm text-foreground/90", className)}
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
  bentoGridItemVariants,
};
