"use client";

import {
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Info,
  Lightbulb,
  AlertTriangle,
  AlertOctagon,
  MessageSquareWarning,
} from "lucide-react";

import { cn } from "@/lib/utils";

export const calloutIntentIds = [
  "note",
  "tip",
  "important",
  "warning",
  "caution",
] as const satisfies readonly string[];
export type CalloutIntentId = (typeof calloutIntentIds)[number];

export const calloutAppearanceIds = [
  "accent-bar",
  "subtle",
] as const satisfies readonly string[];
export type CalloutAppearanceId = (typeof calloutAppearanceIds)[number];

const calloutVariants = cva(
  "relative w-full text-sm text-foreground [&_a]:underline [&_a]:underline-offset-2",
  {
    variants: {
      intent: {
        note: "[--callout-color:hsl(217_91%_60%)] [--callout-tint:hsl(217_91%_60%/0.08)]",
        tip: "[--callout-color:hsl(142_71%_45%)] [--callout-tint:hsl(142_71%_45%/0.08)]",
        important:
          "[--callout-color:hsl(258_90%_66%)] [--callout-tint:hsl(258_90%_66%/0.08)]",
        warning:
          "[--callout-color:hsl(var(--warning))] [--callout-tint:hsl(var(--warning)/0.10)]",
        caution:
          "[--callout-color:hsl(var(--destructive))] [--callout-tint:hsl(var(--destructive)/0.10)]",
      } satisfies Record<CalloutIntentId, string>,
      appearance: {
        "accent-bar":
          "rounded-md border-l-4 border-l-[var(--callout-color)] bg-[var(--callout-tint)] py-3 pl-4 pr-4",
        subtle:
          "rounded-md border border-[var(--callout-color)]/30 bg-[var(--callout-tint)] p-4",
      } satisfies Record<CalloutAppearanceId, string>,
    },
    defaultVariants: {
      intent: "note",
      appearance: "accent-bar",
    },
  },
);

const defaultIcons: Record<CalloutIntentId, ReactNode> = {
  note: <Info aria-hidden className="size-4" />,
  tip: <Lightbulb aria-hidden className="size-4" />,
  important: <MessageSquareWarning aria-hidden className="size-4" />,
  warning: <AlertTriangle aria-hidden className="size-4" />,
  caution: <AlertOctagon aria-hidden className="size-4" />,
};

const defaultLabels: Record<CalloutIntentId, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

export interface CalloutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof calloutVariants> {
  /** Override the default icon for the intent. Pass `null` to hide. */
  icon?: ReactNode | null;
  /** Optional title; falls back to a default label for the intent. */
  title?: ReactNode;
  /** Render the title row even when no `title` is supplied. Defaults to true. */
  showTitle?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function Callout({
  className,
  intent = "note",
  appearance = "accent-bar",
  icon,
  title,
  showTitle = true,
  children,
  ref,
  ...props
}: CalloutProps): ReactElement {
  const resolvedIntent: CalloutIntentId = intent ?? "note";
  const resolvedIcon =
    icon === null ? null : icon ?? defaultIcons[resolvedIntent];
  const resolvedTitle = title ?? defaultLabels[resolvedIntent];

  return (
    <div
      ref={ref}
      role="note"
      data-slot="callout"
      data-intent={resolvedIntent}
      data-appearance={appearance ?? "accent-bar"}
      className={cn(calloutVariants({ intent, appearance }), className)}
      {...props}
    >
      {showTitle && (
        <div className="mb-1 flex items-center gap-2 text-[var(--callout-color)]">
          {resolvedIcon}
          <span className="text-sm font-semibold leading-none">
            {resolvedTitle}
          </span>
        </div>
      )}
      {children !== undefined && (
        <div
          data-slot="callout-content"
          className={cn(
            "text-sm leading-relaxed text-foreground/90",
            showTitle ? "" : "flex items-start gap-2",
          )}
        >
          {!showTitle && resolvedIcon !== null && (
            <span className="mt-0.5 shrink-0 text-[var(--callout-color)]">
              {resolvedIcon}
            </span>
          )}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      )}
    </div>
  );
}
Callout.displayName = "Callout";

export interface CalloutTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  ref?: Ref<HTMLHeadingElement>;
}

function CalloutTitle({
  className,
  ref,
  children,
  ...props
}: CalloutTitleProps): ReactElement {
  return (
    <h5
      ref={ref}
      data-slot="callout-title"
      className={cn(
        "mb-1 text-sm font-semibold leading-none tracking-tight text-[var(--callout-color)]",
        className,
      )}
      {...props}
    >
      {children}
    </h5>
  );
}
CalloutTitle.displayName = "CalloutTitle";

export interface CalloutDescriptionProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function CalloutDescription({
  className,
  ref,
  ...props
}: CalloutDescriptionProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="callout-description"
      className={cn(
        "text-sm leading-relaxed text-foreground/90 [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}
CalloutDescription.displayName = "CalloutDescription";

export { Callout, CalloutTitle, CalloutDescription, calloutVariants };
