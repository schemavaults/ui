"use client";

import type { PropsWithChildren, ReactElement } from "react";
import { cn } from "@/lib/utils";

export interface ThemedPageBackgroundProps extends PropsWithChildren {
  className?: string;
}

/**
 * @name ThemedPageBackground
 *
 * @param param0 ThemedPageBackgroundProps
 *
 * @returns A component that fills the background container with a colorful SchemaVaults-themed background; child content is displayed on top
 */
export function ThemedPageBackground({
  className,
  children,
}: ThemedPageBackgroundProps): ReactElement {
  return (
    <div
      className={[
        "schemavaults-themed-page-background",
        "relative min-h-full w-full",
        "bg-schemavaults-brand-blue bg-gradient-to-b from-schemavaults-brand-red to-transparent",
      ].join(" ")}
    >
      <div className={cn("relative z-10 w-full min-h-full", className)}>
        {children}
      </div>
    </div>
  );
}

export default ThemedPageBackground;
