export const inlineEditVariantIds = [
  "default",
  "ghost",
  "underline",
] as const satisfies readonly string[];
export type InlineEditVariant = (typeof inlineEditVariantIds)[number];

export const inlineEditSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type InlineEditSize = (typeof inlineEditSizeIds)[number];
