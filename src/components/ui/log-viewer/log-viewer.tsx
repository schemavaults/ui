"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDown, Search } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type UIEvent,
} from "react";

import { cn } from "@/lib/utils";

export const logLevelIds = [
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
] as const satisfies string[];

export type LogLevel = (typeof logLevelIds)[number];

export const logViewerVariantIds = [
  "default",
  "terminal",
] as const satisfies string[];

export type LogViewerVariantId = (typeof logViewerVariantIds)[number];

export const logViewerSizeIds = ["sm", "md"] as const satisfies string[];

export type LogViewerSizeId = (typeof logViewerSizeIds)[number];

export interface LogEntry {
  /** Stable key for the line. Falls back to the line's index. */
  id?: string | number;
  level: LogLevel;
  message: string;
  /** A `Date`, epoch milliseconds, or any string `Date` can parse. */
  timestamp?: Date | number | string;
  /** Optional emitter tag, e.g. `api`, `worker`, `db`. */
  source?: string;
}

const logViewerVariants = cva(
  "flex w-full flex-col overflow-hidden rounded-lg border font-mono",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        terminal: "border-zinc-800 bg-zinc-950 text-zinc-100",
      } satisfies Record<LogViewerVariantId, string>,
      size: {
        sm: "text-xs",
        md: "text-sm",
      } satisfies Record<LogViewerSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

/**
 * Per-level badge colours. `warn`/`error`/`fatal` lean on the
 * `@schemavaults/theme` state tokens; levels without a theme token use the
 * same emerald/sky/zinc scale as `TerminalFrameOutput`'s tones.
 */
const levelBadgeClasses: Record<LogLevel, string> = {
  trace: "text-muted-foreground/70",
  debug: "text-muted-foreground",
  info: "text-sky-600 dark:text-sky-400",
  warn: "text-warning-foreground bg-warning/30 dark:text-warning",
  error: "text-destructive bg-destructive/10",
  fatal: "bg-destructive text-destructive-foreground",
};

const levelRowClasses: Record<LogLevel, string> = {
  trace: "",
  debug: "",
  info: "",
  warn: "bg-warning/10",
  error: "bg-destructive/5",
  fatal: "bg-destructive/10",
};

const terminalLevelBadgeClasses: Partial<Record<LogLevel, string>> = {
  trace: "text-zinc-500",
  debug: "text-zinc-400",
  info: "text-sky-400",
  warn: "text-warning bg-warning/10",
  error: "text-red-400 bg-red-500/10",
};

const levelLabels: Record<LogLevel, string> = {
  trace: "TRACE",
  debug: "DEBUG",
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
  fatal: "FATAL",
};

function pad(value: number, length = 2): string {
  return String(value).padStart(length, "0");
}

