import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";

import { KeyValueEditor, type KeyValueEntry } from "./key-value-editor";
import {
  keyValueEditorKeyFormatIds,
  keyValueEditorSizeIds,
} from "./key-value-editor-variants";
import { serializeDotenv } from "./parse-dotenv";

const ENV_VARS: KeyValueEntry[] = [
  { key: "NODE_ENV", value: "production" },
  {
    key: "DATABASE_URL",
    value: "postgres://vault:s3cr3t@db.internal:5432/app",
    secret: true,
  },
  { key: "SCHEMAVAULTS_API_KEY", value: "svlts_pk_9f2c7a1e4b", secret: true },
  { key: "LOG_LEVEL", value: "info" },
];

const ENV_VAR_PATTERN = /^[A-Z_][A-Z0-9_]*$/;

const meta = {
  title: "Forms/KeyValueEditor",
  component: KeyValueEditor,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Editable list of key/value rows — environment variables, HTTP headers, labels or metadata. Supports controlled and uncontrolled use, `.env` paste (paste `KEY=value` lines into any key field to split them into rows), per-row secret masking with reveal, `UPPER_SNAKE_CASE` key formatting, duplicate-key and pattern validation, a row cap, and read-only/disabled states. Pair it with the exported `parseDotenv` / `serializeDotenv` helpers to import or export `.env` files.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { options: keyValueEditorSizeIds, control: { type: "radio" } },
    keyFormat: {
      options: keyValueEditorKeyFormatIds,
      control: { type: "radio" },
    },
    allowSecrets: { control: { type: "boolean" } },
    validateDuplicates: { control: { type: "boolean" } },
    parseDotenvOnPaste: { control: { type: "boolean" } },
    hideHeader: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    readOnly: { control: { type: "boolean" } },
    maxRows: { control: { type: "number" } },
  },
  args: {
    size: "default",
    keyFormat: "none",
    allowSecrets: false,
    validateDuplicates: true,
    parseDotenvOnPaste: true,
    hideHeader: false,
    disabled: false,
    readOnly: false,
    ariaLabel: "Key/value editor",
    onValueChange: fn(),
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[36rem] max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof KeyValueEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnvironmentVariables: Story = {
  args: {
    defaultValue: ENV_VARS,
    keyFormat: "env",
    allowSecrets: true,
    keyPattern: ENV_VAR_PATTERN,
    keyPatternMessage: "Use UPPER_SNAKE_CASE, not starting with a digit",
    keyLabel: "Name",
    keyPlaceholder: "VARIABLE_NAME",
    addLabel: "Add variable",
    ariaLabel: "Environment variables",
  },
};

export const HttpHeaders: Story = {
  args: {
    defaultValue: [
      { key: "Content-Type", value: "application/json" },
      { key: "Accept", value: "application/json" },
      { key: "X-Request-Id", value: "7d1e0c3a" },
    ],
    keyLabel: "Header",
    keyPlaceholder: "Header-Name",
    valuePlaceholder: "header value",
    addLabel: "Add header",
    ariaLabel: "Request headers",
  },
};

export const Empty: Story = {
  args: {
    defaultValue: [],
    emptyState: "No labels yet. Add one, or paste KEY=value lines.",
    addLabel: "Add label",
  },
};

export const ValidationErrors: Story = {
  args: {
    defaultValue: [
      { key: "API_URL", value: "https://api.schemavaults.com" },
      { key: "API_URL", value: "https://staging.schemavaults.com" },
      { key: "9LIVES", value: "true" },
      { key: "", value: "orphaned value" },
    ],
    keyPattern: ENV_VAR_PATTERN,
    keyPatternMessage: "Must not start with a digit",
  },
};

export const MaxRows: Story = {
  args: {
    defaultValue: [
      { key: "team", value: "platform" },
      { key: "tier", value: "gold" },
    ],
    maxRows: 3,
    addLabel: "Add tag",
  },
};

export const Small: Story = {
  args: { size: "sm", defaultValue: ENV_VARS.slice(0, 2), allowSecrets: true },
};

export const Large: Story = {
  args: { size: "lg", defaultValue: ENV_VARS.slice(0, 2), allowSecrets: true },
};

export const ReadOnly: Story = {
  args: { defaultValue: ENV_VARS, allowSecrets: true, readOnly: true },
};

export const Disabled: Story = {
  args: { defaultValue: ENV_VARS, allowSecrets: true, disabled: true },
};

function ControlledWithDotenvPreview(): ReactElement {
  const [entries, setEntries] = useState<KeyValueEntry[]>(ENV_VARS.slice(0, 2));
  return (
    <div className="flex flex-col gap-4">
      <KeyValueEditor
        value={entries}
        onValueChange={setEntries}
        keyFormat="env"
        allowSecrets
        ariaLabel="Environment variables"
        addLabel="Add variable"
      />
      <pre
        data-testid="dotenv-preview"
        className="overflow-x-auto rounded-md border border-border bg-muted p-3 font-mono text-xs text-muted-foreground"
      >
        {serializeDotenv(entries) || "# .env is empty"}
      </pre>
    </div>
  );
}

export const ControlledDotenvPreview: Story = {
  render: (): ReactElement => <ControlledWithDotenvPreview />,
  parameters: {
    docs: {
      description: {
        story:
          "Controlled usage. The block below re-serialises the rows with `serializeDotenv` on every change.",
      },
    },
  },
};

export const AddEditAndRemove: Story = {
  args: { defaultValue: [], keyFormat: "env" },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("add a row and type an env-formatted key", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Add row" }));
      const keyInput = canvas.getByRole("textbox", { name: "Key 1" });
      await waitFor(() => expect(keyInput).toHaveFocus());
      await userEvent.type(keyInput, "api key");
      await expect(keyInput).toHaveValue("API_KEY");
    });

    await step("Enter in the value field adds the next row", async () => {
      const valueInput = canvas.getByRole("textbox", {
        name: "Value for API_KEY",
      });
      await userEvent.type(valueInput, "abc{Enter}");
      await waitFor(() =>
        expect(canvas.getByRole("textbox", { name: "Key 2" })).toHaveFocus(),
      );
    });

    await step("remove the new row", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Remove row 2" }),
      );
      await expect(canvas.queryByRole("textbox", { name: "Key 2" })).toBeNull();
      await expect(args.onValueChange).toHaveBeenLastCalledWith([
        { key: "API_KEY", value: "abc" },
      ]);
    });
  },
};

