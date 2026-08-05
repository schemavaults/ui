"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  useMemo,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";
import {
  type PriceTagAlignmentId,
  type PriceTagCurrencyPositionId,
  type PriceTagSizeId,
  type PriceTagVariantId,
  priceTagAlignmentIds,
  priceTagCurrencyPositionIds,
  priceTagSizeIds,
  priceTagVariantIds,
} from "./price-tag-variants";

const priceTagVariants = cva(
  "inline-flex tabular-nums leading-none",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        success:
          "text-primary [--price-tag-original:theme(colors.muted.foreground)]",
        destructive: "text-destructive",
        outline:
          "rounded-md border border-border bg-background px-2 py-1 text-foreground",
      } satisfies Record<PriceTagVariantId, string>,
      size: {
        xs: "gap-0.5 text-xs",
        sm: "gap-0.5 text-sm",
        md: "gap-1 text-base",
        lg: "gap-1.5 text-lg",
        xl: "gap-2 text-2xl",
      } satisfies Record<PriceTagSizeId, string>,
      alignment: {
        start: "items-start justify-start",
        center: "items-center justify-center",
        end: "items-end justify-end",
      } satisfies Record<PriceTagAlignmentId, string>,
      block: {
        true: "flex w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      alignment: "start",
      block: false,
    },
  },
);

const priceTagAmountSizes: Record<PriceTagSizeId, string> = {
  xs: "text-base font-semibold",
  sm: "text-lg font-semibold",
  md: "text-2xl font-semibold",
  lg: "text-3xl font-bold",
  xl: "text-5xl font-bold tracking-tight",
};

const priceTagCurrencySizes: Record<PriceTagSizeId, string> = {
  xs: "text-[10px] font-medium",
  sm: "text-xs font-medium",
  md: "text-sm font-semibold",
  lg: "text-base font-semibold",
  xl: "text-lg font-semibold",
};

const priceTagFractionSizes: Record<PriceTagSizeId, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-xl",
};

const priceTagPeriodSizes: Record<PriceTagSizeId, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

const priceTagOriginalSizes: Record<PriceTagSizeId, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

const priceTagPrefixSizes: Record<PriceTagSizeId, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-sm",
};

const priceTagDiscountSizes: Record<PriceTagSizeId, string> = {
  xs: "text-[10px] px-1 py-px",
  sm: "text-[10px] px-1 py-px",
  md: "text-xs px-1.5 py-0.5",
  lg: "text-xs px-1.5 py-0.5",
  xl: "text-sm px-2 py-0.5",
};

const currencySymbols: Record<string, string> = {
  USD: "$",
  CAD: "$",
  AUD: "$",
  NZD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  KRW: "₩",
  INR: "₹",
  BRL: "R$",
  MXN: "$",
  CHF: "CHF",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  RUB: "₽",
  TRY: "₺",
  ZAR: "R",
};

const zeroFractionCurrencies = new Set<string>([
  "JPY",
  "KRW",
  "VND",
  "IDR",
  "CLP",
  "PYG",
  "UGX",
  "RWF",
  "DJF",
  "KMF",
  "GNF",
  "BIF",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

export interface PriceTagFormattedAmount {
  integer: string;
  fraction?: string;
  symbol: string;
  isNegative: boolean;
}

interface FormatOptions {
  amount: number;
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

function defaultFractionDigits(currency: string): number {
  return zeroFractionCurrencies.has(currency.toUpperCase()) ? 0 : 2;
}

function resolveCurrencySymbol(
  currency: string,
  locale?: string,
): string {
  const upper = currency.toUpperCase();
  if (currencySymbols[upper]) return currencySymbols[upper];
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: upper,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    const symbolPart = parts.find((p) => p.type === "currency");
    if (symbolPart) return symbolPart.value;
  } catch {
    // Falls through to the raw code below.
  }
  return upper;
}

export function formatPriceParts({
  amount,
  currency = "USD",
  locale,
  minimumFractionDigits,
  maximumFractionDigits,
}: FormatOptions): PriceTagFormattedAmount {
  const upperCurrency = currency.toUpperCase();
  const fractionDigits =
    minimumFractionDigits ?? defaultFractionDigits(upperCurrency);
  const maxFraction = Math.max(
    fractionDigits,
    maximumFractionDigits ?? fractionDigits,
  );
  const isNegative = amount < 0;
  const absolute = Math.abs(amount);

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: maxFraction,
    useGrouping: true,
  });

  const parts = formatter.formatToParts(absolute);
  let integer = "";
  let fraction = "";
  let sawDecimal = false;
  for (const part of parts) {
    if (part.type === "decimal") {
      sawDecimal = true;
      continue;
    }
    if (sawDecimal) {
      if (part.type === "fraction") fraction = part.value;
    } else if (part.type === "integer" || part.type === "group") {
      integer += part.value;
    }
  }

  return {
    integer,
    fraction: fraction.length > 0 ? fraction : undefined,
    symbol: resolveCurrencySymbol(upperCurrency, locale),
    isNegative,
  };
}

