"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import { Button, type ButtonVariantId } from "../button/button";

export const buttonGroupOrientationIds = [
  "horizontal",
  "vertical",
] as const satisfies readonly string[];
export type ButtonGroupOrientation = (typeof buttonGroupOrientationIds)[number];

export const buttonGroupSizeIds = [
  "sm",
  "default",
  "lg",
  "icon",
] as const satisfies readonly string[];
export type ButtonGroupSize = (typeof buttonGroupSizeIds)[number];

export const buttonGroupSpacingIds = [
  "attached",
  "spaced",
] as const satisfies readonly string[];
export type ButtonGroupSpacing = (typeof buttonGroupSpacingIds)[number];

const buttonGroupVariants = cva(
  "inline-flex items-stretch [&>*]:relative [&>*:hover]:z-10 [&>*:focus-visible]:z-20",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      } satisfies Record<ButtonGroupOrientation, string>,
      spacing: {
        attached: "",
        spaced: "gap-2",
      } satisfies Record<ButtonGroupSpacing, string>,
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        spacing: "attached",
        class:
          "[&>[data-slot=button-group-item]:not(:first-child)]:rounded-l-none [&>[data-slot=button-group-item]:not(:first-child)]:-ml-px [&>[data-slot=button-group-item]:not(:last-child)]:rounded-r-none",
      },
      {
        orientation: "vertical",
        spacing: "attached",
        class:
          "[&>[data-slot=button-group-item]:not(:first-child)]:rounded-t-none [&>[data-slot=button-group-item]:not(:first-child)]:-mt-px [&>[data-slot=button-group-item]:not(:last-child)]:rounded-b-none",
      },
    ],
    defaultVariants: {
      orientation: "horizontal",
      spacing: "attached",
    },
  },
);

interface ButtonGroupContextValue {
  variant: ButtonVariantId | null | undefined;
  size: ButtonGroupSize | null | undefined;
  disabled: boolean;
}

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

function useButtonGroupContext(): ButtonGroupContextValue | null {
  return useContext(ButtonGroupContext);
}

type ButtonGroupBaseProps = HTMLAttributes<HTMLDivElement> &
  Omit<VariantProps<typeof buttonGroupVariants>, "orientation" | "spacing"> & {
    orientation?: ButtonGroupOrientation;
    spacing?: ButtonGroupSpacing;
    /** Visual style cascaded to every `ButtonGroupItem` inside the group. */
    variant?: ButtonVariantId;
    /** Height/padding cascaded to every `ButtonGroupItem` inside the group. */
    size?: ButtonGroupSize;
    /** Disables every `ButtonGroupItem` inside the group. */
    disabled?: boolean;
    ref?: Ref<HTMLDivElement>;
  };

export interface ButtonGroupProps extends ButtonGroupBaseProps {}

function ButtonGroup({
  className,
  orientation = "horizontal",
  spacing = "attached",
  variant,
  size,
  disabled = false,
  role = "group",
  ref,
  ...props
}: ButtonGroupProps): ReactElement {
  return (
    <ButtonGroupContext.Provider value={{ variant, size, disabled }}>
      <div
        ref={ref}
        role={role}
        data-slot="button-group"
        data-orientation={orientation}
        data-spacing={spacing}
        aria-orientation={orientation}
        className={cn(
          buttonGroupVariants({ orientation, spacing }),
          className,
        )}
        {...props}
      />
    </ButtonGroupContext.Provider>
  );
}
ButtonGroup.displayName = "ButtonGroup";

export interface ButtonGroupItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Override the container-provided variant just for this item. */
  variant?: ButtonVariantId;
  /** Override the container-provided size just for this item. */
  size?: ButtonGroupSize;
  /**
   * When true, render the item as the child element (via Radix `Slot`) so
   * you can hang a `TooltipTrigger`, `DropdownMenuTrigger`, `PopoverTrigger`,
   * or `next/link` `<Link>` off a group slot while keeping the attached
   * borders/corners intact.
   */
  asChild?: boolean;
}

function ButtonGroupItem({
  className,
  variant,
  size,
  disabled,
  asChild = false,
  type = "button",
  ...props
}: ButtonGroupItemProps): ReactElement {
  const ctx = useButtonGroupContext();
  const resolvedVariant: ButtonVariantId | undefined =
    variant ?? ctx?.variant ?? undefined;
  const resolvedSize: ButtonGroupSize | undefined =
    size ?? ctx?.size ?? undefined;
  const resolvedDisabled: boolean | undefined =
    disabled ?? (ctx?.disabled ? true : undefined);

  return (
    <Button
      type={type}
      variant={resolvedVariant}
      size={resolvedSize}
      disabled={resolvedDisabled}
      asChild={asChild}
      data-slot="button-group-item"
      className={cn("focus-visible:z-20", className)}
      {...props}
    />
  );
}
ButtonGroupItem.displayName = "ButtonGroupItem";

export interface ButtonGroupSeparatorProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Override the automatic orientation. By default the separator picks the
   * axis perpendicular to the parent `ButtonGroup` (a vertical bar in a
   * horizontal group, a horizontal bar in a vertical group).
   */
  orientation?: ButtonGroupOrientation;
  ref?: Ref<HTMLDivElement>;
}

function ButtonGroupSeparator({
  className,
  orientation,
  ref,
  ...props
}: ButtonGroupSeparatorProps): ReactElement {
  const resolvedOrientation: ButtonGroupOrientation =
    orientation ?? "vertical";
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={resolvedOrientation}
      data-slot="button-group-separator"
      data-orientation={resolvedOrientation}
      className={cn(
        "shrink-0 self-stretch bg-border",
        resolvedOrientation === "vertical" ? "mx-1 w-px" : "my-1 h-px w-full",
        className,
      )}
      {...props}
    />
  );
}
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";

export {
  ButtonGroup,
  ButtonGroupItem,
  ButtonGroupSeparator,
  buttonGroupVariants,
};
