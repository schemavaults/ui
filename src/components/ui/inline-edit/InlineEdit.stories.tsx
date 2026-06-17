import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  useEffect,
  useState,
  type ComponentProps,
  type ReactElement,
} from "react";

import { InlineEdit } from "./inline-edit";
import {
  inlineEditSizeIds,
  inlineEditVariantIds,
} from "./inline-edit-variants";

const meta = {
  title: "Components/InlineEdit",
  component: InlineEdit,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A click-to-edit text field for editing values in place. Renders as " +
          "the current label until the user activates it (click, Enter, Space, " +
          "or F2), at which point it swaps in an input with confirm/cancel " +
          "actions. Supports single-line and multi-line modes, async save " +
          "handlers with loading and error states, and the standard SchemaVaults " +
          "size and variant tokens.",
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
    value: { control: { type: "text" } },
    placeholder: { control: { type: "text" } },
    disabled: { control: { type: "boolean" } },
    multiline: { control: { type: "boolean" } },
    showActions: { control: { type: "boolean" } },
    showEditIcon: { control: { type: "boolean" } },
    commitOnBlur: { control: { type: "boolean" } },
    loading: { control: { type: "boolean" } },
    error: { control: { type: "text" } },
  },
  args: {
    value: "Production database",
    placeholder: "Click to edit",
    variant: "default",
    size: "default",
    disabled: false,
    multiline: false,
    showActions: true,
    showEditIcon: true,
    commitOnBlur: true,
    onValueChange: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof InlineEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledStory(
  props: Omit<ComponentProps<typeof InlineEdit>, "value">
    & { initialValue?: string },
): ReactElement {
  const { initialValue = "Production database", onValueChange, ...rest } = props;
  const [value, setValue] = useState<string>(initialValue);
  return (
    <InlineEdit
      {...rest}
      value={value}
      onValueChange={(next, trigger): void => {
        setValue(next);
        onValueChange?.(next, trigger);
      }}
    />
  );
}

export const Default: Story = {
  render: (args): ReactElement => <ControlledStory {...args} />,
};

export const Ghost: Story = {
  args: { variant: "ghost" },
  render: (args): ReactElement => <ControlledStory {...args} />,
};

export const Underline: Story = {
  args: { variant: "underline" },
  render: (args): ReactElement => <ControlledStory {...args} />,
};

export const Empty: Story = {
  args: { placeholder: "Add a description…" },
  render: (args): ReactElement => (
    <ControlledStory {...args} initialValue="" />
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args): ReactElement => <ControlledStory {...args} />,
};

export const WithoutActions: Story = {
  args: {
    showActions: false,
    placeholder: "Press Enter to save",
  },
  render: (args): ReactElement => <ControlledStory {...args} />,
};

export const WithoutEditIcon: Story = {
  args: { showEditIcon: false },
  render: (args): ReactElement => <ControlledStory {...args} />,
};

export const MaxLengthLimited: Story = {
  args: { maxLength: 24 },
  render: (args): ReactElement => (
    <div className="flex flex-col gap-1">
      <ControlledStory {...args} />
      <span className="text-xs text-muted-foreground">
        Limited to 24 characters via <code>maxLength</code>.
      </span>
    </div>
  ),
};

export const Multiline: Story = {
  args: {
    multiline: true,
    placeholder: "Add notes…",
    inputAriaLabel: "Workstream notes",
  },
  render: (args): ReactElement => (
    <div className="w-[26rem]">
      <ControlledStory
        {...args}
        initialValue={
          "Migrating the billing schema from v3 to v4.\n" +
          "Hold rollout until QA confirms the staging report."
        }
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Use <kbd className="rounded bg-muted px-1 font-mono text-[10px]">Enter</kbd>{" "}
        for a new line and{" "}
        <kbd className="rounded bg-muted px-1 font-mono text-[10px]">⌘/Ctrl</kbd>+
        <kbd className="rounded bg-muted px-1 font-mono text-[10px]">Enter</kbd>{" "}
        to save.
      </p>
    </div>
  ),
};

function AsyncSaveStory(): ReactElement {
  const [value, setValue] = useState<string>("vault-prod-eu-west-1");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  return (
    <div className="flex w-[24rem] flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Vault name
      </span>
      <InlineEdit
        value={value}
        inputAriaLabel="Vault name"
        onSave={async (next): Promise<void> => {
          await new Promise((resolve): number =>
            window.setTimeout(resolve, 700),
          );
          if (next.trim().length < 3) {
            throw new Error("Name must be at least 3 characters.");
          }
          setValue(next);
          setSavedAt(new Date().toISOString());
        }}
      />
      <span className="text-xs text-muted-foreground">
        {savedAt === null
          ? "Try editing — saves resolve after 700ms; names shorter than 3 chars throw."
          : `Saved at ${savedAt}`}
      </span>
    </div>
  );
}

export const AsyncSave: Story = {
  render: (): ReactElement => <AsyncSaveStory />,
  parameters: {
    docs: {
      description: {
        story:
          "Pass an `onSave` async handler to coordinate persistence. While the " +
          "promise is in flight the editor disables and dims; if it rejects the " +
          "error message is surfaced inline and the editor stays open so the " +
          "user can correct their input.",
      },
    },
  },
};

export const Loading: Story = {
  args: { loading: true, defaultEditing: true },
  render: (args): ReactElement => <ControlledStory {...args} />,
};

export const WithError: Story = {
  args: {
    defaultEditing: true,
    error: "That name is already taken in this workspace.",
  },
  render: (args): ReactElement => <ControlledStory {...args} />,
};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground">
      {inlineEditVariantIds.map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="w-20 text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          <ControlledStory
            variant={variant}
            inputAriaLabel={`${variant} variant`}
            initialValue={`${variant} variant`}
            onValueChange={fn()}
          />
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground">
      {inlineEditSizeIds.map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-20 text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <ControlledStory
            size={size}
            inputAriaLabel={`${size} size`}
            initialValue={`${size} size`}
            onValueChange={fn()}
          />
        </div>
      ))}
    </div>
  ),
};

