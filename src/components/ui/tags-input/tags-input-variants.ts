export const tagsInputSizeIds = ["sm", "default", "lg"] as const satisfies readonly string[];
export type TagsInputSize = (typeof tagsInputSizeIds)[number];
