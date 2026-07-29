import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";
import {
  CreditCard,
  Database,
  Rocket,
  Shield,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";

import {
  RadioCard,
  RadioCardBadge,
  RadioCardDescription,
  RadioCardFooter,
  RadioCardGroup,
  RadioCardHeader,
  RadioCardIcon,
  RadioCardTitle,
  radioCardGroupOrientationIds,
  radioCardGroupSizeIds,
  radioCardGroupVariantIds,
  radioCardIndicatorStyleIds,
  type RadioCardGroupOrientationId,
  type RadioCardGroupSizeId,
  type RadioCardGroupVariantId,
  type RadioCardIndicatorStyleId,
} from "./radio-card-group";

interface StoryArgs {
  size: RadioCardGroupSizeId;
  variant: RadioCardGroupVariantId;
  orientation: RadioCardGroupOrientationId;
  indicator: RadioCardIndicatorStyleId;
  columns: 1 | 2 | 3 | 4;
  defaultValue: string;
  disabled: boolean;
  onValueChange: (value: string) => void;
}

const meta = {
  title: "Components/RadioCardGroup",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "`RadioCardGroup` renders a set of selectable cards backed by Radix's",
          "`RadioGroup` primitive, so keyboard navigation, screen-reader announcements,",
          "and form integration all behave exactly like a native radio group — but each",
          "option is a full card with icon, title, description, badge, and footer slots.",
          "\n\nReach for it whenever you'd otherwise use a radio group but the options need",
          "more room to breathe: plan/pricing selection, payment methods, onboarding",
          "'what are you trying to do?' screens, environment/region pickers, and so on.",
          "Complements the simpler [`RadioGroup`](?path=/docs/components-radiogroup--docs)",
          "(bare-bones radio buttons) and [`SegmentedControl`](?path=/docs/components-segmentedcontrol--docs)",
          "(single-row exclusive toggle).",
        ].join(" "),
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { options: radioCardGroupSizeIds, control: { type: "radio" } },
    variant: { options: radioCardGroupVariantIds, control: { type: "radio" } },
    orientation: {
      options: radioCardGroupOrientationIds,
      control: { type: "radio" },
    },
    indicator: {
      options: radioCardIndicatorStyleIds,
      control: { type: "radio" },
    },
    columns: { options: [1, 2, 3, 4], control: { type: "radio" } },
    defaultValue: { control: { type: "text" } },
    disabled: { control: { type: "boolean" } },
    onValueChange: { action: "value-changed" },
  },
  args: {
    size: "default",
    variant: "default",
    orientation: "vertical",
    indicator: "radio",
    columns: 1,
    defaultValue: "starter",
    disabled: false,
    onValueChange: fn(),
  },
  render: (args): ReactElement => (
    <div style={{ width: "560px", maxWidth: "100%" }}>
      <RadioCardGroup
        size={args.size}
        variant={args.variant}
        orientation={args.orientation}
        indicator={args.indicator}
        columns={args.columns}
        defaultValue={args.defaultValue}
        disabled={args.disabled}
        onValueChange={args.onValueChange}
        aria-label="Choose a plan"
      >
        <RadioCard value="starter">
          <RadioCardHeader>
            <RadioCardIcon>
              <Sparkles />
            </RadioCardIcon>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <RadioCardTitle>Starter</RadioCardTitle>
              <RadioCardDescription>
                For small teams testing the waters — up to 3 seats included.
              </RadioCardDescription>
            </div>
          </RadioCardHeader>
        </RadioCard>
        <RadioCard value="team">
          <RadioCardHeader>
            <RadioCardIcon>
              <Rocket />
            </RadioCardIcon>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <RadioCardTitle>Team</RadioCardTitle>
                <RadioCardBadge>Popular</RadioCardBadge>
              </div>
              <RadioCardDescription>
                Everything in Starter plus unlimited seats, roles, and audit
                logs.
              </RadioCardDescription>
            </div>
          </RadioCardHeader>
        </RadioCard>
        <RadioCard value="enterprise">
          <RadioCardHeader>
            <RadioCardIcon>
              <Shield />
            </RadioCardIcon>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <RadioCardTitle>Enterprise</RadioCardTitle>
              <RadioCardDescription>
                SSO, SCIM, custom retention, and a dedicated support engineer.
              </RadioCardDescription>
            </div>
          </RadioCardHeader>
        </RadioCard>
      </RadioCardGroup>
    </div>
  ),
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CheckIndicator: Story = {
  args: { indicator: "check", defaultValue: "team" },
  parameters: {
    docs: {
      description: {
        story:
          "Set `indicator=\"check\"` to swap the radio dot for a filled checkmark in the top-right corner. Useful when the visual affordance you want closer to a checkbox even though only one option can be selected at a time.",
      },
    },
  },
};

export const NoIndicator: Story = {
  args: { indicator: "none", defaultValue: "team" },
  parameters: {
    docs: {
      description: {
        story:
          "`indicator=\"none\"` hides the corner indicator entirely and lets the border/background change carry the entire selection cue. Best paired with the `elevated` variant so the checked card visibly lifts off the page.",
      },
    },
  },
};

