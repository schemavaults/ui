import type { Decorator, Preview } from "@storybook/react";
import { useEffect, type ReactElement } from "react";
import {
  BrightnessThemeProvider,
  useBrightnessTheme,
} from "../src/providers/brightness-theme";

import "@schemavaults/theme/globals.css";

type BrightnessTheme = "light" | "dark" | "system";

const THEME_GLOBAL = "theme";
const DEFAULT_THEME: BrightnessTheme = "system";

/**
 * Syncs the Storybook toolbar theme selection into the next-themes provider.
 * Rendered inside BrightnessThemeProvider so it can call setTheme().
 */
function ThemeSync({ theme }: { theme: BrightnessTheme }): null {
  const { setTheme } = useBrightnessTheme();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return null;
}

const withBrightnessTheme: Decorator = (Story, context): ReactElement => {
  const theme =
    (context.globals[THEME_GLOBAL] as BrightnessTheme | undefined) ??
    DEFAULT_THEME;

  return (
    <BrightnessThemeProvider
      attribute="class"
      defaultTheme={DEFAULT_THEME}
      enableSystem
      disableTransitionOnChange
    >
      <ThemeSync theme={theme} />
      <Story />
    </BrightnessThemeProvider>
  );
};

const preview: Preview = {
  decorators: [withBrightnessTheme],
  globalTypes: {
    [THEME_GLOBAL]: {
      description: "Brightness theme applied to the rendered components",
      defaultValue: DEFAULT_THEME,
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
          { value: "system", title: "System", icon: "browser" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
