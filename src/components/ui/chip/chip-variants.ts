export const chipVariantIds = [
  "default",
  "primary",
  "secondary",
  "destructive",
  "success",
  "warning",
  "outline",
] as const satisfies readonly string[];
export type ChipVariant = (typeof chipVariantIds)[number];

export const chipSizeIds = ["sm", "default", "lg"] as const satisfies readonly string[];
export type ChipSize = (typeof chipSizeIds)[number];
