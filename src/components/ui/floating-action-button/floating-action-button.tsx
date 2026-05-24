"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type {
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

export const floatingActionButtonVariantIds = [
  "primary",
  "secondary",
  "destructive",
  "outline",
  "brand",
] as const satisfies string[];

export type FloatingActionButtonVariantId =
  (typeof floatingActionButtonVariantIds)[number];

export const floatingActionButtonSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies string[];

export type FloatingActionButtonSizeId =
  (typeof floatingActionButtonSizeIds)[number];

export const floatingActionButtonPositionIds = [
  "bottom-right",
  "bottom-left",
  "top-right",
  "top-left",
  "static",
] as const satisfies string[];

export type FloatingActionButtonPositionId =
  (typeof floatingActionButtonPositionIds)[number];

const floatingActionButtonVariants = cva(
  "group/fab inline-flex items-center justify-center gap-2 font-medium ring-offset-background shadow-lg transition-[background-color,border-color,color,box-shadow,transform] hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none z-40",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-secondary/25",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/30",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        brand:
          "bg-schemavaults-brand-blue text-primary-foreground hover:bg-schemavaults-brand-blue/90 shadow-schemavaults-brand-blue/30",
      } satisfies Record<FloatingActionButtonVariantId, string>,
      size: {
        sm: "h-10 w-10 rounded-full text-sm [&_svg]:size-4",
        default: "h-14 w-14 rounded-full text-base [&_svg]:size-6",
        lg: "h-16 w-16 rounded-full text-base [&_svg]:size-7",
      } satisfies Record<FloatingActionButtonSizeId, string>,
      extended: {
        true: "rounded-full w-auto",
        false: "",
      },
      position: {
        "bottom-right": "fixed bottom-6 right-6",
        "bottom-left": "fixed bottom-6 left-6",
        "top-right": "fixed top-6 right-6",
        "top-left": "fixed top-6 left-6",
        static: "",
      } satisfies Record<FloatingActionButtonPositionId, string>,
    },
    compoundVariants: [
      { extended: true, size: "sm", class: "h-10 px-4" },
      { extended: true, size: "default", class: "h-14 px-6" },
      { extended: true, size: "lg", class: "h-16 px-8" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
      extended: false,
      position: "bottom-right",
    },
  },
);

export interface FloatingActionButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof floatingActionButtonVariants> {
  ref?: Ref<HTMLButtonElement>;
  /**
   * Icon rendered inside the FAB. Required for icon-only mode.
   */
  icon: ReactNode;
  /**
   * Optional label rendered alongside the icon. When provided, the FAB
   * switches to its extended layout (icon + text) unless `extended` is
   * explicitly set to false.
   */
  label?: ReactNode;
  /**
   * Accessible label for the button. Strongly recommended in icon-only
   * mode where no visible text describes the action.
   */
  "aria-label"?: string;
  /**
   * Render the button as a different element via Radix Slot (useful for
   * wrapping with a Link component while preserving styles).
   */
  asChild?: boolean;
}

function FloatingActionButton({
  className,
  variant,
  size,
  position,
  extended,
  icon,
  label,
  asChild = false,
  type = "button",
  ref,
  ...props
}: FloatingActionButtonProps): ReactElement {
  const Comp = asChild ? Slot : "button";
  const isExtended = extended ?? Boolean(label);

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      data-slot="floating-action-button"
      data-extended={isExtended || undefined}
      className={cn(
        floatingActionButtonVariants({
          variant,
          size,
          position,
          extended: isExtended,
        }),
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="floating-action-button-icon"
        className="inline-flex shrink-0 items-center justify-center"
      >
        {icon}
      </span>
      {isExtended && label != null ? (
        <span
          data-slot="floating-action-button-label"
          className="truncate"
        >
          {label}
        </span>
      ) : null}
    </Comp>
  );
}
FloatingActionButton.displayName = "FloatingActionButton";

export { FloatingActionButton, floatingActionButtonVariants };

export default FloatingActionButton;
