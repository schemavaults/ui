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

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const DIALOG_OPTIONS: readonly MultiSelectOption[] = Array.from(
  { length: 14 },
  (_, index): MultiSelectOption => ({
    value: `resource-${index + 1}`,
    label: `Resource ${index + 1}`,
    description: `Long-lived resource number ${index + 1}`,
  }),
);

function InsideDialogDemo(): ReactElement {
  const [value, setValue] = useState<readonly string[]>([]);
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Edit resources</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit resources</DialogTitle>
          <DialogDescription>
            The option list must stay scrollable with a mouse wheel or
            trackpad even though the dialog locks page scrolling.
          </DialogDescription>
        </DialogHeader>
        <MultiSelect
          options={DIALOG_OPTIONS}
          value={value}
          onValueChange={setValue}
          fullWidth
          placeholder="Pick one or more resources..."
          searchPlaceholder="Search resources..."
          aria-label="Resources"
        />
        <p className="text-sm text-muted-foreground">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {value.length === 0 ? "—" : value.join(", ")}
          </span>
        </p>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Regression coverage for the dropdown being wheel-dead inside a modal
 * `Dialog`: the dialog's `react-remove-scroll` layer cancels wheel events
 * over portalled content, so a non-modal popover could only be scrolled with
 * the keyboard. A modal popover owns the innermost scroll lock and lets its
 * own list scroll.
 */
export const InsideDialog: Story = {
  render: () => <InsideDialogDemo />,
  play: async ({ step }) => {
    const body = within(document.body);
    const trigger = await body.findByRole("combobox", { name: /resources/i });

    await step("Open the dropdown inside the dialog", async () => {
      await userEvent.click(trigger);
    });

    // cmdk renders the scroll container (`[cmdk-list]`) as the listbox itself.
    const list = await waitFor(() => body.findByRole("listbox"));

    await waitFor(() => {
      expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
    });

    await step("Wheel events over the list are not cancelled", async () => {
      const wheelEvent = new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaY: 120,
      });
      list.dispatchEvent(wheelEvent);
      expect(wheelEvent.defaultPrevented).toBe(false);
    });

    await step("The list still scrolls programmatically", async () => {
      list.scrollTop = 120;
      await waitFor(() => {
        expect(list.scrollTop).toBeGreaterThan(0);
      });
    });

    await step("Typing in the search input still filters", async () => {
      const search = await body.findByPlaceholderText(/search resources/i);
      await userEvent.type(search, "Resource 12");
      await waitFor(() => {
        const options = within(list).getAllByRole("option");
        expect(options).toHaveLength(1);
      });
      await userEvent.clear(search);
    });

    await step("Clicking an option still toggles selection", async () => {
      const option = await within(list).findByRole("option", {
        name: /resource 3\b/i,
      });
      await userEvent.click(option);
      await waitFor(() => {
        expect(
          body.getByText(/resource-3/),
        ).toBeInTheDocument();
      });
    });

    await step("Escape closes the popover but not the dialog", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(body.queryByRole("listbox")).toBeNull();
      });
      expect(body.getByRole("dialog")).toBeInTheDocument();
    });
  },
};

/* -------------------------------------------------------------------------- */
/*                       Long label / overflow test fixtures                   */
/* -------------------------------------------------------------------------- */

/**
 * Deliberately unreasonable labels. `urn` is a single unbroken token (nothing
 * for the browser to wrap on) and `absurd` is longer than any realistic
 * viewport, so neither the trigger nor the dropdown can stay inside its layout
 * budget by accident — they have to truncate.
 */
const LONG_LABEL_OPTIONS: readonly MultiSelectOption[] = [
  {
    value: "short",
    label: "Short label",
    description: "A normal length label for comparison",
  },
  {
    value: "reconciliation",
    label:
      "Accounts receivable reconciliation and month-end close automation workflow",
    description:
      "Runs nightly against the production ledger and posts a summary to the finance channel",
    icon: <Layers className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "identity",
    label:
      "Customer identity and access management with SCIM provisioning enabled",
    icon: <Shield className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "urn",
    label:
      "urn:schemavaults:vault:production:us-east-1:0f3a9c7d-4b21-4d8e-9c6f-2a1b3c4d5e6f/rotation-policy",
    icon: <Lock className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "absurd",
    label:
      "This option label is intentionally absurd so that the component is forced to make a decision about horizontal overflow rather than quietly growing past the right hand edge of the container where nobody will ever be able to read the rest of the text anyway",
  },
] as const;

