"use client";

import type {
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { Check, Minus, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const pricingCardVariantIds = [
  "default",
  "featured",
  "muted",
] as const satisfies readonly string[];

export type PricingCardVariantId = (typeof pricingCardVariantIds)[number];

export const pricingCardSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];

export type PricingCardSizeId = (typeof pricingCardSizeIds)[number];

const pricingCardVariants = cva(
  "relative flex w-full flex-col rounded-xl border shadow-sm transition-colors",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        featured:
          "bg-card text-card-foreground border-primary/60 shadow-md ring-1 ring-primary/40 dark:border-primary/50",
        muted: "bg-muted/40 text-foreground border-border",
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
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof pricingCardVariants> {
  /**
   * Render as `<article>` (default) so a pricing grid remains semantic.
   * Consumers can override the element via `asChild`-style composition
   * by using the `data-slot="pricing-card"` selector.
   */
  ref?: Ref<HTMLElement>;
}

function PricingCard({
  className,
  variant,
  size,
  ref,
  ...props
}: PricingCardProps): ReactElement {
  return (
    <article
      ref={ref}
      data-slot="pricing-card"
      data-variant={variant ?? "default"}
      className={cn(pricingCardVariants({ variant, size }), className)}
      {...props}
    />
  );
}
PricingCard.displayName = "PricingCard";

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
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}
PricingCardHeader.displayName = "PricingCardHeader";

const pricingCardBadgeVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        muted: "bg-muted text-muted-foreground",
        outline: "border border-primary/40 text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
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
  children,
  ref,
  ...props
}: PricingCardTitleProps): ReactElement {
  return (
    <h3
      ref={ref}
      data-slot="pricing-card-title"
      className={cn(
        "font-semibold leading-none tracking-tight text-foreground",
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
      className={cn("text-sm leading-snug text-muted-foreground", className)}
      {...props}
    />
  );
}
PricingCardDescription.displayName = "PricingCardDescription";

const pricingCardAmountSizes = {
  sm: "text-3xl",
  md: "text-4xl",
  lg: "text-5xl",
} satisfies Record<PricingCardSizeId, string>;

export interface PricingCardPriceProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Numeric or pre-formatted amount to display (e.g. `"29"`, `"1,299"`,
   * `"Custom"`). When passing a number the caller is responsible for
   * locale formatting.
   */
  amount: ReactNode;
  /**
   * Optional currency prefix, e.g. `"$"`, `"€"`, or `"USD "`.
   */
  currency?: ReactNode;
  /**
   * Optional billing period label rendered after the amount, e.g.
   * `"/ month"`, `"per seat / month"`, or `"billed annually"`.
   */
  period?: ReactNode;
  /**
   * Optional strikethrough amount for showing a discount from a previous
   * or list price. Rendered before the current amount.
   */
  originalAmount?: ReactNode;
  size?: PricingCardSizeId;
  ref?: Ref<HTMLDivElement>;
}

function PricingCardPrice({
  className,
  amount,
  currency,
  period,
  originalAmount,
  size = "md",
  ref,
  ...props
}: PricingCardPriceProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="pricing-card-price"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      <div className="flex items-baseline gap-1.5">
        {originalAmount != null ? (
          <span
            data-slot="pricing-card-price-original"
            className="text-base font-medium text-muted-foreground line-through tabular-nums"
          >
            {currency}
            {originalAmount}
          </span>
        ) : null}
        {currency != null ? (
          <span
            data-slot="pricing-card-price-currency"
            className="text-lg font-semibold text-foreground tabular-nums"
          >
            {currency}
          </span>
        ) : null}
        <span
          data-slot="pricing-card-price-amount"
          className={cn(
            "font-bold leading-none tracking-tight text-foreground tabular-nums",
            pricingCardAmountSizes[size],
          )}
        >
          {amount}
        </span>
        {period != null ? (
          <span
            data-slot="pricing-card-price-period"
            className="text-sm font-medium text-muted-foreground"
          >
            {period}
          </span>
        ) : null}
      </div>
    </div>
  );
}
PricingCardPrice.displayName = "PricingCardPrice";

