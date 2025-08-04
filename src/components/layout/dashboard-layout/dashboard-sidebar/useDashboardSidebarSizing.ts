"use client";

import { useContext } from "react";
import {
  DashboardLayoutSidebarSizeContext,
  type DashboardLayoutSidebarSizing,
} from "./dashboard-sidebar-sizing";

export function useDashboardSidebarSizing(): DashboardLayoutSidebarSizing {
  return useContext(DashboardLayoutSidebarSizeContext);
}

export default useDashboardSidebarSizing;
