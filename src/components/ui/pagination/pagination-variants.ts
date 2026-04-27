export const paginationSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type PaginationSize = (typeof paginationSizeIds)[number];

export const paginationVariantIds = [
  "default",
  "outline",
  "ghost",
] as const satisfies readonly string[];
export type PaginationVariant = (typeof paginationVariantIds)[number];

export const paginationShapeIds = [
  "rounded",
  "square",
  "pill",
] as const satisfies readonly string[];
export type PaginationShape = (typeof paginationShapeIds)[number];
