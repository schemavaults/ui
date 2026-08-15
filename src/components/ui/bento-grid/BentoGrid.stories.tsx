import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Boxes,
  Cloud,
  Database,
  Fingerprint,
  KeyRound,
  Layers,
  Lock,
  Shield,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";

import {
  BentoGrid,
  BentoGridItem,
  BentoGridItemContent,
  BentoGridItemDescription,
  BentoGridItemFooter,
  BentoGridItemIcon,
  BentoGridItemMedia,
  BentoGridItemTitle,
  bentoGridColumnCounts,
  bentoGridGapIds,
  bentoGridItemPaddingIds,
  bentoGridItemVariantIds,
  type BentoGridColumnCount,
  type BentoGridGapId,
  type BentoGridItemPaddingId,
  type BentoGridItemVariantId,
} from "./bento-grid";

interface BentoGridPlaygroundProps {
  columns: BentoGridColumnCount;
  gap: BentoGridGapId;
  variant: BentoGridItemVariantId;
  padding: BentoGridItemPaddingId;
  interactive: boolean;
}

function BentoGridPlayground({
  columns,
  gap,
  variant,
  padding,
  interactive,
}: BentoGridPlaygroundProps): ReactElement {
  return (
    <div className="w-full max-w-5xl">
      <BentoGrid columns={columns} gap={gap}>
        <BentoGridItem
          variant={variant}
          padding={padding}
          interactive={interactive}
          colSpan={2}
          rowSpan={2}
        >
          <BentoGridItemIcon>
            <Sparkles />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Featured schema catalog</BentoGridItemTitle>
          <BentoGridItemDescription>
            Explore hundreds of ready-made vault schemas curated for
            authentication, payments, and audit compliance.
          </BentoGridItemDescription>
          <BentoGridItemContent>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-md border bg-background/60 p-2">
                <p className="font-medium">Auth</p>
                <p className="text-muted-foreground">42 schemas</p>
              </div>
              <div className="rounded-md border bg-background/60 p-2">
                <p className="font-medium">Payments</p>
                <p className="text-muted-foreground">18 schemas</p>
              </div>
              <div className="rounded-md border bg-background/60 p-2">
                <p className="font-medium">Audit</p>
                <p className="text-muted-foreground">27 schemas</p>
              </div>
            </div>
          </BentoGridItemContent>
          <BentoGridItemFooter>
            <span>Updated moments ago</span>
          </BentoGridItemFooter>
        </BentoGridItem>

        <BentoGridItem
          variant={variant}
          padding={padding}
          interactive={interactive}
        >
          <BentoGridItemIcon>
            <Shield />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Zero-trust access</BentoGridItemTitle>
          <BentoGridItemDescription>
            Every request is authenticated, authorized, and audited.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem
          variant={variant}
          padding={padding}
          interactive={interactive}
        >
          <BentoGridItemIcon>
            <Zap />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Realtime sync</BentoGridItemTitle>
          <BentoGridItemDescription>
            Millisecond-level updates across regions and edge nodes.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem
          variant={variant}
          padding={padding}
          interactive={interactive}
          colSpan={2}
        >
          <BentoGridItemIcon>
            <BarChart3 />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Live observability</BentoGridItemTitle>
          <BentoGridItemDescription>
            Query, alert, and export traces from a single unified dashboard.
          </BentoGridItemDescription>
          <BentoGridItemFooter>
            <span className="inline-flex items-center gap-1">
              Open dashboard <ArrowRight className="size-3" />
            </span>
          </BentoGridItemFooter>
        </BentoGridItem>

        <BentoGridItem
          variant={variant}
          padding={padding}
          interactive={interactive}
        >
          <BentoGridItemIcon>
            <Cloud />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Multi-region</BentoGridItemTitle>
          <BentoGridItemDescription>
            Deploy vaults close to your users across 24 regions.
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
      options: bentoGridColumnCounts,
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
    padding: {
      options: bentoGridItemPaddingIds,
      control: { type: "radio" },
    },
    interactive: {
      control: { type: "boolean" },
    },
  },
  args: {
    columns: 3,
    gap: "md",
    variant: "default",
    padding: "md",
    interactive: false,
  },
} satisfies Meta<typeof BentoGridPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gradient: Story = {
  args: {
    variant: "gradient",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Accent: Story = {
  args: {
    variant: "accent",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    variant: "default",
  },
};

export const FourColumns: Story = {
  args: {
    columns: 4,
    gap: "md",
  },
};

export const CompactGap: Story = {
  args: {
    gap: "sm",
  },
};

export const LargeGap: Story = {
  args: {
    gap: "lg",
  },
};

export const MixedVariants: Story = {
  render: (): ReactElement => (
    <div className="w-full max-w-5xl">
      <BentoGrid columns={4} gap="md">
        <BentoGridItem variant="gradient" colSpan={2} rowSpan={2} interactive>
          <BentoGridItemIcon>
            <Sparkles />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Vaults, everywhere.</BentoGridItemTitle>
          <BentoGridItemDescription>
            One control plane for every secret, key, and credential your team
            touches — no matter which cloud or region it lives in.
          </BentoGridItemDescription>
          <BentoGridItemContent>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {["AWS", "GCP", "Azure", "Cloudflare", "Fly.io", "Vercel"].map(
                (name) => (
                  <span
                    key={name}
                    className="rounded-full border bg-background/60 px-2 py-0.5"
                  >
                    {name}
                  </span>
                ),
              )}
            </div>
          </BentoGridItemContent>
          <BentoGridItemFooter>
            <span className="inline-flex items-center gap-1">
              See integrations <ArrowRight className="size-3" />
            </span>
          </BentoGridItemFooter>
        </BentoGridItem>

        <BentoGridItem variant="primary" interactive>
          <BentoGridItemIcon>
            <Lock />
          </BentoGridItemIcon>
          <BentoGridItemTitle>End-to-end encryption</BentoGridItemTitle>
          <BentoGridItemDescription>
            Keys never leave your customer boundary.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant="accent" interactive>
          <BentoGridItemIcon>
            <Fingerprint />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Biometric access</BentoGridItemTitle>
          <BentoGridItemDescription>
            WebAuthn-backed authentication for every session.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant="warning" colSpan={2}>
          <BentoGridItemIcon>
            <KeyRound />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Rotate on a schedule</BentoGridItemTitle>
          <BentoGridItemDescription>
            Automatic key rotation with revocation propagation in under 30 s.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant="destructive">
          <BentoGridItemIcon>
            <ShieldAlert />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Anomaly detection</BentoGridItemTitle>
          <BentoGridItemDescription>
            ML-driven anomaly alerts routed to your paging tool.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem variant="muted">
          <BentoGridItemIcon>
            <Activity />
          </BentoGridItemIcon>
          <BentoGridItemTitle>SOC 2 audit log</BentoGridItemTitle>
          <BentoGridItemDescription>
            Immutable trails ready for your auditor at any time.
          </BentoGridItemDescription>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
};

export const WithMedia: Story = {
  render: (): ReactElement => (
    <div className="w-full max-w-5xl">
      <BentoGrid columns={3} gap="md">
        <BentoGridItem variant="default" colSpan={2}>
          <BentoGridItemMedia>
            <div className="relative flex h-40 w-full items-center justify-center bg-gradient-to-br from-primary/20 via-transparent to-accent">
              <Boxes className="size-16 text-primary/70" />
            </div>
          </BentoGridItemMedia>
          <BentoGridItemTitle>Stackable vaults</BentoGridItemTitle>
          <BentoGridItemDescription>
            Compose modules into custom vaults for every team — read from the
            same source of truth.
          </BentoGridItemDescription>
        </BentoGridItem>
        <BentoGridItem variant="muted">
          <BentoGridItemMedia>
            <div className="relative flex h-40 w-full items-center justify-center bg-gradient-to-br from-accent to-transparent">
              <Layers className="size-14 text-foreground/70" />
            </div>
          </BentoGridItemMedia>
          <BentoGridItemTitle>Layered policies</BentoGridItemTitle>
          <BentoGridItemDescription>
            Attribute-based rules that inherit down the org tree.
          </BentoGridItemDescription>
        </BentoGridItem>
        <BentoGridItem variant="outlined">
          <BentoGridItemIcon>
            <Database />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Bring your own datastore</BentoGridItemTitle>
          <BentoGridItemDescription>
            Postgres, DynamoDB, Turso — plug in and go.
          </BentoGridItemDescription>
        </BentoGridItem>
        <BentoGridItem variant="outlined" colSpan={2}>
          <BentoGridItemIcon>
            <BarChart3 />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Usage analytics</BentoGridItemTitle>
          <BentoGridItemDescription>
            Every read and write is queryable through the metrics API.
          </BentoGridItemDescription>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
};

export const SingleColumnMobileLayout: Story = {
  args: {
    columns: 1,
  },
};