function computeDiscountPercent(
  amount: number,
  originalAmount: number | undefined,
): number | undefined {
  if (originalAmount === undefined) return undefined;
  if (!Number.isFinite(originalAmount) || originalAmount <= 0) return undefined;
  if (amount >= originalAmount) return undefined;
  const percent = Math.round(((originalAmount - amount) / originalAmount) * 100);
  return percent > 0 ? percent : undefined;
}

export interface PriceTagProps
  extends Omit<ComponentProps<"div">, "children" | "prefix">,
    Pick<
      VariantProps<typeof priceTagVariants>,
      "variant" | "size" | "alignment" | "block"
    > {
  /**
   * The price amount as a raw number (e.g. `19.99`). Formatted using
   * `Intl.NumberFormat` with the resolved currency + locale.
   */
  amount: number;
  /**
   * ISO 4217 currency code (e.g. `USD`, `EUR`, `JPY`). Defaults to `USD`.
   * The narrow symbol (`$`, `€`, `¥`, ...) is used where possible.
   */
  currency?: string;
  /**
   * Locale used for number grouping / decimal separators. Defaults to the
   * browser locale (or `en-US` at build time).
   */
  locale?: string;
  /**
   * Where to render the currency symbol relative to the amount. Defaults to
   * `leading` (e.g. `$19.99`); `trailing` produces `19.99 €`.
   */
  currencyPosition?: PriceTagCurrencyPositionId;
  /**
   * Hide the currency symbol entirely (useful for tables where the column
   * header already communicates the currency).
   */
  hideCurrencySymbol?: boolean;
  /**
   * Prefix rendered before the price (e.g. `From`, `Starting at`).
   */
  prefix?: ReactNode;
  /**
   * Suffix rendered after the price. When `period` is provided, this replaces
   * the auto `/period` label.
   */
  suffix?: ReactNode;
  /**
   * Recurring billing period. Rendered as `/mo`, `/yr`, `/user`, etc. Ignored
   * when `suffix` is provided.
   */
  period?: string;
  /**
   * Original price for showing a strikethrough "was" price. If provided and
   * greater than `amount`, a compact discount badge (`-N%`) is also rendered
   * unless `hideDiscountBadge` is set.
   */
  originalAmount?: number;
  /**
   * Position of the strikethrough original price relative to the current
   * amount. Defaults to `before` (`~~$29.99~~ $19.99`).
   */
  originalPosition?: "before" | "after";
  /**
   * Hide the auto `-N%` discount badge even when `originalAmount` is set.
   */
  hideDiscountBadge?: boolean;
  /**
   * Explicit discount label. When set, overrides the auto-computed percent.
   */
  discountLabel?: ReactNode;
  /**
   * Whether to render the fractional part smaller and superscripted. Defaults
   * to `true` for the `lg` and `xl` sizes, `false` otherwise.
   */
  superscriptFraction?: boolean;
  /**
   * Force the number of decimal places. Defaults to `2` for most currencies
   * and `0` for zero-fraction currencies like JPY / KRW.
   */
  decimals?: number;
  /**
   * A11y label. When omitted, a sensible default like "USD 19.99 per month"
   * is generated for screen readers.
   */
  ariaLabel?: string;
}

