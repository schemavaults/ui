import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
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
  MultiSelect,
  multiSelectBadgeVariantIds,
  multiSelectSizeIds,
  multiSelectVariantIds,
  type MultiSelectOption,
} from "./multi-select";

const FRAMEWORK_OPTIONS: readonly MultiSelectOption[] = [
  { value: "next", label: "Next.js", keywords: ["react", "vercel"] },
  { value: "remix", label: "Remix", keywords: ["react"] },
  { value: "astro", label: "Astro", keywords: ["islands", "static"] },
  { value: "sveltekit", label: "SvelteKit", keywords: ["svelte"] },
  { value: "nuxt", label: "Nuxt", keywords: ["vue"] },
  { value: "solid-start", label: "SolidStart", keywords: ["solid"] },
  { value: "qwik-city", label: "Qwik City", keywords: ["qwik"] },
] as const;

interface DemoArgs {
  variant?: (typeof multiSelectVariantIds)[number];
  size?: (typeof multiSelectSizeIds)[number];
  badgeVariant?: (typeof multiSelectBadgeVariantIds)[number];
  fullWidth?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  closeOnSelect?: boolean;
  maxDisplay?: number;
  maxSelected?: number;
  onValueChange?: (next: readonly string[]) => void;
}

function FrameworkMultiSelectDemo({
  variant,
  size,
  badgeVariant,
  fullWidth,
  disabled,
  clearable,
  closeOnSelect,
  maxDisplay,
  maxSelected,
  onValueChange,
}: DemoArgs): ReactElement {
  const [value, setValue] = useState<readonly string[]>(["next", "astro"]);
  return (
    <div className="w-[360px]">
      <MultiSelect
        options={FRAMEWORK_OPTIONS}
        value={value}
        onValueChange={(next): void => {
          setValue(next);
          onValueChange?.(next);
        }}
        variant={variant}
        size={size}
        badgeVariant={badgeVariant}
        fullWidth={fullWidth ?? true}
        disabled={disabled}
        clearable={clearable}
        closeOnSelect={closeOnSelect}
        maxDisplay={maxDisplay}
        maxSelected={maxSelected}
        placeholder="Pick one or more frameworks..."
        searchPlaceholder="Search frameworks..."
        aria-label="Frameworks"
      />
      <p className="mt-3 text-sm text-muted-foreground">
        Selected:{" "}
        <span className="font-medium text-foreground">
          {value.length === 0 ? "—" : value.join(", ")}
        </span>
      </p>
    </div>
  );
}

const meta = {
  title: "Components/MultiSelect",
  component: FrameworkMultiSelectDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: multiSelectVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: multiSelectSizeIds,
      control: { type: "radio" },
    },
    badgeVariant: {
      options: multiSelectBadgeVariantIds,
      control: { type: "radio" },
    },
    fullWidth: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    clearable: { control: { type: "boolean" } },
    closeOnSelect: { control: { type: "boolean" } },
    maxDisplay: { control: { type: "number", min: 1, max: 8, step: 1 } },
    maxSelected: { control: { type: "number", min: 1, max: 7, step: 1 } },
  },
  args: {
    variant: "default",
    size: "default",
    badgeVariant: "secondary",
    fullWidth: true,
    disabled: false,
    clearable: true,
    closeOnSelect: false,
  },
} satisfies Meta<typeof FrameworkMultiSelectDemo>;

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

export const WithMaxDisplay: Story = {
  args: { maxDisplay: 2 },
  parameters: {
    docs: {
      description: {
        story:
          "Cap how many badges render in the trigger; the rest collapse into a `+N more` overflow chip.",
      },
    },
  },
};

export const WithMaxSelected: Story = {
  args: { maxSelected: 3, clearable: true },
  parameters: {
    docs: {
      description: {
        story:
          "Block further selections once the limit is reached. A counter renders in the popover footer.",
      },
    },
  },
};

export const ClosesOnSelect: Story = {
  args: { closeOnSelect: true },
  parameters: {
    docs: {
      description: {
        story:
          "Auto-close the popover after each pick. Useful for single-shot edits in tight layouts.",
      },
    },
  },
};

const SCHEMA_RESOURCE_OPTIONS: readonly MultiSelectOption[] = [
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
  const [value, setValue] = useState<readonly string[]>([
    "schemas",
    "vaults",
  ]);
  return (
    <div className="w-[420px]">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Visible resource tables
      </span>
      <MultiSelect
        options={SCHEMA_RESOURCE_OPTIONS}
        value={value}
        onValueChange={setValue}
        fullWidth
        clearable
        placeholder="Select tables to expose..."
        searchPlaceholder="Search tables..."
        emptyMessage="No tables match your query."
        aria-label="Resource tables"
      />
    </div>
  );
}

