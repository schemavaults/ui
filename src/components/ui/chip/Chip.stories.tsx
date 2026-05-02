import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  Bell,
  Check,
  Filter,
  Hash,
  Plus,
  Sparkles,
  Tag,
  User,
} from "lucide-react";
import { useState, type ReactElement } from "react";

import { Chip } from "./chip";
import { chipSizeIds, chipVariantIds, type ChipVariant } from "./chip-variants";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

const meta = {
  title: "Components/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Compact, pill-shaped element for displaying tags, filters, selections, and metadata. Distinct from Badge in that it is built for interaction: chips can be clicked, selected (filter chips), and dismissed via an inline remove button. Supports an optional leading slot for icons or avatars.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: chipVariantIds,
      control: { type: "select" },
    },
    size: {
      options: chipSizeIds,
      control: { type: "radio" },
    },
    children: { control: { type: "text" } },
    removable: { control: { type: "boolean" } },
    selected: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    children: "Chip label",
    variant: "default",
    size: "default",
    removable: false,
    selected: false,
    disabled: false,
    onRemove: fn(),
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Removable: Story = {
  args: {
    children: "production",
    removable: true,
  },
};

export const WithLeadingIcon: Story = {
  args: {
    children: "tagged",
    leading: <Tag />,
  },
};

export const WithAvatar: Story = {
  args: {
    children: "Ada Lovelace",
    leading: (
      <Avatar size="xs" className="-ml-1 size-4">
        <AvatarImage
          src={`data:image/svg+xml;utf8,${encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>" +
              "<rect width='32' height='32' fill='#7c3aed'/>" +
              "<text x='50%' y='50%' text-anchor='middle' dominant-baseline='central' " +
              "fill='white' font-family='ui-sans-serif,system-ui,sans-serif' " +
              "font-size='14' font-weight='600'>AL</text>" +
              "</svg>",
          )}`}
          alt=""
        />
        <AvatarFallback className="text-[8px]">AL</AvatarFallback>
      </Avatar>
    ),
    variant: "outline",
    removable: true,
  },
};

export const Clickable: Story = {
  args: {
    children: "Click me",
    onClick: fn(),
    leading: <Sparkles />,
  },
};

export const Selected: Story = {
  args: {
    children: "Selected filter",
    selected: true,
    onClick: fn(),
    leading: <Check />,
    variant: "primary",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
    removable: true,
    onClick: fn(),
  },
};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-wrap items-center gap-2">
      {chipVariantIds.map((variant) => (
        <Chip key={variant} variant={variant} leading={<Hash />} removable>
          {variant}
        </Chip>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-3">
      {chipSizeIds.map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-16 text-xs text-muted-foreground uppercase tracking-wide">
            {size}
          </span>
          <Chip size={size} leading={<Tag />} removable>
            v{size}
          </Chip>
          <Chip size={size} variant="primary">
            primary
          </Chip>
          <Chip size={size} variant="outline" leading={<Bell />}>
            outline
          </Chip>
        </div>
      ))}
    </div>
  ),
};

function FilterChipsExample(): ReactElement {
  const allFilters = [
    "Active",
    "Archived",
    "Drafts",
    "Shared",
    "Mine",
    "Starred",
  ] as const;
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["Active", "Mine"]),
  );

  function toggle(filter: string): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  }

  return (
    <div className="flex w-80 flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Filter className="size-3.5" />
        <span>Filter results</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {allFilters.map((filter) => {
          const isSelected = selected.has(filter);
          return (
            <Chip
              key={filter}
              variant={isSelected ? "primary" : "outline"}
              selected={isSelected}
              onClick={() => toggle(filter)}
              leading={isSelected ? <Check /> : undefined}
            >
              {filter}
            </Chip>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Selected:{" "}
        <span className="font-medium text-foreground">
          {selected.size === 0 ? "(none)" : Array.from(selected).join(", ")}
        </span>
      </p>
    </div>
  );
}

export const FilterChips: Story = {
  render: (): ReactElement => <FilterChipsExample />,
};

function TagInputExample(): ReactElement {
  const [tags, setTags] = useState<string[]>([
    "schemavaults",
    "ui",
    "react",
    "typescript",
  ]);
  const [draft, setDraft] = useState<string>("");

  function addTag(): void {
    const trimmed = draft.trim();
    if (trimmed.length === 0 || tags.includes(trimmed)) {
      setDraft("");
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setDraft("");
  }

  function removeTag(tag: string): void {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  return (
    <div className="flex w-96 flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <span className="text-xs font-medium text-muted-foreground">
        Tags
      </span>
      <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background p-1.5">
        {tags.map((tag) => (
          <Chip
            key={tag}
            size="sm"
            variant="secondary"
            removable
            onRemove={() => removeTag(tag)}
            leading={<Hash />}
          >
            {tag}
          </Chip>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            } else if (e.key === "Backspace" && draft.length === 0 && tags.length > 0) {
              e.preventDefault();
              setTags((prev) => prev.slice(0, -1));
            }
          }}
          placeholder={tags.length === 0 ? "Add a tag…" : ""}
          className="flex-1 min-w-24 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Press <kbd className="rounded bg-muted px-1 font-mono text-[10px]">Enter</kbd>{" "}
        to add. Press{" "}
        <kbd className="rounded bg-muted px-1 font-mono text-[10px]">Backspace</kbd>{" "}
        on empty input to remove the last tag.
      </p>
    </div>
  );
}

export const TagInput: Story = {
  render: (): ReactElement => <TagInputExample />,
};

function StatusBoardExample(): ReactElement {
  type Item = {
    id: number;
    title: string;
    owner: string;
    status: ChipVariant;
    statusLabel: string;
  };
  const items: Item[] = [
    {
      id: 1,
      title: "Migrate billing schema",
      owner: "AL",
      status: "success",
      statusLabel: "Shipped",
    },
    {
      id: 2,
      title: "Audit access policies",
      owner: "GH",
      status: "warning",
      statusLabel: "In review",
    },
    {
      id: 3,
      title: "Roll back legacy connector",
      owner: "BS",
      status: "destructive",
      statusLabel: "Blocked",
    },
    {
      id: 4,
      title: "Draft migration RFC",
      owner: "MK",
      status: "secondary",
      statusLabel: "Draft",
    },
  ];

  return (
    <div className="w-[28rem] rounded-lg border border-border bg-card text-card-foreground">
      <div className="border-b border-border px-4 py-3 text-sm font-medium">
        Workstreams
      </div>
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Chip
                size="sm"
                variant="outline"
                leading={<User />}
              >
                {item.owner}
              </Chip>
              <span className="text-sm">{item.title}</span>
            </div>
            <Chip size="sm" variant={item.status}>
              {item.statusLabel}
            </Chip>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const StatusBoard: Story = {
  render: (): ReactElement => <StatusBoardExample />,
};

export const AddNewChip: Story = {
  render: (): ReactElement => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip variant="secondary" leading={<Hash />} removable>
        api
      </Chip>
      <Chip variant="secondary" leading={<Hash />} removable>
        graphql
      </Chip>
      <Chip variant="secondary" leading={<Hash />} removable>
        rest
      </Chip>
      <Chip
        variant="outline"
        leading={<Plus />}
        onClick={fn()}
      >
        Add tag
      </Chip>
    </div>
  ),
};
