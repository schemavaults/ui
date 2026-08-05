export const priceTagVariantIds = [
  "default",
  "muted",
  "primary",
  "success",
  "destructive",
  "outline",
] as const satisfies readonly string[];
export type PriceTagVariantId = (typeof priceTagVariantIds)[number];

export const priceTagSizeIds = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies readonly string[];
export type PriceTagSizeId = (typeof priceTagSizeIds)[number];

export const priceTagAlignmentIds = [
  "start",
  "center",
  "end",
] as const satisfies readonly string[];
export type PriceTagAlignmentId = (typeof priceTagAlignmentIds)[number];

export const priceTagCurrencyPositionIds = [
  "leading",
  "trailing",
] as const satisfies readonly string[];
export type PriceTagCurrencyPositionId =
  (typeof priceTagCurrencyPositionIds)[number];
