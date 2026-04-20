import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  Activity,
  CreditCard,
  Database,
  KeyRound,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  StatCard,
  StatCardDescription,
  StatCardFooter,
  StatCardHeader,
  StatCardIcon,
  StatCardLabel,
  StatCardTrend,
  StatCardValue,
  statCardSizeIds,
  statCardTrendDirections,
  statCardVariantIds,
  type StatCardSizeId,
  type StatCardTrendDirection,
  type StatCardTrendIntent,
  type StatCardVariantId,
} from "./stat-card";

interface StatCardExampleProps {
  variant?: StatCardVariantId;
  size?: StatCardSizeId;
  label?: string;
  value?: string;
  description?: string;
  showIcon?: boolean;
  showTrend?: boolean;
  trendDirection?: StatCardTrendDirection;
  trendIntent?: StatCardTrendIntent | "auto";
  trendValue?: string;
  loading?: boolean;
}

function iconForVariant(variant: StatCardVariantId): ReactElement {
  switch (variant) {
    case "destructive":
      return <ShieldAlert />;
    case "warning":
      return <KeyRound />;
    case "primary":
      return <TrendingUp />;
    case "muted":
      return <Database />;
    default:
      return <Users />;
  }
}

function StatCardExample({
  variant = "default",
  size = "md",
  label = "Active vaults",
  value = "1,284",
  description = "Across 12 organizations",
  showIcon = true,
  showTrend = true,
  trendDirection = "up",
  trendIntent = "auto",
  trendValue = "12.4%",
  loading = false,
}: StatCardExampleProps): ReactElement {
  return (
    <div style={{ width: 320 }}>
      <StatCard variant={variant} size={size}>
        <StatCardHeader>
          <StatCardLabel size={size}>{label}</StatCardLabel>
          {showIcon ? (
            <StatCardIcon variant={variant} size={size}>
              {iconForVariant(variant)}
            </StatCardIcon>
          ) : null}
        </StatCardHeader>
        <StatCardValue size={size} loading={loading}>
          {value}
        </StatCardValue>
        {description ? (
          <StatCardDescription>{description}</StatCardDescription>
        ) : null}
        {showTrend ? (
          <StatCardFooter>
            <StatCardTrend
              direction={trendDirection}
              intent={trendIntent === "auto" ? undefined : trendIntent}
            >
              {trendValue}
            </StatCardTrend>
            <span>vs. last 30 days</span>
          </StatCardFooter>
        ) : null}
      </StatCard>
    </div>
  );
}

const meta = {
  title: "Components/StatCard",
  component: StatCardExample,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: statCardVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: statCardSizeIds,
      control: { type: "radio" },
    },
    label: { control: { type: "text" } },
    value: { control: { type: "text" } },
    description: { control: { type: "text" } },
    showIcon: { control: { type: "boolean" } },
    showTrend: { control: { type: "boolean" } },
    trendDirection: {
      options: statCardTrendDirections,
      control: { type: "radio" },
    },
    trendIntent: {
      options: ["auto", "positive", "negative", "neutral"] as const,
      control: { type: "radio" },
    },
    trendValue: { control: { type: "text" } },
    loading: { control: { type: "boolean" } },
  },
  args: {
    variant: "default",
    size: "md",
    label: "Active vaults",
    value: "1,284",
    description: "Across 12 organizations",
    showIcon: true,
    showTrend: true,
    trendDirection: "up",
    trendIntent: "auto",
    trendValue: "12.4%",
    loading: false,
  },
} satisfies Meta<typeof StatCardExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
    label: "Schemas published",
    value: "342",
    description: "Last published 4 hours ago",
    trendDirection: "neutral",
    trendValue: "0.0%",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    label: "Monthly revenue",
    value: "$48,920",
    description: "Subscription + usage",
    trendDirection: "up",
    trendValue: "8.1%",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    label: "Failed authentications",
    value: "237",
    description: "Last 24 hours",
    trendDirection: "up",
    trendIntent: "negative",
    trendValue: "31.0%",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    label: "Expiring API keys",
    value: "14",
    description: "Within the next 7 days",
    trendDirection: "up",
    trendIntent: "negative",
    trendValue: "4 new",
  },
};

