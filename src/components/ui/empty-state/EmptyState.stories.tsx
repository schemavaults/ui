import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ReactElement } from "react";
import {
  AlertTriangle,
  FolderOpen,
  Inbox,
  Plus,
  Search,
  ServerCrash,
} from "lucide-react";

import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
  emptyStateSizeIds,
  emptyStateVariantIds,
  type EmptyStateSizeId,
  type EmptyStateVariantId,
} from "./empty-state";
import { Button } from "../button/button";

interface EmptyStateExampleProps {
  variant?: EmptyStateVariantId;
  size?: EmptyStateSizeId;
  title?: string;
  description?: string;
  showIcon?: boolean;
  showActions?: boolean;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

function iconForVariant(variant: EmptyStateVariantId): ReactElement {
  switch (variant) {
    case "destructive":
      return <ServerCrash />;
    case "warning":
      return <AlertTriangle />;
    case "muted":
      return <FolderOpen />;
    default:
      return <Inbox />;
  }
}

function EmptyStateExample({
  variant = "default",
  size = "md",
  title = "No items found",
  description = "Get started by creating a new item, or try adjusting your filters to find what you're looking for.",
  showIcon = true,
  showActions = true,
  primaryActionLabel = "Create item",
  secondaryActionLabel = "Learn more",
  onPrimaryAction,
  onSecondaryAction,
}: EmptyStateExampleProps): ReactElement {
  return (
    <EmptyState variant={variant} size={size}>
      {showIcon ? (
        <EmptyStateIcon variant={variant} size={size}>
          {iconForVariant(variant)}
        </EmptyStateIcon>
      ) : null}
      <EmptyStateTitle size={size}>{title}</EmptyStateTitle>
      <EmptyStateDescription>{description}</EmptyStateDescription>
      {showActions ? (
        <EmptyStateActions>
          <Button onClick={onPrimaryAction}>
            <Plus />
            {primaryActionLabel}
          </Button>
          {secondaryActionLabel ? (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          ) : null}
        </EmptyStateActions>
      ) : null}
    </EmptyState>
  );
}

const meta = {
  title: "Components/EmptyState",
  component: EmptyStateExample,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: emptyStateVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: emptyStateSizeIds,
      control: { type: "radio" },
    },
    title: { control: { type: "text" } },
    description: { control: { type: "text" } },
    showIcon: { control: { type: "boolean" } },
    showActions: { control: { type: "boolean" } },
    primaryActionLabel: { control: { type: "text" } },
    secondaryActionLabel: { control: { type: "text" } },
  },
  args: {
    variant: "default",
    size: "md",
    title: "No schemas yet",
    description:
      "Schemas let you version and share data models across your team. Create your first schema to get started.",
    showIcon: true,
    showActions: true,
    primaryActionLabel: "Create schema",
    secondaryActionLabel: "Learn more",
    onPrimaryAction: fn(),
    onSecondaryAction: fn(),
  },
} satisfies Meta<typeof EmptyStateExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    size: "md",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
    title: "Nothing in this folder",
    description: "Drag files here or click below to upload.",
    primaryActionLabel: "Upload files",
    secondaryActionLabel: "",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    title: "Failed to load vaults",
    description:
      "Something went wrong while reaching the server. Try again in a moment, or contact support if this persists.",
    primaryActionLabel: "Retry",
    secondaryActionLabel: "Contact support",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Read-only mode",
    description:
      "Your workspace is temporarily read-only while we complete maintenance. Write access will return shortly.",
    primaryActionLabel: "View status",
    secondaryActionLabel: "",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    title: "No results",
    description: "Try a different search term.",
    showActions: false,
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    title: "Welcome to SchemaVaults",
    description:
      "You're all set up. Create your first vault to start managing schemas, secrets, and data contracts across your team.",
    primaryActionLabel: "Create vault",
    secondaryActionLabel: "Read the docs",
  },
};

export const NoIcon: Story = {
  args: {
    showIcon: false,
    title: "Your inbox is empty",
    description: "Notifications about your vaults will appear here.",
    showActions: false,
  },
};

interface SearchEmptyProps {
  query?: string;
}

function SearchEmpty({ query = "acme-schema" }: SearchEmptyProps): ReactElement {
  return (
    <EmptyState variant="muted" size="md">
      <EmptyStateIcon variant="muted">
        <Search />
      </EmptyStateIcon>
      <EmptyStateTitle>No matches for &ldquo;{query}&rdquo;</EmptyStateTitle>
      <EmptyStateDescription>
        We couldn&apos;t find any schemas matching your search. Check your
        spelling, or clear filters to see all available schemas.
      </EmptyStateDescription>
      <EmptyStateActions>
        <Button variant="outline">Clear search</Button>
      </EmptyStateActions>
    </EmptyState>
  );
}

export const SearchEmptyResults: StoryObj<typeof SearchEmpty> = {
  render: (args) => <SearchEmpty {...args} />,
  args: {
    query: "acme-schema",
  },
  argTypes: {
    query: { control: { type: "text" } },
  },
};
