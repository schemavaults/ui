"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement } from "react";

import { cn } from "@/lib/utils";

export const buttonGroupOrientationIds = [
  "horizontal",
  "vertical",
] as const satisfies readonly string[];
export type ButtonGroupOrientationId =
  (typeof buttonGroupOrientationIds)[number];

export const buttonGroupSpacingIds = [
  "none",
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type ButtonGroupSpacingId = (typeof buttonGroupSpacingIds)[number];

/**
 * ButtonGroup wraps a set of Button-like children and presents them as a single
 * connected control (attached=true) or an evenly-spaced cluster
 * (attached=false).
 *
 * Attached mode uses direct-child CSS selectors so it composes with the
 * existing <Button /> API without extra props — pass matching size/variant on
 * each child to keep them visually consistent.
 */
export const buttonGroupVariants = cva(
  "inline-flex isolate",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      } satisfies Record<ButtonGroupOrientationId, string>,
      attached: {
        true: "",
        false: "",
      },
      spacing: {
        none: "gap-0",
        sm: "gap-1",
        default: "gap-2",
        lg: "gap-3",
      } satisfies Record<ButtonGroupSpacingId, string>,
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      // Attached horizontal: collapse gap; keep only outer corners; overlap
      // adjacent borders (so double outlines render as one line); raise the
      // focused/hovered child so its ring is not clipped by neighbors.
      {
        attached: true,
        orientation: "horizontal",
        className: cn(
          "gap-0",
          "[&>*]:rounded-none",
          "[&>*:first-child]:rounded-l-md",
          "[&>*:last-child]:rounded-r-md",
          "[&>*+*]:-ml-px",
          "[&>*:focus-visible]:relative [&>*:focus-visible]:z-10",
          "[&>*:hover]:relative [&>*:hover]:z-10",
        ),
      },
      {
        attached: true,
        orientation: "vertical",
        className: cn(
          "gap-0",
          "[&>*]:rounded-none",
          "[&>*:first-child]:rounded-t-md",
          "[&>*:last-child]:rounded-b-md",
          "[&>*+*]:-mt-px",
          "[&>*:focus-visible]:relative [&>*:focus-visible]:z-10",
          "[&>*:hover]:relative [&>*:hover]:z-10",
        ),
      },
      // fullWidth attached horizontal: split available width evenly across
      // children so a group can span its container.
      {
        attached: true,
        orientation: "horizontal",
        fullWidth: true,
        className: "[&>*]:flex-1",
      },
    ],
    defaultVariants: {
      orientation: "horizontal",
      attached: true,
      spacing: "default",
      fullWidth: false,
    },
  },
);

export interface ButtonGroupProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  /**
   * Accessible label for the group (rendered via aria-label). Prefer this
   * over labelling each child individually when the buttons share a purpose
   * (e.g. "Text alignment", "Pagination").
   */
  "aria-label"?: string;
}

export function ButtonGroup({
  className,
  orientation,
  attached,
  spacing,
  fullWidth,
  role = "group",
  children,
  ...props
}: ButtonGroupProps): ReactElement {
  return (
    <div
      role={role}
      data-orientation={orientation ?? "horizontal"}
      data-attached={attached ?? true ? "true" : "false"}
      className={cn(
        buttonGroupVariants({ orientation, attached, spacing, fullWidth }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
ButtonGroup.displayName = "ButtonGroup";
