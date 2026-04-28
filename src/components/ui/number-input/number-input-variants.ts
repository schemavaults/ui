export const numberInputSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type NumberInputSize = (typeof numberInputSizeIds)[number];

export const numberInputVariantIds = [
  "default",
  "outline",
  "ghost",
] as const satisfies readonly string[];
export type NumberInputVariant = (typeof numberInputVariantIds)[number];

export const numberInputStepperLayoutIds = [
  "split",
  "stacked",
] as const satisfies readonly string[];
export type NumberInputStepperLayout =
  (typeof numberInputStepperLayoutIds)[number];
