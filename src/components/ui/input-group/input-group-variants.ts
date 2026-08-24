export const inputGroupVariantIds = [
  "default",
  "outline",
  "ghost",
] as const satisfies readonly string[];
export type InputGroupVariant = (typeof inputGroupVariantIds)[number];

export const inputGroupSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type InputGroupSize = (typeof inputGroupSizeIds)[number];
