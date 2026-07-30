export const ratingBreakdownSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type RatingBreakdownSize = (typeof ratingBreakdownSizeIds)[number];

export const ratingBreakdownLayoutIds = [
  "horizontal",
  "vertical",
] as const satisfies readonly string[];
export type RatingBreakdownLayout =
  (typeof ratingBreakdownLayoutIds)[number];

export const ratingBreakdownBarVariantIds = [
  "solid",
  "subtle",
] as const satisfies readonly string[];
export type RatingBreakdownBarVariant =
  (typeof ratingBreakdownBarVariantIds)[number];

export const ratingBreakdownBarScaleIds = [
  "total",
  "max",
] as const satisfies readonly string[];
export type RatingBreakdownBarScale =
  (typeof ratingBreakdownBarScaleIds)[number];

export const ratingBreakdownValueFormatIds = [
  "count",
  "percent",
  "both",
  "none",
] as const satisfies readonly string[];
export type RatingBreakdownValueFormat =
  (typeof ratingBreakdownValueFormatIds)[number];
