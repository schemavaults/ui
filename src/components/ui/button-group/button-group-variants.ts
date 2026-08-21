import { cva, type VariantProps } from "class-variance-authority";

export const buttonGroupOrientationIds = [
  "horizontal",
  "vertical",
] as const satisfies string[];
export type ButtonGroupOrientation = (typeof buttonGroupOrientationIds)[number];

export const buttonGroupSpacingIds = [
  "attached",
  "sm",
  "default",
  "lg",
] as const satisfies string[];
export type ButtonGroupSpacing = (typeof buttonGroupSpacingIds)[number];

/**
 * Layout + border-collapsing rules applied to the group container. The
 * `[&>*:child-selector]` rules target every direct child so it works with
 * `Button`, `asChild`-wrapped links, tooltip-wrapped triggers, etc. — anything
 * that ends up as an immediate child. Focus-visible bumps `z-10` so the ring
 * stays above adjacent siblings in attached mode.
 */
export const buttonGroupVariants = cva(
  "inline-flex isolate [&>*]:relative [&>*:focus-visible]:z-10",
  {
    variants: {
      orientation: {
        horizontal: "flex-row items-stretch",
        vertical: "flex-col items-stretch",
      } satisfies Record<ButtonGroupOrientation, string>,
      spacing: {
        attached: "",
        sm: "gap-1",
        default: "gap-2",
        lg: "gap-3",
      } satisfies Record<ButtonGroupSpacing, string>,
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        spacing: "attached",
        className: [
          "[&>*:not(:first-child)]:rounded-l-none",
          "[&>*:not(:last-child)]:rounded-r-none",
          "[&>*:not(:first-child)]:-ml-px",
        ].join(" "),
      },
      {
        orientation: "vertical",
        spacing: "attached",
        className: [
          "[&>*:not(:first-child)]:rounded-t-none",
          "[&>*:not(:last-child)]:rounded-b-none",
          "[&>*:not(:first-child)]:-mt-px",
          "[&>*]:w-full",
        ].join(" "),
      },
    ],
    defaultVariants: {
      orientation: "horizontal",
      spacing: "attached",
    },
  },
);

export type ButtonGroupVariantProps = VariantProps<typeof buttonGroupVariants>;
