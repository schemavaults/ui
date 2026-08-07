import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Cpu,
  Database,
  KeyRound,
  Lock,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import {
  BentoGrid,
  BentoGridItem,
  BentoGridItemContent,
  BentoGridItemDescription,
  BentoGridItemFooter,
  BentoGridItemHeader,
  BentoGridItemIcon,
  BentoGridItemTitle,
  bentoGridColumnsIds,
  bentoGridGapIds,
  bentoGridItemColSpanIds,
  bentoGridItemRowSpanIds,
  bentoGridItemVariantIds,
  type BentoGridColumnsId,
  type BentoGridGapId,
  type BentoGridItemColSpanId,
  type BentoGridItemRowSpanId,
  type BentoGridItemVariantId,
} from "./bento-grid";

interface BentoGridPlaygroundProps {
  columns?: BentoGridColumnsId;
  gap?: BentoGridGapId;
  itemVariant?: BentoGridItemVariantId;
  featureColSpan?: BentoGridItemColSpanId;
  featureRowSpan?: BentoGridItemRowSpanId;
  interactive?: boolean;
}

function BentoGridPlayground({
  columns = "4",
  gap = "md",
  itemVariant = "default",
  featureColSpan = "2",
  featureRowSpan = "2",
  interactive = false,
}: BentoGridPlaygroundProps): ReactElement {
  return (
    <div style={{ maxWidth: 1024 }}>
      <BentoGrid columns={columns} gap={gap}>
        <BentoGridItem
          variant="gradient"
          colSpan={featureColSpan}
          rowSpan={featureRowSpan}
          interactive={interactive}
        >
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Sparkles />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Featured tile</BentoGridItemTitle>
          <BentoGridItemDescription>
            Spans two columns and two rows — perfect for the hero highlight.
          </BentoGridItemDescription>
          <BentoGridItemContent>
            Bento tiles compose cleanly with the theme&apos;s primary and accent
            colors, so a hero tile stays visually distinct without a bespoke
            palette.
          </BentoGridItemContent>
          <BentoGridItemFooter>
            <span>Updated 2 min ago</span>
          </BentoGridItemFooter>
        </BentoGridItem>

        <BentoGridItem variant={itemVariant} interactive={interactive}>
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Database />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Active vaults</BentoGridItemTitle>
          <BentoGridItemDescription>1,284 across 12 orgs</BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant={itemVariant} interactive={interactive}>
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <KeyRound />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>API keys</BentoGridItemTitle>
          <BentoGridItemDescription>14 expiring soon</BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant={itemVariant} interactive={interactive}>
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Activity />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Requests</BentoGridItemTitle>
          <BentoGridItemDescription>9,431 past hour</BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant={itemVariant} interactive={interactive}>
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Users />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Active users</BentoGridItemTitle>
          <BentoGridItemDescription>3,512 last 24 h</BentoGridItemDescription>
        </BentoGridItem>
      </BentoGrid>
    </div>
  );
}

const meta = {
  title: "Components/BentoGrid",
  component: BentoGridPlayground,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    columns: {
      options: bentoGridColumnsIds,
      control: { type: "radio" },
    },
    gap: {
      options: bentoGridGapIds,
      control: { type: "radio" },
    },
    itemVariant: {
      options: bentoGridItemVariantIds,
      control: { type: "select" },
    },
    featureColSpan: {
      options: bentoGridItemColSpanIds,
      control: { type: "radio" },
    },
    featureRowSpan: {
      options: bentoGridItemRowSpanIds,
      control: { type: "radio" },
    },
    interactive: { control: { type: "boolean" } },
  },
  args: {
    columns: "4",
    gap: "md",
    itemVariant: "default",
    featureColSpan: "2",
    featureRowSpan: "2",
    interactive: false,
  },
} satisfies Meta<typeof BentoGridPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: StoryObj = {
  render: (): ReactElement => (
    <div style={{ maxWidth: 1024 }}>
      <BentoGrid columns="3" gap="md">
        {bentoGridItemVariantIds.map((variant) => (
          <BentoGridItem key={variant} variant={variant}>
            <BentoGridItemHeader>
              <BentoGridItemIcon>
                <Boxes />
              </BentoGridItemIcon>
            </BentoGridItemHeader>
            <BentoGridItemTitle>{variant}</BentoGridItemTitle>
            <BentoGridItemDescription>
              variant=&quot;{variant}&quot;
            </BentoGridItemDescription>
          </BentoGridItem>
        ))}
      </BentoGrid>
    </div>
  ),
  parameters: { layout: "padded" },
};

export const MarketingHero: StoryObj = {
  render: (): ReactElement => (
    <div style={{ maxWidth: 1080 }}>
      <BentoGrid columns="4" gap="lg">
        <BentoGridItem variant="gradient" colSpan="2" rowSpan="2">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Rocket />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Ship schemas in minutes</BentoGridItemTitle>
          <BentoGridItemDescription>
            A managed schema registry, versioning, and validation — wired into
            your pipeline without the ops overhead.
          </BentoGridItemDescription>
          <BentoGridItemContent>
            Native SDKs for TypeScript, Python, Go, and Rust with drop-in
            middleware for popular frameworks.
          </BentoGridItemContent>
          <BentoGridItemFooter>
            <span>Try free · No credit card</span>
          </BentoGridItemFooter>
        </BentoGridItem>

        <BentoGridItem variant="primary" colSpan="2">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <ShieldCheck />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Enterprise-grade security</BentoGridItemTitle>
          <BentoGridItemDescription>
            SOC 2 Type II, end-to-end encryption, and audit-logged access.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant="muted">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Zap />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>&lt; 10 ms p50</BentoGridItemTitle>
          <BentoGridItemDescription>
            Global edge validation.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant="accent">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <BookOpen />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Batteries included</BentoGridItemTitle>
          <BentoGridItemDescription>
            Guides, examples, playgrounds.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant="outline" colSpan="4">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <BarChart3 />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Observability out of the box</BentoGridItemTitle>
          <BentoGridItemDescription>
            Request rate, latency, and validation-error breakdowns — no
            instrumentation required.
          </BentoGridItemDescription>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
  parameters: { layout: "padded" },
};

export const Interactive: StoryObj = {
  render: (): ReactElement => (
    <div style={{ maxWidth: 800 }}>
      <BentoGrid columns="3" gap="md">
        <BentoGridItem
          variant="default"
          interactive
          onClick={(): void => {
            /* keyboard-friendly click handler */
          }}
        >
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Cpu />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Runtime</BentoGridItemTitle>
          <BentoGridItemDescription>
            Tab to focus. Enter/Space to activate.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant="default" interactive>
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Bell />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Notifications</BentoGridItemTitle>
          <BentoGridItemDescription>
            Hover to lift; focus ring on keyboard nav.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant="default" interactive>
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Lock />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Access control</BentoGridItemTitle>
          <BentoGridItemDescription>
            Same tile, cursor + focus affordances added.
          </BentoGridItemDescription>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
  parameters: { layout: "padded" },
};

export const CompactGap: Story = {
  args: {
    columns: "6",
    gap: "sm",
    featureColSpan: "3",
    featureRowSpan: "2",
    itemVariant: "muted",
  },
};

export const TwoColumn: Story = {
  args: {
    columns: "2",
    gap: "md",
    featureColSpan: "2",
    featureRowSpan: "1",
    itemVariant: "outline",
  },
};

export const GradientHero: Story = {
  args: {
    columns: "4",
    gap: "lg",
    itemVariant: "glass",
    featureColSpan: "2",
    featureRowSpan: "2",
    interactive: true,
  },
};
