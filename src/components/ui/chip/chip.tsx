"use client";

import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";
import {
  chipSizeIds,
  chipVariantIds,
  type ChipSize,
  type ChipVariant,
} from "./chip-variants";

const chipVariants = cva(
  "group/chip inline-flex items-center gap-1.5 rounded-full border font-medium align-middle whitespace-nowrap select-none transition-[background-color,border-color,color,box-shadow,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-secondary-foreground border-transparent data-[interactive=true]:hover:bg-secondary/80 data-[selected=true]:bg-foreground data-[selected=true]:text-background",
        primary:
          "bg-primary text-primary-foreground border-transparent data-[interactive=true]:hover:bg-primary/90 data-[selected=true]:ring-2 data-[selected=true]:ring-primary/40",
        secondary:
          "bg-muted text-muted-foreground border-transparent data-[interactive=true]:hover:bg-muted/70 data-[selected=true]:bg-foreground data-[selected=true]:text-background",
        destructive:
          "bg-destructive/15 text-destructive border-destructive/30 data-[interactive=true]:hover:bg-destructive/25 data-[selected=true]:bg-destructive data-[selected=true]:text-destructive-foreground data-[selected=true]:border-destructive",
        success:
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 data-[interactive=true]:hover:bg-emerald-500/25 data-[selected=true]:bg-emerald-600 data-[selected=true]:text-white data-[selected=true]:border-emerald-600",
        warning:
          "bg-warning/20 text-warning-foreground border-warning/40 data-[interactive=true]:hover:bg-warning/30 data-[selected=true]:bg-warning data-[selected=true]:text-warning-foreground data-[selected=true]:border-warning",
        outline:
          "bg-transparent text-foreground border-input data-[interactive=true]:hover:bg-accent data-[interactive=true]:hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[selected=true]:border-foreground/40",
      } satisfies Record<ChipVariant, string>,
      size: {
        sm: "h-6 px-2 text-xs [&_[data-slot=chip-leading]>svg]:size-3",
        default: "h-7 px-2.5 text-xs [&_[data-slot=chip-leading]>svg]:size-3",
        lg: "h-9 px-3 text-sm [&_[data-slot=chip-leading]>svg]:size-3.5",
      } satisfies Record<ChipSize, string>,
      disabled: {
        true: "opacity-50 pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      disabled: false,
    },
  },
);

const removeButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full -mr-0.5 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background hover:bg-foreground/10",
  {
    variants: {
      size: {
        sm: "size-3.5 [&>svg]:size-2.5",
        default: "size-4 [&>svg]:size-3",
        lg: "size-5 [&>svg]:size-3.5",
      } satisfies Record<ChipSize, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface ChipProps
  extends Omit<ComponentProps<"span">, "onClick">,
    VariantProps<typeof chipVariants> {
  /** Optional content rendered before the label (typically an icon or avatar). */
  leading?: ReactNode;
  /** When true, renders a dismiss (X) button and fires `onRemove` when activated. */
  removable?: boolean;
  /** Callback fired when the dismiss button is activated. */
  onRemove?: () => void;
  /** Optional accessible label for the dismiss button. */
  removeLabel?: string;
  /** Marks the chip as selected (used for filter-style chips). */
  selected?: boolean;
  /** Disables interaction and dims the chip. */
  disabled?: boolean;
  /** Click handler — when set the chip is rendered as a button-like interactive element. */
  onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
}

function Chip({
  ref,
  className,
  variant,
  size,
  leading,
  removable = false,
  onRemove,
  removeLabel = "Remove",
  selected = false,
  disabled = false,
  onClick,
  onKeyDown,
  children,
  role,
  tabIndex,
  ...props
}: ChipProps): ReactElement {
  const interactive = Boolean(onClick) && !disabled;

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>): void => {
    onKeyDown?.(event);
    if (!interactive || event.defaultPrevented) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(event as unknown as MouseEvent<HTMLSpanElement>);
    }
  };

  const handleRemoveClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    if (disabled) return;
    onRemove?.();
  };

  return (
    <span
      ref={ref}
      data-slot="chip"
      data-interactive={interactive}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      role={role ?? (interactive ? "button" : undefined)}
      tabIndex={tabIndex ?? (interactive ? 0 : undefined)}
      aria-pressed={interactive && selected ? true : undefined}
      aria-disabled={disabled || undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        chipVariants({ variant, size, disabled }),
        interactive && "cursor-pointer",
        className,
      )}
      {...props}
    >
      {leading != null && (
        <span
          aria-hidden="true"
          data-slot="chip-leading"
          className="inline-flex shrink-0 items-center justify-center"
        >
          {leading}
        </span>
      )}
      <span data-slot="chip-label" className="truncate">
        {children}
      </span>
      {removable && (
        <button
          type="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={removeLabel}
          data-slot="chip-remove"
          disabled={disabled}
          onClick={handleRemoveClick}
          className={cn(removeButtonVariants({ size }))}
        >
          <X aria-hidden="true" />
        </button>
      )}
    </span>
  );
}

Chip.displayName = "Chip";

export { Chip };

export { chipVariants, chipSizeIds, chipVariantIds };
export type { ChipSize, ChipVariant };

export default Chip;
