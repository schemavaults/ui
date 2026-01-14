"use client";

import { useContext, type ReactElement } from "react";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";

import { AnimatePresence, m } from "@/framer-motion";
import toggleDashboardLayoutCollapsedTransitionTime from "../toggle-dashboard-layout-collapsed-transition-time";
import { cn } from "@/lib/utils";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import useDashboardSidebarSizing from "./useDashboardSidebarSizing";
import { DashboardSidebarAdminOnlyItemsContext } from "./dashboard-sidebar-admin-only-items-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
} from "@/components/ui";
import type { LinkComponentType } from "@/types/Link";
import useDashboardSidebarOpenStateDispatch from "./useDashboardSidebarOpenStateDispatch";
import useDebug from "@/components/hooks/use-debug";
import type { SidebarItemIconComponent } from "./dashboard-sidebar-item-icon-component";

export function DashboardSidebarItemRenderer({
  item,
  Link,
}: {
  item: DashboardSidebarItemDefinition;
  Link: LinkComponentType;
}): ReactElement {
  const debug: boolean = useDebug();
  const { open, mobile } = useDashboardSidebarOpenState();
  const setSidebarOpen = useDashboardSidebarOpenStateDispatch();
  const sizes = useDashboardSidebarSizing();
  const isAdminItemGroup: boolean = useContext(
    DashboardSidebarAdminOnlyItemsContext,
  );
  const showItemLabel: boolean = mobile || open;

  const IconComponent: SidebarItemIconComponent = item.icon;
  const itemColorClassName: string = isAdminItemGroup
    ? "text-red-500"
    : "text-foreground";

  function SidebarMenuItemTitle(): ReactElement {
    return (
      <m.span
        key={`sidebar-menu-item-title-container-[${item.title}]`}
        className={cn(
          itemColorClassName,
          "text-nowrap",
        )}
        initial={{
          opacity: 1,
          scale: 1,
          transitionEnd: {
            display: "none",
          },
        }}
        animate={{
          opacity: 1,
          scale: 1,
          display: "block",
        }}
        exit={{
          opacity: 0,
          scale: 0,
          transitionEnd: {
            display: "none",
          },
        }}
        transition={{
          duration: toggleDashboardLayoutCollapsedTransitionTime,
        }}
      >
        {item.title}
      </m.span>
    );
  }

  return (
    <m.li
      key={item.title}
      className={cn(
        "w-full",
        sizes.sidebar_menu_item_height_classname,
      )}
    >
      <Tooltip>
        <TooltipTrigger className={cn("w-full h-full")}>
          <Link
            href={item.url}
            className={cn(
              "flex flex-row flex-nowrap",
              "justify-start items-center",
              "w-full h-full",
              "hover:bg-gray-200",
            )}
            onClick={(e): void => {
              e.preventDefault();
              if (debug) {
                console.log(
                  "[DashboardSidebarItemRenderer] onClick(item), where item = ",
                  item,
                );
              }
              setSidebarOpen(false);
            }}
          >
            <m.div className={cn(
              "flex-shrink-0",
              sizes.desktop_collapsed_width_classname,
              "flex items-center justify-center"
            )}>
              <IconComponent className={cn("h-6 w-6", itemColorClassName)} />
            </m.div>

            <AnimatePresence>
              {showItemLabel && <SidebarMenuItemTitle key={item.title} />}
            </AnimatePresence>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          {item.title}
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </m.li>
  );
}

export default DashboardSidebarItemRenderer;
