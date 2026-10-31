"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";

import { cn } from "@/lib/utils";
import { useMeasuredWidth } from "@/components/hooks/use-measured-width";
import {
  AgentSessionsContext,
  type AgentSessionsContextValue,
  type AgentSessionsResolvedSidebarMode,
  type AgentSessionsSidebarModeId,
  type AgentSessionsView,
} from "./agent-sessions-context";
import { useAgentSessionsDialogContext } from "./agent-sessions-dialog-context";
import {
  createAgentSessionsDraftStore,
  type AgentSessionsDraftStore,
} from "./agent-sessions-draft-store";
import type { AgentSession } from "./agent-sessions-model";
import { mergeRefs } from "./merge-refs";

export interface AgentSessionsProps<
  TSession extends AgentSession = AgentSession,
> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Every session the list can switch between. */
  sessions: readonly TSession[];

  /**
   * Controlled active session id; `null` shows the new-session screen. Omit
   * to let the component track it, starting from `defaultActiveSessionId`.
   */
  activeSessionId?: string | null;
  /** Uncontrolled initial session. Default: `null` (the new-session screen). */
  defaultActiveSessionId?: string | null;
  /** Fires when the user resumes a session (its id) or starts a new one (`null`). */
  onActiveSessionIdChange?: (sessionId: string | null) => void;

  /** How the session list sits next to the conversation. Default: `auto`. */
  sidebarMode?: AgentSessionsSidebarModeId;
  /**
   * In `auto` mode, the width (px) of the component below which the
   * sidebar becomes an overlay drawer. Default: 640.
   */
  overlayBelowPx?: number;
  /**
   * Controlled sidebar visibility (in whichever mode is active). Omit to
   * let the component track it: the inline sidebar starts as
   * `defaultSidebarOpen`, the overlay drawer always starts closed.
   */
  sidebarOpen?: boolean;
  /** Whether the inline sidebar starts expanded. Default: true. */
  defaultSidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /** Close the overlay drawer once a session is picked. Default: true. */
  closeSidebarOnSelect?: boolean;
  /** Width of the sidebar (a CSS length, or px). Default: `"18rem"`. */
  sidebarWidth?: string | number;

  /**
   * Controlled search query for `<AgentSessionsSearch>` and the list's
   * filter. Control it to search on the server (and pass `filter={false}`
   * to `<AgentSessionsList>`).
   */
  searchQuery?: string;
  defaultSearchQuery?: string;
  onSearchQueryChange?: (query: string) => void;

  /** `<AgentSessionsTitle>` on the new-session screen. Default: "New session". */
  newSessionTitle?: ReactNode;

  /**
   * Drafts to seed the per-session prompts with, keyed by session id (and
   * `null` for the new-session screen). Read once, on mount.
   */
  initialDrafts?: Iterable<readonly [string | null, string]>;

  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

function toCssLength(value: string | number): string {
  return typeof value === "number" ? `${value}px` : value;
}

/**
 * A multi-session agent chat surface: a list of sessions to resume, the
 * active session's conversation (your `AgentChatMessages` and
 * `PromptInput`), and a separate, roomier screen for starting a new
 * session. Every part is its own component, so you can rearrange them,
 * swap any of them out and drop your own buttons, inputs and menus in
 * between — `useAgentSessions()` gives custom parts the same state and
 * actions the built-in ones use.
 *
 * It fills its parent (`h-full w-full`), so it works as a whole page and,
 * inside `<AgentSessionsDialogContent>`, as a dialog opened from a
 * `FloatingActionButton`.
 */