export const Muted: Story = {
  args: { variant: "muted" },
  parameters: {
    docs: {
      description: {
        story:
          "The `muted` variant hides the resting border and uses a soft filled background. It reads as slightly less prominent than `default`, so use it in dense settings pages where the cards should recede until interacted with.",
      },
    },
  },
};

export const Elevated: Story = {
  args: { variant: "elevated" },
  parameters: {
    docs: {
      description: {
        story:
          "`elevated` adds a subtle shadow that deepens on hover. Works best on light neutral backgrounds where a plain border would blend in.",
      },
    },
  },
};

export const HorizontalTwoColumn: Story = {
  name: "Two-column grid",
  args: { columns: 2, defaultValue: "monthly" },
  render: (args): ReactElement => (
    <div style={{ width: "560px", maxWidth: "100%" }}>
      <RadioCardGroup
        size={args.size}
        variant={args.variant}
        orientation="vertical"
        indicator={args.indicator}
        columns={2}
        defaultValue={args.defaultValue}
        onValueChange={args.onValueChange}
        aria-label="Billing period"
      >
        <RadioCard value="monthly">
          <RadioCardTitle>Monthly</RadioCardTitle>
          <RadioCardDescription>
            $29 per seat, billed every month. Cancel any time.
          </RadioCardDescription>
        </RadioCard>
        <RadioCard value="annual">
          <div className="flex items-center gap-2">
            <RadioCardTitle>Annual</RadioCardTitle>
            <RadioCardBadge>Save 20%</RadioCardBadge>
          </div>
          <RadioCardDescription>
            $279 per seat, billed once a year.
          </RadioCardDescription>
        </RadioCard>
      </RadioCardGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Set `columns={2}` (or `3` / `4`) to lay cards out in a responsive grid — the grid collapses to a single column on narrow screens. Handy for side-by-side comparisons like billing periods or plan tiers.",
      },
    },
  },
};

export const HorizontalRow: Story = {
  name: "Horizontal row (auto-fit)",
  args: { orientation: "horizontal", defaultValue: "card" },
  render: (args): ReactElement => (
    <div style={{ width: "620px", maxWidth: "100%" }}>
      <RadioCardGroup
        size={args.size}
        variant={args.variant}
        orientation="horizontal"
        indicator={args.indicator}
        defaultValue={args.defaultValue}
        onValueChange={args.onValueChange}
        aria-label="Payment method"
      >
        <RadioCard value="card">
          <RadioCardHeader>
            <RadioCardIcon>
              <CreditCard />
            </RadioCardIcon>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <RadioCardTitle>Card</RadioCardTitle>
              <RadioCardDescription>Visa, MC, Amex</RadioCardDescription>
            </div>
          </RadioCardHeader>
        </RadioCard>
        <RadioCard value="wallet">
          <RadioCardHeader>
            <RadioCardIcon>
              <Wallet />
            </RadioCardIcon>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <RadioCardTitle>Wallet</RadioCardTitle>
              <RadioCardDescription>Apple / Google Pay</RadioCardDescription>
            </div>
          </RadioCardHeader>
        </RadioCard>
        <RadioCard value="invoice">
          <RadioCardHeader>
            <RadioCardIcon>
              <Database />
            </RadioCardIcon>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <RadioCardTitle>Invoice</RadioCardTitle>
              <RadioCardDescription>Net-30 terms</RadioCardDescription>
            </div>
          </RadioCardHeader>
        </RadioCard>
      </RadioCardGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`orientation=\"horizontal\"` lays every card in a single row with equal width. Best kept to two or three short options — anything longer should wrap into a grid instead.",
      },
    },
  },
};

export const Small: Story = {
  args: { size: "sm" },
  parameters: {
    docs: {
      description: {
        story:
          "`size=\"sm\"` shrinks padding, icon frame, and typography. Handy in modals or side panels where vertical space is tight.",
      },
    },
  },
};

export const Large: Story = {
  args: { size: "lg" },
  parameters: {
    docs: {
      description: {
        story:
          "`size=\"lg\"` gives each card generous padding and a bigger icon frame — a good fit for full-page onboarding steps.",
      },
    },
  },
};

export const WithFooter: Story = {
  name: "With footer slot",
  args: { columns: 2, defaultValue: "pro" },
  render: (args): ReactElement => (
    <div style={{ width: "620px", maxWidth: "100%" }}>
      <RadioCardGroup
        size={args.size}
        variant="elevated"
        indicator={args.indicator}
        columns={2}
        defaultValue={args.defaultValue}
        onValueChange={args.onValueChange}
        aria-label="Choose a plan"
      >
        <RadioCard value="pro">
          <RadioCardHeader>
            <RadioCardIcon>
              <Zap />
            </RadioCardIcon>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <RadioCardTitle>Pro</RadioCardTitle>
              <RadioCardDescription>
                Fast queues, private schemas, priority support.
              </RadioCardDescription>
            </div>
          </RadioCardHeader>
          <RadioCardFooter>
            <span className="font-semibold text-foreground">$49</span>
            <span>/seat/month</span>
          </RadioCardFooter>
        </RadioCard>
        <RadioCard value="scale">
          <RadioCardHeader>
            <RadioCardIcon>
              <Rocket />
            </RadioCardIcon>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <RadioCardTitle>Scale</RadioCardTitle>
              <RadioCardDescription>
                Region pinning, audit exports, uptime SLA.
              </RadioCardDescription>
            </div>
          </RadioCardHeader>
          <RadioCardFooter>
            <span className="font-semibold text-foreground">$129</span>
            <span>/seat/month</span>
          </RadioCardFooter>
        </RadioCard>
      </RadioCardGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`RadioCardFooter` is a stackable slot for metadata under the title/description — prices, quotas, effective dates, and so on. It uses the same muted text style as `StatCardFooter` for visual consistency.",
      },
    },
  },
};

