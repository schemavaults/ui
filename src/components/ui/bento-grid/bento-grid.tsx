"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  ComponentProps,
  ElementType,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

/* ================================================================== */
/* BentoGrid — container                                              */
/* ================================================================== */

export const bentoGridColumnIds = [
  "2",
  "3",
  "4",
  "6",
  "12",
] as const satisfies readonly string[];
export type BentoGridColumnCount = (typeof bentoGridColumnIds)[number];

export const bentoGridGapIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type BentoGridGapId = (typeof bentoGridGapIds)[number];

export const bentoGridAutoRowIds = [
  "sm",
  "default",
  "lg",
  "xl",
  "auto",
] as const satisfies readonly string[];
export type BentoGridAutoRowId = (typeof bentoGridAutoRowIds)[number];

const bentoGridVariants = cva("grid w-full auto-rows-[minmax(0,auto)]", {
  variants: {
    columns: {
      "2": "grid-cols-1 sm:grid-cols-2",
      "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      "6": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
      "12": "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12",
    } satisfies Record<BentoGridColumnCount, string>,
    gap: {
      sm: "gap-2",
      default: "gap-4",
      lg: "gap-6",
    } satisfies Record<BentoGridGapId, string>,
    autoRows: {
      sm: "auto-rows-[minmax(8rem,auto)]",
      default: "auto-rows-[minmax(11rem,auto)]",
      lg: "auto-rows-[minmax(14rem,auto)]",
      xl: "auto-rows-[minmax(18rem,auto)]",
      auto: "auto-rows-[minmax(0,auto)]",
    } satisfies Record<BentoGridAutoRowId, string>,
  },
  defaultVariants: {
    columns: "3",
    gap: "default",
    autoRows: "default",
  },
});

export interface BentoGridProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoGridVariants> {
  /**
   * When `true`, item ordering is "auto-flow dense" — later small items may
   * back-fill earlier gaps to reduce whitespace. Off by default because the
   * dense algorithm can visually reorder items away from DOM order.
   */
  denseFlow?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function BentoGrid({
  className,
  columns,
  gap,
  autoRows,
  denseFlow,
  ref,
  ...props
}: BentoGridProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="bento-grid"
      data-columns={columns ?? "3"}
      data-gap={gap ?? "default"}
      data-auto-rows={autoRows ?? "default"}
      className={cn(
        bentoGridVariants({ columns, gap, autoRows }),
        denseFlow ? "grid-flow-dense" : undefined,
        className,
      )}
      {...props}
    />
  );
}
BentoGrid.displayName = "BentoGrid";

/* ================================================================== */
/* BentoGridItem — a single tile                                      */
/* ================================================================== */

export const bentoGridItemVariantIds = [
  "default",
  "muted",
  "primary",
  "secondary",
  "accent",
  "outline",
  "ghost",
] as const satisfies readonly string[];
export type BentoGridItemVariantId =
  (typeof bentoGridItemVariantIds)[number];

export const bentoGridItemPaddingIds = [
  "none",
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type BentoGridItemPaddingId =
  (typeof bentoGridItemPaddingIds)[number];

export const bentoGridItemColSpanIds = [
  "1",
  "2",
  "3",
  "4",
  "6",
  "full",
] as const satisfies readonly string[];
export type BentoGridItemColSpan = (typeof bentoGridItemColSpanIds)[number];

export const bentoGridItemRowSpanIds = [
  "1",
  "2",
  "3",
] as const satisfies readonly string[];
export type BentoGridItemRowSpan = (typeof bentoGridItemRowSpanIds)[number];

const bentoGridItemVariants = cva(
  "group/bento relative flex flex-col overflow-hidden rounded-xl border transition-colors",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        muted: "bg-muted/40 text-foreground border-border",
        primary:
          "bg-primary/5 text-foreground border-primary/30 dark:bg-primary/10",
        secondary:
          "bg-secondary/50 text-secondary-foreground border-border",
        accent:
          "bg-accent/40 text-accent-foreground border-accent-foreground/10",
        outline: "bg-transparent text-foreground border-border",
        ghost:
          "bg-transparent text-foreground border-transparent shadow-none",
      } satisfies Record<BentoGridItemVariantId, string>,
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-5",
        lg: "p-7",
      } satisfies Record<BentoGridItemPaddingId, string>,
      colSpan: {
        "1": "",
        "2": "sm:col-span-2",
        "3": "sm:col-span-2 lg:col-span-3",
        "4": "sm:col-span-2 lg:col-span-4",
        "6": "sm:col-span-2 lg:col-span-6",
        full: "col-span-full",
      } satisfies Record<BentoGridItemColSpan, string>,
      rowSpan: {
        "1": "",
        "2": "sm:row-span-2",
        "3": "sm:row-span-3",
      } satisfies Record<BentoGridItemRowSpan, string>,
      elevated: {
        true: "shadow-sm",
        false: "",
      },
      interactive: {
        true: "cursor-pointer hover:bg-accent/50 hover:border-accent-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      colSpan: "1",
      rowSpan: "1",
      elevated: true,
      interactive: false,
    },
  },
);