function ResourceCardStory(): ReactElement {
  const [name, setName] = useState<string>("Customer billing exports");
  const [description, setDescription] = useState<string>(
    "Nightly dump of invoiced charges with PII redacted for downstream analytics.",
  );

  return (
    <div className="flex w-[28rem] flex-col gap-3 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Vault
      </div>
      <InlineEdit
        value={name}
        variant="ghost"
        size="lg"
        inputAriaLabel="Vault name"
        className="text-lg font-semibold"
        onValueChange={(next): void => setName(next)}
      />
      <InlineEdit
        value={description}
        variant="ghost"
        size="default"
        multiline
        placeholder="Add a description…"
        inputAriaLabel="Vault description"
        className="text-sm text-muted-foreground"
        onValueChange={(next): void => setDescription(next)}
      />
    </div>
  );
}

export const InsideResourceCard: Story = {
  render: (): ReactElement => <ResourceCardStory />,
  parameters: {
    docs: {
      description: {
        story:
          "Typical SchemaVaults pattern: a resource header where the vault's " +
          "name and description are both editable in place without opening a " +
          "modal.",
      },
    },
  },
};

function EditFlowControlled(): ReactElement {
  const [value, setValue] = useState<string>("initial value");

  useEffect((): void => {
    // No-op: ensures controlled state is preserved across re-renders during
    // the interaction test.
  }, [value]);

  return (
    <div className="flex flex-col gap-1">
      <InlineEdit
        value={value}
        inputAriaLabel="Inline edit interaction target"
        onValueChange={(next): void => setValue(next)}
      />
      <span data-testid="inline-edit-current-value" className="text-xs">
        Current value: {value}
      </span>
    </div>
  );
}

export const EditFlowInteraction: Story = {
  render: (): ReactElement => <EditFlowControlled />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);

    const trigger = await canvas.findByRole("button", {
      name: "Inline edit interaction target",
    });
    await userEvent.click(trigger);

    const input = await canvas.findByLabelText(
      "Inline edit interaction target",
    );
    await userEvent.clear(input);
    await userEvent.type(input, "updated value");

    const confirm = await canvas.findByRole("button", { name: "Save" });
    await userEvent.click(confirm);

    await waitFor((): void => {
      expect(canvas.getByTestId("inline-edit-current-value")).toHaveTextContent(
        "Current value: updated value",
      );
    });
  },
};

export const CancelInteraction: Story = {
  render: (): ReactElement => <EditFlowControlled />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);

    const trigger = await canvas.findByRole("button", {
      name: "Inline edit interaction target",
    });
    await userEvent.click(trigger);

    const input = await canvas.findByLabelText(
      "Inline edit interaction target",
    );
    await userEvent.clear(input);
    await userEvent.type(input, "dropped value{Escape}");

    await waitFor((): void => {
      expect(canvas.getByTestId("inline-edit-current-value")).toHaveTextContent(
        "Current value: initial value",
      );
    });
  },
};
