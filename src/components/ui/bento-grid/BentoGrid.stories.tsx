import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  Activity,
  Database,
  GitBranch,
  KeyRound,
  Lock,
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
  bentoGridColumnCounts,
  bentoGridGapIds,
  type BentoGridColumnCount,
  type BentoGridGapId,
} from "./bento-grid";

interface BentoGridExampleProps {
  columns?: BentoGridColumnCount;
  gap?: BentoGridGapId;
  dense?: boolean;
}

function BentoGridExample({
  columns = 3,
  gap = "md",
  dense = false,
}: BentoGridExampleProps): ReactElement {
  return (
    <div style={{ width: "min(100%, 960px)" }}>
      <BentoGrid columns={columns} gap={gap} dense={dense}>
        <BentoGridItem colSpan={2} smColSpan={2} surface="primary">
          <BentoGridItemHeader>
            <div className="flex items-center gap-2">
              <BentoGridItemIcon className="bg-primary/15 text-primary">
                <Sparkles />
              </BentoGridItemIcon>
              <BentoGridItemTitle>Vault Analytics</BentoGridItemTitle>
            </div>
            <span className="text-xs text-muted-foreground">Live</span>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemDescription>
              Real-time usage across every vault in this workspace, aggregated
              per hour and refreshed at the edge.
            </BentoGridItemDescription>
            <div className="mt-3 flex items-end gap-1 h-16">
              {[24, 42, 31, 58, 39, 71, 48, 63, 55, 82, 68, 91].map(
                (bar, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-sm bg-primary/70"
                    style={{ height: `${bar}%` }}
                  />
                ),
              )}
            </div>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem>
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Users />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>1,284</BentoGridItemTitle>
            <BentoGridItemDescription>Active members</BentoGridItemDescription>
          </BentoGridItemContent>
          <BentoGridItemFooter>
            <span className="text-emerald-600 dark:text-emerald-400">
              +12.4%
            </span>
            <span>this month</span>
          </BentoGridItemFooter>
        </BentoGridItem>

        <BentoGridItem>
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Database />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>3.4 TB</BentoGridItemTitle>
            <BentoGridItemDescription>Encrypted storage</BentoGridItemDescription>
          </BentoGridItemContent>
          <BentoGridItemFooter>
            <span>68% of quota</span>
          </BentoGridItemFooter>
        </BentoGridItem>

        <BentoGridItem>
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <KeyRound />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>428</BentoGridItemTitle>
            <BentoGridItemDescription>
              Managed secrets
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem colSpan={2} smColSpan={2} surface="muted">
          <BentoGridItemHeader>
            <div className="flex items-center gap-2">
              <BentoGridItemIcon>
                <ShieldCheck />
              </BentoGridItemIcon>
              <BentoGridItemTitle>Security posture</BentoGridItemTitle>
            </div>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemDescription>
              All vaults enforce MFA, rotate credentials automatically, and
              have exceeded the recommended baseline for the past 30 days.
            </BentoGridItemDescription>
          </BentoGridItemContent>
          <BentoGridItemFooter>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-current" />
              Healthy
            </span>
            <span>Last audit · 2h ago</span>
          </BentoGridItemFooter>
        </BentoGridItem>
      </BentoGrid>
    </div>
  );
}

const meta = {
  title: "Components/BentoGrid",
  component: BentoGridExample,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    columns: {
      control: { type: "select" },
      options: bentoGridColumnCounts,
    },
    gap: {
      control: { type: "select" },
      options: bentoGridGapIds,
    },
    dense: {
      control: { type: "boolean" },
    },
  },
  args: {
    columns: 3,
    gap: "md",
    dense: false,
  },
} satisfies Meta<typeof BentoGridExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FourColumns: Story = {
  args: { columns: 4 },
};

export const SixColumns: Story = {
  args: { columns: 6, gap: "sm" },
};

export const DensePacking: Story = {
  args: { dense: true },
};

export const FeatureShowcase: Story = {
  render: () => (
    <div style={{ width: "min(100%, 960px)" }}>
      <BentoGrid columns={3} gap="md">
        <BentoGridItem colSpan={2} rowSpan={2} surface="card">
          <BentoGridItemHeader>
            <div className="flex items-center gap-2">
              <BentoGridItemIcon className="bg-primary/10 text-primary">
                <Zap />
              </BentoGridItemIcon>
              <BentoGridItemTitle>Sub-millisecond lookups</BentoGridItemTitle>
            </div>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemDescription>
              SchemaVaults keeps hot secrets in an in-memory replica so reads
              from any region complete in under a millisecond, even under
              heavy fan-out.
            </BentoGridItemDescription>
            <div className="mt-4 flex-1 rounded-md bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem surface="accent">
          <BentoGridItemHeader>
            <BentoGridItemIcon className="bg-background/40 text-current">
              <Lock />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>Envelope encryption</BentoGridItemTitle>
            <BentoGridItemDescription className="text-accent-foreground/80">
              AES-256-GCM per record.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem surface="outline">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <GitBranch />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>Versioned schemas</BentoGridItemTitle>
            <BentoGridItemDescription>
              Every migration is diff-able and revertible.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem colSpan={3} surface="muted">
          <BentoGridItemHeader>
            <div className="flex items-center gap-2">
              <BentoGridItemIcon>
                <Activity />
              </BentoGridItemIcon>
              <BentoGridItemTitle>Compliance-ready audit trail</BentoGridItemTitle>
            </div>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemDescription>
              Immutable, append-only event log covering every read, write, and
              policy change. Streamed to your SIEM in near-real time.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
};

export const InteractiveTiles: Story = {
  render: () => (
    <div style={{ width: "min(100%, 720px)" }}>
      <BentoGrid columns={3} gap="md">
        {[
          { title: "Create vault", desc: "Start a new encrypted namespace." },
          {
            title: "Invite teammate",
            desc: "Add a collaborator with scoped access.",
          },
          { title: "Rotate keys", desc: "Regenerate all active credentials." },
          {
            title: "View audit log",
            desc: "Inspect every access event from the last 30 days.",
          },
          { title: "Configure SSO", desc: "Wire up your identity provider." },
          {
            title: "Export policy",
            desc: "Download the current access policy as JSON.",
          },
        ].map((tile) => (
          <BentoGridItem
            key={tile.title}
            interactive
            role="button"
            tabIndex={0}
          >
            <BentoGridItemHeader>
              <BentoGridItemIcon>
                <Sparkles />
              </BentoGridItemIcon>
            </BentoGridItemHeader>
            <BentoGridItemContent>
              <BentoGridItemTitle>{tile.title}</BentoGridItemTitle>
              <BentoGridItemDescription>{tile.desc}</BentoGridItemDescription>
            </BentoGridItemContent>
          </BentoGridItem>
        ))}
      </BentoGrid>
    </div>
  ),
};
