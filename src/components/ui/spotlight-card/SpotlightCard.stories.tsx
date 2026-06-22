import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  Database,
  KeyRound,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Badge } from "../badge";
import { Button } from "../button";
import {
  SpotlightCard,
  spotlightCardGlowIds,
  spotlightCardIntensityIds,
  spotlightCardSizeIds,
  type SpotlightCardGlowId,
  type SpotlightCardIntensityId,
  type SpotlightCardSizeId,
} from "./spotlight-card";

interface SpotlightCardExampleProps {
  glow?: SpotlightCardGlowId;
  size?: SpotlightCardSizeId;
  intensity?: SpotlightCardIntensityId;
  borderGlow?: boolean;
  spotlightSize?: number;
  disableTracking?: boolean;
  title?: string;
  description?: string;
  ctaLabel?: string;
}

function SpotlightCardExample({
  glow = "primary",
  size = "md",
  intensity = "medium",
  borderGlow = false,
  spotlightSize = 280,
  disableTracking = false,
  title = "Premium Schemas",
  description = "Unlock advanced validation, versioned migrations, and team-wide schema review tools.",
  ctaLabel = "Upgrade plan",
}: SpotlightCardExampleProps): ReactElement {
  return (
    <div style={{ width: 360 }}>
      <SpotlightCard
        glow={glow}
        size={size}
        intensity={intensity}
        borderGlow={borderGlow}
        spotlightSize={spotlightSize}
        disableTracking={disableTracking}
      >
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Pro
          </Badge>
          <Rocket
            className="h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-tight tracking-tight">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <Button size="sm" className="mt-4 w-fit">
          {ctaLabel}
        </Button>
      </SpotlightCard>
    </div>
  );
}

const meta = {
  title: "Components/SpotlightCard",
  component: SpotlightCardExample,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    glow: {
      options: spotlightCardGlowIds,
      control: { type: "select" },
    },
    size: {
      options: spotlightCardSizeIds,
      control: { type: "radio" },
    },
    intensity: {
      options: spotlightCardIntensityIds,
      control: { type: "radio" },
    },
    borderGlow: { control: { type: "boolean" } },
    spotlightSize: {
      control: { type: "range", min: 80, max: 600, step: 20 },
    },
    disableTracking: { control: { type: "boolean" } },
    title: { control: { type: "text" } },
    description: { control: { type: "text" } },
    ctaLabel: { control: { type: "text" } },
  },
  args: {
    glow: "primary",
    size: "md",
    intensity: "medium",
    borderGlow: false,
    spotlightSize: 280,
    disableTracking: false,
    title: "Premium Schemas",
    description:
      "Unlock advanced validation, versioned migrations, and team-wide schema review tools.",
    ctaLabel: "Upgrade plan",
  },
} satisfies Meta<typeof SpotlightCardExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Accent: Story = {
  args: {
    glow: "accent",
    title: "API Insights",
    description:
      "Track request volume, p99 latency, and error rates across every schema endpoint.",
    ctaLabel: "View dashboards",
  },
};

export const Destructive: Story = {
  args: {
    glow: "destructive",
    intensity: "vivid",
    title: "Failed Schema Validations",
    description:
      "237 requests rejected in the last hour. Investigate which migrations are causing breakage.",
    ctaLabel: "Open incident",
  },
};

export const Warning: Story = {
  args: {
    glow: "warning",
    title: "Expiring API Keys",
    description:
      "14 service tokens will rotate out in the next 7 days. Generate replacements now.",
    ctaLabel: "Rotate keys",
  },
};

export const BrandBlue: Story = {
  args: {
    glow: "brand-blue",
    intensity: "vivid",
    borderGlow: true,
    title: "SchemaVaults Cloud",
    description:
      "Managed deployments with point-in-time recovery, audit logs, and SOC 2 compliance.",
    ctaLabel: "Start free trial",
  },
};

export const BrandRed: Story = {
  args: {
    glow: "brand-red",
    intensity: "vivid",
    borderGlow: true,
    title: "Self-Hosted Enterprise",
    description:
      "Run SchemaVaults inside your own VPC with on-call support and dedicated SLAs.",
    ctaLabel: "Contact sales",
  },
};

export const SubtleIntensity: Story = {
  args: {
    glow: "primary",
    intensity: "subtle",
    title: "Quiet Confidence",
    description:
      "A whisper of color follows the cursor — perfect for dense dashboards where focus matters.",
    ctaLabel: "Explore",
  },
};

