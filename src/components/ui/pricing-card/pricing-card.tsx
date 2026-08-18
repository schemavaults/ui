"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Check, Minus, X } from "lucide-react";
import type {
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

export const pricingCardVariantIds = [
  "default",
  "muted",
  "primary",
  "highlighted",
] as const satisfies string[];

export type PricingCardVariantId = (typeof pricingCardVariantIds)[number];

export const pricingCardSizeIds = ["sm", "md", "lg"] as const satisfies string[];

export type PricingCardSizeId = (typeof pricingCardSizeIds)[number];

const pricingCardVariants = cva(
  "relative flex w-full flex-col rounded-xl border text-card-foreground shadow-sm transition-colors",
  {
    variants: {
      variant: {
        default: "bg-card border-border",
        muted: "bg-muted/40 border-border",
        primary:
          "bg-primary/5 border-primary/30 dark:bg-primary/10",
        highlighted:
          "bg-card border-primary shadow-md ring-1 ring-primary/40 dark:ring-primary/60",
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
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        muted: "bg-background text-muted-foreground border border-border",
        primary: "bg-primary/10 text-primary dark:text-primary-foreground",
        highlighted: "bg-primary text-primary-foreground",
      } satisfies Record<PricingCardVariantId, string>,
    },
    defaultVariants: {
      variant: "highlighted",
    },
  },
);

export interface PricingCardBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pricingCardBadgeVariants> {
  /**
   * When true, the badge is absolutely positioned at the top of the card so
   * it visually floats above the border. Defaults to `true` for the common
   * "Most popular" ribbon pattern; set to `false` to render inline.
   */
  floating?: boolean;
  ref?: Ref<HTMLSpanElement>;
}

function PricingCardBadge({
  className,
  variant,
  floating = true,
  ref,
  ...props
}: PricingCardBadgeProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="pricing-card-badge"
      className={cn(
        pricingCardBadgeVariants({ variant }),
        floating &&
          "absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-sm",
        className,
      )}
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
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    />
  );
}
PricingCardHeader.displayName = "PricingCardHeader";

const pricingCardNameSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
} satisfies Record<PricingCardSizeId, string>;

export interface PricingCardNameProps
  extends HTMLAttributes<HTMLHeadingElement> {
  size?: PricingCardSizeId;
  ref?: Ref<HTMLHeadingElement>;
}

function PricingCardName({
  className,
  size = "md",
  children,
  ref,
  ...props
}: PricingCardNameProps): ReactElement {
  return (
    <h3
      ref={ref}
      data-slot="pricing-card-name"
      className={cn(
        "font-semibold text-foreground leading-tight tracking-tight",
        pricingCardNameSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
PricingCardName.displayName = "PricingCardName";

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
      className={cn("text-sm text-muted-foreground leading-snug", className)}
      {...props}
    />
  );
}
PricingCardDescription.displayName = "PricingCardDescription";

export interface PricingCardPriceProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PricingCardPrice({
  className,
  ref,
  ...props
}: PricingCardPriceProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="pricing-card-price"
      className={cn("flex items-baseline gap-1", className)}
      {...props}
    />
  );
}
PricingCardPrice.displayName = "PricingCardPrice";

const pricingCardAmountSizes = {
  sm: "text-3xl",
  md: "text-4xl",
  lg: "text-5xl",
} satisfies Record<PricingCardSizeId, string>;

export interface PricingCardAmountProps
  extends HTMLAttributes<HTMLSpanElement> {
  size?: PricingCardSizeId;
  /**
   * Optional currency symbol rendered before the amount at a smaller size,
   * e.g. "$". If provided alongside `children` it is placed as a leading
   * superscript-like glyph.
   */
  currency?: string;
  ref?: Ref<HTMLSpanElement>;
}

function PricingCardAmount({
  className,
  size = "md",
  currency,
  children,
  ref,
  ...props
}: PricingCardAmountProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="pricing-card-amount"
      className={cn(
        "font-bold tabular-nums leading-none tracking-tight text-foreground",
        pricingCardAmountSizes[size],
        className,
      )}
      {...props}
    >
      {currency ? (
        <span
          data-slot="pricing-card-currency"
          className="mr-0.5 text-[0.55em] font-semibold align-top text-muted-foreground"
        >
          {currency}
        </span>
      ) : null}
      {children}
    </span>
  );
}
PricingCardAmount.displayName = "PricingCardAmount";

export interface PricingCardPeriodProps
  extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
}

function PricingCardPeriod({
  className,
  ref,
  ...props
}: PricingCardPeriodProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="pricing-card-period"
      className={cn(
        "text-sm text-muted-foreground leading-none",
        className,
      )}
      {...props}
    />
  );
}
PricingCardPeriod.displayName = "PricingCardPeriod";

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
      className={cn("flex flex-col gap-2 text-sm", className)}
      {...props}
    />
  );
}
PricingCardFeatures.displayName = "PricingCardFeatures";

export const pricingCardFeatureStates = [
  "included",
  "excluded",
  "coming-soon",
] as const satisfies readonly string[];

export type PricingCardFeatureState =
  (typeof pricingCardFeatureStates)[number];

const featureIconMap: Record<PricingCardFeatureState, ReactElement> = {
  included: (
    <Check aria-hidden className="size-4 text-primary" strokeWidth={2.5} />
  ),
  excluded: (
    <X aria-hidden className="size-4 text-muted-foreground/60" strokeWidth={2} />
  ),
  "coming-soon": (
    <Minus
      aria-hidden
      className="size-4 text-muted-foreground/60"
      strokeWidth={2}
    />
  ),
};

const featureLabelClasses: Record<PricingCardFeatureState, string> = {
  included: "text-foreground",
  excluded: "text-muted-foreground/70 line-through",
  "coming-soon": "text-muted-foreground",
};

export interface PricingCardFeatureProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, "children"> {
  state?: PricingCardFeatureState;
  /**
   * Override the leading icon. Defaults to a check/x/minus based on `state`.
   */
  icon?: ReactNode;
  children: ReactNode;
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
  return (
    <li
      ref={ref}
      data-slot="pricing-card-feature"
      data-state={state}
      className={cn(
        "flex items-start gap-2 leading-snug",
        featureLabelClasses[state],
        className,
      )}
      {...props}
    >
      <span
        aria-hidden={icon ? undefined : true}
        className="mt-0.5 flex size-4 shrink-0 items-center justify-center"
      >
        {icon ?? featureIconMap[state]}
      </span>
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
      className={cn("mt-auto flex flex-col gap-2", className)}
      {...props}
    />
  );
}
PricingCardFooter.displayName = "PricingCardFooter";

export {
  PricingCard,
  PricingCardBadge,
  PricingCardHeader,
  PricingCardName,
  PricingCardDescription,
  PricingCardPrice,
  PricingCardAmount,
  PricingCardPeriod,
  PricingCardFeatures,
  PricingCardFeature,
  PricingCardFooter,
  pricingCardVariants,
  pricingCardBadgeVariants,
};
