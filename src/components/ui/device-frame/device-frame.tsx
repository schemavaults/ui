"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

export const deviceFrameVariantIds = [
  "phone-modern",
  "phone-classic",
  "tablet",
  "laptop",
] as const satisfies string[];

export type DeviceFrameVariantId = (typeof deviceFrameVariantIds)[number];

export const deviceFrameSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies string[];

export type DeviceFrameSizeId = (typeof deviceFrameSizeIds)[number];

export const deviceFrameOrientationIds = [
  "portrait",
  "landscape",
] as const satisfies string[];

export type DeviceFrameOrientationId =
  (typeof deviceFrameOrientationIds)[number];

export const deviceFrameColorIds = [
  "graphite",
  "silver",
  "gold",
  "midnight",
] as const satisfies string[];

export type DeviceFrameColorId = (typeof deviceFrameColorIds)[number];

const deviceBezelPalette = {
  graphite: {
    bezel:
      "bg-neutral-900 border-neutral-800 dark:bg-neutral-950 dark:border-neutral-900",
    accent: "bg-neutral-800 dark:bg-neutral-900",
  },
  silver: {
    bezel:
      "bg-neutral-200 border-neutral-300 dark:bg-neutral-300 dark:border-neutral-400",
    accent: "bg-neutral-300 dark:bg-neutral-400",
  },
  gold: {
    bezel:
      "bg-amber-100 border-amber-200 dark:bg-amber-200 dark:border-amber-300",
    accent: "bg-amber-200 dark:bg-amber-300",
  },
  midnight: {
    bezel:
      "bg-slate-950 border-slate-900 dark:bg-black dark:border-slate-950",
    accent: "bg-slate-900 dark:bg-slate-950",
  },
} as const satisfies Record<DeviceFrameColorId, { bezel: string; accent: string }>;

const deviceFrameVariants = cva(
  "relative isolate box-content shrink-0 overflow-hidden border shadow-2xl",
  {
    variants: {
      variant: {
        "phone-modern": "rounded-[2.75rem] p-[0.55rem]",
        "phone-classic": "rounded-[2rem] px-[0.5rem] py-[3rem]",
        tablet: "rounded-[1.75rem] p-[0.85rem]",
        laptop: "rounded-t-xl rounded-b-none p-[0.6rem]",
      } satisfies Record<DeviceFrameVariantId, string>,
    },
    defaultVariants: {
      variant: "phone-modern",
    },
  },
);

const deviceFrameSizeMap: Record<
  DeviceFrameVariantId,
  Record<DeviceFrameOrientationId, Record<DeviceFrameSizeId, string>>
> = {
  "phone-modern": {
    portrait: {
      sm: "w-[200px] aspect-[9/19.5]",
      md: "w-[280px] aspect-[9/19.5]",
      lg: "w-[360px] aspect-[9/19.5]",
    },
    landscape: {
      sm: "w-[400px] aspect-[19.5/9]",
      md: "w-[560px] aspect-[19.5/9]",
      lg: "w-[720px] aspect-[19.5/9]",
    },
  },
  "phone-classic": {
    portrait: {
      sm: "w-[200px] aspect-[9/16]",
      md: "w-[280px] aspect-[9/16]",
      lg: "w-[360px] aspect-[9/16]",
    },
    landscape: {
      sm: "w-[400px] aspect-[16/9]",
      md: "w-[560px] aspect-[16/9]",
      lg: "w-[720px] aspect-[16/9]",
    },
  },
  tablet: {
    portrait: {
      sm: "w-[300px] aspect-[3/4]",
      md: "w-[420px] aspect-[3/4]",
      lg: "w-[540px] aspect-[3/4]",
    },
    landscape: {
      sm: "w-[400px] aspect-[4/3]",
      md: "w-[560px] aspect-[4/3]",
      lg: "w-[720px] aspect-[4/3]",
    },
  },
  laptop: {
    portrait: {
      sm: "w-[500px] aspect-[16/10]",
      md: "w-[700px] aspect-[16/10]",
      lg: "w-[900px] aspect-[16/10]",
    },
    landscape: {
      sm: "w-[500px] aspect-[16/10]",
      md: "w-[700px] aspect-[16/10]",
      lg: "w-[900px] aspect-[16/10]",
    },
  },
};

