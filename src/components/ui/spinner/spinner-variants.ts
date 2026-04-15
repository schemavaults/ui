export const spinnerSizeIds = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies readonly string[];
export type SpinnerSize = (typeof spinnerSizeIds)[number];

export const spinnerVariantIds = [
  "default",
  "primary",
  "secondary",
  "brand",
  "destructive",
  "warning",
  "muted",
] as const satisfies readonly string[];
export type SpinnerVariant = (typeof spinnerVariantIds)[number];
