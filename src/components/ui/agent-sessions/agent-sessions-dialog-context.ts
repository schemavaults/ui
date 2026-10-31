"use client";

/**
 * Internal: how `<AgentSessionsDialogContent>` and the `<AgentSessions>`
 * inside it talk to each other. Not re-exported from the package index.
 *
 * Radix handles Escape for a dialog on the document, before the keydown
 * reaches anything inside it — so without this, Escape with the overlay
 * sidebar open would close the whole dialog instead of just the sidebar.
 */

import { createContext, useContext } from "react";

export interface AgentSessionsDialogContextValue {
  /**
   * Register a handler the dialog runs on Escape before closing. A handler
   * that returns `true` has used the key, and the dialog stays open.
   */
  registerEscapeHandler: (handler: () => boolean) => () => void;
}

export const AgentSessionsDialogContext =
  createContext<AgentSessionsDialogContextValue | null>(null);

/** The surrounding `<AgentSessionsDialogContent>`, if any. */
export function useAgentSessionsDialogContext(): AgentSessionsDialogContextValue | null {
  return useContext(AgentSessionsDialogContext);
}
