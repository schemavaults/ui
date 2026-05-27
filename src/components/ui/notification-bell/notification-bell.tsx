"use client";

import { Bell, BellRing } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactElement,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import {
  type NotificationBellIndicatorVariant,
  type NotificationBellSize,
  type NotificationBellVariant,
} from "./notification-bell-variants";

const notificationBellTriggerVariants = cva(
  "relative inline-flex items-center justify-center rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost:
          "text-muted-foreground hover:bg-accent hover:text-foreground",
        subtle:
          "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        brand:
          "bg-schemavaults-brand-blue text-primary-foreground hover:bg-schemavaults-brand-blue/90",
      } satisfies Record<NotificationBellVariant, string>,
      size: {
        sm: "h-8 w-8 [&_svg]:size-4",
        md: "h-9 w-9 [&_svg]:size-[18px]",
        lg: "h-10 w-10 [&_svg]:size-5",
      } satisfies Record<NotificationBellSize, string>,
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  },
);

const indicatorVariants = cva(
  "pointer-events-none absolute inline-flex items-center justify-center rounded-full font-medium tabular-nums ring-2 ring-background",
  {
    variants: {
      indicatorVariant: {
        destructive: "bg-destructive text-white",
        primary: "bg-primary text-primary-foreground",
        success: "bg-green-500 text-white",
        warning: "bg-yellow-500 text-black",
        brand: "bg-schemavaults-brand-blue text-primary-foreground",
      } satisfies Record<NotificationBellIndicatorVariant, string>,
    },
    defaultVariants: {
      indicatorVariant: "destructive",
    },
  },
);

const indicatorPingVariants: Record<NotificationBellIndicatorVariant, string> =
  {
    destructive: "bg-destructive",
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    brand: "bg-schemavaults-brand-blue",
  };

const indicatorSizeClasses: Record<
  NotificationBellSize,
  { dot: string; count: string; position: string; ping: string }
> = {
  sm: {
    dot: "h-2 w-2",
    count: "min-w-[14px] h-[14px] px-[3px] text-[9px] leading-none",
    position: "-top-0.5 -right-0.5",
    ping: "h-2 w-2",
  },
  md: {
    dot: "h-2.5 w-2.5",
    count: "min-w-[16px] h-[16px] px-1 text-[10px] leading-none",
    position: "-top-0.5 -right-0.5",
    ping: "h-2.5 w-2.5",
  },
  lg: {
    dot: "h-3 w-3",
    count: "min-w-[18px] h-[18px] px-1 text-[11px] leading-none",
    position: "-top-1 -right-1",
    ping: "h-3 w-3",
  },
};

export interface NotificationBellProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof notificationBellTriggerVariants> {
  /**
   * Number of unread notifications. When `0` (and `dot` is false), no
   * indicator is shown. When greater than `maxCount`, the badge displays
   * `${maxCount}+` instead of the raw value.
   */
  count?: number;
  /** Maximum count to show numerically. Defaults to `99`. */
  maxCount?: number;
  /**
   * Render a dot indicator instead of a count. Useful when the exact number
   * is not meaningful (e.g. "there is something new"). Takes precedence over
   * `count` for the visual style; the count is still considered for whether
   * to show the indicator at all unless `forceIndicator` is set.
   */
  dot?: boolean;
  /** Always show the indicator, even when `count` is `0`. */
  forceIndicator?: boolean;
  /** Animate a soft ping around the indicator. */
  ping?: boolean;
  /**
   * Swap the bell glyph for an animated `BellRing` when the indicator is
   * visible.
   */
  ringWhenActive?: boolean;
  /** Color/style applied to the count badge or dot. */
  indicatorVariant?: NotificationBellIndicatorVariant;
  /**
   * Accessible label for the button. Defaults to `Notifications` (or
   * `Notifications (N unread)` when a positive `count` is provided).
   */
  "aria-label"?: string;
}

function _NotificationBell(
  {
    className,
    variant,
    size,
    count = 0,
    maxCount = 99,
    dot = false,
    forceIndicator = false,
    ping = false,
    ringWhenActive = false,
    indicatorVariant = "destructive",
    type = "button",
    ...props
  }: NotificationBellProps,
  ref: Ref<HTMLButtonElement>,
): ReactElement {
  const resolvedSize: NotificationBellSize = size ?? "md";
  const safeCount: number = Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
  const showIndicator: boolean = forceIndicator || dot || safeCount > 0;
  const displayLabel: string =
    safeCount > maxCount ? `${maxCount}+` : `${safeCount}`;

  const sizeClasses = indicatorSizeClasses[resolvedSize];

  const ariaLabel: string =
    props["aria-label"] ??
    (safeCount > 0
      ? `Notifications (${safeCount} unread)`
      : "Notifications");

  const BellIcon = ringWhenActive && showIndicator ? BellRing : Bell;

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={cn(
        notificationBellTriggerVariants({ variant, size: resolvedSize }),
        className,
      )}
      {...props}
    >
      <BellIcon aria-hidden="true" />
      {showIndicator && (
        <span
          className={cn("absolute", sizeClasses.position)}
          aria-hidden="true"
        >
          <span className="relative flex items-center justify-center">
            {ping && (
              <span
                className={cn(
                  "absolute inline-flex rounded-full opacity-75 animate-ping",
                  sizeClasses.ping,
                  indicatorPingVariants[indicatorVariant],
                )}
              />
            )}
            <span
              className={cn(
                indicatorVariants({ indicatorVariant }),
                dot || safeCount === 0
                  ? sizeClasses.dot
                  : sizeClasses.count,
              )}
            >
              {!dot && safeCount > 0 && displayLabel}
            </span>
          </span>
        </span>
      )}
      {safeCount > 0 && (
        <span className="sr-only" aria-live="polite">
          {safeCount} unread {safeCount === 1 ? "notification" : "notifications"}
        </span>
      )}
    </button>
  );
}

export const NotificationBell = forwardRef<
  HTMLButtonElement,
  NotificationBellProps
>(_NotificationBell);
NotificationBell.displayName = "NotificationBell";

export { notificationBellTriggerVariants };
export default NotificationBell;
