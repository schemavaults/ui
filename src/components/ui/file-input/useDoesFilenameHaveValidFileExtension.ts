"use client";

import { useCallback } from "react";

export function useDoesFilenameHaveValidFileExtension(opts: {
  expectedFileExtensions?: readonly `.${string}`[];
}) {
  const doesFilenameHaveValidFileExtension = useCallback(
    (filename: string) => {
      if (
        typeof opts.expectedFileExtensions === "undefined" ||
        !opts.expectedFileExtensions
      ) {
        return true;
      }

      if (!Array.isArray(opts.expectedFileExtensions)) {
        throw new Error(
          "Expected there to be a list of valid file extensions if this point was reached!",
        );
      } else if (opts.expectedFileExtensions.length === 0) {
        throw new Error(
          "Expected 'expectedFileExtensions' to be non-empty, if supplied!",
        );
      }

      if (
        !opts.expectedFileExtensions.every((ext: string) => ext.startsWith("."))
      ) {
        throw new Error(
          "Expected every file extension in 'expectedFileExtensions' to start with a '.'!",
        );
      }

      if (
        opts.expectedFileExtensions.some((ext: string) => {
          return filename.endsWith(ext);
        })
      ) {
        return true;
      }
      return false;
    },
    [opts.expectedFileExtensions],
  );

  return doesFilenameHaveValidFileExtension;
}
