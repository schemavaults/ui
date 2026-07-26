"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import {
  createContext,
  useContext,
  useMemo,
  type ComponentProps,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";

export const radioCardGroupSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies string[];
export type RadioCardGroupSizeId = (typeof radioCardGroupSizeIds)[number];

export const radioCardGroupVariantIds = [
  "default",
  "muted",
  "elevated",
] as const satisfies string[];
export type RadioCardGroupVariantId =
  (typeof radioCardGroupVariantIds)[number];

export const radioCardGroupOrientationIds = [
  "vertical",
  "horizontal",
] as const satisfies string[];
export type RadioCardGroupOrientationId =
  (typeof radioCardGroupOrientationIds)[number];

export const radioCardIndicatorStyleIds = [
  "radio",
  "check",
  "none",
] as const satisfies string[];
export type RadioCardIndicatorStyleId =
  (typeof radioCardIndicatorStyleIds)[number];

interface RadioCardGroupContextValue {
  size: RadioCardGroupSizeId;
  variant: RadioCardGroupVariantId;
  indicator: RadioCardIndicatorStyleId;
}

const RadioCardGroupContext = createContext<RadioCardGroupContextValue | null>(
  null,
);

function useRadioCardGroup(): RadioCardGroupContextValue {
  const ctx = useContext(RadioCardGroupContext);
  return ctx ?? { size: "default", variant: "default", indicator: "radio" };
}

const radioCardGroupRootVariants = cva("grid w-full gap-3", {
  variants: {
    orientation: {
      vertical: "grid-flow-row",
      horizontal: "auto-cols-fr grid-flow-col",
    } satisfies Record<RadioCardGroupOrientationId, string>,
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export interface RadioCardGroupProps
  extends Omit<
      ComponentProps<typeof RadioGroupPrimitive.Root>,
      "orientation"
    >,
    VariantProps<typeof radioCardGroupRootVariants> {
  /**
   * Visual size for every card in the group. Cards read this via context, so
   * setting it once at the group level is enough. Defaults to `"default"`.
   */
  size?: RadioCardGroupSizeId;
  /**
   * Visual style variant applied to unchecked cards. Defaults to `"default"`.
   * - `"default"` — bordered card with background matching the surface.
   * - `"muted"` — softer, muted background for dense layouts.
   * - `"elevated"` — subtle shadow, useful on light neutral pages.
   */
  variant?: RadioCardGroupVariantId;
  /**
   * How the "selected" state is visually indicated inside each card.
   * Defaults to `"radio"` (a small radio dot in the top-right corner).
   * - `"check"` — a check icon in the top-right corner when selected.
   * - `"none"` — rely only on the border/background change to signal selection.
   */
  indicator?: RadioCardIndicatorStyleId;
  /**
   * Number of columns when the group renders vertically. Ignored when
   * `orientation="horizontal"`. Defaults to `1`.
   */
  columns?: 1 | 2 | 3 | 4;
}

const columnClass: Record<1 | 2 | 3 | 4, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

function RadioCardGroup({
  className,
  size = "default",
  variant = "default",
  indicator = "radio",
  orientation = "vertical",
  columns = 1,
  ref,
  ...props
}: RadioCardGroupProps & {
  ref?: Ref<HTMLDivElement>;
}): ReactElement {
  const contextValue = useMemo<RadioCardGroupContextValue>(
    () => ({ size, variant, indicator }),
    [size, variant, indicator],
  );
  return (
    <RadioCardGroupContext.Provider value={contextValue}>
      <RadioGroupPrimitive.Root
        ref={ref}
        data-slot="radio-card-group"
        data-orientation={orientation ?? "vertical"}
        className={cn(
          radioCardGroupRootVariants({ orientation }),
          orientation === "vertical" && columnClass[columns],
          className,
        )}
        {...props}
      />
    </RadioCardGroupContext.Provider>
  );
}
RadioCardGroup.displayName = "RadioCardGroup";

const radioCardVariants = cva(
  [
    "group/radio-card relative flex w-full flex-col text-left",
    "cursor-pointer select-none rounded-lg border transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[state=checked]:border-primary data-[state=checked]:ring-1 data-[state=checked]:ring-primary/60",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "gap-1 p-3 text-sm",
        default: "gap-1.5 p-4 text-sm",
        lg: "gap-2 p-5 text-base",
      } satisfies Record<RadioCardGroupSizeId, string>,
      variant: {
        default:
          "border-input bg-card text-card-foreground hover:border-primary/60 hover:bg-accent/40 data-[state=checked]:bg-primary/5 dark:data-[state=checked]:bg-primary/10",
        muted:
          "border-transparent bg-muted/60 text-foreground hover:bg-muted data-[state=checked]:bg-primary/10 data-[state=checked]:border-primary",
        elevated:
          "border-border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/60 data-[state=checked]:bg-primary/5 dark:data-[state=checked]:bg-primary/10",
      } satisfies Record<RadioCardGroupVariantId, string>,
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

export interface RadioCardProps
  extends Omit<
      ComponentProps<typeof RadioGroupPrimitive.Item>,
      "children"
    > {
  /**
   * Optional override for the group-level `indicator` style on this card.
   * Useful when a single card in a set should suppress its indicator (for
   * example a "custom" option that opens a follow-up dialog).
   */
  indicator?: RadioCardIndicatorStyleId;
  children?: ReactNode;
}

function RadioCard({
  className,
  children,
  indicator: itemIndicator,
  ref,
  ...props
}: RadioCardProps & { ref?: Ref<HTMLButtonElement> }): ReactElement {
  const { size, variant, indicator: groupIndicator } = useRadioCardGroup();
  const resolvedIndicator: RadioCardIndicatorStyleId =
    itemIndicator ?? groupIndicator;
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      data-slot="radio-card"
      className={cn(radioCardVariants({ size, variant }), className)}
      {...props}
    >
      {resolvedIndicator === "radio" && (
        <span
          aria-hidden="true"
          data-slot="radio-card-indicator"
          className={cn(
            "absolute right-3 top-3 flex size-4 items-center justify-center rounded-full border transition-colors",
            "border-input group-data-[state=checked]/radio-card:border-primary group-data-[state=checked]/radio-card:bg-primary",
          )}
        >
          <RadioGroupPrimitive.Indicator asChild>
            <span className="size-1.5 rounded-full bg-primary-foreground" />
          </RadioGroupPrimitive.Indicator>
        </span>
      )}
      {resolvedIndicator === "check" && (
        <span
          aria-hidden="true"
          data-slot="radio-card-indicator"
          className={cn(
            "absolute right-3 top-3 flex size-5 items-center justify-center rounded-full border transition-colors",
            "border-input group-data-[state=checked]/radio-card:border-primary group-data-[state=checked]/radio-card:bg-primary",
          )}
        >
          <RadioGroupPrimitive.Indicator asChild>
            <Check className="size-3 text-primary-foreground" strokeWidth={3} />
          </RadioGroupPrimitive.Indicator>
        </span>
      )}
      {children}
    </RadioGroupPrimitive.Item>
  );
}
RadioCard.displayName = "RadioCard";

export interface RadioCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function RadioCardHeader({
  className,
  ref,
  ...props
}: RadioCardHeaderProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="radio-card-header"
      className={cn("flex w-full items-start gap-3", className)}
      {...props}
    />
  );
}
RadioCardHeader.displayName = "RadioCardHeader";

const radioCardIconVariants = cva(
  "flex shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-data-[state=checked]/radio-card:bg-primary/10 group-data-[state=checked]/radio-card:text-primary [&>svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "size-7 [&>svg]:size-4",
        default: "size-9 [&>svg]:size-5",
        lg: "size-11 [&>svg]:size-6",
      } satisfies Record<RadioCardGroupSizeId, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface RadioCardIconProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /** Overrides the group size for this icon. Almost never needed. */
  size?: RadioCardGroupSizeId;
}

function RadioCardIcon({
  className,
  size,
  ref,
  ...props
}: RadioCardIconProps): ReactElement {
  const { size: groupSize } = useRadioCardGroup();
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="radio-card-icon"
      className={cn(
        radioCardIconVariants({ size: size ?? groupSize }),
        className,
      )}
      {...props}
    />
  );
}
RadioCardIcon.displayName = "RadioCardIcon";