export const VividIntensity: Story = {
  args: {
    glow: "brand-blue",
    intensity: "vivid",
    title: "Vivid Glow",
    description:
      "Crank up the spotlight for hero sections, marketing pages, and feature reveals.",
    ctaLabel: "See pricing",
  },
};

export const WithBorderGlow: Story = {
  args: {
    glow: "primary",
    borderGlow: true,
    title: "Animated Border",
    description:
      "Add a soft gradient border that traces the cursor for an extra premium feel.",
    ctaLabel: "Try it now",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    title: "Compact",
    description: "Tight padding for sidebars and condensed grids.",
    ctaLabel: "Open",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    title: "Hero Card",
    description:
      "Generous padding makes this a great choice for landing pages and onboarding flows.",
    ctaLabel: "Get started",
  },
};

export const TrackingDisabled: Story = {
  args: {
    disableTracking: true,
    borderGlow: true,
    title: "Reduced Motion",
    description:
      "Tracking can be turned off for users who prefer reduced motion or static previews.",
    ctaLabel: "Continue",
  },
};

function PricingGrid(): ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 16,
        width: "100%",
        maxWidth: 960,
      }}
    >
      <SpotlightCard glow="muted" intensity="subtle">
        <div className="flex items-center gap-2">
          <Database
            className="h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <h3 className="text-base font-semibold leading-tight">Hobby</h3>
        </div>
        <p className="mt-3 text-3xl font-bold tabular-nums">
          Free
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          For solo developers exploring SchemaVaults.
        </p>
        <Button size="sm" variant="outline" className="mt-4 w-fit">
          Start building
        </Button>
      </SpotlightCard>

      <SpotlightCard glow="primary" intensity="medium" borderGlow>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
          <h3 className="text-base font-semibold leading-tight">Team</h3>
          <Badge className="ml-auto">Popular</Badge>
        </div>
        <p className="mt-3 text-3xl font-bold tabular-nums">
          $29
          <span className="text-sm font-normal text-muted-foreground">
            {" "}
            / seat / mo
          </span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Shared schemas, review workflows, and audit logs.
        </p>
        <Button size="sm" className="mt-4 w-fit">
          Upgrade team
        </Button>
      </SpotlightCard>

      <SpotlightCard glow="brand-blue" intensity="vivid" borderGlow>
        <div className="flex items-center gap-2">
          <ShieldCheck
            className="h-5 w-5 text-[var(--schemavaults-brand-blue)]"
            aria-hidden="true"
          />
          <h3 className="text-base font-semibold leading-tight">Enterprise</h3>
        </div>
        <p className="mt-3 text-3xl font-bold tabular-nums">Custom</p>
        <p className="mt-1 text-sm text-muted-foreground">
          SSO, on-prem, dedicated support, and SOC 2.
        </p>
        <Button size="sm" variant="outline" className="mt-4 w-fit">
          Contact sales
        </Button>
      </SpotlightCard>
    </div>
  );
}

export const PricingGridExample: Story = {
  render: () => <PricingGrid />,
  parameters: {
    layout: "padded",
  },
};

function FeatureWall(): ReactElement {
  const items: {
    title: string;
    description: string;
    icon: ReactElement;
    glow: SpotlightCardGlowId;
  }[] = [
    {
      title: "Versioned migrations",
      description:
        "Roll forward, roll back, and review every schema change with full history.",
      icon: <Database className="h-5 w-5" aria-hidden="true" />,
      glow: "primary",
    },
    {
      title: "Secret rotation",
      description:
        "Automated API key rotation with zero-downtime handoff between consumers.",
      icon: <KeyRound className="h-5 w-5" aria-hidden="true" />,
      glow: "warning",
    },
    {
      title: "Edge validation",
      description:
        "Run schema validation at the edge for sub-10ms request rejection.",
      icon: <Zap className="h-5 w-5" aria-hidden="true" />,
      glow: "brand-blue",
    },
    {
      title: "Compliance ready",
      description:
        "SOC 2, HIPAA, and GDPR-ready audit trails out of the box.",
      icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
      glow: "accent",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 16,
        width: "100%",
        maxWidth: 960,
      }}
    >
      {items.map((item) => (
        <SpotlightCard key={item.title} glow={item.glow} intensity="medium">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
            {item.icon}
          </div>
          <h3 className="mt-3 text-base font-semibold leading-tight">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.description}
          </p>
        </SpotlightCard>
      ))}
    </div>
  );
}

export const FeatureWallExample: Story = {
  render: () => <FeatureWall />,
  parameters: {
    layout: "padded",
  },
};
