"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "../skeleton/skeleton";

export const priceTagVariantIds = [
  "default",
  "primary",
  "muted",
  "featured",
  "destructive",
] as const satisfies string[];
export type PriceTagVariantId = (typeof priceTagVariantIds)[number];

export const priceTagSizeIds = [
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies string[];
export type PriceTagSizeId = (typeof priceTagSizeIds)[number];

export const priceTagAlignmentIds = [
  "start",
  "center",
  "end",
] as const satisfies string[];
export type PriceTagAlignmentId = (typeof priceTagAlignmentIds)[number];

const priceTagVariants = cva(
  "inline-flex w-fit flex-col gap-1 tabular-nums",
  {
    variants: {
      variant: {
        default: "text-foreground",
        primary: "text-primary",
        muted: "text-muted-foreground",
        featured:
          "text-foreground [--price-tag-accent:hsl(var(--primary))]",
        destructive: "text-destructive",
      } satisfies Record<PriceTagVariantId, string>,
      alignment: {
        start: "items-start text-start",
        center: "items-center text-center",
        end: "items-end text-end",
      } satisfies Record<PriceTagAlignmentId, string>,
    },
    defaultVariants: {
      variant: "default",
      alignment: "start",
    },
  },
);

export interface PriceTagProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof priceTagVariants> {
  ref?: Ref<HTMLDivElement>;
}

function PriceTag({
  className,
  variant,
  alignment,
  ref,
  ...props
}: PriceTagProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="price-tag"
      data-variant={variant ?? "default"}
      className={cn(priceTagVariants({ variant, alignment }), className)}
      {...props}
    />
  );
}
PriceTag.displayName = "PriceTag";

const priceTagAmountRowVariants = cva(
  "inline-flex items-baseline gap-0.5 font-semibold leading-none tracking-tight",
  {
    variants: {
      size: {
        sm: "text-xl",
        md: "text-3xl",
        lg: "text-4xl",
        xl: "text-5xl",
      } satisfies Record<PriceTagSizeId, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface PriceTagAmountRowProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof priceTagAmountRowVariants> {
  ref?: Ref<HTMLDivElement>;
}

function PriceTagAmountRow({
  className,
  size,
  ref,
  ...props
}: PriceTagAmountRowProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="price-tag-amount-row"
      className={cn(priceTagAmountRowVariants({ size }), className)}
      {...props}
    />
  );
}
PriceTagAmountRow.displayName = "PriceTagAmountRow";

const priceTagCurrencySizes = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
} satisfies Record<PriceTagSizeId, string>;

export interface PriceTagCurrencyProps
  extends HTMLAttributes<HTMLSpanElement> {
  size?: PriceTagSizeId;
  ref?: Ref<HTMLSpanElement>;
}

function PriceTagCurrency({
  className,
  size = "md",
  ref,
  ...props
}: PriceTagCurrencyProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="price-tag-currency"
      aria-hidden="true"
      className={cn(
        "self-start pt-0.5 font-medium leading-none",
        priceTagCurrencySizes[size],
        className,
      )}
      {...props}
    />
  );
}
PriceTagCurrency.displayName = "PriceTagCurrency";

export interface PriceTagAmountProps
  extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
}

function PriceTagAmount({
  className,
  ref,
  ...props
}: PriceTagAmountProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="price-tag-amount"
      className={cn("font-semibold leading-none", className)}
      {...props}
    />
  );
}
PriceTagAmount.displayName = "PriceTagAmount";

const priceTagFractionSizes = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
} satisfies Record<PriceTagSizeId, string>;

export interface PriceTagFractionProps
  extends HTMLAttributes<HTMLSpanElement> {
  size?: PriceTagSizeId;
  /**
   * Separator rendered before the fraction. Defaults to ".". Set to null to
   * omit when displaying a fraction like "99¢" without a leading dot.
   */
  separator?: string | null;
  ref?: Ref<HTMLSpanElement>;
}

function PriceTagFraction({
  className,
  size = "md",
  separator = ".",
  children,
  ref,
  ...props
}: PriceTagFractionProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="price-tag-fraction"
      className={cn(
        "font-semibold leading-none",
        priceTagFractionSizes[size],
        className,
      )}
      {...props}
    >
      {separator}
      {children}
    </span>
  );
}
PriceTagFraction.displayName = "PriceTagFraction";

const priceTagPeriodSizes = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-base",
} satisfies Record<PriceTagSizeId, string>;

export interface PriceTagPeriodProps
  extends HTMLAttributes<HTMLSpanElement> {
  size?: PriceTagSizeId;
  ref?: Ref<HTMLSpanElement>;
}

