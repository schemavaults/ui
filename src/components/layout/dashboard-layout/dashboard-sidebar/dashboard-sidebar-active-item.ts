import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";
import type { DashboardSidebarItemGroupDefinition } from "./dashboard-sidebar-item-group";

/**
 * How the sidebar marks the menu item for the page currently being viewed.
 *
 * - `"highlight"` — a soft full-width fill behind the row, with a bold label.
 * - `"right-border"` — a thick bar along the row's right edge, with a bold
 *   label.
 * - `"color-shift"` — the icon and label turn blue and bold; no fill.
 * - `"tinted"` — a blue-tinted fill, a blue bar on the left edge, and a blue
 *   bold label.
 * - `"solid"` — an inset, rounded, solid pill in the primary colour, with the
 *   icon and label inverted on top of it.
 * - `"none"` — no visual treatment. The item is still exposed to assistive
 *   technology as the current page via `aria-current="page"`.
 */
export const DASHBOARD_SIDEBAR_ACTIVE_ITEM_STYLES = [
  "highlight",
  "right-border",
  "color-shift",
  "tinted",
  "solid",
  "none",
] as const;

export type DashboardSidebarActiveItemStyle =
  (typeof DASHBOARD_SIDEBAR_ACTIVE_ITEM_STYLES)[number];

export const DEFAULT_DASHBOARD_SIDEBAR_ACTIVE_ITEM_STYLE: DashboardSidebarActiveItemStyle =
  "highlight";

/**
 * Reduce an href to the path the sidebar compares on: the query string and
 * fragment are dropped, and trailing slashes are trimmed so `/settings/` and
 * `/settings` are the same page.
 *
 * Only root-relative paths take part in matching. Anything else — `#`, an
 * empty string, a relative path, or an absolute URL to another site — returns
 * `null` and is never marked active: the layout only knows the pathname of
 * the current page, not its origin, so it cannot tell whether such a link
 * points here.
 */
export function normalizeDashboardSidebarPath(href: string): string | null {
  const path: string = href.split("#")[0]!.split("?")[0]!;
  if (!path.startsWith("/") || path.startsWith("//")) {
    return null;
  }
  const trimmed: string = path.replace(/\/+$/, "");
  return trimmed.length > 0 ? trimmed : "/";
}

/**
 * Whether `currentPath` is the page at `itemPath` or a page nested beneath
 * it, e.g. `/settings/billing` is within `/settings`. The root path `/` only
 * matches itself; otherwise a "Home" item would claim every page.
 */
export function isDashboardSidebarPathWithin(
  itemPath: string,
  currentPath: string,
): boolean {
  if (currentPath === itemPath) {
    return true;
  }
  return itemPath !== "/" && currentPath.startsWith(`${itemPath}/`);
}

/**
 * Pick the single sidebar path that best describes the current page: the
 * longest item path that the current path equals or is nested beneath.
 * Longest-wins means that with both `/settings` and `/settings/billing` in
 * the menu, only "Billing" lights up on `/settings/billing`, while
 * `/settings/profile` (not in the menu) still falls back to "Settings".
 *
 * Returns the normalized path rather than an item, so that every item
 * pointing at that page is marked — a link can legitimately appear in two
 * groups.
 */
export function resolveActiveDashboardSidebarItemPath(
  entries: readonly (
    | DashboardSidebarItemDefinition
    | DashboardSidebarItemGroupDefinition
  )[],
  currentHref: string | null | undefined,
): string | null {
  if (typeof currentHref !== "string") {
    return null;
  }
  const currentPath: string | null = normalizeDashboardSidebarPath(currentHref);
  if (currentPath === null) {
    return null;
  }

  const items: readonly DashboardSidebarItemDefinition[] = entries.flatMap(
    (
      entry: DashboardSidebarItemDefinition | DashboardSidebarItemGroupDefinition,
    ): readonly DashboardSidebarItemDefinition[] =>
      entry.type === "dashboard-sidebar-item-group" ? entry.items : [entry],
  );

  let best: string | null = null;
  for (const item of items) {
    const itemPath: string | null = normalizeDashboardSidebarPath(item.url);
    if (
      itemPath !== null &&
      isDashboardSidebarPathWithin(itemPath, currentPath) &&
      (best === null || itemPath.length > best.length)
    ) {
      best = itemPath;
    }
  }

  return best;
}
