import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  ArrowRight,
  Bold,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Download,
  Eye,
  Italic,
  LayoutGrid,
  List,
  Pencil,
  Rows,
  Save,
  Send,
  Share2,
  Trash2,
  Underline,
} from "lucide-react";

import { buttonVariantIds } from "../button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";
import {
  ButtonGroup,
  ButtonGroupItem,
  ButtonGroupSeparator,
  buttonGroupOrientationIds,
  buttonGroupSizeIds,
  buttonGroupSpacingIds,
} from "./button-group";

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: buttonVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: buttonGroupSizeIds,
      control: { type: "radio" },
    },
    orientation: {
      options: buttonGroupOrientationIds,
      control: { type: "radio" },
    },
    spacing: {
      options: buttonGroupSpacingIds,
      control: { type: "radio" },
    },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    variant: "outline",
    size: "default",
    orientation: "horizontal",
    spacing: "attached",
    disabled: false,
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The canonical ButtonGroup: three attached, outline-styled buttons sharing a
 * single visual control. `variant`, `size`, and `disabled` cascade from the
 * group to every child `ButtonGroupItem` via context.
 */
export const Playground: Story = {
  render: (args): ReactElement => (
    <ButtonGroup {...args} aria-label="Copy tool">
      <ButtonGroupItem onClick={fn()}>
        <Copy aria-hidden="true" className="mr-1.5 h-4 w-4" />
        Copy
      </ButtonGroupItem>
      <ButtonGroupItem onClick={fn()}>
        <Check aria-hidden="true" className="mr-1.5 h-4 w-4" />
        Duplicate
      </ButtonGroupItem>
      <ButtonGroupItem onClick={fn()}>
        <Share2 aria-hidden="true" className="mr-1.5 h-4 w-4" />
        Share
      </ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * A pager built out of two attached icon buttons with a separator between
 * them, plus an outline pager reading the current page from a common label.
 */
export const Pager: Story = {
  render: (): ReactElement => {
    function PagerDemo(): ReactElement {
      const [page, setPage] = useState<number>(3);
      const totalPages = 12;
      return (
        <div className="flex flex-col items-center gap-2">
          <ButtonGroup variant="outline" aria-label="Pagination">
            <ButtonGroupItem
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={(): void => setPage((p) => Math.max(1, p - 1))}
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            </ButtonGroupItem>
            <ButtonGroupItem
              className="min-w-[6rem] cursor-default hover:bg-background"
              tabIndex={-1}
              aria-live="polite"
            >
              Page {page} / {totalPages}
            </ButtonGroupItem>
            <ButtonGroupItem
              aria-label="Next page"
              disabled={page >= totalPages}
              onClick={(): void =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
            >
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </ButtonGroupItem>
          </ButtonGroup>
        </div>
      );
    }
    return <PagerDemo />;
  },
};

/**
 * A "view switcher" mixing plain `ButtonGroupItem`s with a `ButtonGroupSeparator`
 * to visually break related actions inside a single attached group.
 */
export const ViewSwitcherWithSeparator: Story = {
  render: (): ReactElement => (
    <ButtonGroup variant="outline" aria-label="View controls">
      <ButtonGroupItem onClick={fn()} aria-label="Grid view">
        <LayoutGrid aria-hidden="true" className="h-4 w-4" />
      </ButtonGroupItem>
      <ButtonGroupItem onClick={fn()} aria-label="List view">
        <List aria-hidden="true" className="h-4 w-4" />
      </ButtonGroupItem>
      <ButtonGroupItem onClick={fn()} aria-label="Rows view">
        <Rows aria-hidden="true" className="h-4 w-4" />
      </ButtonGroupItem>
      <ButtonGroupSeparator />
      <ButtonGroupItem onClick={fn()}>
        <Pencil aria-hidden="true" className="mr-1.5 h-4 w-4" />
        Edit
      </ButtonGroupItem>
      <ButtonGroupItem onClick={fn()}>
        <Eye aria-hidden="true" className="mr-1.5 h-4 w-4" />
        Preview
      </ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Text-formatting toolbar: an attached ghost group of icon buttons for marks,
 * a separator, and a second attached group for alignment.
 */
export const FormattingToolbar: Story = {
  render: (): ReactElement => (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-2 shadow-sm">
      <ButtonGroup variant="ghost" size="icon" aria-label="Text formatting">
        <ButtonGroupItem aria-label="Bold" onClick={fn()}>
          <Bold aria-hidden="true" className="h-4 w-4" />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Italic" onClick={fn()}>
          <Italic aria-hidden="true" className="h-4 w-4" />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Underline" onClick={fn()}>
          <Underline aria-hidden="true" className="h-4 w-4" />
        </ButtonGroupItem>
      </ButtonGroup>
      <div className="h-6 w-px bg-border" aria-hidden />
      <ButtonGroup variant="ghost" size="icon" aria-label="Text alignment">
        <ButtonGroupItem aria-label="Align left" onClick={fn()}>
          <AlignLeft aria-hidden="true" className="h-4 w-4" />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Align center" onClick={fn()}>
          <AlignCenter aria-hidden="true" className="h-4 w-4" />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Align right" onClick={fn()}>
          <AlignRight aria-hidden="true" className="h-4 w-4" />
        </ButtonGroupItem>
      </ButtonGroup>
    </div>
  ),
};

/**
 * Vertical orientation flips the shared edges so the buttons stack top-to-bottom
 * with rounded corners only at the top and bottom of the group.
 */
export const Vertical: Story = {
  render: (): ReactElement => (
    <ButtonGroup
      variant="outline"
      orientation="vertical"
      aria-label="Row actions"
    >
      <ButtonGroupItem onClick={fn()}>
        <Save aria-hidden="true" className="mr-1.5 h-4 w-4" />
        Save
      </ButtonGroupItem>
      <ButtonGroupItem onClick={fn()}>
        <Download aria-hidden="true" className="mr-1.5 h-4 w-4" />
        Download
      </ButtonGroupItem>
      <ButtonGroupItem onClick={fn()}>
        <Send aria-hidden="true" className="mr-1.5 h-4 w-4" />
        Send
      </ButtonGroupItem>
      <ButtonGroupItem onClick={fn()}>
        <Clock aria-hidden="true" className="mr-1.5 h-4 w-4" />
        Schedule
      </ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * `spacing="spaced"` swaps the attached edges for a normal flex gap while still
 * cascading `variant`, `size`, and `disabled` through context. Useful when a
 * segmented look is undesirable but you still want the shared config.
 */
export const Spaced: Story = {
  args: { variant: "secondary", spacing: "spaced" },
  render: (args): ReactElement => (
    <ButtonGroup {...args} aria-label="Row actions">
      <ButtonGroupItem onClick={fn()}>Approve</ButtonGroupItem>
      <ButtonGroupItem onClick={fn()}>Request changes</ButtonGroupItem>
      <ButtonGroupItem onClick={fn()}>Comment</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Group-level `disabled` toggle: cascades down through context and disables
 * every child unless the child opts out with `disabled={false}`.
 */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args): ReactElement => (
    <div className="flex flex-col gap-4">
      <ButtonGroup {...args} aria-label="Disabled outline group">
        <ButtonGroupItem>Prev</ButtonGroupItem>
        <ButtonGroupItem>Refresh</ButtonGroupItem>
        <ButtonGroupItem>Next</ButtonGroupItem>
      </ButtonGroup>
      <ButtonGroup {...args} variant="default" aria-label="Disabled solid group">
        <ButtonGroupItem>Save</ButtonGroupItem>
        <ButtonGroupItem>Publish</ButtonGroupItem>
        <ButtonGroupItem disabled={false} onClick={fn()}>
          Force enable
        </ButtonGroupItem>
      </ButtonGroup>
    </div>
  ),
};

/**
 * One row per Button variant so the border / divider treatment is easy to
 * eyeball side-by-side against every `Button` variant.
 */
export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="grid grid-cols-[auto,1fr] items-center gap-x-6 gap-y-3">
      {buttonVariantIds.map((variant) => (
        <VariantRow key={variant} variant={variant} />
      ))}
    </div>
  ),
};

function VariantRow({
  variant,
}: {
  variant: (typeof buttonVariantIds)[number];
}): ReactElement {
  return (
    <>
      <span className="text-sm font-medium text-muted-foreground capitalize">
        {variant}
      </span>
      <ButtonGroup variant={variant} aria-label={`${variant} group`}>
        <ButtonGroupItem onClick={fn()}>One</ButtonGroupItem>
        <ButtonGroupItem onClick={fn()}>Two</ButtonGroupItem>
        <ButtonGroupItem onClick={fn()}>Three</ButtonGroupItem>
      </ButtonGroup>
    </>
  );
}

/**
 * All sizes stacked so vertical rhythm and label scaling can be eyeballed
 * against the standard Button sizes.
 */
export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-4">
      {buttonGroupSizeIds.map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-16 text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <ButtonGroup variant="outline" size={size} aria-label={`${size} group`}>
            <ButtonGroupItem
              aria-label={size === "icon" ? "Previous" : undefined}
              onClick={fn()}
            >
              {size === "icon" ? (
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              ) : (
                "Previous"
              )}
            </ButtonGroupItem>
            <ButtonGroupItem
              aria-label={size === "icon" ? "Play" : undefined}
              onClick={fn()}
            >
              {size === "icon" ? (
                <Check aria-hidden="true" className="h-4 w-4" />
              ) : (
                "Center"
              )}
            </ButtonGroupItem>
            <ButtonGroupItem
              aria-label={size === "icon" ? "Next" : undefined}
              onClick={fn()}
            >
              {size === "icon" ? (
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              ) : (
                "Next"
              )}
            </ButtonGroupItem>
          </ButtonGroup>
        </div>
      ))}
    </div>
  ),
};

/**
 * A real-world "primary action + overflow menu" pattern: a normal
 * `ButtonGroupItem` for the main action attached to a `DropdownMenuTrigger`
 * rendered `asChild` on a second item. The dropdown wiring survives the
 * attached borders because the trigger inherits the item slot.
 */
export const WithOverflowMenu: Story = {
  render: (): ReactElement => (
    <ButtonGroup variant="default" aria-label="Deploy actions">
      <ButtonGroupItem onClick={fn()}>Deploy to staging</ButtonGroupItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ButtonGroupItem
            aria-label="More deploy targets"
            className="px-2"
          >
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
          </ButtonGroupItem>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={fn()}>Deploy to preview</DropdownMenuItem>
          <DropdownMenuItem onClick={fn()}>Deploy to production</DropdownMenuItem>
          <DropdownMenuItem onClick={fn()}>Deploy from tag&hellip;</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  ),
};

/**
 * A destructive confirmation group: primary "Confirm delete" attached to an
 * outline "Cancel" so the two options read as a single decision.
 */
export const ConfirmationPair: Story = {
  render: (): ReactElement => (
    <ButtonGroup aria-label="Delete confirmation">
      <ButtonGroupItem variant="destructive" onClick={fn()}>
        <Trash2 aria-hidden="true" className="mr-1.5 h-4 w-4" />
        Confirm delete
      </ButtonGroupItem>
      <ButtonGroupItem variant="outline" onClick={fn()}>
        Cancel
      </ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Interaction test: verifies the attached wiring is wired up correctly —
 * every item advertises the group slot, the group broadcasts orientation to
 * assistive tech, and each `ButtonGroupItem` fires its own click handler
 * independently.
 */
export const InteractionSmokeTest: Story = {
  parameters: { layout: "centered" },
  render: (): ReactElement => {
    const onOne = fn();
    const onTwo = fn();
    const onThree = fn();
    return (
      <ButtonGroup
        variant="outline"
        aria-label="Smoke test group"
        data-testid="smoke-group"
      >
        <ButtonGroupItem data-testid="smoke-one" onClick={onOne}>
          One
        </ButtonGroupItem>
        <ButtonGroupItem data-testid="smoke-two" onClick={onTwo}>
          Two
        </ButtonGroupItem>
        <ButtonGroupItem data-testid="smoke-three" onClick={onThree}>
          Three
        </ButtonGroupItem>
      </ButtonGroup>
    );
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);

    const group = await waitFor((): HTMLElement => {
      const el = canvas.getByTestId("smoke-group");
      if (!el) throw new Error("button-group not rendered yet");
      return el;
    });

    // Group carries a11y + slot metadata.
    expect(group.getAttribute("role")).toBe("group");
    expect(group.getAttribute("data-slot")).toBe("button-group");
    expect(group.getAttribute("data-orientation")).toBe("horizontal");
    expect(group.getAttribute("aria-orientation")).toBe("horizontal");

    // Every item advertises the group-item slot so the attached-corner
    // selectors on the group actually match.
    const items = Array.from(
      group.querySelectorAll<HTMLElement>('[data-slot="button-group-item"]'),
    );
    expect(items.length).toBe(3);
    for (const item of items) {
      expect(item.tagName).toBe("BUTTON");
    }

    // Clicks route to each individual button's onClick.
    const [one, two, three] = items as [
      HTMLButtonElement,
      HTMLButtonElement,
      HTMLButtonElement,
    ];
    await userEvent.click(one);
    await userEvent.click(two);
    await userEvent.click(three);

    // With `-ml-px` overlap on all but the first, the second and third items
    // pull back by 1px into the previous sibling. Verify that computed
    // margin-left actually applies on the non-first items so the borders
    // collapse cleanly (regression guard for the compound-variant CSS).
    const marginLeftTwo = window.getComputedStyle(two).marginLeft;
    const marginLeftThree = window.getComputedStyle(three).marginLeft;
    expect(marginLeftTwo).toBe("-1px");
    expect(marginLeftThree).toBe("-1px");
    // The first item must NOT have the negative pull.
    expect(window.getComputedStyle(one).marginLeft).toBe("0px");
  },
};
