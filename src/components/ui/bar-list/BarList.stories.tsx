import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { chartColorIds } from "@/components/ui/chart-primitives/chart-colors";

import { BarList, type BarListItem } from "./bar-list";

const ENDPOINTS: ReadonlyArray<BarListItem> = [
  { id: "session", label: "GET /api/session", value: 18_420, detail: "p95 12 ms" },
  { id: "login", label: "POST /api/auth/login", value: 6_310, detail: "p95 140 ms" },
  {
    id: "reset-confirm",
    label: "POST /api/auth/reset-password/confirm",
    value: 2_875,
    detail: "p95 390 ms",
  },
  { id: "vault", label: "GET /api/vaults/:vaultId/secrets/:secretId/versions", value: 1_904, detail: "p95 48 ms" },
  { id: "logout", label: "POST /api/auth/logout", value: 1_240, detail: "p95 9 ms" },
  { id: "jwks", label: "GET /.well-known/jwks.json", value: 612, detail: "p95 4 ms" },
];

const meta = {
  title: "Charts & Graphs/BarList",
  component: BarList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A ranked list of horizontal bars on one shared scale, in plain HTML, for rankings whose names are too long for a chart axis (top endpoints, operations, pages). Each row shows its name on top, truncated to one line with the full text in its tooltip, the value right-aligned at the row's end, and a thin 8px bar (rounded at its free end) with optional detail beside it. Pass `max` to put several lists on one scale. With `onSelect`, rows become toggle buttons with `aria-pressed` (Tab to reach, Enter or Space to toggle), e.g. for click-to-filter.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    color: { options: chartColorIds, control: { type: "select" } },
    fill: { control: { type: "color" } },
  },
  args: {
    label: "Busiest endpoints",
    items: ENDPOINTS,
    formatValue: (value: number): string => value.toLocaleString("en-US"),
  },
  render: (args): ReactElement => (
    <div className="w-full max-w-md rounded-lg border bg-card p-3">
      <p className="mb-2 px-2 text-sm font-medium">Busiest endpoints</p>
      <BarList {...args} />
    </div>
  ),
} satisfies Meta<typeof BarList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MonospaceLabels: Story = {
  args: {
    labelClassName: "font-mono text-xs",
  },
};

export const ClickToFilter: Story = {
  args: {
    onSelect: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "With `onSelect` each row is a toggle button; `selectedIds` marks the pressed ones.",
      },
    },
  },
  render: (args): ReactElement => {
    const Filterable = (): ReactElement => {
      const [selected, setSelected] = useState<ReadonlyArray<string>>([]);
      return (
        <div className="w-full max-w-md rounded-lg border bg-card p-3">
          <p className="mb-2 px-2 text-sm font-medium">
            Filter: {selected.length > 0 ? selected.join(", ") : "none"}
          </p>
          <BarList
            {...args}
            selectedIds={selected}
            onSelect={(item): void => {
              args.onSelect?.(item);
              setSelected((current) =>
                current.includes(item.id)
                  ? current.filter((id) => id !== item.id)
                  : [...current, item.id],
              );
            }}
          />
        </div>
      );
    };
    return <Filterable />;
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const login = canvas.getByRole("button", { name: /POST \/api\/auth\/login/ });
    expect(login).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(login);
    await waitFor(() => {
      expect(login).toHaveAttribute("aria-pressed", "true");
    });

    // Rows are reachable with Tab and toggled with Enter or Space.
    login.focus();
    await userEvent.tab();
    expect(
      canvas.getByRole("button", { name: /reset-password\/confirm/ }),
    ).toHaveFocus();
    await userEvent.keyboard(" ");
    await waitFor(() => {
      expect(canvas.getByText(/Filter: login, reset-confirm/)).toBeInTheDocument();
    });
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}{Enter}");
    await waitFor(() => {
      expect(login).toHaveAttribute("aria-pressed", "false");
    });
  },
};

export const SharedScale: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Two lists on one scale (`max`), so their bars compare across lists.",
      },
    },
  },
  render: (args): ReactElement => (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      <div className="rounded-lg border bg-card p-3">
        <p className="mb-2 px-2 text-sm font-medium">This week</p>
        <BarList {...args} max={20_000} label="This week" />
      </div>
      <div className="rounded-lg border bg-card p-3">
        <p className="mb-2 px-2 text-sm font-medium">Last week</p>
        <BarList
          {...args}
          max={20_000}
          label="Last week"
          color="other"
          items={ENDPOINTS.map((item) => ({
            ...item,
            value: Math.round(item.value * 0.7),
          }))}
        />
      </div>
    </div>
  ),
};

export const LongLabelsTruncate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A long name truncates cleanly on one line (hover it for the full text) and the value stays right-aligned, down to a phone-width column.",
      },
    },
  },
  render: (args): ReactElement => (
    <div className="w-[328px] rounded-lg border bg-card p-3">
      <BarList {...args} />
    </div>
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const label = canvas.getByText("GET /api/vaults/:vaultId/secrets/:secretId/versions");
    expect(label).toHaveAttribute(
      "title",
      "GET /api/vaults/:vaultId/secrets/:secretId/versions",
    );
    // Truncated, not wrapped or overflowing.
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    const row = label.closest('[data-slot="bar-list-item"]')!;
    expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth);
  },
};

export const Empty: Story = {
  args: {
    items: [],
    emptyMessage: "No requests match the filters",
  },
};
