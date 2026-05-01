"use client";

import {
  useCallback,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type Ref,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const toggleVariantIds = [
  "default",
  "outline",
  "ghost",
  "primary",
  "destructive",
] as const satisfies readonly string[];
export type ToggleVariantId = (typeof toggleVariantIds)[number];

export const toggleSizeIds = [
  "sm",
  "default",
  "lg",
  "icon",
] as const satisfies readonly string[];
export type ToggleSizeId = (typeof toggleSizeIds)[number];

export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        outline:
          "border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:border-accent",
        ghost:
          "bg-transparent text-muted-foreground hover:text-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground",
        primary:
          "bg-transparent text-foreground hover:bg-primary/10 hover:text-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary/90 data-[state=on]:hover:text-primary-foreground",
        destructive:
          "bg-transparent text-foreground hover:bg-destructive/10 hover:text-destructive data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground data-[state=on]:hover:bg-destructive/90 data-[state=on]:hover:text-destructive-foreground",
      } satisfies Record<ToggleVariantId, string>,
      size: {
        sm: "h-8 px-2 text-xs",
        default: "h-9 px-3",
        lg: "h-10 px-4",
        icon: "h-9 w-9 p-0",
      } satisfies Record<ToggleSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toggleVariants> {
  /** Controlled pressed state. */
  pressed?: boolean;
  /** Initial pressed state when uncontrolled. */
  defaultPressed?: boolean;
  /** Called when the pressed state changes. */
  onPressedChange?: (pressed: boolean) => void;
  ref?: Ref<HTMLButtonElement>;
}

function Toggle({
  className,
  variant,
  size,
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  onClick,
  disabled,
  type,
  ref,
  ...props
}: ToggleProps): ReactElement {
  const [internalPressed, setInternalPressed] = useState<boolean>(defaultPressed);
  const isControlled = pressedProp !== undefined;
  const pressed = isControlled ? pressedProp : internalPressed;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      const next = !pressed;
      if (!isControlled) {
        setInternalPressed(next);
      }
      onPressedChange?.(next);
    },
    [pressed, isControlled, onClick, onPressedChange],
  );

  return (
    <button
      ref={ref}
      type={type ?? "button"}
      data-slot="toggle"
      data-state={pressed ? "on" : "off"}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={handleClick}
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}
Toggle.displayName = "Toggle";

export { Toggle };
