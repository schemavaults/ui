"use client";

import { useContext } from "react";
import { DashboardSidebarOpenContext } from "./dashboard-sidebar-open-state";

/**
 * Whether the sidebar is open, without `mobile`.
 *
 * For the layout's own components that do not care about the viewport —
 * above all the ones the page is rendered inside, which should not re-render
 * when the viewport is read after hydration.
 */
export function useDashboardSidebarOpen(): boolean {
  const open: boolean | null = useContext(DashboardSidebarOpenContext);
  if (open === null) {
    throw new Error(
      "Failed to load sidebar open/collapsed state! Is this hook being called within a <DashboardSidebarOpenStateProvider />?",
    );
  }
  return open;
}

export default useDashboardSidebarOpen;
