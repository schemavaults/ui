export const fieldTypeIds = [
  "string",
  "integer",
  "number",
  "boolean",
  "object",
  "array",
  "null",
  "date",
  "datetime",
  "uuid",
  "enum",
  "binary",
  "json",
  "any",
] as const satisfies readonly string[];
export type FieldType = (typeof fieldTypeIds)[number];

export const fieldTypeBadgeAppearanceIds = [
  "solid",
  "soft",
  "outline",
] as const satisfies readonly string[];
export type FieldTypeBadgeAppearance =
  (typeof fieldTypeBadgeAppearanceIds)[number];

export const fieldTypeBadgeSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type FieldTypeBadgeSize = (typeof fieldTypeBadgeSizeIds)[number];
