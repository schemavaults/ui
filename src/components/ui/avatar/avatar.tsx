"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { ComponentProps, ReactElement } from "react";

import { useAvatarGroupContext } from "./avatar-group-context";
import { avatarVariants } from "./avatar-variants";

export {
  avatarVariants,
  avatarSizeIds,
  avatarShapeIds,
  avatarGroupVariants,
  avatarGroupSpacingIds,
} from "./avatar-variants";
export type {
  AvatarSizeId,
  AvatarShapeId,
  AvatarGroupSpacingId,
} from "./avatar-variants";

// Re-exported so that `AvatarGroup` keeps resolving from `./avatar` for any
// consumer that deep-imports this module directly.
export { AvatarGroup } from "./avatar-group";
export type { AvatarGroupProps } from "./avatar-group";

export interface AvatarProps
  extends ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

function Avatar({
  className,
  size,
  shape,
  ...props
}: AvatarProps): ReactElement {
  // Inherit sizing from a surrounding <AvatarGroup> unless this avatar was
  // given an explicit size/shape of its own.
  const group = useAvatarGroupContext();

  return (
    <AvatarPrimitive.Root
      className={cn(
        avatarVariants({
          size: size ?? group?.size,
          shape: shape ?? group?.shape,
          className,
        }),
      )}
      {...props}
    />
  );
}
Avatar.displayName = "Avatar";

export interface AvatarImageProps
  extends ComponentProps<typeof AvatarPrimitive.Image> {}

function AvatarImage({ className, ...props }: AvatarImageProps): ReactElement {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
}
AvatarImage.displayName = "AvatarImage";

export interface AvatarFallbackProps
  extends ComponentProps<typeof AvatarPrimitive.Fallback> {}

function AvatarFallback({
  className,
  ...props
}: AvatarFallbackProps): ReactElement {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex h-full w-full items-center justify-center bg-muted font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
