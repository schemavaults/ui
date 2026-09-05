"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  Children,
  createContext,
  Fragment,
  isValidElement,
  useContext,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";

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

export interface AvatarGroupContextValue {
  size: AvatarSizeId;
  shape: AvatarShapeId;
}

/**
 * Lets an <AvatarGroup> hand its `size` / `shape` down to the <Avatar>s
 * inside it, so a group only has to be sized in one place. An Avatar that
 * sets its own `size` / `shape` always wins over the group default.
 */
const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);

export function useAvatarGroupContext(): AvatarGroupContextValue | null {
  return useContext(AvatarGroupContext);
}

export interface AvatarProps
  extends ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

function Avatar({
  className,
  size,
  shape,
  ...props
}: AvatarProps): ReactElement {
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

export const avatarGroupSpacingIds = [
  "tight",
  "default",
  "loose",
  "none",
] as const satisfies string[];
export type AvatarGroupSpacingId = (typeof avatarGroupSpacingIds)[number];

/**
 * How far each avatar slides under the one before it. The overlap has to
 * scale with the avatar size — a fixed -12px reads as a heavy overlap on a
 * 24px `xs` avatar and as a barely-there nudge on a 64px `xl` one — so the
 * spacing is looked up per (spacing, size) pair. `none` lays the avatars out
 * side by side with a small gap instead of stacking them.
 */
const avatarGroupSpacingClasses = {
  // ~40% of the avatar width
  tight: {
    xs: "-space-x-2.5",
    sm: "-space-x-3.5",
    default: "-space-x-4",
    lg: "-space-x-5",
    xl: "-space-x-7",
  },
  // ~30% of the avatar width — deep enough to read as a stack, shallow enough
  // to leave the initials (and the +N count) legible.
  default: {
    xs: "-space-x-1.5",
    sm: "-space-x-2",
    default: "-space-x-3",
    lg: "-space-x-3.5",
    xl: "-space-x-5",
  },
  // ~18% of the avatar width
  loose: {
    xs: "-space-x-1",
    sm: "-space-x-1.5",
    default: "-space-x-2",
    lg: "-space-x-2",
    xl: "-space-x-3",
  },
  none: {
    xs: "space-x-1",
    sm: "space-x-1.5",
    default: "space-x-2",
    lg: "space-x-2",
    xl: "space-x-3",
  },
} as const satisfies Record<
  AvatarGroupSpacingId,
  Record<AvatarSizeId, string>
>;

/**
 * Flattens the group's children down to the individual avatars.
 *
 * Children.toArray() already drops null / false / undefined and flattens
 * nested arrays, but it treats a <>...</> fragment as a single child — which
 * would make a fragment of five avatars count as one against `max`. So
 * fragments are expanded here too.
 */
function flattenAvatarGroupChildren(children: ReactNode): ReactElement[] {
  return Children.toArray(children).flatMap(
    (child): ReactElement[] => {
      if (!isValidElement(child)) {
        return [];
      }
      if (child.type === Fragment) {
        return flattenAvatarGroupChildren(
          (child.props as { children?: ReactNode }).children,
        );
      }
      return [child];
    },
  );
}

export const avatarGroupStackingIds = [
  "first-on-top",
  "last-on-top",
] as const satisfies string[];
export type AvatarGroupStackingId = (typeof avatarGroupStackingIds)[number];

export interface AvatarGroupProps
  extends Omit<ComponentProps<"div">, "children"> {
  /** The <Avatar>s to stack. Fragments and conditional children are flattened. */
  children?: ReactNode;
  /** Maximum number of avatars to render before collapsing the rest into a +N chip. */
  max?: number;
  /**
   * Total number of people the group represents, when the caller only renders
   * a slice of them (e.g. 3 avatars fetched out of 42 members). The +N chip
   * counts up to this instead of to the number of children.
   */
  total?: number;
  /** Size applied to the +N chip, the overlap, and any Avatar that doesn't set its own. */
  size?: AvatarSizeId;
  /** Shape applied to the +N chip, the separator ring, and any Avatar that doesn't set its own. */
  shape?: AvatarShapeId;
  /** How deeply each avatar overlaps its neighbour. Defaults to `"default"`. */
  spacing?: AvatarGroupSpacingId;
  /** Which end of the stack renders on top. Defaults to `"first-on-top"`. */
  stacking?: AvatarGroupStackingId;
  /** Draw the separator ring between overlapping avatars. Defaults to `true`. */
  ring?: boolean;
  /**
   * Classes for the wrapper around each avatar (including the +N chip). Use it
   * to re-colour the separator ring when the group sits on a surface other
   * than the page background, e.g. `itemClassName="ring-card"` inside a <Card>.
   */
  itemClassName?: string;
  /** Render your own overflow indicator instead of the default +N chip. */
  renderOverflow?: (overflowCount: number) => ReactNode;
}

function AvatarGroup({
  className,
  itemClassName,
  max,
  total,
  size = "default",
  shape = "circle",
  spacing = "default",
  stacking = "first-on-top",
  ring = true,
  renderOverflow,
  children,
  ...props
}: AvatarGroupProps): ReactElement {
  const items: ReactElement[] = flattenAvatarGroupChildren(children);

  const visibleCount =
    typeof max === "number"
      ? Math.max(0, Math.min(Math.floor(max), items.length))
      : items.length;
  const visibleItems = items.slice(0, visibleCount);
  const overflowCount = Math.max(0, (total ?? items.length) - visibleCount);
  const stackSize = visibleItems.length + (overflowCount > 0 ? 1 : 0);

  const itemWrapperClassName: string = cn(
    "relative shrink-0",
    shape === "circle" ? "rounded-full" : "rounded-md",
    ring && "ring-2 ring-background",
    itemClassName,
  );

  return (
    <AvatarGroupContext.Provider value={{ size, shape }}>
      <div
        role="group"
        data-slot="avatar-group"
        className={cn(
          "flex items-center",
          avatarGroupSpacingClasses[spacing][size],
          className,
        )}
        {...props}
      >
        {visibleItems.map((child, index) => (
          <div
            key={child.key ?? index}
            data-slot="avatar-group-item"
            className={itemWrapperClassName}
            style={{
              zIndex: stacking === "first-on-top" ? stackSize - index : index + 1,
            }}
          >
            {child}
          </div>
        ))}
        {overflowCount > 0 && (
          <div
            data-slot="avatar-group-overflow"
            className={itemWrapperClassName}
            style={{ zIndex: stacking === "first-on-top" ? 0 : stackSize }}
          >
            {renderOverflow ? (
              renderOverflow(overflowCount)
            ) : (
              <span
                className={cn(
                  avatarVariants({ size, shape }),
                  "items-center justify-center bg-muted font-medium text-muted-foreground",
                )}
              >
                +{overflowCount}
                <span className="sr-only"> more</span>
              </span>
            )}
          </div>
        )}
      </div>
    </AvatarGroupContext.Provider>
  );
}
AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
