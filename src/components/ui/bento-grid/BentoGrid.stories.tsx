import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  Activity,
  BellRing,
  Database,
  Fingerprint,
  Globe2,
  KeyRound,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
  Terminal,
  Waypoints,
  Zap,
} from "lucide-react";

import {
  BentoCard,
  BentoCardContent,
  BentoCardDescription,
  BentoCardFooter,
  BentoCardHeader,
  BentoCardIcon,
  BentoCardMedia,
  BentoCardTitle,
  BentoGrid,
  bentoCardSizeIds,
  bentoCardVariantIds,
  bentoGridColumnIds,
  bentoGridGapIds,
  type BentoCardSizeId,
  type BentoCardVariantId,
  type BentoGridColumnId,
  type BentoGridGapId,
} from "./bento-grid";
import { Badge } from "../badge/badge";
import { Button } from "../button/button";

interface BentoGridPlaygroundProps {
  columns?: BentoGridColumnId;
  gap?: BentoGridGapId;
  variant?: BentoCardVariantId;
  size?: BentoCardSizeId;
  title?: string;
  description?: string;
  interactive?: boolean;
}

function BentoGridPlayground({
  columns = 3,
  gap = "md",
  variant = "default",
  size = "default",
  title = "Zero-trust primitives",
  description = "Ship access control, secrets, and audit logs in one weekend.",
  interactive = false,
}: BentoGridPlaygroundProps): ReactElement {
  return (
    <div style={{ width: "100%", maxWidth: 1120 }}>
      <BentoGrid columns={columns} gap={gap}>
        <BentoCard variant={variant} size={size} interactive={interactive}>
          <BentoCardHeader>
            <BentoCardTitle>{title}</BentoCardTitle>
            <BentoCardIcon variant={variant}>
              <ShieldCheck />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>{description}</BentoCardDescription>
        </BentoCard>
        <BentoCard>
          <BentoCardHeader>
            <BentoCardTitle>Secrets vault</BentoCardTitle>
            <BentoCardIcon>
              <KeyRound />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            Rotate credentials on a schedule, replicated across regions.
          </BentoCardDescription>
        </BentoCard>
        <BentoCard>
          <BentoCardHeader>
            <BentoCardTitle>Fine-grained IAM</BentoCardTitle>
            <BentoCardIcon>
              <Fingerprint />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            Role and attribute-based access, versioned as code.
          </BentoCardDescription>
        </BentoCard>
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
      control: { type: "radio" },
    },
    gap: {
      options: bentoGridGapIds,
      control: { type: "radio" },
    },
    variant: {
      options: bentoCardVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: bentoCardSizeIds,
      control: { type: "radio" },
    },
    title: { control: { type: "text" } },
    description: { control: { type: "text" } },
    interactive: { control: { type: "boolean" } },
  },
  args: {
    columns: 3,
    gap: "md",
    variant: "default",
    size: "default",
    title: "Zero-trust primitives",
    description: "Ship access control, secrets, and audit logs in one weekend.",
    interactive: false,
  },
} satisfies Meta<typeof BentoGridPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoColumn: Story = {
  args: {
    columns: 2,
  },
};

export const FourColumn: Story = {
  args: {
    columns: 4,
    gap: "sm",
  },
};

export const InteractiveCards: Story = {
  args: {
    interactive: true,
  },
};

