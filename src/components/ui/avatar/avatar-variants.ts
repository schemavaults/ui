import { cva } from "class-variance-authority";

export const avatarSizeIds = [
  "xs",
  "sm",
  "default",
  "lg",
  "xl",
] as const satisfies string[];
export type AvatarSizeId = (typeof avatarSizeIds)[number];

export const avatarShapeIds = ["circle", "square"] as const satisfies string[];
export type AvatarShapeId = (typeof avatarShapeIds)[number];

export const avatarVariants = cva("relative flex shrink-0 overflow-hidden", {
  variants: {
    size: {
      xs: "h-6 w-6 text-xs",
      sm: "h-8 w-8 text-xs",
      default: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
    } satisfies Record<AvatarSizeId, string>,
    shape: {
      circle: "rounded-full",
      square: "rounded-md",
    } satisfies Record<AvatarShapeId, string>,
  },
  defaultVariants: {
    size: "default",
    shape: "circle",
  },
});

/**
 * How tightly stacked avatars overlap each other. The pixel overlap is
 * resolved per-size (see the compound variants below) so that an `xs` group
 * and an `xl` group overlap by the same _proportion_ of the avatar rather
 * than by the same absolute number of pixels.
 */
export const avatarGroupSpacingIds = [
  "tight",
  "default",
  "loose",
  "none",
] as const satisfies string[];
export type AvatarGroupSpacingId = (typeof avatarGroupSpacingIds)[number];

const noSpacingClasses = {
  xs: "",
  sm: "",
  default: "",
  lg: "",
  xl: "",
} satisfies Record<AvatarSizeId, string>;

/**
 * Overlap table: `[size][spacing]` → negative horizontal space utility.
 *
 * Roughly 45% overlap for `tight`, 30% for `default`, 15% for `loose`.
 * `none` lays the avatars out edge-to-edge with no overlap at all.
 */
const avatarGroupOverlapClasses = {
  tight: {
    xs: "-space-x-3",
    sm: "-space-x-4",
    default: "-space-x-5",
    lg: "-space-x-6",
    xl: "-space-x-8",
  },
  default: {
    xs: "-space-x-2",
    sm: "-space-x-2.5",
    default: "-space-x-3",
    lg: "-space-x-4",
    xl: "-space-x-5",
  },
  loose: {
    xs: "-space-x-1",
    sm: "-space-x-1.5",
    default: "-space-x-2",
    lg: "-space-x-2",
    xl: "-space-x-3",
  },
  none: {
    xs: "space-x-0",
    sm: "space-x-0",
    default: "space-x-0",
    lg: "space-x-0",
    xl: "space-x-0",
  },
} satisfies Record<AvatarGroupSpacingId, Record<AvatarSizeId, string>>;

export const avatarGroupVariants = cva("flex items-center", {
  variants: {
    size: noSpacingClasses,
    spacing: {
      tight: "",
      default: "",
      loose: "",
      none: "",
    } satisfies Record<AvatarGroupSpacingId, string>,
  },
  compoundVariants: avatarGroupSpacingIds.flatMap((spacing) =>
    avatarSizeIds.map((size) => ({
      spacing,
      size,
      class: avatarGroupOverlapClasses[spacing][size],
    })),
  ),
  defaultVariants: {
    size: "default",
    spacing: "default",
  },
});
