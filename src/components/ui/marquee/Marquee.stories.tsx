import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  Activity,
  Cloud,
  Database,
  GitBranch,
  Globe,
  Layers,
  Lock,
  Server,
  Shield,
  Sparkles,
  Star,
  Tag,
  Zap,
} from "lucide-react";

import {
  Marquee,
  MarqueeItem,
  marqueeDirectionIds,
  marqueeFadeIds,
  marqueeGapIds,
} from "./marquee";

interface DemoArgs {
  direction?: (typeof marqueeDirectionIds)[number];
  duration?: number;
  pauseOnHover?: boolean;
  fade?: (typeof marqueeFadeIds)[number];
  gap?: (typeof marqueeGapIds)[number];
  repeat?: number;
}

// All company names below are fictional and used for demo purposes only.
const partnerLogos: Array<{ label: string; icon: ReactElement }> = [
  { label: "Acme Co", icon: <Globe className="h-4 w-4" /> },
  { label: "Globex", icon: <Tag className="h-4 w-4" /> },
  { label: "Initech", icon: <Cloud className="h-4 w-4" /> },
  { label: "Hooli", icon: <Database className="h-4 w-4" /> },
  { label: "Contoso", icon: <Lock className="h-4 w-4" /> },
  { label: "Fabrikam", icon: <Zap className="h-4 w-4" /> },
  { label: "Northwind", icon: <Server className="h-4 w-4" /> },
  { label: "Tailspin", icon: <Activity className="h-4 w-4" /> },
];

