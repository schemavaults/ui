import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Github, Chrome, ChevronDown, Sparkles, Mail } from "lucide-react";
import type { ReactElement } from "react";

import { LabeledSeparator } from "./labeled-separator";
import {
  labeledSeparatorAlignIds,
  labeledSeparatorSizeIds,
  labeledSeparatorVariantIds,
} from "./labeled-separator";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Chip } from "../chip";

const meta = {
  title: "Components/LabeledSeparator",
  component: LabeledSeparator,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A horizontal divider that renders a piece of content — typically a short label like \"OR\" or \"OR CONTINUE WITH\" — between (or beside) two rule lines. Common in authentication screens, section headers, and timeline breakpoints. Supports solid/dashed/dotted line styles, start/center/end alignment, and three sizes. Uses theme tokens (`border-border`, `text-muted-foreground`) so it inherits both light and dark styling from `@schemavaults/theme`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    align: {
      options: labeledSeparatorAlignIds,
      control: { type: "inline-radio" },
    },
    size: {
      options: labeledSeparatorSizeIds,
      control: { type: "inline-radio" },
    },
    variant: {
      options: labeledSeparatorVariantIds,
      control: { type: "inline-radio" },
    },
    uppercase: { control: { type: "boolean" } },
    children: { control: { type: "text" } },
  },
  args: {
    children: "OR",
    align: "center",
    size: "default",
    variant: "solid",
    uppercase: false,
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-96 rounded-md border border-border bg-card p-6 text-card-foreground">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LabeledSeparator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Uppercase: Story = {
  args: {
    children: "or continue with",
    uppercase: true,
  },
};

export const AlignStart: Story = {
  args: {
    children: "Section header",
    align: "start",
    size: "lg",
  },
};

export const AlignEnd: Story = {
  args: {
    children: "Draft",
    align: "end",
    variant: "dashed",
  },
};

export const Dashed: Story = {
  args: {
    children: "midpoint",
    variant: "dashed",
    uppercase: true,
  },
};

export const Dotted: Story = {
  args: {
    children: "later that day",
    variant: "dotted",
  },
};

export const WithoutLabel: Story = {
  args: {
    children: undefined,
    variant: "dashed",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Omitting `children` renders a single continuous line with the selected variant — useful when you want the same dashed/dotted styling as your labeled separators, without a label.",
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <span className="inline-flex items-center gap-1.5">
        <Sparkles className="size-3.5" />
        <span>featured</span>
      </span>
    ),
    uppercase: true,
  },
};

export const WithChip: Story = {
  args: {
    children: (
      <Chip variant="primary" size="sm">
        NEW
      </Chip>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Because `children` accepts arbitrary React nodes, the label slot can host any element — chips, badges, buttons, or icon+text combos.",
      },
    },
  },
};

export const AllSizes: Story = {
  render: (args): ReactElement => (
    <div className="flex flex-col gap-6">
      {labeledSeparatorSizeIds.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            size = {size}
          </span>
          <LabeledSeparator {...args} size={size}>
            {args.children ?? `size ${size}`}
          </LabeledSeparator>
        </div>
      ))}
    </div>
  ),
  args: {
    uppercase: true,
    children: "OR",
  },
};

export const AllVariants: Story = {
  render: (args): ReactElement => (
    <div className="flex flex-col gap-6">
      {labeledSeparatorVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            variant = {variant}
          </span>
          <LabeledSeparator {...args} variant={variant}>
            {variant}
          </LabeledSeparator>
        </div>
      ))}
    </div>
  ),
  args: {
    uppercase: true,
  },
};

export const AllAlignments: Story = {
  render: (args): ReactElement => (
    <div className="flex flex-col gap-6">
      {labeledSeparatorAlignIds.map((align) => (
        <div key={align} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            align = {align}
          </span>
          <LabeledSeparator {...args} align={align}>
            {align}
          </LabeledSeparator>
        </div>
      ))}
    </div>
  ),
  args: {
    uppercase: true,
  },
};

export const AuthDivider: Story = {
  render: (): ReactElement => (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="auth-email">Email</Label>
        <Input
          id="auth-email"
          type="email"
          placeholder="you@schemavaults.com"
          autoComplete="email"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="auth-password">Password</Label>
        <Input
          id="auth-password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>
      <Button type="button" onClick={fn()}>
        <Mail className="size-4" />
        Sign in with email
      </Button>
      <LabeledSeparator uppercase>or continue with</LabeledSeparator>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" type="button" onClick={fn()}>
          <Github className="size-4" />
          GitHub
        </Button>
        <Button variant="outline" type="button" onClick={fn()}>
          <Chrome className="size-4" />
          Google
        </Button>
      </div>
    </form>
  ),
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "The canonical use case: splitting an email/password sign-in from a row of OAuth providers with an \"OR CONTINUE WITH\" divider.",
      },
    },
  },
};

export const SectionHeader: Story = {
  render: (): ReactElement => (
    <article className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Configure how notifications reach your team. Alerts respect each
        recipient&apos;s quiet hours.
      </p>
      <LabeledSeparator align="start" size="lg">
        <span className="inline-flex items-center gap-2 text-foreground">
          <ChevronDown className="size-4" />
          Delivery channels
        </span>
      </LabeledSeparator>
      <p className="text-sm text-muted-foreground">
        Pick at least one channel. Email is always enabled for critical
        alerts.
      </p>
      <LabeledSeparator align="start" size="lg" variant="dashed">
        <span className="inline-flex items-center gap-2 text-foreground">
          <ChevronDown className="size-4" />
          Escalation policy
        </span>
      </LabeledSeparator>
      <p className="text-sm text-muted-foreground">
        Route unacknowledged alerts to a secondary responder after 10
        minutes.
      </p>
    </article>
  ),
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Left-aligned labeled separators act as lightweight section headers inside a settings page or long-form article — the trailing rule visually anchors each group.",
      },
    },
  },
};
