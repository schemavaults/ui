"use client";

import { SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { AnimatePresence, m } from "@/framer-motion";
import type { PropsWithChildren, ReactElement, ReactNode } from "react";
import toggleDashboardLayoutCollapsedTransitionTime from "./toggle-dashboard-layout-collapsed-transition-time";

export interface DashboardLayoutSidebarHeaderProps {
  wordmark: ReactNode;
  logo: ReactNode;
  Link: (
    props: PropsWithChildren<{ href: string; className?: string }>,
  ) => ReactElement;
  brandHref: string;
}

function AnimateInWordmark({
  wordmark,
  Link,
  brandHref,
}: {
  wordmark: ReactNode;
  Link: (
    props: PropsWithChildren<{ href: string; className?: string }>,
  ) => ReactElement;
  brandHref: string;
}) {
  const { state, open, isMobile } = useSidebar();
  const collapsed: boolean = !open || state === "collapsed";
  const showWordmark = isMobile || !collapsed;

  if (!showWordmark) {
    return null;
  }
  return (
    <m.div
      initial={{ opacity: 1, scaleX: 1 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0, scaleX: 0 }}
      transition={{
        duration: toggleDashboardLayoutCollapsedTransitionTime,
      }}
    >
      <Link href={brandHref}>{wordmark}</Link>
    </m.div>
  );
}

export function DashboardSidebarHeader({
  wordmark,
  logo,
  Link,
  brandHref,
}: DashboardLayoutSidebarHeaderProps): ReactElement {
  return (
    <SidebarHeader className="flex flex-row gap-2 justify-start items-center bg-background">
      <Link href={brandHref}>{logo}</Link>
      <AnimatePresence>
        <AnimateInWordmark
          wordmark={wordmark}
          Link={Link}
          brandHref={brandHref}
        />
      </AnimatePresence>
    </SidebarHeader>
  );
}

export default DashboardSidebarHeader;
