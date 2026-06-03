export const diffViewerVariantIds = [
  "default",
  "subtle",
  "contrast",
] as const satisfies readonly string[];
export type DiffViewerVariant = (typeof diffViewerVariantIds)[number];

export const diffViewerSizeIds = ["sm", "md", "lg"] as const satisfies readonly string[];
export type DiffViewerSize = (typeof diffViewerSizeIds)[number];

export const diffViewerModeIds = ["unified", "split"] as const satisfies readonly string[];
export type DiffViewerMode = (typeof diffViewerModeIds)[number];
