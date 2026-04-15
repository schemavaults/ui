"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";

import { cn } from "@/lib/utils";
import {
  type SpinnerSize,
  type SpinnerVariant,
  spinnerSizeIds,
  spinnerVariantIds,
} from "./spinner-variants";

/**
 * Visual styling for the spinning circle itself. Border color uses
 * `border-current` so the color is inherited from the wrapping element's
 * text color (set by the variant).
 */
const spinnerCircleVariants = cva(
  "inline-block rounded-full border-solid border-current border-r-transparent animate-spin motion-reduce:animate-[spin_1.5s_linear_infinite] align-[-0.125em]",
  {
    variants: {
      size: {
        xs: "h-3 w-3 border-2",
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-[3px]",
        lg: "h-8 w-8 border-4",
        xl: "h-12 w-12 border-4",
      } satisfies Record<SpinnerSize, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const spinnerLabelSizes = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
} as const satisfies Record<SpinnerSize, string>;

const spinnerWrapperGapSizes = {
  xs: "gap-1.5",
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
  xl: "gap-3.5",
} as const satisfies Record<SpinnerSize, string>;

const spinnerVariantColors = {
  default: "text-foreground",
  primary: "text-primary",
  secondary: "text-secondary-foreground",
  brand: "text-schemavaults-brand-blue",
  destructive: "text-destructive",
  warning: "text-warning",
  muted: "text-muted-foreground",
} as const satisfies Record<SpinnerVariant, string>;

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "role" | "aria-label">,
    VariantProps<typeof spinnerCircleVariants> {
  /**
   * Color/intent variant. Defaults to "default" (foreground).
   */
  variant?: SpinnerVariant;
  /**
   * Accessible label describing what is loading. Announced to screen readers.
   * Defaults to "Loading".
   */
  label?: string;
  /**
   * If true, the label is rendered visibly next to the spinner.
   * If false (default), the label is only available to screen readers.
   */
  showLabel?: boolean;
  /**
   * Optional content rendered alongside the spinner. When provided, the
   * content is rendered visibly and replaces the default visible label.
   * The wrapping element retains the spinner's color so any nested text
   * inherits it automatically.
   */
  children?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

function Spinner({
  className,
  size,
  variant,
  label = "Loading",
  showLabel = false,
  children,
  ref,
  ...props
}: SpinnerProps): ReactElement {
  const resolvedSize: SpinnerSize = size ?? "md";
  const resolvedVariant: SpinnerVariant = variant ?? "default";
  const colorClass: string = spinnerVariantColors[resolvedVariant];
  const hasVisibleContent: boolean = showLabel || children !== undefined;

  if (!hasVisibleContent) {
    return (
      <span
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label={label}
        data-slot="spinner"
        className={cn("inline-flex items-center", colorClass, className)}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(spinnerCircleVariants({ size: resolvedSize }))}
        />
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  const visibleLabel: ReactNode = children ?? label;

  return (
    <span
      ref={ref}
      role="status"
      aria-live="polite"
      data-slot="spinner"
      className={cn(
        "inline-flex items-center",
        spinnerWrapperGapSizes[resolvedSize],
        colorClass,
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(spinnerCircleVariants({ size: resolvedSize }))}
      />
      <span className={cn("font-medium", spinnerLabelSizes[resolvedSize])}>
        {visibleLabel}
      </span>
    </span>
  );
}
Spinner.displayName = "Spinner";

export {
  Spinner,
  spinnerCircleVariants,
  spinnerSizeIds,
  spinnerVariantIds,
};
export type { SpinnerSize, SpinnerVariant };

export default Spinner;
