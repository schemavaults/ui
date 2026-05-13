"use client";

import { useEffect } from "react";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import useDashboardSidebarOpenStateDispatch from "./useDashboardSidebarOpenStateDispatch";
import useDebug from "@/components/hooks/use-debug";

// Auto-closes the sidebar on route changes. Only acts on mobile — on desktop
// the sidebar's expanded/collapsed state is the user's preference and should
// persist across navigation. Closing the desktop sidebar on every route
// change would also re-animate the wordmark (via AnimatePresence) every
// navigation, which is undesirable.
export function useCloseDashboardSidebarOnRouteChange(
  usePathname: () => string,
): void {
  const debug: boolean = useDebug();
  const pathname: string = usePathname();
  const state = useDashboardSidebarOpenState();
  const open: boolean = state.open;
  const mobile: boolean = state.mobile ?? false;
  const setOpen = useDashboardSidebarOpenStateDispatch();

  useEffect((): void => {
    if (mobile && open) {
      if (debug) {
        console.log(
          "[useCloseDashboardSidebarOnRouteChange] Closing sidebar...",
        );
      }
      setOpen(false);
    }
  }, [pathname, open, mobile, setOpen, debug]);
}

export default useCloseDashboardSidebarOnRouteChange;