export interface PricingCardFeaturesProps
  extends OlHTMLAttributes<HTMLUListElement> {
  ref?: Ref<HTMLUListElement>;
}

function PricingCardFeatures({
  className,
  ref,
  ...props
}: PricingCardFeaturesProps): ReactElement {
  return (
    <ul
      ref={ref}
      data-slot="pricing-card-features"
      className={cn("flex flex-col gap-2.5 text-sm text-foreground", className)}
      {...props}
    />
  );
}
PricingCardFeatures.displayName = "PricingCardFeatures";

export const pricingCardFeatureStatusIds = [
  "included",
  "excluded",
  "coming-soon",
] as const satisfies readonly string[];

export type PricingCardFeatureStatusId =
  (typeof pricingCardFeatureStatusIds)[number];

const featureIconClasses = {
  included: "text-primary",
  excluded: "text-muted-foreground/70",
  "coming-soon": "text-muted-foreground",
} satisfies Record<PricingCardFeatureStatusId, string>;

const featureTextClasses = {
  included: "text-foreground",
  excluded: "text-muted-foreground line-through decoration-muted-foreground/40",
  "coming-soon": "text-muted-foreground",
} satisfies Record<PricingCardFeatureStatusId, string>;

function DefaultFeatureIcon({
  status,
}: {
  status: PricingCardFeatureStatusId;
}): ReactElement {
  if (status === "excluded") {
    return <X aria-hidden="true" className="size-4" />;
  }
  if (status === "coming-soon") {
    return <Minus aria-hidden="true" className="size-4" />;
  }
  return <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />;
}

export interface PricingCardFeatureProps
  extends LiHTMLAttributes<HTMLLIElement> {
  status?: PricingCardFeatureStatusId;
  /**
   * Override the leading icon. When omitted, a check / dash / x mark is
   * rendered based on `status`.
   */
  icon?: ReactNode;
  /**
   * Hide the leading icon entirely (e.g. when rendering a section header
   * inside the features list).
   */
  hideIcon?: boolean;
  ref?: Ref<HTMLLIElement>;
}

function PricingCardFeature({
  className,
  status = "included",
  icon,
  hideIcon = false,
  children,
  ref,
  ...props
}: PricingCardFeatureProps): ReactElement {
  return (
    <li
      ref={ref}
      data-slot="pricing-card-feature"
      data-status={status}
      className={cn("flex items-start gap-2 leading-snug", className)}
      {...props}
    >
      {hideIcon ? null : (
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 inline-flex shrink-0 items-center justify-center",
            featureIconClasses[status],
          )}
        >
          {icon ?? <DefaultFeatureIcon status={status} />}
        </span>
      )}
      <span className={cn("min-w-0", featureTextClasses[status])}>
        {children}
      </span>
    </li>
  );
}
PricingCardFeature.displayName = "PricingCardFeature";

export interface PricingCardSeparatorProps
  extends HTMLAttributes<HTMLHRElement> {
  ref?: Ref<HTMLHRElement>;
}

function PricingCardSeparator({
  className,
  ref,
  ...props
}: PricingCardSeparatorProps): ReactElement {
  return (
    <hr
      ref={ref}
      data-slot="pricing-card-separator"
      className={cn("border-t border-border", className)}
      {...props}
    />
  );
}
PricingCardSeparator.displayName = "PricingCardSeparator";

export interface PricingCardFooterProps
  extends HTMLAttributes<HTMLDivElement> {
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

export {
  PricingCard,
  PricingCardHeader,
  PricingCardBadge,
  PricingCardTitle,
  PricingCardDescription,
  PricingCardPrice,
  PricingCardFeatures,
  PricingCardFeature,
  PricingCardSeparator,
  PricingCardFooter,
  pricingCardVariants,
  pricingCardBadgeVariants,
};
