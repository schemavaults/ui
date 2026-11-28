import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CronSchedule } from "./cron-schedule";
import {
  cronScheduleColorIds,
  cronScheduleLayoutIds,
  cronScheduleSizeIds,
  cronScheduleVariantIds,
} from "./cron-schedule-variants";

/** Pinned reference time so next-run lists render identically everywhere. */
const NOW = Date.UTC(2026, 10, 28, 10, 7, 0); // Sat 28 Nov 2026, 10:07 UTC

const meta = {
  title: "Developer Tools/CronSchedule",
  component: CronSchedule,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Explains a cron expression: a per-field breakdown (hover or focus a " +
          "field to see what it means on its own), a plain-English description, " +
          "and the next upcoming runs. Supports the standard 5-field syntax with " +
          "names (`JAN`, `MON`), lists, ranges, steps and the `@daily`-style " +
          "macros. Use `layout=\"inline\"` inside tables of scheduled jobs. The " +
          "parser (`parseCronExpression`, `describeCronExpression`, " +
          "`getNextCronRuns`) is exported for use without the component.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { options: cronScheduleVariantIds, control: { type: "radio" } },
    color: { options: cronScheduleColorIds, control: { type: "select" } },
    size: { options: cronScheduleSizeIds, control: { type: "radio" } },
    layout: { options: cronScheduleLayoutIds, control: { type: "radio" } },
    nextRuns: { control: { type: "number", min: 0, max: 10 } },
    now: { control: false },
  },
  args: {
    expression: "*/15 9-17 * * MON-FRI",
    title: "sync-vault-metrics",
    variant: "default",
    color: "primary",
    size: "md",
    layout: "card",
    nextRuns: 3,
    utc: true,
    now: NOW,
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[26rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CronSchedule>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DailyAtNine: Story = {
  args: { expression: "0 9 * * *", title: "daily-digest-email" },
};

export const Macro: Story = {
  args: { expression: "@weekly", title: "rotate-api-keys", color: "brand" },
};

export const Paused: Story = {
  args: { expression: "30 2 * * *", title: "nightly-backup", paused: true },
};

export const Terminal: Story = {
  args: { variant: "terminal", color: "success", expression: "0 */6 * * *" },
};

export const NeverRuns: Story = {
  args: { expression: "0 0 30 2 *", title: "february-30th", color: "warning" },
};

export const Invalid: Story = {
  args: { expression: "61 25 * * *", title: "broken-job" },
};

export const Variants: Story = {
  render: (args): ReactElement => (
    <div className="flex flex-col gap-4">
      {cronScheduleVariantIds.map((variant) => (
        <CronSchedule key={variant} {...args} variant={variant} title={variant} nextRuns={1} />
      ))}
    </div>
  ),
};

/** Each colour accents the highlighted field, description and run markers. */
export const Colors: Story = {
  render: (args): ReactElement => (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {cronScheduleColorIds.map((color) => (
        <CronSchedule
          key={color}
          {...args}
          color={color}
          title={color}
          size="sm"
          nextRuns={1}
          defaultActiveField="hour"
        />
      ))}
    </div>
  ),
  decorators: [
    (Story): ReactElement => (
      <div className="w-[48rem] max-w-full">
        <Story />
      </div>
    ),
  ],
};

interface MockJob {
  name: string;
  expression: string;
  paused?: boolean;
}

const mockJobs: MockJob[] = [
  { name: "sync-vault-metrics", expression: "*/15 9-17 * * MON-FRI" },
  { name: "nightly-backup", expression: "30 2 * * *" },
  { name: "rotate-api-keys", expression: "@weekly" },
  { name: "purge-audit-log", expression: "0 0 1 */3 *", paused: true },
  { name: "billing-reconcile", expression: "0 9,17 * * 1-5" },
];

/** `layout="inline"` keeps each schedule to one line inside a job table. */
export const InlineInTable: Story = {
  render: (args): ReactElement => (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="py-2 pr-4 font-medium">Job</th>
          <th className="py-2 font-medium">Schedule</th>
        </tr>
      </thead>
      <tbody>
        {mockJobs.map((job) => (
          <tr key={job.name} className="border-b last:border-0">
            <td className="py-2 pr-4 font-mono text-xs">{job.name}</td>
            <td className="py-2">
              <CronSchedule
                expression={job.expression}
                paused={job.paused}
                layout="inline"
                variant="subtle"
                size="sm"
                utc={args.utc}
                now={args.now}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
  decorators: [
    (Story): ReactElement => (
      <div className="w-[48rem] max-w-full">
        <Story />
      </div>
    ),
  ],
};

function PlaygroundDemo({ now }: { now: number }): ReactElement {
  const [expression, setExpression] = useState("0 9 * * MON-FRI");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cron-playground">Cron expression</Label>
        <Input
          id="cron-playground"
          className="font-mono"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
        />
      </div>
      <CronSchedule expression={expression} now={now} utc nextRuns={5} />
    </div>
  );
}

/** Type an expression and the breakdown, description and runs follow it. */
export const Playground: Story = {
  render: (args): ReactElement => <PlaygroundDemo now={NOW} key={String(args.now)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Cron expression");
    await userEvent.clear(input);
    await userEvent.type(input, "0 0 1 * *");
    await waitFor(() => {
      expect(canvas.getByText("At 00:00, on the 1st of the month")).toBeInTheDocument();
    });
    await userEvent.clear(input);
    await userEvent.type(input, "99 * * * *");
    await waitFor(() => {
      expect(canvas.getByRole("alert")).toHaveTextContent("out of range");
    });
  },
};

/** Hovering or focusing a field swaps the description for that field alone. */
export const FieldInspection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(
        canvas.getByText(
          "Every 15 minutes, between 09:00 and 17:59, on Monday through Friday",
        ),
      ).toBeInTheDocument();
    });
    const hourField = canvas.getByRole("button", { name: /^Hour:/ });
    await userEvent.click(hourField);
    await waitFor(() => {
      expect(hourField).toHaveAttribute("aria-pressed", "true");
      expect(canvas.getByText("Hour: 09:00 through 17:00")).toBeInTheDocument();
    });
    const runs = canvasElement.querySelectorAll("[data-slot=cron-schedule-runs] li");
    await expect(runs).toHaveLength(3);
    await expect(runs[0]).toHaveTextContent("09:00");
  },
};
