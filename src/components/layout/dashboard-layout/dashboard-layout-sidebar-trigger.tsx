"use client";

import { Button } from "@/components/ui";
import { SidebarOpen, SidebarClose } from "lucide-react";
import { ReactElement, useContext } from "react";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import { AnimatePresence } from "@/framer-motion";
import { DashboardSidebarOpenStateDispatchContext } from "./dashboard-sidebar-open-state";

const sidebarTriggerIconClassName: string = "h-4 w-4";

export function DashboardLayoutSidebarTrigger(): ReactElement {
  const openState = useDashboardSidebarOpenState();
  const setOpen = useContext(DashboardSidebarOpenStateDispatchContext);

  return (
    <Button
      variant={"ghost"}
      onClick={(e): void => {
        e.preventDefault();
        setOpen(!openState.open);
      }}
      className="flex justify-center items-center"
    >
      <AnimatePresence mode="wait">
        {openState.open ? (
          <SidebarClose
            className={sidebarTriggerIconClassName}
            key="close-sidebar-icon"
          />
        ) : (
          <SidebarOpen className={sidebarTriggerIconClassName} />
        )}
      </AnimatePresence>
    </Button>
  );
}

export default DashboardLayoutSidebarTrigger;
