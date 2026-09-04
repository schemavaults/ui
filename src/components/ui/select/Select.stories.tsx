import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { useState, type ReactElement } from "react";
import { Globe, Layers, Lock, Server } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

function SelectDemo(): ReactElement {
  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
          <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
          <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe & Africa</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
          <SelectItem value="west">
            Western European Summer Time (WEST)
          </SelectItem>
          <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
          <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
          <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
          <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
          <SelectItem value="ist_indonesia">
            Indonesia Central Standard Time (WITA)
          </SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Australia & Pacific</SelectLabel>
          <SelectItem value="awst">
            Australian Western Standard Time (AWST)
          </SelectItem>
          <SelectItem value="acst">
            Australian Central Standard Time (ACST)
          </SelectItem>
          <SelectItem value="aest">
            Australian Eastern Standard Time (AEST)
          </SelectItem>
          <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
          <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>South America</SelectLabel>
          <SelectItem value="art">Argentina Time (ART)</SelectItem>
          <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
          <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
          <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Select",
  component: SelectDemo,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof SelectDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const SelectExample: Story = {
  args: {},
};

/* -------------------------------------------------------------------------- */
/*                            Overflow test fixtures                           */
/* -------------------------------------------------------------------------- */

interface LongOption {
  readonly value: string;
  readonly label: string;
}

/**
 * Deliberately unreasonable labels. The last entry is longer than any realistic
 * viewport so the dropdown cannot simply be nudged back on-screen by the popper
 * collision handling — it has to be width-capped.
 */
const LONG_OPTIONS: readonly LongOption[] = [
  {
    value: "short",
    label: "Short label",
  },
  {
    value: "invoice-reconciliation",
    label:
      "Accounts receivable reconciliation and month-end close automation workflow",
  },
  {
    value: "customer-identity",
    label:
      "Customer identity and access management with SCIM provisioning enabled",
  },
  {
    value: "unbroken-identifier",
    label:
      "urn:schemavaults:vault:production:us-east-1:0f3a9c7d-4b21-4d8e-9c6f-2a1b3c4d5e6f/rotation-policy",
  },
  {
    value: "absurdly-long",
    label:
      "This option label is intentionally absurd so that the dropdown is forced to make a decision about horizontal overflow rather than quietly growing past the right hand edge of the browser window where nobody will ever be able to read the rest of the text anyway",
  },
] as const;

function LongOptionList(): ReactElement {
  return (
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Workflows</SelectLabel>
        {LONG_OPTIONS.map((option): ReactElement => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  );
}

/** Nothing anywhere on the page may spill outside the visible viewport. */
async function expectNoHorizontalOverflow(element: HTMLElement): Promise<void> {
  await waitFor((): void => {
    const rect: DOMRect = element.getBoundingClientRect();
    expect(rect.left).toBeGreaterThanOrEqual(-1);
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth + 1);
    // `scrollWidth > clientWidth` means content is being cut off horizontally.
    expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth + 1);
  });
}

async function openSelect(accessibleName: RegExp): Promise<HTMLElement> {
  const body = within(document.body);
  const trigger: HTMLElement = await body.findByRole("combobox", {
    name: accessibleName,
  });
  await userEvent.click(trigger);
  return await waitFor((): HTMLElement => {
    const content: HTMLElement | null = document.querySelector<HTMLElement>(
      '[data-slot="select-content"]',
    );
    expect(content).not.toBeNull();
    return content as HTMLElement;
  });
}

/* -------------------------------------------------------------------------- */
/*                                   Stories                                   */
/* -------------------------------------------------------------------------- */

function LongLabelsDemo(): ReactElement {
  const [value, setValue] = useState<string>("");
  return (
    <div className="w-[320px] rounded-md border border-dashed border-muted-foreground/40 p-4">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Workflow
      </span>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-full" aria-label="Workflow">
          <SelectValue placeholder="Select a workflow" />
        </SelectTrigger>
        <LongOptionList />
      </Select>
      <p className="mt-3 truncate text-xs text-muted-foreground">
        Selected: {value === "" ? "—" : value}
      </p>
    </div>
  );
}

/**
 * The dashed box is the layout budget the `Select` is allowed to use. Neither
 * the trigger nor the dropdown may grow past it horizontally, no matter how
 * long an option label gets.
 */
export const LongOptionLabels: Story = {
  render: (): ReactElement => <LongLabelsDemo />,
  parameters: { layout: "centered" },
  play: async ({ step }): Promise<void> => {
    const body = within(document.body);
    const trigger: HTMLElement = await body.findByRole("combobox", {
      name: /workflow/i,
    });
    const container: HTMLElement = trigger.parentElement as HTMLElement;

    await step(
      "Trigger stays inside its container",
      async (): Promise<void> => {
        const triggerRect: DOMRect = trigger.getBoundingClientRect();
        const containerRect: DOMRect = container.getBoundingClientRect();
        expect(triggerRect.width).toBeLessThanOrEqual(containerRect.width + 1);
        expect(triggerRect.right).toBeLessThanOrEqual(containerRect.right + 1);
      },
    );

    const content: HTMLElement = await openSelect(/workflow/i);

    await step("Dropdown stays on screen", async (): Promise<void> => {
      await expectNoHorizontalOverflow(content);
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        window.innerWidth + 1,
      );
    });

    await step(
      "Long option labels wrap, they are not clipped",
      async (): Promise<void> => {
        const items: HTMLElement[] = Array.from(
          content.querySelectorAll<HTMLElement>('[data-slot="select-item"]'),
        );
        expect(items.length).toBe(LONG_OPTIONS.length);
        for (const item of items) {
          expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth + 1);
        }
        // The absurd label has to occupy more than one line somewhere.
        const tallest: number = Math.max(
          ...items.map((item: HTMLElement): number => item.clientHeight),
        );
        const shortest: number = Math.min(
          ...items.map((item: HTMLElement): number => item.clientHeight),
        );
        expect(tallest).toBeGreaterThan(shortest);
      },
    );

    await userEvent.keyboard("{Escape}");
  },
};

