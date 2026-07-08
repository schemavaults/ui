export const splitButtonVariantIds = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
] as const satisfies readonly string[];
export type SplitButtonVariant = (typeof splitButtonVariantIds)[number];

export const splitButtonSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type SplitButtonSize = (typeof splitButtonSizeIds)[number];
