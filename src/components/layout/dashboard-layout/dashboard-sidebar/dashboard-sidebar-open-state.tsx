"use client";

import { createContext } from "react";

export interface IDashboardSidebarOpenStateContextType {
  open: boolean;
  mobile: boolean | undefined;
}

/**
 * Whether the sidebar is open, or `null` outside
 * `DashboardSidebarOpenStateProvider`.
 *
 * Every provider between `DashboardLayout` and its `children` sits above the
 * page, so none of them may publish a new value while the page is hydrating:
 * React cannot tell whether a Suspense boundary that is still waiting to
 * hydrate reads the context, so it discards the boundary's server HTML and
 * renders it again on the client. That is why this context carries a plain
 * boolean, which only changes when the sidebar is opened or closed, and why
 * `mobile` is not in it at all: the server cannot know the viewport, so on a
 * phone it changes right after hydration. `useDashboardSidebarOpenState`
 * reads `mobile` from the viewport in each component that asks for it.
 */
export const DashboardSidebarOpenContext = createContext<boolean | null>(null);

export type DashboardSidebarOpenStateDispatchType = (
  openState: boolean,
) => void;

/**
 * Opens or closes the sidebar. The provider hands out one function for its
 * whole lifetime, for the same reason as above.
 */
export const DashboardSidebarOpenStateDispatchContext =
  createContext<DashboardSidebarOpenStateDispatchType>(
    (openState: boolean): void => {
      void openState;
      throw new Error(
        "Not within <DashboardSidebarOpenStateDispatchContext.Provider>!",
      );
    },
  );
