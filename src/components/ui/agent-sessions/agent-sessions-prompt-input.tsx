"use client";

import { useCallback, useEffect, type ReactElement } from "react";

import {
  PromptInput,
  usePromptInput,
  type PromptInputProps,
} from "../prompt-input/prompt-input";
import {
  useAgentSessionDraft,
  useAgentSessionsContext,
} from "./agent-sessions-context";
import type { AgentSession } from "./agent-sessions-model";

export interface AgentSessionsSubmitDetails<
  TSession extends AgentSession = AgentSession,
> {
  /** The session the prompt was sent in, or `null` from the new-session screen. */
  sessionId: string | null;
  /** That session's summary, if it is in `sessions`. */
  session: TSession | undefined;
  /**
   * Switch to a session — e.g. to the one you just created from the
   * new-session screen, when `activeSessionId` is uncontrolled.
   */
  selectSession: (sessionId: string) => void;
}

export interface AgentSessionsPromptInputProps<
  TSession extends AgentSession = AgentSession,
> extends Omit<PromptInputProps, "value" | "defaultValue" | "onSubmit"> {
  /**
   * Fires on Enter or the submit button with the (trimmed) prompt, plus
   * which session it was sent in. From the new-session screen, create the
   * session here and switch to it.
   */
  onSubmit?: (
    value: string,
    details: AgentSessionsSubmitDetails<TSession>,
  ) => void;
  /** Empty the draft once the prompt is submitted. Default: true. */
  clearOnSubmit?: boolean;
}

/** Hands the prompt's textarea to `focusComposer()`. Renders nothing. */
function AgentSessionsComposerRegistration(): null {
  const { textareaRef } = usePromptInput();
  const { composerTextareaRef } = useAgentSessionsContext(
    "AgentSessionsPromptInput",
  );
  useEffect((): (() => void) => {
    composerTextareaRef.current = textareaRef;
    return (): void => {
      if (composerTextareaRef.current === textareaRef) {
        composerTextareaRef.current = null;
      }
    };
  }, [composerTextareaRef, textareaRef]);
  return null;
}

/**
 * `PromptInput`, wired to the session it is shown in: it keeps a separate
 * draft for every session (and for the new-session screen) so switching
 * away and back never loses what was typed, and `onSubmit` says which
 * session the prompt belongs to. Compose it exactly like `PromptInput` —
 * `PromptInputTextarea`, `PromptInputToolbar`, your own actions and
 * inputs, `PromptInputSubmit`.
 */
function AgentSessionsPromptInput<TSession extends AgentSession = AgentSession>({
  onSubmit,
  onValueChange,
  clearOnSubmit = true,
  children,
  ...props
}: AgentSessionsPromptInputProps<TSession>): ReactElement {
  const ctx = useAgentSessionsContext<TSession>("AgentSessionsPromptInput");
  const [value, setValue] = useAgentSessionDraft();
  const { activeSessionId, activeSession, selectSession } = ctx;

  const handleValueChange = useCallback(
    (next: string): void => {
      setValue(next);
      onValueChange?.(next);
    },
    [onValueChange, setValue],
  );

  const handleSubmit = useCallback(
    (submitted: string): void => {
      if (clearOnSubmit) setValue("");
      onSubmit?.(submitted, {
        sessionId: activeSessionId,
        session: activeSession,
        selectSession,
      });
    },
    [activeSession, activeSessionId, clearOnSubmit, onSubmit, selectSession, setValue],
  );

  return (
    <PromptInput
      data-session-id={activeSessionId ?? undefined}
      value={value}
      onValueChange={handleValueChange}
      onSubmit={handleSubmit}
      {...props}
    >
      <AgentSessionsComposerRegistration />
      {children}
    </PromptInput>
  );
}
AgentSessionsPromptInput.displayName = "AgentSessionsPromptInput";

export { AgentSessionsPromptInput };
