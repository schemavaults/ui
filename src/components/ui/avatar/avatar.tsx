"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  Fragment,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

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

export const avatarGroupSpacingIds = [
  "tight",
  "default",
  "loose",
] as const satisfies string[];
export type AvatarGroupSpacing = (typeof avatarGroupSpacingIds)[number];

export const avatarGroupDirectionIds = [
  "end",
  "start",
] as const satisfies string[];
export type AvatarGroupDirection = (typeof avatarGroupDirectionIds)[number];

// Overlap is a function of both avatar size and requested spacing so a group
// of xs avatars doesn't collapse into itself and a group of xl avatars doesn't
// look barely-overlapping.
const avatarGroupSpacingClasses: Record<
  AvatarSizeId,
  Record<AvatarGroupSpacing, string>
> = {
  xs: {
    tight: "-space-x-2.5",
    default: "-space-x-1.5",
    loose: "-space-x-1",
  },
  sm: {
    tight: "-space-x-3",
    default: "-space-x-2",
    loose: "-space-x-1",
  },
  default: {
    tight: "-space-x-4",
    default: "-space-x-3",
    loose: "-space-x-1.5",
  },
  lg: {
    tight: "-space-x-5",
    default: "-space-x-4",
    loose: "-space-x-2",
  },
  xl: {
    tight: "-space-x-6",
    default: "-space-x-5",
    loose: "-space-x-2.5",
  },
};

export interface AvatarGroupProps extends ComponentProps<"div"> {
  /**
   * Maximum number of avatars to show before rendering a `+N` overflow chip.
   * When omitted (or negative), all avatars are shown.
   */
  max?: number;
  /**
   * Sizes the overflow chip and controls the amount of overlap between
   * avatars. Wrapped `<Avatar>` children are not automatically resized —
   * pass a matching `size` on each child for a consistent group.
   */
  size?: AvatarSizeId;
  /** Shape used for the overflow chip. Defaults to `"circle"`. */
  shape?: AvatarShapeId;
  /** How much the avatars overlap each other. */
  spacing?: AvatarGroupSpacing;
  /**
   * Stack direction:
   * - `"end"` (default) — later avatars overlap earlier ones (last on top).
   * - `"start"` — earlier avatars overlap later ones (first on top).
   */
  direction?: AvatarGroupDirection;
  /**
   * Renders the content of the overflow chip. Called with the number of
   * hidden avatars. Defaults to `+N`.
   */
  renderOverflow?: (overflowCount: number) => ReactNode;
  /** Extra className applied to the overflow chip's `AvatarFallback`. */
  overflowClassName?: string;
}

function AvatarGroup({
  className,
  max,
  size = "default",
  shape = "circle",
  spacing = "default",
  direction = "end",
  renderOverflow,
  overflowClassName,
  children,
  ...props
}: AvatarGroupProps): ReactElement {
  const childArray = Children.toArray(children).filter(isValidElement);
  const hasLimit =
    typeof max === "number" && max >= 0 && childArray.length > max;
  const visibleChildren = hasLimit ? childArray.slice(0, max) : childArray;
  const overflowCount = hasLimit ? childArray.length - max : 0;

  const items: ReactNode[] = visibleChildren.map((child, idx) => (
    <Fragment key={`avatar-${idx}`}>{child}</Fragment>
  ));

  if (overflowCount > 0) {
    items.push(
      <Avatar
        key="avatar-overflow"
        size={size}
        shape={shape}
        aria-label={`${overflowCount} more`}
      >
        <AvatarFallback className={overflowClassName}>
          {renderOverflow
            ? renderOverflow(overflowCount)
            : `+${overflowCount}`}
        </AvatarFallback>
      </Avatar>,
    );
  }

  // Reversing the DOM order for direction="start" lets us keep the same
  // left-to-right visual order while flipping which avatar paints on top
  // (later DOM child paints on top by default).
  const orderedItems =
    direction === "start" ? [...items].reverse() : items;

  return (
    <div
      role="group"
      data-slot="avatar-group"
      data-direction={direction}
      className={cn(
        "isolate inline-flex items-center",
        direction === "start" ? "flex-row-reverse" : "flex-row",
        avatarGroupSpacingClasses[size][spacing],
        // Draw a ring around each avatar so overlapping edges read cleanly.
        // The ring follows each avatar's own border-radius, so square and
        // circle avatars both get a shape-correct outline.
        "[&>*]:ring-2 [&>*]:ring-background",
        className,
      )}
      {...props}
    >
      {orderedItems}
    </div>
  );
}
AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
