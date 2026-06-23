import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { Watermark, watermarkVariantIds } from "./watermark";

const meta = {
  title: "Components/Watermark",
  component: Watermark,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    content: { control: { type: "text" } },
    variant: {
      options: watermarkVariantIds,
      control: { type: "select" },
      table: {
        type: {
          summary: "WatermarkVariantId",
          detail: watermarkVariantIds.map((v) => `'${v}'`).join(" | "),
        },
      },
    },
    rotation: { control: { type: "range", min: -90, max: 90, step: 1 } },
    gapX: { control: { type: "range", min: 60, max: 480, step: 10 } },
    gapY: { control: { type: "range", min: 60, max: 360, step: 10 } },
    fontSize: { control: { type: "range", min: 10, max: 96, step: 1 } },
    fontWeight: { control: { type: "number", min: 100, max: 900, step: 100 } },
    letterSpacing: { control: { type: "text" } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.02 } },
    zIndex: { control: { type: "number" } },
    disableTextSelection: { control: { type: "boolean" } },
  },
  args: {
    content: "SchemaVaults",
    variant: "muted",
    rotation: -22,
    gapX: 220,
    gapY: 140,
    fontSize: 18,
    fontWeight: 500,
    letterSpacing: "0.08em",
    opacity: 0.18,
    zIndex: 5,
    disableTextSelection: false,
  },
} satisfies Meta<typeof Watermark>;

export default meta;
type Story = StoryObj<typeof meta>;

function SampleCard(): ReactElement {
  return (
    <article className="flex w-[560px] flex-col gap-4 rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm">
      <header>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Invoice #INV-2026-0042
        </p>
        <h2 className="text-2xl font-semibold">Acme Co. — June 2026</h2>
      </header>
      <dl className="grid grid-cols-2 gap-y-2 text-sm">
        <dt className="text-muted-foreground">Billed to</dt>
        <dd className="text-right">Globex Industries</dd>
        <dt className="text-muted-foreground">Issued</dt>
        <dd className="text-right">June 1, 2026</dd>
        <dt className="text-muted-foreground">Due</dt>
        <dd className="text-right">June 30, 2026</dd>
      </dl>
      <hr className="border-border" />
      <ul className="flex flex-col gap-1 text-sm">
        <li className="flex justify-between">
          <span>Enterprise plan (annual)</span>
          <span className="tabular-nums">$24,000.00</span>
        </li>
        <li className="flex justify-between">
          <span>Premium support add-on</span>
          <span className="tabular-nums">$4,800.00</span>
        </li>
        <li className="flex justify-between font-medium">
          <span>Total</span>
          <span className="tabular-nums">$28,800.00</span>
        </li>
      </ul>
      <p className="text-xs text-muted-foreground">
        All figures shown are illustrative and used for component preview only.
      </p>
    </article>
  );
}

export const Default: Story = {
  render: (args): ReactElement => (
    <Watermark {...args}>
      <SampleCard />
    </Watermark>
  ),
};

export const DemoStamp: Story = {
  args: {
    content: "DEMO",
    fontSize: 48,
    fontWeight: 800,
    letterSpacing: "0.2em",
    gapX: 260,
    gapY: 180,
    opacity: 0.12,
    variant: "primary",
  },
  render: (args): ReactElement => (
    <Watermark {...args}>
      <SampleCard />
    </Watermark>
  ),
};

export const ConfidentialStamp: Story = {
  args: {
    content: "CONFIDENTIAL",
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: "0.25em",
    rotation: -28,
    gapX: 280,
    gapY: 160,
    opacity: 0.16,
    variant: "destructive",
  },
  render: (args): ReactElement => (
    <Watermark {...args}>
      <SampleCard />
    </Watermark>
  ),
};

export const DraftStamp: Story = {
  args: {
    content: "DRAFT",
    fontSize: 56,
    fontWeight: 800,
    letterSpacing: "0.3em",
    rotation: -18,
    gapX: 320,
    gapY: 220,
    opacity: 0.1,
    variant: "warning",
  },
  render: (args): ReactElement => (
    <Watermark {...args}>
      <SampleCard />
    </Watermark>
  ),
};

