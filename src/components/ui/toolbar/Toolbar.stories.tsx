import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Copy,
  Highlighter,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Palette,
  Quote,
  Redo,
  Save,
  Scissors,
  Strikethrough,
  Trash2,
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

const meta = {
  title: "Components/Toolbar",
  component: Toolbar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A composable action bar that follows the WAI-ARIA Toolbar Pattern. The root exposes `role=\"toolbar\"` with `aria-orientation`, and children are wired for roving-tabindex keyboard navigation (Arrow keys move focus, Home/End jump to the ends, Tab moves in/out of the toolbar as a single stop). Compose with `ToolbarButton`, `ToolbarToggle` (for pressed/latched buttons), `ToolbarLink`, `ToolbarGroup`, `ToolbarSeparator`, and `ToolbarSpacer`. All colors are drawn from the @schemavaults/theme tokens (`bg-card`, `bg-muted`, `bg-primary`, `bg-destructive`, `text-foreground`, `border-border`, `ring-ring`) so the component tracks the active theme.",
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

function IconOnlyDemo(): ReactElement {
  const [pressed, setPressed] = useState<Set<string>>(
    () => new Set(["bold"]),
  );
  const toggle = (id: string): void => {
    setPressed((prev): Set<string> => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
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
      <ToolbarButton aria-label="Text color">
        <Palette />
        <ChevronDown className="opacity-70" />
      </ToolbarButton>
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
