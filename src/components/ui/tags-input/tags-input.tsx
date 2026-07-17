"use client";

import {
  useCallback,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Chip, type ChipSize } from "@/components/ui/chip/chip";
import { type ChipVariant } from "@/components/ui/chip/chip-variants";
import { tagsInputSizeIds, type TagsInputSize } from "./tags-input-variants";

const tagsInputContainerVariants = cva(
  "group/tags-input flex w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background text-sm ring-offset-background transition-[border-color,box-shadow] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 has-[input:focus-visible]:outline-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[invalid=true]:border-destructive data-[invalid=true]:focus-within:ring-destructive",
  {
    variants: {
      size: {
        sm: "min-h-8 p-1 [&_input]:h-6 [&_input]:text-xs",
        default: "min-h-10 p-1.5 [&_input]:h-7 [&_input]:text-sm",
        lg: "min-h-12 p-2 [&_input]:h-8 [&_input]:text-base",
      } satisfies Record<TagsInputSize, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const sizeToChipSize: Record<TagsInputSize, ChipSize> = {
  sm: "sm",
  default: "default",
  lg: "lg",
};

export type TagsInputValidator = (
  tag: string,
  existing: readonly string[],
) => boolean;

export interface TagsInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "size" | "onChange"
  > {
  /** Ref exposing the imperative `TagsInputHandle` (focus/clear). */
  ref?: Ref<TagsInputHandle>;
  /** Controlled list of tags. Provide alongside `onValueChange`. */
  value?: readonly string[];
  /** Initial tags for uncontrolled usage. */
  defaultValue?: readonly string[];
  /** Fires whenever the tag list changes (add or remove). */
  onValueChange?: (tags: string[]) => void;
  /** Fires when a tag is added — runs after `onValueChange`. */
  onTagAdd?: (tag: string) => void;
  /** Fires when a tag is removed — runs after `onValueChange`. */
  onTagRemove?: (tag: string) => void;
  /** Visual size of the input shell and chips. */
  size?: TagsInputSize;
  /** Visual variant applied to each chip — see `ChipVariant`. */
  chipVariant?: ChipVariant;
  /** Optional leading slot rendered inside each chip (typically an icon). */
  chipLeading?: ReactNode;
  /**
   * Keys that commit the current draft as a tag.
   * Defaults to `["Enter", ","]`.
   */
  delimiters?: readonly string[];
  /** Maximum number of tags allowed. Further additions are ignored. */
  maxTags?: number;
  /**
   * Whether duplicate tags are permitted. Comparison is case-insensitive
   * and trim-aware. Defaults to `false`.
   */
  allowDuplicates?: boolean;
  /** Trim whitespace around tags before adding. Defaults to `true`. */
  trim?: boolean;
  /** When true, dims the field and disables interaction. */
  disabled?: boolean;
  /** Renders the field in an error state and sets `aria-invalid`. */
  invalid?: boolean;
  /** Optional accessible label applied to the underlying input. */
  ariaLabel?: string;
  /** Custom validator — return `false` to reject a tag before it's added. */
  validate?: TagsInputValidator;
  /** Class merged onto the wrapper element. */
  className?: string;
  /** Class merged onto the underlying `<input>`. */
  inputClassName?: string;
  /** Render-prop override for the chip element. */
  renderTag?: (args: {
    tag: string;
    index: number;
    remove: () => void;
  }) => ReactNode;
}

export interface TagsInputHandle {
  /** Imperative focus on the underlying input. */
  focus: () => void;
  /** Programmatically clear all tags (also clears the draft). */
  clear: () => void;
}

function defaultValidator(
  tag: string,
  existing: readonly string[],
): boolean {
  if (tag.length === 0) return false;
  const lower = tag.toLowerCase();
  return !existing.some((t) => t.toLowerCase() === lower);
}

function TagsInput({
  ref,
  value,
  defaultValue,
  onValueChange,
  onTagAdd,
  onTagRemove,
  size = "default",
  chipVariant = "secondary",
  chipLeading,
  delimiters = ["Enter", ","],
  maxTags,
  allowDuplicates = false,
  trim = true,
  disabled = false,
  invalid = false,
  placeholder,
  ariaLabel,
  validate,
  className,
  inputClassName,
  renderTag,
  id,
  name,
  onKeyDown,
  onPaste,
  onFocus,
  onBlur,
  ...inputProps
}: TagsInputProps): ReactElement {
  const isControlled = value !== undefined;
  const [internalTags, setInternalTags] = useState<string[]>(() =>
    defaultValue ? [...defaultValue] : [],
  );
  const tags: readonly string[] = isControlled ? value : internalTags;

  const [draft, setDraft] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const reactId = useId();
  const inputId = id ?? `tags-input-${reactId}`;

  const commitTags = useCallback(
    (next: string[]): void => {
      if (!isControlled) setInternalTags(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  useImperativeHandle(
    ref,
    () => ({
      focus: (): void => inputRef.current?.focus(),
      clear: (): void => {
        commitTags([]);
        setDraft("");
      },
    }),
    [commitTags],
  );

  const isAcceptable = useCallback(
    (candidate: string, existing: readonly string[]): boolean => {
      if (candidate.length === 0) return false;
      if (!allowDuplicates && !defaultValidator(candidate, existing)) {
        return false;
      }
      if (validate && !validate(candidate, existing)) {
        return false;
      }
      return true;
    },
    [allowDuplicates, validate],
  );

  const addTags = useCallback(
    (rawCandidates: readonly string[]): void => {
      if (disabled) return;
      const cleaned = rawCandidates
        .map((c) => (trim ? c.trim() : c))
        .filter((c) => c.length > 0);
      if (cleaned.length === 0) return;

      const next = [...tags];
      const added: string[] = [];
      for (const candidate of cleaned) {
        if (maxTags !== undefined && next.length >= maxTags) break;
        if (!isAcceptable(candidate, next)) continue;
        next.push(candidate);
        added.push(candidate);
      }
      if (added.length === 0) return;
      commitTags(next);
      for (const tag of added) onTagAdd?.(tag);
    },
    [commitTags, disabled, isAcceptable, maxTags, onTagAdd, tags, trim],
  );

  const removeTagAt = useCallback(
    (index: number): void => {
      if (disabled) return;
      if (index < 0 || index >= tags.length) return;
      const removed = tags[index]!;
      const next = tags.filter((_, i) => i !== index);
      commitTags(next);
      onTagRemove?.(removed);
    },
    [commitTags, disabled, onTagRemove, tags],
  );

  const delimiterSet = useMemo(() => new Set(delimiters), [delimiters]);
  const hasCommaDelimiter = useMemo(
    () => delimiters.includes(","),
    [delimiters],
  );

  const splitOnDelimiters = useCallback(
    (raw: string): string[] => {
      if (!hasCommaDelimiter && !delimiters.includes(";")) return [raw];
      const pattern = delimiters.includes(";") ? /[,;\n]/ : /[,\n]/;
      return raw.split(pattern);
    },
    [delimiters, hasCommaDelimiter],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;

    if (delimiterSet.has(event.key)) {
      event.preventDefault();
      const candidate = trim ? draft.trim() : draft;
      if (candidate.length === 0) return;
      addTags([candidate]);
      setDraft("");
      return;
    }

    if (event.key === "Backspace" && draft.length === 0 && tags.length > 0) {
      event.preventDefault();
      removeTagAt(tags.length - 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>): void => {
    onPaste?.(event);
    if (event.defaultPrevented || disabled) return;
    if (!hasCommaDelimiter && !delimiters.includes(";")) return;
    const pasted = event.clipboardData.getData("text");
    if (!/[,;\n]/.test(pasted)) return;
    event.preventDefault();
    const parts = splitOnDelimiters(pasted);
    addTags(parts);
    setDraft("");
  };

  return (
    <div
      data-slot="tags-input"
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      aria-disabled={disabled || undefined}
      role="group"
      className={cn(tagsInputContainerVariants({ size }), className)}
    >
      {tags.map((tag, index) => {
        const remove = (): void => removeTagAt(index);
        if (renderTag) {
          return (
            <span key={`${tag}-${index}`} data-slot="tags-input-tag">
              {renderTag({ tag, index, remove })}
            </span>
          );
        }
        return (
          <Chip
            key={`${tag}-${index}`}
            size={sizeToChipSize[size]}
            variant={chipVariant}
            removable={!disabled}
            onRemove={remove}
            disabled={disabled}
            leading={chipLeading}
            data-slot="tags-input-tag"
            removeLabel={`Remove ${tag}`}
          >
            {tag}
          </Chip>
        );
      })}
      <input
        {...inputProps}
        ref={inputRef}
        id={inputId}
        name={name}
        type="text"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={tags.length === 0 ? placeholder : undefined}
        className={cn(
          "min-w-24 flex-1 bg-transparent px-2 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
          inputClassName,
        )}
      />
    </div>
  );
}

TagsInput.displayName = "TagsInput";

export { TagsInput };

export { tagsInputContainerVariants, tagsInputSizeIds };
export type { TagsInputSize };

export default TagsInput;
