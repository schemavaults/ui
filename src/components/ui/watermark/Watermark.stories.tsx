import type { Decorator, Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { FileText, Lock, ShieldAlert } from "lucide-react";

import { Watermark } from "./watermark";
import {
  watermarkLayoutIds,
  watermarkSizeIds,
  watermarkVariantIds,
  watermarkDensityIds,
  type WatermarkDensity,
  type WatermarkLayout,
  type WatermarkSize,
  type WatermarkVariant,
} from "./watermark-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { Badge } from "../badge";

/**
 * A container decorator that mimics a real document / preview surface so the
 * watermark has meaningful content to lay itself over. Not used on render-based
 * stories that build their own containers.
 */
const DocumentDecorator: Decorator = (Story) => (
  <div className="relative w-[520px] overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm">
    <div className="space-y-3 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            schemavaults-invoice-2026-Q3.md
          </span>
        </div>
        <Badge variant="outline">v0.4</Badge>
      </div>
      <h3 className="text-lg font-semibold">Invoice — Acme Corp</h3>
      <p className="text-sm text-muted-foreground">
        Prepared on 2026-07-15 by Alex Whitman for the SchemaVaults Team
        subscription tier. This document contains preliminary values and is
        pending review by the accounts team.
      </p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-muted-foreground">Subtotal</div>
          <div className="font-mono">$4,320.00</div>
        </div>
        <div>
          <div className="text-muted-foreground">Tax</div>
          <div className="font-mono">$389.20</div>
        </div>
        <div>
          <div className="text-muted-foreground">Total</div>
          <div className="font-mono font-semibold">$4,709.20</div>
        </div>
        <div>
          <div className="text-muted-foreground">Due</div>
          <div className="font-mono">2026-08-15</div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Line items and taxes shown above are provisional. Do not rely on this
        document for accounting or bookkeeping purposes until it has been
        countersigned.
      </p>
    </div>
    <Story />
  </div>
);

const meta = {
  title: "Components/Watermark",
  component: Watermark,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A decorative overlay that stamps content with a repeating tiled label (e.g. `DRAFT`, `CONFIDENTIAL`, `PROTOTYPE`) or a single centered ink-stamp. **The parent container MUST have `position: relative`** for the watermark to overlay correctly, and typically `overflow: hidden` to clip the pattern. Distinct from Ribbon (corner marker) and Banner (full-width strip): Watermark is layered *over* the content itself rather than sitting alongside it.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    content: { control: { type: "text" } },
    layout: { options: watermarkLayoutIds, control: { type: "radio" } },
    size: { options: watermarkSizeIds, control: { type: "radio" } },
    variant: { options: watermarkVariantIds, control: { type: "select" } },
    density: { options: watermarkDensityIds, control: { type: "radio" } },
    angle: { control: { type: "range", min: -90, max: 90, step: 5 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.02 } },
    border: { control: { type: "boolean" } },
  },
  args: {
    content: "DRAFT",
    layout: "repeat",
    size: "default",
    variant: "muted",
    density: "default",
    angle: -30,
    border: true,
  },
} satisfies Meta<typeof Watermark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [DocumentDecorator],
};

export const Draft: Story = {
  args: { content: "DRAFT", variant: "warning" },
  decorators: [DocumentDecorator],
};

export const Confidential: Story = {
  args: { content: "CONFIDENTIAL", variant: "destructive", density: "sparse" },
  decorators: [DocumentDecorator],
};

export const Prototype: Story = {
  args: { content: "PROTOTYPE", variant: "accent" },
  decorators: [DocumentDecorator],
};

export const Preview: Story = {
  args: { content: "PREVIEW", variant: "default" },
  decorators: [DocumentDecorator],
};

export const Stamp: Story = {
  args: {
    content: "APPROVED",
    layout: "stamp",
    variant: "success",
    size: "lg",
  },
  decorators: [DocumentDecorator],
};

export const StampConfidential: Story = {
  args: {
    content: "CONFIDENTIAL",
    layout: "stamp",
    variant: "destructive",
    size: "lg",
  },
  decorators: [DocumentDecorator],
};

export const StampBorderless: Story = {
  args: {
    content: "VOID",
    layout: "stamp",
    variant: "destructive",
    size: "xl",
    border: false,
    opacity: 0.25,
  },
  decorators: [DocumentDecorator],
};

export const SparseDensity: Story = {
  args: { content: "DRAFT", density: "sparse", variant: "warning" },
  decorators: [DocumentDecorator],
};

export const DenseDensity: Story = {
  args: { content: "DRAFT", density: "dense", variant: "warning" },
  decorators: [DocumentDecorator],
};

export const AngleShallow: Story = {
  args: { content: "DRAFT", angle: -10, variant: "muted" },
  decorators: [DocumentDecorator],
};

