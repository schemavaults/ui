"use client";

import { createContext } from "react";

// Items within this context will render in a red font color
export const DashboardSidebarAdminOnlyItemsContext =
  createContext<boolean>(false);