const LONG_LABEL_VALUES: readonly string[] = LONG_LABEL_OPTIONS.map(
  (option): string => option.value,
);

/** Every badge rendered inside the trigger. */
function getTriggerBadges(trigger: HTMLElement): HTMLElement[] {
  return Array.from(
    trigger.querySelectorAll<HTMLElement>('[data-slot="badge"]'),
  );
}

/** `child` may not stick out of `parent` on either horizontal edge. */
function expectHorizontallyContained(
  child: HTMLElement,
  parent: HTMLElement,
): void {
  const childRect: DOMRect = child.getBoundingClientRect();
  const parentRect: DOMRect = parent.getBoundingClientRect();
  expect(childRect.width).toBeGreaterThan(0);
  expect(childRect.left).toBeGreaterThanOrEqual(parentRect.left - 1);
  expect(childRect.right).toBeLessThanOrEqual(parentRect.right + 1);
}

/** Nothing may widen the document past the viewport. */
function expectNoDocumentOverflow(): void {
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    window.innerWidth + 1,
  );
}

/**
 * The trigger itself must never scroll horizontally: a long label is expected
 * to be ellipsised inside its badge, not clipped by (or spilled out of) the
 * trigger box.
 */
function expectTriggerFitsContainer(
  trigger: HTMLElement,
  container: HTMLElement,
): void {
  expectHorizontallyContained(trigger, container);
  expect(trigger.scrollWidth).toBeLessThanOrEqual(trigger.clientWidth + 1);
  for (const badge of getTriggerBadges(trigger)) {
    expectHorizontallyContained(badge, trigger);
  }
}

/**
 * `animate-in zoom-in-95` scales the popover while it opens, and a scaled box
 * reports scaled rects. Geometry is only meaningful once it has settled.
 */
async function waitForOpenAnimation(content: HTMLElement): Promise<void> {
  await waitFor((): void => {
    const transform: string = getComputedStyle(content).transform;
    expect(
      transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)",
    ).toBe(true);
  });
}

async function openLongLabelPopover(accessibleName: RegExp): Promise<{
  trigger: HTMLElement;
  listbox: HTMLElement;
  content: HTMLElement;
}> {
  const body = within(document.body);
  const trigger: HTMLElement = await body.findByRole("combobox", {
    name: accessibleName,
  });
  await userEvent.click(trigger);
  const listbox: HTMLElement = await waitFor(
    (): Promise<HTMLElement> => body.findByRole("listbox"),
  );
  const content: HTMLElement = listbox.closest<HTMLElement>(
    "[data-radix-popper-content-wrapper]",
  )?.firstElementChild as HTMLElement;
  expect(content).toBeTruthy();
  await waitForOpenAnimation(content);
  return { trigger, listbox, content };
}

function LongLabelsDemo({
  containerClassName = "w-[320px]",
  ...props
}: {
  containerClassName?: string;
} & Pick<
  DemoArgs,
  "size" | "maxDisplay" | "clearable" | "variant" | "badgeVariant"
> & {
    defaultSelected?: readonly string[];
    label?: string;
  }): ReactElement {
  const {
    size,
    maxDisplay,
    clearable = true,
    variant,
    badgeVariant,
    defaultSelected = ["absurd"],
    label = "Workflows",
  } = props;
  const [value, setValue] = useState<readonly string[]>(defaultSelected);
  return (
    <div
      className={cn(
        "rounded-md border border-dashed border-muted-foreground/40 p-4",
        containerClassName,
      )}
    >
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <MultiSelect
        options={LONG_LABEL_OPTIONS}
        value={value}
        onValueChange={setValue}
        variant={variant}
        size={size}
        badgeVariant={badgeVariant}
        maxDisplay={maxDisplay}
        clearable={clearable}
        fullWidth
        placeholder="Select one or more workflows..."
        searchPlaceholder="Search workflows..."
        aria-label="Workflows"
      />
      <p className="mt-3 truncate text-xs text-muted-foreground">
        Selected: {value.length === 0 ? "—" : value.join(", ")}
      </p>
    </div>
  );
}

/**
 * The dashed box is the layout budget the `MultiSelect` is allowed to use.
 * Neither the trigger, its badges, nor the dropdown may grow past it
 * horizontally, no matter how long an option label gets.
 */
