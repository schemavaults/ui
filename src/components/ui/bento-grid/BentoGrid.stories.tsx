import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  ArrowUpRight,
  BarChart3,
  BellRing,
  Boxes,
  Fingerprint,
  Gauge,
  KeyRound,
  Lock,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
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
    <div style={{ width: "100%", maxWidth: 1024 }}>
      <BentoGrid columns={columns} gap={gap}>
        <BentoGridItem variant={variant} interactive={interactive}>
          <BentoGridItemHeader>
            <BentoGridItemIcon variant={variant}>
              <ShieldCheck />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>Zero-trust vaults</BentoGridItemTitle>
            <BentoGridItemDescription>
              Every secret is encrypted before it leaves the client. Keys are
              wrapped with your organization&apos;s KMS.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant={variant} interactive={interactive}>
          <BentoGridItemHeader>
            <BentoGridItemIcon variant={variant}>
              <Workflow />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>Composable workflows</BentoGridItemTitle>
            <BentoGridItemDescription>
              Chain schema validations, transformations, and delivery hooks
              in a visual builder.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant={variant} interactive={interactive}>
          <BentoGridItemHeader>
            <BentoGridItemIcon variant={variant}>
              <Gauge />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>Sub-second reads</BentoGridItemTitle>
            <BentoGridItemDescription>
              Global edge replicas keep p99 read latency under 40&nbsp;ms —
              anywhere in the world.
            </BentoGridItemDescription>
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
      options: [...bentoGridColumnCounts],
      control: { type: "radio" },
    },
    gap: {
      options: bentoGridGapIds,
      control: { type: "radio" },
    },
    variant: {
      options: bentoGridItemVariantIds,
      control: { type: "select" },
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

export const TwoColumns: Story = {
  args: { columns: 2 },
};

export const FourColumns: Story = {
  args: { columns: 4 },
};

export const MutedVariant: Story = {
  args: { variant: "muted" },
};

export const PrimaryVariant: Story = {
  args: { variant: "primary" },
};

export const GradientVariant: Story = {
  args: { variant: "gradient" },
};

export const OutlineVariant: Story = {
  args: { variant: "outline" },
};

export const Interactive: Story = {
  args: { interactive: true },
};

export const AsymmetricLayout: StoryObj = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ width: "100%", maxWidth: 1024 }}>
      <BentoGrid columns={4} gap="md">
        <BentoGridItem variant="primary" colSpan={2} rowSpan={2}>
          <BentoGridItemHeader>
            <BentoGridItemIcon variant="primary" size="lg">
              <Sparkles />
            </BentoGridItemIcon>
            <span className="text-xs font-medium uppercase tracking-wider text-primary/80">
              Featured
            </span>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle className="text-2xl">
              AI-assisted schema authoring
            </BentoGridItemTitle>
            <BentoGridItemDescription className="mt-2 text-base">
              Describe the data you want to store and SchemaVaults drafts a
              full JSON Schema — with validation rules, index hints, and
              example fixtures ready to review.
            </BentoGridItemDescription>
          </BentoGridItemContent>
          <BentoGridItemFooter>
            <span className="inline-flex items-center gap-1 font-medium text-primary">
              Try the beta <ArrowUpRight className="size-3" />
            </span>
          </BentoGridItemFooter>
        </BentoGridItem>

        <BentoGridItem variant="default" colSpan={2}>
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <BarChart3 />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>Realtime usage</BentoGridItemTitle>
            <BentoGridItemDescription>
              Aggregated across every vault in your org.
            </BentoGridItemDescription>
          </BentoGridItemContent>
          <BentoGridItemFooter>
            <span className="font-semibold tabular-nums text-foreground">
              1.2M
            </span>
            <span>requests / hr</span>
          </BentoGridItemFooter>
        </BentoGridItem>

        <BentoGridItem variant="muted">
          <BentoGridItemHeader>
            <BentoGridItemIcon variant="muted">
              <Users />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>Team access</BentoGridItemTitle>
            <BentoGridItemDescription>
              Fine-grained roles per vault.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="accent">
          <BentoGridItemHeader>
            <BentoGridItemIcon variant="accent">
              <BellRing />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>Alerts</BentoGridItemTitle>
            <BentoGridItemDescription>
              Notify on any schema change or access anomaly.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="warning" colSpan={2}>
          <BentoGridItemHeader>
            <BentoGridItemIcon variant="warning">
              <KeyRound />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>Rotate expiring keys</BentoGridItemTitle>
            <BentoGridItemDescription>
              14 API keys expire in the next 7 days. Rotate them from the
              access panel to avoid downtime.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="default">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Server />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>Regions</BentoGridItemTitle>
            <BentoGridItemDescription>
              9 active, 0 degraded.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="default">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Lock />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>Vault locks</BentoGridItemTitle>
            <BentoGridItemDescription>
              Require two-person approval for prod writes.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
};

