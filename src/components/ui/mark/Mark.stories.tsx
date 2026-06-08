import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { Search } from "lucide-react";

import { Mark, HighlightedText } from "./mark";
import {
  markSizeIds,
  markStyleIds,
  markVariantIds,
  type MarkVariant,
} from "./mark-variants";

const meta = {
  title: "Components/Mark",
  component: Mark,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Semantic text highlighter rendered as a `<mark>` element. Use directly to emphasize spans of inline text, or via the companion `HighlightedText` component to auto-highlight every occurrence of a search term inside a string. Distinct from `Badge` and `Chip` — `Mark` is meant to live inline inside a sentence (search results, diffs, docs) rather than as a free-standing pill.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: markVariantIds,
      control: { type: "select" },
    },
    markStyle: {
      options: markStyleIds,
      control: { type: "radio" },
    },
    size: {
      options: markSizeIds,
      control: { type: "radio" },
    },
    rounded: { control: { type: "boolean" } },
    animate: { control: { type: "boolean" } },
    children: { control: { type: "text" } },
  },
  args: {
    children: "highlighted",
    variant: "default",
    markStyle: "solid",
    size: "default",
    rounded: false,
    animate: false,
  },
  render: (args): ReactElement => (
    <p className="max-w-md text-base leading-relaxed text-foreground">
      The most important word in this sentence is <Mark {...args} />,
      and the rest is just context.
    </p>
  ),
} satisfies Meta<typeof Mark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SolidVariants: Story = {
  name: "Style: Solid — all color variants",
  render: (): ReactElement => (
    <div className="flex max-w-xl flex-col gap-3 text-sm leading-relaxed">
      {markVariantIds.map((variant) => (
        <p key={variant} className="text-foreground">
          <span className="inline-block w-24 text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          The schema migration was{" "}
          <Mark variant={variant} markStyle="solid">
            executed successfully
          </Mark>{" "}
          at 09:42 UTC.
        </p>
      ))}
    </div>
  ),
};

export const SoftVariants: Story = {
  name: "Style: Soft — all color variants",
  render: (): ReactElement => (
    <div className="flex max-w-xl flex-col gap-3 text-sm leading-relaxed">
      {markVariantIds.map((variant) => (
        <p key={variant} className="text-foreground">
          <span className="inline-block w-24 text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          The schema migration was{" "}
          <Mark variant={variant} markStyle="soft">
            executed successfully
          </Mark>{" "}
          at 09:42 UTC.
        </p>
      ))}
    </div>
  ),
};

export const UnderlineVariants: Story = {
  name: "Style: Underline — all color variants",
  render: (): ReactElement => (
    <div className="flex max-w-xl flex-col gap-3 text-sm leading-relaxed">
      {markVariantIds.map((variant) => (
        <p key={variant} className="text-foreground">
          <span className="inline-block w-24 text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          The schema migration was{" "}
          <Mark variant={variant} markStyle="underline">
            executed successfully
          </Mark>{" "}
          at 09:42 UTC.
        </p>
      ))}
    </div>
  ),
};

