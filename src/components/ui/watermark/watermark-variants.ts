export const watermarkLayoutIds = [
  "repeat",
  "stamp",
] as const satisfies readonly string[];
export type WatermarkLayout = (typeof watermarkLayoutIds)[number];

export const watermarkVariantIds = [
  "default",
  "secondary",
  "destructive",
  "success",
  "warning",
  "accent",
  "muted",
] as const satisfies readonly string[];
export type WatermarkVariant = (typeof watermarkVariantIds)[number];

export const watermarkSizeIds = [
  "sm",
  "default",
  "lg",
  "xl",
] as const satisfies readonly string[];
export type WatermarkSize = (typeof watermarkSizeIds)[number];

export const watermarkDensityIds = [
  "sparse",
  "default",
  "dense",
] as const satisfies readonly string[];
export type WatermarkDensity = (typeof watermarkDensityIds)[number];