function TruncatedValueDemo(): ReactElement {
  return (
    <div className="w-[260px] rounded-md border border-dashed border-muted-foreground/40 p-4">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Workflow
      </span>
      <Select defaultValue="absurdly-long">
        <SelectTrigger className="w-full" aria-label="Selected workflow">
          <SelectValue placeholder="Select a workflow" />
        </SelectTrigger>
        <LongOptionList />
      </Select>
    </div>
  );
}

/**
 * A selected value that is far too long for the trigger is truncated with an
 * ellipsis instead of stretching the trigger past its container.
 */
export const TruncatedSelectedValue: Story = {
  render: (): ReactElement => <TruncatedValueDemo />,
  parameters: { layout: "centered" },
  play: async ({ step }): Promise<void> => {
    const body = within(document.body);
    const trigger: HTMLElement = await body.findByRole("combobox", {
      name: /selected workflow/i,
    });
    const container: HTMLElement = trigger.parentElement as HTMLElement;
    const value: HTMLElement = trigger.querySelector<HTMLElement>(
      '[data-slot="select-value"]',
    ) as HTMLElement;

    await step("Trigger does not stretch", async (): Promise<void> => {
      expect(trigger.getBoundingClientRect().width).toBeLessThanOrEqual(
        container.getBoundingClientRect().width + 1,
      );
      expect(trigger.scrollWidth).toBeLessThanOrEqual(trigger.clientWidth + 1);
    });

    await step("Value is ellipsised", async (): Promise<void> => {
      expect(value).toBeTruthy();
      const styles: CSSStyleDeclaration = window.getComputedStyle(value);
      expect(styles.textOverflow).toBe("ellipsis");
      expect(styles.whiteSpace).toBe("nowrap");
      expect(styles.overflowX).toBe("hidden");
      // Proves the label really is longer than the space available.
      expect(value.scrollWidth).toBeGreaterThan(value.clientWidth);
    });

    await step("The chevron is still visible", async (): Promise<void> => {
      const icon: SVGElement = trigger.querySelector(
        "svg",
      ) as unknown as SVGElement;
      const iconRect: DOMRect = icon.getBoundingClientRect();
      const triggerRect: DOMRect = trigger.getBoundingClientRect();
      expect(iconRect.width).toBeGreaterThan(0);
      expect(iconRect.right).toBeLessThanOrEqual(triggerRect.right + 1);
    });
  },
};

function ViewportEdgeDemo(): ReactElement {
  return (
    <div className="flex min-h-[280px] w-full items-start justify-between gap-4 p-4">
      <div className="w-[200px]">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Left edge
        </span>
        <Select>
          <SelectTrigger className="w-full" aria-label="Left edge workflow">
            <SelectValue placeholder="Select a workflow" />
          </SelectTrigger>
          <LongOptionList />
        </Select>
      </div>
      <div className="w-[200px]">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Right edge
        </span>
        <Select>
          <SelectTrigger className="w-full" aria-label="Right edge workflow">
            <SelectValue placeholder="Select a workflow" />
          </SelectTrigger>
          <LongOptionList />
        </Select>
      </div>
    </div>
  );
}

/**
 * A trigger flush against the right hand edge of the window is the case where
 * an uncapped dropdown escapes the viewport: the popper can only shift it back
 * so far before the content is simply wider than the screen.
 */
