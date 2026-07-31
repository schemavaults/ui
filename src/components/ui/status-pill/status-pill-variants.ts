export const statusPillStatusIds = [
  "neutral",
  "active",
  "success",
  "info",
  "warning",
  "danger",
  "pending",
  "muted",
] as const satisfies readonly string[];
export type StatusPillStatusId = (typeof statusPillStatusIds)[number];

export const statusPillAppearanceIds = [
  "soft",
  "solid",
  "outline",
  "plain",
] as const satisfies readonly string[];
export type StatusPillAppearance = (typeof statusPillAppearanceIds)[number];

export const statusPillSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type StatusPillSize = (typeof statusPillSizeIds)[number];

/**
 * Human-readable default labels for each status. Used when `label` is omitted
 * but the caller still wants a sensible default. Callers can always override
 * these by passing an explicit `label` (or `children`).
 */
export const statusPillDefaultLabels: Record<StatusPillStatusId, string> = {
  neutral: "Neutral",
  active: "Active",
  success: "Success",
  info: "Info",
  warning: "Warning",
  danger: "Error",
  pending: "Pending",
  muted: "Inactive",
};
