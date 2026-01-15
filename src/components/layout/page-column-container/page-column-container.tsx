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
        "page-column-container",
        "grow",
        "flex flex-col",
        "justify-start items-stretch",
        props.className,
      )}
    >
      {children}
    </main>
  );
}

export default PageColumnContainer;
