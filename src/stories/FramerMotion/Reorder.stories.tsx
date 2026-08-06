import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ArrowDown, ArrowUp, GripVertical, X } from "lucide-react";

import { AnimatePresence, Reorder } from "@/framer-motion";
import { cn } from "@/lib/utils";

/**
 * `Reorder` is re-exported verbatim from `framer-motion` by `@schemavaults/ui`
 * so that consuming applications get the exact same version of the animation
 * runtime that the rest of the component library is built against.
 *
 * ```tsx
 * import { Reorder } from "@schemavaults/ui";
 * // ...or from the dedicated entrypoint:
 * import { Reorder } from "@schemavaults/ui/framer-motion";
 * ```
 *
 * It is a namespace with two members:
 *
 * - `Reorder.Group` — owns the list. Takes the current `values` array and an
 *   `onReorder` callback that fires with the next order while dragging.
 * - `Reorder.Item` — a single draggable entry, identified by its `value`.
 *   The `value` must be present in the group's `values` array.
 *
 * The order is fully controlled: `Reorder.Group` never mutates anything on its
 * own, so `onReorder` must be wired to state for the list to actually move.
 */

const defaultVaults: ReadonlyArray<string> = [
  "Production secrets",
  "Staging secrets",
  "Billing schema",
  "Analytics warehouse",
  "Legacy connector",
];

const listItemClassName: string = cn(
  "flex items-center gap-3 select-none",
  "rounded-md border border-border bg-card px-3 py-2",
  "text-sm text-card-foreground shadow-sm",
  "cursor-grab active:cursor-grabbing",
);

/** Vertical drag-to-reorder list — the canonical usage of the component. */
function VerticalReorderDemo(): ReactElement {
  const [vaults, setVaults] = useState<string[]>([...defaultVaults]);

  return (
    <div className="flex w-80 flex-col gap-3">
      <Reorder.Group
        axis="y"
        values={vaults}
        onReorder={setVaults}
        className="flex list-none flex-col gap-2 p-0"
      >
        {vaults.map((vault) => (
          <Reorder.Item
            key={vault}
            value={vault}
            data-testid={`vault-${vault}`}
            className={listItemClassName}
            whileDrag={{ scale: 1.03 }}
          >
            <GripVertical
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
            <span className="grow">{vault}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <p className="text-xs text-muted-foreground" data-testid="vault-order">
        {vaults.join(" → ")}
      </p>
    </div>
  );
}

const meta = {
  title: "Components/Reorder",
  component: VerticalReorderDemo,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Drag-to-reorder lists, re-exported from `framer-motion` as `Reorder.Group` and `Reorder.Item`. " +
          "The list order is controlled — wire `onReorder` to state or nothing moves.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VerticalReorderDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A vertical list. Each `Reorder.Item` is draggable along the group's `axis`,
 * and `onReorder` fires with the new ordering as items swap positions.
 */
export const Vertical: Story = {
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByTestId("vault-Production secrets")).toBeInTheDocument();
    });
    expect(canvas.getByTestId("vault-order")).toHaveTextContent(
      defaultVaults.join(" → "),
    );
  },
};

/**
 * Set `axis="x"` (and lay the group out as a row) for horizontal reordering.
 */
