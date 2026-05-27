export const notificationBellVariantIds = [
  "default",
  "outline",
  "ghost",
  "subtle",
  "brand",
] as const satisfies readonly string[];
export type NotificationBellVariant =
  (typeof notificationBellVariantIds)[number];

export const notificationBellSizeIds = ["sm", "md", "lg"] as const satisfies readonly string[];
export type NotificationBellSize = (typeof notificationBellSizeIds)[number];

export const notificationBellIndicatorVariantIds = [
  "destructive",
  "primary",
  "success",
  "warning",
  "brand",
] as const satisfies readonly string[];
export type NotificationBellIndicatorVariant =
  (typeof notificationBellIndicatorVariantIds)[number];
