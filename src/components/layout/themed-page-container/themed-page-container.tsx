import ThemedPageBackground from "@/components/ui/themed-page-background";
import { PropsWithChildren, ReactElement } from "react";
import PageColumnContainer from "@/components/layout/page-column-container";
import { cn } from "@/lib/utils";

export interface ThemedPageContainerProps extends PropsWithChildren {
  backgroundClassName?: string;
  contentContainerClassName?: string;
}

/**
 *
 *
 * @param param0 ThemedPageContainerProps
 *
 * @returns A container that uses the <PageColumnContainer> and <ThemedPageContainer> components
 *
 * @see ThemedPageContainer
 *
 * @see PageColumnContainer
 */
export function ThemedPageContainer({
  children,
  ...props
}: ThemedPageContainerProps): ReactElement {
  return (
    <ThemedPageBackground
      className={cn(
        "min-h-full",
        "h-full",
        "py-2 px-2",
        "sm:px-4 sm:py-4",
        "md:px-6 md:py-6",
        "grow",
        "overflow-y-scroll",
        props.backgroundClassName,
      )}
    >
      <PageColumnContainer
        className={cn("rounded-lg", props.contentContainerClassName)}
      >
        {children}
      </PageColumnContainer>
    </ThemedPageBackground>
  );
}

export default ThemedPageContainer;
