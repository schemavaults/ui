"use client";

import { useCallback, useLayoutEffect, useState, type RefCallback } from "react";

export interface UseMeasuredWidthResult<T extends HTMLElement> {
  /** Attach to the element whose width should be tracked. */
  ref: RefCallback<T>;
  /**
   * The element's content-box width in whole pixels (rounded down, so a chart
   * drawn at this width never overflows it), or `fallbackWidth` until the
   * first measurement.
   */
  width: number;
  /**
   * `false` for the server render and the first client render, `true` once
   * the element has been laid out with a non-zero width. Render a placeholder
   * until then instead of drawing at the fallback width.
   */
  isMeasured: boolean;
}

function contentBoxWidth(element: HTMLElement): number {
  const rect: DOMRect = element.getBoundingClientRect();
  const style: CSSStyleDeclaration = window.getComputedStyle(element);
  const horizontalChrome: number =
    parseFloat(style.paddingLeft) +
    parseFloat(style.paddingRight) +
    parseFloat(style.borderLeftWidth) +
    parseFloat(style.borderRightWidth);
  return rect.width - (Number.isFinite(horizontalChrome) ? horizontalChrome : 0);
}

/**
 * Tracks an element's rendered width with a `ResizeObserver`, for drawing an
 * SVG chart at the width of its container.
 *
 * The server render and the first client render both report
 * `fallbackWidth` with `isMeasured: false`, so hydration stays clean; the
 * element is then measured in a layout effect, before the browser paints,
 * and again whenever it resizes. A width of `0` (an element inside a
 * `display: none` tab, say) is ignored and the last good width kept.
 *
 * The element must get its width from its container (a block, `w-full`),
 * not from its content, or it cannot shrink below what it draws. The chart
 * components also set `contain: inline-size` on it for that reason.
 */
export function useMeasuredWidth<T extends HTMLElement = HTMLDivElement>(
  fallbackWidth: number = 0,
): UseMeasuredWidthResult<T> {
  const [element, setElement] = useState<T | null>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);

  const ref: RefCallback<T> = useCallback((node: T | null): void => {
    setElement(node);
  }, []);

  useLayoutEffect((): (() => void) | undefined => {
    if (!element) return undefined;

    const update = (width: number): void => {
      const whole: number = Math.floor(width);
      if (whole > 0) setMeasuredWidth(whole);
    };

    update(contentBoxWidth(element));

    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(
      (entries: ResizeObserverEntry[]): void => {
        const entry: ResizeObserverEntry | undefined = entries[0];
        if (entry) update(entry.contentRect.width);
      },
    );
    observer.observe(element);
    return (): void => {
      observer.disconnect();
    };
  }, [element]);

  return {
    ref,
    width: measuredWidth ?? fallbackWidth,
    isMeasured: measuredWidth !== null,
  };
}

export default useMeasuredWidth;
