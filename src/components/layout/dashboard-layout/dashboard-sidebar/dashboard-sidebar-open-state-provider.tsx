"use client";

import {
  useCallback,
  useInsertionEffect,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import {
  DashboardSidebarOpenContext,
  DashboardSidebarOpenStateDispatchContext,
  type DashboardSidebarOpenStateDispatchType,
} from "./dashboard-sidebar-open-state";

export interface DashboardSidebarOpenStateProviderProps
  extends PropsWithChildren {
  onOpenSidebar?: () => void;
  onCloseSidebar?: () => void;
}

type DashboardSidebarOpenStateCallbacks = Pick<
  DashboardSidebarOpenStateProviderProps,
  "onOpenSidebar" | "onCloseSidebar"
>;

/**
 * Holds whether the sidebar is open, for everything inside the layout.
 *
 * Both values it provides keep their identity until the sidebar is actually
 * opened or closed — see `DashboardSidebarOpenContext` for why. Neither a
 * re-render of the layout nor new `onOpenSidebar` / `onCloseSidebar`
 * callbacks (inline arrow functions, say) hand out new ones.
 */
export function DashboardSidebarOpenStateProvider({
  children,
  onOpenSidebar,
  onCloseSidebar,
}: DashboardSidebarOpenStateProviderProps): ReactElement {
  const [open, setOpen] = useState<boolean>(false);

  // The dispatch below reads the latest callbacks from here rather than
  // depending on them, so that it never has to be recreated. Updated in an
  // insertion effect, which runs before any layout effect, so a child that
  // opens the sidebar from its own layout effect already calls the new ones.
  const callbacksRef = useRef<DashboardSidebarOpenStateCallbacks>({
    onOpenSidebar,
    onCloseSidebar,
  });
  useInsertionEffect((): void => {
    callbacksRef.current = { onOpenSidebar, onCloseSidebar };
  });

  const dispatch: DashboardSidebarOpenStateDispatchType = useCallback(
    (newOpenState: boolean): void => {
      setOpen(newOpenState);
      const callbacks: DashboardSidebarOpenStateCallbacks =
        callbacksRef.current;
      if (newOpenState && typeof callbacks.onOpenSidebar === "function") {
        try {
          callbacks.onOpenSidebar();
        } catch (e: unknown) {
          console.error("Uncaught error in onOpenSidebar handler: ", e);
        }
      }
      if (!newOpenState && typeof callbacks.onCloseSidebar === "function") {
        try {
          callbacks.onCloseSidebar();
        } catch (e: unknown) {
          console.error("Uncaught error in onCloseSidebar handler: ", e);
        }
      }
    },
    [],
  );

  return (
    <DashboardSidebarOpenContext.Provider value={open}>
      <DashboardSidebarOpenStateDispatchContext.Provider value={dispatch}>
        {children}
      </DashboardSidebarOpenStateDispatchContext.Provider>
    </DashboardSidebarOpenContext.Provider>
  );
}

export default DashboardSidebarOpenStateProvider;
