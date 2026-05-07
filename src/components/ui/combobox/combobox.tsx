"use client";

import {
  useCallback,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type Ref,
  type ReactElement,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
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

export const comboboxVariantIds = [
  "default",
  "outline",
  "ghost",
] as const satisfies readonly string[];
export type ComboboxVariantId = (typeof comboboxVariantIds)[number];

export const comboboxSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type ComboboxSizeId = (typeof comboboxSizeIds)[number];

export const comboboxTriggerVariants = cva(
  "inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[placeholder=true]:text-muted-foreground",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost:
          "border border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground",
      } satisfies Record<ComboboxVariantId, string>,
      size: {
        sm: "h-8 px-2.5 text-xs",
        default: "h-10 px-3 text-sm",
        lg: "h-11 px-4 text-base",
      } satisfies Record<ComboboxSizeId, string>,
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

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  keywords?: readonly string[];
  disabled?: boolean;
  icon?: ReactNode;
}

export interface ComboboxProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange">,
    VariantProps<typeof comboboxTriggerVariants> {
  options: readonly ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: ReactNode;
  searchPlaceholder?: string;
  emptyMessage?: ReactNode;
  contentClassName?: string;
  triggerClassName?: string;
  clearable?: boolean;
  disabled?: boolean;
  align?: "start" | "center" | "end";
  ref?: Ref<HTMLButtonElement>;
}

export function Combobox({
  options,
  value: controlledValue,
  defaultValue,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  variant,
  size,
  fullWidth,
  contentClassName,
  triggerClassName,
  className,
  clearable = false,
  disabled = false,
  align = "start",
  ref,
  ...buttonProps
}: ComboboxProps): ReactElement {
  const reactId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(defaultValue);
  const [open, setOpen] = useState<boolean>(false);

  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : uncontrolledValue;

  const selectedOption = useMemo(
    () =>
      selectedValue !== undefined && selectedValue !== ""
        ? options.find((option) => option.value === selectedValue)
        : undefined,
    [options, selectedValue],
  );

  const commitValue = useCallback(
    (next: string): void => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const handleSelect = useCallback(
    (next: string): void => {
      commitValue(next);
      setOpen(false);
    },
    [commitValue],
  );

  const handleClear = useCallback((): void => {
    commitValue("");
    setOpen(false);
  }, [commitValue]);

  const showClear =
    clearable && !disabled && selectedOption !== undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${reactId}-listbox`}
          data-placeholder={selectedOption === undefined ? "true" : "false"}
          disabled={disabled}
          className={cn(
            comboboxTriggerVariants({ variant, size, fullWidth }),
            triggerClassName,
            className,
          )}
          {...buttonProps}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-left">
            {selectedOption ? (
              <>
                {selectedOption.icon ? (
                  <span
                    className="inline-flex shrink-0 items-center"
                    aria-hidden="true"
                  >
                    {selectedOption.icon}
                  </span>
                ) : null}
                <span className="truncate">{selectedOption.label}</span>
              </>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
            aria-hidden="true"
          />
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
            {showClear ? (
              <>
                <CommandGroup>
                  <CommandItem
                    value="__combobox_clear__"
                    keywords={["clear", "reset", "none"]}
                    onSelect={(): void => {
                      handleClear();
                    }}
                    className="cursor-pointer gap-2 text-muted-foreground"
                  >
                    <X className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Clear selection</span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
              </>
            ) : null}
            <CommandGroup>
              {options.map((option) => {
                const isSelected = option.value === selectedValue;
                const keywords: string[] = [
                  option.label,
                  ...(option.keywords ?? []),
                ];
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={keywords}
                    disabled={option.disabled}
                    onSelect={(currentValue): void => {
                      handleSelect(
                        currentValue === selectedValue ? "" : currentValue,
                      );
                    }}
                    className="cursor-pointer gap-2"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden="true"
                    />
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
Combobox.displayName = "Combobox";
