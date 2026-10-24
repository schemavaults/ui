export const keyValueEditorSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];

export type KeyValueEditorSize = (typeof keyValueEditorSizeIds)[number];

export const keyValueEditorKeyFormatIds = [
  "none",
  "env",
] as const satisfies readonly string[];

/**
 * How keys are normalised as they are typed.
 * - `none` — keys are kept verbatim.
 * - `env` — keys are forced to `UPPER_SNAKE_CASE` environment-variable names.
 */
export type KeyValueEditorKeyFormat =
  (typeof keyValueEditorKeyFormatIds)[number];
