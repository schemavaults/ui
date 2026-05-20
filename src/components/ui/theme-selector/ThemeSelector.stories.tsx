import type { Meta, StoryObj } from "@storybook/react";
import { type ReactElement } from "react";

import {
  BrightnessThemeProvider,
  useBrightnessTheme,
} from "@/providers/brightness-theme";
import { ThemeSelector } from "./theme-selector";
import {
  themeSelectorSizeIds,
  themeSelectorVariantIds,
} from "./theme-selector";

/**
 * `ThemeSelector` reads and writes the active brightness theme through the
 * `useBrightnessTheme` hook, so every story is wrapped in a
 * `BrightnessThemeProvider` decorator. The provider stores the choice in
 * `localStorage` and toggles the `class` attribute on `<html>`, so the
 * selection persists across stories and page reloads.
 */
const meta = {
  title: "Theme/ThemeSelector",
  component: ThemeSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: themeSelectorVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: themeSelectorSizeIds,
      control: { type: "radio" },
    },
    iconOnly: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    variant: "segmented",
    size: "default",
    iconOnly: false,
    disabled: false,
  },
  decorators: [
    (Story): ReactElement => (
      <BrightnessThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Story />
      </BrightnessThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IconOnly: Story = {
  args: { iconOnly: true },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * The `"compact"` variant renders a single icon-only button that shows the
 * currently active theme (e.g. only the sun icon while in light mode).
 * Clicking it opens a dropdown menu listing every available theme; the active
 * theme is indicated with a radio-group check.
 */
export const Compact: Story = {
  args: { variant: "compact" },
};

export const CompactSmall: Story = {
  args: { variant: "compact", size: "sm" },
};

export const CompactLarge: Story = {
  args: { variant: "compact", size: "lg" },
};

export const CompactDisabled: Story = {
  args: { variant: "compact", disabled: true },
};

/**
 * Demonstrates consuming the re-exported `useBrightnessTheme` hook directly:
 * the panel below reflects the live state returned by the hook while the
 * `ThemeSelector` mutates it.
 */
function ThemeStatePanel(): ReactElement {
  const { theme, resolvedTheme, systemTheme, themes } = useBrightnessTheme();
  return (
    <div className="flex flex-col items-center gap-4">
      <ThemeSelector />
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-md border border-input bg-background p-4 text-sm">
        <dt className="text-muted-foreground">theme</dt>
        <dd className="font-medium text-foreground">{theme ?? "—"}</dd>
        <dt className="text-muted-foreground">resolvedTheme</dt>
        <dd className="font-medium text-foreground">{resolvedTheme ?? "—"}</dd>
        <dt className="text-muted-foreground">systemTheme</dt>
        <dd className="font-medium text-foreground">{systemTheme ?? "—"}</dd>
        <dt className="text-muted-foreground">themes</dt>
        <dd className="font-medium text-foreground">{themes.join(", ")}</dd>
      </dl>
    </div>
  );
}

export const WithHookState: Story = {
  render: (): ReactElement => <ThemeStatePanel />,
};
