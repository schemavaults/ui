import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import {
  DeviceFrame,
  DeviceFrameContent,
  DeviceFrameHomeIndicator,
  DeviceFrameScreen,
  DeviceFrameStatusBar,
  deviceFrameColorIds,
  deviceFrameOrientationIds,
  deviceFrameSizeIds,
  deviceFrameVariantIds,
  type DeviceFrameColorId,
  type DeviceFrameVariantId,
} from "./device-frame";

const meta = {
  title: "Components/DeviceFrame",
  component: DeviceFrame,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: deviceFrameVariantIds,
      control: { type: "radio" },
    },
    orientation: {
      options: deviceFrameOrientationIds,
      control: { type: "radio" },
    },
    size: {
      options: deviceFrameSizeIds,
      control: { type: "radio" },
    },
    color: {
      options: deviceFrameColorIds,
      control: { type: "radio" },
    },
    dynamicIsland: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof DeviceFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

function AppScreenshot(): ReactElement {
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-primary/10 via-background to-primary/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">Vaults</span>
        <span className="size-8 rounded-full bg-primary/20" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["Schemas", "Requests", "Members", "Audit"].map((label) => (
          <div
            key={label}
            className="flex aspect-square flex-col justify-between rounded-xl border border-border/50 bg-card p-3 text-card-foreground"
          >
            <span className="size-6 rounded-md bg-primary/25" aria-hidden="true" />
            <span className="text-xs font-medium">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex-1 rounded-xl border border-border/50 bg-card p-3 text-card-foreground">
        <div className="mb-2 text-xs font-medium text-muted-foreground">
          Recent activity
        </div>
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="size-5 shrink-0 rounded-full bg-primary/30"
                aria-hidden="true"
              />
              <span className="h-2 flex-1 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LandscapeAppScreenshot(): ReactElement {
  return (
    <div className="grid h-full w-full grid-cols-[160px_1fr] bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <aside className="flex flex-col gap-2 border-r border-border/40 p-3">
        <span className="mb-2 text-sm font-semibold">SchemaVaults</span>
        {["Dashboard", "Vaults", "Team", "Billing"].map((label) => (
          <span
            key={label}
            className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            {label}
          </span>
        ))}
      </aside>
      <main className="flex flex-col gap-3 p-4">
        <div className="h-6 w-40 rounded-md bg-primary/25" aria-hidden="true" />
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex aspect-video flex-col justify-between rounded-lg border border-border/50 bg-card p-3 text-card-foreground"
            >
              <span className="h-3 w-10 rounded-full bg-primary/30" />
              <span className="h-5 w-16 rounded-md bg-foreground/70" />
            </div>
          ))}
        </div>
        <div className="flex-1 rounded-lg border border-border/50 bg-card p-3 text-card-foreground">
          <div className="mb-2 h-3 w-24 rounded-full bg-muted" />
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="size-5 rounded-full bg-primary/30" />
                <span className="h-2 flex-1 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function LockScreen(): ReactElement {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between bg-gradient-to-b from-indigo-500 via-fuchsia-500 to-orange-400 p-6 text-white">
      <div className="mt-16 text-center">
        <div className="text-6xl font-light tabular-nums">9:41</div>
        <div className="mt-1 text-sm font-medium opacity-90">
          Monday, July 27
        </div>
      </div>
      <div className="w-full space-y-2">
        <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-md">
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider opacity-80">
            SchemaVaults
          </div>
          <div className="text-xs font-medium">
            New schema request from @alice
          </div>
        </div>
      </div>
    </div>
  );
}

export const Default: Story = {
  args: {
    variant: "phone-modern",
    orientation: "portrait",
    size: "md",
    color: "graphite",
    dynamicIsland: true,
  },
  render: (args): ReactElement => {
    const variant = args.variant ?? "phone-modern";
    return (
      <DeviceFrame {...args}>
        <DeviceFrameScreen variant={variant}>
          <DeviceFrameStatusBar />
          <DeviceFrameContent>
            <AppScreenshot />
          </DeviceFrameContent>
          <DeviceFrameHomeIndicator />
        </DeviceFrameScreen>
      </DeviceFrame>
    );
  },
};

export const PhoneModern: Story = {
  render: (): ReactElement => (
    <DeviceFrame variant="phone-modern" color="graphite">
      <DeviceFrameScreen variant="phone-modern">
        <DeviceFrameStatusBar />
        <DeviceFrameContent>
          <AppScreenshot />
        </DeviceFrameContent>
        <DeviceFrameHomeIndicator />
      </DeviceFrameScreen>
    </DeviceFrame>
  ),
};

export const PhoneModernWithNotch: Story = {
  render: (): ReactElement => (
    <DeviceFrame variant="phone-modern" color="graphite" dynamicIsland={false}>
      <DeviceFrameScreen variant="phone-modern">
        <DeviceFrameStatusBar />
        <DeviceFrameContent>
          <LockScreen />
        </DeviceFrameContent>
        <DeviceFrameHomeIndicator />
      </DeviceFrameScreen>
    </DeviceFrame>
  ),
};

