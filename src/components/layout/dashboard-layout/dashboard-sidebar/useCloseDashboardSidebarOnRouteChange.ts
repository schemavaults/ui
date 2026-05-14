"use client";

import { useEffect, useEffectEvent } from "react";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import useDashboardSidebarOpenStateDispatch from "./useDashboardSidebarOpenStateDispatch";
import useDebug from "@/components/hooks/use-debug";

// Close the mobile sidebar when the pathname changes. The pre-0.46.6 version
// listed `open` and `mobile` in the deps array alongside `pathname`, which
// meant the effect re-fired the moment the user tapped the mobile trigger
// (open: false -> true) and immediately closed the Sheet they just opened.
// Reading `mobile`/`open`/`setOpen`/`debug` via `useEffectEvent` keeps them
// out of the deps so the effect only runs on actual pathname transitions.
export function useCloseDashboardSidebarOnRouteChange(
  usePathname: () => string,
): void {
  const debug: boolean = useDebug();
  const pathname: string = usePathname();
  const state = useDashboardSidebarOpenState();
  const open: boolean = state.open;
  const mobile: boolean = state.mobile ?? false;
  const setOpen = useDashboardSidebarOpenStateDispatch();

  const closeIfOpenOnMobile = useEffectEvent((): void => {
    if (mobile && open) {
      if (debug) {
        console.log(
          "[useCloseDashboardSidebarOnRouteChange] Closing sidebar...",
        );
      }
      setOpen(false);
    }
  });

  useEffect((): void => {
    closeIfOpenOnMobile();
  }, [pathname]);
}

export default useCloseDashboardSidebarOnRouteChange;
