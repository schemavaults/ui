"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

/**
 * BentoGrid — an asymmetric feature-tile grid layout popularised by modern
 * marketing pages (Apple, Vercel, Linear). Tiles can span multiple columns
 * or rows on `md`+ breakpoints so a single grid can mix hero, wide, tall
 * and default tiles without the caller having to reason about CSS grid.
 *
 * Compose with the exported subcomponents, mirroring the shadcn Card API.
 */

export const bentoGridColumnIds = [2, 3, 4] as const satisfies number[];
export type BentoGridColumnId = (typeof bentoGridColumnIds)[number];

export const bentoGridGapIds = ["sm", "md", "lg"] as const satisfies string[];
export type BentoGridGapId = (typeof bentoGridGapIds)[number];

const bentoGridVariants = cva("grid w-full auto-rows-[minmax(180px,auto)]", {
  variants: {
    columns: {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    } satisfies Record<BentoGridColumnId, string>,
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

export const bentoCardSizeIds = [
  "default",
  "wide",
  "tall",
  "large",
  "full",
] as const satisfies string[];
export type BentoCardSizeId = (typeof bentoCardSizeIds)[number];

export const bentoCardVariantIds = [
  "default",
  "muted",
  "primary",
  "accent",
  "outline",
] as const satisfies string[];
export type BentoCardVariantId = (typeof bentoCardVariantIds)[number];

const bentoCardVariants = cva(
  [
    "group/bento-card relative flex flex-col overflow-hidden rounded-lg border p-6",
    "transition-all duration-200",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border shadow-sm",
        muted: "bg-muted/40 text-foreground border-border",
        primary:
          "bg-primary/5 text-foreground border-primary/30 dark:bg-primary/10",
        accent: "bg-accent text-accent-foreground border-border",
        outline: "bg-transparent text-foreground border-border",
      } satisfies Record<BentoCardVariantId, string>,
      size: {
        default: "sm:col-span-1 sm:row-span-1",
        wide: "sm:col-span-2 sm:row-span-1",
        tall: "sm:col-span-1 sm:row-span-2",
        large: "sm:col-span-2 sm:row-span-2",
        full: "sm:col-span-full sm:row-span-1",
      } satisfies Record<BentoCardSizeId, string>,
      interactive: {
        true: [
          "cursor-pointer",
          "hover:shadow-md hover:-translate-y-0.5",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",
        ].join(" "),
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  },
);

type BentoCardVariantProps = VariantProps<typeof bentoCardVariants>;

export interface BentoCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick">,
    BentoCardVariantProps {
  /**
   * Optional click handler. When provided (or when `interactive` is true),
   * the card becomes keyboard-focusable and dispatches on Enter/Space.
   */
  onClick?: HTMLAttributes<HTMLDivElement>["onClick"];
  ref?: Ref<HTMLDivElement>;
}

function BentoCard({
  className,
  variant,
  size,
  interactive,
  onClick,
  onKeyDown,
  ref,
  ...props
}: BentoCardProps): ReactElement {
  const isInteractive = interactive || typeof onClick === "function";
  return (
    <div
      ref={ref}
      data-slot="bento-card"
      data-size={size ?? "default"}
      data-variant={variant ?? "default"}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (!isInteractive || !onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick(
            event as unknown as Parameters<
              NonNullable<HTMLAttributes<HTMLDivElement>["onClick"]>
            >[0],
          );
        }
      }}
      className={cn(
        bentoCardVariants({ variant, size, interactive: isInteractive }),
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
      className={cn(
        "flex w-full items-start justify-between gap-3",
        className,
      )}
      {...props}
    />
  );
}
BentoCardHeader.displayName = "BentoCardHeader";

const bentoCardIconVariants = cva(
  [
    "flex size-10 shrink-0 items-center justify-center rounded-md",
    "[&>svg]:size-5 [&>svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        muted: "bg-background text-muted-foreground",
        primary: "bg-primary/10 text-primary dark:text-primary-foreground",
        accent: "bg-background text-accent-foreground",
        outline: "bg-muted text-muted-foreground",
      } satisfies Record<BentoCardVariantId, string>,
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BentoCardIconProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoCardIconVariants> {
  ref?: Ref<HTMLDivElement>;
}

function BentoCardIcon({
  className,
  variant,
  ref,
  ...props
}: BentoCardIconProps): ReactElement {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="bento-card-icon"
      className={cn(bentoCardIconVariants({ variant }), className)}
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
        "text-lg font-semibold leading-tight tracking-tight",
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
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
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
      className={cn("mt-4 flex flex-1 flex-col gap-2", className)}
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
 * BentoCardMedia — a full-bleed media well anchored to the bottom of the
 * card. Useful for illustrative screenshots, animated graphics, or code
 * previews in `wide`/`large`/`tall` tiles.
 */
export interface BentoCardMediaProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional children rendered inside the media well. */
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

function BentoCardMedia({
  className,
  children,
  ref,
  ...props
}: BentoCardMediaProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-card-media"
      className={cn(
        "-mx-6 -mb-6 mt-6 flex flex-1 items-end justify-center overflow-hidden",
        "bg-gradient-to-b from-transparent to-background/40",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
BentoCardMedia.displayName = "BentoCardMedia";

export {
  BentoGrid,
  BentoCard,
  BentoCardHeader,
  BentoCardIcon,
  BentoCardTitle,
  BentoCardDescription,
  BentoCardContent,
  BentoCardFooter,
  BentoCardMedia,
  bentoGridVariants,
  bentoCardVariants,
  bentoCardIconVariants,
};
