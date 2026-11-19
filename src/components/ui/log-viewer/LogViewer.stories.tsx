import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState, type ReactElement } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  LogViewer,
  logViewerSizeIds,
  logViewerVariantIds,
  type LogEntry,
} from "./log-viewer";

const base = new Date(2026, 10, 19, 14, 2, 7, 118).getTime();

const sampleEntries: LogEntry[] = [
  { level: "info", source: "api", message: "Server listening on :8080" },
  { level: "debug", source: "db", message: "Pool warmed: 10 connections" },
  {
    level: "info",
    source: "api",
    message: "GET /v1/vaults 200 in 42ms",
  },
  {
    level: "trace",
    source: "auth",
    message: "jwt.verify kid=sv-2026-11 alg=EdDSA",
  },
  {
    level: "warn",
    source: "api",
    message: "Slow query on schemas.list took 1.84s (threshold 1s)",
  },
  {
    level: "info",
    source: "worker",
    message: "Job export-7f3a queued (priority=normal)",
  },
  {
    level: "error",
    source: "worker",
    message:
      "Job export-7f3a failed: S3 PutObject returned 503 SlowDown — retrying in 4s",
  },
  {
    level: "info",
    source: "worker",
    message: "Job export-7f3a succeeded on attempt 2",
  },
  {
    level: "debug",
    source: "cache",
    message: "Evicted 128 keys (lru, maxmemory reached)",
  },
  {
    level: "fatal",
    source: "db",
    message: "Replica lag exceeded 30s; failing over to us-east-1b",
  },
  { level: "info", source: "db", message: "Failover complete, primary healthy" },
].map((entry, index) => ({
  ...(entry as LogEntry),
  id: index,
  timestamp: base + index * 137,
}));

const meta = {
  title: "Developer Tools/LogViewer",
  component: LogViewer,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A filterable, searchable log stream. Toggle levels with the chips, search messages and sources, and turn on `follow` to keep the newest line in view as entries stream in. Warning/error/fatal lines use the `warning` and `destructive` tokens from `@schemavaults/theme`. For a static shell transcript, see [TerminalFrame](?path=/docs/media-frames-terminalframe--docs).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { options: logViewerVariantIds, control: { type: "radio" } },
    size: { options: logViewerSizeIds, control: { type: "radio" } },
  },
  args: {
    entries: sampleEntries,
    title: "api-server · production",
    variant: "default",
    size: "md",
    showTimestamps: true,
    showLineNumbers: true,
    wrap: false,
    follow: false,
  },
} satisfies Meta<typeof LogViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: "max-w-4xl" },
};

export const Terminal: Story = {
  args: { variant: "terminal", className: "max-w-4xl" },
};

export const Compact: Story = {
  args: {
    size: "sm",
    showLineNumbers: false,
    showTimestamps: false,
    className: "max-w-xl",
  },
};

export const WrappedLines: Story = {
  args: { wrap: true, className: "max-w-md" },
};

export const WithoutToolbar: Story = {
  args: { showToolbar: false, title: undefined, className: "max-w-4xl" },
};

export const ErrorsOnly: Story = {
  args: {
    defaultLevels: ["warn", "error", "fatal"],
    className: "max-w-4xl",
  },
};

export const Empty: Story = {
  args: { entries: [], className: "max-w-4xl" },
};

export const FilterAndSearch: Story = {
  args: { className: "max-w-4xl" },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Showing 11 of 11 lines")).toBeVisible();

    // Hide INFO lines.
    const infoChip = canvas.getByRole("button", { name: /^INFO/ });
    await userEvent.click(infoChip);
    await expect(infoChip).toHaveAttribute("aria-pressed", "false");
    await expect(canvas.getByText("Showing 6 of 11 lines")).toBeVisible();

    // Search narrows further and highlights matches.
    await userEvent.type(canvas.getByLabelText("Search logs"), "export-7f3a");
    await waitFor(() =>
      expect(canvas.getByText("Showing 1 of 11 lines")).toBeVisible(),
    );
    const matches = canvasElement.querySelectorAll(
      '[data-slot="log-viewer-match"]',
    );
    await expect(matches.length).toBe(1);

    // Nothing matches → empty message.
    await userEvent.click(canvas.getByRole("button", { name: /^ERROR/ }));
    await expect(
      canvas.getByText("No log lines match the current filters."),
    ).toBeVisible();
  },
};

const streamMessages: Omit<LogEntry, "timestamp" | "id">[] = [
  { level: "info", source: "deploy", message: "Pulling image sv/api:0.122.4" },
  { level: "debug", source: "deploy", message: "Layer sha256:9c1f… cached" },
  { level: "info", source: "deploy", message: "Starting 3 replicas" },
  { level: "warn", source: "health", message: "Replica 2 readiness probe slow" },
  { level: "info", source: "health", message: "All replicas healthy" },
  { level: "info", source: "router", message: "Shifting 10% of traffic" },
  { level: "info", source: "router", message: "Shifting 50% of traffic" },
  { level: "error", source: "router", message: "p99 latency 812ms > 500ms SLO" },
  { level: "info", source: "router", message: "Holding at 50% for 60s" },
  { level: "info", source: "router", message: "Shifting 100% of traffic" },
];

function StreamingLogViewer(): ReactElement {
  const [entries, setEntries] = useState<LogEntry[]>(() =>
    sampleEntries.slice(0, 4),
  );
  useEffect(() => {
    let tick = 0;
    const id = window.setInterval(() => {
      const next = streamMessages[tick % streamMessages.length];
      tick += 1;
      setEntries((previous) => [
        ...previous,
        { ...next, id: `stream-${tick}`, timestamp: Date.now() },
      ]);
    }, 700);
    return (): void => window.clearInterval(id);
  }, []);
  return (
    <LogViewer
      entries={entries}
      title="deploy · canary"
      variant="terminal"
      follow
      bodyClassName="h-72"
      className="max-w-4xl"
    />
  );
}

/**
 * New lines arrive every 700ms. Scroll up to pause following; a
 * "Jump to latest" button appears to resume.
 */
export const LiveTail: Story = {
  render: (): ReactElement => <StreamingLogViewer />,
};

export const Mobile: Story = {
  args: { wrap: true },
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
