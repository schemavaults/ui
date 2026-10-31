/**
 * React-free helpers behind `<AgentSessions>`: the session summary shape,
 * search, recency sorting and grouping. Kept free of React so they can be
 * unit tested and reused on the server (e.g. to pre-group a session list).
 */

import {
  toTimestamp,
  type RelativeTimeInput,
} from "../relative-time/format-relative-time";
import { startOfLocalDay } from "./local-day";

/* ------------------------------------------------------------------ */
/* Session summary                                                    */
/* ------------------------------------------------------------------ */

export const agentSessionStatusIds = [
  "idle",
  "running",
  "awaiting-input",
  "completed",
  "failed",
] as const satisfies readonly string[];

/**
 * What the agent behind a session is doing. `idle` shows no indicator;
 * every other status shows a coloured dot in the session list.
 */
export type AgentSessionStatusId = (typeof agentSessionStatusIds)[number];

/** Screen-reader labels for each status, read after the session title. */
export const agentSessionStatusLabels: Readonly<
  Record<AgentSessionStatusId, string>
> = {
  idle: "Idle",
  running: "Running",
  "awaiting-input": "Awaiting input",
  completed: "Completed",
  failed: "Failed",
};

/**
 * The summary of one chat session that `<AgentSessions>` lists and switches
 * between. Only the summary lives here — the transcript itself stays with
 * the consumer, who renders it inside `<AgentSessionsConversation>`.
 *
 * Extend it with your own fields (`interface MySession extends AgentSession`)
 * and the list's render props hand your type back.
 */
export interface AgentSession {
  /** Stable, unique id. Also the key the session's draft prompt is kept under. */
  id: string;
  /** Shown in the session list and the header. Search matches against it. */
  title: string;
  /** One-line preview, e.g. the last message. Search matches against it too. */
  preview?: string;
  /**
   * Last activity. Orders the list (most recent first), picks the recency
   * group ("Today", "Yesterday", …) and feeds the `<RelativeTime>` label.
   */
  updatedAt?: RelativeTimeInput;
  /** What the agent is doing right now. Default: `idle`. */
  status?: AgentSessionStatusId;
  /** Pinned sessions sit in their own "Pinned" group at the top. */
  pinned?: boolean;
  /** Unread sessions render their title in bold. */
  unread?: boolean;
}

/** `updatedAt` in epoch ms, or `null` when it is missing or unparseable. */
export function getAgentSessionTimestamp(session: AgentSession): number | null {
  if (session.updatedAt === undefined) return null;
  const ms: number = toTimestamp(session.updatedAt);
  return Number.isFinite(ms) ? ms : null;
}

/* ------------------------------------------------------------------ */
/* Sorting                                                            */
/* ------------------------------------------------------------------ */

/**
 * Most recently updated first. Sessions without a usable `updatedAt` go
 * last; ties keep their input order (the sort is stable).
 */
export function sortAgentSessionsByRecency<T extends AgentSession>(
  sessions: readonly T[],
): T[] {
  return sessions
    .map((session: T, index: number) => ({
      session,
      index,
      time: getAgentSessionTimestamp(session),
    }))
    .sort((a, b): number => {
      if (a.time === b.time) return a.index - b.index;
      if (a.time === null) return 1;
      if (b.time === null) return -1;
      return b.time - a.time;
    })
    .map((entry) => entry.session);
}

/* ------------------------------------------------------------------ */
/* Search                                                             */
/* ------------------------------------------------------------------ */

/**
 * Case-insensitive match of every whitespace-separated term in `query`
 * against the session's title and preview. An empty query matches all.
 */
export function matchesAgentSessionQuery(
  session: AgentSession,
  query: string,
): boolean {
  const terms: string[] = query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter((term: string): boolean => term.length > 0);
  if (terms.length === 0) return true;
  const haystack: string =
    `${session.title}\n${session.preview ?? ""}`.toLocaleLowerCase();
  return terms.every((term: string): boolean => haystack.includes(term));
}

export type AgentSessionMatcher<T extends AgentSession> = (
  session: T,
  query: string,
) => boolean;

/**
 * The sessions `matches` accepts for `query`, in their input order. The
 * matcher runs even for an empty query, so a custom one can also filter on
 * other state (a status or project filter, say).
 */
export function filterAgentSessions<T extends AgentSession>(
  sessions: readonly T[],
  query: string,
  matches: AgentSessionMatcher<T> = matchesAgentSessionQuery,
): T[] {
  return sessions.filter((session: T): boolean => matches(session, query));
}

/* ------------------------------------------------------------------ */
/* Grouping                                                           */
/* ------------------------------------------------------------------ */

export interface AgentSessionGroup<T extends AgentSession = AgentSession> {
  /** Stable id of the group. `""` is the group of ungrouped sessions. */
  id: string;
  /** Heading shown above the group. Empty for the ungrouped group. */
  label: string;
  sessions: T[];
}