export interface DeviceFrameProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof deviceFrameVariants> {
  /** Device silhouette. Defaults to `phone-modern`. */
  variant?: DeviceFrameVariantId;
  /** Portrait (default) or landscape. Ignored for `laptop` (always landscape). */
  orientation?: DeviceFrameOrientationId;
  /** Preset frame size. Defaults to `md`. */
  size?: DeviceFrameSizeId;
  /** Bezel color. Defaults to `graphite`. */
  color?: DeviceFrameColorId;
  /**
   * When true, the phone-modern variant renders a Dynamic Island. When false,
   * it renders a traditional notch. Ignored for other variants.
   */
  dynamicIsland?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function DeviceFrame({
  className,
  variant = "phone-modern",
  orientation = "portrait",
  size = "md",
  color = "graphite",
  dynamicIsland = true,
  children,
  ref,
  ...props
}: DeviceFrameProps): ReactElement {
  const effectiveOrientation: DeviceFrameOrientationId =
    variant === "laptop" ? "landscape" : orientation;
  const sizeClasses = deviceFrameSizeMap[variant][effectiveOrientation][size];
  const palette = deviceBezelPalette[color];

  return (
    <div
      ref={ref}
      data-slot="device-frame"
      data-variant={variant}
      data-orientation={effectiveOrientation}
      data-size={size}
      data-color={color}
      className={cn(
        deviceFrameVariants({ variant }),
        palette.bezel,
        sizeClasses,
        className,
      )}
      {...props}
    >
      {variant === "phone-modern" ? (
        <PhoneModernOrnaments
          orientation={effectiveOrientation}
          dynamicIsland={dynamicIsland}
        />
      ) : null}
      {variant === "phone-classic" ? (
        <PhoneClassicOrnaments
          orientation={effectiveOrientation}
          accent={palette.accent}
        />
      ) : null}
      {variant === "tablet" ? (
        <TabletOrnaments accent={palette.accent} />
      ) : null}
      {children}
      {variant === "laptop" ? <LaptopBase color={color} /> : null}
    </div>
  );
}
DeviceFrame.displayName = "DeviceFrame";

function PhoneModernOrnaments({
  orientation,
  dynamicIsland,
}: {
  orientation: DeviceFrameOrientationId;
  dynamicIsland: boolean;
}): ReactElement {
  const positionClass =
    orientation === "portrait"
      ? "top-3 left-1/2 -translate-x-1/2"
      : "left-3 top-1/2 -translate-y-1/2";
  const shapeClass = dynamicIsland
    ? orientation === "portrait"
      ? "h-6 w-24 rounded-full"
      : "h-24 w-6 rounded-full"
    : orientation === "portrait"
      ? "h-6 w-32 rounded-b-2xl"
      : "h-32 w-6 rounded-r-2xl";
  const nonIslandPosition =
    !dynamicIsland && orientation === "portrait"
      ? "top-[0.55rem] left-1/2 -translate-x-1/2"
      : !dynamicIsland && orientation === "landscape"
        ? "left-[0.55rem] top-1/2 -translate-y-1/2"
        : positionClass;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-20 bg-black",
        shapeClass,
        nonIslandPosition,
      )}
    />
  );
}

function PhoneClassicOrnaments({
  orientation,
  accent,
}: {
  orientation: DeviceFrameOrientationId;
  accent: string;
}): ReactElement {
  if (orientation === "portrait") {
    return (
      <>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-2"
        >
          <span className="size-1.5 rounded-full bg-neutral-700/80" />
          <span className="h-1.5 w-12 rounded-full bg-neutral-800/80" />
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-3 left-1/2 z-20 size-8 -translate-x-1/2 rounded-full border-2",
            accent,
            "border-neutral-500/60",
          )}
        />
      </>
    );
  }
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-2"
      >
        <span className="size-1.5 rounded-full bg-neutral-700/80" />
        <span className="h-12 w-1.5 rounded-full bg-neutral-800/80" />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 z-20 size-8 -translate-y-1/2 rounded-full border-2",
          accent,
          "border-neutral-500/60",
        )}
      />
    </>
  );
}

function TabletOrnaments({ accent }: { accent: string }): ReactElement {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute right-3 top-1/2 z-20 size-1.5 -translate-y-1/2 rounded-full",
        accent,
      )}
    />
  );
}

function LaptopBase({ color }: { color: DeviceFrameColorId }): ReactElement {
  const palette = deviceBezelPalette[color];
  return (
    <div
      aria-hidden="true"
      data-slot="device-frame-laptop-base"
      className="pointer-events-none absolute -bottom-[0.9rem] left-1/2 z-30 w-[112%] -translate-x-1/2"
    >
      <div
        className={cn(
          "h-2 rounded-b-md border-x border-b",
          palette.bezel,
        )}
      />
      <div className="mx-auto h-1 w-24 rounded-b-md bg-neutral-600/60 dark:bg-neutral-700/60" />
    </div>
  );
}

