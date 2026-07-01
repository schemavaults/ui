"use client";

import type { PropsWithChildren, ReactElement } from "react";
import { cn } from "@/lib/utils";
import { getSchemaVaultsBrandColor } from "@schemavaults/theme/brand_colors";

export interface ThemedPageBackgroundProps extends PropsWithChildren {
  /** Append classnames to the content container within the background gradient container */
  className?: string;

  /** Append classnames to the background gradient container */
  backgroundClassName?: string;

  /** Gradient colors. Tuple of [from, to]. Any CSS color string works. */
  gradientColors?: [from: string, to: string];
}

/**
 * @name ThemedPageBackground
 *
 * @param param0 ThemedPageBackgroundProps
 *
 * @returns A component that fills the background container with a colorful SchemaVaults-themed background; child content is displayed on top
 */
export function ThemedPageBackground({
  children,
  gradientColors = [
    getSchemaVaultsBrandColor("schemavaults-brand-red"),
    getSchemaVaultsBrandColor("schemavaults-brand-blue"),
  ] as const,
  ...props
}: ThemedPageBackgroundProps): ReactElement {
  if (
    !Array.isArray(gradientColors) ||
    typeof gradientColors[0] !== "string" ||
    typeof gradientColors[1] !== "string"
  ) {
    throw new TypeError(
      "Expected a [from, to] tuple containing classNames for the <ThemedPageBackground /> gradient!",
    );
  }
  const fromColor: string = gradientColors[0];
  const toColor: string = gradientColors[1];

  const backgroundClassNames: string[] = [
    "schemavaults-themed-page-background",
    "relative min-h-full w-full shrink-0",
  ];
  if (typeof props.backgroundClassName === "string") {
    backgroundClassNames.push(props.backgroundClassName);
  }

  return (
    <div
      className={backgroundClassNames.join(" ")}
      style={{
        backgroundImage: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
      }}
    >
      <div
        className={cn(
          "schemavaults-themed-page-background-internal-content",
          "relative z-10",
          "w-full min-h-full",
          props.className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default ThemedPageBackground;
