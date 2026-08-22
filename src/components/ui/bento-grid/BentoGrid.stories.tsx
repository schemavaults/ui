import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  Activity,
  Cloud,
  Database,
  KeyRound,
  Lock,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import {
  BentoCard,
  BentoCardContent,
  BentoCardDescription,
  BentoCardFooter,
  BentoCardHeader,
  BentoCardIcon,
  BentoCardTitle,
  BentoCardVisual,
  BentoGrid,
  bentoCardVariantIds,
  bentoGridColumnCounts,
  bentoGridGapIds,
} from "./bento-grid";

const meta = {
  title: "Components/BentoGrid",
  component: BentoGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    columns: {
      options: bentoGridColumnCounts,
      control: { type: "radio" },
    },
    gap: {
      options: bentoGridGapIds,
      control: { type: "radio" },
    },
    flowDense: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof BentoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

function SimpleFeatureGrid(): ReactElement {
  return (
    <BentoGrid columns={3} gap="md">
      <BentoCard variant="default">
        <BentoCardHeader>
          <BentoCardIcon>
            <ShieldCheck />
          </BentoCardIcon>
          <BentoCardTitle>End-to-end encrypted</BentoCardTitle>
        </BentoCardHeader>
        <BentoCardContent>
          <BentoCardDescription>
            Every vault entry is encrypted client-side before it leaves the
            browser.
          </BentoCardDescription>
        </BentoCardContent>
      </BentoCard>

      <BentoCard variant="muted">
        <BentoCardHeader>
          <BentoCardIcon>
            <Users />
          </BentoCardIcon>
          <BentoCardTitle>Team access controls</BentoCardTitle>
        </BentoCardHeader>
        <BentoCardContent>
          <BentoCardDescription>
            Group and role permissions with per-vault overrides.
          </BentoCardDescription>
        </BentoCardContent>
      </BentoCard>

      <BentoCard variant="primary">
        <BentoCardHeader>
          <BentoCardIcon>
            <Zap />
          </BentoCardIcon>
          <BentoCardTitle>Zero-config sync</BentoCardTitle>
        </BentoCardHeader>
        <BentoCardContent>
          <BentoCardDescription>
            Ambient background sync keeps every device up to date.
          </BentoCardDescription>
        </BentoCardContent>
      </BentoCard>
    </BentoGrid>
  );
}

export const Default: Story = {
  render: (): ReactElement => <SimpleFeatureGrid />,
};

function AsymmetricLayout(): ReactElement {
  return (
    <BentoGrid columns={4} gap="md">
      <BentoCard variant="gradient" colSpan={2} rowSpan={2}>
        <BentoCardHeader>
          <BentoCardIcon>
            <Sparkles />
          </BentoCardIcon>
          <BentoCardTitle>Featured — Vaults 2.0</BentoCardTitle>
        </BentoCardHeader>
        <BentoCardContent>
          <BentoCardDescription>
            Redesigned from the ground up around collaborative editing,
            fine-grained sharing links, and audit-trailed rotations.
          </BentoCardDescription>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-md bg-background/60 p-3 text-center">
              <div className="text-2xl font-semibold tabular-nums">98%</div>
              <div className="text-xs text-muted-foreground">Faster search</div>
            </div>
            <div className="rounded-md bg-background/60 p-3 text-center">
              <div className="text-2xl font-semibold tabular-nums">4×</div>
              <div className="text-xs text-muted-foreground">Sync speed</div>
            </div>
            <div className="rounded-md bg-background/60 p-3 text-center">
              <div className="text-2xl font-semibold tabular-nums">0ms</div>
              <div className="text-xs text-muted-foreground">Cold start</div>
            </div>
          </div>
        </BentoCardContent>
        <BentoCardFooter>Rolling out this quarter</BentoCardFooter>
      </BentoCard>

      <BentoCard variant="default">
        <BentoCardHeader>
          <BentoCardIcon>
            <KeyRound />
          </BentoCardIcon>
          <BentoCardTitle>Rotation policies</BentoCardTitle>
        </BentoCardHeader>
        <BentoCardContent>
          <BentoCardDescription>
            Schedule automatic rotation for tokens and secrets.
          </BentoCardDescription>
        </BentoCardContent>
      </BentoCard>

      <BentoCard variant="muted">
        <BentoCardHeader>
          <BentoCardIcon>
            <Lock />
          </BentoCardIcon>
          <BentoCardTitle>Hardware keys</BentoCardTitle>
        </BentoCardHeader>
        <BentoCardContent>
          <BentoCardDescription>
            YubiKey and Passkey login for every workspace.
          </BentoCardDescription>
        </BentoCardContent>
      </BentoCard>

      <BentoCard variant="accent" colSpan={2}>
        <BentoCardHeader>
          <BentoCardIcon>
            <Cloud />
          </BentoCardIcon>
          <BentoCardTitle>Multi-region availability</BentoCardTitle>
        </BentoCardHeader>
        <BentoCardContent>
          <BentoCardDescription>
            Vaults are replicated across three geographic regions with
            automatic failover.
          </BentoCardDescription>
        </BentoCardContent>
        <BentoCardFooter>US · EU · APAC</BentoCardFooter>
      </BentoCard>
    </BentoGrid>
  );
}

export const AsymmetricSpans: Story = {
  render: (): ReactElement => <AsymmetricLayout />,
};

function VariantShowcase(): ReactElement {
  return (
    <BentoGrid columns={4} gap="md">
      {bentoCardVariantIds.map((variant) => (
        <BentoCard key={variant} variant={variant}>
          <BentoCardHeader>
            <BentoCardIcon>
              <Database />
            </BentoCardIcon>
            <BentoCardTitle className="capitalize">{variant}</BentoCardTitle>
          </BentoCardHeader>
          <BentoCardContent>
            <BentoCardDescription>
              The <code>{variant}</code> visual variant.
            </BentoCardDescription>
          </BentoCardContent>
        </BentoCard>
      ))}
    </BentoGrid>
  );
}

export const Variants: Story = {
  render: (): ReactElement => <VariantShowcase />,
};

function InteractiveCards(): ReactElement {
  return (
    <BentoGrid columns={3} gap="md">
      <BentoCard
        variant="default"
        interactive
        role="link"
        tabIndex={0}
        aria-label="Open activity dashboard"
      >
        <BentoCardHeader>
          <BentoCardIcon>
            <Activity />
          </BentoCardIcon>
          <BentoCardTitle>Activity</BentoCardTitle>
        </BentoCardHeader>
        <BentoCardContent>
          <BentoCardDescription>
            Real-time stream of every read, write, and sync event.
          </BentoCardDescription>
        </BentoCardContent>
      </BentoCard>

      <BentoCard
        variant="glass"
        interactive
        role="link"
        tabIndex={0}
        aria-label="Open servers"
      >
        <BentoCardHeader>
          <BentoCardIcon>
            <Server />
          </BentoCardIcon>
          <BentoCardTitle>Servers</BentoCardTitle>
        </BentoCardHeader>
        <BentoCardContent>
          <BentoCardDescription>
            Manage self-hosted relays and regional egress.
          </BentoCardDescription>
        </BentoCardContent>
      </BentoCard>

      <BentoCard
        variant="outline"
        interactive
        role="link"
        tabIndex={0}
        aria-label="Open team"
      >
        <BentoCardHeader>
          <BentoCardIcon>
            <Users />
          </BentoCardIcon>
          <BentoCardTitle>Team</BentoCardTitle>
        </BentoCardHeader>
        <BentoCardContent>
          <BentoCardDescription>
            Invite members, groups, and manage per-vault access.
          </BentoCardDescription>
        </BentoCardContent>
      </BentoCard>
    </BentoGrid>
  );
}

export const Interactive: Story = {
  render: (): ReactElement => <InteractiveCards />,
};

function CardWithVisual(): ReactElement {
  return (
    <BentoGrid columns={3} gap="md">
      <BentoCard variant="primary" colSpan={2} rowSpan={2}>
        <BentoCardVisual bottom>
          <div className="h-32 w-full bg-gradient-to-t from-primary/25 to-transparent" />
        </BentoCardVisual>
        <BentoCardHeader>
          <BentoCardIcon>
            <Sparkles />
          </BentoCardIcon>
          <BentoCardTitle>Card with decorative visual</BentoCardTitle>
        </BentoCardHeader>
        <BentoCardContent>
          <BentoCardDescription>
            <code>BentoCardVisual</code> is anchored to the card and clipped
            by the rounded corners. Great for cropped previews, hero
            gradients, or a mini chart.
          </BentoCardDescription>
        </BentoCardContent>
      </BentoCard>

      <BentoCard variant="muted">
        <BentoCardHeader>
          <BentoCardTitle>Sibling</BentoCardTitle>
        </BentoCardHeader>
        <BentoCardContent>
          <BentoCardDescription>
            Regular content card sitting next to the visual card.
          </BentoCardDescription>
        </BentoCardContent>
      </BentoCard>

      <BentoCard variant="muted">
        <BentoCardHeader>
          <BentoCardTitle>Sibling</BentoCardTitle>
        </BentoCardHeader>
        <BentoCardContent>
          <BentoCardDescription>
            Another regular card. The dense grid packs cards tightly.
          </BentoCardDescription>
        </BentoCardContent>
      </BentoCard>
    </BentoGrid>
  );
}

export const WithVisual: Story = {
  render: (): ReactElement => <CardWithVisual />,
};

function GapVariants(): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      {bentoGridGapIds.map((gap) => (
        <div key={gap} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            gap = {gap}
          </span>
          <BentoGrid columns={4} gap={gap}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <BentoCard key={idx} variant="muted">
                <BentoCardHeader>
                  <BentoCardTitle>Cell {idx + 1}</BentoCardTitle>
                </BentoCardHeader>
              </BentoCard>
            ))}
          </BentoGrid>
        </div>
      ))}
    </div>
  );
}

export const GapSizes: Story = {
  render: (): ReactElement => <GapVariants />,
};