function AgentSessions<TSession extends AgentSession = AgentSession>({
  sessions,
  activeSessionId: controlledActiveSessionId,
  defaultActiveSessionId = null,
  onActiveSessionIdChange,
  sidebarMode: sidebarModeProp = "auto",
  overlayBelowPx = 640,
  sidebarOpen: controlledSidebarOpen,
  defaultSidebarOpen = true,
  onSidebarOpenChange,
  closeSidebarOnSelect = true,
  sidebarWidth = "18rem",
  searchQuery: controlledSearchQuery,
  defaultSearchQuery = "",
  onSearchQueryChange,
  newSessionTitle = "New session",
  initialDrafts,
  className,
  style,
  children,
  ref,
  ...props
}: AgentSessionsProps<TSession>): ReactElement {
  /* ---------------- layout ---------------- */

  const { ref: measureRef, width, isMeasured } = useMeasuredWidth<HTMLDivElement>();
  const sidebarMode: AgentSessionsResolvedSidebarMode =
    sidebarModeProp === "auto"
      ? isMeasured && width < overlayBelowPx
        ? "overlay"
        : "inline"
      : sidebarModeProp;

  /* ---------------- active session ---------------- */

  const isActiveControlled: boolean = controlledActiveSessionId !== undefined;
  const [internalActiveSessionId, setInternalActiveSessionId] = useState<
    string | null
  >(defaultActiveSessionId);
  const activeSessionId: string | null = isActiveControlled
    ? (controlledActiveSessionId as string | null)
    : internalActiveSessionId;

  const activeSession: TSession | undefined = useMemo(
    (): TSession | undefined =>
      activeSessionId === null
        ? undefined
        : sessions.find((session: TSession): boolean => session.id === activeSessionId),
    [activeSessionId, sessions],
  );
  const view: AgentSessionsView = activeSessionId === null ? "new" : "session";

  /* ---------------- sidebar ---------------- */

  const isSidebarControlled: boolean = controlledSidebarOpen !== undefined;
  const [inlineSidebarOpen, setInlineSidebarOpen] =
    useState<boolean>(defaultSidebarOpen);
  const [overlaySidebarOpen, setOverlaySidebarOpen] = useState<boolean>(false);
  const sidebarOpen: boolean = isSidebarControlled
    ? (controlledSidebarOpen as boolean)
    : sidebarMode === "inline"
      ? inlineSidebarOpen
      : overlaySidebarOpen;

  // The drawer is a transient thing: leaving overlay mode (the component got
  // wider) closes it, so it does not reappear open the next time it narrows.
  useEffect((): void => {
    if (sidebarMode === "inline") setOverlaySidebarOpen(false);
  }, [sidebarMode]);

  const setSidebarOpen = useCallback(
    (open: boolean): void => {
      if (!isSidebarControlled) {
        if (sidebarMode === "inline") {
          setInlineSidebarOpen(open);
        } else {
          setOverlaySidebarOpen(open);
        }
      }
      onSidebarOpenChange?.(open);
    },
    [isSidebarControlled, onSidebarOpenChange, sidebarMode],
  );

  const toggleSidebar = useCallback(
    (): void => setSidebarOpen(!sidebarOpen),
    [setSidebarOpen, sidebarOpen],
  );

  const sidebarId: string = `${useId()}-agent-sessions-sidebar`;

  const setActiveSessionId = useCallback(
    (next: string | null): void => {
      if (sidebarMode === "overlay" && closeSidebarOnSelect && sidebarOpen) {
        setSidebarOpen(false);
      }
      if (next === activeSessionId) return;
      if (!isActiveControlled) setInternalActiveSessionId(next);
      onActiveSessionIdChange?.(next);
    },
    [
      activeSessionId,
      closeSidebarOnSelect,
      isActiveControlled,
      onActiveSessionIdChange,
      setSidebarOpen,
      sidebarMode,
      sidebarOpen,
    ],
  );

  const selectSession = useCallback(
    (sessionId: string): void => setActiveSessionId(sessionId),
    [setActiveSessionId],
  );
  const startNewSession = useCallback(
    (): void => setActiveSessionId(null),
    [setActiveSessionId],
  );

  /* ---------------- search ---------------- */

  const isSearchControlled: boolean = controlledSearchQuery !== undefined;
  const [internalSearchQuery, setInternalSearchQuery] =
    useState<string>(defaultSearchQuery);
  const searchQuery: string = isSearchControlled
    ? (controlledSearchQuery as string)
    : internalSearchQuery;
  const setSearchQuery = useCallback(
    (query: string): void => {
      if (!isSearchControlled) setInternalSearchQuery(query);
      onSearchQueryChange?.(query);
    },
    [isSearchControlled, onSearchQueryChange],
  );

  /* ---------------- drafts & composer ---------------- */

  const [draftStore] = useState<AgentSessionsDraftStore>(
    (): AgentSessionsDraftStore => createAgentSessionsDraftStore(initialDrafts),
  );
  const composerTextareaRef = useRef<RefObject<HTMLTextAreaElement | null> | null>(
    null,
  );
  const focusComposer = useCallback((): void => {
    // Wait a frame so a draft that was just set has rendered into the
    // textarea before the caret is moved to its end.
    requestAnimationFrame((): void => {
      const textarea: HTMLTextAreaElement | null | undefined =
        composerTextareaRef.current?.current;
      if (!textarea) return;
      textarea.focus();
      const end: number = textarea.value.length;
      textarea.setSelectionRange(end, end);
    });
  }, []);

  /* ---------------- Escape closes the drawer ---------------- */

  const closeOverlaySidebar = useCallback((): boolean => {
    if (sidebarMode !== "overlay" || !sidebarOpen) return false;
    setSidebarOpen(false);
    return true;
  }, [setSidebarOpen, sidebarMode, sidebarOpen]);
  const closeOverlaySidebarRef = useRef(closeOverlaySidebar);
  useEffect((): void => {
    closeOverlaySidebarRef.current = closeOverlaySidebar;
  }, [closeOverlaySidebar]);

  // Inside <AgentSessionsDialogContent>, the dialog asks first: Radix acts
  // on Escape before the keydown reaches this element.
  const dialog = useAgentSessionsDialogContext();
  useEffect((): (() => void) | undefined => {
    if (dialog === null) return undefined;
    return dialog.registerEscapeHandler(
      (): boolean => closeOverlaySidebarRef.current(),
    );
  }, [dialog]);

  // A native listener, not `onKeyDown`: React events bubble out of portals,
  // so Escape in a menu portalled out of the sidebar would otherwise close
  // the drawer along with the menu.
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect((): (() => void) | undefined => {
    const root: HTMLDivElement | null = rootRef.current;
    if (root === null) return undefined;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (closeOverlaySidebarRef.current()) event.preventDefault();
    };
    root.addEventListener("keydown", onKeyDown);
    return (): void => root.removeEventListener("keydown", onKeyDown);
  }, []);

  const mergedRef = useMemo(
    () => mergeRefs<HTMLDivElement>(rootRef, measureRef, ref),
    [measureRef, ref],
  );

  /* ---------------- context ---------------- */

  const contextValue = useMemo<AgentSessionsContextValue<TSession>>(
    () => ({
      sessions,
      activeSessionId,
      activeSession,
      view,
      selectSession,
      startNewSession,
      sidebarMode,
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      sidebarId,
      searchQuery,
      setSearchQuery,
      newSessionTitle,
      draftStore,
      focusComposer,
      composerTextareaRef,
      isMeasured,
    }),
    [
      sessions,
      activeSessionId,
      activeSession,
      view,
      selectSession,
      startNewSession,
      sidebarMode,
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      sidebarId,
      searchQuery,
      setSearchQuery,
      newSessionTitle,
      draftStore,
      focusComposer,
      isMeasured,
    ],
  );

  return (
    <AgentSessionsContext.Provider
      value={contextValue as unknown as AgentSessionsContextValue}
    >
      <div
        ref={mergedRef}
        data-slot="agent-sessions"
        data-view={view}
        data-sidebar-mode={sidebarMode}
        data-sidebar-open={sidebarOpen ? "true" : "false"}
        className={cn(
          "relative flex h-full min-h-0 w-full min-w-0 overflow-hidden bg-background text-foreground",
          className,
        )}
        style={
          {
            "--agent-sessions-sidebar-width": toCssLength(sidebarWidth),
            ...style,
          } as CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </AgentSessionsContext.Provider>
  );
}
AgentSessions.displayName = "AgentSessions";

export { AgentSessions };
