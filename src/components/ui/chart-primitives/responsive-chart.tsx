"use client";

import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";

import { useMeasuredWidth } from "@/components/hooks/use-measured-width";
import { cn } from "@/lib/utils";

import { useMergedRefs } from "./use-chart-width";

export interface ResponsiveChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The chart's height in pixels; also the placeholder's height before the first measurement. */
  height: number;
  /** Draws the chart at the container's current width. */
  children: (width: number) => ReactNode;
  /** Optional ref forwarded to the container element. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * The building block behind every chart's `width="auto"`, for custom charts:
 * a full-width container that measures itself and calls `children` with its
 * width, again on every resize.
 *
 * Until the first measurement (the server render and the first client
 * render) it is an empty placeholder at `height`, so the server HTML holds
 * no pixel width and no tick labels, and nothing jumps from a guessed width
 * to the real one. The container sets `contain: inline-size` so the drawing
 * never holds its parent open; give it a parent whose width does not depend
 * on its content (a block, a card, a grid cell).
 */
function ResponsiveChart({
  height,
  children,
  className,
  style,
  ref,
  ...props
}: ResponsiveChartProps): ReactElement {
  const measured = useMeasuredWidth<HTMLDivElement>();
  const containerRef = useMergedRefs<HTMLDivElement>(ref, measured.ref);
  return (
    <div
      ref={containerRef}
      data-slot="responsive-chart"
      data-measured={measured.isMeasured ? "true" : "false"}
      className={cn("relative w-full min-w-0", className)}
      style={{ minHeight: height, contain: "inline-size", ...style }}
      {...props}
    >
      {measured.isMeasured ? children(measured.width) : null}
    </div>
  );
}
ResponsiveChart.displayName = "ResponsiveChart";

export { ResponsiveChart };