export const OutlineVariants: Story = {
  name: "Style: Outline — all color variants",
  render: (): ReactElement => (
    <div className="flex max-w-xl flex-col gap-3 text-sm leading-relaxed">
      {markVariantIds.map((variant) => (
        <p key={variant} className="text-foreground">
          <span className="inline-block w-24 text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          The schema migration was{" "}
          <Mark variant={variant} markStyle="outline">
            executed successfully
          </Mark>{" "}
          at 09:42 UTC.
        </p>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-4 text-base">
      {markSizeIds.map((size) => (
        <p key={size}>
          <span className="mr-2 inline-block w-20 text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          The word <Mark size={size}>{size}</Mark> uses the {size} preset.
        </p>
      ))}
    </div>
  ),
};

export const Rounded: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-3 text-base">
      <p>
        Default corners:{" "}
        <Mark variant="primary" markStyle="soft">
          primary soft
        </Mark>
      </p>
      <p>
        Rounded corners:{" "}
        <Mark variant="primary" markStyle="soft" rounded>
          primary soft (rounded)
        </Mark>
      </p>
    </div>
  ),
};

function AnimatedRevealExample(): ReactElement {
  const [tick, setTick] = useState(0);
  return (
    <div className="flex max-w-md flex-col items-start gap-3 text-base">
      <p key={tick}>
        When the budget review wrapped, the team was{" "}
        <Mark variant="success" markStyle="solid" animate>
          relieved and elated
        </Mark>
        .
      </p>
      <button
        type="button"
        onClick={() => setTick((t) => t + 1)}
        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent"
      >
        Replay animation
      </button>
      <p className="text-xs text-muted-foreground">
        Re-mounts the paragraph so the CSS reveal restarts. The{" "}
        <code>animate</code> prop is most useful when highlighting the first
        time content streams in.
      </p>
    </div>
  );
}

export const AnimatedReveal: Story = {
  name: "Animated highlight reveal",
  render: (): ReactElement => <AnimatedRevealExample />,
};

export const InsideHeadings: Story = {
  render: (): ReactElement => (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Ship safer with{" "}
        <Mark variant="primary" markStyle="soft" rounded>
          schema-aware
        </Mark>{" "}
        migrations
      </h1>
      <h2 className="text-xl font-semibold text-foreground">
        Catch{" "}
        <Mark variant="destructive" markStyle="underline">
          breaking changes
        </Mark>{" "}
        before they reach production
      </h2>
      <p className="text-sm text-muted-foreground">
        Mark inherits font size from its parent, so the highlight scales
        automatically across heading levels.
      </p>
    </div>
  ),
};

// =============================================================================
// HighlightedText — auto-wrap matches inside a longer text
// =============================================================================

function SearchHighlightExample(): ReactElement {
  const corpus =
    "Schema migrations are the lifeblood of evolving systems. A schema change " +
    "should be tracked, reviewed, and reversible. When teams skip schema review, " +
    "production incidents follow.";

  const [query, setQuery] = useState("schema");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  return (
    <div className="flex w-[36rem] max-w-full flex-col gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground">
      <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
        <Search aria-hidden className="size-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <label className="inline-flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(event) => setCaseSensitive(event.target.checked)}
          />
          Case sensitive
        </label>
        <label className="inline-flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            checked={wholeWord}
            onChange={(event) => setWholeWord(event.target.checked)}
          />
          Whole word
        </label>
      </div>
      <p className="text-sm leading-relaxed">
        <HighlightedText
          text={corpus}
          match={query}
          caseSensitive={caseSensitive}
          wholeWord={wholeWord}
          variant="default"
          markStyle="solid"
        />
      </p>
    </div>
  );
}

export const SearchHighlight: StoryObj = {
  name: "HighlightedText — search results",
  render: (): ReactElement => <SearchHighlightExample />,
};

export const MultipleTokens: StoryObj = {
  name: "HighlightedText — multiple tokens, mixed variants",
  render: (): ReactElement => {
    const text =
      "On Tuesday, the deploy succeeded but the canary failed health checks. " +
      "The rollback completed in 42 seconds with no data loss.";
    return (
      <div className="flex max-w-xl flex-col gap-3 text-sm leading-relaxed">
        <p>
          <HighlightedText
            text={text}
            match={["succeeded", "rollback", "no data loss"]}
            variant="success"
            markStyle="soft"
            rounded
          />
        </p>
        <p>
          <HighlightedText
            text={text}
            match={["failed", "canary"]}
            variant="destructive"
            markStyle="soft"
            rounded
          />
        </p>
        <p className="text-xs text-muted-foreground">
          Pass an array of tokens to highlight every one — the regex is
          built and memoized internally.
        </p>
      </div>
    );
  },
};

export const RegExpMatch: StoryObj = {
  name: "HighlightedText — RegExp pattern",
  render: (): ReactElement => (
    <p className="max-w-xl text-sm leading-relaxed">
      <HighlightedText
        text="Errors observed at 09:42:11, again at 11:07:54, and one more at 14:30:00 UTC."
        match={/\d{2}:\d{2}:\d{2}/}
        variant="warning"
        markStyle="solid"
        rounded
      />
    </p>
  ),
};

function VariantMatrixExample(): ReactElement {
  const [activeVariant, setActiveVariant] = useState<MarkVariant>("primary");
  return (
    <div className="flex max-w-xl flex-col gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground">
      <div className="flex flex-wrap gap-2">
        {markVariantIds.map((variant) => (
          <button
            key={variant}
            type="button"
            onClick={() => setActiveVariant(variant)}
            className={`rounded-md border px-2.5 py-1 text-xs ${
              activeVariant === variant
                ? "border-foreground bg-foreground text-background"
                : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {variant}
          </button>
        ))}
      </div>
      <p className="text-sm leading-relaxed">
        {markStyleIds.map((style, index) => (
          <span key={style}>
            {index > 0 ? " " : null}
            <Mark variant={activeVariant} markStyle={style}>
              {style}
            </Mark>
            {index < markStyleIds.length - 1 ? "," : "."}
          </span>
        ))}
      </p>
      <p className="text-xs text-muted-foreground">
        Pick a color above to preview every <code>markStyle</code> with that
        variant.
      </p>
    </div>
  );
}

export const InteractiveMatrix: StoryObj = {
  name: "Interactive variant × style matrix",
  render: (): ReactElement => <VariantMatrixExample />,
};
