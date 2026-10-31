"use client";

import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type LiHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import { RelativeTime, type RelativeTimeProps } from "../relative-time/relative-time";
import { useAgentSessionsContext } from "./agent-sessions-context";
import {
  agentSessionStatusLabels,
  filterAgentSessions,
  groupAgentSessions,
  groupAgentSessionsByRecency,
  matchesAgentSessionQuery,
  sortAgentSessionsByRecency,
  type AgentSession,
  type AgentSessionGroup,
  type AgentSessionGroupBy,
  type AgentSessionMatcher,
  type AgentSessionRecencyGroupId,
  type AgentSessionStatusId,
} from "./agent-sessions-model";
import { startOfNextLocalDay } from "./local-day";

/* ------------------------------------------------------------------ */
/* AgentSessionStatusIndicator                                        */
/* ------------------------------------------------------------------ */

const statusDotClass: Readonly<Record<AgentSessionStatusId, string>> = {
  idle: "bg-muted-foreground/40",
  running: "bg-schemavaults-brand-blue",
  "awaiting-input": "bg-warning",
  completed: "bg-green-500",
  failed: "bg-destructive",
};

export interface AgentSessionStatusIndicatorProps
  extends HTMLAttributes<HTMLSpanElement> {
  status: AgentSessionStatusId;
  /** Screen-reader text. Default: the status's entry in `agentSessionStatusLabels`. */
  label?: string;
  /** Render a dot for `idle` too (it shows nothing by default). */
  showIdle?: boolean;
  ref?: Ref<HTMLSpanElement>;
}

/**
 * A small coloured dot for a session's status; `running` pulses (unless
 * the viewer prefers reduced motion). Renders nothing for `idle` unless
 * `showIdle` is set.
 */
function AgentSessionStatusIndicator({
  status,
  label,
  showIdle = false,
  className,
  ref,
  ...props
}: AgentSessionStatusIndicatorProps): ReactElement | null {
  if (status === "idle" && !showIdle) return null;
  return (
    <span
      ref={ref}
      data-slot="agent-session-status-indicator"
      data-status={status}
      className={cn(
        "relative inline-flex size-2 shrink-0 rounded-full",
        statusDotClass[status],
        className,
      )}
      {...props}
    >
      {status === "running" ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:hidden",
            statusDotClass[status],
          )}
        />
      ) : null}
      <span className="sr-only">{label ?? agentSessionStatusLabels[status]}</span>
    </span>
  );
}
AgentSessionStatusIndicator.displayName = "AgentSessionStatusIndicator";

/* ------------------------------------------------------------------ */
/* AgentSessionsListItem                                              */
/* ------------------------------------------------------------------ */

const ITEM_BUTTON_SELECTOR = '[data-slot="agent-sessions-list-item-button"]';

/** Arrow keys, Home and End move between the items of one list. */
function moveFocusBetweenItems(event: KeyboardEvent<HTMLButtonElement>): void {
  const keys: readonly string[] = ["ArrowDown", "ArrowUp", "Home", "End"];
  if (!keys.includes(event.key)) return;
  const list: Element | null = event.currentTarget.closest(
    '[data-slot="agent-sessions-list"]',
  );
  if (list === null) return;
  const buttons: HTMLButtonElement[] = Array.from(
    list.querySelectorAll<HTMLButtonElement>(ITEM_BUTTON_SELECTOR),
  );
  const index: number = buttons.indexOf(event.currentTarget);
  if (index === -1 || buttons.length === 0) return;
  const next: number =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? buttons.length - 1
        : event.key === "ArrowDown"
          ? Math.min(buttons.length - 1, index + 1)
          : Math.max(0, index - 1);
  event.preventDefault();
  buttons[next]?.focus();
}

export interface AgentSessionsListItemProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, "children" | "onSelect" | "title"> {
  session: AgentSession;
  /** Replaces the title. Default: `session.title`. */
  children?: ReactNode;
  /** Replaces the preview line. Default: `session.preview`; `false` hides it. */
  description?: ReactNode | false;
  /**
   * Leading slot. Default: the status dot (an empty, aligned slot when the
   * session is idle). Pass `null` to drop the slot entirely.
   */
  icon?: ReactNode | null;
  /**
   * Trailing timestamp. Default: a live `<RelativeTime>` of
   * `session.updatedAt` ("5m ago"); `false` hides it.
   */
  timestamp?: ReactNode | false;
  /** Props for the default `<RelativeTime>` timestamp. */
  timestampProps?: Partial<RelativeTimeProps>;
  /**
   * Buttons or a menu for the session — rename, pin, delete… On devices
   * with hover they appear over the timestamp on hover and focus; on touch
   * devices they are always shown.
   */
  actions?: ReactNode;
  /**
   * Called on click before the session is resumed; call
   * `event.preventDefault()` to stop it from being resumed.
   */
  onSelect?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Props for the item's main button. */
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;
  ref?: Ref<HTMLLIElement>;
}

