"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  useCallback,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";

export const spotlightCardGlowIds = [
  "primary",
  "accent",
  "destructive",
  "warning",
  "muted",
  "brand-blue",
  "brand-red",
] as const satisfies string[];

export type SpotlightCardGlowId = (typeof spotlightCardGlowIds)[number];

export const spotlightCardSizeIds = ["sm", "md", "lg"] as const satisfies string[];

export type SpotlightCardSizeId = (typeof spotlightCardSizeIds)[number];

export const spotlightCardIntensityIds = [
  "subtle",
  "medium",
  "vivid",
] as const satisfies string[];

export type SpotlightCardIntensityId = (typeof spotlightCardIntensityIds)[number];

const spotlightCardVariants = cva(
  "group/spotlight-card relative isolate overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-colors",
  {
    variants: {
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      } satisfies Record<SpotlightCardSizeId, string>,
      glow: {
        primary: "[--spotlight-color:hsl(var(--primary))]",
        accent: "[--spotlight-color:hsl(var(--accent-foreground))]",
        destructive: "[--spotlight-color:hsl(var(--destructive))]",
        warning: "[--spotlight-color:var(--warning)]",
        muted: "[--spotlight-color:hsl(var(--muted-foreground))]",
        "brand-blue":
          "[--spotlight-color:var(--schemavaults-brand-blue)]",
        "brand-red": "[--spotlight-color:var(--schemavaults-brand-red)]",
      } satisfies Record<SpotlightCardGlowId, string>,
      intensity: {
        subtle: "[--spotlight-alpha:0.10]",
        medium: "[--spotlight-alpha:0.18]",
        vivid: "[--spotlight-alpha:0.32]",
      } satisfies Record<SpotlightCardIntensityId, string>,
      borderGlow: {
        true: "[--spotlight-border-alpha:0.55]",
        false: "[--spotlight-border-alpha:0]",
      },
    },
    defaultVariants: {
      size: "md",
      glow: "primary",
      intensity: "medium",
      borderGlow: false,
    },
  },
);

type SpotlightCardCSSVars = CSSProperties & {
  "--spotlight-x"?: string;
  "--spotlight-y"?: string;
  "--spotlight-size"?: string;
};

export interface SpotlightCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spotlightCardVariants> {
  /**
   * Diameter of the spotlight in pixels. Larger values produce a softer wash
   * of color; smaller values create a tighter, more focused highlight.
   */
  spotlightSize?: number;
  /**
   * Disable cursor tracking. Useful for static previews or
   * reduced-motion contexts where the card should stay quiet.
   */
  disableTracking?: boolean;
  ref?: Ref<HTMLDivElement>;
}

const DEFAULT_SPOTLIGHT_SIZE = 280;

function SpotlightCard({
  className,
  style,
  size,
  glow,
  intensity,
  borderGlow,
  spotlightSize = DEFAULT_SPOTLIGHT_SIZE,
  disableTracking = false,
  onMouseMove,
  onMouseLeave,
  children,
  ref,
  ...props
}: SpotlightCardProps): ReactElement {
  const innerRef = useRef<HTMLDivElement>(null);

  const setRefs = useCallback(
    (node: HTMLDivElement | null): void => {
      innerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && "current" in ref) {
        (ref as { current: HTMLDivElement | null }).current = node;
      }
    },
    [ref],
  );

  const handleMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>): void => {
      onMouseMove?.(event);
      if (disableTracking) return;
      const el = innerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
    },
    [disableTracking, onMouseMove],
  );

  const handleMouseLeave = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>): void => {
      onMouseLeave?.(event);
      if (disableTracking) return;
      const el = innerRef.current;
      if (!el) return;
      // Park the spotlight off-card so the next hover starts cleanly.
      el.style.setProperty("--spotlight-x", "-9999px");
      el.style.setProperty("--spotlight-y", "-9999px");
    },
    [disableTracking, onMouseLeave],
  );

  const inlineStyle: SpotlightCardCSSVars = {
    "--spotlight-x": "-9999px",
    "--spotlight-y": "-9999px",
    "--spotlight-size": `${spotlightSize}px`,
    ...style,
  };

  return (
    <div
      ref={setRefs}
      data-slot="spotlight-card"
      data-glow={glow ?? "primary"}
      data-intensity={intensity ?? "medium"}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={inlineStyle}
      className={cn(
        spotlightCardVariants({ size, glow, intensity, borderGlow }),
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        data-slot="spotlight-card-border-glow"
        className={cn(
          "pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500",
          "group-hover/spotlight-card:opacity-100",
        )}
        style={{
          background:
            "radial-gradient(var(--spotlight-size) circle at var(--spotlight-x) var(--spotlight-y), color-mix(in srgb, var(--spotlight-color) calc(var(--spotlight-border-alpha) * 100%), transparent), transparent 70%)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />
      <div
        aria-hidden="true"
        data-slot="spotlight-card-glow"
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500",
          "group-hover/spotlight-card:opacity-100",
        )}
        style={{
          background:
            "radial-gradient(var(--spotlight-size) circle at var(--spotlight-x) var(--spotlight-y), color-mix(in srgb, var(--spotlight-color) calc(var(--spotlight-alpha) * 100%), transparent), transparent 75%)",
        }}
      />
      <div
        data-slot="spotlight-card-content"
        className="relative z-10 flex flex-col gap-1.5"
      >
        {children}
      </div>
    </div>
  );
}
SpotlightCard.displayName = "SpotlightCard";

export { SpotlightCard, spotlightCardVariants };
