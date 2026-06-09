export const relativeTimeVariantIds = [
  "default",
  "muted",
  "brand",
  "destructive",
  "warning",
] as const satisfies readonly string[];
export type RelativeTimeVariant = (typeof relativeTimeVariantIds)[number];

export const relativeTimeSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type RelativeTimeSize = (typeof relativeTimeSizeIds)[number];

export const relativeTimeFormatIds = [
  "long",
  "short",
  "narrow",
] as const satisfies readonly string[];
export type RelativeTimeFormat = (typeof relativeTimeFormatIds)[number];
