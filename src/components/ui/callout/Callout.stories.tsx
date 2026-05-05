import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import {
  Callout,
  CalloutTitle,
  CalloutDescription,
  calloutIntentIds,
  calloutAppearanceIds,
  type CalloutIntentId,
  type CalloutAppearanceId,
} from "./callout";

interface CalloutExampleProps {
  intent?: CalloutIntentId;
  appearance?: CalloutAppearanceId;
  title?: string;
  showTitle?: boolean;
}

function CalloutExample({
  intent,
  appearance,
  title,
  showTitle,
}: CalloutExampleProps): ReactElement {
  return (
    <div className="w-[640px] max-w-full">
      <Callout
        intent={intent}
        appearance={appearance}
        title={title}
        showTitle={showTitle}
      >
        Use callouts to draw attention to information that is supplementary
        to the body content. They are most useful in long-form documents,
        documentation pages, and changelogs. Links inside callouts get a
        subtle underline:{" "}
        <a href="#example">read the spec</a>.
      </Callout>
    </div>
  );
}

const meta = {
  title: "Components/Callout",
  component: CalloutExample,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      options: calloutIntentIds,
      control: { type: "radio" },
    },
    appearance: {
      options: calloutAppearanceIds,
      control: { type: "radio" },
    },
    title: { control: { type: "text" } },
    showTitle: { control: { type: "boolean" } },
  },
  args: {
    intent: "note",
    appearance: "accent-bar",
    showTitle: true,
  },
} satisfies Meta<typeof CalloutExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Note: Story = {
  args: { intent: "note" },
};

export const Tip: Story = {
  args: { intent: "tip" },
};

export const Important: Story = {
  args: { intent: "important" },
};

export const Warning: Story = {
  args: { intent: "warning" },
};

export const Caution: Story = {
  args: { intent: "caution" },
};

export const SubtleAppearance: Story = {
  args: { intent: "tip", appearance: "subtle" },
};

export const CustomTitle: Story = {
  args: {
    intent: "important",
    title: "Read this before deploying",
  },
};

export const TitleHidden: Story = {
  args: {
    intent: "warning",
    showTitle: false,
  },
};

export const AllIntents: Story = {
  render: () => (
    <div className="flex w-[640px] max-w-full flex-col gap-3">
      {calloutIntentIds.map((intent) => (
        <Callout key={intent} intent={intent}>
          The <code className="font-mono text-xs">{intent}</code> intent
          highlights content with the appropriate color and icon.
        </Callout>
      ))}
    </div>
  ),
};

export const SubtleVariants: Story = {
  render: () => (
    <div className="flex w-[640px] max-w-full flex-col gap-3">
      {calloutIntentIds.map((intent) => (
        <Callout key={intent} intent={intent} appearance="subtle">
          The <code className="font-mono text-xs">subtle</code> appearance
          uses a full border with a tinted background, suitable for inline
          callouts that need slightly more visual weight.
        </Callout>
      ))}
    </div>
  ),
};

export const WithComposedSubcomponents: Story = {
  render: () => (
    <div className="w-[640px] max-w-full">
      <Callout intent="tip" showTitle={false}>
        <CalloutTitle>Pro tip</CalloutTitle>
        <CalloutDescription>
          You can compose <code className="font-mono text-xs">CalloutTitle</code> and{" "}
          <code className="font-mono text-xs">CalloutDescription</code> manually
          for full control over the markup. The default <code className="font-mono text-xs">title</code>{" "}
          prop covers most cases.
        </CalloutDescription>
      </Callout>
    </div>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <div className="w-[640px] max-w-full">
      <Callout intent="note" icon={null} title="Heads up">
        Pass <code className="font-mono text-xs">icon=&#123;null&#125;</code> to
        suppress the leading icon entirely.
      </Callout>
    </div>
  ),
};
