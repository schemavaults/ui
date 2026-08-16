import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { EnvironmentBadge } from "./environment-badge";
import {
  environmentBadgeAppearanceIds,
  environmentBadgeShapeIds,
  environmentBadgeSizeIds,
  environmentIds,
  type Environment,
} from "./environment-badge-variants";

const meta = {
  title: "Components/EnvironmentBadge",
  component: EnvironmentBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    environment: {
      options: environmentIds,
      control: { type: "select" },
    },
    appearance: {
      options: environmentBadgeAppearanceIds,
      control: { type: "radio" },
    },
    size: {
      options: environmentBadgeSizeIds,
      control: { type: "radio" },
    },
    shape: {
      options: environmentBadgeShapeIds,
      control: { type: "radio" },
    },
    dot: {
      control: { type: "boolean" },
    },
    pulse: {
      control: { type: "boolean" },
    },
    label: {
      control: { type: "text" },
    },
  },
  args: {
    environment: "production",
    appearance: "soft",
    size: "md",
    shape: "rounded",
    dot: false,
    pulse: false,
  },
} satisfies Meta<typeof EnvironmentBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Production: Story = {
  args: { environment: "production" },
};

export const Staging: Story = {
  args: { environment: "staging" },
};

export const Preview: Story = {
  args: { environment: "preview" },
};

export const Development: Story = {
  args: { environment: "development" },
};

export const Test: Story = {
  args: { environment: "test" },
};

export const Local: Story = {
  args: { environment: "local" },
};

export const Sandbox: Story = {
  args: { environment: "sandbox" },
};

export const WithDot: Story = {
  args: { environment: "production", dot: true },
};

export const WithPulsingDot: Story = {
  args: { environment: "production", dot: true, pulse: true },
};

export const SolidAppearance: Story = {
  args: { environment: "production", appearance: "solid", dot: true },
};

export const OutlineAppearance: Story = {
  args: { environment: "staging", appearance: "outline", dot: true },
};

export const PillShape: Story = {
  args: { environment: "development", shape: "pill", dot: true },
};

export const CustomLabel: Story = {
  args: { environment: "production", label: "PROD", dot: true },
};

export const AliasInput: Story = {
  name: "Accepts alias input (prod, dev, stage, ...)",
  args: {
    environment: "prod" as Environment,
    dot: true,
  },
};

export const AllEnvironments: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex flex-col gap-3 p-4">
      {environmentBadgeAppearanceIds.map((appearance) => (
        <div key={appearance} className="flex flex-wrap items-center gap-3">
          <span className="w-16 text-xs text-muted-foreground capitalize">
            {appearance}
          </span>
          {environmentIds.map((env) => (
            <EnvironmentBadge
              key={env}
              environment={env}
              appearance={appearance}
              dot
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-4 p-4">
      {environmentBadgeSizeIds.map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-10 text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          {(
            [
              "production",
              "staging",
              "preview",
              "development",
              "test",
              "local",
              "sandbox",
            ] satisfies Environment[]
          ).map((env) => (
            <EnvironmentBadge key={env} environment={env} size={size} dot />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const AllShapes: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-4 p-4">
      {environmentBadgeShapeIds.map((shape) => (
        <div key={shape} className="flex items-center gap-3">
          <span className="w-16 text-xs uppercase tracking-wide text-muted-foreground">
            {shape}
          </span>
          {(
            [
              "production",
              "staging",
              "preview",
              "development",
            ] satisfies Environment[]
          ).map((env) => (
            <EnvironmentBadge
              key={env}
              environment={env}
              shape={shape}
              dot
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

interface MockDeployment {
  environment: Environment;
  url: string;
  branch: string;
  commit: string;
}

const mockDeployments: MockDeployment[] = [
  {
    environment: "production",
    url: "app.schemavaults.com",
    branch: "main",
    commit: "a1b2c3d",
  },
  {
    environment: "staging",
    url: "staging.schemavaults.com",
    branch: "release/v0.98",
    commit: "e4f5g6h",
  },
  {
    environment: "preview",
    url: "pr-1234.preview.schemavaults.com",
    branch: "feature/environment-badge",
    commit: "7i8j9k0",
  },
  {
    environment: "development",
    url: "dev.schemavaults.com",
    branch: "develop",
    commit: "l1m2n3o",
  },
  {
    environment: "sandbox",
    url: "sandbox.schemavaults.com",
    branch: "main",
    commit: "p4q5r6s",
  },
  {
    environment: "local",
    url: "localhost:3000",
    branch: "feature/local-testing",
    commit: "t7u8v9w",
  },
];

export const DeploymentList: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="w-full max-w-3xl rounded-lg border border-border bg-card p-4 text-card-foreground">
      <h3 className="mb-3 text-sm font-semibold">Recent Deployments</h3>
      <ul className="divide-y divide-border">
        {mockDeployments.map((deployment) => (
          <li
            key={`${deployment.environment}-${deployment.url}`}
            className="flex items-center gap-3 py-2"
          >
            <EnvironmentBadge
              environment={deployment.environment}
              size="sm"
              dot
              pulse={deployment.environment === "production"}
            />
            <code className="font-mono text-sm">{deployment.url}</code>
            <span className="ml-auto text-xs text-muted-foreground">
              {deployment.branch} · {deployment.commit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  ),
};

export const InlineWithText: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <p className="max-w-md text-sm text-foreground leading-7">
      You are currently connected to the{" "}
      <EnvironmentBadge environment="production" size="sm" dot pulse /> vault.
      Destructive operations executed here affect real customer data. Switch to{" "}
      <EnvironmentBadge environment="sandbox" size="sm" /> for reversible
      testing.
    </p>
  ),
};

export const HeaderBanner: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex w-full max-w-2xl items-center justify-between rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Signed in as</span>
          <span className="text-sm font-semibold">jalexwhitman@gmail.com</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <EnvironmentBadge
          environment="production"
          appearance="solid"
          dot
          pulse
        />
      </div>
    </div>
  ),
};
