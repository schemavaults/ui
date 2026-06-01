export const secretRevealVariantIds = [
  "default",
  "outline",
  "subtle",
  "terminal",
  "brand",
] as const satisfies readonly string[];
export type SecretRevealVariant = (typeof secretRevealVariantIds)[number];

export const secretRevealSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type SecretRevealSize = (typeof secretRevealSizeIds)[number];

export const secretRevealMaskStyleIds = [
  "dots",
  "asterisks",
  "blur",
] as const satisfies readonly string[];
export type SecretRevealMaskStyle = (typeof secretRevealMaskStyleIds)[number];
