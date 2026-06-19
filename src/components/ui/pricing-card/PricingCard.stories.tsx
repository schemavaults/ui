import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { Button } from "../button/button";
import {
  PricingCard,
  PricingCardBadge,
  PricingCardDescription,
  PricingCardFeature,
  PricingCardFeatureList,
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
  amount?: number;
  currency?: string;
  period?: string;
  originalAmount?: number;
  ctaLabel?: string;
}

function PricingCardExample({
  variant = "default",
  size = "md",
  title = "Pro",
  description = "Everything you need to scale your team's schemas.",
  badge = "",
  amount = 29,
  currency = "$",
  period = "/month",
  originalAmount,
  ctaLabel = "Get started",
}: PricingCardExampleProps): ReactElement {
  const ctaVariant: "default" | "secondary" =
    variant === "primary" ? "secondary" : "default";
  return (
    <div style={{ width: 340 }}>
      <PricingCard variant={variant} size={size}>
        {badge ? <PricingCardBadge variant={variant}>{badge}</PricingCardBadge> : null}
        <PricingCardHeader>
          <PricingCardTitle size={size}>{title}</PricingCardTitle>
          {description ? (
            <PricingCardDescription>{description}</PricingCardDescription>
          ) : null}
        </PricingCardHeader>
        <PricingCardPrice
          amount={amount}
          currency={currency}
          period={period}
          originalAmount={originalAmount}
          size={size}
        />
        <PricingCardSeparator />
        <PricingCardFeatureList>
          <PricingCardFeature>Unlimited schemas</PricingCardFeature>
          <PricingCardFeature>Up to 10 team members</PricingCardFeature>
          <PricingCardFeature>API access &amp; webhooks</PricingCardFeature>
          <PricingCardFeature>Priority email support</PricingCardFeature>
          <PricingCardFeature included={false}>SSO / SAML</PricingCardFeature>
        </PricingCardFeatureList>
        <PricingCardFooter>
          <Button variant={ctaVariant} className="w-full">
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
    amount: { control: { type: "number" } },
    currency: { control: { type: "text" } },
    period: { control: { type: "text" } },
    originalAmount: { control: { type: "number" } },
    ctaLabel: { control: { type: "text" } },
  },
  args: {
    variant: "default",
    size: "md",
    title: "Pro",
    description: "Everything you need to scale your team's schemas.",
    badge: "",
    amount: 29,
    currency: "$",
    period: "/month",
    ctaLabel: "Get started",
  },
} satisfies Meta<typeof PricingCardExample>;

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
    title: "Starter",
    description: "Free forever for hobby projects.",
    amount: 0,
    period: "",
    ctaLabel: "Sign up free",
  },
};

export const Featured: Story = {
  args: {
    variant: "featured",
    badge: "Most popular",
    title: "Team",
    description: "For growing teams managing many schemas.",
    amount: 79,
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    badge: "Best value",
    title: "Enterprise",
    description: "Custom limits, SSO, and a dedicated success engineer.",
    amount: 499,
  },
};

export const DiscountedPrice: Story = {
  args: {
    variant: "featured",
    badge: "Save 40%",
    title: "Annual",
    description: "Two months free when paid annually.",
    amount: 17,
    originalAmount: 29,
    period: "/month, billed yearly",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    title: "Hobby",
    amount: 9,
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    variant: "featured",
    badge: "Recommended",
    amount: 99,
  },
};

interface TierConfig {
  variant: PricingCardVariantId;
  title: string;
  description: string;
  amount: number | string;
  currency?: string;
  period?: string;
  features: { label: string; included?: boolean }[];
  cta: string;
  badge?: string;
}

const tiers: TierConfig[] = [
  {
    variant: "muted",
    title: "Starter",
    description: "Free forever for solo developers and hobby projects.",
    amount: 0,
    currency: "$",
    features: [
      { label: "Up to 3 schemas" },
      { label: "1 environment" },
      { label: "Community support" },
      { label: "Team collaboration", included: false },
      { label: "SSO / SAML", included: false },
    ],
    cta: "Sign up free",
  },
  {
    variant: "featured",
    title: "Team",
    description: "For growing teams managing many schemas.",
    amount: 29,
    currency: "$",
    period: "/user/mo",
    features: [
      { label: "Unlimited schemas" },
      { label: "5 environments" },
      { label: "API access & webhooks" },
      { label: "Audit logs (30 days)" },
      { label: "SSO / SAML", included: false },
    ],
    cta: "Start 14-day trial",
    badge: "Most popular",
  },
  {
    variant: "default",
    title: "Enterprise",
    description: "Custom limits, SSO, and a dedicated success engineer.",
    amount: "Custom",
    features: [
      { label: "Everything in Team" },
      { label: "Unlimited environments" },
      { label: "SSO / SAML & SCIM" },
      { label: "Audit logs (1 year)" },
      { label: "Dedicated success engineer" },
    ],
    cta: "Contact sales",
  },
];

function PricingGrid(): ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
        width: "100%",
        maxWidth: 1024,
        paddingTop: 16,
      }}
    >
      {tiers.map((tier) => {
        const ctaButtonVariant: "default" | "secondary" | "outline" =
          tier.variant === "primary"
            ? "secondary"
            : tier.variant === "featured"
              ? "default"
              : "outline";
        return (
          <PricingCard key={tier.title} variant={tier.variant}>
            {tier.badge ? (
              <PricingCardBadge variant={tier.variant}>
                {tier.badge}
              </PricingCardBadge>
            ) : null}
            <PricingCardHeader>
              <PricingCardTitle>{tier.title}</PricingCardTitle>
              <PricingCardDescription>{tier.description}</PricingCardDescription>
            </PricingCardHeader>
            <PricingCardPrice
              amount={tier.amount}
              currency={tier.currency}
              period={tier.period}
            />
            <PricingCardSeparator />
            <PricingCardFeatureList>
              {tier.features.map((feature) => (
                <PricingCardFeature
                  key={feature.label}
                  included={feature.included ?? true}
                >
                  {feature.label}
                </PricingCardFeature>
              ))}
            </PricingCardFeatureList>
            <PricingCardFooter>
              <Button variant={ctaButtonVariant} className="w-full">
                {tier.cta}
              </Button>
            </PricingCardFooter>
          </PricingCard>
        );
      })}
    </div>
  );
}

export const PricingPageExample: StoryObj = {
  render: () => <PricingGrid />,
  parameters: {
    layout: "padded",
  },
};
