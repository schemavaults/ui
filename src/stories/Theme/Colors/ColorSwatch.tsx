"use client";

import { useMemo, type ReactElement } from "react";

export interface ColorSwatchProps {
  colorName: string;
  shade: string;
  bgClass: string;
  textClass: string;
}

export function ColorSwatch({
  colorName,
  shade,
  bgClass,
  textClass = "text-white",
}: ColorSwatchProps): ReactElement {
  const isShadeNumber: boolean = useMemo(() => {
    let canParseShadeAsInt: boolean = false;
    try {
      const parsed = Number.parseInt(shade);
      if (isNaN(parsed)) {
        throw new TypeError("Failed to parse integer from shade!");
      } else {
        canParseShadeAsInt = true;
      }
    } catch (e: unknown) {
      void e;
      canParseShadeAsInt = false;
    }
    return canParseShadeAsInt;
  }, [shade]);

  const displayName: string = useMemo((): string => {
    if (isShadeNumber) {
      if (shade === "500") {
        return colorName;
      } else {
        return `${colorName}-${shade}`;
      }
    } else {
      return shade;
    }
  }, [isShadeNumber, shade, colorName]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`w-16 h-16 rounded-lg shadow-md ${bgClass} flex items-center justify-center`}
      >
        <span className={`text-xs font-medium ${textClass}`}>{shade}</span>
      </div>
      <span className="text-sm font-medium text-gray-700 text-center">
        {displayName}
      </span>
      <span className="text-xs text-gray-500 font-mono">{bgClass}</span>
    </div>
  );
}

export default ColorSwatch;