function PriceTag({
  ref,
  amount,
  currency = "USD",
  locale,
  currencyPosition = "leading",
  hideCurrencySymbol = false,
  prefix,
  suffix,
  period,
  originalAmount,
  originalPosition = "before",
  hideDiscountBadge = false,
  discountLabel,
  superscriptFraction,
  decimals,
  ariaLabel,
  variant,
  size = "md",
  alignment,
  block,
  className,
  ...props
}: PriceTagProps): ReactElement {
  const resolvedSize: PriceTagSizeId = size ?? "md";
  const shouldSuperscript =
    superscriptFraction ?? (resolvedSize === "lg" || resolvedSize === "xl");

  const formatted = useMemo(
    () =>
      formatPriceParts({
        amount,
        currency,
        locale,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [amount, currency, locale, decimals],
  );
  const originalFormatted = useMemo(() => {
    if (originalAmount === undefined) return undefined;
    return formatPriceParts({
      amount: originalAmount,
      currency,
      locale,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }, [originalAmount, currency, locale, decimals]);

  const discountPercent = computeDiscountPercent(amount, originalAmount);
  const showDiscount =
    !hideDiscountBadge && (discountLabel !== undefined || discountPercent !== undefined);

  const amountNode = (
    <span
      data-slot="price-tag-amount"
      className={cn(
        "inline-flex items-baseline",
        priceTagAmountSizes[resolvedSize],
      )}
    >
      {formatted.isNegative ? (
        <span aria-hidden="true" className="mr-0.5">
          {"−"}
        </span>
      ) : null}
      {!hideCurrencySymbol && currencyPosition === "leading" ? (
        <span
          data-slot="price-tag-currency"
          aria-hidden="true"
          className={cn(
            "mr-0.5 self-start pt-[0.15em]",
            priceTagCurrencySizes[resolvedSize],
          )}
        >
          {formatted.symbol}
        </span>
      ) : null}
      <span data-slot="price-tag-integer">{formatted.integer}</span>
      {formatted.fraction ? (
        shouldSuperscript ? (
          <span
            data-slot="price-tag-fraction"
            className={cn(
              "ml-0.5 self-start pt-[0.15em]",
              priceTagFractionSizes[resolvedSize],
            )}
          >
            .{formatted.fraction}
          </span>
        ) : (
          <span data-slot="price-tag-fraction">.{formatted.fraction}</span>
        )
      ) : null}
      {!hideCurrencySymbol && currencyPosition === "trailing" ? (
        <span
          data-slot="price-tag-currency"
          aria-hidden="true"
          className={cn(
            "ml-1 self-end",
            priceTagCurrencySizes[resolvedSize],
          )}
        >
          {formatted.symbol}
        </span>
      ) : null}
    </span>
  );

  const originalNode = originalFormatted ? (
    <span
      data-slot="price-tag-original"
      aria-hidden="true"
      className={cn(
        "text-muted-foreground line-through decoration-current/70",
        priceTagOriginalSizes[resolvedSize],
      )}
    >
      {!hideCurrencySymbol && currencyPosition === "leading"
        ? originalFormatted.symbol
        : null}
      {originalFormatted.integer}
      {originalFormatted.fraction ? `.${originalFormatted.fraction}` : null}
      {!hideCurrencySymbol && currencyPosition === "trailing"
        ? ` ${originalFormatted.symbol}`
        : null}
    </span>
  ) : null;

  const discountNode = showDiscount ? (
    <span
      data-slot="price-tag-discount"
      className={cn(
        "inline-flex items-center rounded-md bg-primary/15 font-semibold text-primary",
        priceTagDiscountSizes[resolvedSize],
      )}
    >
      {discountLabel ?? `−${discountPercent}%`}
    </span>
  ) : null;

  const periodNode =
    suffix !== undefined ? (
      <span
        data-slot="price-tag-suffix"
        className={cn(
          "self-end pb-[0.15em] text-muted-foreground",
          priceTagPeriodSizes[resolvedSize],
        )}
      >
        {suffix}
      </span>
    ) : period ? (
      <span
        data-slot="price-tag-period"
        className={cn(
          "self-end pb-[0.15em] text-muted-foreground",
          priceTagPeriodSizes[resolvedSize],
        )}
      >
        /{period}
      </span>
    ) : null;

  const prefixNode =
    prefix !== undefined ? (
      <span
        data-slot="price-tag-prefix"
        className={cn(
          "self-start pt-[0.2em] uppercase tracking-wide text-muted-foreground",
          priceTagPrefixSizes[resolvedSize],
        )}
      >
        {prefix}
      </span>
    ) : null;

  const resolvedAriaLabel = ariaLabel ?? buildAriaLabel({
    amount,
    currency,
    period,
    prefix: typeof prefix === "string" ? prefix : undefined,
    originalAmount,
    discountPercent,
  });

  return (
    <div
      ref={ref}
      data-slot="price-tag"
      data-currency={currency.toUpperCase()}
      data-has-discount={showDiscount || undefined}
      role="group"
      aria-label={resolvedAriaLabel}
      className={cn(
        priceTagVariants({ variant, size: resolvedSize, alignment, block }),
        "items-baseline",
        className,
      )}
      {...props}
    >
      {prefixNode}
      {originalPosition === "before" ? originalNode : null}
      {amountNode}
      {originalPosition === "after" ? originalNode : null}
      {periodNode}
      {discountNode}
    </div>
  );
}
PriceTag.displayName = "PriceTag";

function buildAriaLabel({
  amount,
  currency,
  period,
  prefix,
  originalAmount,
  discountPercent,
}: {
  amount: number;
  currency: string;
  period: string | undefined;
  prefix: string | undefined;
  originalAmount: number | undefined;
  discountPercent: number | undefined;
}): string {
  const upper = currency.toUpperCase();
  const price = `${upper} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: defaultFractionDigits(upper),
    maximumFractionDigits: defaultFractionDigits(upper),
  })}`;
  const pieces: string[] = [];
  if (prefix) pieces.push(prefix);
  pieces.push(price);
  if (period) pieces.push(`per ${period}`);
  if (originalAmount !== undefined && originalAmount > amount) {
    pieces.push(
      `was ${upper} ${originalAmount.toLocaleString(undefined, {
        minimumFractionDigits: defaultFractionDigits(upper),
        maximumFractionDigits: defaultFractionDigits(upper),
      })}`,
    );
  }
  if (discountPercent !== undefined) {
    pieces.push(`${discountPercent}% off`);
  }
  return pieces.join(", ");
}

export {
  PriceTag,
  priceTagVariants,
  priceTagVariantIds,
  priceTagSizeIds,
  priceTagAlignmentIds,
  priceTagCurrencyPositionIds,
};
export type {
  PriceTagVariantId,
  PriceTagSizeId,
  PriceTagAlignmentId,
  PriceTagCurrencyPositionId,
};

export default PriceTag;
