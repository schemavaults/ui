"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentProps,
  type ReactElement,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import {
  ribbonPositionIds,
  ribbonSizeIds,
  ribbonVariantIds,
  type RibbonPosition,
  type RibbonSize,
  type RibbonVariant,
} from "./ribbon-variants";

const ribbonVariants = cva(
  "absolute z-10 flex items-center justify-center text-center font-semibold uppercase tracking-wider whitespace-nowrap select-none shadow-md",
  {
    variants: {
      position: {
        "top-right": "rotate-45",
        "top-left": "-rotate-45",
        "bottom-right": "-rotate-45",
        "bottom-left": "rotate-45",
      } satisfies Record<RibbonPosition, string>,
      size: {
        sm: "text-[10px] py-0.5",
        default: "text-xs py-1",
        lg: "text-sm py-1.5",
      } satisfies Record<RibbonSize, string>,
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive:
          "bg-destructive text-white dark:bg-destructive/85",
        success: "bg-emerald-600 text-white dark:bg-emerald-500",
        warning: "bg-warning text-warning-foreground",
        accent:
          "bg-accent text-accent-foreground border-y border-border/60",
      } satisfies Record<RibbonVariant, string>,
    },
    compoundVariants: [
      // small (128px wide)
      { size: "sm", position: "top-right", className: "w-32 -right-8 top-4" },
      { size: "sm", position: "top-left", className: "w-32 -left-8 top-4" },
      {
        size: "sm",
        position: "bottom-right",
        className: "w-32 -right-8 bottom-4",
      },
      {
        size: "sm",
        position: "bottom-left",
        className: "w-32 -left-8 bottom-4",
      },
      // default (160px wide)
      {
        size: "default",
        position: "top-right",
        className: "w-40 -right-10 top-5",
      },
      {
        size: "default",
        position: "top-left",
        className: "w-40 -left-10 top-5",
      },
      {
        size: "default",
        position: "bottom-right",
        className: "w-40 -right-10 bottom-5",
      },
      {
        size: "default",
        position: "bottom-left",
        className: "w-40 -left-10 bottom-5",
      },
      // large (192px wide)
      { size: "lg", position: "top-right", className: "w-48 -right-12 top-7" },
      { size: "lg", position: "top-left", className: "w-48 -left-12 top-7" },
      {
        size: "lg",
        position: "bottom-right",
        className: "w-48 -right-12 bottom-7",
      },
      {
        size: "lg",
        position: "bottom-left",
        className: "w-48 -left-12 bottom-7",
      },
    ],
    defaultVariants: {
      position: "top-right",
      size: "default",
      variant: "default",
    },
  },
);

export interface RibbonProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof ribbonVariants> {
  /**
   * The ribbon label. Kept short (e.g. "NEW", "BETA", "SALE").
   * The parent container MUST have `position: relative` and
   * `overflow: hidden` for the ribbon to render correctly.
   */
  children: ComponentProps<"div">["children"];
}

function RibbonImpl(
  {
    className,
    position,
    size,
    variant,
    children,
    ...props
  }: RibbonProps,
  ref: Ref<HTMLDivElement>,
): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="ribbon"
      data-position={position ?? "top-right"}
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      className={cn(ribbonVariants({ position, size, variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

export const Ribbon = forwardRef<HTMLDivElement, RibbonProps>(RibbonImpl);
Ribbon.displayName = "Ribbon";

export { ribbonVariants, ribbonPositionIds, ribbonSizeIds, ribbonVariantIds };
export type { RibbonPosition, RibbonSize, RibbonVariant };

export default Ribbon;
