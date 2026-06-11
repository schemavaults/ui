export const httpMethodIds = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
  "TRACE",
  "CONNECT",
] as const satisfies readonly string[];
export type HttpMethod = (typeof httpMethodIds)[number];

export const httpMethodBadgeAppearanceIds = [
  "solid",
  "soft",
  "outline",
] as const satisfies readonly string[];
export type HttpMethodBadgeAppearance =
  (typeof httpMethodBadgeAppearanceIds)[number];

export const httpMethodBadgeSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type HttpMethodBadgeSize = (typeof httpMethodBadgeSizeIds)[number];
