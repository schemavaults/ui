"use client";

import { type ReactElement } from "react";
import colorGroups from "./colorGroups";
import ColorSwatch from "./ColorSwatch";
import ColorGroup from "./ColorGroup";

const TailwindColorDemo = () => {
  // All class names are explicitly defined here so Tailwind can detect them

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tailwind CSS Color Palette
        </h1>
        <p className="text-gray-600">
          Complete color swatches showing all available Tailwind CSS colors from
          shade 50 to 900.
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(colorGroups).map(([colorName, colors]) => (
          <ColorGroup key={colorName} colorName={colorName} colors={colors} />
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Usage</h2>
        <div className="space-y-2 text-sm">
          <p className="text-gray-700">
            <span className="font-mono bg-gray-200 px-2 py-1 rounded">
              bg-blue-500
            </span>{" "}
            - Background color
          </p>
          <p className="text-gray-700">
            <span className="font-mono bg-gray-200 px-2 py-1 rounded">
              text-blue-500
            </span>{" "}
            - Text color
          </p>
          <p className="text-gray-700">
            <span className="font-mono bg-gray-200 px-2 py-1 rounded">
              border-blue-500
            </span>{" "}
            - Border color
          </p>
        </div>
      </div>
    </div>
  );
};

export default TailwindColorDemo;
