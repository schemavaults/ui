"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";

import { cn } from "@/lib/utils";
import {
  type KbdSize,
  type KbdVariant,
  kbdSizeIds,
  kbdVariantIds,
} from "./kbd-variants";

const kbdVariants = cva(
  "inline-flex items-center justify-center font-mono font-medium select-none whitespace-nowrap align-middle tracking-tight",
  {
    variants: {
      variant: {
        default:
          "rounded border border-border bg-muted text-muted-foreground shadow-[inset_0_-1px_0_0_hsl(var(--border))]",
        outline:
          "rounded border border-border bg-background text-foreground",
        solid:
          "rounded border border-primary/20 bg-primary text-primary-foreground shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.2)]",
        subtle:
          "rounded bg-muted/60 text-muted-foreground",
      } satisfies Record<KbdVariant, string>,
      size: {
        sm: "h-5 min-w-[1.25rem] px-1 text-[10px] leading-none",
        md: "h-6 min-w-[1.5rem] px-1.5 text-xs leading-none",
        lg: "h-7 min-w-[1.75rem] px-2 text-sm leading-none",
      } satisfies Record<KbdSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface KbdProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {
  ref?: Ref<HTMLElement>;
}

function Kbd({
  className,
  variant,
  size,
  ref,
  ...props
}: KbdProps): ReactElement {
  return (
    <kbd
      ref={ref}
      data-slot="kbd"
      className={cn(kbdVariants({ variant, size }), className)}
      {...props}
    />
  );
}
Kbd.displayName = "Kbd";

const kbdGroupVariants = cva("inline-flex items-center align-middle", {
  variants: {
    size: {
      sm: "gap-0.5 text-[10px]",
      md: "gap-1 text-xs",
      lg: "gap-1.5 text-sm",
    } satisfies Record<KbdSize, string>,
  },
  defaultVariants: {
    size: "md",
  },
});

export interface KbdGroupProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof kbdGroupVariants> {
  ref?: Ref<HTMLSpanElement>;
  /**
   * Optional separator rendered between children.
   * Common values: "+", "·", "then"
   */
  separator?: ReactNode;
}

function KbdGroup({
  className,
  size,
  separator,
  children,
  ref,
  ...props
}: KbdGroupProps): ReactElement {
  if (separator === undefined) {
    return (
      <span
        ref={ref}
        data-slot="kbd-group"
        className={cn(kbdGroupVariants({ size }), className)}
        {...props}
      >
        {children}
      </span>
    );
  }

  const items = Array.isArray(children) ? children : [children];
  const visible = items.filter(
    (c): c is NonNullable<typeof c> => c !== null && c !== undefined && c !== false,
  );

  return (
    <span
      ref={ref}
      data-slot="kbd-group"
      className={cn(kbdGroupVariants({ size }), className)}
      {...props}
    >
      {visible.map((child, idx) => {
        const isLast = idx === visible.length - 1;
        return (
          <span key={idx} className="inline-flex items-center gap-1">
            {child}
            {!isLast ? (
              <span
                aria-hidden="true"
                className="text-muted-foreground/70 select-none"
              >
                {separator}
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}
KbdGroup.displayName = "KbdGroup";

export { Kbd, KbdGroup, kbdVariants, kbdGroupVariants, kbdSizeIds, kbdVariantIds };
export type { KbdSize, KbdVariant };

export default Kbd;
