"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from "react";

import type { AgentSession } from "./agent-sessions-model";
import type {
  AgentSessionDraftKey,
  AgentSessionsDraftStore,
} from "./agent-sessions-draft-store";

export const agentSessionsSidebarModeIds = [
  "auto",
  "inline",
  "overlay",
] as const satisfies readonly string[];

/**
 * How the session list sits next to the conversation:
 *
 * - `inline` — a column beside it that the toggle collapses and expands.
 * - `overlay` — a drawer that slides over it, behind a scrim.
 * - `auto` — `overlay` while the `<AgentSessions>` element itself is
 *   narrower than `overlayBelowPx`, `inline` otherwise. It measures the
 *   component rather than the viewport, so it also does the right thing
 *   inside a dialog on a wide screen.
 */
export type AgentSessionsSidebarModeId =
  (typeof agentSessionsSidebarModeIds)[number];

export type AgentSessionsResolvedSidebarMode = Exclude<
  AgentSessionsSidebarModeId,
  "auto"
>;

/**
 * `new` while no session is active (the new-session screen shows), and
 * `session` while one is (its conversation shows).
 */
export type AgentSessionsView = "new" | "session";

export interface AgentSessionsContextValue<
  TSession extends AgentSession = AgentSession,
> {
  sessions: readonly TSession[];
  /** The active session's id, or `null` on the new-session screen. */
  activeSessionId: string | null;
  /**
   * The active session's summary. `undefined` on the new-session screen —
   * and also while `activeSessionId` names a session not yet in `sessions`
   * (e.g. one you just created and have not added to the list yet).
   */
  activeSession: TSession | undefined;
  view: AgentSessionsView;
  /** Resume a session. Closes the overlay sidebar (see `closeSidebarOnSelect`). */
  selectSession: (sessionId: string) => void;
  /** Show the new-session screen. Closes the overlay sidebar too. */
  startNewSession: () => void;

  sidebarMode: AgentSessionsResolvedSidebarMode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  /** `id` of the sidebar element, for `aria-controls`. */
  sidebarId: string;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  /** Header title on the new-session screen. */
  newSessionTitle: ReactNode;

  /** Per-session draft prompts. Prefer `useAgentSessionDraft()`. */
  draftStore: AgentSessionsDraftStore;
  /** Focus the prompt of the current view, with the caret at the end. */
  focusComposer: () => void;

  /** @internal The textarea `focusComposer()` focuses. */
  composerTextareaRef: MutableRefObject<RefObject<HTMLTextAreaElement | null> | null>;
  /** @internal `false` until the component's width has been measured. */
  isMeasured: boolean;
}

export const AgentSessionsContext =
  createContext<AgentSessionsContextValue | null>(null);

export function useAgentSessionsContext<
  TSession extends AgentSession = AgentSession,
>(component: string): AgentSessionsContextValue<TSession> {
  const ctx = useContext(AgentSessionsContext);
  if (ctx === null) {
    throw new Error(
      `<${component}> must be rendered inside an <AgentSessions> parent.`,
    );
  }
  return ctx as unknown as AgentSessionsContextValue<TSession>;
}

/**
 * Read and drive the surrounding `<AgentSessions>`: the active session, the
 * sidebar, the search query. Use it to build custom buttons, inputs and
 * menus that act on the sessions. Pass your session type to get it back:
 * `useAgentSessions<MySession>()`.
 */
export function useAgentSessions<
  TSession extends AgentSession = AgentSession,
>(): AgentSessionsContextValue<TSession> {
  return useAgentSessionsContext<TSession>("useAgentSessions");
}

/**
 * The draft prompt kept for a session, as a `[value, setValue]` pair — for
 * wiring your own textarea or input to the per-session drafts that
 * `<AgentSessionsPromptInput>` uses. With no argument it follows the active
 * session (or the new-session screen); pass a session id, or `null` for the
 * new-session screen, to pin one.
 */
export function useAgentSessionDraft(
  key?: AgentSessionDraftKey,
): [string, (value: string) => void] {
  const ctx = useAgentSessionsContext("useAgentSessionDraft");
  const draftKey: AgentSessionDraftKey =
    key === undefined ? ctx.activeSessionId : key;
  const { draftStore } = ctx;

  const getSnapshot = useCallback(
    (): string => draftStore.get(draftKey),
    [draftStore, draftKey],
  );
  const value: string = useSyncExternalStore(
    draftStore.subscribe,
    getSnapshot,
    getSnapshot,
  );
  const setValue = useCallback(
    (next: string): void => draftStore.set(draftKey, next),
    [draftStore, draftKey],
  );
  return [value, setValue];
}
