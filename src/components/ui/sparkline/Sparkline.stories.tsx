import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { Activity, Database, ShieldAlert, TrendingUp } from "lucide-react";

import {
  Sparkline,
  sparklineColorIds,
  sparklineSizeIds,
  sparklineVariantIds,
} from "./sparkline";
import {
  StatCard,
  StatCardFooter,
  StatCardHeader,
  StatCardIcon,
  StatCardLabel,
  StatCardTrend,
  StatCardValue,
} from "../stat-card/stat-card";

const upwardTrend: ReadonlyArray<number> = [
  4, 6, 5, 7, 8, 7, 9, 11, 10, 12, 13, 15, 14, 17, 19, 21,
];
const downwardTrend: ReadonlyArray<number> = [
  21, 18, 19, 16, 17, 14, 15, 12, 13, 10, 11, 8, 9, 7, 5, 4,
];
const volatileTrend: ReadonlyArray<number> = [
  10, 14, 8, 16, 9, 18, 7, 20, 11, 17, 6, 22, 13, 19, 5, 24,
];
const flatTrend: ReadonlyArray<number> = [
  10, 11, 10, 9, 10, 11, 10, 10, 11, 10, 9, 10, 11, 10, 10, 10,
];

const meta = {
  title: "Components/Sparkline",
  component: Sparkline,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: sparklineVariantIds,
      control: { type: "radio" },
    },
    color: {
      options: sparklineColorIds,
      control: { type: "select" },
    },
    size: {
      options: sparklineSizeIds,
      control: { type: "radio" },
    },
    strokeWidth: {
      control: { type: "number", min: 0.5, max: 4, step: 0.25 },
    },
    showLastPoint: { control: { type: "boolean" } },
    gradient: { control: { type: "boolean" } },
    showBaseline: { control: { type: "boolean" } },
    label: { control: { type: "text" } },
  },
  args: {
    data: upwardTrend,
    variant: "line",
    color: "default",
    size: "md",
    strokeWidth: 1.5,
    showLastPoint: true,
    gradient: true,
    showBaseline: false,
    label: "Sales over the last 16 weeks",
  },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AreaVariant: Story = {
  args: {
    variant: "area",
    color: "primary",
  },
};

export const BarVariant: Story = {
  args: {
    variant: "bar",
    color: "default",
    data: volatileTrend,
  },
};

export const Positive: Story = {
  args: {
    color: "positive",
    variant: "area",
  },
};

export const Destructive: Story = {
  args: {
    color: "destructive",
    variant: "area",
    data: downwardTrend,
    label: "Errors over the last 16 hours",
  },
};

export const Warning: Story = {
  args: {
    color: "warning",
    variant: "area",
    data: volatileTrend,
    label: "API latency over the last hour",
  },
};

export const AutoColor: Story = {
  args: {
    color: "auto",
    variant: "area",
  },
  parameters: {
    docs: {
      description: {
        story:
          "`color: 'auto'` infers the trend direction from first vs. last data point — green for up, red for down, muted for flat.",
      },
    },
  },
};

export const SmallInline: Story = {
  args: {
    size: "sm",
    variant: "line",
  },
  render: (args): ReactElement => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span>Revenue</span>
      <Sparkline {...args} />
      <span style={{ fontWeight: 600 }}>+24%</span>
    </span>
  ),
};

export const LargeWithBaseline: Story = {
  args: {
    size: "lg",
    variant: "area",
    color: "primary",
    showBaseline: true,
    data: volatileTrend,
  },
};

export const FlatTrend: Story = {
  args: {
    variant: "line",
    color: "auto",
    data: flatTrend,
    label: "Stable metric",
  },
};

export const CustomDimensions: Story = {
  args: {
    variant: "area",
    color: "primary",
    width: 320,
    height: 80,
    data: volatileTrend,
  },
};

function VariantsGrid(): ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(180px, 1fr))",
        gap: 24,
        alignItems: "center",
      }}
    >
      <div>
        <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>line</p>
        <Sparkline data={upwardTrend} variant="line" label="line" />
      </div>
      <div>
        <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>area</p>
        <Sparkline
          data={upwardTrend}
          variant="area"
          color="primary"
          label="area"
        />
      </div>
      <div>
        <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>bar</p>
        <Sparkline data={volatileTrend} variant="bar" label="bar" />
      </div>

      <div>
        <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>positive</p>
        <Sparkline
          data={upwardTrend}
          variant="area"
          color="positive"
          label="positive"
        />
      </div>
      <div>
        <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>warning</p>
        <Sparkline
          data={volatileTrend}
          variant="area"
          color="warning"
          label="warning"
        />
      </div>
      <div>
        <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
          destructive
        </p>
        <Sparkline
          data={downwardTrend}
          variant="area"
          color="destructive"
          label="destructive"
        />
      </div>
    </div>
  );
}

export const VariantMatrix: StoryObj = {
  render: (): ReactElement => <VariantsGrid />,
  parameters: { layout: "padded" },
};

function StatCardWithSparkline({
  label,
  value,
  trend,
  trendDirection,
  data,
  color,
  icon,
}: {
  label: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
  data: ReadonlyArray<number>;
  color: "default" | "primary" | "positive" | "warning" | "destructive";
  icon: ReactElement;
}): ReactElement {
  return (
    <StatCard variant="default">
      <StatCardHeader>
        <StatCardLabel>{label}</StatCardLabel>
        <StatCardIcon>{icon}</StatCardIcon>
      </StatCardHeader>
      <StatCardValue>{value}</StatCardValue>
      <div style={{ marginTop: 8 }}>
        <Sparkline
          data={data}
          variant="area"
          color={color}
          size="md"
          width={272}
          height={40}
          label={`${label} trend`}
        />
      </div>
      <StatCardFooter>
        <StatCardTrend
          direction={trendDirection}
          intent={
            color === "destructive"
              ? "negative"
              : color === "warning"
                ? "neutral"
                : undefined
          }
        >
          {trend}
        </StatCardTrend>
        <span>vs. last 30 days</span>
      </StatCardFooter>
    </StatCard>
  );
}

function DashboardComposition(): ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 16,
        width: "100%",
        maxWidth: 960,
      }}
    >
      <StatCardWithSparkline
        label="Active vaults"
        value="1,284"
        trend="12.4%"
        trendDirection="up"
        data={upwardTrend}
        color="primary"
        icon={<Database />}
      />
      <StatCardWithSparkline
        label="Monthly revenue"
        value="$48,920"
        trend="8.1%"
        trendDirection="up"
        data={[30, 32, 31, 35, 38, 36, 40, 42, 44, 47, 46, 49]}
        color="positive"
        icon={<TrendingUp />}
      />
      <StatCardWithSparkline
        label="Failed authentications"
        value="237"
        trend="31.0%"
        trendDirection="up"
        data={[20, 25, 30, 50, 80, 110, 160, 200, 237]}
        color="destructive"
        icon={<ShieldAlert />}
      />
      <StatCardWithSparkline
        label="Webhooks delivered"
        value="9,431"
        trend="0.2%"
        trendDirection="neutral"
        data={volatileTrend}
        color="default"
        icon={<Activity />}
      />
    </div>
  );
}

export const InsideStatCards: StoryObj = {
  render: (): ReactElement => <DashboardComposition />,
  parameters: { layout: "padded" },
};
