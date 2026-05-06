import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { AtSign, Hash, Mail, Tag } from "lucide-react";
import { useState, type ReactElement } from "react";

import { TagsInput } from "./tags-input";
import { tagsInputSizeIds } from "./tags-input-variants";
import { chipVariantIds } from "../chip/chip-variants";
import { Label } from "../label";

const meta = {
  title: "Components/TagsInput",
  component: TagsInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Multi-tag input field. Wraps the `Chip` component with a controlled/uncontrolled input that commits new tags on Enter, comma, or paste. Supports size and chip-variant theming, validation, max-tag caps, custom delimiters, and Backspace-to-remove on an empty draft.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: tagsInputSizeIds,
      control: { type: "radio" },
    },
    chipVariant: {
      options: chipVariantIds,
      control: { type: "select" },
    },
    placeholder: { control: { type: "text" } },
    disabled: { control: { type: "boolean" } },
    invalid: { control: { type: "boolean" } },
    allowDuplicates: { control: { type: "boolean" } },
    maxTags: { control: { type: "number" } },
    defaultValue: { control: { type: "object" } },
  },
  args: {
    size: "default",
    chipVariant: "secondary",
    placeholder: "Add a tag…",
    disabled: false,
    invalid: false,
    allowDuplicates: false,
    onValueChange: fn(),
    onTagAdd: fn(),
    onTagRemove: fn(),
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TagsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: ["schemavaults", "ui", "react"],
  },
};

export const Empty: Story = {
  args: {
    defaultValue: [],
    placeholder: "Type and press Enter…",
  },
};

export const WithLeadingHashIcon: Story = {
  args: {
    defaultValue: ["typescript", "tailwind"],
    chipLeading: <Hash />,
    placeholder: "#topic",
  },
};

export const PrimaryChips: Story = {
  args: {
    defaultValue: ["alpha", "beta", "gamma"],
    chipVariant: "primary",
    chipLeading: <Tag />,
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    defaultValue: ["compact", "tight"],
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    defaultValue: ["spacious", "comfortable"],
  },
};

export const MaxThreeTags: Story = {
  args: {
    maxTags: 3,
    defaultValue: ["one", "two"],
    placeholder: "Up to 3 tags",
  },
};

export const InvalidState: Story = {
  args: {
    defaultValue: ["bad-tag"],
    invalid: true,
    placeholder: "Fix the error…",
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: ["read-only", "frozen"],
    disabled: true,
  },
};

export const AllowDuplicates: Story = {
  args: {
    defaultValue: ["repeat", "repeat", "again"],
    allowDuplicates: true,
  },
};

function EmailRecipientsExample(): ReactElement {
  const [emails, setEmails] = useState<string[]>([
    "ada@example.com",
    "grace@example.com",
  ]);
  const [error, setError] = useState<string | null>(null);

  const validate = (tag: string, existing: readonly string[]): boolean => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag);
    if (!ok) {
      setError(`"${tag}" is not a valid email address`);
      return false;
    }
    if (existing.some((e) => e.toLowerCase() === tag.toLowerCase())) {
      setError(`"${tag}" was already added`);
      return false;
    }
    setError(null);
    return true;
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="recipients">Recipients</Label>
      <TagsInput
        id="recipients"
        value={emails}
        onValueChange={(next) => {
          setError(null);
          setEmails(next);
        }}
        validate={validate}
        invalid={Boolean(error)}
        chipLeading={<Mail />}
        chipVariant="outline"
        placeholder="name@company.com"
      />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Press <kbd className="rounded bg-muted px-1 font-mono text-[10px]">Enter</kbd>{" "}
          or paste a comma-separated list.
        </p>
      )}
    </div>
  );
}

export const EmailRecipients: Story = {
  args: {},
  render: (): ReactElement => <EmailRecipientsExample />,
};

function MentionsExample(): ReactElement {
  const known = ["ada", "grace", "linus", "rob", "barbara"];
  const [mentions, setMentions] = useState<string[]>(["ada"]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="mentions">Mention people</Label>
      <TagsInput
        id="mentions"
        value={mentions}
        onValueChange={setMentions}
        chipVariant="primary"
        chipLeading={<AtSign />}
        validate={(tag) => known.includes(tag.toLowerCase())}
        placeholder="@username"
      />
      <p className="text-xs text-muted-foreground">
        Try one of:{" "}
        <span className="font-mono text-foreground">{known.join(", ")}</span>
      </p>
    </div>
  );
}

export const Mentions: Story = {
  args: {},
  render: (): ReactElement => <MentionsExample />,
};

export const AllSizes: Story = {
  args: {},
  render: (): ReactElement => (
    <div className="flex w-96 flex-col gap-4">
      {tagsInputSizeIds.map((size) => (
        <div key={size} className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <TagsInput
            size={size}
            defaultValue={[`size-${size}`, "demo"]}
            placeholder="Add a tag…"
          />
        </div>
      ))}
    </div>
  ),
};

export const AllChipVariants: Story = {
  args: {},
  render: (): ReactElement => (
    <div className="flex w-96 flex-col gap-4">
      {chipVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          <TagsInput
            chipVariant={variant}
            defaultValue={["alpha", "beta"]}
            placeholder="Add a tag…"
          />
        </div>
      ))}
    </div>
  ),
};
