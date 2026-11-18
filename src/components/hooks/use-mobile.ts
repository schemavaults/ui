"use client";

import { getScreenWidthBreakpoint } from "@/lib/getTailwindThemeScreenBreakpoint";
import { useSyncExternalStore } from "react";

/** Whether the viewport is narrower than one breakpoint, as an external store. */
interface MobileViewportStore {
  subscribe: (onChange: () => void) => () => void;
  getSnapshot: () => boolean;
}

/**
 * One store per breakpoint, shared by every component that asks about it.
 * The dashboard sidebar asks from each of its rows, and they can all listen
 * to a single `MediaQueryList`.
 */
const mobileViewportStores: Map<number, MobileViewportStore> = new Map<
  number,
  MobileViewportStore
>();

function getMobileViewportStore(mobileBreakpoint: number): MobileViewportStore {
  const existing: MobileViewportStore | undefined =
    mobileViewportStores.get(mobileBreakpoint);
  if (existing) {
    return existing;
  }
  let query: MediaQueryList | null = null;
  const store: MobileViewportStore = {
    subscribe: (onChange: () => void): (() => void) => {
      query ??= window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);
      const subscribed: MediaQueryList = query;
      subscribed.addEventListener("change", onChange);
      return (): void => subscribed.removeEventListener("change", onChange);
    },
    getSnapshot: (): boolean => window.innerWidth < mobileBreakpoint,
  };
  mobileViewportStores.set(mobileBreakpoint, store);
  return store;
}

/** The server cannot see the viewport, so it renders the desktop layout. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Whether the viewport is narrower than `mobileBreakpoint` (Tailwind's `md`
 * breakpoint, 768px, by default). Re-renders the component when the viewport
 * crosses it.
 *
 * The viewport is read during render, so a render on the client is right
 * from the start. The server render answers `false`, and so does hydration,
 * which has to produce the markup the server sent; React re-renders the
 * calling component straight after hydrating it only if the viewport says
 * otherwise. On a desktop the two agree and nothing re-renders.
 *
 * It used to read the viewport from a mount effect instead, which set state
 * once after every mount even when the answer did not change.
 */
export function useIsMobile(
  mobileBreakpoint: number = getScreenWidthBreakpoint("md"),
): boolean {
  const store: MobileViewportStore = getMobileViewportStore(mobileBreakpoint);
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerSnapshot,
  );
}

export default useIsMobile;
