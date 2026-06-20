"use client";

import {
  useCallback,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export const multiSelectVariantIds = [
  "default",
  "outline",
  "ghost",
] as const satisfies readonly string[];
export type MultiSelectVariantId = (typeof multiSelectVariantIds)[number];

export const multiSelectSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type MultiSelectSizeId = (typeof multiSelectSizeIds)[number];

export const multiSelectBadgeVariantIds = [
  "default",
  "secondary",
  "outline",
  "destructive",
] as const satisfies readonly string[];
export type MultiSelectBadgeVariantId =
  (typeof multiSelectBadgeVariantIds)[number];

export const multiSelectTriggerVariants = cva(
  "group/trigger inline-flex min-h-10 items-center justify-between gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[placeholder=true]:text-muted-foreground",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost:
          "border border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground",
      } satisfies Record<MultiSelectVariantId, string>,
      size: {
        sm: "min-h-8 px-2 py-1 text-xs",
        default: "min-h-10 px-3 py-1.5 text-sm",
        lg: "min-h-11 px-4 py-2 text-base",
      } satisfies Record<MultiSelectSizeId, string>,
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  },
);

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  keywords?: readonly string[];
  disabled?: boolean;
  icon?: ReactNode;
}

export interface MultiSelectProps
  extends Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      "value" | "defaultValue" | "onChange"
    >,
    VariantProps<typeof multiSelectTriggerVariants> {
  options: readonly MultiSelectOption[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: readonly string[]) => void;
  placeholder?: ReactNode;
  searchPlaceholder?: string;
  emptyMessage?: ReactNode;
  contentClassName?: string;
  triggerClassName?: string;
  badgeClassName?: string;
  badgeVariant?: MultiSelectBadgeVariantId;
  /** Maximum number of selected items rendered as badges before a +N overflow chip. */
  maxDisplay?: number;
  /** Maximum number of items the user may select. Further selections become no-ops. */
  maxSelected?: number;
  clearable?: boolean;
  disabled?: boolean;
  /** Close the popover after each selection. Defaults to false (multi-pick mode). */
  closeOnSelect?: boolean;
  align?: "start" | "center" | "end";
  ref?: Ref<HTMLButtonElement>;
}

function arraysHaveSameValues(
  a: readonly string[],
  b: readonly string[],
): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  for (const value of b) {
    if (!set.has(value)) return false;
  }
  return true;
}

