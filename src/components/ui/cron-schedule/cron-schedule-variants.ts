export const cronScheduleVariantIds = [
  "default",
  "outline",
  "subtle",
  "terminal",
] as const satisfies readonly string[];
export type CronScheduleVariant = (typeof cronScheduleVariantIds)[number];

export const cronScheduleColorIds = [
  "primary",
  "success",
  "warning",
  "destructive",
  "brand",
  "neutral",
] as const satisfies readonly string[];
export type CronScheduleColor = (typeof cronScheduleColorIds)[number];

export const cronScheduleSizeIds = [
  "sm",
  "md",
] as const satisfies readonly string[];
export type CronScheduleSize = (typeof cronScheduleSizeIds)[number];

export const cronScheduleLayoutIds = [
  "card",
  "inline",
] as const satisfies readonly string[];
export type CronScheduleLayout = (typeof cronScheduleLayoutIds)[number];