export const WithIconsAndDescriptions: Story = {
  render: () => <SchemaResourceDemo />,
};

const REGION_OPTIONS: readonly MultiSelectOption[] = [
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

const PROVIDER_OPTIONS: readonly MultiSelectOption[] = [
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

function ReplicationTargetsDemo(): ReactElement {
  const [regions, setRegions] = useState<readonly string[]>([
    "us-east-1",
    "eu-west-1",
  ]);
  const [providers, setProviders] = useState<readonly string[]>(["postgres"]);
  return (
    <div className="grid w-[460px] gap-4">
      <div>
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Replicate to regions
        </span>
        <MultiSelect
          options={REGION_OPTIONS}
          value={regions}
          onValueChange={setRegions}
          fullWidth
          clearable
          maxSelected={3}
          placeholder="Pick replication targets..."
          aria-label="Regions"
        />
      </div>
      <div>
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Engines
        </span>
        <MultiSelect
          options={PROVIDER_OPTIONS}
          value={providers}
          onValueChange={setProviders}
          fullWidth
          clearable
          maxDisplay={2}
          placeholder="Pick engines..."
          aria-label="Providers"
        />
      </div>
    </div>
  );
}

export const FormFieldStack: Story = {
  render: () => <ReplicationTargetsDemo />,
};

function AllVariantsDemo(): ReactElement {
  const [value, setValue] = useState<readonly string[]>(["next", "remix"]);
  return (
    <div className="grid w-[360px] gap-6">
      {multiSelectVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          <MultiSelect
            options={FRAMEWORK_OPTIONS}
            value={value}
            onValueChange={setValue}
            variant={variant}
            fullWidth
            clearable
            aria-label={`${variant} multi-select`}
          />
        </div>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  render: () => <AllVariantsDemo />,
};

function AllBadgeVariantsDemo(): ReactElement {
  const [value, setValue] = useState<readonly string[]>([
    "next",
    "remix",
    "astro",
  ]);
  return (
    <div className="grid w-[360px] gap-6">
      {multiSelectBadgeVariantIds.map((badgeVariant) => (
        <div key={badgeVariant} className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            badge: {badgeVariant}
          </span>
          <MultiSelect
            options={FRAMEWORK_OPTIONS}
            value={value}
            onValueChange={setValue}
            badgeVariant={badgeVariant}
            fullWidth
            clearable
            aria-label={`${badgeVariant} badge multi-select`}
          />
        </div>
      ))}
    </div>
  );
}

export const AllBadgeVariants: Story = {
  render: () => <AllBadgeVariantsDemo />,
};

function UncontrolledDemo(): ReactElement {
  return (
    <div className="w-[360px]">
      <MultiSelect
        options={FRAMEWORK_OPTIONS}
        defaultValue={["astro"]}
        fullWidth
        clearable
        aria-label="Frameworks"
      />
    </div>
  );
}

export const Uncontrolled: Story = {
  render: () => <UncontrolledDemo />,
};

export const InteractionTogglesSelection: Story = {
  args: {
    onValueChange: fn(),
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole("combobox", {
      name: /frameworks/i,
    });

    await step("Open the popover", async () => {
      await userEvent.click(trigger);
    });

    const listbox = await waitFor(() =>
      within(document.body).findByRole("listbox"),
    );
    const remixOption = await within(listbox).findByRole("option", {
      name: /remix/i,
    });

    await step("Select 'Remix'", async () => {
      await userEvent.click(remixOption);
    });

    await waitFor(() => {
      const onChange = args.onValueChange as ReturnType<typeof fn>;
      expect(onChange).toHaveBeenCalled();
      const lastCall = onChange.mock.calls.at(-1);
      expect(lastCall?.[0]).toEqual(
        expect.arrayContaining(["next", "astro", "remix"]),
      );
    });

    await step("Toggle 'Remix' off again", async () => {
      const remixAgain = await within(
        await within(document.body).findByRole("listbox"),
      ).findByRole("option", { name: /remix/i });
      await userEvent.click(remixAgain);
    });

    await waitFor(() => {
      const onChange = args.onValueChange as ReturnType<typeof fn>;
      const lastCall = onChange.mock.calls.at(-1);
      expect(lastCall?.[0]).not.toContain("remix");
    });
  },
};
