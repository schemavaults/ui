export const characterCountStateIds = [
  "default",
  "warning",
  "danger",
] as const satisfies readonly string[];
export type CharacterCountState = (typeof characterCountStateIds)[number];

export const characterCountSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type CharacterCountSize = (typeof characterCountSizeIds)[number];

export const characterCountModeIds = [
  "characters",
  "words",
] as const satisfies readonly string[];
export type CharacterCountMode = (typeof characterCountModeIds)[number];
