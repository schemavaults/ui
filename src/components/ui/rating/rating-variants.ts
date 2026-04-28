export const ratingSizeIds = ["sm", "md", "lg", "xl"] as const satisfies readonly string[];
export type RatingSize = (typeof ratingSizeIds)[number];

export const ratingColorIds = [
  "warning",
  "primary",
  "destructive",
  "foreground",
] as const satisfies readonly string[];
export type RatingColor = (typeof ratingColorIds)[number];
