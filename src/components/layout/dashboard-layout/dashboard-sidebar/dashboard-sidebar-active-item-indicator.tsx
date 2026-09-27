"use client";

import type { CSSProperties, ReactElement } from "react";
import { m } from "@/framer-motion";
import { cn } from "@/lib/utils";

/**
 * The two accent colours of the active row's gradient. Each reads a theme
 * token and falls back to the SchemaVaults brand colour, so the row renders
 * the same with a theme that predates the tokens; with one that defines
 * `--sidebar-active-start` / `--sidebar-active-end`, a deployment re-themes
 * the gradient through them.
 */
const ACTIVE_START_COLOR: string =
  "var(--sidebar-active-start, var(--schemavaults-brand-blue))";
const ACTIVE_END_COLOR: string =
  "var(--sidebar-active-end, var(--schemavaults-brand-red))";

/**
 * An accent made safe for text and icons. The accents are picked for
 * vibrancy, not legibility — the default brand blue is 2.5:1 on white — so
 * text uses each one mixed 60/40 with the page foreground. That darkens it on
 * a light background and lightens it on a dark one: the default pair reads at
 * 5.6:1 or better on the tinted row in both modes.
 */
function legibleAccent(accent: string): string {
  return `color-mix(in oklab, ${accent} 60%, hsl(var(--foreground)))`;
}

/** Colour for the active row's icon, which draws in `currentColor`. */
export const DASHBOARD_SIDEBAR_ACTIVE_ICON_STYLE: CSSProperties = {
  color: legibleAccent(ACTIVE_START_COLOR),
};

/** The active row's label: bold, with the gradient clipped to its glyphs. */
export const DASHBOARD_SIDEBAR_ACTIVE_LABEL_CLASSNAME: string =
  "font-semibold bg-clip-text text-transparent";
export const DASHBOARD_SIDEBAR_ACTIVE_LABEL_STYLE: CSSProperties = {
  backgroundImage: `linear-gradient(90deg, ${legibleAccent(ACTIVE_START_COLOR)}, ${legibleAccent(ACTIVE_END_COLOR)})`,
};

// How strongly the fill is tinted. Set per mode by the classes on the fill: a
// dark background needs more of the accent for the same visible wash.
const TINT: string = "var(--dashboard-sidebar-active-tint)";

// A wash of the start colour that shades into the end colour and fades out
// before the row's right edge.
const FILL_STYLE: CSSProperties = {
  backgroundImage: `linear-gradient(90deg, color-mix(in oklab, ${ACTIVE_START_COLOR} ${TINT}, transparent), color-mix(in oklab, ${ACTIVE_END_COLOR} calc(${TINT} * 0.75), transparent) 70%, transparent)`,
};

// A pill down the left edge running from one accent to the other, with a soft
// glow of each around it.
const BAR_STYLE: CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${ACTIVE_START_COLOR}, ${ACTIVE_END_COLOR})`,
  boxShadow: `0 -2px 10px color-mix(in oklab, ${ACTIVE_START_COLOR} 55%, transparent), 0 4px 12px color-mix(in oklab, ${ACTIVE_END_COLOR} 40%, transparent)`,
};

export interface DashboardSidebarActiveItemIndicatorProps {
  reducedMotion: boolean;
}

/**
 * The decoration painted behind the active row's icon and label: a gradient
 * wash across the row and a glowing gradient bar on its left edge. The bar
 * grows in from its centre and the wash fades in when a row becomes active.
 *
 * Render it as the first child of the row's link. Both layers are absolutely
 * positioned with a negative z-index, so the link must be `relative isolate`:
 * they then sit above the link's own hover background but beneath its
 * content, and never shift the icon column or the label.
 */
export function DashboardSidebarActiveItemIndicator({
  reducedMotion,
}: DashboardSidebarActiveItemIndicatorProps): ReactElement {
  const duration: number = reducedMotion ? 0 : 0.3;
  return (
    <>
      <m.span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 pointer-events-none",
          "[--dashboard-sidebar-active-tint:16%] dark:[--dashboard-sidebar-active-tint:24%]",
        )}
        style={FILL_STYLE}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration }}
      />
      <m.span
        aria-hidden="true"
        className="absolute inset-y-1 left-0 w-1 -z-10 rounded-r-full pointer-events-none"
        style={BAR_STYLE}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration, ease: "easeOut" }}
      />
    </>
  );
}

export default DashboardSidebarActiveItemIndicator;
