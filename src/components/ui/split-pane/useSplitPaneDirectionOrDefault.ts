import { useMemo } from "react";
import {
  defaultSplitPaneDirection,
  type SplitPaneDirection,
} from "./split-pane-directions";

export function useSplitPaneDirectionOrDefault(
  dir?: SplitPaneDirection,
): SplitPaneDirection {
  return useMemo((): SplitPaneDirection => {
    if (typeof dir !== "string" && typeof dir !== "undefined") {
      throw new Error(
        "useSplitPaneDirectionOrDefault received invalid direction! Should be ('row'/'col'/undefined for default)",
      );
    }
    if (!dir) {
      return defaultSplitPaneDirection;
    }
    if (typeof dir !== "string" || dir.length !== 3) {
      throw new Error(
        "If defined, expect dir to be a 3 letter string ('row'/'col')",
      );
    }
    if (dir === "row") {
      return "row";
    } else if (dir === "col") {
      return "col";
    } else
      throw new Error(
        "Failed to determine direction for SplitPane component layout!",
      );
  }, [dir]);
}

export default useSplitPaneDirectionOrDefault;
