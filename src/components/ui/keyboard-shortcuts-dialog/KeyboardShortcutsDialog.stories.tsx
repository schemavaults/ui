import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../button/button";
import { Kbd, KbdGroup } from "../kbd/kbd";
import {
  KeyboardShortcutKeysDisplay,
  KeyboardShortcutRow,
  KeyboardShortcutsDialog,
  KeyboardShortcutsSection,
  keyboardShortcutsDialogSizeIds,
  type KeyboardShortcutSection,
} from "./keyboard-shortcuts-dialog";

const defaultSections: readonly KeyboardShortcutSection[] = [
  {
    title: "General",
    shortcuts: [
      {
        label: "Open command palette",
        keys: ["⌘", "K"],
        description: "Jump to any page or action",
        keywords: ["palette", "search"],
      },
      {
        label: "Open keyboard shortcuts",
        keys: ["?"],
      },
      {
        label: "Toggle theme",
        keys: ["⌘", "Shift", "T"],
      },
      {
        label: "Log out",
        keys: ["⌘", "Shift", "Q"],
      },
    ],
  },
  {
    title: "Navigation",
    description: "Jump between the main sections of the app.",
    shortcuts: [
      {
        label: "Go to dashboard",
        keys: [["g", "d"]],
      },
      {
        label: "Go to schemas",
        keys: [["g", "s"]],
      },
      {
        label: "Go to vaults",
        keys: [["g", "v"]],
      },
      {
        label: "Go to inbox",
        keys: [["g", "i"]],
      },
      {
        label: "Back",
        keys: [["⌘", "["], ["Alt", "←"]],
      },
      {
        label: "Forward",
        keys: [["⌘", "]"], ["Alt", "→"]],
      },
    ],
  },
  {
    title: "Editing",
    shortcuts: [
      {
        label: "Save current schema",
        keys: ["⌘", "S"],
      },
      {
        label: "Undo",
        keys: ["⌘", "Z"],
      },
      {
        label: "Redo",
        keys: ["⌘", "Shift", "Z"],
      },
      {
        label: "Duplicate line",
        keys: ["⌘", "Shift", "D"],
      },
      {
        label: "Comment / uncomment",
        keys: ["⌘", "/"],
      },
    ],
  },
  {
    title: "Selection",
    shortcuts: [
      {
        label: "Select all",
        keys: ["⌘", "A"],
      },
      {
        label: "Expand selection",
        keys: ["⌘", "Shift", "→"],
      },
      {
        label: "Shrink selection",
        keys: ["⌘", "Shift", "←"],
      },
    ],
  },
];

const meta = {
  title: "Components/KeyboardShortcutsDialog",
  component: KeyboardShortcutsDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A modal that lists the available keyboard shortcuts, organised into sections. Combines the existing [`Dialog`](?path=/docs/components-dialog--docs) and [`Kbd`](?path=/docs/components-kbd--docs) primitives so shortcut hints stay visually consistent with hints rendered inline elsewhere. Includes an optional live search that filters by shortcut label, description, keywords, or the keys themselves. Each combo accepts a single key list (`['⌘', 'K']`) or a list of alternates (`[['⌘', 'K'], ['Ctrl', 'K']]`). All colours resolve to `@schemavaults/theme` tokens (`bg-card`, `text-foreground`, `border-border`, `bg-muted`, `ring`) so the dialog tracks the active theme in both light and dark mode.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: keyboardShortcutsDialogSizeIds,
      control: { type: "radio" },
    },
    searchable: { control: { type: "boolean" } },
    searchPlaceholder: { control: { type: "text" } },
    title: { control: { type: "text" } },
    description: { control: { type: "text" } },
  },
  args: {
    sections: defaultSections,
    searchable: true,
    size: "md",
    title: "Keyboard shortcuts",
    description: "Press ? at any time to reopen this dialog.",
    defaultOpen: true,
  },
} satisfies Meta<typeof KeyboardShortcutsDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTriggerButton: Story = {
  args: {
    defaultOpen: false,
    trigger: <Button>Show keyboard shortcuts</Button>,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass any element as `trigger`; it's rendered inside a `DialogTrigger asChild` so click-to-open works without extra wiring.",
      },
    },
  },
};

