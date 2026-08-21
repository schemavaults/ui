"use client";

import type { HTMLAttributes, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";
import {
  buttonGroupVariants,
  type ButtonGroupVariantProps,
} from "./button-group-variants";

export interface ButtonGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role">,
    ButtonGroupVariantProps {
  /**
   * Accessible label for the group. Rendered as `aria-label`. Assistive tech
   * announces the group as a related set of controls, so give it a short name
   * describing what the buttons do together (e.g. `"Text alignment"`,
   * `"Pagination"`).
   */
  label: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A visually-joined cluster of `Button`s (or button-like children). Handles
 * border collapsing and outer corner rounding automatically so a row of
 * `outline`/`secondary` buttons reads as a single segmented control.
 *
 * Different from:
 * - `SegmentedControl` / `ToggleGroup`: those are *stateful*, single- or
 *   multi-select toggles. `ButtonGroup` is a layout wrapper — every child
 *   keeps its own `onClick`.
 * - `SplitButton`: a single primary action paired with a dropdown chevron.
 * - `Toolbar`: a bordered container with gaps between distinct tool items.
 *
 * Set `spacing="sm" | "default" | "lg"` to switch from the attached look to
 * a spaced row, or `orientation="vertical"` for a stacked column.
 */
function ButtonGroup({
  className,
  orientation,
  spacing,
  label,
  ref,
  ...props
}: ButtonGroupProps): ReactElement {
  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      data-slot="button-group"
      data-orientation={orientation ?? "horizontal"}
      data-spacing={spacing ?? "attached"}
      className={cn(buttonGroupVariants({ orientation, spacing }), className)}
      {...props}
    />
  );
}
ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup, buttonGroupVariants };
