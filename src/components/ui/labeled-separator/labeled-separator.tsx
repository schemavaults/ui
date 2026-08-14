"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  ComponentProps,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

export const labeledSeparatorAlignIds = [
  "start",
  "center",
  "end",
] as const satisfies string[];

export type LabeledSeparatorAlignId = (typeof labeledSeparatorAlignIds)[number];

export const labeledSeparatorSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies string[];

export type LabeledSeparatorSizeId = (typeof labeledSeparatorSizeIds)[number];

export const labeledSeparatorVariantIds = [
  "solid",
  "dashed",
  "dotted",
] as const satisfies string[];

export type LabeledSeparatorVariantId =
  (typeof labeledSeparatorVariantIds)[number];

const labeledSeparatorVariants = cva("flex w-full items-center", {
  variants: {
    size: {
      sm: "gap-2",
      default: "gap-3",
      lg: "gap-4",
    } satisfies Record<LabeledSeparatorSizeId, string>,
  },
  defaultVariants: {
    size: "default",
  },
});

const labeledSeparatorLineVariants = cva(
  "h-0 min-w-0 flex-1 border-t",
  {
    variants: {
      variant: {
        solid: "border-border",
        dashed: "border-dashed border-border",
        dotted: "border-dotted border-border",
      } satisfies Record<LabeledSeparatorVariantId, string>,
    },
    defaultVariants: {
      variant: "solid",
    },
  },
);

const labeledSeparatorLabelVariants = cva(
  "shrink-0 font-medium text-muted-foreground leading-none",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      } satisfies Record<LabeledSeparatorSizeId, string>,
      uppercase: {
        true: "uppercase tracking-wider",
        false: "normal-case tracking-normal",
      },
    },
    defaultVariants: {
      size: "default",
      uppercase: false,
    },
  },
);

export interface LabeledSeparatorProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof labeledSeparatorVariants> {
  /**
   * Label content rendered between (or beside) the divider lines. When the
   * label is a plain string it is also mirrored to `aria-label` on the
   * separator element, so screen readers announce a meaningful name.
   */
  children?: ReactNode;
  /**
   * Where the label sits along the divider. Defaults to `"center"`, which
   * renders lines flanking the label on both sides. `"start"` puts the label
   * flush left with a single trailing line, and `"end"` flush right with a
   * single leading line.
   */
  align?: LabeledSeparatorAlignId;
  /** Line style. Defaults to `"solid"`. */
  variant?: LabeledSeparatorVariantId;
  /**
   * When true (and children is set), the label is rendered in uppercase
   * with wider tracking — the canonical style for auth screens
   * ("OR CONTINUE WITH"). Defaults to false.
   */
  uppercase?: boolean;
  /** Optional class applied to each line span. */
  lineClassName?: string;
  /** Optional class applied to the label span. */
  labelClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

function LabeledSeparator({
  className,
  size,
  align = "center",
  variant = "solid",
  uppercase = false,
  children,
  lineClassName,
  labelClassName,
  ref,
  ...props
}: LabeledSeparatorProps): ReactElement {
  const hasLabel = children !== undefined && children !== null && children !== "";
  const showLeadingLine = !hasLabel || align !== "start";
  const showTrailingLine = !hasLabel || align !== "end";
  const inferredLabel = typeof children === "string" ? children : undefined;

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      aria-label={inferredLabel}
      data-slot="labeled-separator"
      data-align={align}
      data-variant={variant}
      className={cn(labeledSeparatorVariants({ size }), className)}
      {...props}
    >
      {showLeadingLine ? (
        <span
          aria-hidden="true"
          data-slot="labeled-separator-line-start"
          className={cn(
            labeledSeparatorLineVariants({ variant }),
            lineClassName,
          )}
        />
      ) : null}
      {hasLabel ? (
        <span
          data-slot="labeled-separator-label"
          className={cn(
            labeledSeparatorLabelVariants({ size, uppercase }),
            labelClassName,
          )}
        >
          {children}
        </span>
      ) : null}
      {showTrailingLine ? (
        <span
          aria-hidden="true"
          data-slot="labeled-separator-line-end"
          className={cn(
            labeledSeparatorLineVariants({ variant }),
            lineClassName,
          )}
        />
      ) : null}
    </div>
  );
}
LabeledSeparator.displayName = "LabeledSeparator";

export {
  LabeledSeparator,
  labeledSeparatorVariants,
  labeledSeparatorLineVariants,
  labeledSeparatorLabelVariants,
};

export default LabeledSeparator;
