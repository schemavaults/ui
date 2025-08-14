"use client";

import { useEffect } from "react";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import useDashboardSidebarOpenStateDispatch from "./useDashboardSidebarOpenStateDispatch";
import useDebug from "@/components/hooks/use-debug";

export function useCloseDashboardSidebarOnRouteChange(
  usePathname: () => string,
) {
  const debug: boolean = useDebug();
  const pathname: string = usePathname();
  const state = useDashboardSidebarOpenState();
  const setOpen = useDashboardSidebarOpenStateDispatch();

  useEffect((): void => {
    if (state.open) {
      if (debug) {
        console.log(
          "[useCloseDashboardSidebarOnRouteChange] Closing sidebar...",
        );
      }
      setOpen(false);
    }
  }, [pathname, setOpen, debug]);
}

export default useCloseDashboardSidebarOnRouteChange;