function toDate(timestamp: LogEntry["timestamp"]): Date | null {
  if (timestamp === undefined) return null;
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats a timestamp as `HH:MM:SS.mmm` in local time. */
export function formatLogTimestamp(
  timestamp: LogEntry["timestamp"],
): string | null {
  const date = toDate(timestamp);
  if (!date) return null;
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}.${pad(date.getMilliseconds(), 3)}`;
}

/** Case-insensitive substring highlight with `<mark>`. */
function highlight(text: string, query: string): ReactNode {
  if (!query) return text;
  const lower = text.toLowerCase();
  const needle = query.toLowerCase();
  const parts: ReactNode[] = [];
  let cursor = 0;
  let index = lower.indexOf(needle, cursor);
  while (index !== -1) {
    if (index > cursor) parts.push(text.slice(cursor, index));
    parts.push(
      <mark
        key={index}
        data-slot="log-viewer-match"
        className="rounded-sm bg-warning/60 text-inherit"
      >
        {text.slice(index, index + needle.length)}
      </mark>,
    );
    cursor = index + needle.length;
    index = lower.indexOf(needle, cursor);
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

export interface LogViewerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof logViewerVariants> {
  entries: readonly LogEntry[];
  /** Heading shown in the toolbar, e.g. a service or deployment name. */
  title?: ReactNode;
  /** Show the level filter chips and search box. Defaults to `true`. */
  showToolbar?: boolean;
  showTimestamps?: boolean;
  showLineNumbers?: boolean;
  /** Wrap long lines instead of scrolling horizontally. */
  wrap?: boolean;
  /**
   * Keep the view pinned to the newest line as entries arrive. Scrolling up
   * pauses following; a "Jump to latest" button resumes it.
   */
  follow?: boolean;
  /** Levels visible on first render (uncontrolled). Defaults to all. */
  defaultLevels?: readonly LogLevel[];
  /** Controlled set of visible levels. */
  levels?: readonly LogLevel[];
  onLevelsChange?: (levels: LogLevel[]) => void;
  /** Initial search text (uncontrolled). */
  defaultQuery?: string;
  /** Controlled search text. */
  query?: string;
  onQueryChange?: (query: string) => void;
  /** Rendered when no line passes the filters. */
  emptyMessage?: ReactNode;
  /** Classes for the scrolling body; use it to set a height. */
  bodyClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

function LogViewer({
  entries,
  title,
  showToolbar = true,
  showTimestamps = true,
  showLineNumbers = true,
  wrap = false,
  follow = false,
  defaultLevels,
  levels: levelsProp,
  onLevelsChange,
  defaultQuery = "",
  query: queryProp,
  onQueryChange,
  emptyMessage = "No log lines match the current filters.",
  variant,
  size,
  className,
  bodyClassName,
  ref,
  ...props
}: LogViewerProps): ReactElement {
  const isTerminal = variant === "terminal";

  const [levelsState, setLevelsState] = useState<LogLevel[]>(() => [
    ...(defaultLevels ?? logLevelIds),
  ]);
  const levels = levelsProp ?? levelsState;
  const [queryState, setQueryState] = useState(defaultQuery);
  const query = queryProp ?? queryState;

  const setLevels = useCallback(
    (next: LogLevel[]): void => {
      if (levelsProp === undefined) setLevelsState(next);
      onLevelsChange?.(next);
    },
    [levelsProp, onLevelsChange],
  );

  const setQuery = useCallback(
    (next: string): void => {
      if (queryProp === undefined) setQueryState(next);
      onQueryChange?.(next);
    },
    [queryProp, onQueryChange],
  );

  const counts = useMemo(() => {
    const result = Object.fromEntries(
      logLevelIds.map((level) => [level, 0]),
    ) as Record<LogLevel, number>;
    for (const entry of entries) result[entry.level] += 1;
    return result;
  }, [entries]);

  const trimmedQuery = query.trim();
  const visible = useMemo(() => {
    const needle = trimmedQuery.toLowerCase();
    const active = new Set(levels);
    return entries
      .map((entry, index) => ({ entry, lineNumber: index + 1 }))
      .filter(
        ({ entry }) =>
          active.has(entry.level) &&
          (!needle ||
            entry.message.toLowerCase().includes(needle) ||
            (entry.source?.toLowerCase().includes(needle) ?? false)),
      );
  }, [entries, levels, trimmedQuery]);

  const bodyRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(true);

  const scrollToBottom = useCallback((): void => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, []);

  useLayoutEffect(() => {
    if (follow && pinned) scrollToBottom();
  }, [follow, pinned, visible.length, scrollToBottom]);

  useEffect(() => {
    if (!follow) setPinned(true);
  }, [follow]);

  const handleScroll = (event: UIEvent<HTMLDivElement>): void => {
    if (!follow) return;
    const body = event.currentTarget;
    const distance = body.scrollHeight - body.scrollTop - body.clientHeight;
    setPinned(distance < 24);
  };

  const toggleLevel = (level: LogLevel): void => {
    setLevels(
      levels.includes(level)
        ? levels.filter((l) => l !== level)
        : logLevelIds.filter((l) => l === level || levels.includes(l)),
    );
  };

  const presentLevels = logLevelIds.filter((level) => counts[level] > 0);
  const gutterWidth = `${String(entries.length).length}ch`;

  return (
    <div
      ref={ref}
      data-slot="log-viewer"
      data-variant={variant ?? "default"}
      className={cn(logViewerVariants({ variant, size }), className)}
      {...props}
    >
      {showToolbar ? (
        <div
          data-slot="log-viewer-toolbar"
          className={cn(
            "flex flex-wrap items-center gap-2 border-b px-3 py-2 font-sans",
            isTerminal
              ? "border-zinc-800 bg-zinc-900/70"
              : "border-border bg-muted/50",
          )}
        >
          {title ? (
            <div className="mr-auto truncate text-sm font-medium">{title}</div>
          ) : null}
          <div
            role="group"
            aria-label="Filter by log level"
            className={cn("flex flex-wrap gap-1", !title && "mr-auto")}
          >
            {presentLevels.map((level) => {
              const active = levels.includes(level);
              return (
                <button
                  key={level}
                  type="button"
                  aria-pressed={active}
                  onClick={(): void => toggleLevel(level)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? isTerminal
                        ? "border-zinc-700 bg-zinc-800 text-zinc-100"
                        : "border-border bg-background text-foreground shadow-sm"
                      : isTerminal
                        ? "border-transparent text-zinc-500 line-through hover:text-zinc-300"
                        : "border-transparent text-muted-foreground line-through hover:text-foreground",
                  )}
                >
                  {levelLabels[level]}
                  <span className="font-normal tabular-nums opacity-70">
                    {counts[level]}
                  </span>
                </button>
              );
            })}
          </div>
          <label
            className={cn(
              "flex h-7 w-full items-center gap-1.5 rounded-md border px-2 sm:w-48",
              "focus-within:ring-2 focus-within:ring-ring",
              isTerminal
                ? "border-zinc-700 bg-zinc-950 text-zinc-100"
                : "border-input bg-background",
            )}
          >
            <Search
              aria-hidden="true"
              className="size-3.5 shrink-0 opacity-60"
            />
            <span className="sr-only">Search logs</span>
            <input
              type="search"
              value={query}
              placeholder="Search logs…"
              onChange={(event): void => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>
      ) : null}

      <div className="relative min-h-0 flex-1">
        <div
          ref={bodyRef}
          role="log"
          aria-live={follow ? "polite" : "off"}
          aria-label={typeof title === "string" ? title : "Log output"}
          // A scrollable region must be focusable so keyboard users can
          // scroll it (WCAG 2.1.1).
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          data-slot="log-viewer-body"
          onScroll={handleScroll}
          className={cn(
            "h-full max-h-96 overflow-auto py-1 leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
            bodyClassName,
          )}
        >
          {visible.length === 0 ? (
            <div
              data-slot="log-viewer-empty"
              className={cn(
                "px-4 py-8 text-center font-sans text-sm",
                isTerminal ? "text-zinc-500" : "text-muted-foreground",
              )}
            >
              {emptyMessage}
            </div>
          ) : (
            visible.map(({ entry, lineNumber }) => {
              const date = showTimestamps ? toDate(entry.timestamp) : null;
              return (
                <div
                  key={entry.id ?? lineNumber}
                  data-slot="log-viewer-line"
                  data-level={entry.level}
                  className={cn(
                    "flex gap-3 px-3",
                    wrap ? "items-start" : "w-max min-w-full",
                    !isTerminal && levelRowClasses[entry.level],
                    isTerminal &&
                      (entry.level === "error" || entry.level === "fatal") &&
                      "bg-red-500/5",
                    isTerminal ? "hover:bg-zinc-800/60" : "hover:bg-muted/60",
                  )}
                >
                  {showLineNumbers ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "shrink-0 select-none text-right tabular-nums",
                        isTerminal ? "text-zinc-600" : "text-muted-foreground/60",
                      )}
                      style={{ minWidth: gutterWidth }}
                    >
                      {lineNumber}
                    </span>
                  ) : null}
                  {date ? (
                    <time
                      dateTime={date.toISOString()}
                      className={cn(
                        "shrink-0 tabular-nums",
                        isTerminal ? "text-zinc-500" : "text-muted-foreground",
                      )}
                    >
                      {formatLogTimestamp(date)}
                    </time>
                  ) : null}
                  <span
                    className={cn(
                      "w-[6ch] shrink-0 rounded-sm text-center text-[0.85em] font-semibold",
                      (isTerminal && terminalLevelBadgeClasses[entry.level]) ||
                        levelBadgeClasses[entry.level],
                    )}
                  >
                    {levelLabels[entry.level]}
                  </span>
                  {entry.source ? (
                    <span
                      className={cn(
                        "shrink-0",
                        isTerminal ? "text-violet-400" : "text-primary",
                      )}
                    >
                      [{highlight(entry.source, trimmedQuery)}]
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "min-w-0",
                      wrap
                        ? "flex-1 whitespace-pre-wrap break-words"
                        : "whitespace-pre",
                    )}
                  >
                    {highlight(entry.message, trimmedQuery)}
                  </span>
                </div>
              );
            })
          )}
        </div>
        {follow && !pinned ? (
          <button
            type="button"
            onClick={(): void => {
              setPinned(true);
              scrollToBottom();
            }}
            className={cn(
              "absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1 font-sans text-xs font-medium shadow-md",
              "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <ArrowDown aria-hidden="true" className="size-3" />
            Jump to latest
          </button>
        ) : null}
      </div>

      {showToolbar ? (
        <div
          data-slot="log-viewer-status"
          aria-live="polite"
          className={cn(
            "border-t px-3 py-1 font-sans text-[11px]",
            isTerminal
              ? "border-zinc-800 text-zinc-500"
              : "border-border text-muted-foreground",
          )}
        >
          Showing {visible.length} of {entries.length} lines
        </div>
      ) : null}
    </div>
  );
}
LogViewer.displayName = "LogViewer";

export { LogViewer, logViewerVariants };
