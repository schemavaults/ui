import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type RefObject,
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
  title: "AI & Chat/PromptInput",
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
          "so it inherits both brightness themes and org scopes.\n\n" +
          "The textarea never rests below `rows` lines. Pass `resizable` to " +
          "let the user drag it taller or shorter: the height they choose " +
          "becomes the floor that auto-resize grows from, and it survives " +
          "typing and submit. Pass `autoResize={false}` for a plain " +
          "textarea sized only by `rows` and CSS. The form never shrinks in " +
          "a flex column, so a toolbar below the textarea is never clipped.",
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
/* Shared helpers for the sizing stories                              */
/* ------------------------------------------------------------------ */

/** Tracks the height of the first textarea inside `containerRef`. */
function useTextareaHeightPx(
  containerRef: RefObject<HTMLDivElement | null>,
): number {
  const [heightPx, setHeightPx] = useState<number>(0);

  useEffect((): (() => void) | void => {
    const container = containerRef.current;
    if (container === null) return;
    const textarea = container.querySelector("textarea");
    if (textarea === null) return;
    const observer = new ResizeObserver((entries): void => {
      const size = entries[0]?.borderBoxSize[0];
      if (size !== undefined) setHeightPx(Math.round(size.blockSize));
    });
    observer.observe(textarea, { box: "border-box" });
    return (): void => observer.disconnect();
  }, [containerRef]);

  return heightPx;
}

/** Resolves after the next rendering step, once ResizeObservers have run. */
function nextFrame(): Promise<void> {
  return new Promise((resolve): void => {
    requestAnimationFrame((): void => {
      requestAnimationFrame((): void => resolve());
    });
  });
}

/**
 * Dragging a textarea's resize handle makes the browser write the new size
 * as an inline height. A play function cannot drive the native handle, so it
 * writes that height itself.
 */
async function simulateResizeDrag(
  textarea: HTMLElement,
  heightPx: number,
): Promise<void> {
  textarea.style.height = `${heightPx}px`;
  await nextFrame();
}

/* ------------------------------------------------------------------ */
/* AutoResize — textarea grows with content, stops at maxHeightPx     */
/* ------------------------------------------------------------------ */

function AutoResizeDemo(): ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heightPx = useTextareaHeightPx(containerRef);

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
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const textarea = await canvas.findByLabelText(
      "Prompt auto-resize input",
    );
    expect(getComputedStyle(textarea).resize).toBe("none");
    const restingHeight: number = textarea.offsetHeight;

    await userEvent.type(
      textarea,
      "one{Shift>}{Enter}{/Shift}two{Shift>}{Enter}{/Shift}three",
    );
    const threeLineHeight: number = textarea.offsetHeight;
    expect(threeLineHeight).toBeGreaterThan(restingHeight);

    // Without `resizable`, a height from outside lasts until the next keystroke.
    await simulateResizeDrag(textarea, 300);
    await userEvent.type(textarea, "!");
    expect(textarea.offsetHeight).toBe(threeLineHeight);

    // Grows to maxHeightPx, then scrolls.
    await userEvent.type(
      textarea,
      "{Shift>}{Enter}{/Shift}more".repeat(12),
    );
    expect(textarea.offsetHeight).toBe(200);
    expect(textarea.style.overflowY).toBe("auto");
  },
};

/* ------------------------------------------------------------------ */
/* Resizable — the user's dragged height becomes the floor            */
/* ------------------------------------------------------------------ */

