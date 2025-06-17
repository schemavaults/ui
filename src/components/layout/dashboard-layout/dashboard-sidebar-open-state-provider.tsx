"use client";

import { useState, type PropsWithChildren, type ReactElement } from "react";
import {
  DashboardSidebarOpenStateContext,
  DashboardSidebarOpenStateDispatchContext,
} from "./dashboard-sidebar-open-state";
import { useIsMobile } from "@/components/hooks";

export interface DashboardSidebarOpenStateProviderProps
  extends PropsWithChildren {}

export function DashboardSidebarOpenStateProvider({
  children,
}: DashboardSidebarOpenStateProviderProps): ReactElement {
  const [open, setOpen] = useState<boolean>(false);

  const mobile: boolean = useIsMobile();

  return (
    <DashboardSidebarOpenStateContext.Provider value={{ open, mobile }}>
      <DashboardSidebarOpenStateDispatchContext.Provider
        value={function dispatchSetSidebarOpen(
          newSidebarOpenState: boolean,
        ): void {
          if (process.env.NODE_ENV === "development") {
            console.log(
              "[dispatchSetSidebarOpen] new open state: ",
              newSidebarOpenState,
            );
          }
          setOpen(newSidebarOpenState);
        }}
      >
        {children}
      </DashboardSidebarOpenStateDispatchContext.Provider>
    </DashboardSidebarOpenStateContext.Provider>
  );
}

export default DashboardSidebarOpenStateProvider;
