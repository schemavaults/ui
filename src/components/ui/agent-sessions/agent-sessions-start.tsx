"use client";

import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";
import { useAgentSessionsContext } from "./agent-sessions-context";

/* ------------------------------------------------------------------ */
/* AgentSessionsStart                                                 */
/* ------------------------------------------------------------------ */

export interface AgentSessionsStartProps extends HTMLAttributes<HTMLDivElement> {
  /** Class for the centred column inside the scroll area. */
  contentClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * The new-session screen, shown instead of the conversation while no
 * session is active. A roomy, centred column for a bigger prompt —
 * usually an `<AgentSessionsStartHeader>`, an `<AgentSessionsPromptInput>`
 * with more rows and your own inputs (model, repository, mode…), and
 * `<AgentSessionsSuggestions>`. Scrolls when it outgrows the space.
 */
function AgentSessionsStart({
  className,
  contentClassName,
  children,
  ref,
  ...props
}: AgentSessionsStartProps): ReactElement | null {
  const ctx = useAgentSessionsContext("AgentSessionsStart");
  if (ctx.activeSessionId !== null) return null;
  return (
    <div
      ref={ref}
      data-slot="agent-sessions-start"
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto duration-200 animate-in fade-in-0 motion-reduce:animate-none",
        className,
      )}
      {...props}
    >
      {/* `m-auto` centres the column but, unlike `justify-center`, never
          pushes its top out of reach when it overflows. */}
      <div
        data-slot="agent-sessions-start-content"
        className={cn(
          "m-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
AgentSessionsStart.displayName = "AgentSessionsStart";

/* ------------------------------------------------------------------ */
/* AgentSessionsStartHeader                                           */
/* ------------------------------------------------------------------ */

export interface AgentSessionsStartHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Shown in a tinted tile above the title. */
  icon?: ReactNode;
  /** Default: "Start a new session". */
  title?: ReactNode;
  description?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** The greeting above the new-session prompt. Extra children go below it. */
function AgentSessionsStartHeader({
  icon,
  title = "Start a new session",
  description,
  className,
  children,
  ref,
  ...props
}: AgentSessionsStartHeaderProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="agent-sessions-start-header"
      className={cn("flex flex-col items-center gap-2 text-center", className)}
      {...props}
    >
      {icon !== undefined && icon !== null ? (
        <div
          aria-hidden="true"
          className="mb-1 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary [&_svg]:size-6"
        >
          {icon}
        </div>
      ) : null}
      <h2 className="text-balance text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {description !== undefined && description !== null ? (
        <p className="max-w-prose text-balance text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
AgentSessionsStartHeader.displayName = "AgentSessionsStartHeader";

/* ------------------------------------------------------------------ */
/* AgentSessionsSuggestions                                           */
/* ------------------------------------------------------------------ */

export interface AgentSessionsSuggestionsProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name of the group. Default: "Suggestions". */
  "aria-label"?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A grid of `<AgentSessionsSuggestion>`s that reflows to the space it has
 * (container-sized, so it also suits a narrow dialog).
 */
function AgentSessionsSuggestions({
  className,
  "aria-label": ariaLabel = "Suggestions",
  ref,
  ...props
}: AgentSessionsSuggestionsProps): ReactElement {
  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      data-slot="agent-sessions-suggestions"
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))] gap-2",
        className,
      )}
      {...props}
    />
  );
}
AgentSessionsSuggestions.displayName = "AgentSessionsSuggestions";

export interface AgentSessionsSuggestionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Prompt to put in the current view's draft on click (the prompt is then
   * focused, ready to edit or send). Omit to only run `onClick`.
   */
  prompt?: string;
  icon?: ReactNode;
  /** Second, muted line under the label. */
  description?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * A starter prompt. Clicking it fills the prompt with `prompt`; call
 * `event.preventDefault()` in `onClick` to do something else instead.
 */
function AgentSessionsSuggestion({
  prompt,
  icon,
  description,
  className,
  children,
  onClick,
  type = "button",
  ref,
  ...props
}: AgentSessionsSuggestionProps): ReactElement {
  const ctx = useAgentSessionsContext("AgentSessionsSuggestion");

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    onClick?.(event);
    if (event.defaultPrevented || prompt === undefined) return;
    ctx.draftStore.set(ctx.activeSessionId, prompt);
    ctx.focusComposer();
  };

  return (
    <button
      ref={ref}
      type={type}
      data-slot="agent-sessions-suggestion"
      onClick={handleClick}
      className={cn(
        "flex items-start gap-3 rounded-lg border bg-card p-3 text-left text-sm text-card-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {icon !== undefined && icon !== null ? (
        <span
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-muted-foreground [&_svg]:size-4"
        >
          {icon}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="font-medium">{children}</span>
        {description !== undefined && description !== null ? (
          <span className="text-xs text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </button>
  );
}
AgentSessionsSuggestion.displayName = "AgentSessionsSuggestion";

export {
  AgentSessionsStart,
  AgentSessionsStartHeader,
  AgentSessionsSuggestions,
  AgentSessionsSuggestion,
};
