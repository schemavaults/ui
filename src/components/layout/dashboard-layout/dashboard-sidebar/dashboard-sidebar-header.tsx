"use client";

import { AnimatePresence, m } from "@/framer-motion";
import type { ReactElement, ReactNode } from "react";
import toggleDashboardLayoutCollapsedTransitionTime, {
  toggleDashboardLayoutCollapsedTransitionEasing,
} from "../toggle-dashboard-layout-collapsed-transition-time";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import { cn } from "@/lib/utils";
import { useDashboardSidebarSizing } from "./useDashboardSidebarSizing";
import type { LinkComponentType } from "@/types/Link";

export interface DashboardLayoutSidebarHeaderProps {
  wordmark: ReactNode;
  logo: ReactNode;
  Link: LinkComponentType;
  brandHref: string;
}

export function DashboardSidebarHeader({
  wordmark,
  logo,
  Link,
  brandHref,
}: DashboardLayoutSidebarHeaderProps): ReactElement {
  const size = useDashboardSidebarSizing();
  const { open, mobile } = useDashboardSidebarOpenState();
  const showWordmark: boolean = mobile || open;
  

  function AnimatedBrandWordmark(): ReactElement {
    return (
      <m.div
        className="will-change-transform"
        variants={{
          exit: {
            opacity: 0,
            scale: 0,
            transitionEnd: {
              display: "none",
            },
            width: 0,
          },
          enter: {
            opacity: 1,
            scale: 1,
            display: "block",
            width: "auto",
          },
        }}
        initial="exit"
        animate="enter"
        exit="exit"
        transition={{
          duration: toggleDashboardLayoutCollapsedTransitionTime,
          ease: toggleDashboardLayoutCollapsedTransitionEasing,
          delay: toggleDashboardLayoutCollapsedTransitionTime / 1.5,
        }}
        layout
      >
        <Link href={brandHref}>{wordmark}</Link>
      </m.div>
    );
  }

  return (
    <m.header
      layout
      style={{
        height: size.header_height,
      }}
      className={cn(
        "w-full",
        "flex flex-row flex-nowrap",
        "justify-start items-center bg-background",
        "overflow-hidden",
      )}
    >
      <Link href={brandHref} className={cn(
        size.desktop_collapsed_classname,
        size.header_height_classname,
        "flex items-center justify-center",
        "flex-shrink-0"
      )}>{logo}</Link>

      <AnimatePresence>
        {showWordmark && (
          <AnimatedBrandWordmark key="animated-brand-wordmark" />
        )}
      </AnimatePresence>
    </m.header>
  );
}

export default DashboardSidebarHeader;
