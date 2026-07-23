import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Cloud,
  Code2,
  Database,
  Globe,
  KeyRound,
  Lock,
  Rocket,
  Shield,
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
  bentoGridItemVariantIds,
  type BentoGridColumnCount,
  type BentoGridGapId,
  type BentoGridItemVariantId,
} from "./bento-grid";

interface BentoGridExampleProps {
  columns?: BentoGridColumnCount;
  gap?: BentoGridGapId;
  variant?: BentoGridItemVariantId;
  interactive?: boolean;
}

function BentoGridExample({
  columns = 3,
  gap = "md",
  variant = "default",
  interactive = false,
}: BentoGridExampleProps): ReactElement {
  return (
    <div style={{ width: "100%", maxWidth: 1080 }}>
      <BentoGrid columns={columns} gap={gap}>
        <BentoGridItem variant={variant} interactive={interactive} colSpan={2}>
          <BentoGridItemHeader>
            <Sparkles className="size-16 text-primary/60" />
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemIcon variant={variant}>
              <Sparkles />
            </BentoGridItemIcon>
            <BentoGridItemTitle>AI-powered search</BentoGridItemTitle>
            <BentoGridItemDescription>
              Semantic vector search across your entire schema catalog with
              natural-language queries.
            </BentoGridItemDescription>
            <BentoGridItemFooter>
              <span>Powered by Claude</span>
            </BentoGridItemFooter>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant={variant} interactive={interactive}>
          <BentoGridItemContent>
            <BentoGridItemIcon variant={variant}>
              <ShieldCheck />
            </BentoGridItemIcon>
            <BentoGridItemTitle>End-to-end encryption</BentoGridItemTitle>
            <BentoGridItemDescription>
              Zero-knowledge architecture. Only you hold the keys.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant={variant} interactive={interactive}>
          <BentoGridItemContent>
            <BentoGridItemIcon variant={variant}>
              <Zap />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Lightning fast</BentoGridItemTitle>
            <BentoGridItemDescription>
              P99 latency under 40ms globally, backed by our edge network.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant={variant} interactive={interactive} colSpan={2}>
          <BentoGridItemContent>
            <BentoGridItemIcon variant={variant}>
              <Globe />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Distributed everywhere</BentoGridItemTitle>
            <BentoGridItemDescription>
              Deploy schemas to 30+ regions with a single API call. Consistent
              reads, everywhere.
            </BentoGridItemDescription>
            <BentoGridItemFooter>
              <span>30+ regions</span>
              <span>·</span>
              <span>Multi-master replication</span>
            </BentoGridItemFooter>
          </BentoGridItemContent>
        </BentoGridItem>
      </BentoGrid>
    </div>
  );
}

const meta = {
  title: "Components/BentoGrid",
  component: BentoGridExample,
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
    variant: {
      options: bentoGridItemVariantIds,
      control: { type: "radio" },
    },
    interactive: { control: { type: "boolean" } },
  },
  args: {
    columns: 3,
    gap: "md",
    variant: "default",
    interactive: false,
  },
} satisfies Meta<typeof BentoGridExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  args: {
    interactive: true,
  },
};

export const FourColumns: Story = {
  args: {
    columns: 4,
  },
};

export const LargeGap: Story = {
  args: {
    gap: "lg",
  },
};

export const MutedVariant: Story = {
  args: {
    variant: "muted",
  },
};

export const PrimaryVariant: Story = {
  args: {
    variant: "primary",
  },
};

export const OutlineVariant: Story = {
  args: {
    variant: "outline",
  },
};

function FeatureShowcase(): ReactElement {
  return (
    <div style={{ width: "100%", maxWidth: 1080 }}>
      <BentoGrid columns={3} gap="md">
        <BentoGridItem variant="primary" colSpan={2} interactive>
          <BentoGridItemHeader className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
            <Rocket className="size-20 text-primary" />
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemIcon variant="primary">
              <Rocket />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Ship faster with SchemaVaults</BentoGridItemTitle>
            <BentoGridItemDescription>
              Version-controlled schemas, previewed pull requests, and one-click
              rollbacks. Your team ships without fear.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="default" interactive>
          <BentoGridItemContent>
            <BentoGridItemIcon variant="default">
              <Database />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Any datastore</BentoGridItemTitle>
            <BentoGridItemDescription>
              Postgres, MongoDB, DynamoDB, and more.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="default" interactive>
          <BentoGridItemContent>
            <BentoGridItemIcon variant="default">
              <Code2 />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Type-safe SDKs</BentoGridItemTitle>
            <BentoGridItemDescription>
              Auto-generated clients for TypeScript, Python, Go, Rust, and
              Swift.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="warning" interactive>
          <BentoGridItemContent>
            <BentoGridItemIcon variant="warning">
              <KeyRound />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Key rotation</BentoGridItemTitle>
            <BentoGridItemDescription>
              Automated rotation policies with audit trails.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="destructive" interactive>
          <BentoGridItemContent>
            <BentoGridItemIcon variant="destructive">
              <Shield />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Threat detection</BentoGridItemTitle>
            <BentoGridItemDescription>
              Real-time anomaly alerts across all vault access.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>
      </BentoGrid>
    </div>
  );
}

