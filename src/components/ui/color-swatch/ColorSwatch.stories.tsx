import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState, type ReactElement } from "react";

import { ColorSwatch, ColorSwatchGroup } from "./color-swatch";
import {
  colorSwatchShapeIds,
  colorSwatchSizeIds,
  colorSwatchVariantIds,
} from "./color-swatch-variants";

const meta = {
  title: "Components/ColorSwatch",
  component: ColorSwatch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays a single color sample. Useful for theme pickers, palette previews, and inline color metadata. Accepts any CSS color (hex, rgb, hsl, named, or `hsl(var(--primary))` for theme tokens). When given an `onClick` handler the swatch becomes a keyboard-focusable button; when `selected` is true it shows a contrast-aware check icon.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { options: colorSwatchSizeIds, control: { type: "radio" } },
    shape: { options: colorSwatchShapeIds, control: { type: "radio" } },
    variant: { options: colorSwatchVariantIds, control: { type: "radio" } },
    color: { control: { type: "color" } },
    selected: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    label: { control: { type: "text" } },
    hideSelectedIcon: { control: { type: "boolean" } },
  },
  args: {
    color: "#7c3aed",
    label: "Indigo",
    size: "default",
    shape: "circle",
    variant: "default",
    selected: false,
    disabled: false,
    hideSelectedIcon: false,
  },
} satisfies Meta<typeof ColorSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    selected: true,
    color: "#10b981",
    label: "Emerald",
  },
};

export const Clickable: Story = {
  args: {
    onClick: fn(),
    color: "#f97316",
    label: "Orange",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onClick: fn(),
    color: "#3b82f6",
    label: "Blue (disabled)",
  },
};

export const LightColor: Story = {
  args: {
    color: "#fef3c7",
    label: "Amber 100 — light backgrounds use a dark check icon",
    selected: true,
  },
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex items-center gap-4">
      {colorSwatchSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <ColorSwatch size={size} color="#7c3aed" label={`Indigo ${size}`} />
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {size}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const AllShapes: Story = {
  render: (): ReactElement => (
    <div className="flex items-center gap-4">
      {colorSwatchShapeIds.map((shape) => (
        <div key={shape} className="flex flex-col items-center gap-2">
          <ColorSwatch
            shape={shape}
            size="lg"
            color="#0ea5e9"
            label={`Sky ${shape}`}
          />
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {shape}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="flex items-center gap-4">
      {colorSwatchVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <ColorSwatch
            variant={variant}
            size="lg"
            color="#ffffff"
            label={`White ${variant}`}
          />
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {variant}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const ThemeTokens: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-3">
      <p className="max-w-md text-sm text-muted-foreground">
        Swatches can render any CSS color, including
        <code className="mx-1 rounded bg-muted px-1 font-mono text-xs">
          hsl(var(--primary))
        </code>
        — so they automatically follow{" "}
        <code className="mx-1 rounded bg-muted px-1 font-mono text-xs">
          @schemavaults/theme
        </code>{" "}
        light/dark mode.
      </p>
      <ColorSwatchGroup label="Theme tokens" gap="default">
        {(
          [
            ["primary", "hsl(var(--primary))"],
            ["secondary", "hsl(var(--secondary))"],
            ["accent", "hsl(var(--accent))"],
            ["muted", "hsl(var(--muted))"],
            ["destructive", "hsl(var(--destructive))"],
            ["warning", "var(--warning)"],
            ["brand-blue", "var(--schemavaults-brand-blue)"],
            ["brand-red", "var(--schemavaults-brand-red)"],
          ] as const
        ).map(([name, color]) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <ColorSwatch size="lg" color={color} label={name} />
            <span className="font-mono text-[10px] text-muted-foreground">
              {name}
            </span>
          </div>
        ))}
      </ColorSwatchGroup>
    </div>
  ),
};

const PALETTE = [
  { name: "Slate", color: "#475569" },
  { name: "Indigo", color: "#6366f1" },
  { name: "Violet", color: "#7c3aed" },
  { name: "Pink", color: "#ec4899" },
  { name: "Rose", color: "#f43f5e" },
  { name: "Orange", color: "#f97316" },
  { name: "Amber", color: "#f59e0b" },
  { name: "Emerald", color: "#10b981" },
  { name: "Teal", color: "#14b8a6" },
  { name: "Sky", color: "#0ea5e9" },
] as const;

function SinglePickerExample(): ReactElement {
  const [selected, setSelected] = useState<string>(PALETTE[2].color);
  const selectedName =
    PALETTE.find((p) => p.color === selected)?.name ?? "Custom";

  return (
    <div className="flex w-80 flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">Accent color</span>
        <span className="text-xs text-muted-foreground">{selectedName}</span>
      </div>
      <ColorSwatchGroup label="Accent color">
        {PALETTE.map(({ name, color }) => (
          <ColorSwatch
            key={color}
            color={color}
            label={name}
            size="lg"
            selected={selected === color}
            onClick={() => setSelected(color)}
          />
        ))}
      </ColorSwatchGroup>
      <p className="text-xs text-muted-foreground">
        Try keyboard navigation:{" "}
        <kbd className="rounded bg-muted px-1 font-mono text-[10px]">Tab</kbd>{" "}
        to focus, then{" "}
        <kbd className="rounded bg-muted px-1 font-mono text-[10px]">Enter</kbd>{" "}
        or{" "}
        <kbd className="rounded bg-muted px-1 font-mono text-[10px]">Space</kbd>{" "}
        to select.
      </p>
    </div>
  );
}

export const SingleSelectPicker: Story = {
  render: (): ReactElement => <SinglePickerExample />,
};

function MultiPickerExample(): ReactElement {
  const [selected, setSelected] = useState<Set<string>>(
    new Set([PALETTE[1].color, PALETTE[7].color]),
  );

  function toggle(color: string): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(color)) {
        next.delete(color);
      } else {
        next.add(color);
      }
      return next;
    });
  }

  return (
    <div className="flex w-96 flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <span className="text-sm font-medium">Palette tags</span>
      <ColorSwatchGroup label="Palette tags" gap="loose">
        {PALETTE.map(({ name, color }) => (
          <ColorSwatch
            key={color}
            color={color}
            label={name}
            shape="rounded"
            size="lg"
            selected={selected.has(color)}
            onClick={() => toggle(color)}
          />
        ))}
      </ColorSwatchGroup>
      <p className="text-xs text-muted-foreground">
        Selected:{" "}
        <span className="font-mono font-medium text-foreground">
          {selected.size === 0
            ? "(none)"
            : Array.from(selected)
                .map((c) => PALETTE.find((p) => p.color === c)?.name ?? c)
                .join(", ")}
        </span>
      </p>
    </div>
  );
}

export const MultiSelectPicker: Story = {
  render: (): ReactElement => <MultiPickerExample />,
};

export const InlineMetadata: Story = {
  render: (): ReactElement => (
    <ul className="w-80 divide-y divide-border rounded-lg border border-border bg-card text-sm text-card-foreground">
      {[
        { label: "Production", color: "#10b981" },
        { label: "Staging", color: "#f59e0b" },
        { label: "Preview", color: "#0ea5e9" },
        { label: "Archived", color: "#64748b" },
      ].map(({ label, color }) => (
        <li key={label} className="flex items-center gap-3 px-4 py-3">
          <ColorSwatch size="sm" color={color} label={label} />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  ),
};
