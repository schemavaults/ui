"use client";

import { m } from "@/framer-motion";
import { cn } from "@/lib/utils";
import type { ReactElement } from "react";

export interface OpacityGradientProps {
  className?: string;
}

export default function OpacityGradient({
  className,
}: OpacityGradientProps): ReactElement {
  return (
    <m.div
      initial={{
        opacity: 0,
      }}
      exit={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      className={cn(
        className,
        "bg-gradient-to-b from-transparent to-background",
      )}
    />
  );
}
