import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { HttpMethodBadge } from "./http-method-badge";
import {
  httpMethodBadgeAppearanceIds,
  httpMethodBadgeSizeIds,
  httpMethodIds,
  type HttpMethod,
} from "./http-method-badge-variants";

const meta = {
  title: "Components/HttpMethodBadge",
  component: HttpMethodBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    method: {
      options: httpMethodIds,
      control: { type: "select" },
    },
    appearance: {
      options: httpMethodBadgeAppearanceIds,
      control: { type: "radio" },
    },
    size: {
      options: httpMethodBadgeSizeIds,
      control: { type: "radio" },
    },
    width: {
      options: ["auto", "fixed"],
      control: { type: "radio" },
    },
    label: {
      control: { type: "text" },
    },
  },
  args: {
    method: "GET",
    appearance: "soft",
    size: "md",
    width: "auto",
  },
} satisfies Meta<typeof HttpMethodBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Get: Story = {
  args: { method: "GET" },
};

export const Post: Story = {
  args: { method: "POST" },
};

export const Put: Story = {
  args: { method: "PUT" },
};

export const Patch: Story = {
  args: { method: "PATCH" },
};

export const Delete: Story = {
  args: { method: "DELETE" },
};

export const SolidAppearance: Story = {
  args: { method: "POST", appearance: "solid" },
};

export const OutlineAppearance: Story = {
  args: { method: "DELETE", appearance: "outline" },
};

export const AllMethods: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-3 p-4">
      {httpMethodBadgeAppearanceIds.map((appearance) => (
        <div key={appearance} className="flex items-center gap-3">
          <span className="w-16 text-xs text-muted-foreground capitalize">
            {appearance}
          </span>
          {httpMethodIds.map((method) => (
            <HttpMethodBadge
              key={method}
              method={method}
              appearance={appearance}
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
      {httpMethodBadgeSizeIds.map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-10 text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          {(["GET", "POST", "PUT", "PATCH", "DELETE"] satisfies HttpMethod[]).map(
            (method) => (
              <HttpMethodBadge key={method} method={method} size={size} />
            ),
          )}
        </div>
      ))}
    </div>
  ),
};

interface MockEndpoint {
  method: HttpMethod;
  path: string;
  description: string;
}

const mockEndpoints: MockEndpoint[] = [
  { method: "GET", path: "/api/v1/vaults", description: "List all vaults" },
  { method: "POST", path: "/api/v1/vaults", description: "Create a new vault" },
  {
    method: "GET",
    path: "/api/v1/vaults/{id}",
    description: "Retrieve a vault",
  },
  {
    method: "PUT",
    path: "/api/v1/vaults/{id}",
    description: "Replace a vault",
  },
  {
    method: "PATCH",
    path: "/api/v1/vaults/{id}",
    description: "Update vault fields",
  },
  {
    method: "DELETE",
    path: "/api/v1/vaults/{id}",
    description: "Delete a vault",
  },
  {
    method: "OPTIONS",
    path: "/api/v1/vaults",
    description: "Discover available verbs",
  },
  {
    method: "HEAD",
    path: "/api/v1/vaults/{id}",
    description: "Check vault existence",
  },
];

export const EndpointList: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-4 text-card-foreground">
      <h3 className="mb-3 text-sm font-semibold">API Endpoints</h3>
      <ul className="divide-y divide-border">
        {mockEndpoints.map((endpoint) => (
          <li
            key={`${endpoint.method}-${endpoint.path}`}
            className="flex items-center gap-3 py-2"
          >
            <HttpMethodBadge method={endpoint.method} width="fixed" size="sm" />
            <code className="font-mono text-sm">{endpoint.path}</code>
            <span className="ml-auto text-xs text-muted-foreground">
              {endpoint.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  ),
};

export const FixedWidthAlignment: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-1.5 p-4 font-mono text-sm">
      {(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] satisfies HttpMethod[]).map(
        (method) => (
          <div key={method} className="flex items-center gap-2">
            <HttpMethodBadge method={method} width="fixed" size="sm" />
            <span>/api/v1/resource</span>
          </div>
        ),
      )}
    </div>
  ),
};

export const InlineWithText: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <p className="max-w-md text-sm text-foreground leading-7">
      Send a <HttpMethodBadge method="POST" size="sm" /> request to{" "}
      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
        /api/v1/vaults
      </code>{" "}
      to create a new vault. Use <HttpMethodBadge method="PATCH" size="sm" /> to
      modify only specific fields without overwriting the entire resource.
    </p>
  ),
};

export const LowercaseInput: Story = {
  name: "Accepts lowercase input",
  args: {
    method: "get" as HttpMethod,
  },
};

export const CustomLabel: Story = {
  args: {
    method: "POST",
    label: "POST*",
  },
};