export const LongOptionLabels: Story = {
  render: (): ReactElement => <LongLabelsDemo />,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Long, unbroken and absurdly long option labels. Badges in the trigger ellipsise instead of stretching it, and the dropdown is pinned to the trigger width.",
      },
    },
  },
  play: async ({ step }): Promise<void> => {
    const body = within(document.body);
    const trigger: HTMLElement = await body.findByRole("combobox", {
      name: /workflows/i,
    });
    const container: HTMLElement = trigger.parentElement as HTMLElement;

    await step("Trigger stays inside its container", async (): Promise<void> => {
      await waitFor((): void => {
        expectTriggerFitsContainer(trigger, container);
      });
      expectNoDocumentOverflow();
    });

    await step("The long badge label is ellipsised", async (): Promise<void> => {
      const [badge] = getTriggerBadges(trigger);
      expect(badge).toBeDefined();
      const labelSpan: HTMLElement = badge.querySelector<HTMLElement>(
        "span.truncate",
      ) as HTMLElement;
      expect(labelSpan).not.toBeNull();
      // Truncated, i.e. more text than fits — but not spilling out of the badge.
      expect(labelSpan.scrollWidth).toBeGreaterThan(labelSpan.clientWidth);
      expect(getComputedStyle(labelSpan).textOverflow).toBe("ellipsis");
      expectHorizontallyContained(labelSpan, badge);
    });

    await step(
      "The remove control survives next to a long label",
      async (): Promise<void> => {
        const remove: HTMLElement = within(trigger).getByRole("button", {
          name: /^remove this option label is intentionally absurd/i,
        });
        expectHorizontallyContained(remove, trigger);
        expect(remove.getBoundingClientRect().width).toBeGreaterThanOrEqual(10);
      },
    );

    const { listbox, content } = await openLongLabelPopover(/workflows/i);

    await step("The dropdown stays on screen", async (): Promise<void> => {
      const contentRect: DOMRect = content.getBoundingClientRect();
      const triggerRect: DOMRect = trigger.getBoundingClientRect();
      // `w-[var(--radix-popover-trigger-width)]` keeps the two in lockstep.
      expect(
        Math.abs(contentRect.width - triggerRect.width),
      ).toBeLessThanOrEqual(1);
      expect(contentRect.left).toBeGreaterThanOrEqual(-1);
      expect(contentRect.right).toBeLessThanOrEqual(window.innerWidth + 1);
      expectNoDocumentOverflow();
    });

    await step(
      "Option rows truncate rather than widening the list",
      async (): Promise<void> => {
        const options: HTMLElement[] = within(listbox).getAllByRole("option");
        expect(options.length).toBeGreaterThanOrEqual(
          LONG_LABEL_OPTIONS.length,
        );
        expect(listbox.scrollWidth).toBeLessThanOrEqual(
          listbox.clientWidth + 1,
        );
        for (const option of options) {
          expectHorizontallyContained(option, listbox);
          expect(option.scrollWidth).toBeLessThanOrEqual(
            option.clientWidth + 1,
          );
        }
      },
    );

    await step(
      "Filtered rows do not overflow either",
      async (): Promise<void> => {
        const search: HTMLElement = await body.findByPlaceholderText(
          /search workflows/i,
        );
        await userEvent.type(search, "identity");
        await waitFor((): void => {
          // cmdk scores fuzzily, so assert on narrowing rather than an exact
          // count: the SCIM row survives and something is filtered out.
          const filtered: HTMLElement[] = within(listbox).getAllByRole(
            "option",
          );
          expect(filtered.length).toBeLessThan(LONG_LABEL_OPTIONS.length);
          expect(
            within(listbox).getByText(/SCIM provisioning enabled/),
          ).toBeInTheDocument();
        });
        for (const option of within(listbox).getAllByRole("option")) {
          expectHorizontallyContained(option, listbox);
        }
        expect(listbox.scrollWidth).toBeLessThanOrEqual(
          listbox.clientWidth + 1,
        );
        await userEvent.clear(search);
      },
    );

    await userEvent.keyboard("{Escape}");
    await waitFor((): void => {
      expect(body.queryByRole("listbox")).toBeNull();
    });
  },
};

/**
 * Every long option selected at once. The badges wrap onto new rows and grow
 * the trigger vertically; the trigger must not grow horizontally.
 */
