export const copyButtonVariantIds = [
  "default",
  "outline",
  "ghost",
  "subtle",
  "brand",
] as const satisfies readonly string[];
export type CopyButtonVariant = (typeof copyButtonVariantIds)[number];

export const copyButtonSizeIds = [
  "sm",
  "md",
  "lg",
  "icon-sm",
  "icon-md",
  "icon-lg",
] as const satisfies readonly string[];
export type CopyButtonSize = (typeof copyButtonSizeIds)[number];