export const WithDisabledOption: Story = {
  name: "Disabled option",
  args: { defaultValue: "team", columns: 1 },
  render: (args): ReactElement => (
    <div style={{ width: "560px", maxWidth: "100%" }}>
      <RadioCardGroup
        size={args.size}
        variant={args.variant}
        indicator={args.indicator}
        defaultValue={args.defaultValue}
        onValueChange={args.onValueChange}
        aria-label="Choose a plan"
      >
        <RadioCard value="starter">
          <RadioCardHeader>
            <RadioCardIcon>
              <Sparkles />
            </RadioCardIcon>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <RadioCardTitle>Starter</RadioCardTitle>
              <RadioCardDescription>Up to 3 seats.</RadioCardDescription>
            </div>
          </RadioCardHeader>
        </RadioCard>
        <RadioCard value="team">
          <RadioCardHeader>
            <RadioCardIcon>
              <Rocket />
            </RadioCardIcon>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <RadioCardTitle>Team</RadioCardTitle>
              <RadioCardDescription>Unlimited seats.</RadioCardDescription>
            </div>
          </RadioCardHeader>
        </RadioCard>
        <RadioCard value="enterprise" disabled>
          <RadioCardHeader>
            <RadioCardIcon>
              <Shield />
            </RadioCardIcon>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <RadioCardTitle>Enterprise</RadioCardTitle>
                <RadioCardBadge>Contact sales</RadioCardBadge>
              </div>
              <RadioCardDescription>
                Not available on self-serve — talk to us first.
              </RadioCardDescription>
            </div>
          </RadioCardHeader>
        </RadioCard>
      </RadioCardGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Set `disabled` on an individual `RadioCard` to prevent selection while keeping the card visible for context (e.g. \"contact sales\" options).",
      },
    },
  },
};

export const Controlled: Story = {
  name: "Controlled (useState)",
  render: function Controlled(args): ReactElement {
    const [value, setValue] = useState<string>("team");
    return (
      <div style={{ width: "560px", maxWidth: "100%" }}>
        <p
          data-testid="controlled-value"
          className="mb-3 text-sm text-muted-foreground"
        >
          Selected: <span className="font-medium text-foreground">{value}</span>
        </p>
        <RadioCardGroup
          size={args.size}
          variant={args.variant}
          indicator={args.indicator}
          value={value}
          onValueChange={(next) => {
            setValue(next);
            args.onValueChange(next);
          }}
          aria-label="Choose a plan"
        >
          <RadioCard value="starter">
            <RadioCardTitle>Starter</RadioCardTitle>
            <RadioCardDescription>Up to 3 seats.</RadioCardDescription>
          </RadioCard>
          <RadioCard value="team">
            <RadioCardTitle>Team</RadioCardTitle>
            <RadioCardDescription>Unlimited seats.</RadioCardDescription>
          </RadioCard>
          <RadioCard value="enterprise">
            <RadioCardTitle>Enterprise</RadioCardTitle>
            <RadioCardDescription>Custom deployment.</RadioCardDescription>
          </RadioCard>
        </RadioCardGroup>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "`RadioCardGroup` forwards `value` and `onValueChange` straight to Radix's `RadioGroup.Root` — controlled usage is identical to the plain `RadioGroup` component.",
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const enterpriseCard = await waitFor(() => {
      const el = canvasElement.querySelector<HTMLButtonElement>(
        '[data-slot="radio-card"][value="enterprise"]',
      );
      if (!el) throw new Error("Enterprise radio card not rendered yet");
      return el;
    });
    await userEvent.click(enterpriseCard);
    await waitFor(() => {
      expect(args.onValueChange).toHaveBeenCalledWith("enterprise");
    });
    await waitFor(() => {
      expect(canvas.getByTestId("controlled-value")).toHaveTextContent(
        "enterprise",
      );
    });
  },
};

export const KeyboardNavigation: Story = {
  name: "Keyboard navigation",
  args: { defaultValue: "starter" },
  parameters: {
    docs: {
      description: {
        story:
          "Because `RadioCardGroup` wraps Radix's `RadioGroup`, arrow keys move focus/selection between cards and Space activates the focused card — just like a native radio group. Try focusing the first card and pressing the down arrow.",
      },
    },
  },
};