export interface AgentSessionGroupKey {
  id: string;
  label: string;
}

/**
 * Picks a session's group: an `{ id, label }`, a string used as both, or
 * `null` / `undefined` for no group.
 */
export type AgentSessionGroupBy<T extends AgentSession> = (
  session: T,
) => AgentSessionGroupKey | string | null | undefined;

const UNGROUPED: AgentSessionGroupKey = { id: "", label: "" };

/**
 * Buckets `sessions` by `getGroup`, keeping each group's sessions in input
 * order. Groups listed in `order` come first, in that order; every other
 * group follows in order of first appearance. Empty groups are dropped.
 */
export function groupAgentSessions<T extends AgentSession>(
  sessions: readonly T[],
  getGroup: AgentSessionGroupBy<T>,
  order: readonly string[] = [],
): AgentSessionGroup<T>[] {
  const groups = new Map<string, AgentSessionGroup<T>>();
  for (const session of sessions) {
    const raw = getGroup(session);
    const key: AgentSessionGroupKey =
      raw === null || raw === undefined
        ? UNGROUPED
        : typeof raw === "string"
          ? { id: raw, label: raw }
          : raw;
    let group: AgentSessionGroup<T> | undefined = groups.get(key.id);
    if (group === undefined) {
      group = { id: key.id, label: key.label, sessions: [] };
      groups.set(key.id, group);
    }
    group.sessions.push(session);
  }

  const ordered: AgentSessionGroup<T>[] = [];
  for (const id of order) {
    const group: AgentSessionGroup<T> | undefined = groups.get(id);
    if (group !== undefined) {
      ordered.push(group);
      groups.delete(id);
    }
  }
  return [...ordered, ...groups.values()];
}

/* ------------------------------------------------------------------ */
/* Recency groups                                                     */
/* ------------------------------------------------------------------ */

export const agentSessionRecencyGroupIds = [
  "pinned",
  "today",
  "yesterday",
  "previous-7-days",
  "previous-30-days",
  "older",
] as const satisfies readonly string[];

export type AgentSessionRecencyGroupId =
  (typeof agentSessionRecencyGroupIds)[number];

export const agentSessionRecencyGroupLabels: Readonly<
  Record<AgentSessionRecencyGroupId, string>
> = {
  pinned: "Pinned",
  today: "Today",
  yesterday: "Yesterday",
  "previous-7-days": "Previous 7 days",
  "previous-30-days": "Previous 30 days",
  older: "Older",
};

const DAY_MS: number = 24 * 60 * 60 * 1000;

/**
 * Which calendar-day bucket a session falls in, in the viewer's local time
 * zone. Pinned sessions are always `pinned`; sessions without a usable
 * `updatedAt` are `older`; future timestamps count as `today`.
 */
export function getAgentSessionRecencyGroup(
  session: AgentSession,
  now: RelativeTimeInput = Date.now(),
): AgentSessionRecencyGroupId {
  if (session.pinned === true) return "pinned";
  const time: number | null = getAgentSessionTimestamp(session);
  if (time === null) return "older";
  const today: number = startOfLocalDay(toTimestamp(now));
  if (time >= today) return "today";
  // Rounding absorbs the 23- and 25-hour days around DST changes.
  const daysAgo: number = Math.round((today - startOfLocalDay(time)) / DAY_MS);
  if (daysAgo <= 1) return "yesterday";
  if (daysAgo <= 7) return "previous-7-days";
  if (daysAgo <= 30) return "previous-30-days";
  return "older";
}

export interface GroupAgentSessionsByRecencyOptions {
  /** Reference time. Default: `Date.now()`. */
  now?: RelativeTimeInput;
  /** Override some or all of the group headings (e.g. to translate them). */
  labels?: Partial<Record<AgentSessionRecencyGroupId, string>>;
}

/**
 * Groups sessions into Pinned / Today / Yesterday / Previous 7 days /
 * Previous 30 days / Older, in that order. Sessions keep their input order
 * within a group — sort them first (see `sortAgentSessionsByRecency`).
 */
export function groupAgentSessionsByRecency<T extends AgentSession>(
  sessions: readonly T[],
  options: GroupAgentSessionsByRecencyOptions = {},
): AgentSessionGroup<T>[] {
  const now: RelativeTimeInput = options.now ?? Date.now();
  const labels: Record<AgentSessionRecencyGroupId, string> = {
    ...agentSessionRecencyGroupLabels,
    ...options.labels,
  };
  return groupAgentSessions(
    sessions,
    (session: T): AgentSessionGroupKey => {
      const id: AgentSessionRecencyGroupId = getAgentSessionRecencyGroup(
        session,
        now,
      );
      return { id, label: labels[id] };
    },
    agentSessionRecencyGroupIds,
  );
}
