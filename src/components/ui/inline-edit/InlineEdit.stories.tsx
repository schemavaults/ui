import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { useState, type ReactElement } from "react";

import {
  InlineEdit,
  inlineEditSizeIds,
  inlineEditVariantIds,
  type InlineEditProps,
} from "./inline-edit";

interface InlineEditPlaygroundProps extends InlineEditProps {}

function InlineEditPlayground(props: InlineEditPlaygroundProps): ReactElement {
  return (
    <div className="mx-auto w-full max-w-md">
      <InlineEdit {...props} />
    </div>
  );
}

const meta = {
  title: "Components/InlineEdit",
  component: InlineEditPlayground,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "An inline click-to-edit text field. Displays a value with a hover affordance, then swaps to an editable input when activated. Supports controlled and uncontrolled usage, async save handlers with loading state, validation, and a multiline mode.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: inlineEditVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: inlineEditSizeIds,
      control: { type: "radio" },
    },
    placeholder: { control: { type: "text" } },
    label: { control: { type: "text" } },
    multiline: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    readOnly: { control: { type: "boolean" } },
    maxLength: { control: { type: "number" } },
  },
  args: {
    defaultValue: "acme-production",
    placeholder: "Click to add a value",
    label: "Vault name",
    variant: "default",
    size: "default",
    multiline: false,
    disabled: false,
    readOnly: false,
    onSave: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof InlineEditPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    label: "Display name",
    defaultValue: "Jane Doe",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    label: "API endpoint",
    defaultValue: "https://api.schemavaults.com/v1",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    label: "Tag",
    defaultValue: "production",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    label: "Project name",
    defaultValue: "Customer Insights Platform",
  },
};

export const EmptyValue: Story = {
  args: {
    defaultValue: "",
    label: "Description",
    placeholder: "Click to add a description",
  },
};

export const Multiline: Story = {
  args: {
    multiline: true,
    label: "Description",
    defaultValue:
      "Long-form notes for this vault. Click to edit, then use ⌘/Ctrl + Enter to save.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Vault ID",
    defaultValue: "vlt_8a4c1d2e9b",
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    label: "Created by",
    defaultValue: "system@schemavaults.com",
  },
};

function WithValidationExample(): ReactElement {
  return (
    <div className="mx-auto w-full max-w-md">
      <InlineEdit
        label="Slug"
        defaultValue="my-vault"
        validate={(next): string | null => {
          if (next.trim().length < 3) return "Slug must be at least 3 characters.";
          if (!/^[a-z0-9-]+$/.test(next)) {
            return "Use only lowercase letters, numbers, and dashes.";
          }
          return null;
        }}
        onSave={fn()}
      />
    </div>
  );
}

export const WithValidation: StoryObj = {
  render: () => <WithValidationExample />,
};

function AsyncSaveExample(): ReactElement {
  const [value, setValue] = useState<string>("Acme Corp");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <InlineEdit
        label="Organization (async save)"
        value={value}
        onSave={async (next): Promise<void> => {
          await new Promise<void>((resolve): void => {
            setTimeout(resolve, 1200);
          });
          setValue(next);
        }}
      />
      <p className="text-xs text-muted-foreground">
        Current saved value: <span className="font-mono">{value}</span>
      </p>
    </div>
  );
}

export const AsyncSave: StoryObj = {
  render: () => <AsyncSaveExample />,
};

function AsyncSaveErrorExample(): ReactElement {
  return (
    <div className="mx-auto w-full max-w-md">
      <InlineEdit
        label="Display name (always fails)"
        defaultValue="Initial value"
        onSave={async (): Promise<void> => {
          await new Promise<void>((resolve): void => {
            setTimeout(resolve, 700);
          });
          throw new Error("The server rejected this change. Try again.");
        }}
      />
    </div>
  );
}

export const AsyncSaveError: StoryObj = {
  render: () => <AsyncSaveErrorExample />,
};

function ProfileCardExample(): ReactElement {
  const [name, setName] = useState<string>("Jane Doe");
  const [title, setTitle] = useState<string>("Senior Platform Engineer");
  const [bio, setBio] = useState<string>(
    "Lead engineer on the SchemaVaults platform team. Passionate about developer experience and great type systems.",
  );

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
          JD
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <InlineEdit
            variant="ghost"
            size="default"
            value={name}
            onSave={(next): void => setName(next)}
          />
          <InlineEdit
            variant="ghost"
            size="sm"
            value={title}
            onSave={(next): void => setTitle(next)}
          />
        </div>
      </div>
      <InlineEdit
        label="Bio"
        variant="outline"
        multiline
        value={bio}
        onSave={(next): void => setBio(next)}
      />
    </div>
  );
}

export const ProfileCardExampleStory: StoryObj = {
  name: "Example: Profile Card",
  render: () => <ProfileCardExample />,
};
