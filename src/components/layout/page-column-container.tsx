import type { PropsWithChildren, ReactElement } from "react";

export interface PageColumnContainerProps extends PropsWithChildren {

}

export function PageColumnContainer({ children }: PageColumnContainerProps): ReactElement {
  return (
    <main className='w-full bg-background justify-start flex flex-col items-center gap-4 px-2 sm:px-4 md:px-6'>
      { children }
    </main>
  )
}
