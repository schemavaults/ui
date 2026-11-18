"use client";

import { useMemo } from "react";
import type { IDashboardSidebarOpenStateContextType } from "./dashboard-sidebar-open-state";
import { useIsMobile } from "@/components/hooks/use-mobile";
import useDashboardSidebarOpen from "./useDashboardSidebarOpen";

/**
 * Whether the sidebar is open, and whether the layout is showing its mobile
 * sidebar (the viewport is narrower than `md`).
 *
 * `mobile` comes from the viewport, read here in the calling component rather
 * than handed down through context. On a phone it is `false` while the page
 * hydrates — the server cannot know the viewport — and turns `true` right
 * after, which re-renders only the components that called this hook. The
 * returned object keeps its identity until one of the two values changes.
 */
export function useDashboardSidebarOpenState(): IDashboardSidebarOpenStateContextType {
  const open: boolean = useDashboardSidebarOpen();
  const mobile: boolean = useIsMobile();
  return useMemo(
    (): IDashboardSidebarOpenStateContextType => ({ open, mobile }),
    [open, mobile],
  );
}

export default useDashboardSidebarOpenState;
