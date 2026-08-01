import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Database,
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
  bentoGridItemColSpans,
  bentoGridItemRowSpans,
  bentoGridItemVariantIds,
  type BentoGridColumnCount,
  type BentoGridGapId,
  type BentoGridItemColSpan,
  type BentoGridItemRowSpan,
  type BentoGridItemVariantId,
} from "./bento-grid";

interface BentoGridExampleProps {
  columns?: BentoGridColumnCount;
  gap?: BentoGridGapId;
  variant?: BentoGridItemVariantId;
  featuredColSpan?: BentoGridItemColSpan;
  featuredRowSpan?: BentoGridItemRowSpan;
  showHeader?: boolean;
  showFooter?: boolean;
}

function DecorativeHeader({
  variant,
}: {
  variant: BentoGridItemVariantId;
}): ReactElement {
  const tone: Record<BentoGridItemVariantId, string> = {
    default: "from-primary/20 via-primary/5 to-transparent",
    muted: "from-muted-foreground/20 via-muted-foreground/5 to-transparent",
    primary: "from-primary/30 via-primary/10 to-transparent",
    outline: "from-primary/15 via-primary/5 to-transparent",
    gradient: "from-primary/25 via-accent/20 to-transparent",
    destructive: "from-destructive/25 via-destructive/10 to-transparent",
    warning: "from-warning/25 via-warning/10 to-transparent",
  };
  return (
    <div
      className={`h-full w-full bg-gradient-to-br ${tone[variant]} bg-[radial-gradient(circle_at_top_right,theme(colors.foreground/10%),transparent_60%)]`}
    />
  );
}

function BentoGridExample({
  columns = 3,
  gap = "md",
  variant = "default",
  featuredColSpan = 2,
  featuredRowSpan = 2,
  showHeader = true,
  showFooter = true,
}: BentoGridExampleProps): ReactElement {
  return (
    <div className="w-full">
      <BentoGrid columns={columns} gap={gap}>
        <BentoGridItem
          variant={variant}
          colSpan={featuredColSpan}
          rowSpan={featuredRowSpan}
        >
          {showHeader ? (
            <BentoGridItemHeader>
              <DecorativeHeader variant={variant} />
            </BentoGridItemHeader>
          ) : null}
          <BentoGridItemContent>
            <BentoGridItemIcon variant={variant}>
              <Sparkles />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Featured highlight</BentoGridItemTitle>
            <BentoGridItemDescription>
              This is the featured cell of the bento grid. Give it a bigger
              colSpan or rowSpan to draw the eye first.
            </BentoGridItemDescription>
          </BentoGridItemContent>
          {showFooter ? (
            <BentoGridItemFooter>
              <span>Read more</span>
              <ArrowUpRight className="size-4" />
            </BentoGridItemFooter>
          ) : null}
        </BentoGridItem>

        <BentoGridItem variant="muted">
          <BentoGridItemContent>
            <BentoGridItemIcon variant="muted">
              <Database />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Vaults</BentoGridItemTitle>
            <BentoGridItemDescription>
              1,284 active vaults across your organizations.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="primary">
          <BentoGridItemContent>
            <BentoGridItemIcon variant="primary">
              <Zap />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Instant sync</BentoGridItemTitle>
            <BentoGridItemDescription>
              Push schema changes to every environment in a single click.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="outline">
          <BentoGridItemContent>
            <BentoGridItemIcon variant="outline">
              <ShieldCheck />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Audit ready</BentoGridItemTitle>
            <BentoGridItemDescription>
              Immutable version history and role-scoped access controls.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>

        <BentoGridItem variant="gradient" colSpan={2}>
          <BentoGridItemContent>
            <BentoGridItemIcon variant="gradient">
              <BarChart3 />
            </BentoGridItemIcon>
            <BentoGridItemTitle>Analytics</BentoGridItemTitle>
            <BentoGridItemDescription>
              Track query patterns, schema drift, and access anomalies with
              built-in observability.
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
    featuredColSpan: {
      options: bentoGridItemColSpans,
      control: { type: "radio" },
    },
    featuredRowSpan: {
      options: bentoGridItemRowSpans,
      control: { type: "radio" },
    },
    showHeader: { control: { type: "boolean" } },
    showFooter: { control: { type: "boolean" } },
  },
  args: {
    columns: 3,
    gap: "md",
    variant: "default",
    featuredColSpan: 2,
    featuredRowSpan: 2,
    showHeader: true,
    showFooter: true,
  },
} satisfies Meta<typeof BentoGridExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PrimaryFeature: Story = {
  args: {
    variant: "primary",
    featuredColSpan: 2,
    featuredRowSpan: 2,
  },
};

export const GradientFeature: Story = {
  args: {
    variant: "gradient",
    featuredColSpan: 2,
    featuredRowSpan: 2,
  },
};

export const FourColumns: Story = {
  args: {
    columns: 4,
    featuredColSpan: 2,
    featuredRowSpan: 2,
  },
};

export const CompactGap: Story = {
  args: {
    gap: "sm",
    columns: 3,
  },
};

export const LargeGap: Story = {
  args: {
    gap: "lg",
    columns: 3,
  },
};

export const WithoutHeaderOrFooter: Story = {
  args: {
    showHeader: false,
    showFooter: false,
  },
};

