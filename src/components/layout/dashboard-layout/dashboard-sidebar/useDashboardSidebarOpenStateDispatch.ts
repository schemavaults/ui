"use client";

import { useContext } from "react";
import {
  DashboardSidebarOpenStateDispatchContext,
  type DashboardSidebarOpenStateDispatchType,
} from "./dashboard-sidebar-open-state";

export function useDashboardSidebarOpenStateDispatch(): DashboardSidebarOpenStateDispatchType {
  const dispatch: DashboardSidebarOpenStateDispatchType = useContext(
    DashboardSidebarOpenStateDispatchContext,
  );
  return dispatch;
}

export default useDashboardSidebarOpenStateDispatch;
