export const kbdVariantIds = [
  "default",
  "outline",
  "solid",
  "subtle",
] as const satisfies readonly string[];
export type KbdVariant = (typeof kbdVariantIds)[number];

export const kbdSizeIds = ["sm", "md", "lg"] as const satisfies readonly string[];
export type KbdSize = (typeof kbdSizeIds)[number];