function VariantShowcase(): ReactElement {
  return (
    <BentoGrid columns={3} gap="md">
      {bentoGridItemVariantIds.map((variantId) => (
        <BentoGridItem key={variantId} variant={variantId}>
          <BentoGridItemContent>
            <BentoGridItemIcon variant={variantId}>
              <Sparkles />
            </BentoGridItemIcon>
            <BentoGridItemTitle>
              {variantId.charAt(0).toUpperCase() + variantId.slice(1)}
            </BentoGridItemTitle>
            <BentoGridItemDescription>
              The <code className="font-mono text-xs">{variantId}</code> item
              variant.
            </BentoGridItemDescription>
          </BentoGridItemContent>
        </BentoGridItem>
      ))}
    </BentoGrid>
  );
}

export const AllVariants: StoryObj = {
  render: () => <VariantShowcase />,
  parameters: {
    layout: "padded",
  },
};

function DashboardBento(): ReactElement {
  return (
    <BentoGrid columns={4} gap="md">
      <BentoGridItem variant="primary" colSpan={2} rowSpan={2}>
        <BentoGridItemHeader>
          <DecorativeHeader variant="primary" />
        </BentoGridItemHeader>
        <BentoGridItemContent>
          <BentoGridItemIcon variant="primary">
            <Activity />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Platform health</BentoGridItemTitle>
          <BentoGridItemDescription>
            All systems operational. 99.995% uptime over the last 30 days
            across every region.
          </BentoGridItemDescription>
        </BentoGridItemContent>
        <BentoGridItemFooter>
          <span>View status page</span>
          <ArrowUpRight className="size-4" />
        </BentoGridItemFooter>
      </BentoGridItem>

      <BentoGridItem variant="default">
        <BentoGridItemContent>
          <BentoGridItemIcon variant="default">
            <Users />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Active users</BentoGridItemTitle>
          <BentoGridItemDescription>
            3,512 users active in the last 24 hours.
          </BentoGridItemDescription>
        </BentoGridItemContent>
      </BentoGridItem>

      <BentoGridItem variant="muted">
        <BentoGridItemContent>
          <BentoGridItemIcon variant="muted">
            <Database />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Vaults</BentoGridItemTitle>
          <BentoGridItemDescription>1,284 active</BentoGridItemDescription>
        </BentoGridItemContent>
      </BentoGridItem>

      <BentoGridItem variant="warning">
        <BentoGridItemContent>
          <BentoGridItemIcon variant="warning">
            <KeyRound />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Expiring keys</BentoGridItemTitle>
          <BentoGridItemDescription>
            14 API keys expire within the next 7 days.
          </BentoGridItemDescription>
        </BentoGridItemContent>
      </BentoGridItem>

      <BentoGridItem variant="destructive">
        <BentoGridItemContent>
          <BentoGridItemIcon variant="destructive">
            <Lock />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Failed auth</BentoGridItemTitle>
          <BentoGridItemDescription>
            237 attempts in the last 24 hours — up 31%.
          </BentoGridItemDescription>
        </BentoGridItemContent>
      </BentoGridItem>

      <BentoGridItem variant="gradient" colSpan={2}>
        <BentoGridItemContent>
          <BentoGridItemIcon variant="gradient">
            <BarChart3 />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Query analytics</BentoGridItemTitle>
          <BentoGridItemDescription>
            9,431 webhook deliveries in the past hour with a p50 latency of
            42ms.
          </BentoGridItemDescription>
        </BentoGridItemContent>
        <BentoGridItemFooter>
          <span>Open dashboard</span>
          <ArrowUpRight className="size-4" />
        </BentoGridItemFooter>
      </BentoGridItem>
    </BentoGrid>
  );
}

export const DashboardExample: StoryObj = {
  render: () => <DashboardBento />,
  parameters: {
    layout: "padded",
  },
};

function InteractiveExample(): ReactElement {
  return (
    <BentoGrid columns={3} gap="md">
      <BentoGridItem
        variant="default"
        interactive
        role="button"
        onClick={() => {
          window.alert("Clicked Vaults");
        }}
      >
        <BentoGridItemContent>
          <BentoGridItemIcon>
            <Database />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Vaults</BentoGridItemTitle>
          <BentoGridItemDescription>
            Click any tile — the whole cell is a target.
          </BentoGridItemDescription>
        </BentoGridItemContent>
      </BentoGridItem>
      <BentoGridItem
        variant="primary"
        interactive
        role="button"
        onClick={() => {
          window.alert("Clicked Users");
        }}
      >
        <BentoGridItemContent>
          <BentoGridItemIcon variant="primary">
            <Users />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Users</BentoGridItemTitle>
          <BentoGridItemDescription>
            Tab through to see the focus ring using the theme&apos;s
            <code className="font-mono text-xs"> --ring </code> token.
          </BentoGridItemDescription>
        </BentoGridItemContent>
      </BentoGridItem>
      <BentoGridItem
        variant="outline"
        interactive
        role="button"
        onClick={() => {
          window.alert("Clicked Audit log");
        }}
      >
        <BentoGridItemContent>
          <BentoGridItemIcon>
            <ShieldCheck />
          </BentoGridItemIcon>
          <BentoGridItemTitle>Audit log</BentoGridItemTitle>
          <BentoGridItemDescription>
            Interactive cells get pointer + focus affordances automatically.
          </BentoGridItemDescription>
        </BentoGridItemContent>
      </BentoGridItem>
    </BentoGrid>
  );
}

export const Interactive: StoryObj = {
  render: () => <InteractiveExample />,
  parameters: {
    layout: "padded",
  },
};
