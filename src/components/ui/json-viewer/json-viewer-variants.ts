export const jsonViewerVariantIds = [
  "default",
  "terminal",
  "subtle",
  "contrast",
] as const satisfies readonly string[];
export type JsonViewerVariant = (typeof jsonViewerVariantIds)[number];

export const jsonViewerSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type JsonViewerSize = (typeof jsonViewerSizeIds)[number];
