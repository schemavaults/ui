"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Check, Minus, X } from "lucide-react";
import type {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

export const pricingCardVariantIds = [
  "default",
  "featured",
  "muted",
  "outline",
] as const satisfies readonly string[];
export type PricingCardVariantId = (typeof pricingCardVariantIds)[number];

export const pricingCardSizeIds = ["sm", "md", "lg"] as const satisfies readonly string[];
export type PricingCardSizeId = (typeof pricingCardSizeIds)[number];

const pricingCardVariants = cva(
  "relative flex w-full flex-col rounded-xl border shadow-sm transition-colors",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        featured:
          "bg-card text-card-foreground border-primary ring-2 ring-primary/40 shadow-md",
        muted: "bg-muted/40 text-foreground border-border",
        outline: "bg-transparent text-foreground border-border",
      } satisfies Record<PricingCardVariantId, string>,
      size: {
        sm: "gap-3 p-4",
        md: "gap-4 p-6",
        lg: "gap-5 p-8",
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
      data-size={size ?? "md"}
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
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
PricingCardDescription.displayName = "PricingCardDescription";

export const pricingCardBadgeIntents = [
  "primary",
  "secondary",
  "success",
  "warning",
  "destructive",
] as const satisfies readonly string[];
export type PricingCardBadgeIntent = (typeof pricingCardBadgeIntents)[number];

const pricingCardBadgeVariants = cva(
  "absolute -top-3 right-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold leading-none shadow-sm",
  {
    variants: {
      intent: {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-green-500 text-white",
        warning: "bg-warning text-warning-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      } satisfies Record<PricingCardBadgeIntent, string>,
    },
    defaultVariants: {
      intent: "primary",
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
  intent,
  ref,
  ...props
}: PricingCardBadgeProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="pricing-card-badge"
      className={cn(pricingCardBadgeVariants({ intent }), className)}
      {...props}
    />
  );
}
PricingCardBadge.displayName = "PricingCardBadge";

const pricingCardPriceSizes = {
  sm: { amount: "text-2xl", currency: "text-base", period: "text-xs" },
  md: { amount: "text-4xl", currency: "text-lg", period: "text-sm" },
  lg: { amount: "text-5xl", currency: "text-xl", period: "text-sm" },
} satisfies Record<
  PricingCardSizeId,
  { amount: string; currency: string; period: string }
>;

export interface PricingCardPriceProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Currency symbol shown before the amount (e.g. "$", "€"). Optional. */
  currency?: ReactNode;
  /** The price amount itself (e.g. "29", "Free", "Custom"). */
  amount: ReactNode;
  /** Billing period suffix (e.g. "/month", "per seat"). Optional. */
  period?: ReactNode;
  /** Optional original/strikethrough price for showing discounts. */
  originalAmount?: ReactNode;
  size?: PricingCardSizeId;
  ref?: Ref<HTMLDivElement>;
}

function PricingCardPrice({
  className,
  currency,
  amount,
  period,
  originalAmount,
  size = "md",
  ref,
  ...props
}: PricingCardPriceProps): ReactElement {
  const sizing = pricingCardPriceSizes[size];
  return (
    <div
      ref={ref}
      data-slot="pricing-card-price"
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    >
      <div className="flex items-baseline gap-1 text-foreground">
        {currency !== undefined && currency !== null ? (
          <span
            data-slot="pricing-card-price-currency"
            className={cn("font-medium leading-none", sizing.currency)}
          >
            {currency}
          </span>
        ) : null}
        <span
          data-slot="pricing-card-price-amount"
          className={cn(
            "font-bold tabular-nums leading-none tracking-tight",
            sizing.amount,
          )}
        >
          {amount}
        </span>
        {period !== undefined && period !== null ? (
          <span
            data-slot="pricing-card-price-period"
            className={cn(
              "font-medium leading-none text-muted-foreground",
              sizing.period,
            )}
          >
            {period}
          </span>
        ) : null}
      </div>
      {originalAmount !== undefined && originalAmount !== null ? (
        <div
          data-slot="pricing-card-price-original"
          className={cn(
            "text-muted-foreground line-through tabular-nums",
            sizing.period,
          )}
        >
          {originalAmount}
        </div>
      ) : null}
    </div>
  );
}
PricingCardPrice.displayName = "PricingCardPrice";

export interface PricingCardFeaturesProps extends HTMLAttributes<HTMLUListElement> {
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
      className={cn("flex flex-col gap-2 text-sm", className)}
      {...props}
    />
  );
}
PricingCardFeatures.displayName = "PricingCardFeatures";

export const pricingCardFeatureStates = [
  "included",
  "excluded",
  "limited",
] as const satisfies readonly string[];
export type PricingCardFeatureState = (typeof pricingCardFeatureStates)[number];

const featureIconClasses = {
  included: "text-primary",
  excluded: "text-muted-foreground/60",
  limited: "text-muted-foreground",
} satisfies Record<PricingCardFeatureState, string>;

const featureTextClasses = {
  included: "text-foreground",
  excluded: "text-muted-foreground/70 line-through",
  limited: "text-foreground",
} satisfies Record<PricingCardFeatureState, string>;

function defaultFeatureIcon(state: PricingCardFeatureState): ReactNode {
  if (state === "excluded") {
    return <X aria-hidden="true" className="size-4" />;
  }
  if (state === "limited") {
    return <Minus aria-hidden="true" className="size-4" />;
  }
  return <Check aria-hidden="true" className="size-4" />;
}

export interface PricingCardFeatureProps extends HTMLAttributes<HTMLLIElement> {
  /** Whether the feature is included, excluded, or partial in this tier. */
  state?: PricingCardFeatureState;
  /** Override the default icon for the state. Pass `null` to hide. */
  icon?: ReactNode | null;
  ref?: Ref<HTMLLIElement>;
}

function PricingCardFeature({
  className,
  state = "included",
  icon,
  children,
  ref,
  ...props
}: PricingCardFeatureProps): ReactElement {
  const resolvedIcon = icon === null ? null : (icon ?? defaultFeatureIcon(state));

  return (
    <li
      ref={ref}
      data-slot="pricing-card-feature"
      data-state={state}
      className={cn(
        "flex items-start gap-2 leading-snug",
        featureTextClasses[state],
        className,
      )}
      {...props}
    >
      {resolvedIcon !== null ? (
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex shrink-0 items-center justify-center",
            featureIconClasses[state],
          )}
        >
          {resolvedIcon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">{children}</span>
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
      className={cn("mt-auto flex flex-col gap-2 pt-2", className)}
      {...props}
    />
  );
}
PricingCardFooter.displayName = "PricingCardFooter";

export {
  PricingCard,
  PricingCardHeader,
  PricingCardTitle,
  PricingCardDescription,
  PricingCardBadge,
  PricingCardPrice,
  PricingCardFeatures,
  PricingCardFeature,
  PricingCardFooter,
  pricingCardVariants,
  pricingCardBadgeVariants,
};
