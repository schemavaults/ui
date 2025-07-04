"use client";

import { type Dispatch, type SetStateAction, useContext } from "react";
import { DashboardSidebarOpenStateDispatchContext } from "./dashboard-sidebar-open-state";

export function useDashboardSidebarOpenStateDispatch(): Dispatch<
  SetStateAction<boolean>
> {
  return useContext(DashboardSidebarOpenStateDispatchContext);
}

export default useDashboardSidebarOpenStateDispatch;