export function MultiSelect({
  options,
  value: controlledValue,
  defaultValue,
  onValueChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  variant,
  size,
  fullWidth,
  contentClassName,
  triggerClassName,
  badgeClassName,
  badgeVariant = "secondary",
  className,
  maxDisplay,
  maxSelected,
  clearable = false,
  disabled = false,
  closeOnSelect = false,
  align = "start",
  ref,
  ...buttonProps
}: MultiSelectProps): ReactElement {
  const reactId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState<readonly string[]>(
    defaultValue ?? [],
  );
  const [open, setOpen] = useState<boolean>(false);

  const isControlled = controlledValue !== undefined;
  const selectedValues = isControlled
    ? controlledValue
    : uncontrolledValue;

  const selectedSet = useMemo(
    () => new Set(selectedValues),
    [selectedValues],
  );

  const selectedOptions = useMemo(
    () =>
      selectedValues
        .map((selectedValue) =>
          options.find((option) => option.value === selectedValue),
        )
        .filter((option): option is MultiSelectOption => option !== undefined),
    [options, selectedValues],
  );

  const commitValue = useCallback(
    (next: readonly string[]): void => {
      if (arraysHaveSameValues(next, selectedValues)) return;
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange, selectedValues],
  );

  const handleToggle = useCallback(
    (next: string): void => {
      const isSelected = selectedSet.has(next);
      let nextValues: readonly string[];
      if (isSelected) {
        nextValues = selectedValues.filter((v) => v !== next);
      } else {
        if (
          maxSelected !== undefined &&
          selectedValues.length >= maxSelected
        ) {
          return;
        }
        nextValues = [...selectedValues, next];
      }
      commitValue(nextValues);
      if (closeOnSelect) {
        setOpen(false);
      }
    },
    [closeOnSelect, commitValue, maxSelected, selectedSet, selectedValues],
  );

  const handleClearAll = useCallback(
    (event?: ReactMouseEvent<HTMLElement>): void => {
      event?.stopPropagation();
      event?.preventDefault();
      commitValue([]);
    },
    [commitValue],
  );

  const handleRemoveBadge = useCallback(
    (event: ReactMouseEvent<HTMLElement>, optionValue: string): void => {
      event.stopPropagation();
      event.preventDefault();
      commitValue(selectedValues.filter((v) => v !== optionValue));
    },
    [commitValue, selectedValues],
  );

  const visibleSelected = useMemo(() => {
    if (maxDisplay === undefined) return selectedOptions;
    return selectedOptions.slice(0, maxDisplay);
  }, [maxDisplay, selectedOptions]);

  const overflowCount = useMemo(() => {
    if (maxDisplay === undefined) return 0;
    return Math.max(0, selectedOptions.length - maxDisplay);
  }, [maxDisplay, selectedOptions.length]);

  const showClearControl =
    clearable && !disabled && selectedValues.length > 0;

  const isLimitReached =
    maxSelected !== undefined && selectedValues.length >= maxSelected;

  const hasSelection = selectedValues.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={`${reactId}-listbox`}
          data-placeholder={hasSelection ? "false" : "true"}
          disabled={disabled}
          className={cn(
            multiSelectTriggerVariants({ variant, size, fullWidth }),
            triggerClassName,
            className,
          )}
          {...buttonProps}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1 text-left">
            {hasSelection ? (
              <>
                {visibleSelected.map((option) => (
                  <Badge
                    key={option.value}
                    variant={badgeVariant}
                    className={cn(
                      "max-w-full gap-1 pr-1",
                      badgeClassName,
                    )}
                  >
                    {option.icon ? (
                      <span
                        className="inline-flex shrink-0 items-center"
                        aria-hidden="true"
                      >
                        {option.icon}
                      </span>
                    ) : null}
                    <span className="truncate">{option.label}</span>
                    {!disabled ? (
                      <span
                        role="button"
                        tabIndex={-1}
                        aria-label={`Remove ${option.label}`}
                        onClick={(event): void =>
                          handleRemoveBadge(event, option.value)
                        }
                        onPointerDown={(event): void => {
                          event.stopPropagation();
                        }}
                        onKeyDown={(event): void => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            event.stopPropagation();
                            handleRemoveBadge(
                              event as unknown as ReactMouseEvent<HTMLElement>,
                              option.value,
                            );
                          }
                        }}
                        className="-mr-0.5 ml-0.5 inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </span>
                    ) : null}
                  </Badge>
                ))}
                {overflowCount > 0 ? (
                  <Badge
                    variant="outline"
                    className={cn("font-medium", badgeClassName)}
                  >
                    +{overflowCount} more
                  </Badge>
                ) : null}
              </>
            ) : (
              <span className="truncate text-muted-foreground">
                {placeholder}
              </span>
            )}
          </span>
          <span className="ml-2 flex shrink-0 items-center gap-1">
            {showClearControl ? (
              <span
                role="button"
                tabIndex={-1}
                aria-label="Clear all selected"
                onClick={handleClearAll}
                onPointerDown={(event): void => {
                  event.stopPropagation();
                }}
                onKeyDown={(event): void => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    handleClearAll();
                  }
                }}
                className="inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </span>
            ) : null}
            <ChevronsUpDown
              className="h-4 w-4 opacity-50"
              aria-hidden="true"
            />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn(
          "w-[var(--radix-popover-trigger-width)] min-w-[12rem] p-0",
          contentClassName,
        )}
      >
        <Command id={`${reactId}-listbox`}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {showClearControl ? (
              <>
                <CommandGroup>
                  <CommandItem
                    value="__multi_select_clear__"
                    keywords={["clear", "reset", "none"]}
                    onSelect={(): void => {
                      handleClearAll();
                    }}
                    className="cursor-pointer gap-2 text-muted-foreground"
                  >
                    <X className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Clear selection</span>
                    <span className="ml-auto text-xs">
                      {selectedValues.length}
                    </span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
              </>
            ) : null}
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedSet.has(option.value);
                const keywords: string[] = [
                  option.label,
                  ...(option.keywords ?? []),
                ];
                const itemDisabled =
                  option.disabled || (!isSelected && isLimitReached);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={keywords}
                    disabled={itemDisabled}
                    onSelect={(currentValue): void => {
                      handleToggle(currentValue);
                    }}
                    className="cursor-pointer gap-2"
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-transparent",
                      )}
                      aria-hidden="true"
                    >
                      <Check
                        className={cn(
                          "h-3 w-3",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </span>
                    {option.icon ? (
                      <span
                        className="inline-flex shrink-0 items-center"
                        aria-hidden="true"
                      >
                        {option.icon}
                      </span>
                    ) : null}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{option.label}</span>
                      {option.description ? (
                        <span className="truncate text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      ) : null}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {maxSelected !== undefined ? (
              <div className="border-t px-3 py-1.5 text-xs text-muted-foreground">
                {selectedValues.length} / {maxSelected} selected
              </div>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
MultiSelect.displayName = "MultiSelect";
