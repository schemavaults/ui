"use client";

import { type VariantProps } from "class-variance-authority";
import {
  Children,
  useMemo,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

import { AvatarGroupContext } from "./avatar-group-context";
import {
  avatarGroupVariants,
  avatarVariants,
  type AvatarShapeId,
  type AvatarSizeId,
} from "./avatar-variants";

export interface AvatarGroupProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof avatarGroupVariants> {
  /**
   * Maximum number of avatars to render before collapsing the rest into a
   * `+N` overflow chip. Omit (or pass a number >= the child count) to render
   * every avatar. `0` renders the overflow chip only.
   */
  max?: number;
  /**
   * Total number of people represented by this group, when that is larger
   * than the number of avatars you actually have data for. Useful when the
   * server sends "the first 5 of 128 collaborators": pass those 5 as children
   * and `total={128}` to get a `+123` chip.
   *
   * Ignored when it is smaller than the number of rendered avatars.
   */
  total?: number;
  /** Size applied to every child avatar and to the overflow chip. */
  size?: AvatarSizeId | null;
  /** Shape applied to every child avatar, the overflow chip, and the rings. */
  shape?: AvatarShapeId | null;
  /**
   * Draw a `background`-colored ring around each avatar so overlapping
   * avatars stay visually separated. Defaults to `true`.
   */
  ring?: boolean;
  /** Extra classes for the `+N` overflow chip. */
  overflowClassName?: string;
  /**
   * Render your own overflow indicator (e.g. wrapped in a `Tooltip` listing
   * the hidden members). Receives the number of hidden avatars.
   */
  renderOverflow?: (overflowCount: number) => ReactNode;
  children?: ReactNode;
}

function AvatarGroup({
  className,
  max,
  total,
  size,
  shape,
  spacing,
  ring = true,
  overflowClassName,
  renderOverflow,
  children,
  ...props
}: AvatarGroupProps): ReactElement {
  // Children.toArray flattens fragments/nested arrays and drops nullish
  // children, so conditionally-rendered avatars no longer throw the `max`
  // accounting off the way a raw `Array.isArray(children)` check did.
  const childArray = Children.toArray(children);

  const visibleChildren =
    typeof max === "number" && max >= 0 ? childArray.slice(0, max) : childArray;

  const hiddenChildCount = childArray.length - visibleChildren.length;
  const overflowCount = Math.max(
    hiddenChildCount,
    typeof total === "number" ? total - visibleChildren.length : 0,
  );

  const contextValue = useMemo(() => ({ size, shape }), [size, shape]);

  const ringClassName = cn(
    "shrink-0",
    shape === "square" ? "rounded-md" : "rounded-full",
    ring && "ring-2 ring-background",
  );

  return (
    <AvatarGroupContext.Provider value={contextValue}>
      <div
        role="group"
        className={cn(avatarGroupVariants({ size, spacing }), className)}
        {...props}
      >
        {visibleChildren.map((child, index) => (
          <div
            key={
              typeof child === "object" && child !== null && "key" in child
                ? (child.key ?? index)
                : index
            }
            className={ringClassName}
          >
            {child}
          </div>
        ))}
        {overflowCount > 0 && (
          <div className={ringClassName}>
            {renderOverflow ? (
              renderOverflow(overflowCount)
            ) : (
              <span
                className={cn(
                  avatarVariants({ size, shape }),
                  "items-center justify-center bg-muted font-medium text-muted-foreground",
                  overflowClassName,
                )}
              >
                +{overflowCount}
              </span>
            )}
          </div>
        )}
      </div>
    </AvatarGroupContext.Provider>
  );
}
AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
