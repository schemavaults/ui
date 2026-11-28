"use client";

import { cva } from "class-variance-authority";
import { AlertTriangle, Clock, PauseCircle } from "lucide-react";
import {
  useId,
  useMemo,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/components/ui/relative-time/format-relative-time";
import {
  cronScheduleColorIds,
  cronScheduleLayoutIds,
  cronScheduleSizeIds,
  cronScheduleVariantIds,
  type CronScheduleColor,
  type CronScheduleLayout,
  type CronScheduleSize,
  type CronScheduleVariant,
} from "./cron-schedule-variants";
import {
  cronFieldIds,
  describeCronExpression,
  getNextCronRuns,
  parseCronExpression,
  type CronFieldId,
  type CronParseResult,
} from "./parse-cron-expression";

const cronScheduleVariants = cva(
  "rounded-lg border text-left transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground shadow-sm",
        outline: "border-input bg-background text-foreground",
        subtle: "border-transparent bg-muted/60 text-foreground",
        terminal:
          "border-zinc-800 bg-zinc-950 text-zinc-100 dark:border-zinc-700",
      } satisfies Record<CronScheduleVariant, string>,
      size: {
        sm: "p-3 text-xs gap-2",
        md: "p-4 text-sm gap-3",
      } satisfies Record<CronScheduleSize, string>,
      layout: {
        card: "flex flex-col",
        inline: "inline-flex flex-wrap items-center gap-x-2 gap-y-1",
      } satisfies Record<CronScheduleLayout, string>,
    },
    compoundVariants: [
      { layout: "inline", size: "sm", className: "px-2 py-1" },
      { layout: "inline", size: "md", className: "px-2.5 py-1.5" },
    ],
    defaultVariants: { variant: "default", size: "md", layout: "card" },
  },
);

/**
 * Accent classes per colour. `@schemavaults/theme` tokens are used wherever
 * one exists; `success` mirrors UptimeBar/PermissionMatrix's emerald since
 * the theme has no success token yet.
 */
const cronScheduleColors: Record<
  CronScheduleColor,
  { text: string; activeSegment: string; dot: string }
> = {
  primary: {
    text: "text-primary",
    activeSegment: "bg-primary/10 text-primary ring-primary/40",
    dot: "bg-primary",
  },
  success: {
    text: "text-emerald-600 dark:text-emerald-400",
    activeSegment:
      "bg-emerald-500/15 text-emerald-700 ring-emerald-500/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  warning: {
    text: "text-warning",
    activeSegment: "bg-warning/15 text-warning ring-warning/50",
    dot: "bg-warning",
  },
  destructive: {
    text: "text-destructive",
    activeSegment: "bg-destructive/10 text-destructive ring-destructive/40",
    dot: "bg-destructive",
  },
  brand: {
    text: "text-schemavaults-brand-blue",
    activeSegment:
      "bg-schemavaults-brand-blue/10 text-schemavaults-brand-blue ring-schemavaults-brand-blue/40",
    dot: "bg-schemavaults-brand-blue",
  },
  neutral: {
    text: "text-foreground",
    activeSegment: "bg-muted text-foreground ring-border",
    dot: "bg-muted-foreground",
  },
};

const terminalPalette: (typeof cronScheduleColors)[CronScheduleColor] = {
  text: "text-zinc-100",
  activeSegment: "bg-zinc-800 text-zinc-50 ring-zinc-600",
  dot: "bg-zinc-300",
};

const SHORT_FIELD_LABELS: Record<CronFieldId, string> = {
  minute: "minute",
  hour: "hour",
  dayOfMonth: "day",
  month: "month",
  dayOfWeek: "weekday",
};

export interface CronScheduleProps
  extends Omit<ComponentProps<"div">, "children" | "title" | "color"> {
  /** A 5-field cron expression or macro such as `@daily`. */
  expression: string;
  /** Optional heading, e.g. the job name. Card layout only. */
  title?: ReactNode;
  /** Surface style. Defaults to `default`. */
  variant?: CronScheduleVariant;
  /** Accent used for the highlighted field and next-run markers. */
  color?: CronScheduleColor;
  size?: CronScheduleSize;
  /** `card` (default) shows the field breakdown; `inline` fits a table cell. */
  layout?: CronScheduleLayout;
  /** Show the per-field breakdown (card layout). Defaults to `true`. */
  showFields?: boolean;
  /** Show the plain-English description. Defaults to `true`. */
  showDescription?: boolean;
  /** How many upcoming runs to list. `0` hides the list. Defaults to `3`. */
  nextRuns?: number;
  /** Evaluate and display times in UTC rather than the viewer's local zone. */
  utc?: boolean;
  /** Reference time for next runs; pin it for deterministic rendering. */
  now?: Date | number;
  /** BCP 47 locale(s) for formatting run times. */
  locale?: string | string[];
  /** Field highlighted before the user hovers or focuses one. */
  defaultActiveField?: CronFieldId;
  /** Marks the job as paused: muted styling and no upcoming runs. */
  paused?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function formatRun(date: Date, utc: boolean, locale?: string | string[]): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: utc ? "UTC" : undefined,
  }).format(date);
}

