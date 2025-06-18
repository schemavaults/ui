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
    <div className="min-h-full w-full schemavaults-themed-page-background">
      <div className="h-full absolute bg-blue-500 inset-0 bg-gradient-to-b from-red-500 to-transparent -z-10" />
      <div className={cn("relative z-0 w-full min-h-full", className)}>
        {children}
      </div>
    </div>
  );
}

export default ThemedPageBackground;