function LogoStripDemo({
  direction,
  duration,
  pauseOnHover,
  fade,
  gap,
  repeat,
}: DemoArgs): ReactElement {
  return (
    <div className="w-[640px] rounded-lg border border-border bg-background p-6">
      <p className="mb-4 text-center text-xs uppercase tracking-wider text-muted-foreground">
        Trusted by teams at
      </p>
      <Marquee
        direction={direction}
        duration={duration}
        pauseOnHover={pauseOnHover}
        fade={fade}
        gap={gap}
        repeat={repeat}
        aria-label="Partner logos"
      >
        {partnerLogos.map((p) => (
          <div
            key={p.label}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {p.icon}
            <span>{p.label}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

const meta = {
  title: "Components/Marquee",
  component: LogoStripDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    direction: {
      options: marqueeDirectionIds,
      control: { type: "radio" },
    },
    fade: {
      options: marqueeFadeIds,
      control: { type: "radio" },
    },
    gap: {
      options: marqueeGapIds,
      control: { type: "radio" },
    },
    duration: { control: { type: "number", min: 5, max: 120, step: 5 } },
    pauseOnHover: { control: { type: "boolean" } },
    repeat: { control: { type: "number", min: 2, max: 6, step: 1 } },
  },
  args: {
    direction: "left",
    duration: 30,
    pauseOnHover: true,
    fade: "background",
    gap: "default",
    repeat: 2,
  },
} satisfies Meta<typeof LogoStripDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ScrollRight: Story = {
  args: { direction: "right" },
};

export const Fast: Story = {
  args: { duration: 12 },
};

export const Slow: Story = {
  args: { duration: 60 },
};

export const NoFade: Story = {
  args: { fade: "none" },
};

export const MutedFade: Story = {
  args: { fade: "muted" },
};

export const NoPauseOnHover: Story = {
  args: { pauseOnHover: false },
};

function StatTickerDemo(): ReactElement {
  const stats: Array<{ label: string; value: string }> = [
    { label: "Schemas", value: "1,284" },
    { label: "Migrations", value: "42,981" },
    { label: "Vaults", value: "317" },
    { label: "Uptime", value: "99.998%" },
    { label: "Regions", value: "12" },
    { label: "Daily syncs", value: "8.4M" },
  ];
  return (
    <div className="w-[560px] rounded-lg border border-border bg-muted/40 p-4">
      <Marquee fade="muted" pauseOnHover gap="lg" duration={24}>
        {stats.map((s) => (
          <div key={s.label} className="flex items-baseline gap-2">
            <span className="text-base font-semibold tabular-nums text-foreground">
              {s.value}
            </span>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {s.label}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

export const StatTicker: Story = {
  render: () => <StatTickerDemo />,
};

function CardRowDemo(): ReactElement {
  const features: Array<{ icon: ReactElement; title: string; body: string }> = [
    {
      icon: <Shield className="h-4 w-4 text-primary" />,
      title: "Encrypted at rest",
      body: "AES-256 across every vault.",
    },
    {
      icon: <GitBranch className="h-4 w-4 text-primary" />,
      title: "Versioned schemas",
      body: "Every change is a commit.",
    },
    {
      icon: <Layers className="h-4 w-4 text-primary" />,
      title: "Composable",
      body: "Stack vaults like building blocks.",
    },
    {
      icon: <Sparkles className="h-4 w-4 text-primary" />,
      title: "Smart diffs",
      body: "Only ship the deltas.",
    },
    {
      icon: <Star className="h-4 w-4 text-primary" />,
      title: "Audited",
      body: "Independently reviewed controls.",
    },
  ];
  return (
    <div className="w-[720px] rounded-lg border border-border bg-background p-6">
      <Marquee fade="background" duration={45} gap="lg">
        {features.map((f) => (
          <MarqueeItem key={f.title} className="w-64 flex-col items-start gap-1 p-4">
            <div className="flex items-center gap-2">
              {f.icon}
              <span className="font-medium text-foreground">{f.title}</span>
            </div>
            <p className="text-xs text-muted-foreground">{f.body}</p>
          </MarqueeItem>
        ))}
      </Marquee>
    </div>
  );
}

export const FeatureCards: Story = {
  render: () => <CardRowDemo />,
};

function VerticalDemo(): ReactElement {
  // example.com is reserved by RFC 2606 for documentation, so it's safe to use here.
  const items: string[] = [
    "alice@example.com signed up",
    "vault-prod migrated successfully",
    "schema 'orders' updated",
    "new region 'west-2' added",
    "audit log exported",
    "billing-cycle closed",
    "team 'platform' invited 3 members",
  ];
  return (
    <div className="h-[280px] w-[360px] rounded-lg border border-border bg-card p-4">
      <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
        Activity feed
      </p>
      <div className="h-[220px]">
        <Marquee
          direction="up"
          fade="card"
          duration={20}
          gap="sm"
          aria-label="Recent activity"
        >
          {items.map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span>{text}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export const VerticalScrolling: Story = {
  render: () => <VerticalDemo />,
};

function OpposingRowsDemo(): ReactElement {
  // Both lists below are fictional / invented tag names — they intentionally avoid
  // any real product, protocol, or trademark.
  const tagsTop: string[] = [
    "bluestone",
    "redspire",
    "monolith",
    "stardust",
    "nimbus",
    "helix",
    "octopus",
    "pyrite",
  ];
  const tagsBottom: string[] = [
    "alphalink",
    "echobus",
    "relay-rpc",
    "meshnet",
    "pulsewire",
    "skyhook",
    "pigeon",
    "flotilla",
  ];
  return (
    <div className="flex w-[640px] flex-col gap-3 rounded-lg border border-border bg-background p-6">
      <Marquee fade="background" duration={28} gap="default">
        {tagsTop.map((t) => (
          <MarqueeItem key={t} className="text-xs">
            {t}
          </MarqueeItem>
        ))}
      </Marquee>
      <Marquee
        direction="right"
        fade="background"
        duration={28}
        gap="default"
      >
        {tagsBottom.map((t) => (
          <MarqueeItem key={t} className="text-xs">
            {t}
          </MarqueeItem>
        ))}
      </Marquee>
    </div>
  );
}

export const OpposingRows: Story = {
  render: () => <OpposingRowsDemo />,
};

function AllFadesDemo(): ReactElement {
  return (
    <div className="flex w-[600px] flex-col gap-6">
      {marqueeFadeIds.map((fade) => (
        <div key={fade} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            fade=&quot;{fade}&quot;
          </span>
          <div
            className={
              fade === "muted"
                ? "rounded-md bg-muted p-3"
                : fade === "card"
                  ? "rounded-md bg-card p-3"
                  : "rounded-md bg-background p-3"
            }
          >
            <Marquee fade={fade} duration={25}>
              {partnerLogos.slice(0, 6).map((p) => (
                <div
                  key={p.label}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                >
                  {p.icon}
                  <span>{p.label}</span>
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      ))}
    </div>
  );
}

export const AllFadeColors: Story = {
  render: () => <AllFadesDemo />,
};
