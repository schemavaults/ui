export const numberTickerVariantIds = [
  "default",
  "primary",
  "muted",
  "destructive",
  "warning",
  "success",
] as const satisfies readonly string[];
export type NumberTickerVariant = (typeof numberTickerVariantIds)[number];

export const numberTickerSizeIds = [
  "sm",
  "default",
  "lg",
  "xl",
  "2xl",
  "3xl",
] as const satisfies readonly string[];
export type NumberTickerSize = (typeof numberTickerSizeIds)[number];
