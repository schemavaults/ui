"use client";

import type { PropsWithChildren, ReactElement } from "react";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";

import { AnimatePresence, m } from "@/framer-motion";
import toggleDashboardLayoutCollapsedTransitionTime from "./toggle-dashboard-layout-collapsed-transition-time";
import { cn } from "@/lib/utils";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import useDashboardSidebarSizing from "./useDashboardSidebarSizing";

export function DashboardSidebarItemRenderer({
  item,
  Link,
}: {
  item: DashboardSidebarItemDefinition;
  Link: (
    props: PropsWithChildren<{ href: string; className?: string }>,
  ) => ReactElement;
}): ReactElement {
  const { open, mobile } = useDashboardSidebarOpenState();
  const sizes = useDashboardSidebarSizing();

  const showItemLabel: boolean = mobile || open;

  const IconComponent = item.icon;

  function SidebarMenuItemTitle(): ReactElement {
    return (
      <m.span
        key={`sidebar-menu-item-title-container-[${item.title}]`}
        initial={{
          opacity: 1,
          scale: 1,
          transitionEnd: {
            display: "none",
          },
          paddingLeft: 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          display: "block",
          paddingLeft: sizes.sidebar_menu_item_icon_gap,
        }}
        exit={{
          opacity: 0,
          scale: 0,
          transitionEnd: {
            display: "none",
          },
          paddingLeft: 0,
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
    <m.li key={item.title} className={cn("w-full")}>
      <Link
        href={item.url}
        className={cn(
          "flex flex-row",
          "w-full",
          "hover:bg-gray-200",
          "rounded-md",
          "p-1 md:p-2",
        )}
      >
        <m.div
          layout
          className={cn(
            "w-full",
            "flex flex-row flex-nowrap",
            "justify-start items-center",
            "text-nowrap",
          )}
          variants={{
            expanded: {
              justifyContent: "start",
            },
            collapsed: {
              justifyContent: "center",
            },
          }}
          animate={mobile ? "expanded" : open ? "expanded" : "collapsed"}
        >
          <IconComponent className="h-6 w-6" />

          <AnimatePresence>
            {showItemLabel && <SidebarMenuItemTitle key={item.title} />}
          </AnimatePresence>
        </m.div>
      </Link>
    </m.li>
  );
}

export default DashboardSidebarItemRenderer;
