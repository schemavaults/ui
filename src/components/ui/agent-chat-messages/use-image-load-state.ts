"use client";

/** Internal: load tracking shared by `AgentChatImage` and its viewer. */

import { useCallback, useState } from "react";

export type ImageLoadStatus = "loading" | "loaded" | "error";

export interface ImageLoadState {
  status: ImageLoadStatus;
  onLoad: () => void;
  onError: () => void;
  /** Ref for the `<img>`, catching an image that loaded before `onLoad` was attached. */
  imgRef: (node: HTMLImageElement | null) => void;
}

/**
 * Tracks whether `src` has loaded. The settled state remembers which source
 * it settled for, so a new `src` reads as loading again without an effect.
 */
export function useImageLoadState(src: string): ImageLoadState {
  const [settled, setSettled] = useState<{
    src: string;
    status: Exclude<ImageLoadStatus, "loading">;
  } | null>(null);

  const onLoad = useCallback((): void => {
    setSettled({ src, status: "loaded" });
  }, [src]);
  const onError = useCallback((): void => {
    setSettled({ src, status: "error" });
  }, [src]);

  // A cached image, or one that finished before hydration, may never fire
  // `load` at a handler attached after the fact.
  const imgRef = useCallback(
    (node: HTMLImageElement | null): void => {
      if (node?.complete && node.naturalWidth > 0) onLoad();
    },
    [onLoad],
  );

  return {
    status: settled?.src === src ? settled.status : "loading",
    onLoad,
    onError,
    imgRef,
  };
}
