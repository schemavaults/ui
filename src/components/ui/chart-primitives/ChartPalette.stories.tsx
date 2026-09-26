import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

import { getChartColorClasses, type ChartColorId } from "./chart-colors";

interface Slot {
  id: ChartColorId;
  name: string;
  hue: string;
  light: string;
  dark: string;
}

const SLOTS: ReadonlyArray<Slot> = [
  { id: "chart-1", name: "Slot 1", hue: "Blue", light: "#2a78d6", dark: "#3987e5" },
  { id: "chart-2", name: "Slot 2", hue: "Orange", light: "#eb6834", dark: "#d95926" },
  { id: "chart-3", name: "Slot 3", hue: "Aqua", light: "#1baf7a", dark: "#199e70" },
  { id: "chart-4", name: "Slot 4", hue: "Yellow", light: "#eda100", dark: "#c98500" },
  { id: "chart-5", name: "Slot 5", hue: "Magenta", light: "#e87ba4", dark: "#d55181" },
  { id: "chart-6", name: "Slot 6", hue: "Green", light: "#008300", dark: "#008300" },
  { id: "chart-7", name: "Slot 7", hue: "Violet", light: "#4a3aa7", dark: "#9085e9" },
  { id: "chart-8", name: "Slot 8", hue: "Red", light: "#e34948", dark: "#e66767" },
  { id: "other", name: "Other", hue: "Grey", light: "#898781", dark: "#898781" },
];

function PaletteTable(): ReactElement {
  return (
    <div className="flex max-w-3xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-2 text-sm">
        <h2 className="text-lg font-semibold">Chart palette</h2>
        <p className="text-muted-foreground">
          Every chart paints series in this order: slot 1 for the first (and
          for single-series charts), slot 2 for the second, and so on. Slots
          are never cycled: a ninth series is{" "}
          <span className="font-medium text-foreground">Other</span>. Scatter
          plots colour at most three series. The swatches below are drawn
          with the chart tokens (<code>--chart-1</code> …{" "}
          <code>--chart-other</code>) from <code>@schemavaults/theme</code>{" "}
          0.29.0+, falling back to the light steps on an older theme; toggle
          dark mode to see the dark steps.
        </p>
      </div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th scope="col" className="py-2 pr-4 font-medium">
              Swatch
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Slot
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Colour id
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Light
            </th>
            <th scope="col" className="py-2 font-medium">
              Dark
            </th>
          </tr>
        </thead>
        <tbody>
          {SLOTS.map((slot) => (
            <tr key={slot.id} className="border-b last:border-0">
              <td className="py-2 pr-4">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-block size-6 rounded-md",
                      getChartColorClasses(slot.id).bg,
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-block h-0.5 w-6 rounded-full",
                      getChartColorClasses(slot.id).bg,
                    )}
                  />
                </span>
              </td>
              <td className="py-2 pr-4">
                {slot.name} <span className="text-muted-foreground">· {slot.hue}</span>
              </td>
              <td className="py-2 pr-4 font-mono text-xs">{slot.id}</td>
              <td className="py-2 pr-4 font-mono text-xs">{slot.light}</td>
              <td className="py-2 font-mono text-xs">{slot.dark}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground">
        Validated with the data-viz <code>validate_palette.js</code> against
        the card surfaces: light (#ffffff) worst neighbouring pair ΔE 9.1
        under colour-blindness simulation and 19.6 for normal vision; dark
        (#020817) 8.4 and 19.3, every slot above 3:1. Aqua, yellow and magenta
        sit under 3:1 on white, so charts using them carry labels or a table
        view. Status colours (positive, warning, destructive) and the brand
        blue stay explicit choices, never series slots.
      </p>
    </div>
  );
}

const meta = {
  title: "Theme/Chart Palette",
  component: PaletteTable,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The categorical palette every chart draws its default series colours from, in slot order.",
      },
    },
  },
} satisfies Meta<typeof PaletteTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {};
