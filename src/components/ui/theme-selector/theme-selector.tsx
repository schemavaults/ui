"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import {
  Suspense,
  use,
  useCallback,
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

function getNextThemeId(
  current: ThemeSelectorOptionId,
): ThemeSelectorOptionId {
  const index = themeSelectorOptionIds.indexOf(current);
  return themeSelectorOptionIds[
    (index + 1) % themeSelectorOptionIds.length
  ] as ThemeSelectorOptionId;
}

/**
 * A promise used to suspend {@link ThemeSelector} until the app has hydrated on
 * the client. On the server it never settles, so React renders the Suspense
 * fallback into the SSR output (and the client hydrates that same fallback,
 * avoiding the next-themes server/client mismatch). On the client it resolves
 * once, on the macrotask after the first render, after which the real
 * theme-aware UI takes over. The single cached promise is shared by every
 * instance so the gate only opens once per page.
 */
let hydrationPromise: Promise<void> | null = null;

function getHydrationPromise(): Promise<void> {
  if (typeof window === "undefined") {
    return new Promise<void>(() => {});
  }
  if (!hydrationPromise) {
    hydrationPromise = new Promise<void>((resolve) => {
      setTimeout(resolve);
    });
  }
  return hydrationPromise;
}

interface SegmentedThemeSelectorContentProps {
  size: ThemeSelectorSizeId;
  iconOnly: boolean;
  disabled: boolean;
  className?: string;
  rest: Omit<
    HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue" | "className"
  >;
}

function SegmentedThemeSelectorContent({
  size,
  iconOnly,
  disabled,
  className,
  rest,
}: SegmentedThemeSelectorContentProps): ReactElement {
  use(getHydrationPromise());
  const { theme, setTheme } = useBrightnessTheme();
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

function SegmentedThemeSelectorFallback({
  size,
  iconOnly,
  className,
}: {
  size: ThemeSelectorSizeId;
  iconOnly: boolean;
  className?: string;
}): ReactElement {
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

const compactButtonClass =
  "inline-flex items-center justify-center rounded-md border border-input bg-background text-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

interface CompactThemeSelectorContentProps {
  size: ThemeSelectorSizeId;
  disabled: boolean;
  className?: string;
  rest: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onChange" | "defaultValue" | "className" | "onClick" | "type"
  >;
}

function CompactThemeSelectorContent({
  size,
  disabled,
  className,
  rest,
}: CompactThemeSelectorContentProps): ReactElement {
  use(getHydrationPromise());
  const { theme, setTheme } = useBrightnessTheme();
  const activeId: ThemeSelectorOptionId = isThemeSelectorOptionId(theme)
    ? theme
    : "system";
  const activeOption = themeOptionsById[activeId];
  const ActiveIcon = activeOption.icon;
  const nextId = getNextThemeId(activeId);
  const nextLabel = themeOptionsById[nextId].label;

  const handleClick = useCallback((): void => {
    setTheme(nextId);
  }, [setTheme, nextId]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={`Color theme: ${activeOption.label}. Click to switch to ${nextLabel}.`}
      title={`Theme: ${activeOption.label}`}
      className={cn(
        compactButtonClass,
        compactButtonSizeClasses[size],
        className,
      )}
      {...rest}
    >
      <ActiveIcon className={cn(iconSizeBySize[size])} aria-hidden="true" />
    </button>
  );
}

function CompactThemeSelectorFallback({
  size,
  className,
}: {
  size: ThemeSelectorSizeId;
  className?: string;
}): ReactElement {
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
 *   theme and cycles to the next theme on click.
 *
 * Must be rendered inside a `<BrightnessThemeProvider />`. The theme-aware UI
 * is wrapped in a `<Suspense>` boundary that renders an inert fallback until
 * the client has hydrated — this avoids the next-themes server/client
 * hydration mismatch without any mounted-flag state.
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
      <Suspense
        fallback={
          <CompactThemeSelectorFallback size={size} className={className} />
        }
      >
        <CompactThemeSelectorContent
          size={size}
          disabled={disabled}
          className={className}
          rest={buttonRest}
        />
      </Suspense>
    );
  }

  const divRest = rest as Omit<
    HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue" | "className"
  >;
  return (
    <Suspense
      fallback={
        <SegmentedThemeSelectorFallback
          size={size}
          iconOnly={iconOnly}
          className={className}
        />
      }
    >
      <SegmentedThemeSelectorContent
        size={size}
        iconOnly={iconOnly}
        disabled={disabled}
        className={className}
        rest={divRest}
      />
    </Suspense>
  );
}
ThemeSelector.displayName = "ThemeSelector";

export default ThemeSelector;
