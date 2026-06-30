import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import type { ReactElement } from "react";
import {
  ArrowLeft,
  Database,
  Download,
  Filter,
  GitBranch,
  KeyRound,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
  Users,
} from "lucide-react";

import {
  PageHeader,
  PageHeaderActions,
  PageHeaderBreadcrumb,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderIcon,
  PageHeaderMeta,
  PageHeaderTitle,
  PageHeaderToolbar,
  PageHeaderTop,
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
import { Input } from "../input/input";

interface PageHeaderExampleProps {
  variant?: PageHeaderVariantId;
  size?: PageHeaderSizeId;
  padded?: boolean;
  title?: string;
  description?: string;
  showBreadcrumb?: boolean;
  showIcon?: boolean;
  showMeta?: boolean;
  showActions?: boolean;
  showToolbar?: boolean;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

function PageHeaderExample({
  variant = "default",
  size = "md",
  padded = false,
  title = "Vaults",
  description = "Manage the schemas, secrets, and data contracts you share with your team. Changes here roll out to every connected environment immediately.",
  showBreadcrumb = true,
  showIcon = true,
  showMeta = true,
  showActions = true,
  showToolbar = false,
  primaryActionLabel = "Create vault",
  secondaryActionLabel = "Invite teammates",
  onPrimaryAction,
  onSecondaryAction,
}: PageHeaderExampleProps): ReactElement {
  return (
    <PageHeader variant={variant} size={size} padded={padded}>
      {showBreadcrumb ? (
        <PageHeaderBreadcrumb>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Workspaces</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Acme Inc.</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Vaults</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </PageHeaderBreadcrumb>
      ) : null}
      <PageHeaderTop>
        <PageHeaderHeading>
          {showIcon ? (
            <PageHeaderIcon variant={variant} size={size}>
              <Database />
            </PageHeaderIcon>
          ) : null}
          <PageHeaderContent>
            <PageHeaderTitle size={size}>{title}</PageHeaderTitle>
            {description ? (
              <PageHeaderDescription size={size}>
                {description}
              </PageHeaderDescription>
            ) : null}
            {showMeta ? (
              <PageHeaderMeta>
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3.5" />
                  12 members
                </span>
                <span className="inline-flex items-center gap-1">
                  <GitBranch className="size-3.5" />
                  main
                </span>
                <Badge variant="secondary">v2.4.1</Badge>
              </PageHeaderMeta>
            ) : null}
          </PageHeaderContent>
        </PageHeaderHeading>
        {showActions ? (
          <PageHeaderActions>
            {secondaryActionLabel ? (
              <Button variant="outline" onClick={onSecondaryAction}>
                <Share2 />
                {secondaryActionLabel}
              </Button>
            ) : null}
            <Button onClick={onPrimaryAction}>
              <Plus />
              {primaryActionLabel}
            </Button>
          </PageHeaderActions>
        ) : null}
      </PageHeaderTop>
      {showToolbar ? (
        <PageHeaderToolbar>
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search vaults" className="pl-8" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download />
              Export
            </Button>
          </div>
        </PageHeaderToolbar>
      ) : null}
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
    title: { control: { type: "text" } },
    description: { control: { type: "text" } },
    showBreadcrumb: { control: { type: "boolean" } },
    showIcon: { control: { type: "boolean" } },
    showMeta: { control: { type: "boolean" } },
    showActions: { control: { type: "boolean" } },
    showToolbar: { control: { type: "boolean" } },
    primaryActionLabel: { control: { type: "text" } },
    secondaryActionLabel: { control: { type: "text" } },
  },
  args: {
    variant: "default",
    size: "md",
    padded: false,
    title: "Vaults",
    description:
      "Manage the schemas, secrets, and data contracts you share with your team. Changes here roll out to every connected environment immediately.",
    showBreadcrumb: true,
    showIcon: true,
    showMeta: true,
    showActions: true,
    showToolbar: false,
    primaryActionLabel: "Create vault",
    secondaryActionLabel: "Invite teammates",
    onPrimaryAction: fn(),
    onSecondaryAction: fn(),
  },
} satisfies Meta<typeof PageHeaderExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Bordered: Story = {
  args: {
    variant: "bordered",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
    padded: true,
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    padded: true,
    title: "Welcome back, Alex",
    description:
      "Your workspace was upgraded to the Team plan. New collaboration features are now available.",
    showBreadcrumb: false,
    showMeta: false,
    primaryActionLabel: "Tour what's new",
    secondaryActionLabel: "Dismiss",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    title: "Members",
    description: "People with access to this vault.",
    showMeta: false,
    showBreadcrumb: false,
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    title: "API Keys",
    description:
      "Long-lived credentials that grant access to your vaults. Rotate keys regularly and never share them in public channels.",
    primaryActionLabel: "Generate key",
    secondaryActionLabel: "View docs",
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Settings",
    description: "",
    showBreadcrumb: false,
    showIcon: false,
    showMeta: false,
    showActions: false,
  },
};

export const NoIconNoBreadcrumb: Story = {
  args: {
    showBreadcrumb: false,
    showIcon: false,
  },
};

export const WithToolbar: Story = {
  args: {
    variant: "bordered",
    showToolbar: true,
  },
};

function BackNavExample(): ReactElement {
  return (
    <PageHeader variant="bordered" size="md">
      <PageHeaderBreadcrumb>
        <Button variant="ghost" size="sm" className="-ml-2 gap-1.5">
          <ArrowLeft className="size-4" />
          Back to vaults
        </Button>
      </PageHeaderBreadcrumb>
      <PageHeaderTop>
        <PageHeaderHeading>
          <PageHeaderIcon variant="primary">
            <KeyRound />
          </PageHeaderIcon>
          <PageHeaderContent>
            <div className="flex flex-wrap items-center gap-2">
              <PageHeaderTitle>production-secrets</PageHeaderTitle>
              <Badge variant="outline" className="gap-1">
                <Star className="size-3" />
                Pinned
              </Badge>
            </div>
            <PageHeaderDescription>
              Encrypted credentials for the production environment. Access is
              restricted to the SRE team.
            </PageHeaderDescription>
            <PageHeaderMeta>
              <span>Updated 3 hours ago</span>
              <span>by sam.chen@acme.com</span>
              <Badge variant="secondary">prod</Badge>
            </PageHeaderMeta>
          </PageHeaderContent>
        </PageHeaderHeading>
        <PageHeaderActions>
          <Button variant="outline">
            <Settings />
            Configure
          </Button>
          <Button>
            <Share2 />
            Share
          </Button>
        </PageHeaderActions>
      </PageHeaderTop>
    </PageHeader>
  );
}

export const DetailViewExample: StoryObj = {
  render: () => <BackNavExample />,
};

function StackedVariantsExample(): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      {pageHeaderVariantIds.map((variant) => (
        <PageHeader
          key={variant}
          variant={variant}
          size="md"
          padded={variant === "muted" || variant === "primary"}
        >
          <PageHeaderTop>
            <PageHeaderHeading>
              <PageHeaderIcon variant={variant}>
                <Database />
              </PageHeaderIcon>
              <PageHeaderContent>
                <PageHeaderTitle>
                  {variant.charAt(0).toUpperCase() + variant.slice(1)} variant
                </PageHeaderTitle>
                <PageHeaderDescription>
                  This page header uses the {`"`}
                  {variant}
                  {`"`} visual variant.
                </PageHeaderDescription>
              </PageHeaderContent>
            </PageHeaderHeading>
            <PageHeaderActions>
              <Button size="sm">Action</Button>
            </PageHeaderActions>
          </PageHeaderTop>
        </PageHeader>
      ))}
    </div>
  );
}

export const AllVariants: StoryObj = {
  render: () => <StackedVariantsExample />,
};
