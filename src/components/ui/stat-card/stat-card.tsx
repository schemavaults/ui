"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "../skeleton/skeleton";

export const statCardVariantIds = [
  "default",
  "muted",
  "primary",
  "destructive",
  "warning",
] as const satisfies string[];

export type StatCardVariantId = (typeof statCardVariantIds)[number];

export const statCardSizeIds = ["sm", "md", "lg"] as const satisfies string[];

export type StatCardSizeId = (typeof statCardSizeIds)[number];

const statCardVariants = cva(
  "relative flex w-full flex-col rounded-lg border shadow-sm transition-colors",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        muted: "bg-muted/40 text-foreground border-border",
        primary:
          "bg-primary/5 text-foreground border-primary/30 dark:bg-primary/10",
        destructive:
          "bg-destructive/5 text-foreground border-destructive/40 dark:border-destructive",
        warning:
          "bg-warning/5 text-foreground border-warning/40 dark:border-warning",
      } satisfies Record<StatCardVariantId, string>,
      size: {
        sm: "gap-1 p-3",
        md: "gap-1.5 p-4",
        lg: "gap-2 p-6",
      } satisfies Record<StatCardSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface StatCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  ref?: Ref<HTMLDivElement>;
}

function StatCard({
  className,
  variant,
  size,
  ref,
  ...props
}: StatCardProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="stat-card"
      className={cn(statCardVariants({ variant, size }), className)}
      {...props}
    />
  );
}
StatCard.displayName = "StatCard";

export interface StatCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function StatCardHeader({
  className,
  ref,
  ...props
}: StatCardHeaderProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="stat-card-header"
      className={cn(
        "flex w-full items-start justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}
StatCardHeader.displayName = "StatCardHeader";

const statCardLabelSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
} satisfies Record<StatCardSizeId, string>;

export interface StatCardLabelProps
  extends HTMLAttributes<HTMLParagraphElement> {
  size?: StatCardSizeId;
  ref?: Ref<HTMLParagraphElement>;
}

function StatCardLabel({
  className,
  size = "md",
  ref,
  ...props
}: StatCardLabelProps): ReactElement {
  return (
    <p
      ref={ref}
      data-slot="stat-card-label"
      className={cn(
        "font-medium text-muted-foreground leading-none",
        statCardLabelSizes[size],
        className,
      )}
      {...props}
    />
  );
}
StatCardLabel.displayName = "StatCardLabel";

const statCardIconVariants = cva(
  "flex shrink-0 items-center justify-center rounded-md [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        muted: "bg-background text-muted-foreground",
        primary: "bg-primary/10 text-primary dark:text-primary-foreground",
        destructive: "bg-destructive/10 text-destructive",
        warning: "bg-warning/15 text-warning",
      } satisfies Record<StatCardVariantId, string>,
      size: {
        sm: "size-7 [&>svg]:size-4",
        md: "size-9 [&>svg]:size-5",
        lg: "size-11 [&>svg]:size-6",
      } satisfies Record<StatCardSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface StatCardIconProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardIconVariants> {
  ref?: Ref<HTMLDivElement>;
}

function StatCardIcon({
  className,
  variant,
  size,
  ref,
  ...props
}: StatCardIconProps): ReactElement {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="stat-card-icon"
      className={cn(statCardIconVariants({ variant, size }), className)}
      {...props}
    />
  );
}
StatCardIcon.displayName = "StatCardIcon";

const statCardValueSizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
} satisfies Record<StatCardSizeId, string>;

export interface StatCardValueProps
  extends HTMLAttributes<HTMLDivElement> {
  size?: StatCardSizeId;
  loading?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function StatCardValue({
  className,
  size = "md",
  loading = false,
  children,
  ref,
  ...props
}: StatCardValueProps): ReactElement {
  if (loading) {
    return (
      <Skeleton
        data-slot="stat-card-value-skeleton"
        className={cn(
          "mt-1",
          size === "sm" && "h-6 w-16",
          size === "md" && "h-7 w-20",
          size === "lg" && "h-9 w-28",
          className,
        )}
      />
    );
  }
  return (
    <div
      ref={ref}
      data-slot="stat-card-value"
      className={cn(
        "font-semibold tabular-nums leading-tight tracking-tight",
        statCardValueSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
StatCardValue.displayName = "StatCardValue";

export interface StatCardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
}

function StatCardDescription({
  className,
  ref,
  ...props
}: StatCardDescriptionProps): ReactElement {
  return (
    <p
      ref={ref}
      data-slot="stat-card-description"
      className={cn("text-xs text-muted-foreground leading-snug", className)}
      {...props}
    />
  );
}
StatCardDescription.displayName = "StatCardDescription";

export const statCardTrendDirections = [
  "up",
  "down",
  "neutral",
] as const satisfies string[];

export type StatCardTrendDirection = (typeof statCardTrendDirections)[number];

export type StatCardTrendIntent = "positive" | "negative" | "neutral";

const statCardTrendVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums [&>svg]:size-3",
  {
    variants: {
      intent: {
        positive:
          "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground",
        negative: "bg-destructive/10 text-destructive",
        neutral: "bg-muted text-muted-foreground",
      } satisfies Record<StatCardTrendIntent, string>,
    },
    defaultVariants: {
      intent: "neutral",
    },
  },
);

export interface StatCardTrendProps extends HTMLAttributes<HTMLSpanElement> {
  direction?: StatCardTrendDirection;
  /**
   * Override the colour intent. Defaults to mapping `up` -> positive,
   * `down` -> negative, `neutral` -> neutral. Useful when an upward trend
   * is actually bad (e.g. error rate).
   */
  intent?: StatCardTrendIntent;
  /**
   * Optional icon shown before the children. If omitted, a default arrow
   * icon for the direction is rendered.
   */
  icon?: ReactNode;
  /**
   * If true, hide the default arrow icon entirely.
   */
  hideIcon?: boolean;
  ref?: Ref<HTMLSpanElement>;
}

function defaultIntentForDirection(
  direction: StatCardTrendDirection,
): StatCardTrendIntent {
  switch (direction) {
    case "up":
      return "positive";
    case "down":
      return "negative";
    default:
      return "neutral";
  }
}

function DefaultTrendIcon({
  direction,
}: {
  direction: StatCardTrendDirection;
}): ReactElement {
  if (direction === "up") {
    return (
      <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M3 7.5L6 4.5L9 7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (direction === "down") {
    return (
      <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M3 4.5L6 7.5L9 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3 6H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCardTrend({
  className,
  direction = "neutral",
  intent,
  icon,
  hideIcon = false,
  children,
  ref,
  ...props
}: StatCardTrendProps): ReactElement {
  const resolvedIntent = intent ?? defaultIntentForDirection(direction);
  return (
    <span
      ref={ref}
      data-slot="stat-card-trend"
      data-direction={direction}
      className={cn(statCardTrendVariants({ intent: resolvedIntent }), className)}
      {...props}
    >
      {hideIcon ? null : (icon ?? <DefaultTrendIcon direction={direction} />)}
      {children}
    </span>
  );
}
StatCardTrend.displayName = "StatCardTrend";

export interface StatCardFooterProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function StatCardFooter({
  className,
  ref,
  ...props
}: StatCardFooterProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="stat-card-footer"
      className={cn(
        "mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
StatCardFooter.displayName = "StatCardFooter";

export {
  StatCard,
  StatCardHeader,
  StatCardLabel,
  StatCardIcon,
  StatCardValue,
  StatCardDescription,
  StatCardTrend,
  StatCardFooter,
  statCardVariants,
  statCardIconVariants,
  statCardTrendVariants,
};
