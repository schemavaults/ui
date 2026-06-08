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
            onClick={(): void => {
              if (debug) {
                console.log(
                  "[DashboardSidebarItemRenderer] onClick(item), where item = ",
                  item,
                );
              }
              // Do NOT call e.preventDefault() here. The consumer-supplied
              // <Link> navigates from its `href`, and spec-compliant routers
              // (next/link, React Router, TanStack Router, ...) treat a click
              // whose default was prevented as "the handler is taking over —
              // don't navigate." Calling preventDefault therefore swallowed
              // every sidebar navigation. Collapsing the sidebar is a side
              // effect that must not cancel the click.
              //
              // Only eagerly collapse on mobile, where the sidebar is an
              // overlay Sheet that must get out of the way after a tap. On
              // desktop the sidebar is persistent chrome, so leave it open —
              // matching useCloseDashboardSidebarOnRouteChange, which likewise
              // only auto-closes on mobile.
              if (mobile) {
                setSidebarOpen(false);
              }
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
