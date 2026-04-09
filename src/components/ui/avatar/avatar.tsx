"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { ComponentProps, ReactElement } from "react";

export const avatarSizeIds = ["xs", "sm", "default", "lg", "xl"] as const satisfies string[];
export type AvatarSizeId = (typeof avatarSizeIds)[number];

export const avatarShapeIds = ["circle", "square"] as const satisfies string[];
export type AvatarShapeId = (typeof avatarShapeIds)[number];

export const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-xs",
        default: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      } satisfies Record<AvatarSizeId, string>,
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
      } satisfies Record<AvatarShapeId, string>,
    },
    defaultVariants: {
      size: "default",
      shape: "circle",
    },
  },
);

export interface AvatarProps
  extends ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

function Avatar({
  className,
  size,
  shape,
  ...props
}: AvatarProps): ReactElement {
  return (
    <AvatarPrimitive.Root
      className={cn(avatarVariants({ size, shape, className }))}
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

export interface AvatarGroupProps extends ComponentProps<"div"> {
  /** Maximum number of avatars to show before the +N overflow */
  max?: number;
}

function AvatarGroup({
  className,
  max,
  children,
  ...props
}: AvatarGroupProps): ReactElement {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleChildren = max ? childArray.slice(0, max) : childArray;
  const overflowCount = max ? childArray.length - max : 0;

  return (
    <div
      className={cn("flex -space-x-3", className)}
      {...props}
    >
      {visibleChildren.map((child, index) => (
        <div key={index} className="ring-2 ring-background rounded-full">
          {child}
        </div>
      ))}
      {overflowCount > 0 && (
        <div className="ring-2 ring-background rounded-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
            +{overflowCount}
          </div>
        </div>
      )}
    </div>
  );
}
AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
