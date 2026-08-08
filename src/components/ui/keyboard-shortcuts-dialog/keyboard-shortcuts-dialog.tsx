"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Search } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog/dialog";
import { Kbd, KbdGroup } from "../kbd/kbd";
import type { KbdSize } from "../kbd/kbd-variants";

export const keyboardShortcutsDialogSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies string[];

export type KeyboardShortcutsDialogSize =
  (typeof keyboardShortcutsDialogSizeIds)[number];

const dialogSizeToKbdSize: Record<KeyboardShortcutsDialogSize, KbdSize> = {
  sm: "sm",
  md: "md",
  lg: "md",
};

/**
 * A single key combination.
 *
 * - `["⌘", "K"]` renders `⌘ + K`
 * - `[["⌘", "K"], ["Ctrl", "K"]]` renders `⌘ + K  or  Ctrl + K`
 */
export type KeyboardShortcutKeys = readonly string[] | readonly (readonly string[])[];

export interface KeyboardShortcut {
  /** Stable id (defaults to label + index if omitted). Used for React keys. */
  id?: string;
  /** Human-readable description of what the shortcut does. */
  label: string;
  /** Key(s) that trigger the action. */
  keys: KeyboardShortcutKeys;
  /** Optional secondary description shown below the label. */
  description?: string;
  /** Extra searchable keywords (not rendered). */
  keywords?: readonly string[];
}

export interface KeyboardShortcutSection {
  id?: string;
  title: string;
  description?: string;
  shortcuts: readonly KeyboardShortcut[];
}

function normalizeKeyCombos(
  keys: KeyboardShortcutKeys,
): readonly (readonly string[])[] {
  if (keys.length === 0) return [[]];
  return Array.isArray(keys[0])
    ? (keys as readonly (readonly string[])[])
    : [keys as readonly string[]];
}

