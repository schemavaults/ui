export const ribbonIntentIds = [
  "default",
  "primary",
  "brand",
  "success",
  "warning",
  "destructive",
  "info",
] as const satisfies readonly string[];
export type RibbonIntent = (typeof ribbonIntentIds)[number];

export const ribbonPositionIds = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const satisfies readonly string[];
export type RibbonPosition = (typeof ribbonPositionIds)[number];

export const ribbonSizeIds = ["sm", "md", "lg"] as const satisfies readonly string[];
export type RibbonSize = (typeof ribbonSizeIds)[number];
