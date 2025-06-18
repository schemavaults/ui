"use client";

import type { PropsWithChildren, ReactElement } from "react";
import { cn } from "@/lib/utils";

export interface ThemedPageBackgroundProps extends PropsWithChildren {
  className?: string;
}

export function ThemedPageBackground({
  className,
  children,
}: ThemedPageBackgroundProps): ReactElement {
  return (
    <div className="min-h-full w-full">
      <div className="absolute bg-blue-500 inset-0 bg-gradient-to-b from-red-500 to-transparent -z-10" />
      <div className={cn("relative z-0 w-full min-h-full", className)}>
        {children}
      </div>
    </div>
  );
}

export default ThemedPageBackground;