function matchesQuery(
  shortcut: KeyboardShortcut,
  query: string,
): boolean {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (shortcut.label.toLowerCase().includes(q)) return true;
  if (shortcut.description?.toLowerCase().includes(q)) return true;
  if (shortcut.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
  const combos = normalizeKeyCombos(shortcut.keys);
  return combos.some((combo) =>
    combo.some((k) => k.toLowerCase().includes(q)),
  );
}

const contentSizeVariants = cva("gap-0 p-0", {
  variants: {
    size: {
      sm: "max-w-md",
      md: "max-w-2xl",
      lg: "max-w-3xl",
    } satisfies Record<KeyboardShortcutsDialogSize, string>,
  },
  defaultVariants: {
    size: "md",
  },
});

export interface KeyboardShortcutsDialogProps
  extends VariantProps<typeof contentSizeVariants> {
  /** Grouped shortcuts to display. */
  sections: readonly KeyboardShortcutSection[];
  /** Dialog title. Defaults to "Keyboard shortcuts". */
  title?: ReactNode;
  /** Optional description shown under the title. */
  description?: ReactNode;
  /** Whether to render the search input. Defaults to `true`. */
  searchable?: boolean;
  /** Placeholder shown in the search input. */
  searchPlaceholder?: string;
  /** Message rendered when no shortcuts match the query. Defaults to "No shortcuts match your search." */
  emptyMessage?: ReactNode;
  /**
   * Optional trigger element. When provided, it's wrapped in a `DialogTrigger`
   * and rendered before the dialog. Omit to control `open`/`onOpenChange`
   * yourself.
   */
  trigger?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled default open. */
  defaultOpen?: boolean;
  /** Optional className merged onto the dialog content. */
  className?: string;
  /**
   * Optional footer element rendered below the shortcut list, e.g. a hint
   * that pressing `?` reopens the dialog.
   */
  footer?: ReactNode;
}

function KeyboardShortcutsDialog({
  sections,
  title = "Keyboard shortcuts",
  description,
  searchable = true,
  searchPlaceholder = "Search shortcuts…",
  emptyMessage = "No shortcuts match your search.",
  trigger,
  open,
  onOpenChange,
  defaultOpen,
  className,
  footer,
  size,
}: KeyboardShortcutsDialogProps): ReactElement {
  const [query, setQuery] = useState<string>("");
  const resolvedSize: KeyboardShortcutsDialogSize = size ?? "md";
  const kbdSize = dialogSizeToKbdSize[resolvedSize];
  const inputId = useId();
  const descId = useId();

  // Reset the query whenever the dialog closes so the next open is fresh.
  useEffect(() => {
    if (open === false) setQuery("");
  }, [open]);

  const filteredSections = useMemo(() => {
    if (!query) return sections;
    return sections
      .map((section) => ({
        ...section,
        shortcuts: section.shortcuts.filter((s) => matchesQuery(s, query)),
      }))
      .filter((section) => section.shortcuts.length > 0);
  }, [sections, query]);

  const hasResults = filteredSections.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        data-slot="keyboard-shortcuts-dialog"
        data-size={resolvedSize}
        className={cn(contentSizeVariants({ size: resolvedSize }), className)}
        aria-describedby={description ? descId : undefined}
      >
        <DialogHeader className="px-6 pt-6 text-left">
          <DialogTitle
            data-slot="keyboard-shortcuts-dialog-title"
            className="text-base font-semibold"
          >
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription
              id={descId}
              data-slot="keyboard-shortcuts-dialog-description"
            >
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {searchable ? (
          <div
            data-slot="keyboard-shortcuts-dialog-search"
            className="border-b border-border px-6 pb-4 pt-2"
          >
            <label htmlFor={inputId} className="sr-only">
              Search shortcuts
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id={inputId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                autoComplete="off"
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground",
                  "ring-offset-background placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              />
            </div>
          </div>
        ) : null}

        <div
          data-slot="keyboard-shortcuts-dialog-body"
          className={cn(
            "max-h-[60vh] overflow-y-auto px-6 py-4",
            searchable ? "" : "border-t border-border",
          )}
        >
          {hasResults ? (
            <div className="flex flex-col gap-6">
              {filteredSections.map((section, sIdx) => (
                <KeyboardShortcutsSection
                  key={section.id ?? `${section.title}-${sIdx}`}
                  title={section.title}
                  description={section.description}
                >
                  {section.shortcuts.map((shortcut, idx) => (
                    <KeyboardShortcutRow
                      key={shortcut.id ?? `${shortcut.label}-${idx}`}
                      label={shortcut.label}
                      description={shortcut.description}
                    >
                      <KeyboardShortcutKeysDisplay
                        keys={shortcut.keys}
                        size={kbdSize}
                      />
                    </KeyboardShortcutRow>
                  ))}
                </KeyboardShortcutsSection>
              ))}
            </div>
          ) : (
            <div
              data-slot="keyboard-shortcuts-dialog-empty"
              className="flex items-center justify-center py-10 text-sm text-muted-foreground"
              role="status"
            >
              {emptyMessage}
            </div>
          )}
        </div>

        {footer ? (
          <div
            data-slot="keyboard-shortcuts-dialog-footer"
            className="border-t border-border bg-muted/30 px-6 py-3 text-xs text-muted-foreground"
          >
            {footer}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
KeyboardShortcutsDialog.displayName = "KeyboardShortcutsDialog";

export interface KeyboardShortcutsSectionProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  ref?: Ref<HTMLElement>;
}

function KeyboardShortcutsSection({
  title,
  description,
  className,
  children,
  ref,
  ...props
}: KeyboardShortcutsSectionProps): ReactElement {
  return (
    <section
      ref={ref}
      data-slot="keyboard-shortcuts-section"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <header className="flex flex-col gap-0.5">
        <h3
          data-slot="keyboard-shortcuts-section-title"
          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          {title}
        </h3>
        {description ? (
          <p
            data-slot="keyboard-shortcuts-section-description"
            className="text-xs text-muted-foreground/80"
          >
            {description}
          </p>
        ) : null}
      </header>
      <ul
        data-slot="keyboard-shortcuts-section-list"
        className="divide-y divide-border/70 overflow-hidden rounded-md border border-border bg-card"
      >
        {children}
      </ul>
    </section>
  );
}
KeyboardShortcutsSection.displayName = "KeyboardShortcutsSection";

export interface KeyboardShortcutRowProps
  extends HTMLAttributes<HTMLLIElement> {
  label: ReactNode;
  description?: ReactNode;
  ref?: Ref<HTMLLIElement>;
}

function KeyboardShortcutRow({
  label,
  description,
  className,
  children,
  ref,
  ...props
}: KeyboardShortcutRowProps): ReactElement {
  return (
    <li
      ref={ref}
      data-slot="keyboard-shortcut-row"
      className={cn(
        "flex items-center justify-between gap-4 bg-card px-3 py-2.5 text-sm text-foreground",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          data-slot="keyboard-shortcut-row-label"
          className="truncate leading-tight"
        >
          {label}
        </span>
        {description ? (
          <span
            data-slot="keyboard-shortcut-row-description"
            className="truncate text-xs text-muted-foreground"
          >
            {description}
          </span>
        ) : null}
      </div>
      <div
        data-slot="keyboard-shortcut-row-keys"
        className="flex shrink-0 items-center gap-2"
      >
        {children}
      </div>
    </li>
  );
}
KeyboardShortcutRow.displayName = "KeyboardShortcutRow";

export interface KeyboardShortcutKeysDisplayProps
  extends HTMLAttributes<HTMLSpanElement> {
  keys: KeyboardShortcutKeys;
  size?: KbdSize;
  /** Separator between keys in a combo. Defaults to "+". */
  keySeparator?: ReactNode;
  /** Separator between alternate combos. Defaults to "or". */
  comboSeparator?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

function KeyboardShortcutKeysDisplay({
  keys,
  size = "md",
  keySeparator = "+",
  comboSeparator = "or",
  className,
  ref,
  ...props
}: KeyboardShortcutKeysDisplayProps): ReactElement {
  const combos = normalizeKeyCombos(keys);

  return (
    <span
      ref={ref}
      data-slot="keyboard-shortcut-keys"
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      {combos.map((combo, comboIdx) => (
        <span key={comboIdx} className="inline-flex items-center gap-2">
          {comboIdx > 0 ? (
            <span
              aria-hidden="true"
              className="text-[10px] font-medium uppercase text-muted-foreground/70"
            >
              {comboSeparator}
            </span>
          ) : null}
          <KbdGroup size={size} separator={keySeparator}>
            {combo.map((key, keyIdx) => (
              <Kbd key={keyIdx} size={size}>
                {key}
              </Kbd>
            ))}
          </KbdGroup>
        </span>
      ))}
    </span>
  );
}
KeyboardShortcutKeysDisplay.displayName = "KeyboardShortcutKeysDisplay";

export {
  KeyboardShortcutsDialog,
  KeyboardShortcutsSection,
  KeyboardShortcutRow,
  KeyboardShortcutKeysDisplay,
};
