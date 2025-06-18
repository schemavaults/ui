"use client";

import { cn } from "@/lib/utils";
import type { PropsWithChildren, ReactElement } from "react";

export interface PageColumnContainerProps extends PropsWithChildren {
  className?: string;
}

/**
 *
 * @param param0 PageColumnContainerProps
 *
 * @returns A container component that arranges children in a column with padding
 */
export function PageColumnContainer({
  children,
  ...props
}: PageColumnContainerProps): ReactElement {
  return (
    <main
      className={cn(
        "w-full bg-background",
        "justify-start flex flex-col items-center gap-4",
        "px-2 sm:px-4 md:px-6",
        "py-2 sm:py-4",
        props.className,
      )}
    >
      {children}
    </main>
  );
}

export default PageColumnContainer;