export const PhoneClassic: Story = {
  render: (): ReactElement => (
    <DeviceFrame variant="phone-classic" color="silver">
      <DeviceFrameScreen variant="phone-classic">
        <DeviceFrameStatusBar compact />
        <DeviceFrameContent>
          <AppScreenshot />
        </DeviceFrameContent>
      </DeviceFrameScreen>
    </DeviceFrame>
  ),
};

export const Tablet: Story = {
  render: (): ReactElement => (
    <DeviceFrame variant="tablet" color="graphite">
      <DeviceFrameScreen variant="tablet">
        <DeviceFrameStatusBar />
        <DeviceFrameContent>
          <LandscapeAppScreenshot />
        </DeviceFrameContent>
        <DeviceFrameHomeIndicator />
      </DeviceFrameScreen>
    </DeviceFrame>
  ),
};

export const Laptop: Story = {
  render: (): ReactElement => (
    <DeviceFrame variant="laptop" color="silver">
      <DeviceFrameScreen variant="laptop">
        <DeviceFrameContent>
          <LandscapeAppScreenshot />
        </DeviceFrameContent>
      </DeviceFrameScreen>
    </DeviceFrame>
  ),
};

export const Landscape: Story = {
  render: (): ReactElement => (
    <DeviceFrame variant="phone-modern" orientation="landscape" color="graphite">
      <DeviceFrameScreen variant="phone-modern">
        <DeviceFrameContent>
          <LandscapeAppScreenshot />
        </DeviceFrameContent>
      </DeviceFrameScreen>
    </DeviceFrame>
  ),
};

function AllVariantsExample(): ReactElement {
  const configs: {
    variant: DeviceFrameVariantId;
    label: string;
    color: DeviceFrameColorId;
  }[] = [
    { variant: "phone-modern", label: "phone-modern", color: "graphite" },
    { variant: "phone-classic", label: "phone-classic", color: "silver" },
    { variant: "tablet", label: "tablet", color: "graphite" },
    { variant: "laptop", label: "laptop", color: "silver" },
  ];
  return (
    <div className="flex flex-wrap items-end gap-10">
      {configs.map(({ variant, label, color }) => (
        <div key={variant} className="flex flex-col items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <DeviceFrame variant={variant} color={color} size="sm">
            <DeviceFrameScreen variant={variant}>
              {variant !== "laptop" ? <DeviceFrameStatusBar compact /> : null}
              <DeviceFrameContent>
                <div className="grid h-full place-items-center bg-muted/40 text-xs text-muted-foreground">
                  {label}
                </div>
              </DeviceFrameContent>
              {variant === "phone-modern" || variant === "tablet" ? (
                <DeviceFrameHomeIndicator />
              ) : null}
            </DeviceFrameScreen>
          </DeviceFrame>
        </div>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => <AllVariantsExample />,
};

function AllColorsExample(): ReactElement {
  return (
    <div className="flex flex-wrap items-end gap-8">
      {deviceFrameColorIds.map((color) => (
        <div key={color} className="flex flex-col items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {color}
          </span>
          <DeviceFrame variant="phone-modern" color={color} size="sm">
            <DeviceFrameScreen variant="phone-modern">
              <DeviceFrameStatusBar />
              <DeviceFrameContent>
                <div className="grid h-full place-items-center bg-gradient-to-br from-primary/10 via-background to-primary/5 text-xs text-muted-foreground">
                  {color}
                </div>
              </DeviceFrameContent>
              <DeviceFrameHomeIndicator />
            </DeviceFrameScreen>
          </DeviceFrame>
        </div>
      ))}
    </div>
  );
}

export const AllColors: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => <AllColorsExample />,
};

function AllSizesExample(): ReactElement {
  return (
    <div className="flex flex-wrap items-end gap-8">
      {deviceFrameSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <DeviceFrame variant="phone-modern" size={size} color="graphite">
            <DeviceFrameScreen variant="phone-modern">
              <DeviceFrameStatusBar />
              <DeviceFrameContent>
                <AppScreenshot />
              </DeviceFrameContent>
              <DeviceFrameHomeIndicator />
            </DeviceFrameScreen>
          </DeviceFrame>
        </div>
      ))}
    </div>
  );
}

export const AllSizes: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => <AllSizesExample />,
};

export const BareScreen: Story = {
  render: (): ReactElement => (
    <DeviceFrame variant="phone-modern" color="midnight" size="md">
      <DeviceFrameScreen variant="phone-modern">
        <DeviceFrameContent>
          <LockScreen />
        </DeviceFrameContent>
      </DeviceFrameScreen>
    </DeviceFrame>
  ),
};