export const AngleSteep: Story = {
  args: { content: "DRAFT", angle: -60, variant: "muted" },
  decorators: [DocumentDecorator],
};

export const HighOpacity: Story = {
  args: { content: "DRAFT", opacity: 0.3, variant: "destructive" },
  decorators: [DocumentDecorator],
};

export const LowOpacity: Story = {
  args: { content: "DRAFT", opacity: 0.06, variant: "muted" },
  decorators: [DocumentDecorator],
};

const previewCard = (label: string): ReactElement => (
  <div className="space-y-2 p-4">
    <div className="text-sm font-medium">{label}</div>
    <p className="text-xs text-muted-foreground">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. In id neque nec
      justo pellentesque bibendum. Vestibulum ante ipsum primis in faucibus.
    </p>
    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
      <span className="text-muted-foreground">Owner</span>
      <span className="font-mono">alex@schemavaults.com</span>
      <span className="text-muted-foreground">Region</span>
      <span className="font-mono">us-east-1</span>
    </div>
  </div>
);

export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {watermarkVariantIds.map((variant) => (
        <div
          key={variant}
          className="relative h-48 w-64 overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm"
        >
          {previewCard(variant)}
          <Watermark
            content={variant.toUpperCase()}
            variant={variant as WatermarkVariant}
          />
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {watermarkSizeIds.map((size) => (
        <div
          key={size}
          className="relative h-48 w-72 overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm"
        >
          {previewCard(`size: ${size}`)}
          <Watermark
            content="DRAFT"
            size={size as WatermarkSize}
            variant="warning"
          />
        </div>
      ))}
    </div>
  ),
};

export const AllLayouts: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {watermarkLayoutIds.map((layout) => (
        <div
          key={layout}
          className="relative h-56 w-80 overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm"
        >
          {previewCard(`layout: ${layout}`)}
          <Watermark
            content={layout === "stamp" ? "APPROVED" : "DRAFT"}
            layout={layout as WatermarkLayout}
            variant={layout === "stamp" ? "success" : "warning"}
            size={layout === "stamp" ? "lg" : "default"}
          />
        </div>
      ))}
    </div>
  ),
};

export const AllDensities: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {watermarkDensityIds.map((density) => (
        <div
          key={density}
          className="relative h-52 w-64 overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm"
        >
          {previewCard(`density: ${density}`)}
          <Watermark
            content="DRAFT"
            density={density as WatermarkDensity}
            variant="warning"
          />
        </div>
      ))}
    </div>
  ),
};

export const OnCard: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <Card className="relative w-96 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="size-4 text-destructive" />
          Schema: <span className="font-mono">users_pii_v3</span>
        </CardTitle>
        <CardDescription>
          Contains personally identifiable information. Access is restricted to
          data-platform admins.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <div>
          <span className="font-mono">email</span> — string
        </div>
        <div>
          <span className="font-mono">phone</span> — string, nullable
        </div>
        <div>
          <span className="font-mono">ssn_last4</span> — string, encrypted
        </div>
        <div>
          <span className="font-mono">dob</span> — date
        </div>
      </CardContent>
      <Watermark content="CONFIDENTIAL" variant="destructive" size="default" />
    </Card>
  ),
};

export const StagingEnvironmentBanner: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="relative h-64 w-[640px] overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <div className="space-y-3 p-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-warning" />
          <span className="text-sm font-medium">
            SchemaVaults — staging environment
          </span>
        </div>
        <h3 className="text-lg font-semibold">Order #4821 — Test Fixture</h3>
        <p className="text-sm text-muted-foreground">
          This screen renders identically to production. Data shown here is
          synthetic and refreshed every 24 hours; do not treat any value as a
          real customer or real transaction.
        </p>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">Customer</div>
            <div>Jane Q. Test</div>
          </div>
          <div>
            <div className="text-muted-foreground">Amount</div>
            <div className="font-mono">$123.45</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <div>
              <Badge variant="outline">shipped</Badge>
            </div>
          </div>
        </div>
      </div>
      <Watermark content="STAGING" variant="warning" density="default" />
    </div>
  ),
};

export const InkStamps: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {(
        [
          { content: "APPROVED", variant: "success" },
          { content: "PAID", variant: "success" },
          { content: "REJECTED", variant: "destructive" },
          { content: "VOID", variant: "destructive" },
          { content: "URGENT", variant: "warning" },
          { content: "COPY", variant: "muted" },
        ] as const
      ).map((s) => (
        <div
          key={s.content}
          className="relative h-52 w-64 overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm"
        >
          {previewCard(`stamp: ${s.content.toLowerCase()}`)}
          <Watermark
            layout="stamp"
            content={s.content}
            variant={s.variant}
            size="default"
          />
        </div>
      ))}
    </div>
  ),
};
