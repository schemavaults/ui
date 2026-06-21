import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import type { ReactElement } from "react";
import {
  Database,
  Download,
  KeyRound,
  Plus,
  RefreshCw,
  Settings,
  Share2,
  Users,
} from "lucide-react";

import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderIcon,
  PageHeaderMeta,
  PageHeaderRow,
  PageHeaderTitle,
  PageHeaderTitleArea,
  PageHeaderTitleGroup,
  pageHeaderSizeIds,
  pageHeaderVariantIds,
  type PageHeaderSizeId,
  type PageHeaderVariantId,
} from "./page-header";
import { Button } from "../button/button";
import { Badge } from "../badge/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../breadcrumb/breadcrumb";

interface PageHeaderExampleProps {
  variant?: PageHeaderVariantId;
  size?: PageHeaderSizeId;
  padded?: boolean;
  bordered?: boolean;
  showIcon?: boolean;
  showEyebrow?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
  showMeta?: boolean;
  title?: string;
  description?: string;
  eyebrow?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

function PageHeaderExample({
  variant = "default",
  size = "default",
  padded = false,
  bordered = false,
  showIcon = true,
  showEyebrow = false,
  showDescription = true,
  showActions = true,
  showMeta = false,
  title = "Customer schemas",
  description = "Browse, version, and share the data contracts your customer-facing services depend on.",
  eyebrow = "Vaults",
  onPrimaryAction,
  onSecondaryAction,
}: PageHeaderExampleProps): ReactElement {
  return (
    <PageHeader
      variant={variant}
      size={size}
      padded={padded}
      bordered={bordered}
    >
      {showEyebrow ? <PageHeaderEyebrow>{eyebrow}</PageHeaderEyebrow> : null}
      <PageHeaderRow>
        <PageHeaderTitleGroup>
          {showIcon ? (
            <PageHeaderIcon size={size}>
              <Database />
            </PageHeaderIcon>
          ) : null}
          <PageHeaderTitleArea>
            <PageHeaderTitle size={size}>{title}</PageHeaderTitle>
            {showDescription ? (
              <PageHeaderDescription>{description}</PageHeaderDescription>
            ) : null}
            {showMeta ? (
              <PageHeaderMeta>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5" /> 12 collaborators
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <RefreshCw className="size-3.5" /> Updated 4 minutes ago
                </span>
                <Badge variant="secondary">production</Badge>
              </PageHeaderMeta>
            ) : null}
          </PageHeaderTitleArea>
        </PageHeaderTitleGroup>
        {showActions ? (
          <PageHeaderActions>
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              <Share2 />
              Share
            </Button>
            <Button size="sm" onClick={onPrimaryAction}>
              <Plus />
              New schema
            </Button>
          </PageHeaderActions>
        ) : null}
      </PageHeaderRow>
    </PageHeader>
  );
}

const meta = {
  title: "Components/PageHeader",
  component: PageHeaderExample,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: pageHeaderVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: pageHeaderSizeIds,
      control: { type: "radio" },
    },
    padded: { control: { type: "boolean" } },
    bordered: { control: { type: "boolean" } },
    showIcon: { control: { type: "boolean" } },
    showEyebrow: { control: { type: "boolean" } },
    showDescription: { control: { type: "boolean" } },
    showActions: { control: { type: "boolean" } },
    showMeta: { control: { type: "boolean" } },
    title: { control: { type: "text" } },
    description: { control: { type: "text" } },
    eyebrow: { control: { type: "text" } },
  },
  args: {
    variant: "default",
    size: "default",
    padded: false,
    bordered: false,
    showIcon: true,
    showEyebrow: false,
    showDescription: true,
    showActions: true,
    showMeta: false,
    title: "Customer schemas",
    description:
      "Browse, version, and share the data contracts your customer-facing services depend on.",
    eyebrow: "Vaults",
    onPrimaryAction: fn(),
    onSecondaryAction: fn(),
  },
} satisfies Meta<typeof PageHeaderExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Bordered: Story = {
  args: {
    bordered: true,
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
    padded: true,
    showEyebrow: true,
  },
};