export const LongLabelsAllSelected: Story = {
  render: (): ReactElement => (
    <LongLabelsDemo defaultSelected={LONG_LABEL_VALUES} />
  ),
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Every long label selected at once: badges wrap onto additional rows instead of pushing the trigger sideways.",
      },
    },
  },
  play: async (): Promise<void> => {
    const body = within(document.body);
    const trigger: HTMLElement = await body.findByRole("combobox", {
      name: /workflows/i,
    });
    const container: HTMLElement = trigger.parentElement as HTMLElement;

    await waitFor((): void => {
      expectTriggerFitsContainer(trigger, container);
    });
    expectNoDocumentOverflow();

    const badges: HTMLElement[] = getTriggerBadges(trigger);
    expect(badges).toHaveLength(LONG_LABEL_OPTIONS.length);
    // Wrapped, not laid out on a single overflowing row.
    const distinctRows: Set<number> = new Set(
      badges.map((badge: HTMLElement): number =>
        Math.round(badge.getBoundingClientRect().top),
      ),
    );
    expect(distinctRows.size).toBeGreaterThan(1);
  },
};

/**
 * A long badge next to the `+N more` overflow chip: the chip must stay visible
 * and readable even though the first badge alone would fill the trigger.
 */
export const LongLabelsWithMaxDisplay: Story = {
  render: (): ReactElement => (
    <LongLabelsDemo defaultSelected={LONG_LABEL_VALUES} maxDisplay={1} />
  ),
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "`maxDisplay` collapses the rest into a `+N more` chip, which must not be pushed out of the trigger by the long badge in front of it.",
      },
    },
  },
  play: async (): Promise<void> => {
    const body = within(document.body);
    const trigger: HTMLElement = await body.findByRole("combobox", {
      name: /workflows/i,
    });
    const container: HTMLElement = trigger.parentElement as HTMLElement;

    await waitFor((): void => {
      expectTriggerFitsContainer(trigger, container);
    });
    expectNoDocumentOverflow();

    const overflowChip: HTMLElement = within(trigger).getByText(
      `+${LONG_LABEL_OPTIONS.length - 1} more`,
    );
    expectHorizontallyContained(overflowChip, trigger);
    // The chip is never itself ellipsised away.
    expect(overflowChip.scrollWidth).toBeLessThanOrEqual(
      overflowChip.clientWidth + 1,
    );
  },
};

/**
 * The hostile case: the smallest size in a container barely wider than the
 * chevron. Everything still has to stay inside the dashed box.
 */
export const LongLabelsInNarrowContainer: Story = {
  render: (): ReactElement => (
    <LongLabelsDemo
      containerClassName="w-[180px]"
      size="sm"
      defaultSelected={["urn", "reconciliation"]}
    />
  ),
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "A 180px column with `size=\"sm\"`. Unbroken identifiers still truncate instead of blowing out the layout.",
      },
    },
  },
  play: async ({ step }): Promise<void> => {
    const body = within(document.body);
    const trigger: HTMLElement = await body.findByRole("combobox", {
      name: /workflows/i,
    });
    const container: HTMLElement = trigger.parentElement as HTMLElement;

    await step("Trigger stays inside a 180px column", async (): Promise<void> => {
      await waitFor((): void => {
        expectTriggerFitsContainer(trigger, container);
      });
      expectNoDocumentOverflow();
    });

    const { listbox, content } = await openLongLabelPopover(/workflows/i);

    await step(
      "The dropdown widens to its minimum but stays on screen",
      async (): Promise<void> => {
        // `min-w-[12rem]` wins over the (narrower) trigger width here, which is
        // fine — what matters is that it does not run off the viewport.
        const contentRect: DOMRect = content.getBoundingClientRect();
        expect(contentRect.width).toBeGreaterThanOrEqual(
          trigger.getBoundingClientRect().width,
        );
        expect(contentRect.left).toBeGreaterThanOrEqual(-1);
        expect(contentRect.right).toBeLessThanOrEqual(window.innerWidth + 1);
        expect(listbox.scrollWidth).toBeLessThanOrEqual(
          listbox.clientWidth + 1,
        );
        for (const option of within(listbox).getAllByRole("option")) {
          expectHorizontallyContained(option, listbox);
        }
        expectNoDocumentOverflow();
      },
    );

    await userEvent.keyboard("{Escape}");
  },
};
