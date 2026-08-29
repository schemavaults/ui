"use client";

import { createContext, useContext } from "react";

import type { AvatarShapeId, AvatarSizeId } from "./avatar-variants";

export interface AvatarGroupContextValue {
  size: AvatarSizeId | null | undefined;
  shape: AvatarShapeId | null | undefined;
}

/**
 * Lets an `<AvatarGroup>` hand its `size` / `shape` down to the `<Avatar>`
 * children it wraps, so callers only have to declare the size once instead of
 * repeating it on every avatar (and on the `+N` overflow chip).
 *
 * An `<Avatar>` that sets its own `size` / `shape` always wins over the group.
 */
export const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(
  null,
);

export function useAvatarGroupContext(): AvatarGroupContextValue | null {
  return useContext(AvatarGroupContext);
}
