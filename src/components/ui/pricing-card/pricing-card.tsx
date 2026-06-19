"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  OlHTMLAttributes,
  LiHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

export const pricingCardVariantIds = [
  "default",
  "muted",
  "featured",
  "primary",
] as const satisfies string[];

export type PricingCardVariantId = (typeof pricingCardVariantIds)[number];

export const pricingCardSizeIds = ["sm", "md", "lg"] as const satisfies string[];

export type PricingCardSizeId = (typeof pricingCardSizeIds)[number];

const pricingCardVariants = cva(
  "relative flex w-full flex-col rounded-xl border shadow-sm transition-colors",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        muted: "bg-muted/40 text-foreground border-border",
        featured:
          "bg-card text-card-foreground border-primary shadow-md ring-1 ring-primary/30",
        primary:
          "bg-primary text-primary-foreground border-primary shadow-md",
      } satisfies Record<PricingCardVariantId, string>,
      size: {
        sm: "gap-4 p-5",
        md: "gap-5 p-6",
        lg: "gap-6 p-8",
      } satisfies Record<PricingCardSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface PricingCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pricingCardVariants> {
  ref?: Ref<HTMLDivElement>;
}

function PricingCard({
  className,
  variant,
  size,
  ref,
  ...props
}: PricingCardProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="pricing-card"
      data-variant={variant ?? "default"}
      className={cn(pricingCardVariants({ variant, size }), className)}
      {...props}
    />
  );
}
PricingCard.displayName = "PricingCard";

const pricingCardBadgeVariants = cva(
  "absolute -top-3 right-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        muted: "bg-muted text-muted-foreground",
        featured: "bg-primary text-primary-foreground",
        primary: "bg-primary-foreground text-primary",
      } satisfies Record<PricingCardVariantId, string>,
    },
    defaultVariants: {
      variant: "featured",
    },
  },
);

export interface PricingCardBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pricingCardBadgeVariants> {
  ref?: Ref<HTMLSpanElement>;
}

function PricingCardBadge({
  className,
  variant,
  ref,
  ...props
}: PricingCardBadgeProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="pricing-card-badge"
      className={cn(pricingCardBadgeVariants({ variant }), className)}
      {...props}
    />
  );
}
PricingCardBadge.displayName = "PricingCardBadge";

export interface PricingCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PricingCardHeader({
  className,
  ref,
  ...props
}: PricingCardHeaderProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="pricing-card-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}
PricingCardHeader.displayName = "PricingCardHeader";

const pricingCardTitleSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
} satisfies Record<PricingCardSizeId, string>;

export interface PricingCardTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  size?: PricingCardSizeId;
  ref?: Ref<HTMLHeadingElement>;
}

function PricingCardTitle({
  className,
  size = "md",
  ref,
  children,
  ...props
}: PricingCardTitleProps): ReactElement {
  return (
    <h3
      ref={ref}
      data-slot="pricing-card-title"
      className={cn(
        "font-semibold leading-tight tracking-tight",
        pricingCardTitleSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
PricingCardTitle.displayName = "PricingCardTitle";

export interface PricingCardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
}

function PricingCardDescription({
  className,
  ref,
  ...props
}: PricingCardDescriptionProps): ReactElement {
  return (
    <p
      ref={ref}
      data-slot="pricing-card-description"
      className={cn(
        "text-sm leading-snug text-muted-foreground [[data-variant=primary]_&]:text-primary-foreground/80",
        className,
      )}
      {...props}
    />
  );
}
PricingCardDescription.displayName = "PricingCardDescription";

const pricingCardPriceAmountSizes = {
  sm: "text-3xl",
  md: "text-4xl",
  lg: "text-5xl",
} satisfies Record<PricingCardSizeId, string>;

const pricingCardPriceCurrencySizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
} satisfies Record<PricingCardSizeId, string>;

const pricingCardPricePeriodSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
} satisfies Record<PricingCardSizeId, string>;

export interface PricingCardPriceProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The numeric price (e.g. `29`) or any string (e.g. `"Custom"`, `"Free"`).
   * Numbers are rendered with `Intl.NumberFormat` localisation. Strings render
   * verbatim.
   */
  amount: number | string;
  /**
   * Currency symbol (e.g. `"$"`, `"€"`). Omit if `amount` is non-numeric.
   */
  currency?: string;
  /**
   * Trailing period text (e.g. `"/month"`, `"/user/mo"`).
   */
  period?: string;
  /**
   * Strikethrough price displayed before the main amount (e.g. previous price).
   */
  originalAmount?: number | string;
  /**
   * Locale used for number formatting. Defaults to the runtime's default.
   */
  locale?: string;
  size?: PricingCardSizeId;
  ref?: Ref<HTMLDivElement>;
}

function formatPriceValue(
  value: number | string,
  locale?: string,
): string {
  if (typeof value === "number") {
    return new Intl.NumberFormat(locale).format(value);
  }
  return value;
}

