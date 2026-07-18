"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, CSSProperties, ReactElement } from "react";

import { cn } from "@/lib/utils";
import {
  watermarkDensityIds,
  watermarkLayoutIds,
  watermarkSizeIds,
  watermarkVariantIds,
  type WatermarkDensity,
  type WatermarkLayout,
  type WatermarkSize,
  type WatermarkVariant,
} from "./watermark-variants";

const watermarkVariants = cva(
  "pointer-events-none absolute inset-0 z-0 select-none overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-primary",
        secondary: "text-secondary-foreground",
        destructive: "text-destructive",
        success: "text-emerald-600 dark:text-emerald-500",
        warning: "text-warning",
        accent: "text-accent-foreground",
        muted: "text-muted-foreground",
      } satisfies Record<WatermarkVariant, string>,
    },
    defaultVariants: {
      variant: "muted",
    },
  },
);

const stampVariants = cva(
  "inline-flex items-center justify-center rounded font-black uppercase tracking-widest whitespace-nowrap",
  {
    variants: {
      size: {
        sm: "text-2xl px-3 py-0.5",
        default: "text-4xl px-4 py-1",
        lg: "text-6xl px-6 py-1.5",
        xl: "text-8xl px-8 py-2",
      } satisfies Record<WatermarkSize, string>,
      border: {
        true: "",
        false: "px-0 py-0",
      },
    },
    compoundVariants: [
      { border: true, size: "sm", className: "border-2" },
      { border: true, size: "default", className: "border-4" },
      { border: true, size: "lg", className: "border-4" },
      { border: true, size: "xl", className: "border-[6px]" },
    ],
    defaultVariants: { size: "default", border: true },
  },
);

const tileVariants = cva(
  "font-bold uppercase tracking-widest whitespace-nowrap",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
        xl: "text-xl",
      } satisfies Record<WatermarkSize, string>,
    },
    defaultVariants: { size: "default" },
  },
);

const densityGap: Record<WatermarkDensity, string> = {
  sparse: "gap-x-24 gap-y-20",
  default: "gap-x-16 gap-y-12",
  dense: "gap-x-8 gap-y-6",
};

const REPEAT_TILE_COUNT = 60;

export interface WatermarkProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof watermarkVariants> {
  /**
   * The watermark text label. Kept short (e.g. "DRAFT", "CONFIDENTIAL", "PROTOTYPE").
   * The parent container MUST have `position: relative` (and typically
   * `overflow: hidden`) for the watermark to sit correctly over the content.
   */
  content: string;
  /**
   * How the watermark is laid out over the container.
   * - `"repeat"` (default) tiles the text diagonally across the container.
   * - `"stamp"` renders a single large centered rotated stamp.
   */
  layout?: WatermarkLayout;
  /** Text size preset. Defaults to `"default"`. */
  size?: WatermarkSize;
  /**
   * For `layout="repeat"`, controls the spacing between tiles.
   * Ignored for `layout="stamp"`.
   */
  density?: WatermarkDensity;
  /** Rotation angle in degrees. Defaults to `-30`. */
  angle?: number;
  /**
   * Overrides the default opacity of the watermark layer (0-1).
   * Defaults to `0.12` for `"repeat"` and `0.18` for `"stamp"`.
   */
  opacity?: number;
  /**
   * For `layout="stamp"`, whether to render the classic bordered ink-stamp style.
   * Defaults to `true`; set to `false` for a plain rotated text stamp.
   */
  border?: boolean;
}

function Watermark({
  ref,
  className,
  content,
  variant = "muted",
  layout = "repeat",
  size = "default",
  density = "default",
  angle = -30,
  opacity,
  border = true,
  style,
  ...props
}: WatermarkProps): ReactElement {
  const resolvedOpacity = opacity ?? (layout === "stamp" ? 0.18 : 0.12);
  const combinedStyle: CSSProperties = {
    opacity: resolvedOpacity,
    ...style,
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="watermark"
      data-layout={layout}
      data-variant={variant ?? "muted"}
      data-size={size}
      className={cn(watermarkVariants({ variant }), className)}
      style={combinedStyle}
      {...props}
    >
      {layout === "stamp" ? (
        <div className="flex h-full w-full items-center justify-center">
          <div
            className={stampVariants({ size, border })}
            style={{ transform: `rotate(${angle}deg)` }}
          >
            {content}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "absolute top-1/2 left-1/2 flex h-[220%] w-[220%] flex-wrap items-center justify-center",
            densityGap[density],
          )}
          style={{
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            transformOrigin: "center",
          }}
        >
          {Array.from({ length: REPEAT_TILE_COUNT }).map((_, i) => (
            <span key={i} className={tileVariants({ size })}>
              {content}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

Watermark.displayName = "Watermark";

export {
  Watermark,
  watermarkVariants,
  watermarkLayoutIds,
  watermarkSizeIds,
  watermarkVariantIds,
  watermarkDensityIds,
};
export type {
  WatermarkLayout,
  WatermarkSize,
  WatermarkVariant,
  WatermarkDensity,
};

export default Watermark;
