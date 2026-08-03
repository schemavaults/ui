import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";

import { CharacterCount } from "./character-count";
import {
  characterCountModeIds,
  characterCountSizeIds,
  characterCountStateIds,
} from "./character-count-variants";
import { Textarea } from "../textarea";
import { Input } from "../input";
import { Label } from "../label";

const meta = {
  title: "Components/CharacterCount",
  component: CharacterCount,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A compact status indicator for form fields that shows the current character or word count against an optional maximum. Automatically transitions through `default → warning → danger` visual states as the value approaches and exceeds the limit, using theme tokens (`muted-foreground`, `warning`, `destructive`) so it stays in-brand across light and dark modes. Pairs naturally with `Input`, `Textarea`, and `PasswordInput`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "text" },
      description:
        "String value to measure, or a pre-computed numeric count.",
    },
    max: {
      control: { type: "number" },
      description: "Optional maximum count.",
    },
    mode: {
      options: characterCountModeIds,
      control: { type: "radio" },
    },
    size: {
      options: characterCountSizeIds,
      control: { type: "radio" },
    },
    state: {
      options: [undefined, ...characterCountStateIds],
      control: { type: "select" },
      description: "Force a visual state (skips auto-computation).",
    },
    warnAtRatio: {
      control: { type: "number", min: 0, max: 1, step: 0.05 },
    },
    showRemaining: {
      control: { type: "boolean" },
    },
  },
  args: {
    value: "Hello, world!",
    max: 100,
    mode: "characters",
    size: "default",
    warnAtRatio: 0.8,
    showRemaining: false,
  },
} satisfies Meta<typeof CharacterCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoMax: Story = {
  args: {
    value: "Just counting, no limit here.",
    max: undefined,
  },
};

export const Warning: Story = {
  args: {
    value: "x".repeat(85),
    max: 100,
  },
};

export const Danger: Story = {
  args: {
    value: "x".repeat(120),
    max: 100,
  },
};

export const ShowRemaining: Story = {
  args: {
    value: "x".repeat(42),
    max: 100,
    showRemaining: true,
  },
};

export const ShowRemainingOverLimit: Story = {
  args: {
    value: "x".repeat(107),
    max: 100,
    showRemaining: true,
  },
};

export const WordMode: Story = {
  args: {
    value: "The quick brown fox jumps over the lazy dog.",
    max: 20,
    mode: "words",
  },
};

export const Small: Story = {
  args: {
    value: "hello",
    max: 30,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    value: "hello",
    max: 30,
    size: "lg",
  },
};

export const NumericValue: Story = {
  args: {
    value: 47,
    max: 60,
  },
};

export const CustomFormatter: Story = {
  args: {
    value: "x".repeat(65),
    max: 100,
    format: ({ used, max, state }) => (
      <>
        <span>{used}</span>
        <span aria-hidden="true">·</span>
        <span>{max ?? "∞"}</span>
        <span aria-hidden="true" className="opacity-60">
          ({state})
        </span>
      </>
    ),
  },
};

function TextareaWithCounter(): ReactElement {
  const [value, setValue] = useState<string>("Type here to see the counter react.");
  const max = 140;
  return (
    <div className="flex w-[420px] flex-col gap-1.5">
      <Label htmlFor="tweet-input">What&rsquo;s happening?</Label>
      <Textarea
        id="tweet-input"
        value={value}
        onChange={(event): void => setValue(event.target.value)}
        rows={4}
        maxLength={max * 2}
      />
      <div className="flex justify-end">
        <CharacterCount
          data-testid="counter"
          value={value}
          max={max}
          showRemaining
        />
      </div>
    </div>
  );
}

export const WithTextarea: Story = {
  render: () => <TextareaWithCounter />,
  parameters: {
    docs: {
      description: {
        story:
          "Common pairing: a `Textarea` with a live character counter beneath it. The counter transitions to warning at 80% of the limit and to danger once the value exceeds `max`.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByLabelText(/What.s happening/);
    const counter = canvas.getByTestId("counter");

    await waitFor(() => {
      expect(counter).toHaveAttribute("data-state", "default");
    });

    await userEvent.clear(textarea);
    await userEvent.type(textarea, "x".repeat(120));
    await waitFor(() => {
      expect(counter).toHaveAttribute("data-state", "warning");
    });

    await userEvent.type(textarea, "y".repeat(30));
    await waitFor(() => {
      expect(counter).toHaveAttribute("data-state", "danger");
    });
  },
};

function InputWithCounter(): ReactElement {
  const [value, setValue] = useState<string>("");
  const max = 24;
  return (
    <div className="flex w-[320px] flex-col gap-1.5">
      <Label htmlFor="handle-input">Username</Label>
      <Input
        id="handle-input"
        value={value}
        placeholder="e.g. ada-lovelace"
        onChange={(event): void => setValue(event.target.value)}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Letters, numbers and dashes only.
        </span>
        <CharacterCount value={value} max={max} />
      </div>
    </div>
  );
}

export const WithInput: Story = {
  render: () => <InputWithCounter />,
  parameters: {
    docs: {
      description: {
        story:
          "The counter works equally well next to a single-line `Input`, e.g. for username or slug fields.",
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3 text-left">
      <div className="flex items-center gap-3">
        <span className="w-20 text-xs text-muted-foreground">default</span>
        <CharacterCount value={20} max={100} />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 text-xs text-muted-foreground">warning</span>
        <CharacterCount value={85} max={100} />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 text-xs text-muted-foreground">danger</span>
        <CharacterCount value={120} max={100} />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 text-xs text-muted-foreground">no max</span>
        <CharacterCount value="The quick brown fox jumped." />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 text-xs text-muted-foreground">words</span>
        <CharacterCount
          value="The quick brown fox jumped over"
          max={10}
          mode="words"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Visual survey of every automatically-derived state, plus the no-max and word-count modes.",
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 text-left">
      <div className="flex items-center gap-3">
        <span className="w-16 text-xs text-muted-foreground">sm</span>
        <CharacterCount size="sm" value={42} max={100} />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-16 text-xs text-muted-foreground">default</span>
        <CharacterCount size="default" value={42} max={100} />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-16 text-xs text-muted-foreground">lg</span>
        <CharacterCount size="lg" value={42} max={100} />
      </div>
    </div>
  ),
};