function CronSchedule({
  expression,
  title,
  variant = "default",
  color = "primary",
  size = "md",
  layout = "card",
  showFields = true,
  showDescription = true,
  nextRuns = 3,
  utc = false,
  now,
  locale,
  paused = false,
  defaultActiveField,
  className,
  ref,
  ...props
}: CronScheduleProps): ReactElement {
  const [mountedAt] = useState<number>(() => Date.now());
  const reference = now ?? mountedAt;
  const referenceMs = typeof reference === "number" ? reference : reference.getTime();
  const [activeField, setActiveField] = useState<CronFieldId | null>(
    defaultActiveField ?? null,
  );
  const descriptionId = useId();

  const parsed: CronParseResult = useMemo(
    () => parseCronExpression(expression),
    [expression],
  );
  const description = useMemo(
    () => (parsed.ok ? describeCronExpression(parsed) : undefined),
    [parsed],
  );
  const runs = useMemo(
    () =>
      parsed.ok && !paused && nextRuns > 0
        ? getNextCronRuns(parsed, { from: referenceMs, count: nextRuns, utc })
        : [],
    [parsed, paused, nextRuns, referenceMs, utc],
  );

  const isTerminal = variant === "terminal";
  // `primary` and `neutral` are near-black in light mode, which vanishes on
  // the always-dark terminal surface; swap in a light accent there.
  const palette =
    isTerminal && (color === "primary" || color === "neutral")
      ? terminalPalette
      : cronScheduleColors[color];
  const mutedText = isTerminal ? "text-zinc-400" : "text-muted-foreground";
  const invalid = !parsed.ok;

  const rootProps = {
    ref,
    "data-slot": "cron-schedule",
    "data-variant": variant,
    "data-color": color,
    "data-layout": layout,
    "data-invalid": invalid || undefined,
    "data-paused": paused || undefined,
    className: cn(
      cronScheduleVariants({ variant, size, layout }),
      invalid && "border-destructive/50",
      className,
    ),
    ...props,
  };

  const zoneBadge = (
    <span
      className={cn(
        "rounded border px-1 font-mono text-[10px] uppercase leading-4",
        isTerminal ? "border-zinc-700 text-zinc-400" : "border-border text-muted-foreground",
      )}
    >
      {utc ? "UTC" : "Local"}
    </span>
  );

  const pausedBadge = paused ? (
    <span
      data-slot="cron-schedule-paused"
      className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-medium text-warning"
    >
      <PauseCircle aria-hidden className="size-3" />
      Paused
    </span>
  ) : null;

  if (layout === "inline") {
    const next = runs[0];
    return (
      <div {...rootProps}>
        <code
          className={cn(
            "font-mono font-semibold",
            invalid ? "text-destructive" : palette.text,
          )}
        >
          {parsed.expression || expression}
        </code>
        {invalid ? (
          <span className="text-destructive">{parsed.error}</span>
        ) : (
          <>
            {showDescription && <span>{description}</span>}
            {pausedBadge}
            {next && (
              <span className={mutedText}>
                · next{" "}
                <time dateTime={next.toISOString()} title={formatRun(next, utc, locale)}>
                  {formatRelativeTime(next, { now: referenceMs, locale })}
                </time>
              </span>
            )}
          </>
        )}
      </div>
    );
  }

  const activeDescription =
    parsed.ok && activeField
      ? `${parsed.fields[activeField].label}: ${parsed.fields[activeField].description}`
      : undefined;

  return (
    <div {...rootProps}>
      {(title !== undefined || pausedBadge) && (
        <div className="flex items-center justify-between gap-2">
          {title !== undefined && (
            <div className="flex min-w-0 items-center gap-2 font-medium">
              <Clock aria-hidden className={cn("size-4 shrink-0", palette.text)} />
              <span className="truncate">{title}</span>
            </div>
          )}
          {pausedBadge}
        </div>
      )}

      {showFields && (
        <div
          role="group"
          aria-label="Cron fields"
          aria-describedby={showDescription ? descriptionId : undefined}
          className="flex flex-wrap items-start gap-1"
          onMouseLeave={() => setActiveField(null)}
        >
          {parsed.ok
            ? cronFieldIds.map((id) => {
                const field = parsed.fields[id];
                const active = activeField === id;
                return (
                  <button
                    key={id}
                    type="button"
                    data-slot="cron-schedule-field"
                    data-field={id}
                    data-active={active || undefined}
                    aria-label={`${field.label}: ${field.raw} — ${field.description}`}
                    aria-pressed={active}
                    onMouseEnter={() => setActiveField(id)}
                    onFocus={() => setActiveField(id)}
                    onBlur={() => setActiveField(null)}
                    onClick={() => setActiveField(id)}
                    className={cn(
                      "flex flex-col items-center rounded-md py-1 outline-none ring-1 ring-transparent transition-colors focus-visible:ring-2",
                      isTerminal ? "focus-visible:ring-zinc-500" : "focus-visible:ring-ring",
                      size === "sm" ? "min-w-10 px-1.5" : "min-w-12 px-2",
                      active && palette.activeSegment,
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono font-semibold",
                        size === "sm" ? "text-base" : "text-xl",
                      )}
                    >
                      {field.raw}
                    </span>
                    <span className={cn("text-[10px] uppercase tracking-wide", !active && mutedText)}>
                      {SHORT_FIELD_LABELS[id]}
                    </span>
                  </button>
                );
              })
            : (
                <code className="font-mono text-base font-semibold text-destructive">
                  {parsed.expression === ""
                    ? "(empty)"
                    : parsed.expression.split(" ").map((token, index) => (
                        <span
                          key={index}
                          data-invalid-field={
                            parsed.fieldId !== undefined &&
                            cronFieldIds.indexOf(parsed.fieldId) === index
                              ? true
                              : undefined
                          }
                          className="mr-[1ch] last:mr-0 data-[invalid-field]:underline data-[invalid-field]:decoration-wavy data-[invalid-field]:underline-offset-4"
                        >
                          {token}
                        </span>
                      ))}
                </code>
              )}
          {parsed.ok && parsed.macro && (
            <span className={cn("self-center font-mono text-xs", mutedText)}>
              = {parsed.macro}
            </span>
          )}
        </div>
      )}

      {invalid ? (
        <p role="alert" className="flex items-center gap-1.5 text-destructive">
          <AlertTriangle aria-hidden className="size-4 shrink-0" />
          {parsed.error}
        </p>
      ) : (
        showDescription && (
          <p
            id={descriptionId}
            data-slot="cron-schedule-description"
            aria-live="polite"
            className={cn(activeDescription && palette.text)}
          >
            {activeDescription ?? description}
          </p>
        )
      )}

      {parsed.ok && !paused && nextRuns > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className={cn("flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide", mutedText)}>
            Next runs {zoneBadge}
          </div>
          {runs.length === 0 ? (
            <p className={mutedText}>This schedule never runs.</p>
          ) : (
            <ol data-slot="cron-schedule-runs" className="flex flex-col gap-1">
              {runs.map((run, index) => (
                <li
                  key={run.getTime()}
                  className="flex flex-wrap items-center gap-x-2"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      palette.dot,
                      index > 0 && "opacity-50",
                    )}
                  />
                  <time
                    dateTime={run.toISOString()}
                    className="whitespace-nowrap font-mono tabular-nums"
                  >
                    {formatRun(run, utc, locale)}
                  </time>
                  <span className={cn("ml-auto whitespace-nowrap pl-3", mutedText)}>
                    {formatRelativeTime(run, { now: referenceMs, locale })}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
CronSchedule.displayName = "CronSchedule";

export {
  CronSchedule,
  cronScheduleVariants,
  cronScheduleColors,
  cronScheduleVariantIds,
  cronScheduleColorIds,
  cronScheduleSizeIds,
  cronScheduleLayoutIds,
};
export type {
  CronScheduleVariant,
  CronScheduleColor,
  CronScheduleSize,
  CronScheduleLayout,
};

export default CronSchedule;
