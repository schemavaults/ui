"use client";

import ThemedPageBackground from "@/components/ui/themed-page-background";
import { PropsWithChildren, ReactElement } from "react";
import PageColumnContainer from "@/components/layout/page-column-container";
import { cn } from "@/lib/utils";

export interface ThemedPageContainerProps extends PropsWithChildren {
  backgroundClassName?: string;
  contentContainerClassName?: string;
  // Added to default content container class name
  additionalContentContainerClassName?: string;
}

/**
 *
 *
 * @param param0 ThemedPageContainerProps
 *
 * @returns A container that uses the PageColumnContainer and ThemedPageContainer components
 *
 * @see ThemedPageContainer
 *
 * @see PageColumnContainer
 */
export function ThemedPageContainer({
  children,
  ...props
}: ThemedPageContainerProps): ReactElement {
  const defaultBackgroundClassName: string = cn(
    "min-h-full",
    "p-2 sm:p-4 lg:p-6",
  );

  const defaultContentContainerClassName: string = cn(
    "rounded-lg",
    "gap-2 sm:gap-4 lg:gap-6",
    props.additionalContentContainerClassName,
  );

  const backgroundContentClassName: string =
    typeof props.backgroundClassName === "string"
      ? props.backgroundClassName
      : defaultBackgroundClassName;
  const contentContainerClassName: string =
    typeof props.contentContainerClassName === "string"
      ? cn(
          props.contentContainerClassName,
          props.additionalContentContainerClassName,
        )
      : defaultContentContainerClassName;

  return (
    <ThemedPageBackground
      className={cn(
        "grow",
        "overflow-y-scroll no-scrollbar",
        "flex flex-col items-stretch justify-start",
        backgroundContentClassName,
      )}
      backgroundClassName={undefined}
    >
      <PageColumnContainer className={contentContainerClassName}>
        {children}
      </PageColumnContainer>
    </ThemedPageBackground>
  );
}

export default ThemedPageContainer;
