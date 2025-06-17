"use client";

import { cn } from "@/lib/utils";
import type { ReactElement } from "react";

export interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className }: WordmarkProps): ReactElement {
  return (
    <span
      className={cn(
        "text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-red-600 text-nowrap",
        className,
      )}
    >
      SchemaVaults
    </span>
  );
}

export default Wordmark;
