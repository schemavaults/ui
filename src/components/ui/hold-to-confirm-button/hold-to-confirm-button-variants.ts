export const holdToConfirmButtonVariantIds = [
  "default",
  "destructive",
  "primary",
  "warning",
  "outline",
] as const satisfies readonly string[];
export type HoldToConfirmButtonVariant =
  (typeof holdToConfirmButtonVariantIds)[number];

export const holdToConfirmButtonSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type HoldToConfirmButtonSize =
  (typeof holdToConfirmButtonSizeIds)[number];
