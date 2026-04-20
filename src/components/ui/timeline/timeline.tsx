"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  OlHTMLAttributes,
  LiHTMLAttributes,
  ReactElement,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

export const timelineVariantIds = [
  "default",
  "primary",
  "destructive",
  "warning",
  "muted",
] as const satisfies string[];

export type TimelineVariantId = (typeof timelineVariantIds)[number];

export const timelineSizeIds = ["sm", "md", "lg"] as const satisfies string[];

export type TimelineSizeId = (typeof timelineSizeIds)[number];

export interface TimelineProps extends OlHTMLAttributes<HTMLOListElement> {
  ref?: Ref<HTMLOListElement>;
}

function Timeline({ className, ref, ...props }: TimelineProps): ReactElement {
  return (
    <ol
      ref={ref}
      data-slot="timeline"
      className={cn("relative flex flex-col", className)}
      {...props}
    />
  );
}
Timeline.displayName = "Timeline";

const timelineItemSizes = {
  sm: "gap-x-2 pb-4 [&:last-child]:pb-0",
  md: "gap-x-3 pb-6 [&:last-child]:pb-0",
  lg: "gap-x-4 pb-8 [&:last-child]:pb-0",
} satisfies Record<TimelineSizeId, string>;

export interface TimelineItemProps extends LiHTMLAttributes<HTMLLIElement> {
  size?: TimelineSizeId;
  ref?: Ref<HTMLLIElement>;
}

function TimelineItem({
  className,
  size = "md",
  ref,
  ...props
}: TimelineItemProps): ReactElement {
  return (
    <li
      ref={ref}
      data-slot="timeline-item"
      className={cn(
        "relative grid grid-cols-[auto_1fr] items-start",
        timelineItemSizes[size],
        className,
      )}
      {...props}
    />
  );
}
TimelineItem.displayName = "TimelineItem";

const timelineDotVariants = cva(
  "relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground",
        primary: "border-primary bg-primary text-primary-foreground",
        destructive:
          "border-destructive bg-destructive text-white dark:bg-destructive/80",
        warning:
          "border-warning bg-warning text-warning-foreground",
        muted: "border-border bg-muted text-muted-foreground",
      } satisfies Record<TimelineVariantId, string>,
      size: {
        sm: "size-4 [&>svg]:size-2.5",
        md: "size-6 [&>svg]:size-3.5",
        lg: "size-8 [&>svg]:size-4",
      } satisfies Record<TimelineSizeId, string>,
      filled: {
        true: "",
        false: "bg-background",
      },
    },
    compoundVariants: [
      {
        filled: false,
        variant: "default",
        className: "text-muted-foreground",
      },
      {
        filled: false,
        variant: "primary",
        className: "text-primary",
      },
      {
        filled: false,
        variant: "destructive",
        className: "text-destructive dark:bg-background",
      },
      {
        filled: false,
        variant: "warning",
        className: "text-warning",
      },
      {
        filled: false,
        variant: "muted",
        className: "text-muted-foreground",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      filled: true,
    },
  },
);

export interface TimelineDotProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof timelineDotVariants> {
  ref?: Ref<HTMLSpanElement>;
}

function TimelineDot({
  className,
  variant,
  size,
  filled,
  ref,
  ...props
}: TimelineDotProps): ReactElement {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="timeline-dot"
      className={cn(
        timelineDotVariants({ variant, size, filled }),
        className,
      )}
      {...props}
    />
  );
}
TimelineDot.displayName = "TimelineDot";

const timelineConnectorVariants = cva("row-start-2 mx-auto w-px flex-1", {
  variants: {
    variant: {
      default: "bg-border",
      primary: "bg-primary/40",
      destructive: "bg-destructive/40",
      warning: "bg-warning/40",
      muted: "bg-muted-foreground/20",
    } satisfies Record<TimelineVariantId, string>,
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface TimelineConnectorProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof timelineConnectorVariants> {
  ref?: Ref<HTMLSpanElement>;
}

function TimelineConnector({
  className,
  variant,
  ref,
  ...props
}: TimelineConnectorProps): ReactElement {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="timeline-connector"
      className={cn(timelineConnectorVariants({ variant }), className)}
      {...props}
    />
  );
}
TimelineConnector.displayName = "TimelineConnector";

const timelineIndicatorSizes = {
  sm: "min-h-6",
  md: "min-h-8",
  lg: "min-h-10",
} satisfies Record<TimelineSizeId, string>;

export interface TimelineIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  size?: TimelineSizeId;
  ref?: Ref<HTMLDivElement>;
}

function TimelineIndicator({
  className,
  size = "md",
  ref,
  ...props
}: TimelineIndicatorProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="timeline-indicator"
      className={cn(
        "col-start-1 row-span-full grid grid-rows-[auto_1fr] items-start justify-items-center",
        timelineIndicatorSizes[size],
        className,
      )}
      {...props}
    />
  );
}
TimelineIndicator.displayName = "TimelineIndicator";

export interface TimelineContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function TimelineContent({
  className,
  ref,
  ...props
}: TimelineContentProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="timeline-content"
      className={cn(
        "col-start-2 flex flex-col gap-1 pt-0.5 text-sm",
        className,
      )}
      {...props}
    />
  );
}
TimelineContent.displayName = "TimelineContent";

export interface TimelineHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function TimelineHeader({
  className,
  ref,
  ...props
}: TimelineHeaderProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="timeline-header"
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5",
        className,
      )}
      {...props}
    />
  );
}
TimelineHeader.displayName = "TimelineHeader";

export interface TimelineTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  ref?: Ref<HTMLHeadingElement>;
}

function TimelineTitle({
  className,
  ref,
  ...props
}: TimelineTitleProps): ReactElement {
  return (
    <h4
      ref={ref}
      data-slot="timeline-title"
      className={cn(
        "text-sm font-semibold leading-tight text-foreground",
        className,
      )}
      {...props}
    >
      {props.children}
    </h4>
  );
}
TimelineTitle.displayName = "TimelineTitle";

export interface TimelineTimeProps extends HTMLAttributes<HTMLTimeElement> {
  ref?: Ref<HTMLTimeElement>;
  dateTime?: string;
}

function TimelineTime({
  className,
  ref,
  dateTime,
  ...props
}: TimelineTimeProps): ReactElement {
  return (
    <time
      ref={ref}
      dateTime={dateTime}
      data-slot="timeline-time"
      className={cn(
        "whitespace-nowrap text-xs font-medium text-muted-foreground tabular-nums",
        className,
      )}
      {...props}
    />
  );
}
TimelineTime.displayName = "TimelineTime";

export interface TimelineDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
}

function TimelineDescription({
  className,
  ref,
  ...props
}: TimelineDescriptionProps): ReactElement {
  return (
    <p
      ref={ref}
      data-slot="timeline-description"
      className={cn(
        "text-sm leading-relaxed text-muted-foreground [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}
TimelineDescription.displayName = "TimelineDescription";

export {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
  timelineDotVariants,
  timelineConnectorVariants,
};
