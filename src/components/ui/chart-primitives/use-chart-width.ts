"use client";

import type { CSSProperties, Ref, RefCallback } from "react";
import { useCallback } from "react";

import { useMeasuredWidth } from "@/components/hooks/use-measured-width";

/** A chart's `width` prop: pixels, or `"auto"` to fill (and follow) its container. */
export type ChartWidth = number | "auto";

/** Combines refs into one callback ref (React 19 cleanup semantics included). */
export function useMergedRefs<T>(
  ...refs: ReadonlyArray<Ref<T> | undefined>
): RefCallback<T> {
  return useCallback(
    (node: T | null): (() => void) => {
      const cleanups: Array<() => void> = [];
      for (const ref of refs) {
        if (typeof ref === "function") {
          const cleanup: void | (() => void) = ref(node);
          cleanups.push(
            typeof cleanup === "function" ? cleanup : (): void => void ref(null),
          );
        } else if (ref) {
          (ref as { current: T | null }).current = node;
          cleanups.push((): void => {
            (ref as { current: T | null }).current = null;
          });
        }
      }
      return (): void => {
        for (const cleanup of cleanups) cleanup();
      };
    },
    // The refs themselves are the dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}

export interface ChartWidthResult<T extends HTMLElement> {
  /** Attach to the chart's root element (merges the caller's `ref`). */
  ref: RefCallback<T>;
  /**
   * The width to draw at, or `null` while an `"auto"` chart has not been
   * measured yet: render the placeholder then.
   */
  width: number | null;
  isAuto: boolean;
  /**
   * Width styles for the root element: fixed pixels for a numeric width; for
   * `"auto"`, the container's full width with `contain: inline-size`, so the
   * drawing inside never props its container open and the chart can shrink.
   * The chart sets its own height.
   */
  rootStyle: CSSProperties;
  /** Classes that make an `"auto"` root a full-width block (merge after the variants). */
  rootClassName: string | undefined;
}

/**
 * Resolves a chart's `width` prop. A number (or `undefined`, meaning the
 * size preset's `defaultWidth`) is used as-is; `"auto"` measures the root
 * element and follows it on resize.
 */
export function useChartWidth<T extends HTMLElement = HTMLDivElement>(
  width: ChartWidth | undefined,
  defaultWidth: number,
  ref?: Ref<T>,
): ChartWidthResult<T> {
  const isAuto: boolean = width === "auto";
  const measured = useMeasuredWidth<T>();
  const rootRef: RefCallback<T> = useMergedRefs<T>(
    ref,
    isAuto ? measured.ref : undefined,
  );

  if (!isAuto) {
    const resolved: number = typeof width === "number" ? width : defaultWidth;
    return {
      ref: rootRef,
      width: resolved,
      isAuto,
      rootStyle: { width: resolved },
      rootClassName: undefined,
    };
  }
  return {
    ref: rootRef,
    width: measured.isMeasured ? measured.width : null,
    isAuto,
    rootStyle: { width: "100%", contain: "inline-size" },
    rootClassName: "flex w-full min-w-0 shrink",
  };
}
