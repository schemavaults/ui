export const colorSwatchSizeIds = [
  "xs",
  "sm",
  "default",
  "lg",
  "xl",
] as const satisfies readonly string[];
export type ColorSwatchSize = (typeof colorSwatchSizeIds)[number];

export const colorSwatchShapeIds = [
  "circle",
  "rounded",
  "square",
] as const satisfies readonly string[];
export type ColorSwatchShape = (typeof colorSwatchShapeIds)[number];

export const colorSwatchVariantIds = [
  "default",
  "outline",
  "ghost",
] as const satisfies readonly string[];
export type ColorSwatchVariant = (typeof colorSwatchVariantIds)[number];
