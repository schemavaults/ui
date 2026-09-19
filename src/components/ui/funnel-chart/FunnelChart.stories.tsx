import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useState, type ReactElement } from "react";

import {
  FunnelChart,
  funnelChartSizeIds,
  funnelChartOrientationIds,
  funnelChartConversionModeIds,
  funnelChartStageColorIds,
  type FunnelChartStage,
} from "./funnel-chart";

/** A typical SaaS signup funnel. */
const signupFunnel: ReadonlyArray<FunnelChartStage> = [
  { id: "visited", label: "Visited", value: 12480 },
  { id: "signed-up", label: "Signed up", value: 4210 },
  { id: "verified", label: "Verified", value: 3105 },
  { id: "vault-created", label: "Vault created", value: 1840 },
  { id: "activated", label: "Activated", value: 962 },
];

/** A schema-ingestion pipeline, the SchemaVaults-flavored example. */
const ingestionFunnel: ReadonlyArray<FunnelChartStage> = [
  { id: "uploaded", label: "Uploaded", value: 8400, color: "default" },
  { id: "parsed", label: "Parsed", value: 8110, color: "default" },
  { id: "validated", label: "Validated", value: 6725, color: "positive" },
  { id: "indexed", label: "Indexed", value: 6580, color: "positive" },
  { id: "published", label: "Published", value: 4390, color: "warning" },
];

const meta = {
  title: "Components/FunnelChart",
  component: FunnelChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A conversion funnel rendered as a chain of tapering SVG bands. " +
          "Each stage's thickness is proportional to its value, and the gutter " +
          "labels show the stage name, its value, and its conversion rate " +
          "against either the previous stage or the top of the funnel. " +
          "Colors come from the shared @schemavaults/theme palette, so the " +
          "chart tracks light and dark mode automatically.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    stages: signupFunnel,
    label: "Signup conversion funnel",
  },
  argTypes: {
    size: {
      options: funnelChartSizeIds,
      control: { type: "radio" },
    },
    orientation: {
      options: funnelChartOrientationIds,
      control: { type: "radio" },
    },
    conversionMode: {
      options: funnelChartConversionModeIds,
      control: { type: "radio" },
    },
    stageGap: {
      control: { type: "range", min: 0, max: 24, step: 1 },
    },
    minStageRatio: {
      control: { type: "range", min: 0, max: 0.5, step: 0.01 },
    },
  },
} satisfies Meta<typeof FunnelChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    size: "lg",
  },
};

export const Tapered: Story = {
  args: {
    taperLastStage: true,
    size: "lg",
  },
};

// Cumulative conversion measures every stage against the top of the funnel
// instead of against the stage directly above it.
export const CumulativeConversion: Story = {
  args: {
    conversionMode: "first",
    size: "lg",
  },
};

export const WithoutConversionLabels: Story = {
  args: {
    conversionMode: "none",
  },
};

export const CustomColors: Story = {
  args: {
    stages: ingestionFunnel,
    label: "Schema ingestion pipeline",
    size: "lg",
  },
};

function SizesExample(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-8">
      {funnelChartSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <FunnelChart
            size={size}
            stages={signupFunnel.slice(0, 4)}
            label={`Signup funnel (${size})`}
          />
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  );
}

export const Sizes: Story = {
  render: (): ReactElement => <SizesExample />,
};

function PaletteExample(): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
      {funnelChartStageColorIds.map((color) => (
        <div key={color} className="flex flex-col items-center gap-2">
          <FunnelChart
            size="sm"
            stages={signupFunnel.slice(0, 3).map((stage) => ({
              ...stage,
              color,
            }))}
            label={`${color} palette funnel`}
            showValueLabels={false}
            conversionMode="none"
          />
          <span className="text-xs text-muted-foreground">{color}</span>
        </div>
      ))}
    </div>
  );
}

export const Palette: Story = {
  render: (): ReactElement => <PaletteExample />,
};

// Formatters let the host app localize values and swap percentages for
// absolute drop-off counts.
export const CustomFormatters: Story = {
  args: {
    size: "lg",
    conversionMode: "first",
    valueLabelFormatter: ({ value }): string =>
      value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value),
    conversionLabelFormatter: ({ conversion }): string | null =>
      conversion === null ? null : `${(conversion * 100).toFixed(1)}%`,
  },
};

export const EmptyState: Story = {
  args: {
    stages: [],
    label: "No funnel data available",
  },
};

function InteractiveExample(): ReactElement {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <FunnelChart
        size="lg"
        stages={signupFunnel}
        label="Signup conversion funnel"
        onStageClick={(stage): void => {
          setSelected(stage.label ?? stage.id);
        }}
      />
      <p className="text-sm text-muted-foreground" data-testid="selection">
        {selected ? `Selected: ${selected}` : "Click a stage to drill in"}
      </p>
    </div>
  );
}

export const Interactive: Story = {
  render: (): ReactElement => <InteractiveExample />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const selection = canvas.getByTestId("selection");

    expect(selection).toHaveTextContent("Click a stage to drill in");

    const verified = canvas.getByRole("button", { name: /Verified: 3105/ });
    await userEvent.click(verified);
    await waitFor(() => {
      expect(selection).toHaveTextContent("Selected: Verified");
    });

    // Stages are keyboard-operable too.
    const activated = canvas.getByRole("button", { name: /Activated: 962/ });
    activated.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(selection).toHaveTextContent("Selected: Activated");
    });
  },
};

// Verifies the geometry: five stages, each drawn as a gap-separated band, plus
// the conversion rates computed against the previous stage.
export const Geometry: Story = {
  args: { size: "lg" },
  play: async ({ canvasElement }): Promise<void> => {
    const chart = canvasElement.querySelector<SVGSVGElement>(
      '[data-slot="funnel-chart"] svg',
    );
    expect(chart).not.toBeNull();

    const bands = canvasElement.querySelectorAll("polygon[data-stage-id]");
    expect(bands).toHaveLength(signupFunnel.length);

    // The funnel narrows: every band is drawn no wider than the one above it.
    const widths: number[] = Array.from(bands).map((band): number => {
      const xs: number[] = (band.getAttribute("points") ?? "")
        .split(" ")
        .map((pair) => Number(pair.split(",")[0]));
      return Math.max(...xs) - Math.min(...xs);
    });
    for (let i = 1; i < widths.length; i += 1) {
      expect(widths[i]!).toBeLessThanOrEqual(widths[i - 1]! + 0.001);
    }

    const conversions = canvasElement.querySelector(
      '[data-slot="funnel-chart-conversion-labels"]',
    );
    // The first stage has no predecessor, so it gets no conversion label.
    expect(conversions?.querySelectorAll("text")).toHaveLength(
      signupFunnel.length - 1,
    );
    expect(conversions?.textContent).toContain("34%");
  },
};
