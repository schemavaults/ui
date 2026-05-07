import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import {
  Box,
  Database,
  Globe,
  Key,
  Layers,
  Lock,
  Server,
  Shield,
  Table as TableIcon,
} from "lucide-react";

import {
  Combobox,
  comboboxSizeIds,
  comboboxVariantIds,
  type ComboboxOption,
} from "./combobox";

const FRAMEWORK_OPTIONS: readonly ComboboxOption[] = [
  { value: "next", label: "Next.js", keywords: ["react", "vercel"] },
  { value: "remix", label: "Remix", keywords: ["react"] },
  { value: "astro", label: "Astro", keywords: ["islands", "static"] },
  { value: "sveltekit", label: "SvelteKit", keywords: ["svelte"] },
  { value: "nuxt", label: "Nuxt", keywords: ["vue"] },
  { value: "solid-start", label: "SolidStart", keywords: ["solid"] },
  { value: "qwik-city", label: "Qwik City", keywords: ["qwik"] },
] as const;

interface DemoArgs {
  variant?: (typeof comboboxVariantIds)[number];
  size?: (typeof comboboxSizeIds)[number];
  fullWidth?: boolean;
  disabled?: boolean;
  clearable?: boolean;
}

function FrameworkComboboxDemo({
  variant,
  size,
  fullWidth,
  disabled,
  clearable,
}: DemoArgs): ReactElement {
  const [value, setValue] = useState<string>("");
  return (
    <div className="w-[320px]">
      <Combobox
        options={FRAMEWORK_OPTIONS}
        value={value}
        onValueChange={setValue}
        variant={variant}
        size={size}
        fullWidth={fullWidth ?? true}
        disabled={disabled}
        clearable={clearable}
        placeholder="Pick a framework..."
        searchPlaceholder="Search frameworks..."
        aria-label="Framework"
      />
      <p className="mt-3 text-sm text-muted-foreground">
        Selected:{" "}
        <span className="font-medium text-foreground">
          {value === "" ? "—" : value}
        </span>
      </p>
    </div>
  );
}

const meta = {
  title: "Components/Combobox",
  component: FrameworkComboboxDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: comboboxVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: comboboxSizeIds,
      control: { type: "radio" },
    },
    fullWidth: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    clearable: { control: { type: "boolean" } },
  },
  args: {
    variant: "default",
    size: "default",
    fullWidth: true,
    disabled: false,
    clearable: false,
  },
} satisfies Meta<typeof FrameworkComboboxDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OutlineVariant: Story = {
  args: { variant: "outline" },
};

export const GhostVariant: Story = {
  args: { variant: "ghost" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Clearable: Story = {
  args: { clearable: true },
};

const SCHEMA_RESOURCE_OPTIONS: readonly ComboboxOption[] = [
  {
    value: "users",
    label: "users",
    description: "Application user records",
    icon: <TableIcon className="h-4 w-4 text-muted-foreground" />,
    keywords: ["accounts", "people"],
  },
  {
    value: "organizations",
    label: "organizations",
    description: "Tenant organizations",
    icon: <TableIcon className="h-4 w-4 text-muted-foreground" />,
    keywords: ["orgs", "tenants"],
  },
  {
    value: "schemas",
    label: "schemas",
    description: "Stored JSON schemas",
    icon: <Layers className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "vaults",
    label: "vaults",
    description: "Encrypted secret containers",
    icon: <Lock className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "api_keys",
    label: "api_keys",
    description: "Programmatic access tokens",
    icon: <Key className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "audit_logs",
    label: "audit_logs",
    description: "Immutable audit trail",
    icon: <Shield className="h-4 w-4 text-muted-foreground" />,
    disabled: true,
  },
] as const;

function SchemaResourceDemo(): ReactElement {
  const [value, setValue] = useState<string>("schemas");
  return (
    <div className="w-[360px]">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Resource table
      </span>
      <Combobox
        options={SCHEMA_RESOURCE_OPTIONS}
        value={value}
        onValueChange={setValue}
        fullWidth
        clearable
        placeholder="Select a table..."
        searchPlaceholder="Search tables..."
        emptyMessage="No tables match your query."
        aria-label="Resource table"
      />
    </div>
  );
}

export const WithIconsAndDescriptions: Story = {
  render: () => <SchemaResourceDemo />,
};

const REGION_OPTIONS: readonly ComboboxOption[] = [
  {
    value: "us-east-1",
    label: "US East (N. Virginia)",
    icon: <Globe className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "us-west-2",
    label: "US West (Oregon)",
    icon: <Globe className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "eu-west-1",
    label: "EU (Ireland)",
    icon: <Globe className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "ap-southeast-1",
    label: "Asia Pacific (Singapore)",
    icon: <Globe className="h-4 w-4 text-muted-foreground" />,
  },
] as const;

const PROVIDER_OPTIONS: readonly ComboboxOption[] = [
  {
    value: "postgres",
    label: "PostgreSQL",
    icon: <Database className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "mysql",
    label: "MySQL",
    icon: <Database className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "sqlite",
    label: "SQLite",
    icon: <Database className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "redis",
    label: "Redis",
    icon: <Server className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "s3",
    label: "S3",
    icon: <Box className="h-4 w-4 text-muted-foreground" />,
  },
] as const;

function MultipleComboboxesDemo(): ReactElement {
  const [provider, setProvider] = useState<string>("postgres");
  const [region, setRegion] = useState<string>("us-east-1");
  return (
    <div className="grid w-[420px] gap-4">
      <div>
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Provider
        </span>
        <Combobox
          options={PROVIDER_OPTIONS}
          value={provider}
          onValueChange={setProvider}
          fullWidth
          aria-label="Provider"
        />
      </div>
      <div>
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Region
        </span>
        <Combobox
          options={REGION_OPTIONS}
          value={region}
          onValueChange={setRegion}
          fullWidth
          aria-label="Region"
        />
      </div>
    </div>
  );
}

export const FormFieldStack: Story = {
  render: () => <MultipleComboboxesDemo />,
};

function AllVariantsDemo(): ReactElement {
  const [value, setValue] = useState<string>("next");
  return (
    <div className="grid w-[320px] gap-6">
      {comboboxVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          <Combobox
            options={FRAMEWORK_OPTIONS}
            value={value}
            onValueChange={setValue}
            variant={variant}
            fullWidth
            aria-label={`${variant} combobox`}
          />
        </div>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  render: () => <AllVariantsDemo />,
};

function UncontrolledDemo(): ReactElement {
  return (
    <div className="w-[320px]">
      <Combobox
        options={FRAMEWORK_OPTIONS}
        defaultValue="astro"
        fullWidth
        aria-label="Framework"
      />
    </div>
  );
}

export const Uncontrolled: Story = {
  render: () => <UncontrolledDemo />,
};
