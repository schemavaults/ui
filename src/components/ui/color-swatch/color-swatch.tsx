"use client";

import { Check } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
} from "react";

import { cn } from "@/lib/utils";
import {
  colorSwatchShapeIds,
  colorSwatchSizeIds,
  colorSwatchVariantIds,
  type ColorSwatchShape,
  type ColorSwatchSize,
  type ColorSwatchVariant,
} from "./color-swatch-variants";

const colorSwatchVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center align-middle transition-[transform,box-shadow,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      size: {
        xs: "size-4",
        sm: "size-5",
        default: "size-7",
        lg: "size-9",
        xl: "size-12",
      } satisfies Record<ColorSwatchSize, string>,
      shape: {
        circle: "rounded-full",
        rounded: "rounded-md",
        square: "rounded-none",
      } satisfies Record<ColorSwatchShape, string>,
      variant: {
        default:
          "border border-border/40 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]",
        outline: "border-2 border-border",
        ghost: "border-0",
      } satisfies Record<ColorSwatchVariant, string>,
      interactive: {
        true: "cursor-pointer hover:scale-110 active:scale-95",
        false: "",
      },
      selected: {
        true: "ring-2 ring-ring ring-offset-2 ring-offset-background",
        false: "",
      },
      disabled: {
        true: "opacity-40 pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      shape: "circle",
      variant: "default",
      interactive: false,
      selected: false,
      disabled: false,
    },
  },
);

const checkIconSizeClass: Record<ColorSwatchSize, string> = {
  xs: "size-2.5",
  sm: "size-3",
  default: "size-4",
  lg: "size-5",
  xl: "size-6",
};

export interface ColorSwatchProps
  extends Omit<ComponentProps<"span">, "color">,
    Pick<VariantProps<typeof colorSwatchVariants>, "size" | "shape" | "variant"> {
  /**
   * The color to display. Accepts any CSS color value:
   *   - hex ("#7c3aed")
   *   - rgb / rgba / hsl / hsla
   *   - CSS variables ("hsl(var(--primary))")
   *   - named colors ("rebeccapurple")
   */
  color: string;
  /** Accessible label (e.g. "Indigo"). Strongly recommended. */
  label?: string;
  /** Marks the swatch as the active selection. Adds a focus ring and check icon. */
  selected?: boolean;
  /** Disables interaction and dims the swatch. */
  disabled?: boolean;
  /** Click handler — when set the swatch becomes a keyboard-focusable button. */
  onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
  /** Hide the check icon shown when `selected` is true. */
  hideSelectedIcon?: boolean;
  /** Color for the check icon when selected. Defaults to a contrast-aware white/black. */
  checkIconColor?: string;
}

/**
 * Heuristic — computes whether a CSS color is "light" so we can flip the
 * contrast color of the selection check icon. Falls back to white for any
 * non-hex value (CSS variables, names, etc).
 */
function getContrastingCheckColor(color: string): string {
  const trimmed = color.trim();
  const hexMatch = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(trimmed);
  if (!hexMatch) return "#ffffff";
  let hex = hexMatch[1];
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // Relative luminance — sRGB approximation.
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0a0a0a" : "#ffffff";
}

function ColorSwatch({
  ref,
  className,
  color,
  label,
  size,
  shape,
  variant,
  selected = false,
  disabled = false,
  onClick,
  onKeyDown,
  hideSelectedIcon = false,
  checkIconColor,
  style,
  role,
  tabIndex,
  "aria-label": ariaLabelProp,
  ...props
}: ColorSwatchProps): ReactElement {
  const interactive = Boolean(onClick) && !disabled;
  const ariaLabel = ariaLabelProp ?? label ?? color;
  const resolvedSize: ColorSwatchSize = size ?? "default";
  const iconColor = checkIconColor ?? getContrastingCheckColor(color);

  function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>): void {
    onKeyDown?.(event);
    if (!interactive || event.defaultPrevented) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(event as unknown as MouseEvent<HTMLSpanElement>);
    }
  }

  const mergedStyle: CSSProperties = {
    backgroundColor: color,
    ...style,
  };

  return (
    <span
      ref={ref}
      data-slot="color-swatch"
      data-color={color}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      data-interactive={interactive || undefined}
      role={role ?? (interactive ? "button" : "img")}
      tabIndex={tabIndex ?? (interactive ? 0 : undefined)}
      aria-pressed={interactive ? selected : undefined}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={handleKeyDown}
      style={mergedStyle}
      className={cn(
        colorSwatchVariants({
          size,
          shape,
          variant,
          interactive,
          selected,
          disabled,
        }),
        className,
      )}
      {...props}
    >
      {selected && !hideSelectedIcon && (
        <Check
          aria-hidden="true"
          className={cn("drop-shadow-sm", checkIconSizeClass[resolvedSize])}
          style={{ color: iconColor }}
          strokeWidth={3}
        />
      )}
    </span>
  );
}

ColorSwatch.displayName = "ColorSwatch";

export { ColorSwatch };

export interface ColorSwatchGroupProps extends ComponentProps<"div"> {
  /** Visual gap between swatches. Maps to Tailwind's gap scale. */
  gap?: "tight" | "default" | "loose";
  /** Optional accessible label for the entire group (e.g. "Theme color"). */
  label?: string;
}

const groupGapClass: Record<NonNullable<ColorSwatchGroupProps["gap"]>, string> = {
  tight: "gap-1",
  default: "gap-2",
  loose: "gap-3",
};

function ColorSwatchGroup({
  ref,
  className,
  children,
  gap = "default",
  label,
  role,
  "aria-label": ariaLabelProp,
  ...props
}: ColorSwatchGroupProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="color-swatch-group"
      role={role ?? "group"}
      aria-label={ariaLabelProp ?? label}
      className={cn("flex flex-wrap items-center", groupGapClass[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
}

ColorSwatchGroup.displayName = "ColorSwatchGroup";

export { ColorSwatchGroup };

export {
  colorSwatchVariants,
  colorSwatchSizeIds,
  colorSwatchShapeIds,
  colorSwatchVariantIds,
};
export type { ColorSwatchSize, ColorSwatchShape, ColorSwatchVariant };
