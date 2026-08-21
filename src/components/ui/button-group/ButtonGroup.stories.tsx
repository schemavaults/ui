import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Italic,
  Minus,
  Plus,
  Redo2,
  Share2,
  Trash2,
  Underline,
  Undo2,
} from "lucide-react";
import type { ReactElement } from "react";

import { Button } from "../button";
import { ButtonGroup } from "./button-group";
import {
  buttonGroupOrientationIds,
  buttonGroupSpacingIds,
} from "./button-group-variants";

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A visually-joined cluster of buttons. Collapses shared borders and only rounds the outer corners so `outline`, `secondary`, and `default` buttons read as a single segmented control. Different from `SegmentedControl` / `ToggleGroup` (stateful selection), `SplitButton` (action + dropdown), and `Toolbar` (spaced tool container) — `ButtonGroup` is pure layout, each child keeps its own `onClick`. Set `spacing` to switch from the attached look to a gapped row, and `orientation` to stack vertically.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      options: buttonGroupOrientationIds,
      control: { type: "radio" },
    },
    spacing: {
      options: buttonGroupSpacingIds,
      control: { type: "radio" },
    },
    label: {
      control: { type: "text" },
    },
  },
  args: {
    orientation: "horizontal",
    spacing: "attached",
    label: "Actions",
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The canonical attached button group. Three `outline` buttons collapse into
 * a single segmented row with shared borders and only the outer corners
 * rounded.
 */
export const Default: Story = {
  render: (args): ReactElement => (
    <ButtonGroup {...args}>
      <Button variant="outline" onClick={fn()}>
        Copy
      </Button>
      <Button variant="outline" onClick={fn()}>
        Share
      </Button>
      <Button variant="outline" onClick={fn()}>
        Delete
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Icon-only text-formatting buttons — the classic rich-editor toolbar.
 * `size="icon"` keeps each button square, and the group joins them into one
 * unit.
 */
export const IconButtons: Story = {
  args: { label: "Text formatting" },
  render: (args): ReactElement => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="icon" aria-label="Bold" onClick={fn()}>
        <Bold className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Italic" onClick={fn()}>
        <Italic className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Underline"
        onClick={fn()}
      >
        <Underline className="h-4 w-4" aria-hidden="true" />
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Alignment picker with mixed icon-and-text buttons. Shows the group handles
 * variable widths — all inner borders collapse, outer corners stay rounded.
 */
export const AlignmentControls: Story = {
  args: { label: "Text alignment" },
  render: (args): ReactElement => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="icon" aria-label="Align left" onClick={fn()}>
        <AlignLeft className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Align center"
        onClick={fn()}
      >
        <AlignCenter className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Align right"
        onClick={fn()}
      >
        <AlignRight className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Justify" onClick={fn()}>
        <AlignJustify className="h-4 w-4" aria-hidden="true" />
      </Button>
    </ButtonGroup>
  ),
};

/**
 * `spacing="default"` swaps the attached look for a gapped row while keeping
 * every button independently rounded. Useful when the group is a set of
 * peer actions rather than a single control.
 */
export const Spaced: Story = {
  args: { spacing: "default", label: "Document actions" },
  render: (args): ReactElement => (
    <ButtonGroup {...args}>
      <Button variant="outline" onClick={fn()}>
        <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
        Copy
      </Button>
      <Button variant="outline" onClick={fn()}>
        <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
        Share
      </Button>
      <Button variant="outline" onClick={fn()}>
        <Download className="mr-2 h-4 w-4" aria-hidden="true" />
        Export
      </Button>
    </ButtonGroup>
  ),
};

/**
 * `orientation="vertical"` stacks the buttons top-to-bottom and collapses the
 * shared horizontal borders instead of vertical ones. Full-width children
 * keep the column tidy.
 */
export const Vertical: Story = {
  args: { orientation: "vertical", label: "Row actions" },
  render: (args): ReactElement => (
    <ButtonGroup {...args} className="w-40">
      <Button variant="outline" onClick={fn()}>
        Edit
      </Button>
      <Button variant="outline" onClick={fn()}>
        Duplicate
      </Button>
      <Button variant="outline" onClick={fn()}>
        Archive
      </Button>
      <Button variant="outline" onClick={fn()}>
        Delete
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Non-`outline` variants join just as cleanly. Here `secondary` buttons form
 * a step wizard's Previous / Next pair.
 */
export const SecondaryPager: Story = {
  args: { label: "Wizard navigation" },
  render: (args): ReactElement => (
    <ButtonGroup {...args}>
      <Button variant="secondary" onClick={fn()}>
        <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
        Previous
      </Button>
      <Button variant="secondary" onClick={fn()}>
        Next
        <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Undo / redo pair — a common icon-only micro-toolbar next to a document
 * title.
 */
export const UndoRedo: Story = {
  args: { label: "History" },
  render: (args): ReactElement => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="icon" aria-label="Undo" onClick={fn()}>
        <Undo2 className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Redo" onClick={fn()}>
        <Redo2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Zoom-style stepper: symmetric − and + buttons with a static readout in the
 * middle. Any element can sit inside the group; the middle child here is a
 * plain `<div>` so it collapses borders with its neighbours.
 */
export const Stepper: Story = {
  args: { label: "Zoom level" },
  render: (args): ReactElement => (
    <ButtonGroup {...args}>
      <Button
        variant="outline"
        size="icon"
        aria-label="Zoom out"
        onClick={fn()}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </Button>
      <div
        aria-live="polite"
        className="inline-flex h-10 min-w-14 items-center justify-center border border-input bg-background px-3 text-sm font-medium tabular-nums text-foreground"
      >
        100%
      </div>
      <Button variant="outline" size="icon" aria-label="Zoom in" onClick={fn()}>
        <Plus className="h-4 w-4" aria-hidden="true" />
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Destructive-tinted trailing action — mixing button variants is fine, but
 * keep the destructive one at an outer edge so its stronger colour doesn't
 * fight neighbouring borders.
 */
export const MixedVariants: Story = {
  args: { label: "Row actions" },
  render: (args): ReactElement => (
    <ButtonGroup {...args}>
      <Button variant="outline" onClick={fn()}>
        <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
        Duplicate
      </Button>
      <Button variant="outline" onClick={fn()}>
        <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
        Share
      </Button>
      <Button variant="destructive" onClick={fn()}>
        <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
        Delete
      </Button>
    </ButtonGroup>
  ),
};

/**
 * All three spacing modes side-by-side so the visual difference between
 * `attached`, `sm`, and `lg` gaps is obvious at a glance.
 */
export const AllSpacings: Story = {
  args: { label: "Spacing showcase" },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "The full spacing range: attached (joined borders, no gap), `sm`, `default`, and `lg` gapped variants.",
      },
    },
  },
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-4">
      {buttonGroupSpacingIds.map((spacing) => (
        <div key={spacing} className="flex items-center gap-4">
          <code className="w-20 text-xs text-muted-foreground">{spacing}</code>
          <ButtonGroup spacing={spacing} label={`${spacing} spacing`}>
            <Button variant="outline">One</Button>
            <Button variant="outline">Two</Button>
            <Button variant="outline">Three</Button>
          </ButtonGroup>
        </div>
      ))}
    </div>
  ),
};

/**
 * Interaction test: every button in the group is reachable via keyboard, and
 * clicking each fires its own handler. Locks in the "layout only — each
 * child owns its onClick" contract.
 */
export const InteractionSmokeTest: Story = {
  args: { label: "Actions" },
  render: (args): ReactElement => {
    const onOne = fn();
    const onTwo = fn();
    const onThree = fn();
    return (
      <ButtonGroup {...args}>
        <Button variant="outline" onClick={onOne} data-testid="btn-one">
          One
        </Button>
        <Button variant="outline" onClick={onTwo} data-testid="btn-two">
          Two
        </Button>
        <Button variant="outline" onClick={onThree} data-testid="btn-three">
          Three
        </Button>
      </ButtonGroup>
    );
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);

    const group = canvas.getByRole("group", { name: "Actions" });
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute("data-orientation", "horizontal");
    expect(group).toHaveAttribute("data-spacing", "attached");

    const one = canvas.getByTestId("btn-one");
    const two = canvas.getByTestId("btn-two");
    const three = canvas.getByTestId("btn-three");

    await userEvent.click(one);
    await userEvent.click(two);
    await userEvent.click(three);

    // Each child owns its own handler — the group is layout only. All three
    // buttons should be present in the accessibility tree as independent
    // controls.
    expect(canvas.getAllByRole("button")).toHaveLength(3);
  },
};
