"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactElement, ReactNode, Ref } from "react";

import { cn } from "@/lib/utils";

export const priceTagSizeIds = ["sm", "md", "lg", "xl"] as const satisfies string[];
export type PriceTagSize = (typeof priceTagSizeIds)[number];

export const priceTagVariantIds = [
  "default",
  "primary",
  "muted",
  "destructive",
  "success",
] as const satisfies string[];
export type PriceTagVariant = (typeof priceTagVariantIds)[number];

export const priceTagAlignIds = ["start", "center", "end"] as const satisfies string[];
export type PriceTagAlign = (typeof priceTagAlignIds)[number];

const priceTagVariants = cva(
  "inline-flex flex-col gap-0.5 leading-none",
  {
    variants: {
      align: {
        start: "items-start text-left",
        center: "items-center text-center",
        end: "items-end text-right",
      } satisfies Record<PriceTagAlign, string>,
    },
    defaultVariants: {
      align: "start",
    },
  },
);

const priceTagRowVariants = cva("inline-flex items-baseline gap-1 tabular-nums", {
  variants: {
    variant: {
      default: "text-foreground",
      primary: "text-primary",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
      success: "text-emerald-600 dark:text-emerald-400",
    } satisfies Record<PriceTagVariant, string>,
  },
  defaultVariants: {
    variant: "default",
  },
});

const priceTagAmountSizes = {
  sm: "text-lg font-semibold tracking-tight",
  md: "text-2xl font-semibold tracking-tight",
  lg: "text-3xl font-bold tracking-tight",
  xl: "text-5xl font-bold tracking-tight",
} satisfies Record<PriceTagSize, string>;

const priceTagCurrencySizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-xl",
} satisfies Record<PriceTagSize, string>;

const priceTagPeriodSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
  xl: "text-base",
} satisfies Record<PriceTagSize, string>;

const priceTagOriginalSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
} satisfies Record<PriceTagSize, string>;

function formatAmount(
  amount: number | string,
  locale: string | undefined,
  fractionDigits: number | undefined,
): string {
  if (typeof amount === "string") return amount;
  if (!Number.isFinite(amount)) return String(amount);
  if (fractionDigits != null) {
    return amount.toLocaleString(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  }
  return amount.toLocaleString(locale);
}

export interface PriceTagProps
  extends Omit<ComponentProps<"div">, "prefix">,
    VariantProps<typeof priceTagVariants> {
  /** The price value. Numbers are formatted with the supplied locale and fractionDigits. Strings render as-is. */
  amount: number | string;
  /** Currency symbol or short label rendered before the amount (e.g. "$", "€", "USD"). Defaults to "$". */
  currency?: ReactNode;
  /** Optional suffix rendered after the amount (e.g. "/month", " per seat"). */
  period?: ReactNode;
  /** Original price shown with a strikethrough — useful for discounts. */
  originalAmount?: number | string;
  /** Optional prefix label rendered above the amount (e.g. "from", "starting at"). */
  label?: ReactNode;
  /** Visual size of the price tag. */
  size?: PriceTagSize;
  /** Color variant — maps to theme tokens. */
  variant?: PriceTagVariant;
  /** Horizontal alignment of the contents. */
  align?: PriceTagAlign;
  /** Locale passed to `toLocaleString` when amount is a number. */
  locale?: string;
  /** Force a fixed number of fraction digits when amount is a number. */
  fractionDigits?: number;
  /** Hide the currency symbol entirely. */
  hideCurrency?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function PriceTag({
  className,
  amount,
  currency = "$",
  period,
  originalAmount,
  label,
  size = "md",
  variant = "default",
  align,
  locale,
  fractionDigits,
  hideCurrency = false,
  ref,
  ...props
}: PriceTagProps): ReactElement {
  const formattedAmount = formatAmount(amount, locale, fractionDigits);
  const formattedOriginal =
    originalAmount != null
      ? formatAmount(originalAmount, locale, fractionDigits)
      : null;

  return (
    <div
      ref={ref}
      data-slot="price-tag"
      data-size={size}
      data-variant={variant}
      className={cn(priceTagVariants({ align }), className)}
      {...props}
    >
      {label != null && (
        <span
          data-slot="price-tag-label"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          {label}
        </span>
      )}
      <span
        data-slot="price-tag-row"
        className={cn(priceTagRowVariants({ variant }))}
      >
        {!hideCurrency && (
          <span
            data-slot="price-tag-currency"
            aria-hidden="true"
            className={cn(
              "font-medium text-muted-foreground",
              priceTagCurrencySizes[size],
              variant === "primary" && "text-primary/70",
              variant === "destructive" && "text-destructive/70",
              variant === "success" && "text-emerald-600/70 dark:text-emerald-400/70",
            )}
          >
            {currency}
          </span>
        )}
        <span
          data-slot="price-tag-amount"
          className={cn(priceTagAmountSizes[size])}
        >
          {formattedAmount}
        </span>
        {period != null && (
          <span
            data-slot="price-tag-period"
            className={cn(
              "font-medium text-muted-foreground",
              priceTagPeriodSizes[size],
            )}
          >
            {period}
          </span>
        )}
      </span>
      {formattedOriginal != null && (
        <span
          data-slot="price-tag-original"
          className={cn(
            "font-medium text-muted-foreground line-through tabular-nums",
            priceTagOriginalSizes[size],
          )}
        >
          {!hideCurrency && (
            <span aria-hidden="true" className="mr-0.5">
              {currency}
            </span>
          )}
          {formattedOriginal}
        </span>
      )}
    </div>
  );
}
PriceTag.displayName = "PriceTag";

export { PriceTag, priceTagVariants };
export default PriceTag;
