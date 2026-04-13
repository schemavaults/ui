export const breadcrumbSeparatorVariantIds = [
  "chevron",
  "slash",
  "dot",
  "arrow",
] as const satisfies readonly string[];
export type BreadcrumbSeparatorVariant =
  (typeof breadcrumbSeparatorVariantIds)[number];

export const breadcrumbSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type BreadcrumbSize = (typeof breadcrumbSizeIds)[number];

export const breadcrumbVariantIds = [
  "default",
  "muted",
  "primary",
  "ghost",
] as const satisfies readonly string[];
export type BreadcrumbVariant = (typeof breadcrumbVariantIds)[number];
