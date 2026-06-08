export const markVariantIds = [
  "default",
  "primary",
  "secondary",
  "info",
  "success",
  "warning",
  "destructive",
  "accent",
] as const satisfies readonly string[];
export type MarkVariant = (typeof markVariantIds)[number];

export const markStyleIds = [
  "solid",
  "soft",
  "underline",
  "outline",
] as const satisfies readonly string[];
export type MarkStyle = (typeof markStyleIds)[number];

export const markSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type MarkSize = (typeof markSizeIds)[number];
