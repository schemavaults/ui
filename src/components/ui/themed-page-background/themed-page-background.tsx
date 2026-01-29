"use client";

import type { PropsWithChildren, ReactElement } from "react";
import { cn } from "@/lib/utils";

export interface ThemedPageBackgroundProps extends PropsWithChildren {
  /** Append classnames to the content container within the background gradient container */
  className?: string;
  /** Append classnames to the background gradient container */
  backgroundClassName?: string;
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
  ...props
}: ThemedPageBackgroundProps): ReactElement {
  const backgroundClassNames: string[] = [
    "schemavaults-themed-page-background",
    "relative min-h-full w-full",
    "bg-schemavaults-brand-blue bg-gradient-to-b from-schemavaults-brand-red to-transparent",
  ];
  if (typeof props.backgroundClassName === "string") {
    backgroundClassNames.push(props.backgroundClassName);
  }

  return (
    <div className={backgroundClassNames.join(" ")}>
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
