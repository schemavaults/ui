"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { PanelLeftClose, PanelLeftOpen, Search, SquarePen, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "../button/button";
import { useAgentSessionsContext } from "./agent-sessions-context";
import { AgentSessionsList } from "./agent-sessions-list";
import { mergeRefs } from "./merge-refs";

/* ------------------------------------------------------------------ */
/* AgentSessionsSidebar                                               */
/* ------------------------------------------------------------------ */

export interface AgentSessionsSidebarProps extends HTMLAttributes<HTMLElement> {
  /**
   * The sidebar's contents. Omit for the default: a header with a
   * new-session button and search, above the session list.
   */
  children?: ReactNode;
  /** Accessible name of the sidebar landmark. Default: "Sessions". */
  "aria-label"?: string;
  /** Class for the overlay-mode scrim behind the drawer. */
  scrimClassName?: string;
  ref?: Ref<HTMLElement>;
}

/**
 * The session list's container. Inline, it is a column the toggle collapses
 * to nothing; as an overlay, it is a drawer over the conversation that
 * Escape, a click on the scrim, or picking a session closes. While the
 * drawer is open the conversation is `inert`, so focus stays in it.
 */
function AgentSessionsSidebar({
  children,
  className,
  scrimClassName,
  "aria-label": ariaLabel = "Sessions",
  ref,
  ...props
}: AgentSessionsSidebarProps): ReactElement {
  const ctx = useAgentSessionsContext("AgentSessionsSidebar");
  const isOverlay: boolean = ctx.sidebarMode === "overlay";
  const open: boolean = ctx.sidebarOpen;
  const sidebarRef = useRef<HTMLElement | null>(null);
  const mergedRef = useMemo(() => mergeRefs<HTMLElement>(sidebarRef, ref), [ref]);

  // Opening the drawer moves focus into it (onto the active session if it
  // is listed); closing it hands focus back to whatever opened it.
  useEffect((): (() => void) | undefined => {
    if (!isOverlay || !open) return undefined;
    const sidebar: HTMLElement | null = sidebarRef.current;
    if (sidebar === null) return undefined;
    // The opener sits in the (now inert) conversation, so the browser may
    // already have dropped focus from it; fall back to the sidebar toggle.
    const opener: Element | null = document.activeElement;
    const previouslyFocused: Element | null =
      opener !== null && opener !== document.body
        ? opener
        : document.querySelector(`[aria-controls="${CSS.escape(sidebar.id)}"]`);
    const target: HTMLElement =
      sidebar.querySelector<HTMLElement>(
        '[data-slot="agent-sessions-list-item-button"][aria-current="true"]',
      ) ?? sidebar;
    target.focus({ preventScroll: true });
    return (): void => {
      const active: Element | null = document.activeElement;
      const focusIsLost: boolean =
        active === null || active === document.body || sidebar.contains(active);
      if (focusIsLost && previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [isOverlay, open]);

  const closeSidebar = useCallback(
    (): void => ctx.setSidebarOpen(false),
    [ctx],
  );

  return (
    <>
      {isOverlay ? (
        // Keyboard users close the drawer with Escape; the scrim is only a
        // pointer target, so it is hidden from assistive technology.
        <div
          role="presentation"
          aria-hidden="true"
          data-slot="agent-sessions-sidebar-scrim"
          data-state={open ? "open" : "closed"}
          onClick={closeSidebar}
          className={cn(
            "absolute inset-0 z-20 bg-black/40 transition-opacity duration-200 motion-reduce:transition-none",
            open ? "opacity-100" : "pointer-events-none opacity-0",
            scrimClassName,
          )}
        />
      ) : null}
      <nav
        ref={mergedRef}
        id={ctx.sidebarId}
        aria-label={ariaLabel}
        tabIndex={-1}
        inert={!open}
        data-slot="agent-sessions-sidebar"
        data-mode={ctx.sidebarMode}
        data-state={open ? "open" : "closed"}
        className={cn(
          "flex shrink-0 flex-col overflow-hidden bg-muted/40 outline-none motion-reduce:transition-none",
          isOverlay
            ? cn(
                "absolute inset-y-0 left-0 z-30 w-[min(var(--agent-sessions-sidebar-width),85%)] border-r bg-background shadow-xl transition-[transform,box-shadow] duration-200 ease-out",
                open ? "translate-x-0" : "-translate-x-full shadow-none",
              )
            : cn(
                "relative transition-[width] duration-200 ease-out",
                open
                  ? "w-[var(--agent-sessions-sidebar-width)] border-r"
                  : "w-0",
              ),
          // Until the component has been measured (the server render), `auto`
          // cannot know it will be an overlay; fall back to the viewport so a
          // phone does not flash an inline sidebar.
          !ctx.isMeasured && "max-md:hidden",
          className,
        )}
        {...props}
      >
        {/* A fixed-width inner column keeps the contents from reflowing
            while the inline sidebar animates its width. */}
        <div
          className={cn(
            "flex h-full min-h-0 flex-col",
            isOverlay ? "w-full" : "w-[var(--agent-sessions-sidebar-width)]",
          )}
        >
          {children ?? (
            <>
              <AgentSessionsSidebarHeader>
                <AgentSessionsNewSessionButton />
                <AgentSessionsSearch />
              </AgentSessionsSidebarHeader>
              <AgentSessionsSidebarContent>
                <AgentSessionsList />
              </AgentSessionsSidebarContent>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
AgentSessionsSidebar.displayName = "AgentSessionsSidebar";

/* ------------------------------------------------------------------ */
/* Sidebar sections                                                   */
/* ------------------------------------------------------------------ */

export interface AgentSessionsSidebarSectionProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

/** Top of the sidebar: new-session button, search, filters — your call. */
function AgentSessionsSidebarHeader({
  className,
  ref,
  ...props
}: AgentSessionsSidebarSectionProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="agent-sessions-sidebar-header"
      className={cn("flex shrink-0 flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}
AgentSessionsSidebarHeader.displayName = "AgentSessionsSidebarHeader";

/** The scrolling middle of the sidebar. Put `<AgentSessionsList>` here. */
function AgentSessionsSidebarContent({
  className,
  ref,
  ...props
}: AgentSessionsSidebarSectionProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="agent-sessions-sidebar-content"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2",
        className,
      )}
      {...props}
    />
  );
}
AgentSessionsSidebarContent.displayName = "AgentSessionsSidebarContent";

/** Bottom of the sidebar, e.g. the signed-in user or a settings link. */
function AgentSessionsSidebarFooter({
  className,
  ref,
  ...props
}: AgentSessionsSidebarSectionProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="agent-sessions-sidebar-footer"
      className={cn("flex shrink-0 flex-col gap-2 border-t p-2", className)}
      {...props}
    />
  );
}
AgentSessionsSidebarFooter.displayName = "AgentSessionsSidebarFooter";

/* ------------------------------------------------------------------ */
/* AgentSessionsSidebarToggle                                         */
/* ------------------------------------------------------------------ */

export interface AgentSessionsSidebarToggleProps extends ButtonProps {
  /** Accessible label while the sidebar is hidden. Default: "Show sessions". */
  openLabel?: string;
  /** Accessible label while the sidebar is shown. Default: "Hide sessions". */
  closeLabel?: string;
}

/**
 * Shows and hides the sidebar. Call `event.preventDefault()` in `onClick`
 * to skip the toggle. Default content: a panel icon.
 */
function AgentSessionsSidebarToggle({
  className,
  children,
  onClick,
  openLabel = "Show sessions",
  closeLabel = "Hide sessions",
  variant = "ghost",
  size = "icon",
  ...props
}: AgentSessionsSidebarToggleProps): ReactElement {
  const ctx = useAgentSessionsContext("AgentSessionsSidebarToggle");
  const open: boolean = ctx.sidebarOpen;

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    onClick?.(event);
    if (!event.defaultPrevented) ctx.toggleSidebar();
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      data-slot="agent-sessions-sidebar-toggle"
      data-state={open ? "open" : "closed"}
      aria-controls={ctx.sidebarId}
      aria-expanded={open}
      aria-label={open ? closeLabel : openLabel}
      className={cn(size === "icon" && "h-8 w-8 shrink-0", className)}
      onClick={handleClick}
      {...props}
    >
      {children ??
        (open ? (
          <PanelLeftClose aria-hidden="true" className="size-4" />
        ) : (
          <PanelLeftOpen aria-hidden="true" className="size-4" />
        ))}
    </Button>
  );
}
AgentSessionsSidebarToggle.displayName = "AgentSessionsSidebarToggle";

/* ------------------------------------------------------------------ */
/* AgentSessionsNewSessionButton                                      */
/* ------------------------------------------------------------------ */

export interface AgentSessionsNewSessionButtonProps extends ButtonProps {
  /** Leading icon. Default: a pen-on-square. Pass `null` for none. */
  icon?: ReactNode;
}

/**
 * Switches to the new-session screen. Call `event.preventDefault()` in
 * `onClick` to run your own flow instead. Default label: "New session".
 */
function AgentSessionsNewSessionButton({
  className,
  children,
  icon,
  onClick,
  variant = "outline",
  size = "sm",
  ...props
}: AgentSessionsNewSessionButtonProps): ReactElement {
  const ctx = useAgentSessionsContext("AgentSessionsNewSessionButton");

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    onClick?.(event);
    if (!event.defaultPrevented) ctx.startNewSession();
  };

  const iconNode: ReactNode =
    icon === undefined ? (
      <SquarePen aria-hidden="true" className="size-4" />
    ) : (
      icon
    );

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      data-slot="agent-sessions-new-session-button"
      data-active={ctx.view === "new" ? "true" : "false"}
      className={cn(
        size !== "icon" && "w-full justify-start gap-2",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {iconNode}
      {children ?? (size === "icon" ? null : "New session")}
    </Button>
  );
}
AgentSessionsNewSessionButton.displayName = "AgentSessionsNewSessionButton";

/* ------------------------------------------------------------------ */
/* AgentSessionsSearch                                                */
/* ------------------------------------------------------------------ */

export interface AgentSessionsSearchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "type"
  > {
  /** Class for the wrapper around the input, icon and clear button. */
  wrapperClassName?: string;
  /** Accessible label of the clear button. Default: "Clear search". */
  clearLabel?: string;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Filters `<AgentSessionsList>` by the sessions' titles and previews (or by
 * your own `filter`). Bound to the `searchQuery` of `<AgentSessions>`.
 */
function AgentSessionsSearch({
  className,
  wrapperClassName,
  placeholder = "Search sessions",
  "aria-label": ariaLabel = "Search sessions",
  clearLabel = "Clear search",
  onChange,
  ref,
  ...props
}: AgentSessionsSearchProps): ReactElement {
  const ctx = useAgentSessionsContext("AgentSessionsSearch");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mergedRef = useMemo(
    () => mergeRefs<HTMLInputElement>(inputRef, ref),
    [ref],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(event);
    if (!event.defaultPrevented) ctx.setSearchQuery(event.target.value);
  };

  const clear = (): void => {
    ctx.setSearchQuery("");
    inputRef.current?.focus();
  };

  return (
    <div
      data-slot="agent-sessions-search"
      className={cn("relative flex items-center", wrapperClassName)}
    >
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground"
      />
      <input
        ref={mergedRef}
        type="search"
        value={ctx.searchQuery}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          "h-9 w-full rounded-md border border-input bg-background pl-8 pr-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-search-cancel-button]:appearance-none",
          className,
        )}
        {...props}
      />
      {ctx.searchQuery.length > 0 ? (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={clear}
          className="absolute right-1.5 inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X aria-hidden="true" className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
AgentSessionsSearch.displayName = "AgentSessionsSearch";

export {
  AgentSessionsSidebar,
  AgentSessionsSidebarHeader,
  AgentSessionsSidebarContent,
  AgentSessionsSidebarFooter,
  AgentSessionsSidebarToggle,
  AgentSessionsNewSessionButton,
  AgentSessionsSearch,
};
