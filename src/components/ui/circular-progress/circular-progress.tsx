"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { m } from "@/framer-motion";
import { cn } from "@/lib/utils";
import type { ReactElement, ReactNode, HTMLAttributes } from "react";

export const circularProgressVariants = cva("relative inline-flex shrink-0", {
  variants: {
    size: {
      sm: "h-10 w-10",
      default: "h-16 w-16",
      lg: "h-24 w-24",
      xl: "h-32 w-32",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const circularProgressIndicatorVariants = cva(
  "transition-colors duration-300",
  {
    variants: {
      color: {
        default: "stroke-schemavaults-brand-blue",
        positive: "stroke-green-500",
        warning: "stroke-yellow-500",
        destructive: "stroke-red-500",
      },
    },
    defaultVariants: {
      color: "default",
    },
  },
);

export const circularProgressLabelVariants = cva(
  "absolute inset-0 flex items-center justify-center font-medium tabular-nums text-foreground",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export const circularProgressSizeIds = ["sm", "default", "lg", "xl"] as const;

export type CircularProgressSizeId = (typeof circularProgressSizeIds)[number];

export const circularProgressColorIds = [
  "default",
  "positive",
  "warning",
  "destructive",
] as const;

export type CircularProgressColorId =
  (typeof circularProgressColorIds)[number];

const SIZE_TO_PIXELS: Record<CircularProgressSizeId, number> = {
  sm: 40,
  default: 64,
  lg: 96,
  xl: 128,
};

const SIZE_TO_STROKE_WIDTH: Record<CircularProgressSizeId, number> = {
  sm: 4,
  default: 6,
  lg: 8,
  xl: 10,
};

export interface CircularProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role" | "color">,
    VariantProps<typeof circularProgressVariants>,
    VariantProps<typeof circularProgressIndicatorVariants> {
  /** Current progress value (0-100 by default; respects min/max) */
  value: number;
  /** Accessible label describing what the progress represents */
  label: string;
  /** Minimum value (defaults to 0) */
  min?: number;
  /** Maximum value (defaults to 100) */
  max?: number;
  /** Override the stroke width (in SVG user units). Defaults are size-aware. */
  strokeWidth?: number;
  /** When true (default), shows the percentage in the center of the ring */
  showValue?: boolean;
  /** Custom content to render in the center, overrides showValue */
  children?: ReactNode;
  /** Additional classes for the indicator (animated) circle stroke */
  indicatorClassName?: string;
  /** Additional classes for the track (background) circle stroke */
  trackClassName?: string;
  /** Additional classes for the centered label/content */
  labelClassName?: string;
}

export function CircularProgress({
  value,
  label,
  min = 0,
  max = 100,
  size,
  color,
  strokeWidth,
  showValue = true,
  children,
  className,
  indicatorClassName,
  trackClassName,
  labelClassName,
  ...props
}: CircularProgressProps): ReactElement {
  const resolvedSize: CircularProgressSizeId = size ?? "default";
  const pixelSize: number = SIZE_TO_PIXELS[resolvedSize];
  const resolvedStrokeWidth: number =
    strokeWidth ?? SIZE_TO_STROKE_WIDTH[resolvedSize];
  const radius: number = (pixelSize - resolvedStrokeWidth) / 2;
  const circumference: number = 2 * Math.PI * radius;

  const clampedValue: number = Math.min(max, Math.max(min, value));
  const percentage: number = ((clampedValue - min) / (max - min)) * 100;
  const targetOffset: number = circumference * (1 - percentage / 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={label}
      className={cn(circularProgressVariants({ size }), className)}
      {...props}
    >
      <svg
        viewBox={`0 0 ${pixelSize} ${pixelSize}`}
        className="h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          fill="none"
          strokeWidth={resolvedStrokeWidth}
          className={cn("stroke-secondary", trackClassName)}
        />
        <m.circle
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          fill="none"
          strokeWidth={resolvedStrokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            circularProgressIndicatorVariants({ color }),
            indicatorClassName,
          )}
        />
      </svg>
      {(children || showValue) && (
        <div
          className={cn(
            circularProgressLabelVariants({ size }),
            labelClassName,
          )}
          aria-hidden="true"
        >
          {children ?? `${Math.round(percentage)}%`}
        </div>
      )}
    </div>
  );
}

CircularProgress.displayName = "CircularProgress";
