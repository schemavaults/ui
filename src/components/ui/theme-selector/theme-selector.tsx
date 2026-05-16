"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import {
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactElement,
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
 * Must be rendered inside a `<BrightnessThemeProvider />`. To avoid a
 * server/client hydration mismatch the active option is not highlighted until
 * the component has mounted on the client (the controlled value is held empty
 * until then so the SegmentedControl stays controlled throughout).
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
  ...props
}: ThemeSelectorProps): ReactElement {
  const { theme, setTheme } = useBrightnessTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SegmentedControl
      value={mounted ? (theme ?? "") : ""}
      onValueChange={setTheme}
      variant="outline"
      size={size}
      disabled={disabled}
      aria-label="Color theme"
      className={className}
      {...props}
    >
      {themeOptions.map((option): ReactElement => {
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
      })}
    </SegmentedControl>
  );
}
ThemeSelector.displayName = "ThemeSelector";

export default ThemeSelector;
