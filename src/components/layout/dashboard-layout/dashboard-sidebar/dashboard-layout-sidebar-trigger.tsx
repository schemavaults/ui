"use client";

import { Button } from "@/components/ui";
import { SidebarOpen, SidebarClose } from "lucide-react";
import type { ReactElement } from "react";
import useDashboardSidebarOpen from "./useDashboardSidebarOpen";
import { AnimatePresence } from "@/framer-motion";
import useDashboardSidebarOpenStateDispatch from "./useDashboardSidebarOpenStateDispatch";

const sidebarTriggerIconClassName: string = "h-4 w-4";

export function DashboardLayoutSidebarTrigger(): ReactElement {
  const open: boolean = useDashboardSidebarOpen();
  const setOpen = useDashboardSidebarOpenStateDispatch();

  return (
    <Button
      variant={"ghost"}
      onClick={(e): void => {
        e.preventDefault();
        setOpen(!open);
      }}
      className="flex justify-center items-center"
    >
      <AnimatePresence mode="wait">
        {open ? (
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
