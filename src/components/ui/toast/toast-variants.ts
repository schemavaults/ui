export const validToastVariantIds = [
  "default",
  "destructive",
] as const satisfies readonly string[];

export type ToastVariantID = (typeof validToastVariantIds)[number];
