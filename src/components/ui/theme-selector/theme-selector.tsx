"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import {
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactElement,
} from "react";

import { cn } from "@/lib/utils";
import { useBrightnessTheme } from "@/providers/brightness-theme";

export const themeSelectorOptionIds = [
  "light",
  "system",
  "dark",
] as const satisfies readonly string[];
export type ThemeSelectorOptionId = (typeof themeSelectorOptionIds)[number];

export const themeSelectorSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type ThemeSelectorSizeId = (typeof themeSelectorSizeIds)[number];

export const themeSelectorVariants = cva(
  "inline-flex items-center gap-1 rounded-lg border border-input bg-background p-1 text-muted-foreground",
  {
    variants: {
      size: {
        sm: "h-8",
        default: "h-9",
        lg: "h-11",
      } satisfies Record<ThemeSelectorSizeId, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export const themeSelectorItemVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 aria-[checked=true]:bg-accent aria-[checked=true]:text-accent-foreground cursor-pointer",
  {
    variants: {
      size: {
        sm: "h-6 px-2 text-xs",
        default: "h-7 px-2.5 text-sm",
        lg: "h-9 px-3 text-base",
      } satisfies Record<ThemeSelectorSizeId, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface ThemeSelectorOption {
  id: ThemeSelectorOptionId;
  label: string;
  icon: LucideIcon;
}

const themeOptions: readonly ThemeSelectorOption[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "system", label: "System", icon: Monitor },
  { id: "dark", label: "Dark", icon: Moon },
] as const;

const iconSizeBySize: Record<ThemeSelectorSizeId, string> = {
  sm: "h-3.5 w-3.5",
  default: "h-4 w-4",
  lg: "h-[1.125rem] w-[1.125rem]",
};

export interface ThemeSelectorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof themeSelectorVariants> {
  /** Render only the icons, hiding the text labels. */
  iconOnly?: boolean;
  /** Disable interaction with every option. */
  disabled?: boolean;
}

/**
 * A brightness theme switcher driven by {@link useBrightnessTheme}.
 *
 * Must be rendered inside a `<BrightnessThemeProvider />`. To avoid a
 * server/client hydration mismatch the active option is not highlighted until
 * the component has mounted on the client.
 *
 * @see BrightnessThemeProvider
 * @see useBrightnessTheme
 */
export function ThemeSelector({
  className,
  size,
  iconOnly = false,
  disabled = false,
  ...props
}: ThemeSelectorProps): ReactElement {
  const { theme, setTheme } = useBrightnessTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedSize: ThemeSelectorSizeId = size ?? "default";

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      aria-disabled={disabled || undefined}
      className={cn(themeSelectorVariants({ size }), className)}
      {...props}
    >
      {themeOptions.map((option): ReactElement => {
        const Icon = option.icon;
        const isActive = mounted && theme === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={option.label}
            disabled={disabled}
            onClick={(): void => setTheme(option.id)}
            className={cn(themeSelectorItemVariants({ size }))}
          >
            <Icon
              className={cn(iconSizeBySize[resolvedSize])}
              aria-hidden="true"
            />
            {iconOnly ? null : <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
ThemeSelector.displayName = "ThemeSelector";

export default ThemeSelector;
