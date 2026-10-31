/**
 * The per-session draft prompts `<AgentSessions>` keeps while the user
 * switches between sessions. React-free: `<AgentSessionsPromptInput>` and
 * `useAgentSessionDraft()` read it through `useSyncExternalStore`, so typing
 * re-renders only the prompt, never the transcript or the session list.
 */

/**
 * Which draft to read or write: a session id, or `null` for the prompt on
 * the new-session screen.
 */
export type AgentSessionDraftKey = string | null;

export interface AgentSessionsDraftStore {
  /** The draft kept under `key`, or `""`. */
  get(key: AgentSessionDraftKey): string;
  /** Replace the draft under `key`. An empty string removes it. */
  set(key: AgentSessionDraftKey, value: string): void;
  /** Called after any draft changes. Returns the unsubscribe function. */
  subscribe(listener: () => void): () => void;
}

export function createAgentSessionsDraftStore(
  initial?: Iterable<readonly [AgentSessionDraftKey, string]>,
): AgentSessionsDraftStore {
  const drafts = new Map<AgentSessionDraftKey, string>();
  for (const [key, value] of initial ?? []) {
    if (value.length > 0) drafts.set(key, value);
  }
  const listeners = new Set<() => void>();

  return {
    get(key: AgentSessionDraftKey): string {
      return drafts.get(key) ?? "";
    },
    set(key: AgentSessionDraftKey, value: string): void {
      if ((drafts.get(key) ?? "") === value) return;
      if (value.length === 0) {
        drafts.delete(key);
      } else {
        drafts.set(key, value);
      }
      for (const listener of [...listeners]) listener();
    },
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return (): void => {
        listeners.delete(listener);
      };
    },
  };
}
