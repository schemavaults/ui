import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Archive,
  ArrowRight,
  Bug,
  FileText,
  FolderGit2,
  MailOpen,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Pin,
  PinOff,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  AgentSessions,
  AgentSessionsComposer,
  AgentSessionsConversation,
  AgentSessionsDialog,
  AgentSessionsDialogContent,
  AgentSessionsDialogTrigger,
  AgentSessionsHeader,
  AgentSessionsHeaderActions,
  AgentSessionsList,
  AgentSessionsListItem,
  AgentSessionsMain,
  AgentSessionsNewSessionButton,
  AgentSessionsPromptInput,
  AgentSessionsSearch,
  AgentSessionsSidebar,
  AgentSessionsSidebarContent,
  AgentSessionsSidebarFooter,
  AgentSessionsSidebarHeader,
  AgentSessionsSidebarToggle,
  AgentSessionsStart,
  AgentSessionsStartHeader,
  AgentSessionsSuggestion,
  AgentSessionsSuggestions,
  AgentSessionsTitle,
  agentSessionsDialogPlacementIds,
  agentSessionsSidebarModeIds,
  matchesAgentSessionQuery,
  useAgentSessionDraft,
  useAgentSessions,
  type AgentSession,
  type AgentSessionStatusId,
  type AgentSessionsDialogPlacementId,
  type AgentSessionsSidebarModeId,
} from ".";
import {
  AgentChatBubble,
  AgentChatMessages,
  AgentTypingIndicator,
} from "../agent-chat-messages";
import {
  PromptInputAction,
  PromptInputActions,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "../prompt-input";
import { Avatar, AvatarFallback } from "../avatar/avatar";
import { Badge } from "../badge/badge";
import { Button } from "../button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";
import { FloatingActionButton } from "../floating-action-button/floating-action-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select/select";
import { Switch } from "../switch/switch";

/* ------------------------------------------------------------------ */
/* Demo data: sessions, transcripts and a fake agent                  */
/* ------------------------------------------------------------------ */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

interface DemoMessage {
  id: string;
  from: "user" | "assistant";
  text: string;
}

/** Sessions can carry any extra fields; the list hands them back typed. */
interface DemoSession extends AgentSession {
  project: "api" | "web" | "ui";
  model?: string;
}

interface DemoState {
  sessions: DemoSession[];
  messages: Record<string, DemoMessage[]>;
  pending: Record<string, true>;
}

const MODELS: readonly { id: string; label: string }[] = [
  { id: "fable", label: "Fable 5.1" },
  { id: "opus", label: "Opus 5.5" },
  { id: "sonnet", label: "Sonnet 5.5" },
  { id: "haiku", label: "Haiku 5.5" },
];

function seedDemoState(now: number): DemoState {
  const sessions: DemoSession[] = [
    {
      id: "migrate-users",
      title: "Migrate users to org_id",
      preview: "Running the backfill in batches of 1,000 rows…",
      updatedAt: now - 2 * MINUTE,
      status: "running",
      project: "api",
      model: "Opus 5.5",
    },
    {
      id: "release-notes",
      title: "Draft the v0.119.0 release notes",
      preview: "Can I write CHANGELOG.md?",
      updatedAt: now - 38 * MINUTE,
      status: "awaiting-input",
      unread: true,
      project: "ui",
      model: "Sonnet 5.5",
    },
    {
      id: "login-redirect",
      title: "Fix login redirect loop",
      preview: "The OAuth callback now keeps the return URL.",
      updatedAt: now - 3 * HOUR,
      status: "completed",
      project: "web",
      model: "Opus 5.5",
    },
    {
      id: "flaky-upload",
      title: "Investigate the flaky upload test",
      preview: "Timed out waiting for the presigned URL.",
      updatedAt: now - 30 * HOUR,
      status: "failed",
      project: "api",
    },
    {
      id: "dark-mode",
      title: "Audit dark-mode contrast",
      preview: "Six tokens fall below 4.5:1.",
      updatedAt: now - 3 * DAY,
      project: "ui",
    },
    {
      id: "rate-limits",
      title: "Add rate limits to /api/send",
      updatedAt: now - 12 * DAY,
      project: "api",
    },
    {
      id: "style-guide",
      title: "Team writing style guide",
      preview: "Pinned for reference.",
      updatedAt: now - 20 * DAY,
      pinned: true,
      project: "ui",
    },
    {
      id: "onboarding",
      title: "Rewrite the onboarding checklist",
      preview: "Every step is one line now.",
      updatedAt: now - 45 * DAY,
      project: "web",
    },
  ];

  const transcript = (id: string, lines: readonly string[]): DemoMessage[] =>
    lines.map(
      (text: string, index: number): DemoMessage => ({
        id: `${id}-${index}`,
        from: index % 2 === 0 ? "user" : "assistant",
        text,
      }),
    );

  const messages: Record<string, DemoMessage[]> = {
    "migrate-users": transcript("migrate-users", [
      "Add an org_id column to users and backfill it from memberships.",
      "On it. I've written the migration; the backfill runs in batches of 1,000 rows so the table is only locked briefly.",
      "Great — go ahead and run it against staging.",
    ]),
    "release-notes": transcript("release-notes", [
      "Draft the release notes for v0.119.0 from the merged PRs.",
      "Here's a draft grouped by component. Can I write it to CHANGELOG.md?",
    ]),
    "login-redirect": transcript("login-redirect", [
      "Users get stuck in a redirect loop after signing in with Google.",
      "The OAuth callback dropped the `returnTo` parameter, so the app sent everyone back to /login. I've kept it through the callback and added a test.",
      "Perfect, thanks!",
      "You're welcome — the fix is in PR #212.",
    ]),
  };
  for (const session of sessions) {
    messages[session.id] ??= transcript(session.id, [
      `Let's pick up "${session.title}".`,
      session.preview ?? "Sure — where were we?",
    ]);
  }
  return { sessions, messages, pending: {} };
}

function withoutPending(
  pending: DemoState["pending"],
  sessionId: string,
): DemoState["pending"] {
  const next: DemoState["pending"] = { ...pending };
  delete next[sessionId];
  return next;
}

/** A short title from the first words of a prompt. */
function titleFromPrompt(prompt: string): string {
  const words: string[] = prompt.trim().split(/\s+/);
  const title: string = words.slice(0, 6).join(" ");
  return words.length > 6 ? `${title}…` : title;
}

interface DemoApi {
  sessions: DemoSession[];
  messagesFor: (sessionId: string) => DemoMessage[];
  isPending: (sessionId: string) => boolean;
  send: (sessionId: string, text: string) => void;
  create: (prompt: string, model?: string) => string;
  stop: (sessionId: string) => void;
  togglePinned: (sessionId: string) => void;
  toggleUnread: (sessionId: string) => void;
  markRead: (sessionId: string | null) => void;
  remove: (sessionId: string) => void;
}

/** In-memory sessions and an agent that answers after `replyDelayMs`. */
function useDemoSessions(replyDelayMs: number = 900): DemoApi {
  const [state, setState] = useState<DemoState>(
    (): DemoState => seedDemoState(Date.now()),
  );
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const counter = useRef<number>(0);

  useEffect((): (() => void) => {
    const pendingTimers = timers.current;
    return (): void => {
      for (const timer of pendingTimers.values()) clearTimeout(timer);
      pendingTimers.clear();
    };
  }, []);

  const updateSession = useCallback(
    (sessionId: string, patch: Partial<DemoSession>): void => {
      setState(
        (prev: DemoState): DemoState => ({
          ...prev,
          sessions: prev.sessions.map(
            (s: DemoSession): DemoSession =>
              s.id === sessionId ? { ...s, ...patch } : s,
          ),
        }),
      );
    },
    [],
  );

  const scheduleReply = useCallback(
    (sessionId: string, prompt: string): void => {
      const timer = setTimeout((): void => {
        timers.current.delete(sessionId);
        const reply: string = `Got it — "${titleFromPrompt(prompt)}". I've looked through the code and drafted a plan; want me to go ahead?`;
        setState((prev: DemoState): DemoState => {
          return {
            pending: withoutPending(prev.pending, sessionId),
            messages: {
              ...prev.messages,
              [sessionId]: [
                ...(prev.messages[sessionId] ?? []),
                { id: `reply-${++counter.current}`, from: "assistant", text: reply },
              ],
            },
            sessions: prev.sessions.map(
              (s: DemoSession): DemoSession =>
                s.id === sessionId
                  ? { ...s, status: "completed", preview: reply, updatedAt: Date.now() }
                  : s,
            ),
          };
        });
      }, replyDelayMs);
      timers.current.set(sessionId, timer);
    },
    [replyDelayMs],
  );

  const send = useCallback(
    (sessionId: string, text: string): void => {
      setState(
        (prev: DemoState): DemoState => ({
          pending: { ...prev.pending, [sessionId]: true },
          messages: {
            ...prev.messages,
            [sessionId]: [
              ...(prev.messages[sessionId] ?? []),
              { id: `user-${++counter.current}`, from: "user", text },
            ],
          },
          sessions: prev.sessions.map(
            (s: DemoSession): DemoSession =>
              s.id === sessionId
                ? { ...s, status: "running", preview: text, updatedAt: Date.now() }
                : s,
          ),
        }),
      );
      scheduleReply(sessionId, text);
    },
    [scheduleReply],
  );

  const create = useCallback(
    (prompt: string, model?: string): string => {
      const sessionId: string = `session-${++counter.current}`;
      setState(
        (prev: DemoState): DemoState => ({
          pending: { ...prev.pending, [sessionId]: true },
          messages: {
            ...prev.messages,
            [sessionId]: [{ id: `${sessionId}-0`, from: "user", text: prompt }],
          },
          sessions: [
            {
              id: sessionId,
              title: titleFromPrompt(prompt),
              preview: prompt,
              updatedAt: Date.now(),
              status: "running",
              project: "ui",
              model,
            },
            ...prev.sessions,
          ],
        }),
      );
      scheduleReply(sessionId, prompt);
      return sessionId;
    },
    [scheduleReply],
  );

  const stop = useCallback(
    (sessionId: string): void => {
      const timer = timers.current.get(sessionId);
      if (timer !== undefined) clearTimeout(timer);
      timers.current.delete(sessionId);
      setState(
        (prev: DemoState): DemoState => ({
          ...prev,
          pending: withoutPending(prev.pending, sessionId),
        }),
      );
      updateSession(sessionId, { status: "idle" });
    },
    [updateSession],
  );

  return useMemo(
    (): DemoApi => ({
      sessions: state.sessions,
      messagesFor: (sessionId: string): DemoMessage[] =>
        state.messages[sessionId] ?? [],
      isPending: (sessionId: string): boolean => state.pending[sessionId] === true,
      send,
      create,
      stop,
      togglePinned: (sessionId: string): void => {
        const session = state.sessions.find((s) => s.id === sessionId);
        updateSession(sessionId, { pinned: !session?.pinned });
      },
      toggleUnread: (sessionId: string): void => {
        const session = state.sessions.find((s) => s.id === sessionId);
        updateSession(sessionId, { unread: !session?.unread });
      },
      markRead: (sessionId: string | null): void => {
        if (sessionId !== null) updateSession(sessionId, { unread: false });
      },
      remove: (sessionId: string): void => {
        setState(
          (prev: DemoState): DemoState => ({
            ...prev,
            sessions: prev.sessions.filter((s) => s.id !== sessionId),
          }),
        );
      },
    }),
    [create, send, state, stop, updateSession],
  );
}

/* ------------------------------------------------------------------ */
/* Demo building blocks — each one a plain composition of the parts   */
/* ------------------------------------------------------------------ */

/** Per-session menu, built from the library's DropdownMenu. */
function DemoItemActions({
  session,
  demo,
}: {
  session: DemoSession;
  demo: DemoApi;
}): ReactElement {
  const { activeSessionId, startNewSession } = useAgentSessions<DemoSession>();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          aria-label={`Actions for ${session.title}`}
        >
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="gap-2"
          onSelect={(): void => demo.togglePinned(session.id)}
        >
          {session.pinned ? (
            <PinOff aria-hidden="true" className="size-4" />
          ) : (
            <Pin aria-hidden="true" className="size-4" />
          )}
          {session.pinned ? "Unpin" : "Pin"}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2"
          onSelect={(): void => demo.toggleUnread(session.id)}
        >
          <MailOpen aria-hidden="true" className="size-4" />
          Mark as {session.unread ? "read" : "unread"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onSelect={(): void => {
            if (activeSessionId === session.id) startNewSession();
            demo.remove(session.id);
          }}
        >
          <Trash2 aria-hidden="true" className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DemoSidebar({ demo }: { demo: DemoApi }): ReactElement {
  return (
    <AgentSessionsSidebar>
      <AgentSessionsSidebarHeader>
        <AgentSessionsNewSessionButton />
        <AgentSessionsSearch />
      </AgentSessionsSidebarHeader>
      <AgentSessionsSidebarContent>
        <AgentSessionsList<DemoSession>
          itemActions={(session: DemoSession): ReactNode => (
            <DemoItemActions session={session} demo={demo} />
          )}
        />
      </AgentSessionsSidebarContent>
      <AgentSessionsSidebarFooter>
        <div className="flex items-center gap-2 px-1">
          <Avatar size="sm">
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            Ada Lovelace
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Settings"
          >
            <Settings aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </AgentSessionsSidebarFooter>
    </AgentSessionsSidebar>
  );
}

function DemoHeader(): ReactElement {
  const { activeSession, view } = useAgentSessions<DemoSession>();
  return (
    <AgentSessionsHeader>
      <AgentSessionsSidebarToggle />
      <AgentSessionsTitle />
      <AgentSessionsHeaderActions>
        {activeSession?.model ? (
          <Badge variant="secondary" className="max-sm:hidden">
            {activeSession.model}
          </Badge>
        ) : null}
        {view === "session" ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Share session"
          >
            <Share2 aria-hidden="true" className="size-4" />
          </Button>
        ) : null}
        <AgentSessionsNewSessionButton
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Start a new session"
        />
      </AgentSessionsHeaderActions>
    </AgentSessionsHeader>
  );
}

function DemoConversation({ demo }: { demo: DemoApi }): ReactElement {
  return (
    <AgentSessionsConversation<DemoSession>>
      {({ sessionId, session }): ReactNode => {
        const pending: boolean = demo.isPending(sessionId);
        return (
          <>
            <AgentChatMessages
              stackClassName="mx-auto w-full max-w-3xl"
              aria-label={`${session?.title ?? "Session"} transcript`}
            >
              {demo.messagesFor(sessionId).map(
                (message: DemoMessage): ReactElement => (
                  <AgentChatBubble key={message.id} from={message.from}>
                    {message.text}
                  </AgentChatBubble>
                ),
              )}
              {pending ? <AgentTypingIndicator key="typing" /> : null}
            </AgentChatMessages>
            <AgentSessionsComposer>
              <AgentSessionsPromptInput<DemoSession>
                variant="elevated"
                isLoading={pending}
                onStop={(): void => demo.stop(sessionId)}
                onSubmit={(value: string): void => demo.send(sessionId, value)}
              >
                <PromptInputTextarea placeholder="Reply…" aria-label="Message" />
                <PromptInputToolbar>
                  <PromptInputActions>
                    <PromptInputAction aria-label="Attach file">
                      <Paperclip aria-hidden="true" className="h-4 w-4" />
                    </PromptInputAction>
                  </PromptInputActions>
                  <PromptInputSubmit />
                </PromptInputToolbar>
              </AgentSessionsPromptInput>
            </AgentSessionsComposer>
          </>
        );
      }}
    </AgentSessionsConversation>
  );
}

/**
 * The new-session screen: a bigger prompt with its own inputs (model,
 * plan mode) and starter suggestions.
 */
function DemoStart({ demo }: { demo: DemoApi }): ReactElement {
  const [model, setModel] = useState<string>("opus");
  const [planMode, setPlanMode] = useState<boolean>(false);
  const planModeId: string = useId();
  const modelLabel: string =
    MODELS.find((m) => m.id === model)?.label ?? model;

  return (
    <AgentSessionsStart>
      <AgentSessionsStartHeader
        icon={<Sparkles />}
        title="What should we work on?"
        description="Describe a task, paste an error or ask a question. The agent picks it up in a new session you can come back to any time."
      />
      <AgentSessionsPromptInput<DemoSession>
        size="lg"
        variant="elevated"
        onSubmit={(value, { selectSession }): void => {
          selectSession(demo.create(value, modelLabel));
        }}
      >
        <PromptInputTextarea
          rows={4}
          resizable
          maxHeightPx={320}
          placeholder="Describe a task…"
          aria-label="New session prompt"
        />
        <PromptInputToolbar>
          <PromptInputActions className="min-w-0 flex-wrap">
            <PromptInputAction aria-label="Attach file">
              <Paperclip aria-hidden="true" className="h-4 w-4" />
            </PromptInputAction>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger
                size="sm"
                aria-label="Model"
                className="border-0 bg-transparent shadow-none hover:bg-accent dark:bg-transparent"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 px-2">
              <Switch
                id={planModeId}
                checked={planMode}
                onCheckedChange={setPlanMode}
              />
              <label
                htmlFor={planModeId}
                className="text-xs text-muted-foreground"
              >
                Plan first
              </label>
            </div>
          </PromptInputActions>
          <PromptInputSubmit sendLabel="Start session">
            Start
            <ArrowRight aria-hidden="true" className="ml-1 h-4 w-4" />
          </PromptInputSubmit>
        </PromptInputToolbar>
      </AgentSessionsPromptInput>
      <AgentSessionsSuggestions>
        <AgentSessionsSuggestion
          icon={<Bug />}
          description="Find the root cause and open a PR"
          prompt="Find out why the upload test is flaky and fix it."
        >
          Fix a flaky test
        </AgentSessionsSuggestion>
        <AgentSessionsSuggestion
          icon={<FileText />}
          description="From the PRs merged since the last tag"
          prompt="Write the release notes for the next version."
        >
          Write release notes
        </AgentSessionsSuggestion>
        <AgentSessionsSuggestion
          icon={<ShieldCheck />}
          description="Check the auth routes for common issues"
          prompt="Review the auth routes for security issues."
        >
          Review security
        </AgentSessionsSuggestion>
        <AgentSessionsSuggestion
          icon={<FolderGit2 />}
          description="Map the modules and how they connect"
          prompt="Explain how this repository is structured."
        >
          Explain the codebase
        </AgentSessionsSuggestion>
      </AgentSessionsSuggestions>
    </AgentSessionsStart>
  );
}

interface DemoAgentSessionsProps {
  demo: DemoApi;
  sidebarMode?: AgentSessionsSidebarModeId;
  overlayBelowPx?: number;
  defaultSidebarOpen?: boolean;
  closeSidebarOnSelect?: boolean;
  defaultActiveSessionId?: string | null;
  onActiveSessionIdChange?: (sessionId: string | null) => void;
  className?: string;
}

/** The full composition every story below starts from. */
function DemoAgentSessions({
  demo,
  onActiveSessionIdChange,
  ...props
}: DemoAgentSessionsProps): ReactElement {
  return (
    <AgentSessions<DemoSession>
      sessions={demo.sessions}
      onActiveSessionIdChange={(sessionId: string | null): void => {
        demo.markRead(sessionId);
        onActiveSessionIdChange?.(sessionId);
      }}
      {...props}
    >
      <DemoSidebar demo={demo} />
      <AgentSessionsMain>
        <DemoHeader />
        <DemoConversation demo={demo} />
        <DemoStart demo={demo} />
      </AgentSessionsMain>
    </AgentSessions>
  );
}

/* ------------------------------------------------------------------ */
/* Meta                                                               */
/* ------------------------------------------------------------------ */

interface AgentSessionsPlaygroundProps {
  sidebarMode?: AgentSessionsSidebarModeId;
  overlayBelowPx?: number;
  defaultSidebarOpen?: boolean;
  closeSidebarOnSelect?: boolean;
  /** Open on a session instead of the new-session screen. */
  defaultActiveSessionId?: string | null;
  onActiveSessionIdChange?: (sessionId: string | null) => void;
}

function AgentSessionsPlayground(
  props: AgentSessionsPlaygroundProps,
): ReactElement {
  const demo: DemoApi = useDemoSessions();
  return (
    <div className="h-dvh w-full">
      <DemoAgentSessions demo={demo} {...props} />
    </div>
  );
}

const meta = {
  title: "AI & Chat/AgentSessions",
  component: AgentSessionsPlayground,
  parameters: {
    layout: "fullscreen",
    docs: {
      // Every story fills its viewport (or opens a fixed dialog), so each
      // gets its own iframe on the docs page.
      story: { inline: false, iframeHeight: 640 },
      description: {
        component:
          "A multi-session agent chat: a sidebar of sessions to resume, the " +
          "active session's conversation — built from the existing " +
          "[AgentChatMessages](?path=/docs/ai-chat-agentchatmessages--docs) " +
          "and [PromptInput](?path=/docs/ai-chat-promptinput--docs) — and a " +
          "separate, roomier screen for starting a new session.\n\n" +
          "Everything is a composable part: `AgentSessions` (state & layout), " +
          "`AgentSessionsSidebar` / `…SidebarHeader` / `…SidebarContent` / " +
          "`…SidebarFooter`, `AgentSessionsNewSessionButton`, " +
          "`AgentSessionsSearch`, `AgentSessionsList` / `…ListGroup` / " +
          "`…ListItem`, `AgentSessionsMain`, `AgentSessionsHeader` / " +
          "`…HeaderActions` / `…Title` / `…SidebarToggle`, " +
          "`AgentSessionsConversation`, `AgentSessionsComposer`, " +
          "`AgentSessionsPromptInput`, and `AgentSessionsStart` / " +
          "`…StartHeader` / `…Suggestions` / `…Suggestion`. Drop your own " +
          "buttons, inputs and menus anywhere in between; " +
          "`useAgentSessions()` gives them the same state and actions, and " +
          "`useAgentSessionDraft()` wires a custom input to the per-session " +
          "drafts.\n\n" +
          "The list is newest-first and grouped by recency, each session " +
          "stamped with a live [RelativeTime](?path=/docs/date-time-relativetime--docs). " +
          "It fills its parent, so it works as a page, and inside " +
          "`AgentSessionsDialogContent` as a dialog opened from a " +
          "[FloatingActionButton](?path=/docs/actions-floatingactionbutton--docs). " +
          "The sidebar collapses inline, or becomes a drawer when the " +
          "component itself (not the viewport) is narrow.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    sidebarMode: {
      options: agentSessionsSidebarModeIds,
      control: { type: "radio" },
    },
    overlayBelowPx: { control: { type: "number" } },
    defaultSidebarOpen: { control: { type: "boolean" } },
    closeSidebarOnSelect: { control: { type: "boolean" } },
    defaultActiveSessionId: {
      options: [null, "migrate-users", "release-notes", "login-redirect"],
      control: { type: "select" },
    },
  },
  args: {
    sidebarMode: "auto",
    overlayBelowPx: 640,
    defaultSidebarOpen: true,
    closeSidebarOnSelect: true,
    defaultActiveSessionId: null,
    onActiveSessionIdChange: fn(),
  },
} satisfies Meta<typeof AgentSessionsPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An item button's name starts with the session title. */
function sessionName(title: string): RegExp {
  return new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}`);
}

/* ------------------------------------------------------------------ */
/* Standalone page                                                    */
/* ------------------------------------------------------------------ */

export const StandalonePage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "As a whole page, resuming a session. The list is newest first, " +
          "grouped by recency, with a live relative time and a status dot " +
          "per session (running, awaiting input, completed, failed). Hover " +
          "a session for its menu (pin, mark unread, delete).",
      },
    },
  },
  args: {
    defaultActiveSessionId: "migrate-users",
  },
};

/* ------------------------------------------------------------------ */
/* New-session screen                                                 */
/* ------------------------------------------------------------------ */

export const NewSessionScreen: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "With no active session, `AgentSessionsStart` shows instead of " +
          "the conversation: a larger prompt with its own inputs (attach, " +
          "model `Select`, a plan-mode `Switch`) and starter suggestions. " +
          "A suggestion fills the prompt; submitting creates a session and " +
          "switches to it through `selectSession` from `onSubmit`.",
      },
    },
  },
  args: {
    defaultActiveSessionId: null,
  },
  play: async ({ canvasElement, args }): Promise<void> => {
    const canvas = within(canvasElement);
    const prompt = await canvas.findByRole("textbox", {
      name: "New session prompt",
    });
    // The start screen fades in.
    await waitFor((): void => {
      expect(
        canvas.getByRole("heading", { name: "What should we work on?" }),
      ).toBeVisible();
    });

    // A suggestion fills the prompt and focuses it, caret at the end.
    await userEvent.click(
      canvas.getByRole("button", { name: /^Write release notes/ }),
    );
    await waitFor((): void => {
      expect(prompt).toHaveValue("Write the release notes for the next version.");
      expect(prompt).toHaveFocus();
    });
    await userEvent.keyboard(" Keep it short.");
    await userEvent.keyboard("{Enter}");

    // The new session opens: the start screen is gone, the transcript and
    // the list both show it, and the agent's reply arrives.
    await waitFor((): void => {
      expect(
        canvas.queryByRole("textbox", { name: "New session prompt" }),
      ).not.toBeInTheDocument();
    });
    const transcript = await canvas.findByRole("log");
    await waitFor((): void => {
      expect(
        within(transcript).getByText(
          "Write the release notes for the next version. Keep it short.",
        ),
      ).toBeVisible();
    });
    const current = canvas.getByRole("button", { current: true });
    await expect(current).toHaveTextContent("Write the release notes for the…");
    await expect(args.onActiveSessionIdChange).toHaveBeenCalledWith(
      expect.stringMatching(/^session-/),
    );
    await within(transcript).findByText(/^Got it/, {}, { timeout: 4000 });
  },
};

/* ------------------------------------------------------------------ */
/* Switching sessions keeps each draft                                */
/* ------------------------------------------------------------------ */

export const SwitchingKeepsDrafts: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`AgentSessionsPromptInput` keeps a draft per session (and one for " +
          "the new-session screen), so switching away and back never loses " +
          "what was typed. Typing re-renders only the prompt, not the " +
          "transcript or the list.",
      },
    },
  },
  args: {
    defaultActiveSessionId: "login-redirect",
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const message = await canvas.findByRole("textbox", { name: "Message" });
    await userEvent.type(message, "Also cover the logout flow");

    await userEvent.click(
      canvas.getByRole("button", { name: sessionName("Audit dark-mode contrast") }),
    );
    await waitFor((): void => {
      expect(
        canvas.getByRole("heading", { name: "Audit dark-mode contrast" }),
      ).toBeVisible();
      expect(canvas.getByRole("textbox", { name: "Message" })).toHaveValue("");
    });

    await userEvent.click(canvas.getByRole("button", { name: "New session" }));
    const prompt = await canvas.findByRole("textbox", {
      name: "New session prompt",
    });
    await userEvent.type(prompt, "An idea for later");

    await userEvent.click(
      canvas.getByRole("button", { name: sessionName("Fix login redirect loop") }),
    );
    await waitFor((): void => {
      expect(canvas.getByRole("textbox", { name: "Message" })).toHaveValue(
        "Also cover the logout flow",
      );
    });

    await userEvent.click(canvas.getByRole("button", { name: "New session" }));
    await waitFor((): void => {
      expect(
        canvas.getByRole("textbox", { name: "New session prompt" }),
      ).toHaveValue("An idea for later");
    });
  },
};

/* ------------------------------------------------------------------ */
/* Search                                                             */
/* ------------------------------------------------------------------ */

export const SearchSessions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`AgentSessionsSearch` filters the list by title and preview " +
          "(every word must match). Pass `filter` to `AgentSessionsList` to " +
          "match your own way, or `filter={false}` with a controlled " +
          "`searchQuery` to search on the server.",
      },
    },
  },
  args: {
    defaultActiveSessionId: "migrate-users",
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const list = await canvas.findByRole("list", { name: "Sessions" });
    const search = canvas.getByRole("searchbox", { name: "Search sessions" });

    await userEvent.type(search, "users backfill");
    await waitFor((): void => {
      const items = within(list).getAllByRole("button", {
        name: /^(?!Actions for)/,
      });
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveAccessibleName(sessionName("Migrate users to org_id"));
    });

    await userEvent.clear(search);
    await userEvent.type(search, "kubernetes");
    await expect(
      await canvas.findByText("No sessions match “kubernetes”."),
    ).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }));
    await waitFor((): void => {
      expect(search).toHaveValue("");
      expect(search).toHaveFocus();
    });
    await expect(
      within(canvas.getByRole("list", { name: "Sessions" })).getByRole(
        "button",
        { name: sessionName("Team writing style guide") },
      ),
    ).toBeVisible();
  },
};

/* ------------------------------------------------------------------ */
/* Drawer sidebar on a phone                                          */
/* ------------------------------------------------------------------ */

export const OnAPhone: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          "Below `overlayBelowPx` (640px of the component's own width) the " +
          "sidebar becomes a drawer over the conversation, which is `inert` " +
          "meanwhile. Opening it focuses the active session; Escape, the " +
          "scrim or picking a session closes it and hands focus back to " +
          "the toggle.",
      },
    },
  },
  args: {
    defaultActiveSessionId: "release-notes",
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const nav = await canvas.findByRole("navigation", { name: "Sessions" });
    await waitFor((): void => {
      expect(nav).toHaveAttribute("data-mode", "overlay");
      expect(nav).toHaveAttribute("data-state", "closed");
    });

    const toggle = canvas.getByRole("button", { name: "Show sessions" });
    await userEvent.click(toggle);
    await waitFor((): void => {
      expect(nav).toHaveAttribute("data-state", "open");
      expect(within(nav).getByRole("button", { current: true })).toHaveFocus();
    });

    await userEvent.keyboard("{Escape}");
    await waitFor((): void => {
      expect(nav).toHaveAttribute("data-state", "closed");
      expect(toggle).toHaveFocus();
    });

    await userEvent.click(toggle);
    await waitFor((): void => {
      expect(nav).toHaveAttribute("data-state", "open");
    });
    await userEvent.click(
      within(nav).getByRole("button", { name: sessionName("Fix login redirect loop") }),
    );
    await waitFor((): void => {
      expect(nav).toHaveAttribute("data-state", "closed");
      expect(
        canvas.getByRole("heading", { name: "Fix login redirect loop" }),
      ).toBeVisible();
    });
  },
};

/* ------------------------------------------------------------------ */
/* In a dialog, opened from a FloatingActionButton                    */
/* ------------------------------------------------------------------ */

interface DialogExampleProps {
  placement: AgentSessionsDialogPlacementId;
  defaultActiveSessionId?: string | null;
}

function DialogExample({
  placement,
  defaultActiveSessionId = null,
}: DialogExampleProps): ReactElement {
  const demo: DemoApi = useDemoSessions();
  return (
    <div className="relative h-dvh w-full bg-muted/30 p-8">
      <div className="mx-auto max-w-2xl space-y-3">
        <h1 className="text-2xl font-semibold">Acme dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Any page can host the assistant: the floating button opens an
          <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">
            AgentSessionsDialogContent
          </code>
          with the same sessions you would get on a full page.
        </p>
      </div>
      <AgentSessionsDialog>
        <AgentSessionsDialogTrigger asChild>
          <FloatingActionButton
            icon={<MessageCircle />}
            aria-label="Open assistant"
            position={placement === "bottom-left" ? "bottom-left" : "bottom-right"}
          />
        </AgentSessionsDialogTrigger>
        <AgentSessionsDialogContent title="Assistant" placement={placement}>
          <DemoAgentSessions
            demo={demo}
            defaultActiveSessionId={defaultActiveSessionId}
          />
        </AgentSessionsDialogContent>
      </AgentSessionsDialog>
    </div>
  );
}

export const InADialog: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`AgentSessionsDialog` + `AgentSessionsDialogTrigger` (here a " +
          "`FloatingActionButton`) + `AgentSessionsDialogContent`, around " +
          "the same composition as the page. The dialog opens on the " +
          "prompt, and `AgentSessionsHeader` adds a close button inside it. " +
          "`placement` picks `center`, `bottom-right`, `bottom-left` or " +
          "`fullscreen`; all go full-screen on phones.",
      },
    },
  },
  argTypes: {
    // Only the dialog's own arg applies here.
    sidebarMode: { table: { disable: true } },
    overlayBelowPx: { table: { disable: true } },
    defaultSidebarOpen: { table: { disable: true } },
    closeSidebarOnSelect: { table: { disable: true } },
  },
  render: (args): ReactElement => (
    <DialogExample
      placement="center"
      defaultActiveSessionId={args.defaultActiveSessionId}
    />
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole("button", { name: "Open assistant" }));
    const dialog = await body.findByRole("dialog", { name: "Assistant" });

    // It opens on the new-session prompt, with the sidebar inline.
    await waitFor((): void => {
      expect(
        within(dialog).getByRole("textbox", { name: "New session prompt" }),
      ).toHaveFocus();
    });
    await expect(
      within(dialog).getByRole("navigation", { name: "Sessions" }),
    ).toHaveAttribute("data-mode", "inline");

    await userEvent.click(
      within(dialog).getByRole("button", {
        name: sessionName("Fix login redirect loop"),
      }),
    );
    await waitFor((): void => {
      expect(
        within(dialog).getByRole("textbox", { name: "Message" }),
      ).toBeVisible();
    });

    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    await waitFor((): void => {
      expect(body.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

export const ChatWidget: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`placement=\"bottom-right\"` opens a chat-widget panel above the " +
          "button. At that width the sidebar is a drawer; Escape closes the " +
          "drawer first and only then the dialog.",
      },
    },
  },
  argTypes: InADialog.argTypes,
  args: {
    defaultActiveSessionId: "release-notes",
  },
  render: (args): ReactElement => (
    <DialogExample
      placement="bottom-right"
      defaultActiveSessionId={args.defaultActiveSessionId}
    />
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole("button", { name: "Open assistant" }));
    const dialog = await body.findByRole("dialog", { name: "Assistant" });
    const nav = within(dialog).getByRole("navigation", { name: "Sessions" });
    await waitFor((): void => {
      expect(nav).toHaveAttribute("data-mode", "overlay");
      expect(within(dialog).getByRole("textbox", { name: "Message" })).toHaveFocus();
    });

    await userEvent.click(
      within(dialog).getByRole("button", { name: "Show sessions" }),
    );
    await waitFor((): void => {
      expect(nav).toHaveAttribute("data-state", "open");
    });

    // The first Escape only closes the drawer…
    await userEvent.keyboard("{Escape}");
    await waitFor((): void => {
      expect(nav).toHaveAttribute("data-state", "closed");
    });
    await expect(body.getByRole("dialog", { name: "Assistant" })).toBeVisible();

    // …the second closes the dialog.
    await userEvent.keyboard("{Escape}");
    await waitFor((): void => {
      expect(body.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

export const DialogPlacements: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Every `AgentSessionsDialogContent` placement, for comparison.",
      },
    },
  },
  argTypes: InADialog.argTypes,
  render: (args): ReactElement => <DialogPlacementsExample {...args} />,
};

