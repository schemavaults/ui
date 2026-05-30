import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  Activity,
  Bell,
  Cloud,
  Database,
  GitBranch,
  Lock,
  ShieldCheck,
  Sparkles,
  TrendingUp,
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
  bentoGridColumnIds,
  bentoGridGapIds,
  bentoGridItemSizeIds,
  bentoGridItemVariantIds,
  type BentoGridColumnId,
  type BentoGridGapId,
  type BentoGridItemVariantId,
} from "./bento-grid";

interface PlaygroundProps {
  columns?: BentoGridColumnId;
  gap?: BentoGridGapId;
  variant?: BentoGridItemVariantId;
  interactive?: boolean;
}

function PlaygroundDemo({
  columns = "3",
  gap = "md",
  variant = "default",
  interactive = false,
}: PlaygroundProps): ReactElement {
  return (
    <div style={{ maxWidth: 1100 }}>
      <BentoGrid columns={columns} gap={gap}>
        <BentoGridItem variant={variant} size="2x2" interactive={interactive}>
          <BentoGridItemHeader>
            <BentoGridItemIcon variant={variant}>
              <Sparkles />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Smart Schema Detection</BentoGridItemTitle>
          <BentoGridItemDescription>
            Automatically infer column types, foreign keys, and relationships
            from a single sample document.
          </BentoGridItemDescription>
          <BentoGridItemContent>
            <div className="mt-auto rounded-md bg-muted/60 p-3 font-mono text-xs text-muted-foreground">
              {`{ "id": "uuid", "created_at": "timestamp" }`}
            </div>
          </BentoGridItemContent>
          <BentoGridItemFooter>
            <span>Updated 2h ago</span>
          </BentoGridItemFooter>
        </BentoGridItem>

        <BentoGridItem variant={variant} size="1x1" interactive={interactive}>
          <BentoGridItemHeader>
            <BentoGridItemIcon variant={variant}>
              <ShieldCheck />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>SOC 2 Ready</BentoGridItemTitle>
          <BentoGridItemDescription>
            Audit trails, RBAC, and encryption at rest.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant={variant} size="1x1" interactive={interactive}>
          <BentoGridItemHeader>
            <BentoGridItemIcon variant={variant}>
              <Zap />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Lightning Fast</BentoGridItemTitle>
          <BentoGridItemDescription>
            p95 query latency under 30ms.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant={variant} size="2x1" interactive={interactive}>
          <BentoGridItemHeader>
            <BentoGridItemIcon variant={variant}>
              <Workflow />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Visual Workflow Builder</BentoGridItemTitle>
          <BentoGridItemDescription>
            Compose multi-step data pipelines without leaving the browser.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant={variant} size="1x1" interactive={interactive}>
          <BentoGridItemHeader>
            <BentoGridItemIcon variant={variant}>
              <Cloud />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Multi-Cloud</BentoGridItemTitle>
          <BentoGridItemDescription>
            AWS, GCP, Azure, and your own metal.
          </BentoGridItemDescription>
        </BentoGridItem>
      </BentoGrid>
    </div>
  );
}

