export const validSplitPaneDirections = [
  "row",
  "col",
] as const satisfies readonly string[];

export type SplitPaneDirection = (typeof validSplitPaneDirections)[number];

export const defaultSplitPaneDirection =
  "col" as const satisfies SplitPaneDirection;
