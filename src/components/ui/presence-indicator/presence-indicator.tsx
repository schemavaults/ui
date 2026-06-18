"use client";

import type { HTMLAttributes, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";

export const presenceStatusIds = [
  "online",
  "idle",
  "busy",
  "away",
  "dnd",
  "offline",
  "invisible",
] as const satisfies readonly string[];

export type PresenceStatusId = (typeof presenceStatusIds)[number];

export const presenceSizeIds = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies readonly string[];

export type PresenceSizeId = (typeof presenceSizeIds)[number];

const dotColorClasses = {
  online: "bg-green-500",
  idle: "bg-yellow-400",
  busy: "bg-orange-500",
  away: "bg-amber-500",
  dnd: "bg-destructive",
  offline: "bg-muted-foreground/50",
  invisible: "bg-transparent border border-muted-foreground/60",
} satisfies Record<PresenceStatusId, string>;

const dotSizeClasses = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-3.5 w-3.5",
} satisfies Record<PresenceSizeId, string>;

const dndBarSizeClasses = {
  xs: "h-px w-[60%]",
  sm: "h-px w-[60%]",
  md: "h-px w-[60%]",
  lg: "h-[1.5px] w-[60%]",
  xl: "h-[1.5px] w-[60%]",
} satisfies Record<PresenceSizeId, string>;

const ringSizeClasses = {
  xs: "ring-[1.5px]",
  sm: "ring-2",
  md: "ring-2",
  lg: "ring-2",
  xl: "ring-[2.5px]",
} satisfies Record<PresenceSizeId, string>;

const labelTextClasses = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-sm",
} satisfies Record<PresenceSizeId, string>;

const statusLabels = {
  online: "Online",
  idle: "Idle",
  busy: "Busy",
  away: "Away",
  dnd: "Do not disturb",
  offline: "Offline",
  invisible: "Invisible",
} satisfies Record<PresenceStatusId, string>;

const pulseColorClasses = {
  online: "bg-green-500",
  idle: "bg-yellow-400",
  busy: "bg-orange-500",
  away: "bg-amber-500",
  dnd: "bg-destructive",
  offline: "bg-muted-foreground/50",
  invisible: "bg-muted-foreground/40",
} satisfies Record<PresenceStatusId, string>;

export interface PresenceIndicatorProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "aria-label"> {
  /** Semantic presence status. Defaults to `"online"`. */
  status?: PresenceStatusId;
  /** Visual size of the dot. Defaults to `"md"`. */
  size?: PresenceSizeId;
  /** Render a soft `ping` animation around the dot. */
  pulse?: boolean;
  /**
   * Render a contrasting ring around the dot. Useful when overlaying the
   * indicator on top of an `Avatar` or coloured surface.
   */
  bordered?: boolean;
  /**
   * Render a text label next to the dot. Pass `true` to use the default
   * status label (e.g. `"Online"`), or a string for a custom one.
   */
  label?: boolean | string;
  /**
   * Accessible label describing the status. Defaults to a humanised version of
   * the `status` (e.g. `"Online"`). Set to `null` to mark the indicator as
   * purely decorative (e.g. when paired with adjacent text that already
   * conveys the status).
   */
  "aria-label"?: string | null;
  ref?: Ref<HTMLSpanElement>;
}

function PresenceDot({
  status,
  size,
  pulse,
  bordered,
}: {
  status: PresenceStatusId;
  size: PresenceSizeId;
  pulse: boolean;
  bordered: boolean;
}): ReactElement {
  return (
    <span className="relative inline-flex items-center justify-center">
      {pulse ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            pulseColorClasses[status],
            dotSizeClasses[size],
          )}
        />
      ) : null}
      <span
        data-slot="presence-indicator-dot"
        className={cn(
          "relative inline-flex items-center justify-center rounded-full",
          dotColorClasses[status],
          dotSizeClasses[size],
          bordered && cn(ringSizeClasses[size], "ring-background"),
        )}
      >
        {status === "dnd" ? (
          <span
            aria-hidden="true"
            className={cn(
              "block rounded-full bg-destructive-foreground",
              dndBarSizeClasses[size],
            )}
          />
        ) : null}
      </span>
    </span>
  );
}

function PresenceIndicator({
  className,
  status = "online",
  size = "md",
  pulse = false,
  bordered = false,
  label,
  ref,
  "aria-label": ariaLabelProp,
  ...rest
}: PresenceIndicatorProps): ReactElement {
  const decorative = ariaLabelProp === null;
  const ariaLabel = decorative
    ? undefined
    : (ariaLabelProp ?? statusLabels[status]);

  const labelText =
    label === true
      ? statusLabels[status]
      : typeof label === "string"
        ? label
        : null;

  if (labelText !== null) {
    return (
      <span
        ref={ref}
        data-slot="presence-indicator"
        data-status={status}
        role={decorative ? undefined : "status"}
        aria-label={ariaLabel}
        aria-hidden={decorative ? true : undefined}
        className={cn(
          "inline-flex items-center gap-1.5 text-foreground",
          className,
        )}
        {...rest}
      >
        <PresenceDot
          status={status}
          size={size}
          pulse={pulse}
          bordered={bordered}
        />
        <span className={cn("font-medium leading-none", labelTextClasses[size])}>
          {labelText}
        </span>
      </span>
    );
  }

  return (
    <span
      ref={ref}
      data-slot="presence-indicator"
      data-status={status}
      role={decorative ? undefined : "status"}
      aria-label={ariaLabel}
      aria-hidden={decorative ? true : undefined}
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      {...rest}
    >
      <PresenceDot
        status={status}
        size={size}
        pulse={pulse}
        bordered={bordered}
      />
    </span>
  );
}
PresenceIndicator.displayName = "PresenceIndicator";

export { PresenceIndicator };
