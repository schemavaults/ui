"use client";

import { createContext } from "react";

export interface IDashboardSidebarOpenStateContextType {
  open: boolean;
  mobile: boolean | undefined;
}

export const DashboardSidebarOpenStateContext =
  createContext<IDashboardSidebarOpenStateContextType | null>(null);

export type DashboardSidebarOpenStateDispatchType = (
  openState: boolean,
) => void;

export const DashboardSidebarOpenStateDispatchContext =
  createContext<DashboardSidebarOpenStateDispatchType>(
    (openState: boolean): void => {
      void openState;
      throw new Error(
        "Not within <DashboardSidebarOpenStateDispatchContext.Provider>!",
      );
    },
  );