const deviceFrameScreenVariants = cva(
  "relative z-10 flex h-full w-full flex-col overflow-hidden bg-background text-foreground",
  {
    variants: {
      variant: {
        "phone-modern": "rounded-[2.25rem]",
        "phone-classic": "rounded-md",
        tablet: "rounded-[1rem]",
        laptop: "rounded-md",
      } satisfies Record<DeviceFrameVariantId, string>,
    },
    defaultVariants: {
      variant: "phone-modern",
    },
  },
);

export interface DeviceFrameScreenProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof deviceFrameScreenVariants> {
  variant?: DeviceFrameVariantId;
  ref?: Ref<HTMLDivElement>;
}

function DeviceFrameScreen({
  className,
  variant = "phone-modern",
  ref,
  ...props
}: DeviceFrameScreenProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="device-frame-screen"
      data-variant={variant}
      className={cn(deviceFrameScreenVariants({ variant }), className)}
      {...props}
    />
  );
}
DeviceFrameScreen.displayName = "DeviceFrameScreen";

export interface DeviceFrameStatusBarProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Displayed time. Defaults to `9:41` (Apple's canonical marketing time). */
  time?: string;
  /** Trailing icons cluster. Defaults to signal + wifi + battery. */
  trailing?: ReactNode;
  /** Skip the default padding accommodating a notch/island cutout. */
  compact?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function DefaultStatusIcons(): ReactElement {
  return (
    <span className="flex items-center gap-1.5">
      <svg
        aria-hidden="true"
        viewBox="0 0 16 10"
        className="h-2.5 w-3"
        fill="currentColor"
      >
        <rect x="0" y="7" width="2" height="3" rx="0.5" />
        <rect x="3.5" y="5" width="2" height="5" rx="0.5" />
        <rect x="7" y="3" width="2" height="7" rx="0.5" />
        <rect x="10.5" y="0" width="2" height="10" rx="0.5" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 12"
        className="h-2.5 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      >
        <path d="M1 5a10 10 0 0 1 14 0" />
        <path d="M3.5 7.5a6.5 6.5 0 0 1 9 0" />
        <circle cx="8" cy="10" r="0.75" fill="currentColor" stroke="none" />
      </svg>
      <span
        aria-hidden="true"
        className="ml-0.5 inline-flex h-3 w-6 items-center rounded-[3px] border border-current p-[1px]"
      >
        <span className="block h-full w-[70%] rounded-[1px] bg-current" />
      </span>
    </span>
  );
}

function DeviceFrameStatusBar({
  className,
  time = "9:41",
  trailing,
  compact = false,
  ref,
  ...props
}: DeviceFrameStatusBarProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="device-frame-status-bar"
      className={cn(
        "flex w-full shrink-0 items-center justify-between text-[0.7rem] font-semibold text-foreground",
        compact ? "px-4 py-1" : "px-6 py-2 pt-3",
        className,
      )}
      {...props}
    >
      <span className="tabular-nums">{time}</span>
      {trailing ?? <DefaultStatusIcons />}
    </div>
  );
}
DeviceFrameStatusBar.displayName = "DeviceFrameStatusBar";

export interface DeviceFrameHomeIndicatorProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function DeviceFrameHomeIndicator({
  className,
  ref,
  ...props
}: DeviceFrameHomeIndicatorProps): ReactElement {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="device-frame-home-indicator"
      className={cn(
        "flex w-full shrink-0 items-center justify-center py-2",
        className,
      )}
      {...props}
    >
      <span className="h-1 w-1/3 max-w-[8rem] rounded-full bg-foreground/70" />
    </div>
  );
}
DeviceFrameHomeIndicator.displayName = "DeviceFrameHomeIndicator";

export interface DeviceFrameContentProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function DeviceFrameContent({
  className,
  ref,
  ...props
}: DeviceFrameContentProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="device-frame-content"
      className={cn("relative flex-1 overflow-hidden", className)}
      {...props}
    />
  );
}
DeviceFrameContent.displayName = "DeviceFrameContent";

export {
  DeviceFrame,
  DeviceFrameScreen,
  DeviceFrameStatusBar,
  DeviceFrameHomeIndicator,
  DeviceFrameContent,
  deviceFrameVariants,
  deviceFrameScreenVariants,
};
