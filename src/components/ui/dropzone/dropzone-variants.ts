export const dropzoneVariantIds = [
  "default",
  "outline",
  "ghost",
] as const satisfies readonly string[];
export type DropzoneVariant = (typeof dropzoneVariantIds)[number];

export const dropzoneSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type DropzoneSize = (typeof dropzoneSizeIds)[number];

/**
 * Interaction / validation state applied via `data-state`. `idle` is the
 * default resting state, `active` is applied while a drag is hovering over
 * the drop target, `error` when the most recent drop was rejected, and
 * `disabled` when the dropzone is not accepting input.
 */
export const dropzoneStateIds = [
  "idle",
  "active",
  "error",
  "disabled",
] as const satisfies readonly string[];
export type DropzoneState = (typeof dropzoneStateIds)[number];

/**
 * Reason a file was rejected by the dropzone during validation. Attached to
 * every entry in the `rejected` array passed to `onDrop` / `onFilesRejected`.
 */
export const dropzoneRejectionReasonIds = [
  "file-too-large",
  "file-invalid-type",
  "too-many-files",
] as const satisfies readonly string[];
export type DropzoneRejectionReason = (typeof dropzoneRejectionReasonIds)[number];