const radioCardTitleSizes: Record<RadioCardGroupSizeId, string> = {
  sm: "text-sm",
  default: "text-sm",
  lg: "text-base",
};

export interface RadioCardTitleProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
}

function RadioCardTitle({
  className,
  ref,
  ...props
}: RadioCardTitleProps): ReactElement {
  const { size } = useRadioCardGroup();
  return (
    <p
      ref={ref}
      data-slot="radio-card-title"
      className={cn(
        "font-semibold leading-tight text-foreground",
        radioCardTitleSizes[size],
        className,
      )}
      {...props}
    />
  );
}
RadioCardTitle.displayName = "RadioCardTitle";

export interface RadioCardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
}

function RadioCardDescription({
  className,
  ref,
  ...props
}: RadioCardDescriptionProps): ReactElement {
  return (
    <p
      ref={ref}
      data-slot="radio-card-description"
      className={cn("text-xs text-muted-foreground leading-snug", className)}
      {...props}
    />
  );
}
RadioCardDescription.displayName = "RadioCardDescription";

export interface RadioCardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
}

function RadioCardBadge({
  className,
  ref,
  ...props
}: RadioCardBadgeProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="radio-card-badge"
      className={cn(
        "inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary",
        className,
      )}
      {...props}
    />
  );
}
RadioCardBadge.displayName = "RadioCardBadge";

export interface RadioCardFooterProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function RadioCardFooter({
  className,
  ref,
  ...props
}: RadioCardFooterProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="radio-card-footer"
      className={cn(
        "mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
RadioCardFooter.displayName = "RadioCardFooter";

export {
  RadioCardGroup,
  RadioCard,
  RadioCardHeader,
  RadioCardIcon,
  RadioCardTitle,
  RadioCardDescription,
  RadioCardBadge,
  RadioCardFooter,
  radioCardGroupRootVariants,
  radioCardVariants,
  radioCardIconVariants,
};
