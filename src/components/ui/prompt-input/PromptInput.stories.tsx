import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import {
  ArrowUp,
  AtSign,
  Globe,
  Mic,
  Paperclip,
  Search,
  Sparkles,
} from "lucide-react";

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputCharCount,
  PromptInputHint,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  promptInputSizeIds,
  promptInputVariantIds,
} from "./prompt-input";

const meta = {
  title: "Components/PromptInput",
  component: PromptInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A composable AI/chat prompt input. Renders an auto-resizing " +
          "textarea, an actions toolbar, and a submit button that swaps to " +
          "a Stop button while `isLoading` is true. Enter submits, " +
          "Shift+Enter inserts a newline. Uses SchemaVaults theme tokens " +
          "(border-input, bg-background, muted, ring, primary, destructive) " +
          "so it inherits both brightness themes and org scopes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { options: promptInputVariantIds, control: { type: "radio" } },
    size: { options: promptInputSizeIds, control: { type: "radio" } },
    isLoading: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    maxLength: { control: { type: "number" } },
  },
  args: {
    variant: "default",
    size: "default",
    isLoading: false,
    disabled: false,
    onSubmit: fn(),
    onStop: fn(),
    onValueChange: fn(),
  },
} satisfies Meta<typeof PromptInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Default — minimal chat-style prompt input                          */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  render: (args): ReactElement => (
    <div className="w-[520px]">
      <PromptInput {...args}>
        <PromptInputTextarea placeholder="Ask anything…" />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputAction aria-label="Attach file">
              <Paperclip aria-hidden="true" className="h-4 w-4" />
            </PromptInputAction>
            <PromptInputAction aria-label="Voice input">
              <Mic aria-hidden="true" className="h-4 w-4" />
            </PromptInputAction>
          </PromptInputActions>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Elevated — pill-shaped, shadowed variant                           */
/* ------------------------------------------------------------------ */

export const Elevated: Story = {
  args: { variant: "elevated" },
  render: (args): ReactElement => (
    <div className="w-[560px]">
      <PromptInput {...args}>
        <PromptInputTextarea placeholder="What would you like to build today?" />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputAction aria-label="Attach file">
              <Paperclip aria-hidden="true" className="h-4 w-4" />
            </PromptInputAction>
            <PromptInputAction aria-label="Search the web">
              <Globe aria-hidden="true" className="h-4 w-4" />
            </PromptInputAction>
            <PromptInputAction aria-label="Mention teammate">
              <AtSign aria-hidden="true" className="h-4 w-4" />
            </PromptInputAction>
          </PromptInputActions>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Filled — softer muted background                                   */
/* ------------------------------------------------------------------ */

export const Filled: Story = {
  args: { variant: "filled" },
  render: (args): ReactElement => (
    <div className="w-[520px]">
      <PromptInput {...args}>
        <PromptInputTextarea placeholder="Reply to Claude…" />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputAction aria-label="Attach file">
              <Paperclip aria-hidden="true" className="h-4 w-4" />
            </PromptInputAction>
          </PromptInputActions>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Ghost — bare surface for embedding inside other cards              */
/* ------------------------------------------------------------------ */

export const Ghost: Story = {
  args: { variant: "ghost" },
  render: (args): ReactElement => (
    <div className="w-[520px] rounded-lg border border-border bg-card p-3">
      <PromptInput {...args}>
        <PromptInputTextarea placeholder="Note for the team…" />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputAction aria-label="Mention teammate">
              <AtSign aria-hidden="true" className="h-4 w-4" />
            </PromptInputAction>
          </PromptInputActions>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Loading — submit button swaps to a Stop control                    */
/* ------------------------------------------------------------------ */

export const Loading: Story = {
  args: { isLoading: true, variant: "elevated" },
  render: (args): ReactElement => (
    <div className="w-[520px]">
      <PromptInput {...args} defaultValue="Generating a response…">
        <PromptInputTextarea placeholder="Ask anything…" />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputAction aria-label="Attach file" disabled>
              <Paperclip aria-hidden="true" className="h-4 w-4" />
            </PromptInputAction>
          </PromptInputActions>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Disabled                                                           */
/* ------------------------------------------------------------------ */

export const Disabled: Story = {
  args: { disabled: true },
  render: (args): ReactElement => (
    <div className="w-[520px]">
      <PromptInput {...args} defaultValue="Sign in to send a prompt.">
        <PromptInputTextarea placeholder="Ask anything…" />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputAction aria-label="Attach file">
              <Paperclip aria-hidden="true" className="h-4 w-4" />
            </PromptInputAction>
          </PromptInputActions>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* WithCharacterLimit — shows PromptInputCharCount + warn/over states */
/* ------------------------------------------------------------------ */

export const WithCharacterLimit: Story = {
  args: { maxLength: 60, variant: "elevated" },
  render: (args): ReactElement => (
    <div className="w-[520px]">
      <PromptInput
        {...args}
        defaultValue="Draft a onboarding welcome message for new SchemaVaults users"
      >
        <PromptInputTextarea placeholder="Compose a short prompt…" />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputHint>Shift+Enter for newline</PromptInputHint>
          </PromptInputActions>
          <div className="flex items-center gap-2">
            <PromptInputCharCount />
            <PromptInputSubmit />
          </div>
        </PromptInputToolbar>
      </PromptInput>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* WithHint                                                           */
/* ------------------------------------------------------------------ */

export const WithHint: Story = {
  render: (args): ReactElement => (
    <div className="w-[520px]">
      <PromptInput {...args}>
        <PromptInputTextarea placeholder="Describe what you want to change…" />
        <PromptInputToolbar>
          <PromptInputHint>
            Press <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px] font-mono">Enter</kbd>{" "}
            to send, <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px] font-mono">Shift</kbd>+
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px] font-mono">Enter</kbd>{" "}
            for a newline.
          </PromptInputHint>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* AllSizes                                                           */
/* ------------------------------------------------------------------ */

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex w-[560px] flex-col gap-6">
      {promptInputSizeIds.map((size) => (
        <div key={size}>
          <div className="mb-1 text-xs uppercase text-muted-foreground">
            {size}
          </div>
          <PromptInput size={size} variant="elevated">
            <PromptInputTextarea placeholder={`Size = ${size}`} />
            <PromptInputToolbar>
              <PromptInputActions>
                <PromptInputAction aria-label="Attach file">
                  <Paperclip aria-hidden="true" className="h-4 w-4" />
                </PromptInputAction>
              </PromptInputActions>
              <PromptInputSubmit />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* AllVariants                                                        */
/* ------------------------------------------------------------------ */

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="flex w-[560px] flex-col gap-6">
      {promptInputVariantIds.map((variant) => (
        <div key={variant}>
          <div className="mb-1 text-xs uppercase text-muted-foreground">
            {variant}
          </div>
          <PromptInput variant={variant}>
            <PromptInputTextarea placeholder={`Variant = ${variant}`} />
            <PromptInputToolbar>
              <PromptInputActions>
                <PromptInputAction aria-label="Attach file">
                  <Paperclip aria-hidden="true" className="h-4 w-4" />
                </PromptInputAction>
              </PromptInputActions>
              <PromptInputSubmit />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* SchemaVaults example — build-a-schema prompt                       */
/* ------------------------------------------------------------------ */

export const SchemaBuilderExample: Story = {
  render: (): ReactElement => (
    <div className="flex w-[560px] flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Sparkles aria-hidden="true" className="h-4 w-4 text-primary" />
        Describe your schema
      </div>
      <PromptInput
        variant="elevated"
        maxLength={280}
        defaultValue={
          "Users table with id, email, name, and created_at. Add an org_id foreign key to organizations."
        }
      >
        <PromptInputTextarea placeholder="Describe the schema you want to generate…" />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputAction aria-label="Search examples">
              <Search aria-hidden="true" className="h-4 w-4" />
            </PromptInputAction>
            <PromptInputAction aria-label="Attach existing SQL">
              <Paperclip aria-hidden="true" className="h-4 w-4" />
            </PromptInputAction>
          </PromptInputActions>
          <div className="flex items-center gap-2">
            <PromptInputCharCount />
            <PromptInputSubmit>
              Generate
              <ArrowUp aria-hidden="true" className="ml-1.5 h-4 w-4" />
            </PromptInputSubmit>
          </div>
        </PromptInputToolbar>
      </PromptInput>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Controlled example — full ownership of the value & submit          */
/* ------------------------------------------------------------------ */

function ControlledDemo(props: {
  onSubmitted?: (value: string) => void;
}): ReactElement {
  const { onSubmitted } = props;
  const [value, setValue] = useState<string>("");
  const [last, setLast] = useState<string>("");

  const handleSubmit = useCallback(
    (submitted: string): void => {
      setLast(submitted);
      setValue("");
      onSubmitted?.(submitted);
    },
    [onSubmitted],
  );

  return (
    <div className="flex w-[520px] flex-col gap-3">
      <div
        data-testid="prompt-input-last-submitted"
        data-value={last}
        className="whitespace-pre-line rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
      >
        Last submitted: <span className="font-mono">{last || "—"}</span>
      </div>
      <PromptInput
        variant="elevated"
        value={value}
        onValueChange={setValue}
        onSubmit={handleSubmit}
      >
        <PromptInputTextarea
          placeholder="Type a message and press Enter…"
          aria-label="Prompt controlled input"
        />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputHint>Enter to send • Shift+Enter for newline</PromptInputHint>
          </PromptInputActions>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

export const Controlled: Story = {
  render: (): ReactElement => <ControlledDemo onSubmitted={fn()} />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const textarea = await canvas.findByLabelText("Prompt controlled input");

    await userEvent.click(textarea);
    await userEvent.type(textarea, "hello schemavaults");
    await userEvent.keyboard("{Enter}");

    await waitFor((): void => {
      expect(canvas.getByTestId("prompt-input-last-submitted")).toHaveAttribute(
        "data-value",
        "hello schemavaults",
      );
    });

    // After submit the field should have been cleared by our handler.
    expect(textarea).toHaveValue("");
  },
};

/* ------------------------------------------------------------------ */
/* MultilineNewline — Shift+Enter keeps a newline instead of sending  */
/* ------------------------------------------------------------------ */

export const MultilineNewline: Story = {
  render: (): ReactElement => <ControlledDemo />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const textarea = await canvas.findByLabelText("Prompt controlled input");

    await userEvent.click(textarea);
    await userEvent.type(textarea, "line one");
    await userEvent.keyboard("{Shift>}{Enter}{/Shift}");
    await userEvent.type(textarea, "line two");

    // Nothing has been submitted yet — the readout's data-value should still be empty.
    expect(canvas.getByTestId("prompt-input-last-submitted")).toHaveAttribute(
      "data-value",
      "",
    );
    expect(textarea).toHaveValue("line one\nline two");

    await userEvent.keyboard("{Enter}");
    await waitFor((): void => {
      expect(canvas.getByTestId("prompt-input-last-submitted")).toHaveAttribute(
        "data-value",
        "line one\nline two",
      );
    });
  },
};

/* ------------------------------------------------------------------ */
/* LoadingStop — clicking submit while loading fires onStop           */
/* ------------------------------------------------------------------ */

function LoadingStopDemo(): ReactElement {
  const [stopCount, setStopCount] = useState<number>(0);
  return (
    <div className="flex w-[520px] flex-col gap-3">
      <div
        data-testid="prompt-input-stop-count"
        className="rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
      >
        Stops requested: <span className="font-mono">{stopCount}</span>
      </div>
      <PromptInput
        variant="elevated"
        isLoading
        defaultValue="Streaming a very long answer…"
        onStop={(): void => setStopCount((n) => n + 1)}
      >
        <PromptInputTextarea aria-label="Prompt streaming input" />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputHint>Generating…</PromptInputHint>
          </PromptInputActions>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

export const LoadingStop: Story = {
  render: (): ReactElement => <LoadingStopDemo />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const stopButton = await canvas.findByRole("button", {
      name: "Stop generating",
    });
    await userEvent.click(stopButton);
    await waitFor((): void => {
      expect(canvas.getByTestId("prompt-input-stop-count")).toHaveTextContent(
        "Stops requested: 1",
      );
    });
  },
};

/* ------------------------------------------------------------------ */
/* AutoResize — textarea grows with content, stops at maxHeightPx     */
/* ------------------------------------------------------------------ */

function AutoResizeDemo(): ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [heightPx, setHeightPx] = useState<number>(0);

  useEffect((): (() => void) | void => {
    const container = containerRef.current;
    if (container === null) return;
    const textarea = container.querySelector("textarea");
    if (textarea === null) return;
    const observer = new ResizeObserver((entries): void => {
      const entry = entries[0];
      if (entry !== undefined) setHeightPx(Math.round(entry.contentRect.height));
    });
    observer.observe(textarea);
    return (): void => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex w-[520px] flex-col gap-3">
      <div
        data-testid="prompt-input-textarea-height"
        className="rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
      >
        Textarea height: <span className="font-mono">{heightPx}px</span>
      </div>
      <PromptInput variant="elevated">
        <PromptInputTextarea
          placeholder="Try typing multiple lines…"
          aria-label="Prompt auto-resize input"
          maxHeightPx={200}
        />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputHint>Grows to 200px, then scrolls</PromptInputHint>
          </PromptInputActions>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

export const AutoResize: Story = {
  render: (): ReactElement => <AutoResizeDemo />,
};
