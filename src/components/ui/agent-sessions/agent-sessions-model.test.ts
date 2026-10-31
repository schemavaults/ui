/// <reference types="bun-types" />
import { describe, expect, mock, test } from "bun:test";

import {
  filterAgentSessions,
  getAgentSessionRecencyGroup,
  getAgentSessionTimestamp,
  groupAgentSessions,
  groupAgentSessionsByRecency,
  matchesAgentSessionQuery,
  sortAgentSessionsByRecency,
  type AgentSession,
} from "./agent-sessions-model";
import { startOfLocalDay, startOfNextLocalDay } from "./local-day";
import { createAgentSessionsDraftStore } from "./agent-sessions-draft-store";

/** Local-time constructor, so the calendar-day tests hold in any time zone. */
function local(
  month: number,
  day: number,
  hours: number = 12,
  minutes: number = 0,
): Date {
  return new Date(2026, month - 1, day, hours, minutes);
}

const NOW: Date = local(10, 31, 15, 30);

function session(
  id: string,
  overrides: Partial<AgentSession> = {},
): AgentSession {
  return { id, title: `Session ${id}`, ...overrides };
}

describe("getAgentSessionTimestamp", () => {
  test("accepts a Date, an ISO string or epoch ms", () => {
    const ms: number = NOW.getTime();
    expect(getAgentSessionTimestamp(session("a", { updatedAt: NOW }))).toBe(ms);
    expect(
      getAgentSessionTimestamp(session("a", { updatedAt: NOW.toISOString() })),
    ).toBe(ms);
    expect(getAgentSessionTimestamp(session("a", { updatedAt: ms }))).toBe(ms);
  });

  test("is null when missing or unparseable", () => {
    expect(getAgentSessionTimestamp(session("a"))).toBeNull();
    expect(
      getAgentSessionTimestamp(session("a", { updatedAt: "not a date" })),
    ).toBeNull();
  });
});

describe("sortAgentSessionsByRecency", () => {
  test("puts the most recent first and undated sessions last", () => {
    const sorted = sortAgentSessionsByRecency([
      session("old", { updatedAt: local(10, 1) }),
      session("undated"),
      session("new", { updatedAt: local(10, 31) }),
      session("mid", { updatedAt: local(10, 15) }),
    ]);
    expect(sorted.map((s) => s.id)).toEqual(["new", "mid", "old", "undated"]);
  });

  test("keeps the input order for ties and does not mutate the input", () => {
    const input = [
      session("b", { updatedAt: NOW }),
      session("x"),
      session("a", { updatedAt: NOW }),
      session("y"),
    ];
    const snapshot = input.map((s) => s.id);
    expect(sortAgentSessionsByRecency(input).map((s) => s.id)).toEqual([
      "b",
      "a",
      "x",
      "y",
    ]);
    expect(input.map((s) => s.id)).toEqual(snapshot);
  });
});

describe("matchesAgentSessionQuery / filterAgentSessions", () => {
  const sessions = [
    session("1", { title: "Fix login redirect", preview: "OAuth callback" }),
    session("2", { title: "Write release notes", preview: "v0.119.0" }),
    session("3", { title: "Migrate users table" }),
  ];

  test("matches every term, case-insensitively, in title or preview", () => {
    expect(matchesAgentSessionQuery(sessions[0], "LOGIN")).toBe(true);
    expect(matchesAgentSessionQuery(sessions[0], "oauth fix")).toBe(true);
    expect(matchesAgentSessionQuery(sessions[0], "fix notes")).toBe(false);
  });

  test("an empty or blank query matches everything", () => {
    expect(matchesAgentSessionQuery(sessions[2], "")).toBe(true);
    expect(filterAgentSessions(sessions, "   ")).toEqual(sessions);
  });

  test("filters in input order, with an optional custom matcher", () => {
    expect(filterAgentSessions(sessions, "e").map((s) => s.id)).toEqual([
      "1",
      "2",
      "3",
    ]);
    expect(filterAgentSessions(sessions, "0.119").map((s) => s.id)).toEqual([
      "2",
    ]);
    expect(
      filterAgentSessions(sessions, "3", (s, q) => s.id === q).map((s) => s.id),
    ).toEqual(["3"]);
  });

  test("runs a custom matcher even when the query is empty", () => {
    expect(
      filterAgentSessions(sessions, "", (s) => s.id !== "2").map((s) => s.id),
    ).toEqual(["1", "3"]);
  });
});