export const FeatureShowcaseExample: StoryObj = {
  name: "Feature showcase",
  render: () => <FeatureShowcase />,
  parameters: { layout: "padded" },
};

function DashboardBento(): ReactElement {
  return (
    <div style={{ width: "100%", maxWidth: 1200 }}>
      <BentoGrid columns={4} gap="md">
        <BentoGridItem variant="primary" colSpan={2} rowSpan={2}>
          <BentoGridItemContent className="h-full">
            <BentoGridItemIcon variant="primary">
              <BarChart3 />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Analytics overview</BentoGridItemTitle>
            <BentoGridItemDescription>
              Query volume, error rates, and top consumers of your schemas at a
              glance.
            </BentoGridItemDescription>
            <div className="mt-4 flex flex-1 items-end gap-1">
              {[40, 65, 45, 80, 55, 90, 72, 60, 85, 95, 78, 88].map(
                (h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 rounded-sm bg-primary/40"
                  />
                ),
              )}
            </div>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="default">
          <BentoGridItemContent>
            <BentoGridItemIcon variant="default">
              <Users />
            </BentoGridItemIcon>
            <BentoGridItemTitle>3,512</BentoGridItemTitle>
            <BentoGridItemDescription>Active users</BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="default">
          <BentoGridItemContent>
            <BentoGridItemIcon variant="default">
              <Activity />
            </BentoGridItemIcon>
            <BentoGridItemTitle>9,431</BentoGridItemTitle>
            <BentoGridItemDescription>
              Webhooks / hour
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="muted" colSpan={2}>
          <BentoGridItemContent>
            <BentoGridItemIcon variant="muted">
              <Cloud />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Multi-cloud</BentoGridItemTitle>
            <BentoGridItemDescription>
              Currently deployed to AWS, GCP, and Azure regions.
            </BentoGridItemDescription>
            <BentoGridItemFooter>
              <span className="rounded bg-background px-2 py-0.5">
                us-east-1
              </span>
              <span className="rounded bg-background px-2 py-0.5">
                eu-west-2
              </span>
              <span className="rounded bg-background px-2 py-0.5">
                ap-southeast-1
              </span>
              <span className="rounded bg-background px-2 py-0.5">+8</span>
            </BentoGridItemFooter>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="accent">
          <BentoGridItemContent>
            <BentoGridItemIcon variant="accent">
              <Bell />
            </BentoGridItemIcon>
            <BentoGridItemTitle>7 alerts</BentoGridItemTitle>
            <BentoGridItemDescription>Unread today</BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="destructive">
          <BentoGridItemContent>
            <BentoGridItemIcon variant="destructive">
              <Lock />
            </BentoGridItemIcon>
            <BentoGridItemTitle>2 breaches</BentoGridItemTitle>
            <BentoGridItemDescription>Investigating</BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="outline" colSpan={2}>
          <BentoGridItemContent>
            <BentoGridItemIcon variant="outline">
              <BookOpen />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Docs & guides</BentoGridItemTitle>
            <BentoGridItemDescription>
              12 new examples added this week.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>
      </BentoGrid>
    </div>
  );
}

export const DashboardExample: StoryObj = {
  name: "Dashboard bento",
  render: () => <DashboardBento />,
  parameters: { layout: "padded" },
};

function AllVariants(): ReactElement {
  return (
    <div style={{ width: "100%", maxWidth: 1080 }}>
      <BentoGrid columns={3} gap="md">
        {bentoGridItemVariantIds.map((v) => (
          <BentoGridItem key={v} variant={v} interactive>
            <BentoGridItemContent>
              <BentoGridItemIcon variant={v}>
                <Sparkles />
              </BentoGridItemIcon>
              <BentoGridItemTitle>{v}</BentoGridItemTitle>
              <BentoGridItemDescription>
                Variant &ldquo;{v}&rdquo; using tokens from
                @schemavaults/theme.
              </BentoGridItemDescription>
            </BentoGridItemContent>
          </BentoGridItem>
        ))}
      </BentoGrid>
    </div>
  );
}

export const AllVariantsExample: StoryObj = {
  name: "All variants",
  render: () => <AllVariants />,
  parameters: { layout: "padded" },
};
