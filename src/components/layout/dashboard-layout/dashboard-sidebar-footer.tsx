"use client";

import { SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { AnimatePresence, m } from "@/framer-motion";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import type { PropsWithChildren, ReactElement } from "react";

export interface DashboardSidebarFooterProps {
  Link: (
    props: PropsWithChildren<{ href: string; className?: string }>,
  ) => ReactElement;
}

export function DashboardSidebarFooter({
  Link,
}: DashboardSidebarFooterProps): ReactElement {
  const { state, open, isMobile } = useSidebar();
  const collapsed: boolean = !open || state === "collapsed";
  const showLabel: boolean = isMobile || !collapsed;

  return (
    <SidebarFooter className="bg-background">
      <Link
        className={cn(
          "flex flex-row text-gray-400 gap-2",
          "justify-start group-data-[collapsible=icon]:justify-center",
          "pb-2",
        )}
        href="#"
      >
        <Settings />
        <AnimatePresence>{showLabel && <m.p>Settings</m.p>}</AnimatePresence>
      </Link>
    </SidebarFooter>
  );
}

export default DashboardSidebarFooter;