export const TrendDown: Story = {
  args: {
    label: "Open incidents",
    value: "3",
    description: "Lowest in 30 days",
    trendDirection: "down",
    trendValue: "62.5%",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    showTrend: false,
    description: "",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    label: "Webhooks delivered",
    value: "9,431",
    description: "Past hour",
    trendDirection: "up",
    trendValue: "2.0%",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    label: "Total customers",
    value: "12,950",
    description: "Active in the last 30 days",
    trendDirection: "up",
    trendValue: "5.3%",
  },
};

export const NoIcon: Story = {
  args: {
    showIcon: false,
    label: "Storage used",
    value: "342 GB",
    description: "of 1 TB plan",
    showTrend: false,
  },
};

function DashboardGrid(): ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        width: "100%",
        maxWidth: 960,
      }}
    >
      <StatCard variant="default">
        <StatCardHeader>
          <StatCardLabel>Active vaults</StatCardLabel>
          <StatCardIcon variant="default">
            <Database />
          </StatCardIcon>
        </StatCardHeader>
        <StatCardValue>1,284</StatCardValue>
        <StatCardFooter>
          <StatCardTrend direction="up">12.4%</StatCardTrend>
          <span>vs. last 30 days</span>
        </StatCardFooter>
      </StatCard>

      <StatCard variant="primary">
        <StatCardHeader>
          <StatCardLabel>Monthly revenue</StatCardLabel>
          <StatCardIcon variant="primary">
            <CreditCard />
          </StatCardIcon>
        </StatCardHeader>
        <StatCardValue>$48,920</StatCardValue>
        <StatCardFooter>
          <StatCardTrend direction="up">8.1%</StatCardTrend>
          <span>vs. last month</span>
        </StatCardFooter>
      </StatCard>

      <StatCard variant="warning">
        <StatCardHeader>
          <StatCardLabel>Expiring API keys</StatCardLabel>
          <StatCardIcon variant="warning">
            <KeyRound />
          </StatCardIcon>
        </StatCardHeader>
        <StatCardValue>14</StatCardValue>
        <StatCardFooter>
          <StatCardTrend direction="up" intent="negative">
            4 new
          </StatCardTrend>
          <span>this week</span>
        </StatCardFooter>
      </StatCard>

      <StatCard variant="destructive">
        <StatCardHeader>
          <StatCardLabel>Failed auth attempts</StatCardLabel>
          <StatCardIcon variant="destructive">
            <ShieldAlert />
          </StatCardIcon>
        </StatCardHeader>
        <StatCardValue>237</StatCardValue>
        <StatCardFooter>
          <StatCardTrend direction="up" intent="negative">
            31.0%
          </StatCardTrend>
          <span>vs. yesterday</span>
        </StatCardFooter>
      </StatCard>

      <StatCard variant="muted">
        <StatCardHeader>
          <StatCardLabel>Webhooks delivered</StatCardLabel>
          <StatCardIcon variant="muted">
            <Activity />
          </StatCardIcon>
        </StatCardHeader>
        <StatCardValue>9,431</StatCardValue>
        <StatCardFooter>
          <StatCardTrend direction="neutral">0.2%</StatCardTrend>
          <span>past hour</span>
        </StatCardFooter>
      </StatCard>

      <StatCard variant="default">
        <StatCardHeader>
          <StatCardLabel>Active users</StatCardLabel>
          <StatCardIcon>
            <Users />
          </StatCardIcon>
        </StatCardHeader>
        <StatCardValue>3,512</StatCardValue>
        <StatCardFooter>
          <StatCardTrend direction="down" intent="negative">
            1.7%
          </StatCardTrend>
          <span>vs. last week</span>
        </StatCardFooter>
      </StatCard>
    </div>
  );
}

export const DashboardExample: StoryObj = {
  render: () => <DashboardGrid />,
  parameters: {
    layout: "padded",
  },
};
