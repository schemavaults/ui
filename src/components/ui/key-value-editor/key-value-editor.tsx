"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cva } from "class-variance-authority";
import { Eye, EyeOff, Lock, LockOpen, Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { parseDotenv, toEnvVarName } from "./parse-dotenv";
import {
  keyValueEditorKeyFormatIds,
  keyValueEditorSizeIds,
  type KeyValueEditorKeyFormat,
  type KeyValueEditorSize,
} from "./key-value-editor-variants";

const keyValueEditorInputVariants = cva(
  "w-full min-w-0 rounded-md border border-input bg-background px-3 ring-offset-background transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted/40 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive",
  {
    variants: {
      size: {
        sm: "h-8 text-xs",
        default: "h-10 text-sm",
        lg: "h-12 text-base",
      } satisfies Record<KeyValueEditorSize, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const keyValueEditorIconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-md text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      size: {
        sm: "size-8",
        default: "size-10",
        lg: "size-12",
      } satisfies Record<KeyValueEditorSize, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface KeyValueEntry {
  key: string;
  value: string;
  /** Marks the value as sensitive: it is masked until revealed. */
  secret?: boolean;
}

export interface KeyValueEditorProps {
  /** Controlled list of entries. Provide alongside `onValueChange`. */
  value?: readonly KeyValueEntry[];
  /** Initial entries for uncontrolled usage. */
  defaultValue?: readonly KeyValueEntry[];
  /** Fires whenever any entry is added, removed or edited. */
  onValueChange?: (entries: KeyValueEntry[]) => void;
  /** Visual size of the row inputs and buttons. */
  size?: KeyValueEditorSize;
  /** How keys are normalised as they are typed. Defaults to `none`. */
  keyFormat?: KeyValueEditorKeyFormat;
  /**
   * Keys that don't match are flagged invalid. Empty keys are never
   * checked against it.
   */
  keyPattern?: RegExp;
  /** Message shown under a key that fails `keyPattern`. */
  keyPatternMessage?: string;
  /** Flag rows whose key repeats an earlier row's key. Defaults to `true`. */
  validateDuplicates?: boolean;
  /** Show a per-row toggle for marking a value secret. Defaults to `false`. */
  allowSecrets?: boolean;
  /**
   * Split pasted `.env` text (`KEY=value` lines) into rows when it is
   * pasted into a key field. Defaults to `true`.
   */
  parseDotenvOnPaste?: boolean;
  /** Maximum number of rows. The add button disables at the cap. */
  maxRows?: number;
  /** Header label above the key column. Defaults to `"Key"`. */
  keyLabel?: string;
  /** Header label above the value column. Defaults to `"Value"`. */
  valueLabel?: string;
  /** Hide the column header row. */
  hideHeader?: boolean;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  /** Label for the add-row button. Defaults to `"Add row"`. */
  addLabel?: string;
  /** Rendered in place of the rows when there are none. */
  emptyState?: ReactNode;
  /** Dims the editor and disables every control. */
  disabled?: boolean;
  /** Shows entries without letting them be changed. */
  readOnly?: boolean;
  /** Accessible name for the editor group. */
  ariaLabel?: string;
  /** Form field name; each row submits `name[i][key]` / `name[i][value]`. */
  name?: string;
  className?: string;
}

interface RowIssue {
  message: string;
}

// Header spacers line the column labels up with the row action buttons.
const actionSpacerClass: Record<KeyValueEditorSize, string> = {
  sm: "w-8 shrink-0",
  default: "w-10 shrink-0",
  lg: "w-12 shrink-0",
};

let rowIdCounter = 0;
function nextRowId(): string {
  rowIdCounter += 1;
  return `kv-row-${rowIdCounter}`;
}

function syncRowIds(ids: string[], length: number): string[] {
  if (ids.length === length) return ids;
  if (ids.length > length) return ids.slice(0, length);
  const next = [...ids];
  while (next.length < length) next.push(nextRowId());
  return next;
}

function KeyValueEditor({
  value,
  defaultValue,
  onValueChange,
  size = "default",
  keyFormat = "none",
  keyPattern,
  keyPatternMessage = "Invalid key",
  validateDuplicates = true,
  allowSecrets = false,
  parseDotenvOnPaste = true,
  maxRows,
  keyLabel = "Key",
  valueLabel = "Value",
  hideHeader = false,
  keyPlaceholder = "KEY",
  valuePlaceholder = "value",
  addLabel = "Add row",
  emptyState,
  disabled = false,
  readOnly = false,
  ariaLabel,
  name,
  className,
}: KeyValueEditorProps): ReactElement {
  const isControlled = value !== undefined;
  const [internalEntries, setInternalEntries] = useState<KeyValueEntry[]>(() =>
    defaultValue ? defaultValue.map((e) => ({ ...e })) : [],
  );
  const entries: readonly KeyValueEntry[] = isControlled
    ? value
    : internalEntries;

  // Stable React keys per row, kept parallel to `entries`. Mutations below
  // splice this array in step with the entries; an external length change
  // (controlled mode) pads or trims it.
  const rowIdsRef = useRef<string[]>([]);
  rowIdsRef.current = syncRowIds(rowIdsRef.current, entries.length);
  const rowIds = rowIdsRef.current;

  const [revealed, setRevealed] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const keyInputRefs = useRef(new Map<string, HTMLInputElement>());
  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);
  const reactId = useId();
  const editable = !disabled && !readOnly;
  const atCap = maxRows !== undefined && entries.length >= maxRows;

  useEffect(() => {
    if (pendingFocusId === null) return;
    keyInputRefs.current.get(pendingFocusId)?.focus();
    setPendingFocusId(null);
  }, [pendingFocusId]);

  const commit = useCallback(
    (next: KeyValueEntry[], nextIds: string[]): void => {
      rowIdsRef.current = nextIds;
      if (!isControlled) setInternalEntries(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const formatKey = useCallback(
    (raw: string): string => (keyFormat === "env" ? toEnvVarName(raw) : raw),
    [keyFormat],
  );

  const updateEntry = (index: number, patch: Partial<KeyValueEntry>): void => {
    const next = entries.map((entry, i) =>
      i === index ? { ...entry, ...patch } : entry,
    );
    commit(next, rowIds);
  };

  const insertEntries = (
    at: number,
    inserted: KeyValueEntry[],
    replaceCount = 0,
  ): string[] => {
    const room =
      maxRows === undefined
        ? inserted.length
        : Math.max(0, maxRows - entries.length + replaceCount);
    const accepted = inserted.slice(0, room);
    const newIds = accepted.map(() => nextRowId());
    const next = [...entries];
    next.splice(at, replaceCount, ...accepted);
    const nextIds = [...rowIds];
    nextIds.splice(at, replaceCount, ...newIds);
    commit(next, nextIds);
    return newIds;
  };

  const addRow = (): void => {
    if (!editable || atCap) return;
    const [id] = insertEntries(entries.length, [{ key: "", value: "" }]);
    if (id) setPendingFocusId(id);
  };

  const removeRow = (index: number): void => {
    if (!editable) return;
    const nextIds = rowIds.filter((_, i) => i !== index);
    commit(
      entries.filter((_, i) => i !== index),
      nextIds,
    );
    const focusId = nextIds[Math.min(index, nextIds.length - 1)];
    if (focusId) setPendingFocusId(focusId);
  };

  const toggleRevealed = (id: string): void => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleKeyPaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ): void => {
    if (!parseDotenvOnPaste || !editable) return;
    const text = event.clipboardData.getData("text");
    if (!text.includes("=")) return;
    const parsed = parseDotenv(text);
    if (parsed.length === 0) return;
    event.preventDefault();
    const current = entries[index];
    const replaceCurrent =
      current !== undefined &&
      current.key.length === 0 &&
      current.value.length === 0;
    insertEntries(
      replaceCurrent ? index : index + 1,
      parsed.map((p) => ({ key: formatKey(p.key), value: p.value })),
      replaceCurrent ? 1 : 0,
    );
  };

  const handleValueKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key !== "Enter" || !editable) return;
    event.preventDefault();
    if (index === entries.length - 1) {
      addRow();
      return;
    }
    const nextId = rowIds[index + 1];
    if (nextId) keyInputRefs.current.get(nextId)?.focus();
  };

  const issues = useMemo((): (RowIssue | null)[] => {
    const seen = new Set<string>();
    return entries.map((entry): RowIssue | null => {
      const key = entry.key.trim();
      if (key.length === 0) {
        return entry.value.length > 0 ? { message: "Key is required" } : null;
      }
      if (validateDuplicates && seen.has(key)) {
        return { message: `Duplicate key "${key}"` };
      }
      seen.add(key);
      if (keyPattern && !keyPattern.test(key)) {
        return { message: keyPatternMessage };
      }
      return null;
    });
  }, [entries, keyPattern, keyPatternMessage, validateDuplicates]);

  const keyHeaderId = `${reactId}-key-header`;
  const valueHeaderId = `${reactId}-value-header`;
  const actionCount =
    (allowSecrets ? 1 : 0) +
    (allowSecrets && !readOnly ? 1 : 0) +
    (editable ? 1 : 0);
  const iconButtonClass = keyValueEditorIconButtonVariants({ size });

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      data-slot="key-value-editor"
      data-disabled={disabled || undefined}
      className={cn(
        "flex w-full flex-col gap-2 text-sm data-[disabled=true]:opacity-60",
        className,
      )}
    >
      {!hideHeader && entries.length > 0 && (
        <div
          aria-hidden
          data-slot="key-value-editor-header"
          className="flex items-center gap-2 px-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          <span id={keyHeaderId} className="flex-1 basis-0">
            {keyLabel}
          </span>
          <span id={valueHeaderId} className="flex-[1.5] basis-0">
            {valueLabel}
          </span>
          <span className="flex shrink-0 gap-0.5">
            {Array.from({ length: actionCount }, (_, i) => (
              <span key={i} className={actionSpacerClass[size]} />
            ))}
          </span>
        </div>
      )}

      {entries.length === 0 && (
        <div
          data-slot="key-value-editor-empty"
          className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground"
        >
          {emptyState ?? "No entries yet."}
        </div>
      )}

      <ul className="flex flex-col gap-2" data-slot="key-value-editor-rows">
        {entries.map((entry, index) => {
          const id = rowIds[index]!;
          const issue = issues[index];
          const issueId = issue ? `${reactId}-${id}-issue` : undefined;
          const isSecret = allowSecrets && entry.secret === true;
          const isRevealed = revealed.has(id);
          const rowLabel = entry.key.trim() || `row ${index + 1}`;
          return (
            <li
              key={id}
              data-slot="key-value-editor-row"
              data-invalid={issue ? true : undefined}
              className="flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={(el): void => {
                    if (el) keyInputRefs.current.set(id, el);
                    else keyInputRefs.current.delete(id);
                  }}
                  type="text"
                  name={name ? `${name}[${index}][key]` : undefined}
                  value={entry.key}
                  placeholder={keyPlaceholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label={`${keyLabel} ${index + 1}`}
                  aria-invalid={issue ? true : undefined}
                  aria-describedby={issueId}
                  onChange={(e): void =>
                    updateEntry(index, { key: formatKey(e.target.value) })
                  }
                  onPaste={(e): void => handleKeyPaste(index, e)}
                  className={cn(
                    keyValueEditorInputVariants({ size }),
                    "flex-1 basis-0 font-mono",
                  )}
                />
                <input
                  type={isSecret && !isRevealed ? "password" : "text"}
                  name={name ? `${name}[${index}][value]` : undefined}
                  value={entry.value}
                  placeholder={valuePlaceholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label={`${valueLabel} for ${rowLabel}`}
                  onChange={(e): void =>
                    updateEntry(index, { value: e.target.value })
                  }
                  onKeyDown={(e): void => handleValueKeyDown(index, e)}
                  className={cn(
                    keyValueEditorInputVariants({ size }),
                    "flex-[1.5] basis-0 font-mono",
                  )}
                />
                {actionCount > 0 && (
                  <div className="flex shrink-0 items-center gap-0.5">
                    {allowSecrets && (
                      <button
                        type="button"
                        disabled={disabled || (readOnly && !isSecret)}
                        aria-pressed={readOnly ? undefined : isSecret}
                        aria-label={
                          readOnly
                            ? isRevealed
                              ? `Hide value of ${rowLabel}`
                              : `Reveal value of ${rowLabel}`
                            : isSecret
                              ? `Mark ${rowLabel} as not secret`
                              : `Mark ${rowLabel} as secret`
                        }
                        title={isSecret ? "Secret" : "Not secret"}
                        onClick={(): void => {
                          if (readOnly) {
                            toggleRevealed(id);
                            return;
                          }
                          updateEntry(index, { secret: !isSecret });
                        }}
                        className={cn(
                          iconButtonClass,
                          isSecret && "text-primary",
                          readOnly && !isSecret && "invisible",
                        )}
                      >
                        {readOnly ? (
                          isRevealed ? (
                            <EyeOff />
                          ) : (
                            <Eye />
                          )
                        ) : isSecret ? (
                          <Lock />
                        ) : (
                          <LockOpen />
                        )}
                      </button>
                    )}
                    {allowSecrets && !readOnly && (
                      <button
                        type="button"
                        disabled={disabled || !isSecret}
                        aria-label={
                          isRevealed
                            ? `Hide value of ${rowLabel}`
                            : `Reveal value of ${rowLabel}`
                        }
                        aria-hidden={!isSecret || undefined}
                        tabIndex={isSecret ? undefined : -1}
                        onClick={(): void => toggleRevealed(id)}
                        className={cn(
                          iconButtonClass,
                          !isSecret && "invisible",
                        )}
                      >
                        {isRevealed ? <EyeOff /> : <Eye />}
                      </button>
                    )}
                    {editable && (
                      <button
                        type="button"
                        aria-label={`Remove ${rowLabel}`}
                        onClick={(): void => removeRow(index)}
                        className={cn(
                          iconButtonClass,
                          "hover:bg-destructive/10 hover:text-destructive",
                        )}
                      >
                        <Trash2 />
                      </button>
                    )}
                  </div>
                )}
              </div>
              {issue && (
                <p
                  id={issueId}
                  role="alert"
                  className="px-0.5 text-xs font-medium text-destructive"
                >
                  {issue.message}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {editable && (
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={addRow}
            disabled={atCap}
            data-slot="key-value-editor-add"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-dashed border-input px-3 text-sm font-medium text-muted-foreground ring-offset-background transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4"
          >
            <Plus aria-hidden />
            {addLabel}
          </button>
          {maxRows !== undefined && (
            <span
              className="text-xs tabular-nums text-muted-foreground"
              aria-live="polite"
            >
              {entries.length} / {maxRows}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

KeyValueEditor.displayName = "KeyValueEditor";

export { KeyValueEditor };

export {
  keyValueEditorInputVariants,
  keyValueEditorIconButtonVariants,
  keyValueEditorKeyFormatIds,
  keyValueEditorSizeIds,
};
export type { KeyValueEditorKeyFormat, KeyValueEditorSize };

export default KeyValueEditor;