type BentoGridItemBaseProps = Omit<
  HTMLAttributes<HTMLElement>,
  "title" | "children"
> &
  VariantProps<typeof bentoGridItemVariants> & {
    /** Optional leading visual — usually a lucide icon inside a colored badge. */
    icon?: ReactNode;
    /** Bold title text shown at the top of the card. */
    title?: ReactNode;
    /** Muted supporting text under the title. */
    description?: ReactNode;
    /** Optional footer content pinned to the bottom (e.g. metadata, actions). */
    footer?: ReactNode;
    /**
     * Background flourish rendered behind the content (e.g. a chart, gradient,
     * SVG, or image). Positioned absolute and pointer-events-none by default
     * so it never blocks card interactions.
     */
    background?: ReactNode;
    /** Free-form content rendered between the header and footer. */
    children?: ReactNode;
    /**
     * When `true`, the item is rendered as a semantic `<a>` tag (default when
     * `href` is provided) with a full-card hit target. Automatically enables
     * the `interactive` styling.
     */
    href?: string;
    /**
     * Override the rendered element. When `href` is provided this defaults to
     * `"a"`, otherwise `"div"`. Pass `"button"` if the whole card should act
     * as a button.
     */
    as?: ElementType;
    ref?: Ref<HTMLElement>;
  };

export type BentoGridItemProps = BentoGridItemBaseProps;

function BentoGridItem({
  className,
  variant,
  padding,
  colSpan,
  rowSpan,
  elevated,
  interactive,
  icon,
  title,
  description,
  footer,
  background,
  children,
  href,
  as,
  ref,
  ...props
}: BentoGridItemProps): ReactElement {
  const Comp: ElementType = as ?? (href ? "a" : "div");
  const isLink = Comp === "a";
  const isButton = Comp === "button";
  const isInteractive = Boolean(interactive) || isLink || isButton;

  const hasHeader = icon !== undefined || title !== undefined ||
    description !== undefined;

  const linkProps: Partial<ComponentProps<"a">> = isLink
    ? { href, "aria-label": typeof title === "string" ? title : undefined }
    : {};
  const buttonProps: Partial<ComponentProps<"button">> = isButton
    ? { type: "button" }
    : {};

  return (
    <Comp
      ref={ref as Ref<HTMLElement>}
      data-slot="bento-grid-item"
      data-variant={variant ?? "default"}
      data-col-span={colSpan ?? "1"}
      data-row-span={rowSpan ?? "1"}
      data-interactive={isInteractive || undefined}
      className={cn(
        bentoGridItemVariants({
          variant,
          padding,
          colSpan,
          rowSpan,
          elevated,
          interactive: isInteractive,
        }),
        className,
      )}
      {...linkProps}
      {...buttonProps}
      {...(props as HTMLAttributes<HTMLElement>)}
    >
      {background !== undefined ? (
        <div
          data-slot="bento-grid-item-background"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-0 overflow-hidden [&>*]:h-full [&>*]:w-full"
        >
          {background}
        </div>
      ) : null}

      <div
        data-slot="bento-grid-item-content"
        className="relative z-10 flex h-full min-h-0 min-w-0 flex-col gap-3"
      >
        {hasHeader ? (
          <div
            data-slot="bento-grid-item-header"
            className="flex flex-col gap-1"
          >
            {icon !== undefined ? (
              <div
                data-slot="bento-grid-item-icon"
                className="mb-2 inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary [&>svg]:size-5"
              >
                {icon}
              </div>
            ) : null}
            {title !== undefined ? (
              <div
                data-slot="bento-grid-item-title"
                className="text-base font-semibold leading-tight text-foreground"
              >
                {title}
              </div>
            ) : null}
            {description !== undefined ? (
              <div
                data-slot="bento-grid-item-description"
                className="text-sm text-muted-foreground"
              >
                {description}
              </div>
            ) : null}
          </div>
        ) : null}

        {children !== undefined ? (
          <div
            data-slot="bento-grid-item-body"
            className="min-h-0 min-w-0 flex-1"
          >
            {children}
          </div>
        ) : null}

        {footer !== undefined ? (
          <div
            data-slot="bento-grid-item-footer"
            className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground"
          >
            {footer}
          </div>
        ) : null}
      </div>
    </Comp>
  );
}
BentoGridItem.displayName = "BentoGridItem";

/* ================================================================== */
/* Exports                                                            */
/* ================================================================== */

export {
  BentoGrid,
  BentoGridItem,
  bentoGridVariants,
  bentoGridItemVariants,
};