function FeatureShowcase(): ReactElement {
  return (
    <div style={{ width: "100%", maxWidth: 1120 }}>
      <BentoGrid columns={3} gap="md">
        <BentoCard size="large" variant="primary">
          <BentoCardHeader>
            <BentoCardTitle>
              End-to-end encrypted vaults for every workload
            </BentoCardTitle>
            <BentoCardIcon variant="primary">
              <ShieldCheck />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            Provision a vault per environment, per team, per customer — with
            hardware-backed keys and per-record audit trails. Rotate secrets
            without redeploying.
          </BentoCardDescription>
          <BentoCardContent>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">FIPS 140-3</Badge>
              <Badge variant="secondary">SOC 2 Type II</Badge>
              <Badge variant="secondary">HIPAA</Badge>
            </div>
          </BentoCardContent>
          <BentoCardFooter>
            <Button size="sm" variant="outline">
              Read the docs
            </Button>
          </BentoCardFooter>
        </BentoCard>

        <BentoCard size="tall" variant="muted">
          <BentoCardHeader>
            <BentoCardTitle>Zero-latency edge</BentoCardTitle>
            <BentoCardIcon variant="muted">
              <Globe2 />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            18 regions, replicated writes, and single-digit millisecond reads
            from the closest node.
          </BentoCardDescription>
          <BentoCardContent>
            <div className="mt-auto flex items-baseline gap-2">
              <span className="text-4xl font-semibold tracking-tight tabular-nums">
                8ms
              </span>
              <span className="text-sm text-muted-foreground">p95</span>
            </div>
          </BentoCardContent>
        </BentoCard>

        <BentoCard>
          <BentoCardHeader>
            <BentoCardTitle>Audit stream</BentoCardTitle>
            <BentoCardIcon>
              <Activity />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            Every read, write, and rotation, replayable and immutable.
          </BentoCardDescription>
        </BentoCard>

        <BentoCard>
          <BentoCardHeader>
            <BentoCardTitle>Webhooks</BentoCardTitle>
            <BentoCardIcon>
              <BellRing />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            Fire signed webhooks on any vault change. HMAC + rotation built in.
          </BentoCardDescription>
        </BentoCard>

        <BentoCard size="wide" variant="accent">
          <BentoCardHeader>
            <BentoCardTitle>Bring your own KMS</BentoCardTitle>
            <BentoCardIcon variant="accent">
              <Lock />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            Wrap SchemaVaults keys with AWS KMS, GCP KMS, or an on-prem HSM —
            without changing a single line of app code.
          </BentoCardDescription>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}

export const FeatureShowcaseStory: StoryObj = {
  name: "Feature showcase",
  render: () => <FeatureShowcase />,
  parameters: {
    layout: "padded",
  },
};

function MixedSizes(): ReactElement {
  return (
    <div style={{ width: "100%", maxWidth: 1120 }}>
      <BentoGrid columns={4} gap="md">
        <BentoCard size="full" variant="primary">
          <BentoCardHeader>
            <BentoCardTitle>Ship faster with SchemaVaults</BentoCardTitle>
            <BentoCardIcon variant="primary">
              <Sparkles />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            A hero tile spanning every column. Perfect for the top of a
            marketing grid.
          </BentoCardDescription>
        </BentoCard>

        <BentoCard>
          <BentoCardHeader>
            <BentoCardTitle>Layers</BentoCardTitle>
            <BentoCardIcon>
              <Layers />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            Composable primitives.
          </BentoCardDescription>
        </BentoCard>

        <BentoCard>
          <BentoCardHeader>
            <BentoCardTitle>Fast</BentoCardTitle>
            <BentoCardIcon>
              <Zap />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            Sub-10ms reads from the edge.
          </BentoCardDescription>
        </BentoCard>

        <BentoCard>
          <BentoCardHeader>
            <BentoCardTitle>Storage</BentoCardTitle>
            <BentoCardIcon>
              <Database />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>Managed, encrypted, backed up.</BentoCardDescription>
        </BentoCard>

        <BentoCard variant="outline">
          <BentoCardHeader>
            <BentoCardTitle>Trigger flows</BentoCardTitle>
            <BentoCardIcon variant="outline">
              <Waypoints />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            Compose event-driven pipelines.
          </BentoCardDescription>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}

export const MixedSizesStory: StoryObj = {
  name: "Mixed sizes",
  render: () => <MixedSizes />,
  parameters: {
    layout: "padded",
  },
};

function WithMedia(): ReactElement {
  return (
    <div style={{ width: "100%", maxWidth: 1120 }}>
      <BentoGrid columns={3} gap="md">
        <BentoCard size="large">
          <BentoCardHeader>
            <BentoCardTitle>Type-safe SDKs</BentoCardTitle>
            <BentoCardIcon>
              <Terminal />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            Autogenerated clients for TypeScript, Go, Python, and Rust.
          </BentoCardDescription>
          <BentoCardMedia className="mt-6 rounded-none border-t border-border bg-muted/30 p-4">
            <pre className="w-full overflow-x-auto text-left text-xs leading-relaxed text-muted-foreground">
              <code>{`import { SchemaVaults } from "@schemavaults/sdk";

const client = new SchemaVaults({ token: process.env.SV_TOKEN });
const secret = await client.secrets.get("stripe/live");`}</code>
            </pre>
          </BentoCardMedia>
        </BentoCard>

        <BentoCard>
          <BentoCardHeader>
            <BentoCardTitle>Rotation</BentoCardTitle>
            <BentoCardIcon>
              <KeyRound />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            Rotate on a schedule or on demand.
          </BentoCardDescription>
        </BentoCard>

        <BentoCard>
          <BentoCardHeader>
            <BentoCardTitle>Access reviews</BentoCardTitle>
            <BentoCardIcon>
              <Fingerprint />
            </BentoCardIcon>
          </BentoCardHeader>
          <BentoCardDescription>
            Quarterly reviews with one-click revocation.
          </BentoCardDescription>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}

export const WithMediaStory: StoryObj = {
  name: "With media well",
  render: () => <WithMedia />,
  parameters: {
    layout: "padded",
  },
};

function VariantMatrix(): ReactElement {
  return (
    <div style={{ width: "100%", maxWidth: 1120 }}>
      <BentoGrid columns={3} gap="md">
        {bentoCardVariantIds.map((variant) => (
          <BentoCard key={variant} variant={variant}>
            <BentoCardHeader>
              <BentoCardTitle>{variant}</BentoCardTitle>
              <BentoCardIcon variant={variant}>
                <Sparkles />
              </BentoCardIcon>
            </BentoCardHeader>
            <BentoCardDescription>
              A BentoCard rendered with the <code>{variant}</code> variant.
            </BentoCardDescription>
          </BentoCard>
        ))}
      </BentoGrid>
    </div>
  );
}

export const VariantMatrixStory: StoryObj = {
  name: "Variant matrix",
  render: () => <VariantMatrix />,
  parameters: {
    layout: "padded",
  },
};
