import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { Check, X } from "lucide-react";

import {
  DescriptionList,
  DescriptionItem,
  DescriptionTerm,
  DescriptionDetails,
  descriptionListLayoutIds,
  descriptionListSizeIds,
  descriptionListVariantIds,
  type DescriptionListLayoutId,
  type DescriptionListSizeId,
  type DescriptionListVariantId,
} from "./description-list";
import { Badge } from "../badge/badge";

interface DescriptionListExampleProps {
  layout?: DescriptionListLayoutId;
  size?: DescriptionListSizeId;
  variant?: DescriptionListVariantId;
  divided?: boolean;
  padded?: boolean;
}

function DescriptionListExample({
  layout = "responsive",
  size = "md",
  variant = "default",
  divided = true,
  padded,
}: DescriptionListExampleProps): ReactElement {
  return (
    <DescriptionList
      layout={layout}
      size={size}
      variant={variant}
      divided={divided}
      padded={padded}
    >
      <DescriptionItem layout={layout}>
        <DescriptionTerm>Name</DescriptionTerm>
        <DescriptionDetails>customer-events-v3</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem layout={layout}>
        <DescriptionTerm>Vault</DescriptionTerm>
        <DescriptionDetails>analytics-prod</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem layout={layout}>
        <DescriptionTerm>Created</DescriptionTerm>
        <DescriptionDetails>March 14, 2026 at 11:42 UTC</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem layout={layout}>
        <DescriptionTerm>Owner</DescriptionTerm>
        <DescriptionDetails>jalexwhitman@schemavaults.com</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem layout={layout}>
        <DescriptionTerm>Status</DescriptionTerm>
        <DescriptionDetails>
          <Badge variant="default">Published</Badge>
        </DescriptionDetails>
      </DescriptionItem>
    </DescriptionList>
  );
}

const meta = {
  title: "Components/DescriptionList",
  component: DescriptionListExample,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      options: descriptionListLayoutIds,
      control: { type: "radio" },
    },
    size: {
      options: descriptionListSizeIds,
      control: { type: "radio" },
    },
    variant: {
      options: descriptionListVariantIds,
      control: { type: "radio" },
    },
    divided: { control: { type: "boolean" } },
    padded: { control: { type: "boolean" } },
  },
  args: {
    layout: "responsive",
    size: "md",
    variant: "default",
    divided: true,
  },
} satisfies Meta<typeof DescriptionListExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Stacked: Story = {
  args: { layout: "stacked", divided: false },
};

export const Inline: Story = {
  args: { layout: "inline" },
};

export const Grid: Story = {
  args: { layout: "grid" },
};

export const Responsive: Story = {
  args: { layout: "responsive" },
};

export const Card: Story = {
  args: { variant: "card" },
};

export const Muted: Story = {
  args: { variant: "muted" },
};

export const Small: Story = {
  args: { size: "sm", variant: "card" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const NoDividers: Story = {
  args: { divided: false },
};

function LoadingExample(): ReactElement {
  return (
    <DescriptionList layout="responsive" variant="card" divided>
      <DescriptionItem layout="responsive">
        <DescriptionTerm>Name</DescriptionTerm>
        <DescriptionDetails>customer-events-v3</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem layout="responsive">
        <DescriptionTerm>Vault</DescriptionTerm>
        <DescriptionDetails loading />
      </DescriptionItem>
      <DescriptionItem layout="responsive">
        <DescriptionTerm>Created</DescriptionTerm>
        <DescriptionDetails loading />
      </DescriptionItem>
      <DescriptionItem layout="responsive">
        <DescriptionTerm>Owner</DescriptionTerm>
        <DescriptionDetails loading />
      </DescriptionItem>
    </DescriptionList>
  );
}

export const Loading: Story = {
  render: (): ReactElement => <LoadingExample />,
};

function SchemaFieldsExample(): ReactElement {
  return (
    <DescriptionList layout="responsive" variant="card" divided>
      <DescriptionItem layout="responsive">
        <DescriptionTerm>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            id
          </code>
        </DescriptionTerm>
        <DescriptionDetails>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">string</Badge>
              <Badge variant="default" className="gap-1">
                <Check className="size-3" />
                required
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Unique identifier for the event. Must be a UUID v4.
            </p>
          </div>
        </DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem layout="responsive">
        <DescriptionTerm>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            customer_id
          </code>
        </DescriptionTerm>
        <DescriptionDetails>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">string</Badge>
              <Badge variant="default" className="gap-1">
                <Check className="size-3" />
                required
              </Badge>
            </div>
            <p className="text-muted-foreground">
              External customer reference, scoped to the workspace.
            </p>
          </div>
        </DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem layout="responsive">
        <DescriptionTerm>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            occurred_at
          </code>
        </DescriptionTerm>
        <DescriptionDetails>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">date-time</Badge>
              <Badge variant="default" className="gap-1">
                <Check className="size-3" />
                required
              </Badge>
            </div>
            <p className="text-muted-foreground">
              ISO 8601 timestamp marking when the event occurred.
            </p>
          </div>
        </DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem layout="responsive">
        <DescriptionTerm>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            metadata
          </code>
        </DescriptionTerm>
        <DescriptionDetails>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">object</Badge>
              <Badge variant="secondary" className="gap-1">
                <X className="size-3" />
                optional
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Free-form key/value pairs attached to the event.
            </p>
          </div>
        </DescriptionDetails>
      </DescriptionItem>
    </DescriptionList>
  );
}

export const SchemaFields: Story = {
  render: (): ReactElement => <SchemaFieldsExample />,
};

function InlineKeyValueExample(): ReactElement {
  return (
    <DescriptionList layout="inline" variant="muted" divided>
      <DescriptionItem layout="inline">
        <DescriptionTerm>Region</DescriptionTerm>
        <DescriptionDetails>us-east-1</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem layout="inline">
        <DescriptionTerm>Plan</DescriptionTerm>
        <DescriptionDetails>Enterprise</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem layout="inline">
        <DescriptionTerm>Seats</DescriptionTerm>
        <DescriptionDetails>42 / 50</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem layout="inline">
        <DescriptionTerm>Next invoice</DescriptionTerm>
        <DescriptionDetails>July 1, 2026</DescriptionDetails>
      </DescriptionItem>
    </DescriptionList>
  );
}

export const InlineKeyValue: Story = {
  render: (): ReactElement => <InlineKeyValueExample />,
};
