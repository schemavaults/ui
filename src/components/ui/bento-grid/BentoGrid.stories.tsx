import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Database,
  GitBranch,
  KeyRound,
  Lock,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

import {
  BentoGrid,
  BentoGridItem,
  BentoGridItemButton,
  BentoGridItemContent,
  BentoGridItemDescription,
  BentoGridItemFooter,
  BentoGridItemHeader,
  BentoGridItemIcon,
  BentoGridItemTitle,
  bentoGridColumnIds,
  bentoGridGapIds,
  bentoGridItemColSpanIds,
  bentoGridItemPaddingIds,
  bentoGridItemRowSpanIds,
  bentoGridItemVariantIds,
  type BentoGridColumnId,
  type BentoGridGapId,
  type BentoGridItemColSpanId,
  type BentoGridItemPaddingId,
  type BentoGridItemRowSpanId,
  type BentoGridItemVariantId,
} from "./bento-grid";

interface BentoGridPlaygroundProps {
  columns?: BentoGridColumnId;
  gap?: BentoGridGapId;
  variant?: BentoGridItemVariantId;
  padding?: BentoGridItemPaddingId;
  colSpan?: BentoGridItemColSpanId;
  rowSpan?: BentoGridItemRowSpanId;
  interactive?: boolean;
}

