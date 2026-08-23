import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "../button/button";
import {
  PricingCard,
  PricingCardBadge,
  PricingCardDescription,
  PricingCardFeature,
  PricingCardFeatures,
  PricingCardFooter,
  PricingCardHeader,
  PricingCardPrice,
  PricingCardSeparator,
  PricingCardTitle,
  pricingCardSizeIds,
  pricingCardVariantIds,
  type PricingCardSizeId,
  type PricingCardVariantId,
} from "./pricing-card";

interface PricingCardExampleProps {
  variant?: PricingCardVariantId;
  size?: PricingCardSizeId;
  title?: string;
  description?: string;
  badge?: string;
  currency?: string;
  amount?: string;
  originalAmount?: string;
  period?: string;
  ctaLabel?: string;
}

function PricingCardExample({
  variant = "default",
  size = "md",
  title = "Pro",
  description = "For growing teams that need more power and collaboration.",
  badge,
  currency = "$",
  amount = "29",
  originalAmount,
  period = "/ month",
  ctaLabel = "Start free trial",
}: PricingCardExampleProps): ReactElement {
  return (
    <div style={{ width: 340 }}>
      <PricingCard variant={variant} size={size}>
        <PricingCardHeader>
          {badge ? (
            <PricingCardBadge
              variant={variant === "featured" ? "default" : "outline"}
            >
              {variant === "featured" ? (
                <Sparkles aria-hidden className="size-3" />
              ) : null}
              {badge}
            </PricingCardBadge>
          ) : null}
          <PricingCardTitle size={size}>{title}</PricingCardTitle>
          <PricingCardDescription>{description}</PricingCardDescription>
        </PricingCardHeader>

        <PricingCardPrice
          size={size}
          currency={currency}
          amount={amount}
          originalAmount={originalAmount || undefined}
          period={period}
        />

        <PricingCardSeparator />

        <PricingCardFeatures>
          <PricingCardFeature>Unlimited projects</PricingCardFeature>
          <PricingCardFeature>Up to 10 team members</PricingCardFeature>
          <PricingCardFeature>Priority email support</PricingCardFeature>
          <PricingCardFeature status="coming-soon">
            Custom domains
          </PricingCardFeature>
          <PricingCardFeature status="excluded">
            SAML single sign-on
          </PricingCardFeature>
        </PricingCardFeatures>

        <PricingCardFooter>
          <Button
            variant={variant === "featured" ? "default" : "outline"}
            className="w-full"
          >
            {ctaLabel}
          </Button>
        </PricingCardFooter>
      </PricingCard>
    </div>
  );
}

const meta = {
  title: "Components/PricingCard",
  component: PricingCardExample,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: pricingCardVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: pricingCardSizeIds,
      control: { type: "radio" },
    },
    title: { control: { type: "text" } },
    description: { control: { type: "text" } },
    badge: { control: { type: "text" } },
    currency: { control: { type: "text" } },
    amount: { control: { type: "text" } },
    originalAmount: { control: { type: "text" } },
    period: { control: { type: "text" } },
    ctaLabel: { control: { type: "text" } },
  },
  args: {
    variant: "default",
    size: "md",
    title: "Pro",
    description: "For growing teams that need more power and collaboration.",
    badge: "",
    currency: "$",
    amount: "29",
    originalAmount: "",
    period: "/ month",
    ctaLabel: "Start free trial",
  },
} satisfies Meta<typeof PricingCardExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
  },
};

export const Featured: Story = {
  args: {
    variant: "featured",
    title: "Team",
    description: "Everything you need to ship faster together.",
    badge: "Most popular",
    amount: "79",
    period: "/ month",
    ctaLabel: "Upgrade to Team",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
    title: "Free",
    description: "Get started with the essentials, forever.",
    currency: "$",
    amount: "0",
    period: "/ month",
    ctaLabel: "Get started",
  },
};

export const WithDiscount: Story = {
  args: {
    variant: "featured",
    title: "Pro",
    description: "Save 20% when you upgrade during launch week.",
    badge: "Launch offer",
    currency: "$",
    amount: "23",
    originalAmount: "29",
    period: "/ month",
    ctaLabel: "Claim discount",
  },
};

export const CustomEnterprise: Story = {
  args: {
    variant: "default",
    title: "Enterprise",
    description: "Advanced security, controls, and support for large teams.",
    currency: "",
    amount: "Custom",
    period: "",
    ctaLabel: "Contact sales",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    title: "Hobby",
    description: "For personal projects.",
    amount: "9",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    variant: "featured",
    title: "Business",
    description: "Scale with confidence.",
    badge: "Recommended",
    amount: "199",
    ctaLabel: "Contact sales",
  },
};

function PricingGrid(): ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20,
        width: "100%",
        maxWidth: 1080,
        alignItems: "stretch",
      }}
    >
      <PricingCard variant="muted">
        <PricingCardHeader>
          <PricingCardTitle>Free</PricingCardTitle>
          <PricingCardDescription>
            Explore SchemaVaults on your own.
          </PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice currency="$" amount="0" period="/ month" />
        <PricingCardSeparator />
        <PricingCardFeatures>
          <PricingCardFeature>3 vaults</PricingCardFeature>
          <PricingCardFeature>1 collaborator</PricingCardFeature>
          <PricingCardFeature>Community support</PricingCardFeature>
          <PricingCardFeature status="excluded">
            SSO / SAML
          </PricingCardFeature>
          <PricingCardFeature status="excluded">
            Audit logs
          </PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button variant="outline" className="w-full">
            Get started
          </Button>
        </PricingCardFooter>
      </PricingCard>

      <PricingCard variant="featured">
        <PricingCardHeader>
          <PricingCardBadge variant="default">
            <Sparkles aria-hidden className="size-3" />
            Most popular
          </PricingCardBadge>
          <PricingCardTitle>Team</PricingCardTitle>
          <PricingCardDescription>
            Ship faster together with shared vaults and reviews.
          </PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice
          currency="$"
          amount="79"
          period="/ seat / month"
        />
        <PricingCardSeparator />
        <PricingCardFeatures>
          <PricingCardFeature>Unlimited vaults</PricingCardFeature>
          <PricingCardFeature>Up to 25 collaborators</PricingCardFeature>
          <PricingCardFeature>Priority support</PricingCardFeature>
          <PricingCardFeature>Role-based access control</PricingCardFeature>
          <PricingCardFeature status="coming-soon">
            Vault-level audit logs
          </PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button className="w-full">Upgrade to Team</Button>
        </PricingCardFooter>
      </PricingCard>

      <PricingCard variant="default">
        <PricingCardHeader>
          <PricingCardTitle>Enterprise</PricingCardTitle>
          <PricingCardDescription>
            Security, controls, and support at scale.
          </PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice amount="Custom" />
        <PricingCardSeparator />
        <PricingCardFeatures>
          <PricingCardFeature>Unlimited everything</PricingCardFeature>
          <PricingCardFeature>SAML SSO &amp; SCIM</PricingCardFeature>
          <PricingCardFeature>Dedicated CSM</PricingCardFeature>
          <PricingCardFeature>99.99% uptime SLA</PricingCardFeature>
          <PricingCardFeature>Custom data residency</PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button variant="outline" className="w-full">
            Contact sales
          </Button>
        </PricingCardFooter>
      </PricingCard>
    </div>
  );
}

export const PricingGridExample: StoryObj = {
  render: () => <PricingGrid />,
  parameters: {
    layout: "padded",
  },
};