/**
 * One session in the list. Clicking it resumes the session. The active
 * session is marked `aria-current` and highlighted.
 */
function AgentSessionsListItem({
  session,
  children,
  description,
  icon,
  timestamp,
  timestampProps,
  actions,
  onSelect,
  buttonProps,
  className,
  ref,
  ...props
}: AgentSessionsListItemProps): ReactElement {
  const ctx = useAgentSessionsContext("AgentSessionsListItem");
  const active: boolean = ctx.activeSessionId === session.id;
  const status: AgentSessionStatusId = session.status ?? "idle";
  const hasActions: boolean = actions !== undefined && actions !== null && actions !== false;

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    onSelect?.(event);
    if (!event.defaultPrevented) ctx.selectSession(session.id);
  };

  const iconNode: ReactNode =
    icon === undefined ? <AgentSessionStatusIndicator status={status} /> : icon;

  const descriptionNode: ReactNode =
    description === false ? null : (description ?? session.preview ?? null);

  const timestampNode: ReactNode =
    timestamp === false
      ? null
      : timestamp !== undefined
        ? timestamp
        : session.updatedAt !== undefined
          ? (
              <RelativeTime
                date={session.updatedAt}
                variant="muted"
                size="sm"
                formatStyle="narrow"
                minUnit="minute"
                nowLabel="now"
                // A focusable <time> cannot sit inside the item's button.
                showTooltip={false}
                {...timestampProps}
              />
            )
          : null;

  return (
    <li
      ref={ref}
      data-slot="agent-sessions-list-item"
      data-active={active ? "true" : "false"}
      data-status={status}
      data-unread={session.unread ? "true" : undefined}
      className={cn(
        "group/session-item relative rounded-md transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-foreground hover:bg-accent/60",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        data-slot="agent-sessions-list-item-button"
        aria-current={active ? "true" : undefined}
        {...buttonProps}
        onClick={handleClick}
        onKeyDown={(event: KeyboardEvent<HTMLButtonElement>): void => {
          buttonProps?.onKeyDown?.(event);
          if (!event.defaultPrevented) moveFocusBetweenItems(event);
        }}
        className={cn(
          "flex w-full min-w-0 items-start gap-2 rounded-md px-2 py-2 text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
          hasActions && "[@media(hover:none)]:pr-10",
          buttonProps?.className,
        )}
      >
        {iconNode !== null ? (
          // Hidden from assistive technology: the status is read out after
          // the title instead (below), so the item's name starts with it.
          <span
            aria-hidden="true"
            data-slot="agent-sessions-list-item-icon"
            className="flex h-5 min-w-3 shrink-0 items-center justify-center [&_svg]:size-4"
          >
            {iconNode}
          </span>
        ) : null}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex min-w-0 items-baseline gap-2">
            <span
              data-slot="agent-sessions-list-item-title"
              className={cn(
                "min-w-0 flex-1 truncate text-sm leading-5",
                session.unread ? "font-semibold" : "font-medium",
              )}
            >
              {children ?? session.title}
            </span>
            {timestampNode !== null ? (
              <span
                data-slot="agent-sessions-list-item-timestamp"
                className={cn(
                  "shrink-0 transition-opacity",
                  hasActions &&
                    "group-has-[[data-state=open]]/session-item:opacity-0 [@media(hover:hover)]:group-focus-within/session-item:opacity-0 [@media(hover:hover)]:group-hover/session-item:opacity-0 [@media(hover:none)]:hidden",
                )}
              >
                {timestampNode}
              </span>
            ) : null}
          </span>
          {descriptionNode !== null ? (
            <span
              data-slot="agent-sessions-list-item-description"
              className="truncate text-xs text-muted-foreground"
            >
              {descriptionNode}
            </span>
          ) : null}
        </span>
        {status !== "idle" ? (
          <span className="sr-only">, {agentSessionStatusLabels[status]}</span>
        ) : null}
      </button>
      {hasActions ? (
        <div
          data-slot="agent-sessions-list-item-actions"
          className="absolute right-1 top-1 flex items-center gap-0.5 transition-opacity has-[[data-state=open]]:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within/session-item:opacity-100 [@media(hover:hover)]:group-hover/session-item:opacity-100"
        >
          {actions}
        </div>
      ) : null}
    </li>
  );
}
AgentSessionsListItem.displayName = "AgentSessionsListItem";

/* ------------------------------------------------------------------ */
/* AgentSessionsListGroup                                             */
/* ------------------------------------------------------------------ */

export interface AgentSessionsListGroupProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, "children"> {
  /** The group's heading, e.g. "Today" or a project name. */
  label: ReactNode;
  /** `<AgentSessionsListItem>`s. */
  children?: ReactNode;
  ref?: Ref<HTMLLIElement>;
}

/** A labelled group of sessions inside `<AgentSessionsList>`. */
function AgentSessionsListGroup({
  label,
  children,
  className,
  ref,
  ...props
}: AgentSessionsListGroupProps): ReactElement {
  const labelId: string = useId();
  return (
    <li
      ref={ref}
      data-slot="agent-sessions-list-group"
      className={cn("flex flex-col", className)}
      {...props}
    >
      <div
        id={labelId}
        data-slot="agent-sessions-list-group-label"
        className="px-2 pb-1 pt-3 text-xs font-medium text-muted-foreground"
      >
        {label}
      </div>
      <ul aria-labelledby={labelId} className="flex flex-col gap-0.5">
        {children}
      </ul>
    </li>
  );
}
AgentSessionsListGroup.displayName = "AgentSessionsListGroup";

/* ------------------------------------------------------------------ */
/* AgentSessionsList                                                  */
/* ------------------------------------------------------------------ */

/**
 * Today's date, refreshed at local midnight (and when a backgrounded tab
 * comes back), so "Today" and "Yesterday" stay right in a tab left open.
 */
function useNowRefreshedDaily(): number {
  const [now, setNow] = useState<number>((): number => Date.now());
  useEffect((): (() => void) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const schedule = (): void => {
      const current: number = Date.now();
      setNow(current);
      // Capped so a sleeping laptop catches up within the hour.
      const delay: number = Math.min(
        startOfNextLocalDay(current) - current + 1000,
        60 * 60 * 1000,
      );
      timeoutId = setTimeout(schedule, delay);
    };
    const onVisibilityChange = (): void => {
      if (document.visibilityState !== "visible") return;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      schedule();
    };
    timeoutId = setTimeout(schedule, startOfNextLocalDay(now) - now + 1000);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return (): void => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
    // Runs once; `schedule` keeps itself going.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return now;
}

export interface AgentSessionsListItemRenderState {
  /** Whether this is the active session. */
  active: boolean;
  /** Resume this session. */
  select: () => void;
}

export interface AgentSessionsListProps<
  TSession extends AgentSession = AgentSession,
> extends Omit<HTMLAttributes<HTMLUListElement>, "children"> {
  /**
   * Hand-written items (`<AgentSessionsListItem>`, `<AgentSessionsListGroup>`).
   * When given, the list renders them as-is instead of `sessions`.
   */
  children?: ReactNode;
  /**
   * Order of the sessions: `recent` (by `updatedAt`, newest first — the
   * default), `none` (as passed in), or your own comparator.
   */
  sort?: "recent" | "none" | ((a: TSession, b: TSession) => number);
  /**
   * Grouping: `recency` (Pinned, Today, Yesterday, Previous 7 days… — the
   * default), `none`, or a function returning each session's group.
   */
  groupBy?: "recency" | "none" | AgentSessionGroupBy<TSession>;
  /** Rename the recency groups (e.g. to translate them). */
  groupLabels?: Partial<Record<AgentSessionRecencyGroupId, string>>;
  /**
   * How the search query filters sessions. Default: every term must appear
   * in the title or preview. `false` turns client-side filtering off (e.g.
   * when you search on the server).
   */
  filter?: AgentSessionMatcher<TSession> | false;
  /** Render each session yourself — return an `<AgentSessionsListItem>`. */
  renderItem?: (
    session: TSession,
    state: AgentSessionsListItemRenderState,
  ) => ReactNode;
  /** Per-session actions for the default items (see `AgentSessionsListItem`). */
  itemActions?: (session: TSession) => ReactNode;
  /** Shown when there are no sessions at all. */
  empty?: ReactNode;
  /** Shown when the search matches nothing. */
  noResults?: ReactNode | ((query: string) => ReactNode);
  /** Class for the empty and no-results messages. */
  emptyClassName?: string;
  ref?: Ref<HTMLUListElement>;
}

/**
 * The sessions from `<AgentSessions>`, filtered by the search query, newest
 * first, grouped by recency and each stamped with a live relative time.
 * Every step can be replaced: `sort`, `groupBy`, `filter`, `renderItem`,
 * `itemActions` — or pass `children` to lay the list out by hand.
 */
function AgentSessionsList<TSession extends AgentSession = AgentSession>({
  children,
  sort = "recent",
  groupBy = "recency",
  groupLabels,
  filter,
  renderItem,
  itemActions,
  empty = "No sessions yet.",
  noResults,
  emptyClassName,
  className,
  "aria-label": ariaLabel = "Sessions",
  ref,
  ...props
}: AgentSessionsListProps<TSession>): ReactElement {
  const ctx = useAgentSessionsContext<TSession>("AgentSessionsList");
  const { sessions, searchQuery, selectSession, activeSessionId } = ctx;
  const now: number = useNowRefreshedDaily();

  const groups: AgentSessionGroup<TSession>[] = useMemo(():
    AgentSessionGroup<TSession>[] => {
    const matcher: AgentSessionMatcher<TSession> =
      filter === false
        ? (): boolean => true
        : (filter ?? matchesAgentSessionQuery);
    const filtered: TSession[] = filterAgentSessions(sessions, searchQuery, matcher);
    const sorted: TSession[] =
      sort === "none"
        ? filtered
        : sort === "recent"
          ? sortAgentSessionsByRecency(filtered)
          : [...filtered].sort(sort);
    if (groupBy === "none") {
      return sorted.length > 0 ? [{ id: "", label: "", sessions: sorted }] : [];
    }
    if (groupBy === "recency") {
      return groupAgentSessionsByRecency(sorted, { now, labels: groupLabels });
    }
    return groupAgentSessions(sorted, groupBy);
  }, [filter, groupBy, groupLabels, now, searchQuery, sessions, sort]);

  const emptyMessageClass: string = cn(
    "px-2 py-6 text-center text-sm text-muted-foreground",
    emptyClassName,
  );

  if (children === undefined) {
    if (sessions.length === 0) {
      return (
        <div data-slot="agent-sessions-list-empty" className={emptyMessageClass}>
          {empty}
        </div>
      );
    }
    if (groups.length === 0) {
      const query: string = searchQuery.trim();
      return (
        <div
          data-slot="agent-sessions-list-no-results"
          role="status"
          className={emptyMessageClass}
        >
          {typeof noResults === "function"
            ? noResults(query)
            : (noResults ?? `No sessions match “${query}”.`)}
        </div>
      );
    }
  }

  const renderSession = (session: TSession): ReactNode => {
    if (renderItem !== undefined) {
      return (
        <Fragment key={session.id}>
          {renderItem(session, {
            active: session.id === activeSessionId,
            select: (): void => selectSession(session.id),
          })}
        </Fragment>
      );
    }
    return (
      <AgentSessionsListItem
        key={session.id}
        session={session}
        actions={itemActions?.(session)}
      />
    );
  };

  return (
    <ul
      ref={ref}
      data-slot="agent-sessions-list"
      aria-label={ariaLabel}
      className={cn(
        "flex flex-col gap-0.5 [&>[data-slot=agent-sessions-list-group]:first-child>[data-slot=agent-sessions-list-group-label]]:pt-1",
        className,
      )}
      {...props}
    >
      {children ??
        groups.map((group: AgentSessionGroup<TSession>): ReactNode =>
          group.id === "" ? (
            <Fragment key="__ungrouped">
              {group.sessions.map(renderSession)}
            </Fragment>
          ) : (
            <AgentSessionsListGroup key={group.id} label={group.label}>
              {group.sessions.map(renderSession)}
            </AgentSessionsListGroup>
          ),
        )}
    </ul>
  );
}
AgentSessionsList.displayName = "AgentSessionsList";

export {
  AgentSessionsList,
  AgentSessionsListGroup,
  AgentSessionsListItem,
  AgentSessionStatusIndicator,
};
