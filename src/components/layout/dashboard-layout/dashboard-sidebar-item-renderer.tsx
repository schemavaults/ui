"use client";

import type { PropsWithChildren, ReactElement, ReactNode } from "react";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

import { useSidebar } from "@/components/ui/sidebar";
import { AnimatePresence, m } from "@/framer-motion";
import toggleDashboardLayoutCollapsedTransitionTime from "./toggle-dashboard-layout-collapsed-transition-time";
import { cn } from "@/lib/utils";

function SidebarMenuItemTitle({
  item,
}: {
  item: DashboardSidebarItemDefinition;
}): ReactElement {
  return (
    <m.span
      key={`sidebar-menu-item-title-container-[${item.title}]`}
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        duration: toggleDashboardLayoutCollapsedTransitionTime,
      }}
    >
      {item.title}
    </m.span>
  );
}

export function DashboardSidebarItemRenderer({
  item,
  Link,
}: {
  item: DashboardSidebarItemDefinition;
  Link: (
    props: PropsWithChildren<{ href: string; className?: string }>,
  ) => ReactElement;
}): ReactElement {
  const { state, open, isMobile } = useSidebar();

  const collapsed: boolean = !open || state === "collapsed";
  const showItemLabel: boolean = isMobile || !collapsed;

  function TitleComponent(): ReactNode {
    if (!showItemLabel) {
      return null;
    }
    return <SidebarMenuItemTitle key={item.title} item={item} />;
  }

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <Link
          href={item.url}
          className={cn(
            "flex flex-row",
            "gap-2",
            "justify-start group-data-[collapsible=icon]:justify-center",
            "items-center flex-nowrap",
          )}
        >
          {item.icon}

          <AnimatePresence>
            <TitleComponent />
          </AnimatePresence>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default DashboardSidebarItemRenderer;