export const FeatureShowcase: StoryObj = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ width: "100%", maxWidth: 1024 }}>
      <BentoGrid columns={3} gap="lg">
        <BentoGridItem variant="gradient" colSpan={3}>
          <BentoGridItemHeader>
            <BentoGridItemIcon variant="gradient" size="lg">
              <Boxes />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle className="text-2xl">
              Everything your platform needs to ship faster
            </BentoGridItemTitle>
            <BentoGridItemDescription className="mt-2 text-base">
              A single control plane for schemas, secrets, and access. Built
              for engineering teams that ship dozens of services a day.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="default">
          <BentoGridItemHeader>
            <BentoGridItemIcon variant="primary">
              <Zap />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>Instant deploys</BentoGridItemTitle>
            <BentoGridItemDescription>
              Push a schema and it&apos;s live in every region within seconds.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="default">
          <BentoGridItemHeader>
            <BentoGridItemIcon variant="primary">
              <Fingerprint />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>Audit trail</BentoGridItemTitle>
            <BentoGridItemDescription>
              Every read, write, and permission change is signed and
              queryable.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="default">
          <BentoGridItemHeader>
            <BentoGridItemIcon variant="primary">
              <ShieldCheck />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemContent>
            <BentoGridItemTitle>SOC 2 &amp; HIPAA</BentoGridItemTitle>
            <BentoGridItemDescription>
              Compliant hosting, with BAAs available on the enterprise plan.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
};

export const AllVariants: StoryObj = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ width: "100%", maxWidth: 1024 }}>
      <BentoGrid columns={4} gap="md">
        {bentoGridItemVariantIds.map((variantId) => (
          <BentoGridItem key={variantId} variant={variantId}>
            <BentoGridItemHeader>
              <BentoGridItemIcon variant={variantId}>
                <Sparkles />
              </BentoGridItemIcon>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {variantId}
              </span>
            </BentoGridItemHeader>
            <BentoGridItemContent>
              <BentoGridItemTitle>{variantId}</BentoGridItemTitle>
              <BentoGridItemDescription>
                The <code className="font-mono text-xs">{variantId}</code>{" "}
                variant of a BentoGridItem.
              </BentoGridItemDescription>
            </BentoGridItemContent>
          </BentoGridItem>
        ))}
      </BentoGrid>
    </div>
  ),
};

export const AsLink: StoryObj = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ width: "100%", maxWidth: 720 }}>
      <BentoGrid columns={2} gap="md">
        <BentoGridItem asChild interactive variant="default">
          <a href="#docs">
            <BentoGridItemHeader>
              <BentoGridItemIcon variant="primary">
                <Workflow />
              </BentoGridItemIcon>
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover/bento-item:-translate-y-0.5 group-hover/bento-item:translate-x-0.5" />
            </BentoGridItemHeader>
            <BentoGridItemContent>
              <BentoGridItemTitle>Read the docs</BentoGridItemTitle>
              <BentoGridItemDescription>
                Walkthroughs, API reference, and best-practice guides.
              </BentoGridItemDescription>
            </BentoGridItemContent>
          </a>
        </BentoGridItem>
        <BentoGridItem asChild interactive variant="gradient">
          <a href="#demo">
            <BentoGridItemHeader>
              <BentoGridItemIcon variant="gradient">
                <Sparkles />
              </BentoGridItemIcon>
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover/bento-item:-translate-y-0.5 group-hover/bento-item:translate-x-0.5" />
            </BentoGridItemHeader>
            <BentoGridItemContent>
              <BentoGridItemTitle>Book a demo</BentoGridItemTitle>
              <BentoGridItemDescription>
                See SchemaVaults in a 20-minute walkthrough tailored to your
                stack.
              </BentoGridItemDescription>
            </BentoGridItemContent>
          </a>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
};
