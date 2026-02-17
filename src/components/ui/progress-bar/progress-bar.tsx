"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ReactElement, HTMLAttributes } from "react";

export const progressBarVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      size: {
        sm: "h-2",
        default: "h-3",
        lg: "h-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export const progressBarSizeIds = ["sm", "default", "lg"] as const;

export type ProgressBarSizeId = (typeof progressBarSizeIds)[number];

export interface ProgressBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role">,
    VariantProps<typeof progressBarVariants> {
  /** Current progress value (0-100) */
  value: number;
  /** Accessible label describing what the progress bar represents */
  label: string;
  /** Minimum value (defaults to 0) */
  min?: number;
  /** Maximum value (defaults to 100) */
  max?: number;
  /** Additional classes for the filled indicator */
  indicatorClassName?: string;
}

export function ProgressBar({
  value,
  label,
  min = 0,
  max = 100,
  size,
  className,
  indicatorClassName,
  ...props
}: ProgressBarProps): ReactElement {
  const clampedValue: number = Math.min(max, Math.max(min, value));
  const percentage: number = ((clampedValue - min) / (max - min)) * 100;

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={label}
      className={cn(progressBarVariants({ size }), className)}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300 ease-in-out",
          "bg-gradient-to-r from-schemavaults-brand-blue to-schemavaults-brand-red",
          indicatorClassName,
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

ProgressBar.displayName = "ProgressBar";