export const NoSearch: Story = {
  name: "Without search",
  args: {
    searchable: false,
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const WithFooter: Story = {
  args: {
    footer: (
      <div className="flex items-center justify-between gap-2">
        <span>Close this dialog</span>
        <Kbd size="sm">Esc</Kbd>
      </div>
    ),
  },
};

export const SinglePlatform: Story = {
  name: "Single platform (macOS)",
  args: {
    sections: [
      {
        title: "General",
        shortcuts: [
          { label: "Open command palette", keys: ["⌘", "K"] },
          { label: "New schema", keys: ["⌘", "N"] },
          { label: "Save", keys: ["⌘", "S"] },
        ],
      },
    ],
  },
};

export const CrossPlatform: Story = {
  name: "Cross-platform (mac / windows)",
  args: {
    sections: [
      {
        title: "General",
        shortcuts: [
          {
            label: "Open command palette",
            keys: [["⌘", "K"], ["Ctrl", "K"]],
          },
          {
            label: "Copy",
            keys: [["⌘", "C"], ["Ctrl", "C"]],
          },
          {
            label: "Paste",
            keys: [["⌘", "V"], ["Ctrl", "V"]],
          },
        ],
      },
    ],
    description: "Shortcuts are listed for both macOS and Windows / Linux.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass an array of key arrays to render multiple alternate combos separated by \"or\".",
      },
    },
  },
};

export const ControlledOpenState: Story = {
  name: "Controlled open state",
  render: (args): ReactElement => {
    function Wrapper(): ReactElement {
      const [open, setOpen] = useState<boolean>(false);
      return (
        <div className="flex items-center gap-2">
          <Button onClick={() => setOpen(true)}>Open dialog</Button>
          <span className="text-sm text-muted-foreground">
            Currently: {open ? "open" : "closed"}
          </span>
          <KeyboardShortcutsDialog
            {...args}
            open={open}
            onOpenChange={setOpen}
          />
        </div>
      );
    }
    return <Wrapper />;
  },
  args: {
    defaultOpen: undefined,
    trigger: undefined,
  },
};

export const SearchInteraction: Story = {
  name: "Search interaction",
  args: {
    defaultOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Play-test verifies that the search input filters shortcuts and that the empty state renders when nothing matches.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    // Dialog content is portaled to document.body, so query at document scope.
    const doc = within(document.body);
    const input = await waitFor(() =>
      doc.getByPlaceholderText(/search shortcuts/i),
    );

    await waitFor(() => {
      expect(doc.getByText(/open command palette/i)).toBeInTheDocument();
      expect(doc.getByText(/undo/i)).toBeInTheDocument();
    });

    await userEvent.clear(input);
    await userEvent.type(input, "undo");

    await waitFor(() => {
      expect(doc.getByText(/^undo$/i)).toBeInTheDocument();
      expect(doc.queryByText(/open command palette/i)).toBeNull();
    });

    await userEvent.clear(input);
    await userEvent.type(input, "definitely-not-a-shortcut");

    await waitFor(() => {
      expect(
        doc.getByText(/no shortcuts match your search/i),
      ).toBeInTheDocument();
    });

    await userEvent.clear(input);
    await waitFor(() => {
      expect(doc.getByText(/open command palette/i)).toBeInTheDocument();
    });

    // Prevent play-test bleed into other stories.
    canvasElement.focus();
  },
};

export const ComposablePrimitives: Story = {
  name: "Composable primitives",
  parameters: {
    docs: {
      description: {
        story:
          "You can bypass the data-driven API and use `KeyboardShortcutsSection`, `KeyboardShortcutRow`, and `KeyboardShortcutKeysDisplay` (or `Kbd`/`KbdGroup` directly) to render bespoke rows.",
      },
    },
  },
  render: (): ReactElement => (
    <div className="w-[560px] rounded-lg border border-border bg-background p-6">
      <KeyboardShortcutsSection
        title="Vaults"
        description="Actions available on the currently-open vault."
      >
        <KeyboardShortcutRow
          label="Create vault"
          description="Prompts for name + org scope"
        >
          <KeyboardShortcutKeysDisplay keys={["⌘", "Shift", "V"]} />
        </KeyboardShortcutRow>
        <KeyboardShortcutRow label="Rotate secret">
          <KbdGroup separator="+">
            <Kbd>⌘</Kbd>
            <Kbd>R</Kbd>
          </KbdGroup>
        </KeyboardShortcutRow>
        <KeyboardShortcutRow label="Copy vault URL">
          <KeyboardShortcutKeysDisplay
            keys={[["⌘", "C"], ["Ctrl", "C"]]}
          />
        </KeyboardShortcutRow>
      </KeyboardShortcutsSection>
    </div>
  ),
  args: {
    defaultOpen: false,
    trigger: undefined,
  },
};
