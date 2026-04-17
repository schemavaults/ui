"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";

export const emptyStateVariantIds = [
  "default",
  "muted",
  "destructive",
  "warning",
] as const satisfies string[];

export type EmptyStateVariantId = (typeof emptyStateVariantIds)[number];

export const emptyStateSizeIds = ["sm", "md", "lg"] as const satisfies string[];

export type EmptyStateSizeId = (typeof emptyStateSizeIds)[number];

const emptyStateVariants = cva(
  "flex w-full flex-col items-center justify-center text-center rounded-lg border border-dashed",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        muted: "bg-muted/40 text-foreground border-border",
        destructive:
          "bg-destructive/5 text-destructive border-destructive/40 dark:border-destructive",
        warning:
          "bg-warning/5 text-warning border-warning/40 dark:border-warning",
      } satisfies Record<EmptyStateVariantId, string>,
      size: {
        sm: "gap-2 p-4",
        md: "gap-3 p-8",
        lg: "gap-4 p-12",
      } satisfies Record<EmptyStateSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface EmptyStateProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  ref?: Ref<HTMLDivElement>;
}

function EmptyState({
  className,
  variant,
  size,
  ref,
  ...props
}: EmptyStateProps): ReactElement {
  return (
    <div
      ref={ref}
      role="status"
      data-slot="empty-state"
      className={cn(emptyStateVariants({ variant, size }), className)}
      {...props}
    />
  );
}
EmptyState.displayName = "EmptyState";

const emptyStateIconVariants = cva(
  "flex items-center justify-center rounded-full [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        muted: "bg-muted text-muted-foreground",
        destructive: "bg-destructive/10 text-destructive",
        warning: "bg-warning/10 text-warning",
      } satisfies Record<EmptyStateVariantId, string>,
      size: {
        sm: "size-10 [&>svg]:size-5",
        md: "size-14 [&>svg]:size-7",
        lg: "size-20 [&>svg]:size-10",
      } satisfies Record<EmptyStateSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface EmptyStateIconProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateIconVariants> {
  ref?: Ref<HTMLDivElement>;
}

function EmptyStateIcon({
  className,
  variant,
  size,
  ref,
  ...props
}: EmptyStateIconProps): ReactElement {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="empty-state-icon"
      className={cn(emptyStateIconVariants({ variant, size }), className)}
      {...props}
    />
  );
}
EmptyStateIcon.displayName = "EmptyStateIcon";

const emptyStateTitleSizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
} satisfies Record<EmptyStateSizeId, string>;

export interface EmptyStateTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  size?: EmptyStateSizeId;
  ref?: Ref<HTMLHeadingElement>;
}

function EmptyStateTitle({
  className,
  size = "md",
  ref,
  ...props
}: EmptyStateTitleProps): ReactElement {
  return (
    <h3
      ref={ref}
      data-slot="empty-state-title"
      className={cn(
        "font-semibold leading-tight tracking-tight",
        emptyStateTitleSizes[size],
        className,
      )}
      {...props}
    >
      {props.children}
    </h3>
  );
}
EmptyStateTitle.displayName = "EmptyStateTitle";

export interface EmptyStateDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
}

function EmptyStateDescription({
  className,
  ref,
  ...props
}: EmptyStateDescriptionProps): ReactElement {
  return (
    <p
      ref={ref}
      data-slot="empty-state-description"
      className={cn(
        "max-w-prose text-sm text-muted-foreground [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}
EmptyStateDescription.displayName = "EmptyStateDescription";

export interface EmptyStateActionsProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function EmptyStateActions({
  className,
  ref,
  ...props
}: EmptyStateActionsProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="empty-state-actions"
      className={cn(
        "mt-2 flex flex-wrap items-center justify-center gap-2",
        className,
      )}
      {...props}
    />
  );
}
EmptyStateActions.displayName = "EmptyStateActions";

export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
  emptyStateVariants,
  emptyStateIconVariants,
};
