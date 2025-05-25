"use client";

import type { PropsWithChildren, ReactElement } from "react";
import { cn } from "@/lib/utils";

export interface ThemedPageBackgroundProps extends PropsWithChildren{
  className?: string;
}

export function ThemedPageBackground({ className, children }: ThemedPageBackgroundProps): ReactElement {
  return (
    <div className="bg-blue-500 min-h-screen w-full -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-red-500  to-transparent" />
      <div className={cn("relative z-10 w-full min-h-screen", className)}>{children}</div>
    </div>
  )
}