"use client";

import { useContext } from "react";
import {
  DashboardSidebarOpenStateContext,
  type IDashboardSidebarOpenStateContextType,
} from "./dashboard-sidebar-open-state";

export function useDashboardSidebarOpenState(): IDashboardSidebarOpenStateContextType {
  const state = useContext(DashboardSidebarOpenStateContext);
  if (!state) {
    throw new Error(
      "Failed to load sidebar open/collapsed state! Is this hook being called within a <DashboardSidebarOpenStateContext.Provider />?",
    );
  }
  return state;
}

export default useDashboardSidebarOpenState;
