import type { PropsWithChildren, ReactNode } from "react";
import type { CustomizableDashboardLayoutComponent } from "./customizable-dashboard-component-type";
import type {
  DashboardSidebarItemsAndGroupsDefinitions,
  DashboardLayoutSidebarSizing,
} from "./dashboard-sidebar";
import type { LinkComponentType } from "@/types/Link";
import type { DashboardLayoutReducedMotionSetting } from "./dashboard-layout-reduced-motion";

export interface DashboardLayoutProps extends PropsWithChildren {
  wordmark: ReactNode;
  logo: ReactNode;
  Link: LinkComponentType;
  brandHref: string;
  topBarTitle: string | CustomizableDashboardLayoutComponent;
  topBarButtons?: CustomizableDashboardLayoutComponent;
  sidebarFooterContent?: CustomizableDashboardLayoutComponent;
  sidebarItems: DashboardSidebarItemsAndGroupsDefinitions;
  sizing?: DashboardLayoutSidebarSizing;
  /**
   * Width of the sidebar while it is open (expanded) on desktop viewports, as
   * any CSS length (e.g. `"18rem"`, `"260px"`, `"20vw"`). Defaults to
   * `14rem`. Use a wider value to fit long link titles on one line, or a
   * narrower one for compact menus.
   *
   * The value is applied through the `--dashboard-sidebar-open-width` CSS
   * custom property, so any length works without a matching Tailwind class
   * having to exist. The main content area shifts to match. The collapsed
   * (icon-only) desktop width and the mobile Sheet width are unaffected; use
   * `sizing` to change those.
   */
  sidebarOpenWidth?: string;
  onOpenSidebar?: () => void;
  onCloseSidebar?: () => void;
  /**
   * Optional `usePathname` hook (e.g. from `next/navigation`). When provided,
   * the mobile sidebar will automatically close whenever the pathname
   * changes. Pass the hook itself, not its return value.
   */
  usePathname?: () => string;
  /**
   * When `true`, the dashboard "chrome" (the left sidebar and the top header
   * bar) is hidden from printed output via `@media print`, so the system print
   * dialog renders only the main page content. The on-screen layout is
   * unaffected. The main content area also expands to the full page width when
   * printing so it is not offset by the now-hidden sidebar. Defaults to
   * `false`, preserving the previous print behaviour.
   */
  printHidden?: boolean;
  /**
   * How the layout decides whether to animate — the sidebar expanding and
   * collapsing, the content area sliding across, the wordmark and group
   * labels fading in, and the mobile sidebar's slide-in.
   *
   * - `"user"` (default) — honour the `prefers-reduced-motion` media query:
   *   every one of those movements becomes an instant state change when the
   *   viewer has asked their OS for reduced motion.
   * - `"always"` — never animate. Use this to drive the layout from an
   *   in-app "reduce motion" preference.
   * - `"never"` — always animate, even when the OS asks otherwise.
   *
   * The setting is applied through Framer Motion's `MotionConfig`, so it also
   * reaches motion components rendered in `children`, `topBarButtons` and
   * `sidebarFooterContent`. Wrap a subtree in your own `MotionConfig` to opt
   * part of the page back out.
   */
  reducedMotion?: DashboardLayoutReducedMotionSetting;
}
