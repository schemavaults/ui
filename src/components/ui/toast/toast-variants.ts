export const validToastVariantIds = [
  "default",
  "destructive",
  "warning",
] as const satisfies readonly string[];

export type ToastVariantID = (typeof validToastVariantIds)[number];
