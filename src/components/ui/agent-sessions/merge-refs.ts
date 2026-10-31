/**
 * Internal: one callback ref that forwards a node to several refs (object
 * refs and callback refs alike). Not re-exported from the package index.
 */

import type { MutableRefObject, Ref, RefCallback } from "react";

export function mergeRefs<T>(
  ...refs: ReadonlyArray<Ref<T> | undefined>
): RefCallback<T> {
  return (node: T | null): void => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref !== null && ref !== undefined) {
        (ref as MutableRefObject<T | null>).current = node;
      }
    }
  };
}