describe("groupAgentSessions", () => {
  const sessions = [
    session("a", { title: "api" }),
    session("b", { title: "web" }),
    session("c", { title: "api" }),
    session("d", { title: "none" }),
  ];

  test("buckets in order of first appearance and accepts string keys", () => {
    const groups = groupAgentSessions(sessions, (s) =>
      s.title === "none" ? null : s.title,
    );
    expect(groups.map((g) => [g.id, g.label, g.sessions.map((s) => s.id)]))
      .toEqual([
        ["api", "api", ["a", "c"]],
        ["web", "web", ["b"]],
        ["", "", ["d"]],
      ]);
  });

  test("puts the listed group ids first, skipping ones with no sessions", () => {
    const groups = groupAgentSessions(
      sessions,
      (s) => ({ id: s.title, label: s.title.toUpperCase() }),
      ["missing", "web", "none"],
    );
    expect(groups.map((g) => g.id)).toEqual(["web", "none", "api"]);
    expect(groups[0].label).toBe("WEB");
  });
});

describe("startOfLocalDay / startOfNextLocalDay", () => {
  test("bracket the local calendar day", () => {
    expect(startOfLocalDay(NOW.getTime())).toBe(local(10, 31, 0).getTime());
    expect(startOfNextLocalDay(NOW.getTime())).toBe(local(11, 1, 0).getTime());
  });
});

describe("getAgentSessionRecencyGroup", () => {
  const group = (overrides: Partial<AgentSession>): string =>
    getAgentSessionRecencyGroup(session("s", overrides), NOW);

  test("uses local calendar days, not 24-hour windows", () => {
    expect(group({ updatedAt: local(10, 31, 0, 1) })).toBe("today");
    expect(group({ updatedAt: local(10, 30, 23, 59) })).toBe("yesterday");
    expect(group({ updatedAt: local(10, 30, 0, 0) })).toBe("yesterday");
    expect(group({ updatedAt: local(10, 29, 23, 59) })).toBe("previous-7-days");
    expect(group({ updatedAt: local(10, 24) })).toBe("previous-7-days");
    expect(group({ updatedAt: local(10, 23) })).toBe("previous-30-days");
    expect(group({ updatedAt: local(10, 1) })).toBe("previous-30-days");
    expect(group({ updatedAt: local(9, 30) })).toBe("older");
  });

  test("pinned wins, future is today, undated is older", () => {
    expect(group({ updatedAt: local(1, 1), pinned: true })).toBe("pinned");
    expect(group({ updatedAt: local(11, 5) })).toBe("today");
    expect(group({})).toBe("older");
  });
});

describe("groupAgentSessionsByRecency", () => {
  test("orders the groups from pinned to older and relabels them", () => {
    const groups = groupAgentSessionsByRecency(
      [
        session("old", { updatedAt: local(1, 1) }),
        session("today", { updatedAt: local(10, 31, 9) }),
        session("pinned", { updatedAt: local(2, 2), pinned: true }),
        session("yesterday", { updatedAt: local(10, 30) }),
      ],
      { now: NOW, labels: { today: "Aujourd’hui" } },
    );
    expect(groups.map((g) => [g.id, g.label])).toEqual([
      ["pinned", "Pinned"],
      ["today", "Aujourd’hui"],
      ["yesterday", "Yesterday"],
      ["older", "Older"],
    ]);
  });
});

describe("createAgentSessionsDraftStore", () => {
  test("keeps a draft per session id, plus one for the new-session screen", () => {
    const store = createAgentSessionsDraftStore([["a", "hello"]]);
    store.set(null, "new idea");
    store.set("b", "reply");
    expect(store.get("a")).toBe("hello");
    expect(store.get("b")).toBe("reply");
    expect(store.get(null)).toBe("new idea");
    expect(store.get("missing")).toBe("");
  });

  test("notifies subscribers only when a draft actually changes", () => {
    const store = createAgentSessionsDraftStore();
    const listener = mock((): void => {});
    const unsubscribe = store.subscribe(listener);
    store.set("a", "x");
    store.set("a", "x");
    store.set("a", "");
    store.set("a", "");
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    store.set("a", "y");
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
