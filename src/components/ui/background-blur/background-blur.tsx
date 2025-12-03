"use client";

import { cn } from "@/lib/utils";
import type { FC, ReactElement } from "react";

export const backgroundBlurIntensityVariants = [
  "xs",
  "sm",
  "default",
  "md",
  "lg",
  "xl",
] as const satisfies readonly string[];
export type BackgroundBlurIntensityVariant =
  (typeof backgroundBlurIntensityVariants)[number];

export interface BackgroundBlurProps {
  intensity?: BackgroundBlurIntensityVariant;
  background?: FC;
  foreground?: FC;
}

function Blur({
  variant = "default",
  className,
}: {
  variant: BackgroundBlurIntensityVariant;
  className?: string;
}): ReactElement {
  let blurClassName: string;
  switch (variant) {
    case "xs":
      blurClassName = "backdrop-blur-xs";
      break;
    case "sm":
      blurClassName = "backdrop-blur-sm";
      break;
    case "md":
      blurClassName = "backdrop-blur-md";
      break;
    case "lg":
      blurClassName = "backdrop-blur-lg";
      break;
    case "xl":
      blurClassName = "backdrop-blur-xl";
      break;
    default:
      if (variant !== "default" && typeof variant !== "undefined") {
        throw new Error("Invalid/unhandled background blur intensity variant!");
      }
      blurClassName = "backdrop-blur";
      break;
  }

  return <div className={cn("bg-background/80", blurClassName, className)} />;
}

export function BackgroundBlur({
  background,
  foreground,
  intensity = "default",
}: BackgroundBlurProps): ReactElement {
  const BackgroundComponent: FC | undefined = background;
  const ForegroundComponent: FC | undefined = foreground;

  return (
    <div className={cn("w-full h-full", "grid grid-cols-1 grid-rows-1")}>
      <div
        className={cn(
          "col-start-1 col-end-2",
          "row-start-1 row-end-2",
          "w-full h-full",
          "overflow-hidden -z-10",
        )}
      >
        {BackgroundComponent && <BackgroundComponent />}
      </div>

      <Blur
        variant={intensity satisfies BackgroundBlurIntensityVariant}
        className={cn(
          "col-start-1 col-end-2",
          "row-start-1 row-end-2",
          "w-full h-full",
          "z-0",
        )}
      />

      <div
        className={cn(
          "col-start-1 col-end-2",
          "row-start-1 row-end-2",
          "w-full h-full",
          "overflow-hidden z-10",
        )}
      >
        {ForegroundComponent && <ForegroundComponent />}
      </div>
    </div>
  );
}

export default BackgroundBlur;
