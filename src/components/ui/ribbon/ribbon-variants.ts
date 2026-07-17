export const ribbonVariantIds = [
  "default",
  "secondary",
  "destructive",
  "success",
  "warning",
  "accent",
] as const satisfies readonly string[];
export type RibbonVariant = (typeof ribbonVariantIds)[number];

export const ribbonSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type RibbonSize = (typeof ribbonSizeIds)[number];

export const ribbonPositionIds = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left",
] as const satisfies readonly string[];
export type RibbonPosition = (typeof ribbonPositionIds)[number];