function BentoGridPlayground({
  columns = "3",
  gap = "md",
  variant = "default",
  padding = "md",
  colSpan = "1",
  rowSpan = "1",
  interactive = false,
}: BentoGridPlaygroundProps): ReactElement {
  return (
    <div style={{ width: "100%", maxWidth: 960 }}>
      <BentoGrid columns={columns} gap={gap}>
        <BentoGridItem
          variant={variant}
          padding={padding}
          colSpan={colSpan}
          rowSpan={rowSpan}
          interactive={interactive}
        >
          <BentoGridItemHeader>
            <BentoGridItemTitle>Feature-tuned tile</BentoGridItemTitle>
            <BentoGridItemIcon variant={variant}>
              <Sparkles />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemDescription>
            Adjust variants, spans, and padding from the controls panel.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem>
          <BentoGridItemHeader>
            <BentoGridItemTitle>Neighbor</BentoGridItemTitle>
            <BentoGridItemIcon>
              <Database />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemDescription>
            Sits next to the playground tile so you can see how spans reflow.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem>
          <BentoGridItemHeader>
            <BentoGridItemTitle>Neighbor</BentoGridItemTitle>
            <BentoGridItemIcon>
              <Users />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemDescription>
            Try setting the first tile to `colSpan: &quot;2&quot;` and watch the layout adapt.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem>
          <BentoGridItemHeader>
            <BentoGridItemTitle>Neighbor</BentoGridItemTitle>
            <BentoGridItemIcon>
              <Activity />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemDescription>
            Set `rowSpan` to make the featured tile a tall hero.
          </BentoGridItemDescription>
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
      options: bentoGridColumnIds,
      control: { type: "inline-radio" },
    },
    gap: {
      options: bentoGridGapIds,
      control: { type: "inline-radio" },
    },
    variant: {
      options: bentoGridItemVariantIds,
      control: { type: "select" },
    },
    padding: {
      options: bentoGridItemPaddingIds,
      control: { type: "inline-radio" },
    },
    colSpan: {
      options: bentoGridItemColSpanIds,
      control: { type: "inline-radio" },
    },
    rowSpan: {
      options: bentoGridItemRowSpanIds,
      control: { type: "inline-radio" },
    },
    interactive: {
      control: { type: "boolean" },
    },
  },
  args: {
    columns: "3",
    gap: "md",
    variant: "default",
    padding: "md",
    colSpan: "1",
    rowSpan: "1",
    interactive: false,
  },
} satisfies Meta<typeof BentoGridPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FeatureShowcase: StoryObj = {
  render: () => (
    <div style={{ width: "100%", maxWidth: 1080 }}>
      <BentoGrid columns="3" gap="md">
        <BentoGridItem variant="primary" colSpan="2" rowSpan="2" padding="lg">
          <BentoGridItemHeader>
            <BentoGridItemTitle>Vault-native schemas</BentoGridItemTitle>
            <BentoGridItemIcon variant="primary">
              <ShieldCheck />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemDescription>
            Version, review, and publish every schema behind the same
            cryptographic guarantees your secrets already enjoy.
          </BentoGridItemDescription>
          <BentoGridItemContent>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 font-medium text-primary">
                Signed commits
              </span>
              <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 font-medium text-primary">
                Peer review
              </span>
              <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 font-medium text-primary">
                Audit log
              </span>
            </div>
          </BentoGridItemContent>
          <BentoGridItemFooter>
            <span className="inline-flex items-center gap-1 font-medium text-primary">
              Read the spec <ArrowRight className="size-3.5" />
            </span>
          </BentoGridItemFooter>
        </BentoGridItem>

        <BentoGridItem variant="accent">
          <BentoGridItemHeader>
            <BentoGridItemTitle>Zero-config drivers</BentoGridItemTitle>
            <BentoGridItemIcon variant="accent">
              <Zap />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemDescription>
            First-class SDKs for TypeScript, Python, Go, and Rust — all
            generated from the same schema.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant="muted">
          <BentoGridItemHeader>
            <BentoGridItemTitle>Time-travel diffs</BentoGridItemTitle>
            <BentoGridItemIcon variant="muted">
              <GitBranch />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemDescription>
            Compare any two commits side-by-side with breaking-change
            detection built into the review flow.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem colSpan="3">
          <BentoGridItemHeader>
            <BentoGridItemTitle>Deploy anywhere</BentoGridItemTitle>
            <BentoGridItemIcon>
              <Rocket />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemDescription>
            Push your schemas to any environment — dev, staging, or prod — with
            a single command. Rollbacks are one keystroke away.
          </BentoGridItemDescription>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
};

export const DashboardLayout: StoryObj = {
  render: () => (
    <div style={{ width: "100%", maxWidth: 1080 }}>
      <BentoGrid columns="4" gap="md">
        <BentoGridItem variant="primary">
          <BentoGridItemHeader>
            <BentoGridItemTitle>Active vaults</BentoGridItemTitle>
            <BentoGridItemIcon variant="primary">
              <Database />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <span className="text-3xl font-semibold tabular-nums leading-none">
              1,284
            </span>
            <BentoGridItemDescription>
              Across 12 organizations
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem>
          <BentoGridItemHeader>
            <BentoGridItemTitle>Active users</BentoGridItemTitle>
            <BentoGridItemIcon>
              <Users />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <span className="text-3xl font-semibold tabular-nums leading-none">
              3,512
            </span>
            <BentoGridItemDescription>past 24 hours</BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="warning">
          <BentoGridItemHeader>
            <BentoGridItemTitle>Expiring keys</BentoGridItemTitle>
            <BentoGridItemIcon variant="warning">
              <KeyRound />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <span className="text-3xl font-semibold tabular-nums leading-none">
              14
            </span>
            <BentoGridItemDescription>within 7 days</BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="destructive">
          <BentoGridItemHeader>
            <BentoGridItemTitle>Failed auth</BentoGridItemTitle>
            <BentoGridItemIcon variant="destructive">
              <Lock />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <span className="text-3xl font-semibold tabular-nums leading-none">
              237
            </span>
            <BentoGridItemDescription>last 24 hours</BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem colSpan="2" rowSpan="2" variant="muted" padding="lg">
          <BentoGridItemHeader>
            <BentoGridItemTitle>Traffic by region</BentoGridItemTitle>
            <BentoGridItemIcon variant="muted">
              <BarChart3 />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemDescription>
              Requests per minute over the last hour.
            </BentoGridItemDescription>
            <div
              className="mt-3 flex h-40 items-end gap-1.5 rounded-md border border-border/50 bg-background/60 p-3"
              aria-hidden="true"
            >
              {[38, 62, 45, 78, 92, 74, 58, 82, 66, 90, 71, 85].map((v, i) => (
                <div
                  key={i}
                  style={{ height: `${v}%` }}
                  className="flex-1 rounded-t bg-primary/50"
                />
              ))}
            </div>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem colSpan="2">
          <BentoGridItemHeader>
            <BentoGridItemTitle>Recent activity</BentoGridItemTitle>
            <BentoGridItemIcon>
              <Activity />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
                <span>schema.published</span>
                <span className="text-xs text-muted-foreground">2m ago</span>
              </li>
              <li className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
                <span>vault.rotated</span>
                <span className="text-xs text-muted-foreground">14m ago</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span>key.expired</span>
                <span className="text-xs text-muted-foreground">1h ago</span>
              </li>
            </ul>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="accent">
          <BentoGridItemHeader>
            <BentoGridItemTitle>Notifications</BentoGridItemTitle>
            <BentoGridItemIcon variant="accent">
              <Bell />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <span className="text-3xl font-semibold tabular-nums leading-none">
              9
            </span>
            <BentoGridItemDescription>
              unread across channels
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="outline">
          <BentoGridItemHeader>
            <BentoGridItemTitle>Workflows</BentoGridItemTitle>
            <BentoGridItemIcon variant="outline">
              <Workflow />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <span className="text-3xl font-semibold tabular-nums leading-none">
              42
            </span>
            <BentoGridItemDescription>
              scheduled this week
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
};

export const AllVariants: StoryObj = {
  render: () => (
    <div style={{ width: "100%", maxWidth: 1080 }}>
      <BentoGrid columns="4" gap="md">
        {bentoGridItemVariantIds.map((variant) => (
          <BentoGridItem key={variant} variant={variant}>
            <BentoGridItemHeader>
              <BentoGridItemTitle>{variant}</BentoGridItemTitle>
              <BentoGridItemIcon variant={variant}>
                <Sparkles />
              </BentoGridItemIcon>
            </BentoGridItemHeader>
            <BentoGridItemDescription>
              The <code>{variant}</code> color variant, wired to
              @schemavaults/theme tokens.
            </BentoGridItemDescription>
          </BentoGridItem>
        ))}
      </BentoGrid>
    </div>
  ),
};

export const InteractiveTiles: StoryObj = {
  render: () => (
    <div style={{ width: "100%", maxWidth: 720 }}>
      <BentoGrid columns="3" gap="md">
        <BentoGridItemButton
          variant="default"
          onClick={() => alert("Create vault")}
        >
          <BentoGridItemHeader>
            <BentoGridItemTitle>New vault</BentoGridItemTitle>
            <BentoGridItemIcon>
              <Database />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemDescription>
            Provision a fresh schema-backed vault in seconds.
          </BentoGridItemDescription>
        </BentoGridItemButton>

        <BentoGridItemButton
          variant="primary"
          onClick={() => alert("Invite team")}
        >
          <BentoGridItemHeader>
            <BentoGridItemTitle>Invite teammates</BentoGridItemTitle>
            <BentoGridItemIcon variant="primary">
              <Users />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemDescription>
            Share access with SSO-backed teams and preset roles.
          </BentoGridItemDescription>
        </BentoGridItemButton>

        <BentoGridItemButton
          variant="accent"
          onClick={() => alert("Rotate keys")}
        >
          <BentoGridItemHeader>
            <BentoGridItemTitle>Rotate keys</BentoGridItemTitle>
            <BentoGridItemIcon variant="accent">
              <KeyRound />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemDescription>
            Kick off a rolling rotation across every environment.
          </BentoGridItemDescription>
        </BentoGridItemButton>
      </BentoGrid>
    </div>
  ),
};

export const AsLink: StoryObj = {
  render: () => (
    <div style={{ width: "100%", maxWidth: 720 }}>
      <BentoGrid columns="2" gap="md">
        <BentoGridItem asChild interactive variant="primary">
          <a href="https://schemavaults.com/docs" target="_blank" rel="noreferrer">
            <BentoGridItemHeader>
              <BentoGridItemTitle>Documentation</BentoGridItemTitle>
              <BentoGridItemIcon variant="primary">
                <ArrowRight />
              </BentoGridItemIcon>
            </BentoGridItemHeader>
            <BentoGridItemDescription>
              Browse the full API reference and integration guides.
            </BentoGridItemDescription>
          </a>
        </BentoGridItem>
        <BentoGridItem asChild interactive variant="muted">
          <a
            href="https://schemavaults.com/changelog"
            target="_blank"
            rel="noreferrer"
          >
            <BentoGridItemHeader>
              <BentoGridItemTitle>Changelog</BentoGridItemTitle>
              <BentoGridItemIcon variant="muted">
                <Sparkles />
              </BentoGridItemIcon>
            </BentoGridItemHeader>
            <BentoGridItemDescription>
              See what shipped in the latest release.
            </BentoGridItemDescription>
          </a>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
};
