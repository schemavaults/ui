"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, CSSProperties, ReactElement } from "react";

import { cn } from "@/lib/utils";

export const aspectRatioPresetIds = [
  "square",
  "video",
  "photo",
  "wide",
  "ultrawide",
  "cinema",
  "portrait",
  "classic-portrait",
  "story",
] as const satisfies string[];
export type AspectRatioPresetId = (typeof aspectRatioPresetIds)[number];

/** Named, common aspect ratios resolved to width / height. */
export const ASPECT_RATIO_PRESETS: Record<AspectRatioPresetId, number> = {
  square: 1, // 1:1 - avatars, profile tiles, album art
  video: 16 / 9, // 16:9 - HD video, modern displays
  photo: 4 / 3, // 4:3 - classic photo / older displays
  wide: 3 / 2, // 3:2 - DSLR photography
  ultrawide: 21 / 9, // 21:9 - cinematic / banner heros
  cinema: 2.35 / 1, // ~2.35:1 - anamorphic widescreen
  portrait: 3 / 4, // 3:4 - portrait photo
  "classic-portrait": 2 / 3, // 2:3 - portrait DSLR
  story: 9 / 16, // 9:16 - vertical / mobile story
};

export const aspectRatioRadiusIds = [
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "full",
] as const satisfies string[];
export type AspectRatioRadiusId = (typeof aspectRatioRadiusIds)[number];

export const aspectRatioVariants = cva(
  "relative w-full overflow-hidden [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>video]:h-full [&>video]:w-full [&>video]:object-cover [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0",
  {
    variants: {
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
      } satisfies Record<AspectRatioRadiusId, string>,
      bordered: {
        true: "border border-border",
        false: "",
      },
    },
    defaultVariants: {
      radius: "md",
      bordered: false,
    },
  },
);

export interface AspectRatioProps
  extends Omit<ComponentProps<"div">, "ratio">,
    VariantProps<typeof aspectRatioVariants> {
  /**
   * Aspect ratio as `width / height` (e.g. `16 / 9` for widescreen).
   * Takes precedence over `preset`. If neither is provided, defaults to `video` (16:9).
   */
  ratio?: number;
  /**
   * Named ratio preset. Use `ratio` for arbitrary values.
   * - `square` (1:1) - avatars, tiles
   * - `video` (16:9) - HD video / modern displays
   * - `photo` (4:3) - classic photo
   * - `wide` (3:2) - DSLR
   * - `ultrawide` (21:9) - cinematic banners
   * - `cinema` (~2.35:1) - anamorphic widescreen
   * - `portrait` (3:4)
   * - `classic-portrait` (2:3)
   * - `story` (9:16) - vertical / mobile story
   */
  preset?: AspectRatioPresetId;
  /** Render as the child element via Radix Slot. */
  asChild?: boolean;
}

function AspectRatio({
  className,
  ratio,
  preset,
  radius,
  bordered,
  asChild = false,
  style,
  children,
  ...props
}: AspectRatioProps): ReactElement {
  const Comp = asChild ? Slot : "div";
  const resolvedRatio: number =
    ratio ??
    (preset !== undefined
      ? ASPECT_RATIO_PRESETS[preset]
      : ASPECT_RATIO_PRESETS.video);

  const mergedStyle: CSSProperties = {
    aspectRatio: String(resolvedRatio),
    ...style,
  };

  return (
    <Comp
      data-slot="aspect-ratio"
      data-preset={preset}
      className={cn(aspectRatioVariants({ radius, bordered }), className)}
      style={mergedStyle}
      {...props}
    >
      {children}
    </Comp>
  );
}
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