function ResizableDemo(): ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heightPx = useTextareaHeightPx(containerRef);
  const [value, setValue] = useState<string>("");

  return (
    <div ref={containerRef} className="flex w-[520px] flex-col gap-3">
      <div
        data-testid="prompt-input-textarea-height"
        className="rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
      >
        Textarea height: <span className="font-mono">{heightPx}px</span>
      </div>
      <PromptInput
        variant="elevated"
        value={value}
        onValueChange={setValue}
        onSubmit={(): void => setValue("")}
      >
        <PromptInputTextarea
          resizable
          placeholder="Drag the bottom-right corner to resize…"
          aria-label="Prompt resizable input"
          maxHeightPx={320}
        />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputHint>
              Your height sticks through typing and sending
            </PromptInputHint>
          </PromptInputActions>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

export const Resizable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`resizable` swaps `resize-none` for `resize-y`. The height the " +
          "user drags to becomes the textarea's floor: typing keeps it, " +
          "content still grows above it (up to `maxHeightPx`, or the " +
          "dragged height if that is taller), and it survives submit " +
          "clearing the value. Dragging smaller lowers the floor, but never " +
          "below `rows` or the size's minimum height.",
      },
    },
  },
  render: (): ReactElement => <ResizableDemo />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const textarea = await canvas.findByLabelText(
      "Prompt resizable input",
    );
    expect(getComputedStyle(textarea).resize).toBe("vertical");
    const restingHeight: number = textarea.offsetHeight;

    await userEvent.type(textarea, "Draft a reply");
    await simulateResizeDrag(textarea, 300);
    await userEvent.type(textarea, "!");
    expect(textarea.offsetHeight).toBe(300);

    // Submitting clears the value; the dragged height stays.
    await userEvent.keyboard("{Enter}");
    await waitFor((): void => {
      expect(textarea).toHaveValue("");
    });
    expect(textarea.offsetHeight).toBe(300);

    // Content grows past the dragged height, up to maxHeightPx.
    await userEvent.type(textarea, "{Shift>}{Enter}{/Shift}line".repeat(20));
    expect(textarea.offsetHeight).toBe(320);
    expect(textarea.style.overflowY).toBe("auto");
    await userEvent.clear(textarea);
    expect(textarea.offsetHeight).toBe(300);

    // Dragging smaller lowers the floor…
    await simulateResizeDrag(textarea, 120);
    await userEvent.type(textarea, "a");
    expect(textarea.offsetHeight).toBe(120);

    // …but never below the size's minimum height.
    await simulateResizeDrag(textarea, 10);
    await userEvent.type(textarea, "b");
    expect(textarea.offsetHeight).toBe(restingHeight);
  },
};

/* ------------------------------------------------------------------ */
/* WithRows — rows is the resting height                              */
/* ------------------------------------------------------------------ */

export const WithRows: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`rows` is the fewest lines the textarea shows: it rests at four " +
          "lines here, and still grows with its content past them.",
      },
    },
  },
  render: (args): ReactElement => (
    <div className="w-[520px]">
      <PromptInput {...args}>
        <PromptInputTextarea
          rows={4}
          placeholder="Paste a longer brief…"
          aria-label="Prompt four-row input"
        />
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
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const textarea = await canvas.findByLabelText(
      "Prompt four-row input",
    );
    const style = getComputedStyle(textarea);
    const lineHeight: number = Number.parseFloat(style.lineHeight);
    const fourLineHeight: number =
      4 * lineHeight +
      Number.parseFloat(style.paddingTop) +
      Number.parseFloat(style.paddingBottom);
    expect(textarea.offsetHeight).toBeGreaterThanOrEqual(fourLineHeight);

    await userEvent.type(textarea, "{Shift>}{Enter}{/Shift}more".repeat(5));
    expect(textarea.offsetHeight).toBeGreaterThanOrEqual(
      fourLineHeight + 2 * lineHeight,
    );
  },
};

/* ------------------------------------------------------------------ */
/* ResizableWithRows — a drag stops at the rows floor                 */
/* ------------------------------------------------------------------ */

export const ResizableWithRows: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "With `resizable`, the `rows` floor is also the textarea's CSS " +
          "`min-height`, so dragging the handle up stops at four lines " +
          "rather than at the size's smaller `min-h-*`, and nothing jumps " +
          "back when the user starts typing.",
      },
    },
  },
  render: (args): ReactElement => (
    <div className="w-[520px]">
      <PromptInput {...args}>
        <PromptInputTextarea
          rows={4}
          resizable
          placeholder="Drag the corner up — it stops at four lines…"
          aria-label="Prompt resizable four-row input"
        />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputHint>Never fewer than four lines</PromptInputHint>
          </PromptInputActions>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const textarea = await canvas.findByLabelText(
      "Prompt resizable four-row input",
    );
    const style = getComputedStyle(textarea);
    const fourRowFloor: number =
      4 * Number.parseFloat(style.lineHeight) +
      Number.parseFloat(style.paddingTop) +
      Number.parseFloat(style.paddingBottom) +
      Number.parseFloat(style.borderTopWidth) +
      Number.parseFloat(style.borderBottomWidth);
    expect(textarea.offsetHeight).toBe(fourRowFloor);

    // The drag itself stops at the floor…
    await simulateResizeDrag(textarea, 10);
    expect(textarea.offsetHeight).toBe(fourRowFloor);

    // …so typing afterwards has nothing to snap back.
    await userEvent.type(textarea, "a");
    expect(textarea.offsetHeight).toBe(fourRowFloor);
  },
};