function PriceTagPeriod({
  className,
  size = "md",
  children,
  ref,
  ...props
}: PriceTagPeriodProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="price-tag-period"
      className={cn(
        "self-end pb-0.5 font-medium text-muted-foreground leading-none",
        priceTagPeriodSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
PriceTagPeriod.displayName = "PriceTagPeriod";

const priceTagOriginalSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
} satisfies Record<PriceTagSizeId, string>;

export interface PriceTagOriginalProps
  extends HTMLAttributes<HTMLSpanElement> {
  size?: PriceTagSizeId;
  ref?: Ref<HTMLSpanElement>;
}

function PriceTagOriginal({
  className,
  size = "md",
  ref,
  ...props
}: PriceTagOriginalProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="price-tag-original"
      className={cn(
        "font-medium text-muted-foreground line-through decoration-from-font",
        priceTagOriginalSizes[size],
        className,
      )}
      {...props}
    />
  );
}
PriceTagOriginal.displayName = "PriceTagOriginal";

export const priceTagDiscountIntents = [
  "positive",
  "primary",
  "warning",
  "destructive",
  "neutral",
] as const satisfies string[];
export type PriceTagDiscountIntent = (typeof priceTagDiscountIntents)[number];

const priceTagDiscountVariants = cva(
  "inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide tabular-nums",
  {
    variants: {
      intent: {
        positive:
          "bg-primary/15 text-primary dark:bg-primary/25 dark:text-primary-foreground",
        primary: "bg-primary text-primary-foreground",
        warning: "bg-warning/15 text-warning",
        destructive: "bg-destructive/15 text-destructive",
        neutral: "bg-muted text-muted-foreground",
      } satisfies Record<PriceTagDiscountIntent, string>,
    },
    defaultVariants: {
      intent: "positive",
    },
  },
);

export interface PriceTagDiscountProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof priceTagDiscountVariants> {
  ref?: Ref<HTMLSpanElement>;
}

function PriceTagDiscount({
  className,
  intent,
  ref,
  ...props
}: PriceTagDiscountProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="price-tag-discount"
      className={cn(priceTagDiscountVariants({ intent }), className)}
      {...props}
    />
  );
}
PriceTagDiscount.displayName = "PriceTagDiscount";

export interface PriceTagComparisonRowProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PriceTagComparisonRow({
  className,
  ref,
  ...props
}: PriceTagComparisonRowProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="price-tag-comparison-row"
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    />
  );
}
PriceTagComparisonRow.displayName = "PriceTagComparisonRow";

const priceTagCaptionSizes = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-sm",
} satisfies Record<PriceTagSizeId, string>;

export interface PriceTagCaptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  size?: PriceTagSizeId;
  ref?: Ref<HTMLParagraphElement>;
}

function PriceTagCaption({
  className,
  size = "md",
  ref,
  ...props
}: PriceTagCaptionProps): ReactElement {
  return (
    <p
      ref={ref}
      data-slot="price-tag-caption"
      className={cn(
        "font-normal text-muted-foreground leading-snug",
        priceTagCaptionSizes[size],
        className,
      )}
      {...props}
    />
  );
}
PriceTagCaption.displayName = "PriceTagCaption";

const priceTagSkeletonDimensions = {
  sm: { amount: "h-5 w-16", caption: "h-3 w-20" },
  md: { amount: "h-8 w-24", caption: "h-3 w-24" },
  lg: { amount: "h-10 w-28", caption: "h-4 w-28" },
  xl: { amount: "h-12 w-32", caption: "h-4 w-32" },
} satisfies Record<PriceTagSizeId, { amount: string; caption: string }>;

export interface PriceTagSkeletonProps
  extends HTMLAttributes<HTMLDivElement> {
  size?: PriceTagSizeId;
  /** Also render a caption placeholder under the amount. Defaults to true. */
  withCaption?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function PriceTagSkeleton({
  className,
  size = "md",
  withCaption = true,
  ref,
  ...props
}: PriceTagSkeletonProps): ReactElement {
  const dimensions = priceTagSkeletonDimensions[size];
  return (
    <div
      ref={ref}
      data-slot="price-tag-skeleton"
      aria-hidden="true"
      className={cn("inline-flex w-fit flex-col gap-2", className)}
      {...props}
    >
      <Skeleton className={dimensions.amount} />
      {withCaption ? <Skeleton className={dimensions.caption} /> : null}
    </div>
  );
}
PriceTagSkeleton.displayName = "PriceTagSkeleton";

export {
  PriceTag,
  PriceTagAmountRow,
  PriceTagCurrency,
  PriceTagAmount,
  PriceTagFraction,
  PriceTagPeriod,
  PriceTagOriginal,
  PriceTagDiscount,
  PriceTagComparisonRow,
  PriceTagCaption,
  PriceTagSkeleton,
  priceTagVariants,
  priceTagAmountRowVariants,
  priceTagDiscountVariants,
};
