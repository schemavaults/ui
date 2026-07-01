"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";
import {
  type RibbonIntent,
  type RibbonPosition,
  type RibbonSize,
  ribbonIntentIds,
  ribbonPositionIds,
  ribbonSizeIds,
} from "./ribbon-variants";

const ribbonContainerVariants = cva(
  "relative overflow-hidden isolate",
  {
    variants: {
      rounded: {
        true: "rounded-md",
        false: "",
      },
    },
    defaultVariants: {
      rounded: false,
    },
  },
);

export interface RibbonContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ribbonContainerVariants> {
  ref?: Ref<HTMLDivElement>;
}

function RibbonContainer({
  className,
  rounded,
  ref,
  children,
  ...props
}: RibbonContainerProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="ribbon-container"
      className={cn(ribbonContainerVariants({ rounded }), className)}
      {...props}
    >
      {children}
    </div>
  );
}
RibbonContainer.displayName = "RibbonContainer";

const ribbonVariants = cva(
  [
    "absolute z-10 flex items-center justify-center",
    "text-center font-semibold uppercase tracking-wider whitespace-nowrap select-none",
    "text-[hsl(var(--ribbon-fg))] bg-[hsl(var(--ribbon-bg))]",
    "shadow-[0_2px_6px_-1px_rgba(0,0,0,0.25)]",
    "before:absolute before:content-[''] before:border-solid before:z-[-1]",
    "after:absolute after:content-[''] after:border-solid after:z-[-1]",
  ].join(" "),
  {
    variants: {
      intent: {
        default:
          "[--ribbon-bg:var(--muted)] [--ribbon-fg:var(--muted-foreground)] [--ribbon-shadow:var(--border)]",
        primary:
          "[--ribbon-bg:var(--primary)] [--ribbon-fg:var(--primary-foreground)] [--ribbon-shadow:var(--primary)]",
        brand:
          "[--ribbon-bg:217_91%_45%] [--ribbon-fg:210_40%_98%] [--ribbon-shadow:217_91%_35%]",
        success:
          "[--ribbon-bg:142_71%_38%] [--ribbon-fg:0_0%_100%] [--ribbon-shadow:142_71%_28%]",
        warning:
          "[--ribbon-bg:var(--warning)] [--ribbon-fg:var(--warning-foreground)] [--ribbon-shadow:var(--warning)]",
        destructive:
          "[--ribbon-bg:var(--destructive)] [--ribbon-fg:var(--destructive-foreground)] [--ribbon-shadow:var(--destructive)]",
        info:
          "[--ribbon-bg:217_91%_60%] [--ribbon-fg:0_0%_100%] [--ribbon-shadow:217_91%_45%]",
      } satisfies Record<RibbonIntent, string>,
      size: {
        sm: "h-5 w-40 text-[10px] leading-none",
        md: "h-6 w-48 text-xs leading-none",
        lg: "h-8 w-56 text-sm leading-none",
      } satisfies Record<RibbonSize, string>,
      position: {
        "top-left":
          "top-[var(--ribbon-offset)] left-[calc(-1*var(--ribbon-slack))] -rotate-45 origin-center",
        "top-right":
          "top-[var(--ribbon-offset)] right-[calc(-1*var(--ribbon-slack))] rotate-45 origin-center",
        "bottom-left":
          "bottom-[var(--ribbon-offset)] left-[calc(-1*var(--ribbon-slack))] rotate-45 origin-center",
        "bottom-right":
          "bottom-[var(--ribbon-offset)] right-[calc(-1*var(--ribbon-slack))] -rotate-45 origin-center",
      } satisfies Record<RibbonPosition, string>,
    },
    compoundVariants: [
      {
        size: "sm",
        className: "[--ribbon-offset:0.75rem] [--ribbon-slack:2.75rem]",
      },
      {
        size: "md",
        className: "[--ribbon-offset:1rem] [--ribbon-slack:3.25rem]",
      },
      {
        size: "lg",
        className: "[--ribbon-offset:1.5rem] [--ribbon-slack:3.75rem]",
      },
    ],
    defaultVariants: {
      intent: "primary",
      size: "md",
      position: "top-right",
    },
  },
);

export interface RibbonProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof ribbonVariants> {
  ref?: Ref<HTMLSpanElement>;
}

function Ribbon({
  className,
  intent,
  size,
  position,
  ref,
  children,
  ...props
}: RibbonProps): ReactElement {
  const resolvedIntent: RibbonIntent = intent ?? "primary";
  const resolvedPosition: RibbonPosition = position ?? "top-right";
  const resolvedSize: RibbonSize = size ?? "md";
  return (
    <span
      ref={ref}
      data-slot="ribbon"
      data-intent={resolvedIntent}
      data-position={resolvedPosition}
      data-size={resolvedSize}
      className={cn(
        ribbonVariants({ intent, size, position }),
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
Ribbon.displayName = "Ribbon";

export {
  Ribbon,
  RibbonContainer,
  ribbonVariants,
  ribbonContainerVariants,
  ribbonIntentIds,
  ribbonPositionIds,
  ribbonSizeIds,
};
export type { RibbonIntent, RibbonPosition, RibbonSize };

export default Ribbon;
