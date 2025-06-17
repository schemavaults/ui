"use client";

import { AnimatePresence, m } from "@/framer-motion";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import type { PropsWithChildren, ReactElement } from "react";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";

export interface DashboardSidebarFooterProps {
  Link: (
    props: PropsWithChildren<{ href: string; className?: string }>,
  ) => ReactElement;
}

export function DashboardSidebarFooter({
  Link,
}: DashboardSidebarFooterProps): ReactElement {
  const { open, mobile } = useDashboardSidebarOpenState();
  const showLabel: boolean = mobile || open;

  return (
    <footer className="bg-background">
      <Link
        className={cn(
          "w-full",
          "flex flex-row text-gray-400 gap-2",
          "justify-center",
          "p-2",
        )}
        href="#"
      >
        <Settings />
        <AnimatePresence>{showLabel && <m.p>Settings</m.p>}</AnimatePresence>
      </Link>
    </footer>
  );
}

export default DashboardSidebarFooter;