export const AgainstViewportEdge: Story = {
  render: (): ReactElement => <ViewportEdgeDemo />,
  parameters: { layout: "fullscreen" },
  play: async ({ step }): Promise<void> => {
    await step(
      "Right hand dropdown stays on screen",
      async (): Promise<void> => {
        const content: HTMLElement = await openSelect(/right edge workflow/i);
        await expectNoHorizontalOverflow(content);
        expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
          window.innerWidth + 1,
        );
        await userEvent.keyboard("{Escape}");
        await waitFor((): void => {
          expect(
            document.querySelector('[data-slot="select-content"]'),
          ).toBeNull();
        });
      },
    );

    await step(
      "Left hand dropdown stays on screen",
      async (): Promise<void> => {
        const content: HTMLElement = await openSelect(/left edge workflow/i);
        await expectNoHorizontalOverflow(content);
        await userEvent.keyboard("{Escape}");
      },
    );
  },
};

function LongListDemo(): ReactElement {
  return (
    <div className="w-[320px]">
      <Select>
        <SelectTrigger className="w-full" aria-label="Region">
          <SelectValue placeholder="Select a region" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Regions</SelectLabel>
            {Array.from({ length: 40 }, (_unused, index: number) => (
              <SelectItem key={index} value={`region-${index}`}>
                {`Region ${index + 1} — availability zone with a fairly wordy human readable description`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Vertical counterpart to the width cap: the dropdown is bounded by the height
 * the popper reports as available and scrolls internally instead of running off
 * the bottom of the window.
 */
export const LongScrollableList: Story = {
  render: (): ReactElement => <LongListDemo />,
  parameters: { layout: "centered" },
  play: async ({ step }): Promise<void> => {
    const content: HTMLElement = await openSelect(/region/i);

    await step(
      "Dropdown is bounded by the viewport",
      async (): Promise<void> => {
        await waitFor((): void => {
          const rect: DOMRect = content.getBoundingClientRect();
          expect(rect.top).toBeGreaterThanOrEqual(-1);
          expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight + 1);
        });
      },
    );

    await step("Overflowing options scroll", async (): Promise<void> => {
      const viewport: HTMLElement = content.querySelector<HTMLElement>(
        "[data-radix-select-viewport]",
      ) as HTMLElement;
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    });

    await expectNoHorizontalOverflow(content);
    await userEvent.keyboard("{Escape}");
  },
};

function WithIconsDemo(): ReactElement {
  return (
    <div className="w-[300px]">
      <Select defaultValue="vaults">
        <SelectTrigger className="w-full" aria-label="Resource">
          <SelectValue placeholder="Select a resource" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Resources</SelectLabel>
            <SelectItem value="vaults">
              <Lock />
              Encrypted vaults with a rather long descriptive label
            </SelectItem>
            <SelectItem value="schemas">
              <Layers />
              Stored JSON schemas
            </SelectItem>
            <SelectItem value="regions">
              <Globe />
              Deployment regions
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Infrastructure</SelectLabel>
            <SelectItem value="servers">
              <Server />
              Compute servers
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

/** Icons stay aligned and never shrink once the label starts truncating. */
export const WithIcons: Story = {
  render: (): ReactElement => <WithIconsDemo />,
  parameters: { layout: "centered" },
  play: async (): Promise<void> => {
    const body = within(document.body);
    const trigger: HTMLElement = await body.findByRole("combobox", {
      name: /resource/i,
    });
    const icons: SVGElement[] = Array.from(trigger.querySelectorAll("svg"));
    // The value icon plus the chevron.
    expect(icons.length).toBe(2);
    for (const icon of icons) {
      expect(icon.getBoundingClientRect().width).toBeGreaterThan(0);
    }
    expect(trigger.scrollWidth).toBeLessThanOrEqual(trigger.clientWidth + 1);
  },
};

function SizesDemo(): ReactElement {
  return (
    <div className="grid w-[300px] gap-4">
      {(["sm", "default"] as const).map((size) => (
        <div key={size}>
          <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <Select defaultValue="invoice-reconciliation">
            <SelectTrigger
              size={size}
              className="w-full"
              aria-label={`${size} workflow`}
            >
              <SelectValue placeholder="Select a workflow" />
            </SelectTrigger>
            <LongOptionList />
          </Select>
        </div>
      ))}
    </div>
  );
}

/** Both trigger sizes truncate identically. */
export const Sizes: Story = {
  render: (): ReactElement => <SizesDemo />,
  parameters: { layout: "centered" },
  play: async (): Promise<void> => {
    const body = within(document.body);
    for (const size of ["sm", "default"] as const) {
      const trigger: HTMLElement = await body.findByRole("combobox", {
        name: new RegExp(`${size} workflow`, "i"),
      });
      expect(trigger.scrollWidth).toBeLessThanOrEqual(trigger.clientWidth + 1);
    }
  },
};

export const Disabled: Story = {
  render: (): ReactElement => (
    <div className="w-[280px]">
      <Select disabled defaultValue="short">
        <SelectTrigger className="w-full" aria-label="Disabled workflow">
          <SelectValue placeholder="Select a workflow" />
        </SelectTrigger>
        <LongOptionList />
      </Select>
    </div>
  ),
  parameters: { layout: "centered" },
};