export const MultiLine: Story = {
  args: {
    content: ["SchemaVaults", "jalexwhitman@example.com"],
    fontSize: 14,
    gapX: 220,
    gapY: 120,
    rotation: -22,
    opacity: 0.22,
    variant: "muted",
  },
  render: (args): ReactElement => (
    <Watermark {...args}>
      <SampleCard />
    </Watermark>
  ),
};

export const Horizontal: Story = {
  args: {
    content: "PREVIEW BUILD",
    rotation: 0,
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "0.18em",
    gapX: 260,
    gapY: 90,
    opacity: 0.15,
    variant: "foreground",
  },
  render: (args): ReactElement => (
    <Watermark {...args}>
      <SampleCard />
    </Watermark>
  ),
};

export const Dense: Story = {
  args: {
    content: "SchemaVaults",
    fontSize: 12,
    gapX: 120,
    gapY: 70,
    opacity: 0.22,
    variant: "muted",
  },
  render: (args): ReactElement => (
    <Watermark {...args}>
      <SampleCard />
    </Watermark>
  ),
};

export const OverImage: Story = {
  args: {
    content: "SAMPLE",
    fontSize: 40,
    fontWeight: 800,
    letterSpacing: "0.25em",
    rotation: -22,
    gapX: 280,
    gapY: 180,
    opacity: 0.35,
    variant: "foreground",
  },
  render: (args): ReactElement => (
    <Watermark
      {...args}
      className="overflow-hidden rounded-lg border border-border shadow-sm"
    >
      <div
        aria-hidden="true"
        className="h-[360px] w-[560px] bg-gradient-to-br from-primary/40 via-accent/30 to-secondary/40"
      />
    </Watermark>
  ),
};

function AllVariantsExample(): ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {watermarkVariantIds.map((variant) => (
        <Watermark
          key={variant}
          content={variant.toUpperCase()}
          variant={variant}
          fontSize={22}
          fontWeight={700}
          letterSpacing="0.18em"
          gapX={180}
          gapY={120}
          opacity={0.25}
          className="rounded-md border border-border bg-card"
        >
          <div className="flex h-32 w-64 flex-col items-center justify-center gap-1 p-4 text-card-foreground">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              variant
            </span>
            <code className="text-sm font-medium">{variant}</code>
          </div>
        </Watermark>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  render: (): ReactElement => <AllVariantsExample />,
};

function RotationGridExample(): ReactElement {
  const rotations: number[] = [-45, -22, 0, 22, 45];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {rotations.map((rotation) => (
        <Watermark
          key={rotation}
          content="PREVIEW"
          rotation={rotation}
          fontSize={18}
          fontWeight={700}
          letterSpacing="0.2em"
          gapX={160}
          gapY={110}
          opacity={0.22}
          variant="primary"
          className="rounded-md border border-border bg-card"
        >
          <div className="flex h-28 w-44 items-center justify-center text-sm text-card-foreground">
            rotation: {rotation}°
          </div>
        </Watermark>
      ))}
    </div>
  );
}

export const RotationOptions: Story = {
  render: (): ReactElement => <RotationGridExample />,
};

export const DisablesTextSelection: Story = {
  args: {
    content: "COPY DISABLED",
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "0.2em",
    variant: "destructive",
    opacity: 0.2,
    disableTextSelection: true,
  },
  render: (args): ReactElement => (
    <Watermark {...args}>
      <div className="flex w-[560px] flex-col gap-3 rounded-md border border-border bg-card p-6 text-card-foreground">
        <h3 className="text-lg font-semibold">Confidential document</h3>
        <p className="text-sm">
          Try selecting this paragraph with your mouse — the wrapper has
          `disableTextSelection` enabled, so highlighting is suppressed for the
          whole region.
        </p>
        <p className="text-xs text-muted-foreground">
          The watermark layer itself is always `pointer-events: none` and
          `aria-hidden`, so screen readers continue to read the underlying copy
          normally.
        </p>
      </div>
    </Watermark>
  ),
};
