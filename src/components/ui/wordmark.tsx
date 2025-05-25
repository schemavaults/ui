"use client";

import { cn } from "@/lib/utils";
import type { ReactElement } from "react";

export function Wordmark({ className }: { className?: string }): ReactElement {
  return (
    <span
      className={cn("text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-red-600", className)}
    >
      SchemaVaults
    </span>
  )
}