export const PasteDotenv: Story = {
  args: { defaultValue: [{ key: "", value: "" }] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const keyInput = canvas.getByRole("textbox", { name: "Key 1" });
    await userEvent.click(keyInput);
    await userEvent.paste('# comment\nPORT=8080\nexport HOST="0.0.0.0"');
    await waitFor(() =>
      expect(args.onValueChange).toHaveBeenLastCalledWith([
        { key: "PORT", value: "8080" },
        { key: "HOST", value: "0.0.0.0" },
      ]),
    );
    await expect(canvas.getByRole("textbox", { name: "Key 2" })).toHaveValue(
      "HOST",
    );
  },
};

export const SecretToggleAndReveal: Story = {
  args: {
    defaultValue: [{ key: "TOKEN", value: "hunter2" }],
    allowSecrets: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const valueInput = canvas.getByLabelText("Value for TOKEN");
    await expect(valueInput).toHaveAttribute("type", "text");
    await userEvent.click(
      canvas.getByRole("button", { name: "Mark TOKEN as secret" }),
    );
    await expect(valueInput).toHaveAttribute("type", "password");
    await userEvent.click(
      canvas.getByRole("button", { name: "Reveal value of TOKEN" }),
    );
    await expect(valueInput).toHaveAttribute("type", "text");
  },
};

export const DuplicateKeyIsFlagged: Story = {
  args: { defaultValue: [{ key: "REGION", value: "us-east-1" }] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Add row" }));
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Key 2" }),
      "REGION",
    );
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      'Duplicate key "REGION"',
    );
    await expect(
      canvas.getByRole("textbox", { name: "Key 2" }),
    ).toHaveAttribute("aria-invalid", "true");
  },
};
