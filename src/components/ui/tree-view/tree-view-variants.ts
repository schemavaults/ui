export const treeViewSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type TreeViewSize = (typeof treeViewSizeIds)[number];

export const treeViewVariantIds = [
  "default",
  "ghost",
] as const satisfies readonly string[];
export type TreeViewVariant = (typeof treeViewVariantIds)[number];
