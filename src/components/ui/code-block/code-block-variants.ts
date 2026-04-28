export const codeBlockVariantIds = [
  "default",
  "terminal",
  "subtle",
  "contrast",
] as const satisfies readonly string[];
export type CodeBlockVariant = (typeof codeBlockVariantIds)[number];

export const codeBlockSizeIds = ["sm", "md", "lg"] as const satisfies readonly string[];
export type CodeBlockSize = (typeof codeBlockSizeIds)[number];
