"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";
import {
  SegmentedControl,
  SegmentedControlItem,
  type SegmentedControlSizeId,
} from "@/components/ui/segmented-control";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
] as const satisfies readonly SegmentedControlSizeId[];
export type ThemeSelectorSizeId = (typeof themeSelectorSizeIds)[number];

export const themeSelectorVariantIds = [
  "segmented",
  "compact",
] as const satisfies readonly string[];
export type ThemeSelectorVariantId = (typeof themeSelectorVariantIds)[number];

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

const themeOptionsById: Record<ThemeSelectorOptionId, ThemeSelectorOption> =
  themeOptions.reduce(
    (acc, option) => {
      acc[option.id] = option;
      return acc;
    },
    {} as Record<ThemeSelectorOptionId, ThemeSelectorOption>,
  );

const iconSizeBySize: Record<ThemeSelectorSizeId, string> = {
  sm: "h-3.5 w-3.5",
  default: "h-4 w-4",
  lg: "h-[1.125rem] w-[1.125rem]",
};

const compactButtonSizeClasses: Record<ThemeSelectorSizeId, string> = {
  sm: "h-8 w-8",
  default: "h-9 w-9",
  lg: "h-11 w-11",
};

function renderThemeItems(
  size: ThemeSelectorSizeId,
  iconOnly: boolean,
): ReactNode {
  return themeOptions.map((option): ReactElement => {
    const Icon = option.icon;
    return (
      <SegmentedControlItem
        key={option.id}
        value={option.id}
        aria-label={option.label}
      >
        <Icon className={cn(iconSizeBySize[size])} aria-hidden="true" />
        {iconOnly ? null : <span>{option.label}</span>}
      </SegmentedControlItem>
    );
  });
}

function isThemeSelectorOptionId(
  value: string | undefined,
): value is ThemeSelectorOptionId {
  return (
    value !== undefined &&
    (themeSelectorOptionIds as readonly string[]).includes(value)
  );
}

function useHasMounted(): boolean {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect((): void => {
    setMounted(true);
  }, []);
  return mounted;
}

const compactButtonClass =
  "inline-flex items-center justify-center rounded-md border border-input bg-background text-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

interface SegmentedThemeSelectorInnerProps {
  size: ThemeSelectorSizeId;
  iconOnly: boolean;
  disabled: boolean;
  className?: string;
  rest: Omit<
    HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue" | "className"
  >;
}

function SegmentedThemeSelector({
  size,
  iconOnly,
  disabled,
  className,
  rest,
}: SegmentedThemeSelectorInnerProps): ReactElement {
  const mounted = useHasMounted();
  const { theme, setTheme } = useBrightnessTheme();

  if (!mounted) {
    return (
      <SegmentedControl
        value=""
        variant="outline"
        size={size}
        disabled
        aria-hidden="true"
        className={className}
      >
        {renderThemeItems(size, iconOnly)}
      </SegmentedControl>
    );
  }

  return (
    <SegmentedControl
      value={theme ?? ""}
      onValueChange={setTheme}
      variant="outline"
      size={size}
      disabled={disabled}
      aria-label="Color theme"
      className={className}
      {...rest}
    >
      {renderThemeItems(size, iconOnly)}
    </SegmentedControl>
  );
}

interface CompactThemeSelectorInnerProps {
  size: ThemeSelectorSizeId;
  disabled: boolean;
  className?: string;
  rest: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onChange" | "defaultValue" | "className" | "onClick" | "type"
  >;
}

function CompactThemeSelector({
  size,
  disabled,
  className,
  rest,
}: CompactThemeSelectorInnerProps): ReactElement {
  const mounted = useHasMounted();
  const { theme, setTheme } = useBrightnessTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-hidden="true"
        tabIndex={-1}
        className={cn(
          compactButtonClass,
          compactButtonSizeClasses[size],
          className,
        )}
      >
        <Monitor className={cn(iconSizeBySize[size])} aria-hidden="true" />
      </button>
    );
  }

  const activeId: ThemeSelectorOptionId = isThemeSelectorOptionId(theme)
    ? theme
    : "system";
  const activeOption = themeOptionsById[activeId];
  const ActiveIcon = activeOption.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={`Color theme: ${activeOption.label}`}
          title={`Theme: ${activeOption.label}`}
          className={cn(
            compactButtonClass,
            compactButtonSizeClasses[size],
            className,
          )}
          {...rest}
        >
          <ActiveIcon
            className={cn(iconSizeBySize[size])}
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={activeId}
          onValueChange={(value: string): void => {
            if (isThemeSelectorOptionId(value)) {
              setTheme(value);
            }
          }}
        >
          {themeOptions.map((option): ReactElement => {
            const Icon = option.icon;
            return (
              <DropdownMenuRadioItem key={option.id} value={option.id}>
                <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>{option.label}</span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface ThemeSelectorProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange" | "defaultValue"> {
  /** Visual layout of the selector. Defaults to `"segmented"`. */
  variant?: ThemeSelectorVariantId;
  /** Size of the underlying control. */
  size?: ThemeSelectorSizeId;
  /**
   * Render only the icons, hiding the text labels. Has no effect when
   * `variant` is `"compact"` (the compact variant is always icon-only).
   */
  iconOnly?: boolean;
  /** Disable interaction with every option. */
  disabled?: boolean;
}

/**
 * A brightness theme switcher driven by {@link useBrightnessTheme}.
 *
 * Two visual variants are supported:
 * - `"segmented"` (default): a {@link SegmentedControl} with one item per
 *   available theme.
 * - `"compact"`: a single icon-only button that displays the currently active
 *   theme; clicking it opens a dropdown menu of available themes.
 *
 * Must be rendered inside a `<BrightnessThemeProvider />`. On the server (and
 * during the first client render) the component renders an inert disabled
 * control so that the SSR markup matches the initial client hydration, then
 * swaps to the real theme-aware UI in a `useEffect` after mount — this avoids
 * the next-themes server/client hydration mismatch without leaving an
 * unresolved Suspense boundary in the tree (which breaks static prerender).
 *
 * @see BrightnessThemeProvider
 * @see useBrightnessTheme
 * @see SegmentedControl
 */
export function ThemeSelector({
  className,
  variant = "segmented",
  size = "default",
  iconOnly = false,
  disabled = false,
  ...rest
}: ThemeSelectorProps): ReactElement {
  if (variant === "compact") {
    const buttonRest = rest as Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      "onChange" | "defaultValue" | "className" | "onClick" | "type"
    >;
    return (
      <CompactThemeSelector
        size={size}
        disabled={disabled}
        className={className}
        rest={buttonRest}
      />
    );
  }

  const divRest = rest as Omit<
    HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue" | "className"
  >;
  return (
    <SegmentedThemeSelector
      size={size}
      iconOnly={iconOnly}
      disabled={disabled}
      className={className}
      rest={divRest}
    />
  );
}
ThemeSelector.displayName = "ThemeSelector";

export default ThemeSelector;
