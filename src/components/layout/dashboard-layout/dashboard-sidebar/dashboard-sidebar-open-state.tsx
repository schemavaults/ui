"use client";

import { createContext, Dispatch, SetStateAction } from "react";

export interface IDashboardSidebarOpenStateContextType {
  open: boolean;
  mobile: boolean | undefined;
}

export const DashboardSidebarOpenStateContext =
  createContext<IDashboardSidebarOpenStateContextType | null>(null);

export type DashboardSidebarOpenStateDispatchType = Dispatch<
  SetStateAction<boolean>
>;

export const DashboardSidebarOpenStateDispatchContext =
  createContext<DashboardSidebarOpenStateDispatchType>(() => {
    throw new Error(
      "Not within <DashboardSidebarOpenStateDispatchContext.Provider>!",
    );
  });