export const Accent: Story = {
  args: {
    variant: "accent",
    padded: true,
    showEyebrow: true,
    eyebrow: "Onboarding",
    title: "Welcome to SchemaVaults",
    description:
      "Set up your first vault, invite collaborators, and start versioning the schemas your team relies on.",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    title: "API keys",
    description: "Manage credentials used by your services.",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    bordered: true,
    title: "Customer schemas",
    description:
      "Browse, version, and share the data contracts your customer-facing services depend on. Everything stays in sync with the registry.",
  },
};

export const WithoutIcon: Story = {
  args: {
    showIcon: false,
    bordered: true,
  },
};

export const WithoutActions: Story = {
  args: {
    showActions: false,
    bordered: true,
    title: "Audit log",
    description: "A read-only history of every change in this workspace.",
  },
};

export const TitleOnly: Story = {
  args: {
    showIcon: false,
    showDescription: false,
    showActions: false,
    title: "Settings",
  },
};

export const WithMeta: Story = {
  args: {
    bordered: true,
    showMeta: true,
    showEyebrow: true,
    eyebrow: "customers/acme-corp",
    title: "Acme Corp",
    description: "Customer-facing schemas managed by the platform team.",
  },
};

function WithBreadcrumbStory(): ReactElement {
  return (
    <PageHeader bordered>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Vaults</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Customers</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Acme Corp</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageHeaderRow>
        <PageHeaderTitleGroup>
          <PageHeaderIcon>
            <Database />
          </PageHeaderIcon>
          <PageHeaderTitleArea>
            <PageHeaderTitle>Acme Corp</PageHeaderTitle>
            <PageHeaderDescription>
              Customer-facing schemas for the Acme Corp integration. Changes
              here ripple out to every downstream consumer.
            </PageHeaderDescription>
          </PageHeaderTitleArea>
        </PageHeaderTitleGroup>
        <PageHeaderActions>
          <Button variant="outline" size="sm">
            <Download />
            Export
          </Button>
          <Button size="sm">
            <Plus />
            New schema
          </Button>
        </PageHeaderActions>
      </PageHeaderRow>
    </PageHeader>
  );
}

export const WithBreadcrumb: StoryObj = {
  render: (): ReactElement => <WithBreadcrumbStory />,
};

function SettingsHeaderStory(): ReactElement {
  return (
    <PageHeader variant="muted" padded size="default">
      <PageHeaderRow align="center">
        <PageHeaderTitleGroup>
          <PageHeaderIcon>
            <Settings />
          </PageHeaderIcon>
          <PageHeaderTitleArea>
            <PageHeaderEyebrow>Workspace</PageHeaderEyebrow>
            <PageHeaderTitle>General settings</PageHeaderTitle>
            <PageHeaderDescription>
              Configure your workspace name, default region, and contact
              preferences.
            </PageHeaderDescription>
          </PageHeaderTitleArea>
        </PageHeaderTitleGroup>
        <PageHeaderActions>
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button size="sm">Save changes</Button>
        </PageHeaderActions>
      </PageHeaderRow>
    </PageHeader>
  );
}

export const SettingsHeader: StoryObj = {
  render: (): ReactElement => <SettingsHeaderStory />,
};

function ApiKeysHeaderStory(): ReactElement {
  return (
    <PageHeader bordered>
      <PageHeaderRow>
        <PageHeaderTitleGroup>
          <PageHeaderIcon>
            <KeyRound />
          </PageHeaderIcon>
          <PageHeaderTitleArea>
            <PageHeaderTitle>API keys</PageHeaderTitle>
            <PageHeaderDescription>
              Long-lived credentials used by your services to authenticate with
              the SchemaVaults registry.
            </PageHeaderDescription>
            <PageHeaderMeta>
              <Badge variant="secondary">4 active</Badge>
              <span>Last rotated 12 days ago</span>
            </PageHeaderMeta>
          </PageHeaderTitleArea>
        </PageHeaderTitleGroup>
        <PageHeaderActions>
          <Button size="sm">
            <Plus />
            Create API key
          </Button>
        </PageHeaderActions>
      </PageHeaderRow>
    </PageHeader>
  );
}

export const ApiKeysExample: StoryObj = {
  render: (): ReactElement => <ApiKeysHeaderStory />,
};
