"use client";

import { useState, type PropsWithChildren, type ReactElement } from "react";
import {
  DashboardSidebarOpenStateContext,
  DashboardSidebarOpenStateDispatchContext,
} from "./dashboard-sidebar-open-state";
import { useIsMobile } from "@/components/hooks";

export interface DashboardSidebarOpenStateProviderProps
  extends PropsWithChildren {
  onOpenSidebar?: () => void;
  onCloseSidebar?: () => void;
}

export function DashboardSidebarOpenStateProvider({
  children,
  onOpenSidebar,
  onCloseSidebar,
}: DashboardSidebarOpenStateProviderProps): ReactElement {
  const [open, setOpen] = useState<boolean>(false);

  const mobile: boolean = useIsMobile();

  return (
    <DashboardSidebarOpenStateContext.Provider value={{ open, mobile }}>
      <DashboardSidebarOpenStateDispatchContext.Provider
        value={(newOpenState: boolean): void => {
          setOpen(newOpenState);
          if (newOpenState && typeof onOpenSidebar === "function") {
            try {
              onOpenSidebar();
            } catch (e: unknown) {
              console.error("Uncaught error in onOpenSidebar handler: ", e);
            }
          }
          if (!newOpenState && typeof onCloseSidebar === "function") {
            try {
              onCloseSidebar();
            } catch (e: unknown) {
              console.error("Uncaught error in onCloseSidebar handler: ", e);
            }
          }
          return;
        }}
      >
        {children}
      </DashboardSidebarOpenStateDispatchContext.Provider>
    </DashboardSidebarOpenStateContext.Provider>
  );
}

export default DashboardSidebarOpenStateProvider;
