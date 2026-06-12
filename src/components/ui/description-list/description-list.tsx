"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "../skeleton/skeleton";

export const descriptionListLayoutIds = [
  "stacked",
  "inline",
  "grid",
  "responsive",
] as const satisfies string[];

export type DescriptionListLayoutId = (typeof descriptionListLayoutIds)[number];

export const descriptionListSizeIds = ["sm", "md", "lg"] as const satisfies string[];

export type DescriptionListSizeId = (typeof descriptionListSizeIds)[number];

export const descriptionListVariantIds = [
  "default",
  "card",
  "muted",
] as const satisfies string[];

export type DescriptionListVariantId = (typeof descriptionListVariantIds)[number];

const descriptionListVariants = cva("w-full text-foreground", {
  variants: {
    variant: {
      default: "",
      card: "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
      muted: "rounded-lg bg-muted/40",
    } satisfies Record<DescriptionListVariantId, string>,
    size: {
      sm: "text-xs [&_dt]:text-xs [&_dd]:text-xs",
      md: "text-sm [&_dt]:text-sm [&_dd]:text-sm",
      lg: "text-base [&_dt]:text-base [&_dd]:text-base",
    } satisfies Record<DescriptionListSizeId, string>,
    padded: {
      true: "",
      false: "",
    },
    divided: {
      true: "[&>*+*]:border-t [&>*+*]:border-border",
      false: "",
    },
  },
  compoundVariants: [
    { variant: "card", padded: true, class: "px-4 py-2" },
    { variant: "muted", padded: true, class: "px-4 py-2" },
    { variant: "default", padded: true, class: "py-1" },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    padded: false,
    divided: false,
  },
});

export interface DescriptionListProps
  extends HTMLAttributes<HTMLDListElement>,
    Omit<VariantProps<typeof descriptionListVariants>, "padded" | "divided"> {
  /**
   * Controls how each term/details pair is laid out.
   * - `stacked`: dt above dd (default)
   * - `inline`: dt and dd on the same row
   * - `grid`: 1/3 + 2/3 grid columns on all sizes
   * - `responsive`: stacked on mobile, grid on `sm:` and up
   */
  layout?: DescriptionListLayoutId;
  /**
   * Adds horizontal padding so the list sits nicely inside `card`/`muted`
   * containers. Defaults to true when `variant` is `card` or `muted`.
   */
  padded?: boolean;
  /** Add a thin divider between consecutive items. */
  divided?: boolean;
  ref?: Ref<HTMLDListElement>;
}

function DescriptionList({
  className,
  variant = "default",
  size = "md",
  layout = "stacked",
  padded,
  divided = false,
  ref,
  ...props
}: DescriptionListProps): ReactElement {
  const resolvedPadded: boolean =
    padded ?? (variant === "card" || variant === "muted");
  return (
    <dl
      ref={ref}
      data-slot="description-list"
      data-layout={layout}
      data-variant={variant ?? "default"}
      className={cn(
        descriptionListVariants({
          variant,
          size,
          padded: resolvedPadded,
          divided,
        }),
        className,
      )}
      {...props}
    />
  );
}
DescriptionList.displayName = "DescriptionList";

const descriptionItemVariants = cva("", {
  variants: {
    layout: {
      stacked: "flex flex-col gap-1 py-2",
      inline: "flex flex-row items-baseline justify-between gap-4 py-2",
      grid: "grid grid-cols-3 gap-4 py-2",
      responsive: "flex flex-col gap-1 py-2 sm:grid sm:grid-cols-3 sm:gap-4",
    } satisfies Record<DescriptionListLayoutId, string>,
  },
  defaultVariants: {
    layout: "stacked",
  },
});

export interface DescriptionItemProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof descriptionItemVariants> {
  ref?: Ref<HTMLDivElement>;
}

function DescriptionItem({
  className,
  layout,
  ref,
  ...props
}: DescriptionItemProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="description-item"
      className={cn(descriptionItemVariants({ layout }), className)}
      {...props}
    />
  );
}
DescriptionItem.displayName = "DescriptionItem";

export interface DescriptionTermProps
  extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
}

function DescriptionTerm({
  className,
  ref,
  ...props
}: DescriptionTermProps): ReactElement {
  return (
    <dt
      ref={ref}
      data-slot="description-term"
      className={cn(
        "font-medium text-muted-foreground leading-snug",
        className,
      )}
      {...props}
    />
  );
}
DescriptionTerm.displayName = "DescriptionTerm";

export interface DescriptionDetailsProps
  extends HTMLAttributes<HTMLElement> {
  /**
   * When true, render a skeleton placeholder in place of the value. Useful for
   * async data fetches where the term is known but the value is still loading.
   */
  loading?: boolean;
  ref?: Ref<HTMLElement>;
}

function DescriptionDetails({
  className,
  loading = false,
  children,
  ref,
  ...props
}: DescriptionDetailsProps): ReactElement {
  return (
    <dd
      ref={ref}
      data-slot="description-details"
      className={cn(
        "text-foreground leading-snug sm:col-span-2",
        className,
      )}
      {...props}
    >
      {loading ? (
        <Skeleton
          data-slot="description-details-skeleton"
          className="h-4 w-32"
        />
      ) : (
        children
      )}
    </dd>
  );
}
DescriptionDetails.displayName = "DescriptionDetails";

export {
  DescriptionList,
  DescriptionItem,
  DescriptionTerm,
  DescriptionDetails,
  descriptionListVariants,
  descriptionItemVariants,
};