/* ------------------------------------------------------------------ */
/* PlainTextarea — autoResize={false}                                 */
/* ------------------------------------------------------------------ */

export const PlainTextarea: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`autoResize={false}` turns off auto-resize: the textarea is " +
          "`rows` tall and scrolls its content. With `resizable` the user " +
          "can still drag it to any height.",
      },
    },
  },
  render: (args): ReactElement => (
    <div className="w-[520px]">
      <PromptInput {...args}>
        <PromptInputTextarea
          autoResize={false}
          resizable
          rows={5}
          placeholder="A fixed five-line box…"
          aria-label="Prompt plain input"
        />
        <PromptInputToolbar>
          <PromptInputActions>
            <PromptInputHint>Scrolls instead of growing</PromptInputHint>
          </PromptInputActions>
          <PromptInputSubmit />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const textarea = await canvas.findByLabelText(
      "Prompt plain input",
    );
    const restingHeight: number = textarea.offsetHeight;

    await userEvent.type(textarea, "{Shift>}{Enter}{/Shift}line".repeat(8));
    expect(textarea.offsetHeight).toBe(restingHeight);
    expect(textarea.scrollHeight).toBeGreaterThan(textarea.clientHeight);

    await simulateResizeDrag(textarea, 250);
    await userEvent.type(textarea, "!");
    expect(textarea.offsetHeight).toBe(250);

    // Without auto-resize, a drag still stops at `rows`.
    await simulateResizeDrag(textarea, 10);
    expect(textarea.offsetHeight).toBe(restingHeight);
  },
};

/* ------------------------------------------------------------------ */
/* InFlexColumn — a full-height pane above never squeezes the form    */
/* ------------------------------------------------------------------ */

const FLEX_COLUMN_MESSAGES: readonly string[] = [
  "Can you summarise the last migration?",
  "It adds an org_id column to users and backfills it from memberships.",
  "Does it need a lock on the users table?",
  "Only briefly: the backfill runs in batches of 1,000 rows.",
  "Great. Draft the rollout note for the team.",
];

export const InFlexColumn: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A chat page: a message pane that takes the full height (like " +
          "`AgentChatMessages`) above a resizable prompt, in a fixed-height " +
          "flex column. The prompt keeps its full height — and its toolbar " +
          "stays visible — however tall the user drags it; the pane gives " +
          "up the space.",
      },
    },
  },
  render: (args): ReactElement => (
    <div className="flex h-[360px] w-[520px] flex-col gap-3 rounded-xl border border-border bg-card p-3 text-card-foreground">
      <div className="flex h-full flex-col gap-2 overflow-y-auto rounded-md bg-muted/30 p-3 text-sm">
        {FLEX_COLUMN_MESSAGES.map((message, index) => (
          <p
            key={message}
            className={
              index % 2 === 0
                ? "self-end rounded-lg bg-primary px-3 py-2 text-primary-foreground"
                : "self-start rounded-lg bg-background px-3 py-2"
            }
          >
            {message}
          </p>
        ))}
      </div>
      <PromptInput {...args} variant="elevated">
        <PromptInputTextarea
          resizable
          placeholder="Reply…"
          aria-label="Prompt flex column input"
        />
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
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const textarea = await canvas.findByLabelText(
      "Prompt flex column input",
    );
    const form = textarea.closest("form");
    if (form === null) throw new Error("The textarea is not inside a form.");
    const submit = canvas.getByRole("button", { name: "Send message" });

    const expectFormUnclipped = (): void => {
      expect(form.scrollHeight).toBeLessThanOrEqual(form.clientHeight);
      expect(submit.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        form.getBoundingClientRect().bottom,
      );
    };

    expectFormUnclipped();

    await simulateResizeDrag(textarea, 180);
    await userEvent.type(textarea, "Ship it");
    expect(textarea.offsetHeight).toBe(180);
    expectFormUnclipped();
  },
};