function PricingCardPrice({
  className,
  amount,
  currency,
  period,
  originalAmount,
  locale,
  size = "md",
  ref,
  ...props
}: PricingCardPriceProps): ReactElement {
  const isNumeric = typeof amount === "number";
  return (
    <div
      ref={ref}
      data-slot="pricing-card-price"
      className={cn("flex items-baseline gap-1.5 flex-wrap", className)}
      {...props}
    >
      {originalAmount !== undefined ? (
        <span
          data-slot="pricing-card-price-original"
          className={cn(
            "text-muted-foreground line-through tabular-nums [[data-variant=primary]_&]:text-primary-foreground/60",
            pricingCardPricePeriodSizes[size],
          )}
        >
          {currency}
          {formatPriceValue(originalAmount, locale)}
        </span>
      ) : null}
      {isNumeric && currency ? (
        <span
          data-slot="pricing-card-price-currency"
          className={cn(
            "font-semibold leading-none text-muted-foreground [[data-variant=primary]_&]:text-primary-foreground/80",
            pricingCardPriceCurrencySizes[size],
          )}
        >
          {currency}
        </span>
      ) : null}
      <span
        data-slot="pricing-card-price-amount"
        className={cn(
          "font-bold tabular-nums leading-none tracking-tight",
          pricingCardPriceAmountSizes[size],
        )}
      >
        {formatPriceValue(amount, locale)}
      </span>
      {period ? (
        <span
          data-slot="pricing-card-price-period"
          className={cn(
            "font-medium text-muted-foreground [[data-variant=primary]_&]:text-primary-foreground/80",
            pricingCardPricePeriodSizes[size],
          )}
        >
          {period}
        </span>
      ) : null}
    </div>
  );
}
PricingCardPrice.displayName = "PricingCardPrice";

export interface PricingCardFeatureListProps
  extends OlHTMLAttributes<HTMLUListElement> {
  ref?: Ref<HTMLUListElement>;
}

function PricingCardFeatureList({
  className,
  ref,
  ...props
}: PricingCardFeatureListProps): ReactElement {
  return (
    <ul
      ref={ref}
      data-slot="pricing-card-feature-list"
      className={cn("flex flex-col gap-2.5 text-sm", className)}
      {...props}
    />
  );
}
PricingCardFeatureList.displayName = "PricingCardFeatureList";

function CheckIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon(): ReactElement {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface PricingCardFeatureProps
  extends LiHTMLAttributes<HTMLLIElement> {
  /**
   * Whether the feature is included in this tier. When `false`, the row is
   * rendered with a strike-through style and a cross icon to indicate the
   * feature is unavailable. Defaults to `true`.
   */
  included?: boolean;
  /**
   * Override the icon. When omitted, a check (included) or cross (excluded)
   * icon is rendered.
   */
  icon?: ReactNode;
  ref?: Ref<HTMLLIElement>;
}

function PricingCardFeature({
  className,
  included = true,
  icon,
  children,
  ref,
  ...props
}: PricingCardFeatureProps): ReactElement {
  return (
    <li
      ref={ref}
      data-slot="pricing-card-feature"
      data-included={included ? "true" : "false"}
      className={cn(
        "flex items-start gap-2 leading-snug",
        included
          ? "text-foreground [[data-variant=primary]_&]:text-primary-foreground"
          : "text-muted-foreground line-through [[data-variant=primary]_&]:text-primary-foreground/60",
        className,
      )}
      {...props}
    >
      <span
        data-slot="pricing-card-feature-icon"
        aria-hidden="true"
        className={cn(
          "mt-0.5 inline-flex shrink-0",
          included
            ? "text-primary [[data-variant=primary]_&]:text-primary-foreground"
            : "text-muted-foreground [[data-variant=primary]_&]:text-primary-foreground/50",
        )}
      >
        {icon ?? (included ? <CheckIcon /> : <CrossIcon />)}
      </span>
      <span>{children}</span>
    </li>
  );
}
PricingCardFeature.displayName = "PricingCardFeature";

export interface PricingCardFooterProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PricingCardFooter({
  className,
  ref,
  ...props
}: PricingCardFooterProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="pricing-card-footer"
      className={cn("mt-auto flex flex-col gap-2", className)}
      {...props}
    />
  );
}
PricingCardFooter.displayName = "PricingCardFooter";

export interface PricingCardSeparatorProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PricingCardSeparator({
  className,
  ref,
  ...props
}: PricingCardSeparatorProps): ReactElement {
  return (
    <div
      ref={ref}
      role="separator"
      data-slot="pricing-card-separator"
      className={cn(
        "h-px w-full bg-border [[data-variant=primary]_&]:bg-primary-foreground/20",
        className,
      )}
      {...props}
    />
  );
}
PricingCardSeparator.displayName = "PricingCardSeparator";

export {
  PricingCard,
  PricingCardBadge,
  PricingCardHeader,
  PricingCardTitle,
  PricingCardDescription,
  PricingCardPrice,
  PricingCardFeatureList,
  PricingCardFeature,
  PricingCardFooter,
  PricingCardSeparator,
  pricingCardVariants,
  pricingCardBadgeVariants,
};
