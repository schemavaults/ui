export const badgeVariantIds = [
  "default",
  "secondary",
  "destructive",
  "outline",
] as const satisfies readonly string[];
export type BadgeVariant = (typeof badgeVariantIds)[number];
