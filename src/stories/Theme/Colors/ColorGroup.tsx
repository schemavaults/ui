"use client";

import { useMemo, type ReactElement } from "react";
import ColorSwatch from "./ColorSwatch";
import { cn } from "@/lib/utils";

export interface ColorGroupProps {
  colorName: string;
  colors: Record<string, string>;
}

export function ColorGroup({
  colorName,
  colors,
}: ColorGroupProps): ReactElement {
  const isCoreColorsDisplay: boolean = useMemo((): boolean => {
    return colorName === "SchemaVaults";
  }, [colorName]);
  const groupClassName: string | undefined = useMemo((): string | undefined => {
    if (isCoreColorsDisplay) {
      return cn(
        "text-transparent bg-clip-text bg-gradient-to-br",
        "from-schemavaults-brand-blue to-schemavaults-brand-red",
      );
    }

    if ("500" in colors) {
      return colors["500"];
    }
    return undefined;
  }, [isCoreColorsDisplay, colors]);

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3
          className={cn(
            `text-lg font-bold px-4 py-2 rounded-md inline-block `,
            isCoreColorsDisplay ? undefined : "text-white",
            groupClassName,
          )}
        >
          {colorName}
        </h3>
      </div>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
        {Object.entries(colors).map(([shade, bgClass]) => {
          const textClass = ["50", "100", "200", "300", "400"].includes(shade)
            ? "text-gray-800"
            : "text-white";

          return (
            <ColorSwatch
              key={shade}
              colorName={colorName}
              shade={shade}
              bgClass={bgClass}
              textClass={textClass}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ColorGroup;