function DialogPlacementsExample({
  defaultActiveSessionId,
}: AgentSessionsPlaygroundProps): ReactElement {
  const demo: DemoApi = useDemoSessions();
  return (
    <div className="flex h-dvh w-full flex-wrap content-center justify-center gap-3 bg-muted/30 p-8">
      {agentSessionsDialogPlacementIds.map(
        (placement: AgentSessionsDialogPlacementId): ReactElement => (
          <AgentSessionsDialog key={placement}>
            <AgentSessionsDialogTrigger asChild>
              <Button variant="outline">{placement}</Button>
            </AgentSessionsDialogTrigger>
            <AgentSessionsDialogContent
              title={`Assistant (${placement})`}
              placement={placement}
            >
              <DemoAgentSessions
                demo={demo}
                defaultActiveSessionId={defaultActiveSessionId}
              />
            </AgentSessionsDialogContent>
          </AgentSessionsDialog>
        ),
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Customized                                                         */
/* ------------------------------------------------------------------ */

const STATUS_FILTERS: readonly {
  id: "all" | AgentSessionStatusId;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "running", label: "Running" },
  { id: "awaiting-input", label: "Needs you" },
  { id: "failed", label: "Failed" },
];

const PROJECT_LABELS: Record<DemoSession["project"], string> = {
  api: "schemavaults/api",
  web: "schemavaults/web",
  ui: "schemavaults/ui",
};

/** A custom part: quick replies wired through `useAgentSessionDraft`. */
function QuickReplies(): ReactElement | null {
  const { activeSession, focusComposer } = useAgentSessions<DemoSession>();
  const [, setDraft] = useAgentSessionDraft();
  if (activeSession?.status !== "awaiting-input") return null;
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Quick replies">
      {["Yes, go ahead", "Show me the diff first", "No, stop"].map(
        (reply: string): ReactElement => (
          <Button
            key={reply}
            variant="outline"
            size="sm"
            className="h-7 rounded-full text-xs"
            onClick={(): void => {
              setDraft(reply);
              focusComposer();
            }}
          >
            {reply}
          </Button>
        ),
      )}
    </div>
  );
}

function CustomizedExample(): ReactElement {
  const demo: DemoApi = useDemoSessions();
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]["id"]>("all");
  const [archived, setArchived] = useState<number>(0);

  return (
    <div className="h-dvh w-full">
      <AgentSessions<DemoSession>
        sessions={demo.sessions}
        defaultActiveSessionId="release-notes"
        sidebarWidth="20rem"
        newSessionTitle="Ask the agent"
      >
        <AgentSessionsSidebar className="bg-background">
          <AgentSessionsSidebarHeader>
            <div className="flex items-center gap-2">
              <AgentSessionsSearch wrapperClassName="flex-1" />
              <AgentSessionsNewSessionButton
                size="icon"
                variant="default"
                className="h-9 w-9 shrink-0"
                aria-label="New session"
              />
            </div>
            {/* Custom input: a status filter feeding the list's `filter`. */}
            <div
              role="radiogroup"
              aria-label="Filter by status"
              className="flex flex-wrap gap-1"
            >
              {STATUS_FILTERS.map((option) => (
                <Button
                  key={option.id}
                  role="radio"
                  aria-checked={statusFilter === option.id}
                  variant={statusFilter === option.id ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={(): void => setStatusFilter(option.id)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </AgentSessionsSidebarHeader>
          <AgentSessionsSidebarContent>
            <AgentSessionsList<DemoSession>
              groupBy={(session: DemoSession) => ({
                id: session.project,
                label: PROJECT_LABELS[session.project],
              })}
              filter={(session: DemoSession, query: string): boolean =>
                matchesAgentSessionQuery(session, query) &&
                (statusFilter === "all" || session.status === statusFilter)
              }
              noResults="Nothing here — try another filter."
              renderItem={(session: DemoSession): ReactNode => (
                <AgentSessionsListItem
                  session={session}
                  timestampProps={{ formatStyle: "short" }}
                  description={
                    session.model ? `${session.model} · ${session.preview ?? ""}` : undefined
                  }
                  actions={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      aria-label={`Archive ${session.title}`}
                      onClick={(): void => {
                        demo.remove(session.id);
                        setArchived((n) => n + 1);
                      }}
                    >
                      <Archive aria-hidden="true" className="size-4" />
                    </Button>
                  }
                />
              )}
            />
          </AgentSessionsSidebarContent>
          <AgentSessionsSidebarFooter>
            <p className="px-1 text-xs text-muted-foreground" aria-live="polite">
              {archived === 0
                ? "Archived sessions appear here."
                : `${archived} archived this visit.`}
            </p>
          </AgentSessionsSidebarFooter>
        </AgentSessionsSidebar>
        <AgentSessionsMain>
          <AgentSessionsHeader>
            <AgentSessionsSidebarToggle />
            <AgentSessionsTitle />
            <AgentSessionsHeaderActions>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Share2 aria-hidden="true" className="size-4" />
                Share
              </Button>
            </AgentSessionsHeaderActions>
          </AgentSessionsHeader>
          <DemoConversationWithQuickReplies demo={demo} />
          <AgentSessionsStart>
            <AgentSessionsStartHeader
              title="Ask the agent"
              description="A minimal start screen: just a big prompt."
            />
            <AgentSessionsPromptInput<DemoSession>
              size="lg"
              variant="filled"
              onSubmit={(value, { selectSession }): void => {
                selectSession(demo.create(value));
              }}
            >
              <PromptInputTextarea
                rows={6}
                placeholder="Describe the task in as much detail as you like…"
                aria-label="New session prompt"
              />
              <PromptInputToolbar>
                <span className="px-1 text-xs text-muted-foreground">
                  Shift+Enter for a new line
                </span>
                <PromptInputSubmit sendLabel="Start session" />
              </PromptInputToolbar>
            </AgentSessionsPromptInput>
          </AgentSessionsStart>
        </AgentSessionsMain>
      </AgentSessions>
    </div>
  );
}

function DemoConversationWithQuickReplies({
  demo,
}: {
  demo: DemoApi;
}): ReactElement {
  return (
    <AgentSessionsConversation<DemoSession>>
      {({ sessionId }): ReactNode => (
        <>
          <AgentChatMessages stackClassName="mx-auto w-full max-w-3xl">
            {demo.messagesFor(sessionId).map(
              (message: DemoMessage): ReactElement => (
                <AgentChatBubble key={message.id} from={message.from}>
                  {message.text}
                </AgentChatBubble>
              ),
            )}
            {demo.isPending(sessionId) ? (
              <AgentTypingIndicator key="typing" />
            ) : null}
          </AgentChatMessages>
          <AgentSessionsComposer>
            <QuickReplies />
            <AgentSessionsPromptInput<DemoSession>
              isLoading={demo.isPending(sessionId)}
              onStop={(): void => demo.stop(sessionId)}
              onSubmit={(value: string): void => demo.send(sessionId, value)}
            >
              <PromptInputTextarea placeholder="Reply…" aria-label="Message" />
              <PromptInputToolbar>
                <PromptInputActions />
                <PromptInputSubmit />
              </PromptInputToolbar>
            </AgentSessionsPromptInput>
          </AgentSessionsComposer>
        </>
      )}
    </AgentSessionsConversation>
  );
}

export const Customized: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Every part swapped or extended: a compact sidebar header with " +
          "an icon new-session button and a custom status filter (passed " +
          "to the list's `filter`), sessions grouped by project with " +
          "`groupBy`, items rendered with `renderItem` and an archive " +
          "action, a custom footer, header buttons, quick replies built " +
          "on `useAgentSessionDraft`, and a minimal start screen.",
      },
    },
  },
  argTypes: InADialog.argTypes,
  render: (): ReactElement => <CustomizedExample />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const list = await canvas.findByRole("list", { name: "Sessions" });
    await expect(
      within(list).getByRole("list", { name: "schemavaults/api" }),
    ).toBeVisible();

    // The custom status filter narrows the list.
    await userEvent.click(canvas.getByRole("radio", { name: "Failed" }));
    await waitFor((): void => {
      const items = within(canvas.getByRole("list", { name: "Sessions" }))
        .getAllByRole("button", { name: /^(?!Archive)/ });
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveAccessibleName(
        sessionName("Investigate the flaky upload test"),
      );
    });
    await userEvent.click(canvas.getByRole("radio", { name: "All" }));

    // Quick replies (shown while the session awaits input) fill the draft.
    await userEvent.click(canvas.getByRole("button", { name: "Yes, go ahead" }));
    await waitFor((): void => {
      const message = canvas.getByRole("textbox", { name: "Message" });
      expect(message).toHaveValue("Yes, go ahead");
      expect(message).toHaveFocus();
    });
  },
};

/* ------------------------------------------------------------------ */
/* Controlled                                                         */
/* ------------------------------------------------------------------ */

function ControlledExample(): ReactElement {
  const demo: DemoApi = useDemoSessions();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    "migrate-users",
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex h-dvh w-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b bg-muted/40 p-2 text-sm">
        <span className="px-1 text-muted-foreground">
          Outside the component — active:{" "}
          <code data-testid="active-session-id">
            {activeSessionId ?? "null"}
          </code>
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={(): void => setActiveSessionId("dark-mode")}
        >
          Open “Audit dark-mode contrast”
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(): void => setActiveSessionId(null)}
        >
          Start over
        </Button>
        <Button
          size="sm"
          variant="outline"
          aria-pressed={sidebarOpen}
          onClick={(): void => setSidebarOpen((open) => !open)}
        >
          Sidebar
        </Button>
      </div>
      <div className="min-h-0 flex-1">
        <AgentSessions<DemoSession>
          sessions={demo.sessions}
          activeSessionId={activeSessionId}
          onActiveSessionIdChange={setActiveSessionId}
          sidebarOpen={sidebarOpen}
          onSidebarOpenChange={setSidebarOpen}
        >
          <DemoSidebar demo={demo} />
          <AgentSessionsMain>
            <DemoHeader />
            <DemoConversation demo={demo} />
            <DemoStart demo={demo} />
          </AgentSessionsMain>
        </AgentSessions>
      </div>
    </div>
  );
}

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`activeSessionId` / `onActiveSessionIdChange` and `sidebarOpen` / " +
          "`onSidebarOpenChange` can be controlled — e.g. to put the session " +
          "id in the URL, or drive the component from elsewhere on the page.",
      },
    },
  },
  argTypes: InADialog.argTypes,
  render: (): ReactElement => <ControlledExample />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const activeId = await canvas.findByTestId("active-session-id");

    await userEvent.click(
      canvas.getByRole("button", { name: "Open “Audit dark-mode contrast”" }),
    );
    await waitFor((): void => {
      expect(
        canvas.getByRole("heading", { name: "Audit dark-mode contrast" }),
      ).toBeVisible();
    });

    await userEvent.click(
      canvas.getByRole("button", { name: sessionName("Fix login redirect loop") }),
    );
    await waitFor((): void => {
      expect(activeId).toHaveTextContent("login-redirect");
    });

    const nav = canvas.getByRole("navigation", { name: "Sessions" });
    await userEvent.click(canvas.getByRole("button", { name: "Hide sessions" }));
    await waitFor((): void => {
      expect(nav).toHaveAttribute("data-state", "closed");
      expect(canvas.getByRole("button", { name: "Sidebar" })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });
  },
};

/* ------------------------------------------------------------------ */
/* Empty                                                              */
/* ------------------------------------------------------------------ */

const NO_SESSIONS: readonly DemoSession[] = [];

function EmptyExample(): ReactElement {
  const demo: DemoApi = useDemoSessions();
  return (
    <div className="h-dvh w-full">
      <AgentSessions<DemoSession> sessions={NO_SESSIONS}>
        <AgentSessionsSidebar>
          <AgentSessionsSidebarHeader>
            <AgentSessionsNewSessionButton />
          </AgentSessionsSidebarHeader>
          <AgentSessionsSidebarContent>
            <AgentSessionsList empty="Your sessions will show up here." />
          </AgentSessionsSidebarContent>
        </AgentSessionsSidebar>
        <AgentSessionsMain>
          <AgentSessionsHeader />
          <DemoStart demo={demo} />
        </AgentSessionsMain>
      </AgentSessions>
    </div>
  );
}

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "No sessions yet: the list shows its `empty` message and the " +
          "default `AgentSessionsHeader` (toggle + title) sits above the " +
          "start screen.",
      },
    },
  },
  argTypes: InADialog.argTypes,
  render: (): ReactElement => <EmptyExample />,
};
