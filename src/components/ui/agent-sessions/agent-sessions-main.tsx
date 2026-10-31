"use client";

import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";
import { useAgentSessionsContext } from "./agent-sessions-context";
import { AgentSessionsDialogClose } from "./agent-sessions-dialog";
import { useAgentSessionsDialogContext } from "./agent-sessions-dialog-context";
import type { AgentSession } from "./agent-sessions-model";
import { AgentSessionsSidebarToggle } from "./agent-sessions-sidebar";

/* ------------------------------------------------------------------ */
/* AgentSessionsMain                                                  */
/* ------------------------------------------------------------------ */

export interface AgentSessionsMainProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

/**
 * The column beside the sidebar: header on top, then the conversation or
 * the new-session screen. `inert` while the overlay sidebar is open.
 */
function AgentSessionsMain({
  className,
  ref,
  ...props
}: AgentSessionsMainProps): ReactElement {
  const ctx = useAgentSessionsContext("AgentSessionsMain");
  const covered: boolean = ctx.sidebarMode === "overlay" && ctx.sidebarOpen;
  return (
    <div
      ref={ref}
      data-slot="agent-sessions-main"
      inert={covered}
      className={cn("relative flex min-h-0 min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  );
}
AgentSessionsMain.displayName = "AgentSessionsMain";

/* ------------------------------------------------------------------ */
/* AgentSessionsHeader                                                */
/* ------------------------------------------------------------------ */

export interface AgentSessionsHeaderProps extends HTMLAttributes<HTMLElement> {
  /**
   * The header's contents. Omit for the default: the sidebar toggle and
   * the title.
   */
  children?: ReactNode;
  /**
   * Inside `<AgentSessionsDialogContent>`, end the header with an
   * `<AgentSessionsDialogClose>`. Default: true.
   */
  showDialogClose?: boolean;
  ref?: Ref<HTMLElement>;
}

/**
 * The bar above the conversation. Lay out your own buttons in it — the
 * title grows to fill the space, so `<AgentSessionsHeaderActions>` after it
 * sits at the far end.
 */
function AgentSessionsHeader({
  className,
  children,
  showDialogClose = true,
  ref,
  ...props
}: AgentSessionsHeaderProps): ReactElement {
  const inDialog: boolean = useAgentSessionsDialogContext() !== null;
  return (
    <header
      ref={ref}
      data-slot="agent-sessions-header"
      className={cn(
        "flex h-12 shrink-0 items-center gap-1 border-b px-2",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <AgentSessionsSidebarToggle />
          <AgentSessionsTitle />
        </>
      )}
      {inDialog && showDialogClose ? <AgentSessionsDialogClose /> : null}
    </header>
  );
}
AgentSessionsHeader.displayName = "AgentSessionsHeader";

export interface AgentSessionsHeaderActionsProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

/** A row of header buttons, menus or inputs. */
function AgentSessionsHeaderActions({
  className,
  ref,
  ...props
}: AgentSessionsHeaderActionsProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="agent-sessions-header-actions"
      className={cn("flex shrink-0 items-center gap-1", className)}
      {...props}
    />
  );
}
AgentSessionsHeaderActions.displayName = "AgentSessionsHeaderActions";

/* ------------------------------------------------------------------ */
/* AgentSessionsTitle                                                 */
/* ------------------------------------------------------------------ */

export interface AgentSessionsTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Replaces the title. Default: the active session's title, or
   * `newSessionTitle` on the new-session screen.
   */
  children?: ReactNode;
  /** Render your own element (e.g. an `<h1>`) via Radix Slot. */
  asChild?: boolean;
  ref?: Ref<HTMLHeadingElement>;
}

/** The current session's title (an `<h2>`), truncated to one line. */
function AgentSessionsTitle({
  className,
  children,
  asChild = false,
  ref,
  ...props
}: AgentSessionsTitleProps): ReactElement {
  const ctx = useAgentSessionsContext("AgentSessionsTitle");
  const Comp = asChild ? Slot : "h2";
  const content: ReactNode =
    children ??
    (ctx.view === "new" ? ctx.newSessionTitle : (ctx.activeSession?.title ?? ""));
  return (
    <Comp
      ref={ref}
      data-slot="agent-sessions-title"
      className={cn(
        "min-w-0 flex-1 truncate px-1 text-sm font-semibold",
        className,
      )}
      {...props}
    >
      {content}
    </Comp>
  );
}
AgentSessionsTitle.displayName = "AgentSessionsTitle";

/* ------------------------------------------------------------------ */
/* AgentSessionsConversation                                          */
/* ------------------------------------------------------------------ */

export interface AgentSessionsConversationRenderProps<
  TSession extends AgentSession = AgentSession,
> {
  sessionId: string;
  /** `undefined` while the id is not (yet) in `sessions`. */
  session: TSession | undefined;
}

export interface AgentSessionsConversationProps<
  TSession extends AgentSession = AgentSession,
> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * The active session's transcript and prompt — typically an
   * `<AgentChatMessages>` above an `<AgentSessionsComposer>`. Pass a
   * function to render the session that is active.
   */
  children?:
    | ReactNode
    | ((props: AgentSessionsConversationRenderProps<TSession>) => ReactNode);
  ref?: Ref<HTMLDivElement>;
}

/**
 * Renders while a session is active (and nothing on the new-session
 * screen). It remounts on every switch, so an `<AgentChatMessages>` inside
 * opens scrolled to the newest message of the session just picked.
 */
function AgentSessionsConversation<TSession extends AgentSession = AgentSession>({
  children,
  className,
  ref,
  ...props
}: AgentSessionsConversationProps<TSession>): ReactElement | null {
  const ctx = useAgentSessionsContext<TSession>("AgentSessionsConversation");
  const sessionId: string | null = ctx.activeSessionId;
  if (sessionId === null) return null;
  return (
    <div
      key={sessionId}
      ref={ref}
      data-slot="agent-sessions-conversation"
      data-session-id={sessionId}
      className={cn(
        "flex min-h-0 flex-1 flex-col duration-200 animate-in fade-in-0 motion-reduce:animate-none [&>[data-slot=agent-chat-messages]]:min-h-0 [&>[data-slot=agent-chat-messages]]:flex-1",
        className,
      )}
      {...props}
    >
      {typeof children === "function"
        ? children({ sessionId, session: ctx.activeSession })
        : children}
    </div>
  );
}
AgentSessionsConversation.displayName = "AgentSessionsConversation";

/* ------------------------------------------------------------------ */
/* AgentSessionsComposer                                              */
/* ------------------------------------------------------------------ */

export interface AgentSessionsComposerProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

/**
 * The strip below the transcript that holds the prompt (and anything you
 * add around it — a disclaimer, quick replies). Centred, `max-w-3xl`.
 */
function AgentSessionsComposer({
  className,
  ref,
  ...props
}: AgentSessionsComposerProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="agent-sessions-composer"
      className={cn(
        "mx-auto flex w-full max-w-3xl shrink-0 flex-col gap-2 px-3 pb-3 pt-2",
        className,
      )}
      {...props}
    />
  );
}
AgentSessionsComposer.displayName = "AgentSessionsComposer";

export {
  AgentSessionsMain,
  AgentSessionsHeader,
  AgentSessionsHeaderActions,
  AgentSessionsTitle,
  AgentSessionsConversation,
  AgentSessionsComposer,
};
