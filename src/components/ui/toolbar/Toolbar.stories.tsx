import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  Check,
  ChevronDown,
  Code,
  Copy,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Palette,
  Pilcrow,
  Quote,
  Redo,
  Save,
  Scissors,
  Strikethrough,
  Trash2,
  Type,
  Underline,
  Undo,
} from "lucide-react";

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarSpacer,
  ToolbarToggle,
  toolbarOrientationIds,
  toolbarSizeIds,
  toolbarVariantIds,
} from "./toolbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

const meta = {
  title: "Components/Toolbar",
  component: Toolbar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A composable action bar that follows the WAI-ARIA Toolbar Pattern. The root exposes `role=\"toolbar\"` with `aria-orientation`, and children are wired for roving-tabindex keyboard navigation (Arrow keys move focus, Home/End jump to the ends, Tab moves in/out of the toolbar as a single stop). Compose with `ToolbarButton`, `ToolbarToggle` (for pressed/latched buttons), `ToolbarLink`, `ToolbarGroup`, `ToolbarSeparator`, and `ToolbarSpacer`. `ToolbarButton` and `ToolbarToggle` both accept an `asChild` prop, so a `DropdownMenuTrigger asChild` / `PopoverTrigger asChild` / `TooltipTrigger asChild` can be grafted straight onto a toolbar item — see the *WithDropdownMenu* and *IconOnlySmall* (color picker Popover) stories. All colors are drawn from the @schemavaults/theme tokens (`bg-card`, `bg-muted`, `bg-primary`, `bg-destructive`, `text-foreground`, `border-border`, `ring-ring`) so the component tracks the active theme.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: { options: toolbarOrientationIds, control: { type: "radio" } },
    variant: { options: toolbarVariantIds, control: { type: "select" } },
    size: { options: toolbarSizeIds, control: { type: "radio" } },
    "aria-label": { control: { type: "text" } },
  },
  args: {
    orientation: "horizontal",
    variant: "default",
    size: "default",
    "aria-label": "Formatting",
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultDemo(): ReactElement {
  const [bold, setBold] = useState<boolean>(true);
  const [italic, setItalic] = useState<boolean>(false);
  const [underline, setUnderline] = useState<boolean>(false);
  const [align, setAlign] = useState<"left" | "center" | "right" | "justify">(
    "left",
  );
  return (
    <Toolbar aria-label="Text formatting" className="w-fit">
      <ToolbarGroup aria-label="Text style">
        <ToolbarToggle
          aria-label="Bold"
          pressed={bold}
          onPressedChange={setBold}
        >
          <Bold />
        </ToolbarToggle>
        <ToolbarToggle
          aria-label="Italic"
          pressed={italic}
          onPressedChange={setItalic}
        >
          <Italic />
        </ToolbarToggle>
        <ToolbarToggle
          aria-label="Underline"
          pressed={underline}
          onPressedChange={setUnderline}
        >
          <Underline />
        </ToolbarToggle>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Text alignment">
        <ToolbarToggle
          aria-label="Align left"
          pressed={align === "left"}
          onPressedChange={(): void => setAlign("left")}
        >
          <AlignLeft />
        </ToolbarToggle>
        <ToolbarToggle
          aria-label="Align center"
          pressed={align === "center"}
          onPressedChange={(): void => setAlign("center")}
        >
          <AlignCenter />
        </ToolbarToggle>
        <ToolbarToggle
          aria-label="Align right"
          pressed={align === "right"}
          onPressedChange={(): void => setAlign("right")}
        >
          <AlignRight />
        </ToolbarToggle>
        <ToolbarToggle
          aria-label="Justify"
          pressed={align === "justify"}
          onPressedChange={(): void => setAlign("justify")}
        >
          <AlignJustify />
        </ToolbarToggle>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert link">
        <LinkIcon />
      </ToolbarButton>
    </Toolbar>
  );
}

export const Default: Story = {
  render: (): ReactElement => <DefaultDemo />,
};

export const WithLabelsAndActions: Story = {
  render: (): ReactElement => (
    <Toolbar aria-label="Editor actions" className="w-fit">
      <ToolbarButton>
        <Save />
        Save
      </ToolbarButton>
      <ToolbarButton>
        <Copy />
        Copy
      </ToolbarButton>
      <ToolbarButton>
        <Scissors />
        Cut
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>
        <Undo />
        Undo
      </ToolbarButton>
      <ToolbarButton>
        <Redo />
        Redo
      </ToolbarButton>
      <ToolbarSpacer />
      <ToolbarButton variant="destructive">
        <Trash2 />
        Delete
      </ToolbarButton>
    </Toolbar>
  ),
};

const TEXT_COLORS = [
  { id: "default", label: "Default", swatch: "bg-foreground" },
  { id: "muted", label: "Muted", swatch: "bg-muted-foreground" },
  { id: "primary", label: "Primary", swatch: "bg-primary" },
  { id: "accent", label: "Accent", swatch: "bg-accent-foreground" },
  { id: "destructive", label: "Destructive", swatch: "bg-destructive" },
  { id: "warning", label: "Warning", swatch: "bg-warning" },
] as const;

function IconOnlyDemo(): ReactElement {
  const [pressed, setPressed] = useState<Set<string>>(
    () => new Set(["bold"]),
  );
  const [textColor, setTextColor] =
    useState<(typeof TEXT_COLORS)[number]["id"]>("default");
  const toggle = (id: string): void => {
    setPressed((prev): Set<string> => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const activeColor =
    TEXT_COLORS.find((c) => c.id === textColor) ?? TEXT_COLORS[0];
  return (
    <Toolbar aria-label="Rich text" size="sm" className="w-fit">
      <ToolbarToggle
        aria-label="Bold"
        pressed={pressed.has("bold")}
        onPressedChange={(): void => toggle("bold")}
      >
        <Bold />
      </ToolbarToggle>
      <ToolbarToggle
        aria-label="Italic"
        pressed={pressed.has("italic")}
        onPressedChange={(): void => toggle("italic")}
      >
        <Italic />
      </ToolbarToggle>
      <ToolbarToggle
        aria-label="Underline"
        pressed={pressed.has("underline")}
        onPressedChange={(): void => toggle("underline")}
      >
        <Underline />
      </ToolbarToggle>
      <ToolbarToggle
        aria-label="Strikethrough"
        pressed={pressed.has("strike")}
        onPressedChange={(): void => toggle("strike")}
      >
        <Strikethrough />
      </ToolbarToggle>
      <ToolbarSeparator />
      <ToolbarToggle
        aria-label="Bulleted list"
        pressed={pressed.has("ul")}
        onPressedChange={(): void => toggle("ul")}
      >
        <List />
      </ToolbarToggle>
      <ToolbarToggle
        aria-label="Numbered list"
        pressed={pressed.has("ol")}
        onPressedChange={(): void => toggle("ol")}
      >
        <ListOrdered />
      </ToolbarToggle>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert quote">
        <Quote />
      </ToolbarButton>
      <ToolbarButton aria-label="Insert inline code">
        <Code />
      </ToolbarButton>
      <ToolbarButton aria-label="Highlight color">
        <Highlighter />
      </ToolbarButton>
      <Popover>
        <PopoverTrigger asChild>
          <ToolbarButton
            aria-label={`Text color (current: ${activeColor.label})`}
          >
            <Palette />
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ring-1 ring-border ${activeColor.swatch}`}
            />
            <ChevronDown className="opacity-70" />
          </ToolbarButton>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-52 p-2">
          <p className="mb-1 px-1 text-xs font-medium text-muted-foreground">
            Text color
          </p>
          <div
            role="listbox"
            aria-label="Text color"
            className="grid grid-cols-3 gap-1"
          >
            {TEXT_COLORS.map((color) => {
              const selected = color.id === textColor;
              return (
                <button
                  key={color.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={(): void => setTextColor(color.id)}
                  className="flex flex-col items-center gap-1 rounded-md p-2 text-[10px] text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <span
                    className={`relative size-6 rounded-full ring-1 ring-border ${color.swatch}`}
                  >
                    {selected ? (
                      <Check
                        aria-hidden="true"
                        className="absolute inset-0 m-auto size-3.5 text-background mix-blend-difference"
                      />
                    ) : null}
                  </span>
                  {color.label}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </Toolbar>
  );
}

export const IconOnlySmall: Story = {
  render: (): ReactElement => <IconOnlyDemo />,
};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-4">
      {toolbarVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            variant = {variant}
          </span>
          <Toolbar aria-label={`Formatting (${variant})`} variant={variant}>
            <ToolbarToggle aria-label="Bold" pressed>
              <Bold />
            </ToolbarToggle>
            <ToolbarToggle aria-label="Italic">
              <Italic />
            </ToolbarToggle>
            <ToolbarToggle aria-label="Underline">
              <Underline />
            </ToolbarToggle>
            <ToolbarSeparator />
            <ToolbarButton>
              <Save />
              Save
            </ToolbarButton>
            <ToolbarButton variant="destructive">
              <Trash2 />
              Delete
            </ToolbarButton>
          </Toolbar>
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-4">
      {toolbarSizeIds.map((size) => (
        <div key={size} className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            size = {size}
          </span>
          <Toolbar aria-label={`Formatting (${size})`} size={size} className="w-fit">
            <ToolbarToggle aria-label="Bold" pressed>
              <Bold />
            </ToolbarToggle>
            <ToolbarToggle aria-label="Italic">
              <Italic />
            </ToolbarToggle>
            <ToolbarSeparator />
            <ToolbarButton>
              <Save />
              Save
            </ToolbarButton>
            <ToolbarButton variant="primary">
              <Copy />
              Copy
            </ToolbarButton>
          </Toolbar>
        </div>
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  render: (): ReactElement => (
    <Toolbar
      aria-label="Sidebar tools"
      orientation="vertical"
      className="w-fit"
    >
      <ToolbarButton aria-label="Bold">
        <Bold />
      </ToolbarButton>
      <ToolbarButton aria-label="Italic">
        <Italic />
      </ToolbarButton>
      <ToolbarButton aria-label="Underline">
        <Underline />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert link">
        <LinkIcon />
      </ToolbarButton>
      <ToolbarButton aria-label="Highlight">
        <Highlighter />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Delete" variant="destructive">
        <Trash2 />
      </ToolbarButton>
    </Toolbar>
  ),
};

export const WithLink: Story = {
  render: (): ReactElement => (
    <Toolbar aria-label="Page actions" className="w-fit">
      <ToolbarButton>
        <Save />
        Save
      </ToolbarButton>
      <ToolbarButton>
        <Copy />
        Duplicate
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarLink href="#" variant="primary">
        <LinkIcon />
        View docs
      </ToolbarLink>
    </Toolbar>
  ),
};

export const FloatingWithSpacer: Story = {
  parameters: { layout: "centered" },
  render: (): ReactElement => (
    <div className="flex h-64 w-[36rem] items-end justify-center rounded-lg border border-dashed border-border p-6">
      <Toolbar
        aria-label="Selection actions"
        variant="floating"
        className="w-full"
      >
        <span className="px-2 text-sm text-muted-foreground">
          3 items selected
        </span>
        <ToolbarSpacer />
        <ToolbarButton>
          <Copy />
          Copy
        </ToolbarButton>
        <ToolbarButton>
          <Save />
          Archive
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton variant="destructive">
          <Trash2 />
          Delete
        </ToolbarButton>
      </Toolbar>
    </div>
  ),
};

export const DisabledItems: Story = {
  render: (): ReactElement => (
    <Toolbar aria-label="Undo history" className="w-fit">
      <ToolbarButton disabled>
        <Undo />
        Undo
      </ToolbarButton>
      <ToolbarButton>
        <Redo />
        Redo
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton disabled>
        <Save />
        Save
      </ToolbarButton>
      <ToolbarButton>
        <Copy />
        Copy
      </ToolbarButton>
    </Toolbar>
  ),
};

const HEADING_LEVELS = [
  { id: "p", label: "Paragraph", icon: Pilcrow },
  { id: "h1", label: "Heading 1", icon: Heading1 },
  { id: "h2", label: "Heading 2", icon: Heading2 },
  { id: "h3", label: "Heading 3", icon: Heading3 },
] as const;

function WithDropdownMenuDemo(): ReactElement {
  const [level, setLevel] =
    useState<(typeof HEADING_LEVELS)[number]["id"]>("p");
  const active = HEADING_LEVELS.find((l) => l.id === level) ?? HEADING_LEVELS[0];
  const ActiveIcon = active.icon;
  return (
    <Toolbar aria-label="Editor" className="w-fit">
      {/* 1. A menu-button toolbar item — a `DropdownMenuTrigger asChild` grafted
             onto a `ToolbarButton`, so keyboard nav / theming / roving
             tabindex all still work. */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolbarButton aria-label={`Block style: ${active.label}`}>
            <ActiveIcon />
            <span className="min-w-16 text-left">{active.label}</span>
            <ChevronDown className="opacity-70" />
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Block style</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={level}
            onValueChange={(v): void =>
              setLevel(v as (typeof HEADING_LEVELS)[number]["id"])
            }
          >
            {HEADING_LEVELS.map((l) => {
              const Icon = l.icon;
              return (
                <DropdownMenuRadioItem key={l.id} value={l.id}>
                  <Icon className="mr-2 size-4" />
                  {l.label}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ToolbarSeparator />
      <ToolbarToggle aria-label="Bold" pressed>
        <Bold />
      </ToolbarToggle>
      <ToolbarToggle aria-label="Italic">
        <Italic />
      </ToolbarToggle>
      <ToolbarToggle aria-label="Underline">
        <Underline />
      </ToolbarToggle>
      <ToolbarSeparator />
      {/* 2. A trailing overflow menu — a common pattern when the toolbar
             has more actions than horizontal space. */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolbarButton aria-label="More actions">
            <ChevronDown />
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Baseline className="mr-2 size-4" />
            Baseline shift
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Type className="mr-2 size-4" />
            Font family…
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Highlighter className="mr-2 size-4" />
            Highlight
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 size-4" />
            Remove formatting
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Toolbar>
  );
}

export const WithDropdownMenu: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Hang a `DropdownMenu` off a `ToolbarButton` by wrapping the trigger with `DropdownMenuTrigger asChild`. Because `ToolbarButton` supports `asChild` (via Radix `Slot`), the trigger's click / keyboard / `aria-haspopup` / `aria-expanded` wiring is merged straight onto the toolbar button — no extra styling and no loss of roving-tabindex or theming. Two triggers are shown: a leading block-style menu using `DropdownMenuRadioGroup` for selection, and a trailing overflow menu for actions that don't fit.",
      },
    },
  },
  render: (): ReactElement => <WithDropdownMenuDemo />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const trigger = await waitFor((): HTMLButtonElement => {
      const el = canvas.getByRole("button", { name: /block style/i });
      if (!el) throw new Error("block-style trigger not rendered yet");
      return el as HTMLButtonElement;
    });

    // The dropdown wiring landed on the ToolbarButton via asChild.
    expect(trigger.getAttribute("data-slot")).toBe("toolbar-button");
    expect(trigger.getAttribute("data-toolbar-item")).toBe("");
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    // Open the menu with a click; the menu items should render in a
    // portal so we look for them at the document root.
    await userEvent.click(trigger);
    await waitFor((): void => {
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });
    const menuItems = await waitFor((): HTMLElement[] => {
      const items = Array.from(
        document.querySelectorAll<HTMLElement>('[role="menuitemradio"]'),
      );
      if (items.length === 0) throw new Error("menu items not rendered yet");
      return items;
    });
    expect(menuItems.length).toBe(HEADING_LEVELS.length);

    // Close again — the toolbar item's ARIA state should flip back.
    await userEvent.keyboard("{Escape}");
    await waitFor((): void => {
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });
  },
};

function KeyboardDemo(): ReactElement {
  return (
    <Toolbar aria-label="Keyboard navigation demo" className="w-fit">
      <ToolbarButton>One</ToolbarButton>
      <ToolbarButton disabled>Skipped</ToolbarButton>
      <ToolbarButton>Two</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>Three</ToolbarButton>
      <ToolbarButton>Four</ToolbarButton>
    </Toolbar>
  );
}

export const KeyboardNavigation: Story = {
  render: (): ReactElement => <KeyboardDemo />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const root = await waitFor((): HTMLElement => {
      const el = canvasElement.querySelector<HTMLElement>('[role="toolbar"]');
      if (el === null) throw new Error("toolbar not rendered yet");
      return el;
    });

    expect(root.getAttribute("aria-orientation")).toBe("horizontal");

    const buttons = canvas.getAllByRole("button");
    // 4 enabled buttons (one is disabled and skipped from focus rotation)
    expect(buttons.length).toBe(5);

    // Initial roving state: first enabled item is tabbable, rest are -1.
    await waitFor((): void => {
      expect(buttons[0].tabIndex).toBe(0);
    });
    expect(buttons[1].tabIndex).toBe(-1); // disabled
    expect(buttons[2].tabIndex).toBe(-1);
    expect(buttons[3].tabIndex).toBe(-1);
    expect(buttons[4].tabIndex).toBe(-1);

    // Focus the first enabled item and step through with ArrowRight.
    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);

    await userEvent.keyboard("{ArrowRight}");
    // Disabled button (index 1) must be skipped.
    expect(document.activeElement).toBe(buttons[2]);

    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(buttons[3]);

    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe(buttons[4]);

    // Wraps to the first enabled item.
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(buttons[0]);

    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(buttons[4]);

    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toBe(buttons[0]);

    // Only the currently focused item is tabbable (roving tabindex).
    expect(buttons[0].tabIndex).toBe(0);
    expect(buttons[2].tabIndex).toBe(-1);
    expect(buttons[3].tabIndex).toBe(-1);
    expect(buttons[4].tabIndex).toBe(-1);
  },
};

function TogglePlayDemo(): ReactElement {
  const [pressed, setPressed] = useState<boolean>(false);
  return (
    <Toolbar aria-label="Toggle test" className="w-fit">
      <ToolbarToggle
        aria-label="Bold"
        pressed={pressed}
        onPressedChange={setPressed}
      >
        <Bold />
      </ToolbarToggle>
    </Toolbar>
  );
}

export const TogglePress: Story = {
  render: (): ReactElement => <TogglePlayDemo />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const button = await waitFor((): HTMLButtonElement => {
      const el = canvas.getByRole("button", { name: /bold/i });
      if (!el) throw new Error("bold toggle not rendered yet");
      return el as HTMLButtonElement;
    });

    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.getAttribute("data-state")).toBe("off");

    await userEvent.click(button);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.getAttribute("data-state")).toBe("on");

    await userEvent.click(button);
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.getAttribute("data-state")).toBe("off");
  },
};
