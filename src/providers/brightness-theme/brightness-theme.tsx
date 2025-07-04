"use client";

import {
  ThemeProvider as NextThemesProvider,
  useTheme as useBrightnessTheme,
} from "next-themes";

export type BrightnessThemeProviderProps = Parameters<
  typeof NextThemesProvider
>[0];

/**
 *
 * @param param0 Props for theme provider, a 'children' prop containing the app render tree
 * @see next-themes package
 * @returns Wraps an app with a provider that determines light/dark/system color theme
 */
export function BrightnessThemeProvider({
  children,
  ...props
}: BrightnessThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default BrightnessThemeProvider;

export { useBrightnessTheme };
