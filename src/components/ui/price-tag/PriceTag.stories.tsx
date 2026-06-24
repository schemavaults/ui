import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { PriceTag, priceTagSizeIds, priceTagVariantIds, priceTagAlignIds } from "./price-tag";

const meta = {
  title: "Components/PriceTag",
  component: PriceTag,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Theme-aware price display for pricing pages, subscription tiers, product cards, and discount displays. Supports configurable currency symbols, period suffixes, original prices with strikethrough, and multiple size/colour variants drawn from `@schemavaults/theme` tokens.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    amount: { control: { type: "number" } },
    currency: { control: { type: "text" } },
    period: { control: { type: "text" } },
    originalAmount: { control: { type: "number" } },
    label: { control: { type: "text" } },
    size: {
      options: priceTagSizeIds,
      control: { type: "radio" },
    },
    variant: {
      options: priceTagVariantIds,
      control: { type: "select" },
    },
    align: {
      options: priceTagAlignIds,
      control: { type: "radio" },
    },
    locale: { control: { type: "text" } },
    fractionDigits: { control: { type: "number" } },
    hideCurrency: { control: { type: "boolean" } },
  },
  args: {
    amount: 29,
    currency: "$",
    period: "/month",
    size: "md",
    variant: "default",
    align: "start",
  },
} satisfies Meta<typeof PriceTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Free: Story = {
  args: {
    amount: 0,
    period: "forever",
    variant: "muted",
  },
};

export const WithDiscount: Story = {
  args: {
    amount: 19,
    originalAmount: 29,
    period: "/month",
    variant: "primary",
  },
};

export const Annual: Story = {
  args: {
    amount: 288,
    period: "/year",
    label: "Billed annually",
    size: "lg",
    variant: "primary",
  },
};

export const Enterprise: Story = {
  args: {
    amount: "Custom",
    currency: "",
    period: "",
    hideCurrency: true,
    size: "lg",
    variant: "muted",
  },
};

export const LargePrice: Story = {
  args: {
    amount: 1299,
    fractionDigits: 2,
    period: "/year",
    size: "xl",
    variant: "primary",
  },
};

export const EuroFormatted: Story = {
  args: {
    amount: 1499.95,
    currency: "€",
    period: "/year",
    locale: "de-DE",
    fractionDigits: 2,
    size: "lg",
  },
};

export const Destructive: Story = {
  args: {
    amount: 1500,
    period: " over budget",
    fractionDigits: 2,
    variant: "destructive",
    size: "lg",
  },
};

export const Success: Story = {
  args: {
    amount: 250,
    period: " saved",
    label: "Discount applied",
    variant: "success",
    size: "lg",
  },
};

function AllSizesExample(): ReactElement {
  return (
    <div className="flex items-end gap-8">
      {priceTagSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <PriceTag amount={49} period="/mo" size={size} variant="primary" />
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  );
}

export const AllSizes: Story = {
  render: (): ReactElement => <AllSizesExample />,
};

function AllVariantsExample(): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
      {priceTagVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2 rounded-md border border-border bg-card p-4">
          <PriceTag amount={99} period="/mo" variant={variant} />
          <span className="text-xs text-muted-foreground">{variant}</span>
        </div>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  render: (): ReactElement => <AllVariantsExample />,
};

function PricingTableExample(): ReactElement {
  const tiers = [
    {
      name: "Hobby",
      amount: 0,
      period: "forever",
      variant: "muted" as const,
      description: "For personal projects and exploration.",
    },
    {
      name: "Pro",
      amount: 29,
      originalAmount: 49,
      period: "/month",
      variant: "primary" as const,
      description: "For growing teams and serious workloads.",
    },
    {
      name: "Enterprise",
      amount: "Custom" as const,
      period: "",
      hideCurrency: true,
      variant: "default" as const,
      description: "Tailored deployments with SSO and SLAs.",
    },
  ];

  return (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{tier.name}</h3>
            <p className="text-sm text-muted-foreground">{tier.description}</p>
          </div>
          <PriceTag
            amount={tier.amount}
            originalAmount={"originalAmount" in tier ? tier.originalAmount : undefined}
            period={tier.period}
            hideCurrency={"hideCurrency" in tier ? tier.hideCurrency : false}
            variant={tier.variant}
            size="lg"
          />
        </div>
      ))}
    </div>
  );
}

export const PricingTable: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => <PricingTableExample />,
};

export const Centered: Story = {
  args: {
    amount: 199,
    period: "/year",
    align: "center",
    size: "xl",
    variant: "primary",
  },
};

export const RightAligned: Story = {
  args: {
    amount: 12.49,
    fractionDigits: 2,
    period: "/seat/month",
    align: "end",
    size: "md",
  },
};

export const HiddenCurrencyForCredits: Story = {
  args: {
    amount: 5000,
    currency: "",
    period: " credits",
    hideCurrency: true,
    size: "lg",
    variant: "primary",
  },
};
