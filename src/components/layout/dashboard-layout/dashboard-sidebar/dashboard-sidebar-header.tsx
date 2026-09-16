"use client";

import { AnimatePresence, m } from "@/framer-motion";
import type { ReactElement, ReactNode } from "react";
import { toggleDashboardLayoutCollapsedTransitionEasing } from "../toggle-dashboard-layout-collapsed-transition-time";
import useToggleDashboardLayoutCollapsedTransitionTime from "../useToggleDashboardLayoutCollapsedTransitionTime";
import useDashboardLayoutReducedMotion from "../useDashboardLayoutReducedMotion";
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

interface AnimatedBrandWordmarkProps {
  wordmark: ReactNode;
  Link: LinkComponentType;
  brandHref: string;
}

// Declared at module scope so its component identity is stable across
// renders of DashboardSidebarHeader. Previously this was an inner function
// declaration, which produced a new component type on every parent render
// and caused React to unmount/remount the wordmark — re-triggering the
// AnimatePresence enter animation on every navigation when used inside a
// Next.js layout.tsx.
function AnimatedBrandWordmark({
  wordmark,
  Link,
  brandHref,
}: AnimatedBrandWordmarkProps): ReactElement {
  const transitionTime: number =
    useToggleDashboardLayoutCollapsedTransitionTime();
  const reducedMotion: boolean = useDashboardLayoutReducedMotion();

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
          transition: {
            duration: transitionTime,
            ease: toggleDashboardLayoutCollapsedTransitionEasing,
            delay: 0,
          },
        },
        enter: {
          opacity: 1,
          scale: 1,
          display: "block",
          width: "auto",
          transition: {
            duration: transitionTime,
            ease: toggleDashboardLayoutCollapsedTransitionEasing,
            // Waits for the sidebar to be most of the way open before the
            // wordmark appears. Zero along with the duration when motion is
            // reduced, so the wordmark is simply there.
            delay: transitionTime / 1.5,
          },
        },
      }}
      initial="exit"
      animate="enter"
      exit="exit"
      layout={!reducedMotion}
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
  const size = useDashboardSidebarSizing();
  const { open, mobile } = useDashboardSidebarOpenState();
  const reducedMotion: boolean = useDashboardLayoutReducedMotion();
  const showWordmark: boolean = mobile || open;

  return (
    <m.header
      layout={!reducedMotion}
      style={{
        height: size.header_height,
      }}
      className={cn(
        "w-full",
        "flex flex-row flex-nowrap",
        "justify-start items-center bg-background",
        "overflow-hidden",
        "flex-shrink-0",
        "border-b"
      )}
    >
      <Link href={brandHref} className={cn(
        size.desktop_collapsed_width_classname,
        size.header_height_classname,
        "flex items-center justify-center",
        "flex-shrink-0"
      )}>{logo}</Link>

      <AnimatePresence initial={!mobile}>
        {showWordmark && (
          <AnimatedBrandWordmark
            key="animated-brand-wordmark"
            wordmark={wordmark}
            Link={Link}
            brandHref={brandHref}
          />
        )}
      </AnimatePresence>
    </m.header>
  );
}

export default DashboardSidebarHeader;
