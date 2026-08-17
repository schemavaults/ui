export const messageFeedbackVariantIds = [
  "default",
  "outline",
  "ghost",
  "subtle",
] as const satisfies readonly string[];
export type MessageFeedbackVariant = (typeof messageFeedbackVariantIds)[number];

export const messageFeedbackSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type MessageFeedbackSize = (typeof messageFeedbackSizeIds)[number];

export const messageFeedbackRatingIds = [
  "up",
  "down",
] as const satisfies readonly string[];
export type MessageFeedbackRating = (typeof messageFeedbackRatingIds)[number];
