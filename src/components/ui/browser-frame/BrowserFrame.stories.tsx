import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import {
  BrowserFrame,
  BrowserFrameAddressBar,
  BrowserFrameContent,
  BrowserFrameControls,
  BrowserFrameHeader,
  BrowserFrameNavButtons,
  BrowserFrameTab,
  BrowserFrameTabs,
  browserFrameSizeIds,
  browserFrameVariantIds,
} from "./browser-frame";

const meta = {
  title: "Components/BrowserFrame",
  component: BrowserFrame,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: browserFrameVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: browserFrameSizeIds,
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof BrowserFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaceholderContent(): ReactElement {
  return (
    <div className="grid h-full min-h-[300px] place-items-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-10">
      <div className="flex max-w-md flex-col items-center gap-3 text-center">
        <div className="size-12 rounded-xl bg-primary/20" aria-hidden="true" />
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          SchemaVaults
        </h2>
        <p className="text-sm text-muted-foreground">
          A mock browser frame that wraps any content. Useful for landing pages,
          screenshots, and product demos.
        </p>
      </div>
    </div>
  );
}

export const Default: Story = {
  args: {
    variant: "macos",
    size: "md",
  },
  render: (args): ReactElement => {
    const variant = args.variant ?? "macos";
    const size = args.size ?? "md";
    return (
      <BrowserFrame {...args} className="max-w-3xl">
        <BrowserFrameHeader variant={variant} size={size}>
          <BrowserFrameControls variant={variant} />
          <BrowserFrameAddressBar value="https://schemavaults.com" />
        </BrowserFrameHeader>
        <BrowserFrameContent>
          <PlaceholderContent />
        </BrowserFrameContent>
      </BrowserFrame>
    );
  },
};

export const MacOS: Story = {
  render: (): ReactElement => (
    <BrowserFrame variant="macos" className="max-w-3xl">
      <BrowserFrameHeader variant="macos">
        <BrowserFrameControls variant="macos" />
        <BrowserFrameNavButtons />
        <BrowserFrameAddressBar value="https://schemavaults.com/dashboard" />
      </BrowserFrameHeader>
      <BrowserFrameContent>
        <PlaceholderContent />
      </BrowserFrameContent>
    </BrowserFrame>
  ),
};

export const Windows: Story = {
  render: (): ReactElement => (
    <BrowserFrame variant="windows" className="max-w-3xl">
      <BrowserFrameHeader variant="windows">
        <BrowserFrameNavButtons />
        <BrowserFrameAddressBar value="https://schemavaults.com" />
        <BrowserFrameControls variant="windows" />
      </BrowserFrameHeader>
      <BrowserFrameContent>
        <PlaceholderContent />
      </BrowserFrameContent>
    </BrowserFrame>
  ),
};

export const Minimal: Story = {
  render: (): ReactElement => (
    <BrowserFrame variant="minimal" className="max-w-3xl">
      <BrowserFrameHeader variant="minimal">
        <BrowserFrameAddressBar value="https://schemavaults.com" />
      </BrowserFrameHeader>
      <BrowserFrameContent>
        <PlaceholderContent />
      </BrowserFrameContent>
    </BrowserFrame>
  ),
};

export const WithTabs: Story = {
  render: (): ReactElement => (
    <BrowserFrame variant="macos" className="max-w-3xl">
      <BrowserFrameHeader variant="macos">
        <BrowserFrameControls variant="macos" />
        <BrowserFrameAddressBar value="https://schemavaults.com/schemas" />
      </BrowserFrameHeader>
      <BrowserFrameTabs>
        <BrowserFrameTab active favicon={<span aria-hidden="true">🗄️</span>} closable>
          Schemas — SchemaVaults
        </BrowserFrameTab>
        <BrowserFrameTab favicon={<span aria-hidden="true">📊</span>} closable>
          Dashboard
        </BrowserFrameTab>
        <BrowserFrameTab favicon={<span aria-hidden="true">⚙️</span>} closable>
          Settings
        </BrowserFrameTab>
      </BrowserFrameTabs>
      <BrowserFrameContent>
        <PlaceholderContent />
      </BrowserFrameContent>
    </BrowserFrame>
  ),
};

export const InsecureUrl: Story = {
  render: (): ReactElement => (
    <BrowserFrame variant="macos" className="max-w-3xl">
      <BrowserFrameHeader variant="macos">
        <BrowserFrameControls variant="macos" />
        <BrowserFrameAddressBar value="http://example.com" />
      </BrowserFrameHeader>
      <BrowserFrameContent>
        <PlaceholderContent />
      </BrowserFrameContent>
    </BrowserFrame>
  ),
};

export const EditableAddress: Story = {
  render: (): ReactElement => (
    <BrowserFrame variant="macos" className="max-w-3xl">
      <BrowserFrameHeader variant="macos">
        <BrowserFrameControls variant="macos" />
        <BrowserFrameAddressBar
          defaultValue="https://schemavaults.com"
          readOnly={false}
          placeholder="Search or enter a URL"
        />
      </BrowserFrameHeader>
      <BrowserFrameContent>
        <PlaceholderContent />
      </BrowserFrameContent>
    </BrowserFrame>
  ),
};

export const FixedAspectRatio: Story = {
  render: (): ReactElement => (
    <BrowserFrame variant="macos" className="max-w-2xl">
      <BrowserFrameHeader variant="macos">
        <BrowserFrameControls variant="macos" />
        <BrowserFrameAddressBar value="https://schemavaults.com/landing" />
      </BrowserFrameHeader>
      <BrowserFrameContent aspectRatio="16 / 10">
        <PlaceholderContent />
      </BrowserFrameContent>
    </BrowserFrame>
  ),
};

function AllVariantsExample(): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      {browserFrameVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          <BrowserFrame variant={variant} className="max-w-3xl">
            <BrowserFrameHeader variant={variant}>
              {variant !== "minimal" ? (
                <BrowserFrameControls variant={variant} />
              ) : null}
              <BrowserFrameAddressBar value="https://schemavaults.com" />
              {variant === "windows" ? (
                <BrowserFrameControls variant={variant} />
              ) : null}
            </BrowserFrameHeader>
            <BrowserFrameContent>
              <div className="grid h-40 place-items-center bg-muted/30 text-sm text-muted-foreground">
                {variant} variant
              </div>
            </BrowserFrameContent>
          </BrowserFrame>
        </div>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  render: (): ReactElement => <AllVariantsExample />,
};

function AllSizesExample(): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      {browserFrameSizeIds.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <BrowserFrame variant="macos" size={size} className="max-w-3xl">
            <BrowserFrameHeader variant="macos" size={size}>
              <BrowserFrameControls variant="macos" />
              <BrowserFrameAddressBar value="https://schemavaults.com" />
            </BrowserFrameHeader>
            <BrowserFrameContent>
              <div className="grid h-32 place-items-center bg-muted/30 text-muted-foreground">
                {size}
              </div>
            </BrowserFrameContent>
          </BrowserFrame>
        </div>
      ))}
    </div>
  );
}

export const AllSizes: Story = {
  render: (): ReactElement => <AllSizesExample />,
};
