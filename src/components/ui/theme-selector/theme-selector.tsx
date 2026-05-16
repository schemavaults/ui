"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import {
  Suspense,
  use,
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

interface ThemeSelectorContentProps {
  size: ThemeSelectorSizeId;
  iconOnly: boolean;
  disabled: boolean;
  className?: string;
  rest: Omit<
    HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue" | "className"
  >;
}

function ThemeSelectorContent({
  size,
  iconOnly,
  disabled,
  className,
  rest,
}: ThemeSelectorContentProps): ReactElement {
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

function ThemeSelectorFallback({
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

export interface ThemeSelectorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Size of the underlying SegmentedControl. */
  size?: ThemeSelectorSizeId;
  /** Render only the icons, hiding the text labels. */
  iconOnly?: boolean;
  /** Disable interaction with every option. */
  disabled?: boolean;
}

/**
 * A brightness theme switcher driven by {@link useBrightnessTheme}, built on
 * top of the {@link SegmentedControl} component.
 *
 * Must be rendered inside a `<BrightnessThemeProvider />`. The theme-aware UI
 * is wrapped in a `<Suspense>` boundary that renders an inert, unselected
 * SegmentedControl fallback until the client has hydrated — this avoids the
 * next-themes server/client hydration mismatch without any mounted-flag state.
 *
 * @see BrightnessThemeProvider
 * @see useBrightnessTheme
 * @see SegmentedControl
 */
export function ThemeSelector({
  className,
  size = "default",
  iconOnly = false,
  disabled = false,
  ...rest
}: ThemeSelectorProps): ReactElement {
  return (
    <Suspense
      fallback={
        <ThemeSelectorFallback
          size={size}
          iconOnly={iconOnly}
          className={className}
        />
      }
    >
      <ThemeSelectorContent
        size={size}
        iconOnly={iconOnly}
        disabled={disabled}
        className={className}
        rest={rest}
      />
    </Suspense>
  );
}
ThemeSelector.displayName = "ThemeSelector";

export default ThemeSelector;