function HorizontalReorderDemo(): ReactElement {
  const [tabs, setTabs] = useState<string[]>([
    "Overview",
    "Schemas",
    "Secrets",
    "Audit",
  ]);

  return (
    <Reorder.Group
      axis="x"
      values={tabs}
      onReorder={setTabs}
      className="flex list-none flex-row gap-2 p-0"
    >
      {tabs.map((tab) => (
        <Reorder.Item
          key={tab}
          value={tab}
          className={cn(listItemClassName, "whitespace-nowrap")}
          whileDrag={{ scale: 1.05 }}
        >
          {tab}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

export const Horizontal: StoryObj = {
  render: (): ReactElement => <HorizontalReorderDemo />,
};

interface EnvironmentRecord {
  id: string;
  name: string;
  region: string;
}

/**
 * `values` does not have to be an array of strings — any stable reference works,
 * which is the usual shape when reordering records fetched from an API.
 * Pass the whole record as `value`, and key the item by its id.
 */
function ObjectValuesDemo(): ReactElement {
  const [environments, setEnvironments] = useState<EnvironmentRecord[]>([
    { id: "env_prod", name: "Production", region: "us-east-1" },
    { id: "env_stage", name: "Staging", region: "us-west-2" },
    { id: "env_dev", name: "Development", region: "eu-central-1" },
  ]);

  return (
    <Reorder.Group
      axis="y"
      values={environments}
      onReorder={setEnvironments}
      className="flex w-80 list-none flex-col gap-2 p-0"
    >
      {environments.map((environment) => (
        <Reorder.Item
          key={environment.id}
          value={environment}
          className={listItemClassName}
          whileDrag={{ scale: 1.03 }}
        >
          <GripVertical
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          <span className="grow">{environment.name}</span>
          <code className="font-mono text-xs text-muted-foreground">
            {environment.region}
          </code>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

export const ObjectValues: StoryObj = {
  name: "Object values",
  render: (): ReactElement => <ObjectValuesDemo />,
};

/**
 * `Reorder.Item` renders an `<li>` by default (and `Reorder.Group` a `<ul>`).
 * Use the `as` prop when the surrounding markup calls for something else.
 */
function CustomElementsDemo(): ReactElement {
  const [steps, setSteps] = useState<string[]>([
    "Connect a source",
    "Map your schema",
    "Deploy the vault",
  ]);

  return (
    <Reorder.Group
      as="div"
      axis="y"
      values={steps}
      onReorder={setSteps}
      className="flex w-80 flex-col gap-2"
    >
      {steps.map((step, index) => (
        <Reorder.Item
          as="div"
          key={step}
          value={step}
          className={listItemClassName}
          whileDrag={{ scale: 1.03 }}
        >
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {index + 1}
          </span>
          <span className="grow">{step}</span>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

export const CustomElements: StoryObj = {
  name: "Custom elements",
  render: (): ReactElement => <CustomElementsDemo />,
};

/**
 * Because the group is controlled, it composes with `AnimatePresence`: removing
 * a value from state removes it from the list, and the exit animation runs
 * while the remaining items animate into their new positions.
 */
function RemovableItemsDemo(): ReactElement {
  const [tags, setTags] = useState<string[]>([
    "encrypted",
    "versioned",
    "audited",
    "replicated",
  ]);

  return (
    <Reorder.Group
      axis="y"
      values={tags}
      onReorder={setTags}
      className="flex w-72 list-none flex-col gap-2 p-0"
    >
      <AnimatePresence initial={false}>
        {tags.map((tag) => (
          <Reorder.Item
            key={tag}
            value={tag}
            data-testid={`tag-${tag}`}
            className={listItemClassName}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            whileDrag={{ scale: 1.03 }}
          >
            <GripVertical
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
            <span className="grow font-mono text-xs">{tag}</span>
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={(): void =>
                setTags((current) => current.filter((value) => value !== tag))
              }
              className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}

export const RemovableItems: StoryObj = {
  name: "Removable items",
  render: (): ReactElement => <RemovableItemsDemo />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const removeAudited = await canvas.findByRole("button", {
      name: "Remove audited",
    });
    await userEvent.click(removeAudited);
    await waitFor(() => {
      expect(canvas.queryByTestId("tag-audited")).not.toBeInTheDocument();
    });
    expect(canvas.getByTestId("tag-encrypted")).toBeInTheDocument();
  },
};

/**
 * Dragging is a pointer-only interaction, so on its own it is not accessible.
 * Pair the list with explicit move controls that call the same `onReorder`
 * state setter — keyboard and screen reader users get a real path to reorder,
 * and the layout animation still plays because the values changed.
 */
function AccessibleReorderDemo(): ReactElement {
  const [items, setItems] = useState<string[]>([
    "Rotate signing key",
    "Review access policies",
    "Archive stale vaults",
  ]);

  function move(from: number, to: number): void {
    setItems((current) => {
      if (to < 0 || to >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  return (
    <div className="flex w-96 flex-col gap-3">
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="flex list-none flex-col gap-2 p-0"
      >
        {items.map((item, index) => (
          <Reorder.Item
            key={item}
            value={item}
            className={listItemClassName}
            whileDrag={{ scale: 1.03 }}
          >
            <GripVertical
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
            <span className="grow">{item}</span>
            <button
              type="button"
              aria-label={`Move ${item} up`}
              disabled={index === 0}
              onClick={(): void => move(index, index - 1)}
              className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <ArrowUp aria-hidden="true" className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label={`Move ${item} down`}
              disabled={index === items.length - 1}
              onClick={(): void => move(index, index + 1)}
              className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <ArrowDown aria-hidden="true" className="size-3.5" />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <p className="text-xs text-muted-foreground" data-testid="task-order">
        {items.join(" → ")}
      </p>
    </div>
  );
}

export const KeyboardAccessible: StoryObj = {
  name: "Keyboard accessible",
  render: (): ReactElement => <AccessibleReorderDemo />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const moveUp = await canvas.findByRole("button", {
      name: "Move Archive stale vaults up",
    });
    await userEvent.click(moveUp);
    await waitFor(() => {
      expect(canvas.getByTestId("task-order")).toHaveTextContent(
        "Rotate signing key → Archive stale vaults → Review access policies",
      );
    });
  },
};