const meta = {
  title: "Components/BentoGrid",
  component: PlaygroundDemo,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    columns: {
      options: bentoGridColumnIds,
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
    columns: "3",
    gap: "md",
    variant: "default",
    interactive: false,
  },
} satisfies Meta<typeof PlaygroundDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-8" style={{ maxWidth: 1100 }}>
      {bentoGridItemVariantIds.map((variant) => (
        <section key={variant} className="flex flex-col gap-3">
          <h4 className="text-sm font-medium capitalize text-muted-foreground">
            {variant}
          </h4>
          <BentoGrid columns="3" gap="md">
            <BentoGridItem variant={variant} size="1x1">
              <BentoGridItemHeader>
                <BentoGridItemIcon variant={variant}>
                  <Sparkles />
                </BentoGridItemIcon>
              </BentoGridItemHeader>
              <BentoGridItemTitle>Featured</BentoGridItemTitle>
              <BentoGridItemDescription>
                A highlight card using the {variant} variant.
              </BentoGridItemDescription>
            </BentoGridItem>
            <BentoGridItem variant={variant} size="1x1">
              <BentoGridItemHeader>
                <BentoGridItemIcon variant={variant}>
                  <Activity />
                </BentoGridItemIcon>
              </BentoGridItemHeader>
              <BentoGridItemTitle>Live</BentoGridItemTitle>
              <BentoGridItemDescription>
                Streaming updates across all panels.
              </BentoGridItemDescription>
            </BentoGridItem>
            <BentoGridItem variant={variant} size="1x1">
              <BentoGridItemHeader>
                <BentoGridItemIcon variant={variant}>
                  <Lock />
                </BentoGridItemIcon>
              </BentoGridItemHeader>
              <BentoGridItemTitle>Secure</BentoGridItemTitle>
              <BentoGridItemDescription>
                End-to-end encryption everywhere.
              </BentoGridItemDescription>
            </BentoGridItem>
          </BentoGrid>
        </section>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div style={{ maxWidth: 1100 }}>
      <BentoGrid columns="3" gap="md">
        {bentoGridItemSizeIds.map((size) => (
          <BentoGridItem key={size} variant="muted" size={size}>
            <BentoGridItemHeader>
              <BentoGridItemIcon variant="muted">
                <GitBranch />
              </BentoGridItemIcon>
            </BentoGridItemHeader>
            <BentoGridItemTitle>Size {size}</BentoGridItemTitle>
            <BentoGridItemDescription>
              Spans {size.split("x")[0]} columns and {size.split("x")[1]} rows
              on desktop.
            </BentoGridItemDescription>
          </BentoGridItem>
        ))}
      </BentoGrid>
    </div>
  ),
};

export const Interactive: Story = {
  render: (): ReactElement => (
    <div style={{ maxWidth: 900 }}>
      <BentoGrid columns="3" gap="md">
        <BentoGridItem
          variant="primary"
          size="2x1"
          interactive
          onClick={(): void => {
            window.alert("Clicked: New Vault");
          }}
        >
          <BentoGridItemHeader>
            <BentoGridItemIcon variant="primary">
              <Database />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Create a new vault</BentoGridItemTitle>
          <BentoGridItemDescription>
            Spin up an isolated schema in seconds. Click anywhere on the card.
          </BentoGridItemDescription>
        </BentoGridItem>
        <BentoGridItem
          variant="default"
          size="1x1"
          interactive
          onClick={(): void => {
            window.alert("Clicked: Invite Team");
          }}
        >
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Users />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Invite teammates</BentoGridItemTitle>
          <BentoGridItemDescription>
            Grant scoped access to specific vaults.
          </BentoGridItemDescription>
        </BentoGridItem>
        <BentoGridItem
          variant="default"
          size="1x1"
          interactive
          onClick={(): void => {
            window.alert("Clicked: Configure Alerts");
          }}
        >
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Bell />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Configure alerts</BentoGridItemTitle>
          <BentoGridItemDescription>
            Get notified when thresholds are crossed.
          </BentoGridItemDescription>
        </BentoGridItem>
        <BentoGridItem
          variant="default"
          size="1x1"
          interactive
          onClick={(): void => {
            window.alert("Clicked: View Trends");
          }}
        >
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <TrendingUp />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Browse trends</BentoGridItemTitle>
          <BentoGridItemDescription>
            Visualize growth across your projects.
          </BentoGridItemDescription>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
};

export const FeatureShowcase: Story = {
  render: (): ReactElement => (
    <div style={{ maxWidth: 1100 }}>
      <BentoGrid columns="3" gap="md">
        <BentoGridItem variant="gradient" size="2x2">
          <BentoGridItemHeader>
            <BentoGridItemIcon variant="gradient">
              <Sparkles />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>AI-assisted migrations</BentoGridItemTitle>
          <BentoGridItemDescription>
            Describe the change you want and let SchemaVaults generate a
            reversible migration plan with safety checks.
          </BentoGridItemDescription>
          <BentoGridItemContent>
            <div className="mt-auto flex flex-col gap-2">
              <div className="rounded-md bg-background/80 p-3 font-mono text-xs">
                ALTER TABLE users ADD COLUMN tenant_id uuid;
              </div>
              <div className="rounded-md bg-background/80 p-3 font-mono text-xs">
                CREATE INDEX idx_users_tenant ON users(tenant_id);
              </div>
            </div>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="primary" size="1x1">
          <BentoGridItemHeader>
            <BentoGridItemIcon variant="primary">
              <ShieldCheck />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Compliance built in</BentoGridItemTitle>
          <BentoGridItemDescription>
            SOC 2, HIPAA, and GDPR controls ready out of the box.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant="default" size="1x1">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Zap />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Sub-30ms queries</BentoGridItemTitle>
          <BentoGridItemDescription>
            Edge-cached reads for read-heavy workloads.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant="accent" size="3x1">
          <BentoGridItemHeader>
            <BentoGridItemIcon variant="accent">
              <Workflow />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>End-to-end pipelines</BentoGridItemTitle>
          <BentoGridItemDescription>
            From ingestion to dashboards in a single integrated environment —
            no glue code required.
          </BentoGridItemDescription>
          <BentoGridItemFooter>
            <span>Connectors:</span>
            <span className="rounded-full bg-background/80 px-2 py-0.5">
              Postgres
            </span>
            <span className="rounded-full bg-background/80 px-2 py-0.5">
              Snowflake
            </span>
            <span className="rounded-full bg-background/80 px-2 py-0.5">
              BigQuery
            </span>
            <span className="rounded-full bg-background/80 px-2 py-0.5">
              S3
            </span>
          </BentoGridItemFooter>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
};

export const GapSizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-8" style={{ maxWidth: 900 }}>
      {bentoGridGapIds.map((gap) => (
        <section key={gap} className="flex flex-col gap-3">
          <h4 className="text-sm font-medium capitalize text-muted-foreground">
            Gap: {gap}
          </h4>
          <BentoGrid columns="3" gap={gap}>
            <BentoGridItem variant="muted" size="1x1">
              <BentoGridItemTitle>Tile A</BentoGridItemTitle>
              <BentoGridItemDescription>
                Compact spacing.
              </BentoGridItemDescription>
            </BentoGridItem>
            <BentoGridItem variant="muted" size="1x1">
              <BentoGridItemTitle>Tile B</BentoGridItemTitle>
              <BentoGridItemDescription>
                Default density.
              </BentoGridItemDescription>
            </BentoGridItem>
            <BentoGridItem variant="muted" size="1x1">
              <BentoGridItemTitle>Tile C</BentoGridItemTitle>
              <BentoGridItemDescription>Breathable.</BentoGridItemDescription>
            </BentoGridItem>
          </BentoGrid>
        </section>
      ))}
    </div>
  ),
};
