"use client";

import { getSchemaVaultsBrandColor } from "@schemavaults/theme/brand_colors";
import type { ReactElement } from "react";

const DEFAULT_WORDMARK_TEXT = "SchemaVaults" as const;

export interface WordmarkProps {
  /**
   * @description The actual string to (beautifully) render
   */
  wordmarkText?: string;

  /**
   * @example ["from-schemavaults-brand-blue", "to-schemavaults-brand-red"]
   */
  gradientColors?: [fromClassName: string, toClassName: string];

  className?: string;
}

export function Wordmark({
  wordmarkText = DEFAULT_WORDMARK_TEXT,
  gradientColors = [
    getSchemaVaultsBrandColor("schemavaults-brand-blue"),
    getSchemaVaultsBrandColor("schemavaults-brand-red"),
  ] as const,
  className,
}: WordmarkProps): ReactElement {
  if (typeof wordmarkText !== "string" || !(wordmarkText.length > 0)) {
    throw new TypeError(
      "Expected 'wordmarkText' to render to be a non-empty string!",
    );
  }

  if (
    !Array.isArray(gradientColors) ||
    typeof gradientColors[0] !== "string" ||
    typeof gradientColors[1] !== "string"
  ) {
    throw new TypeError(
      "Expected a [from, to] tuple containing classNames for the <Wordmark /> gradient!",
    );
  }
  const fromColor: string = gradientColors[0];
  const toColor: string = gradientColors[1];

  return (
    <span
      className={className}
      style={{
        textWrap: "nowrap",
        color: "transparent",
        backgroundClip: "text",
        backgroundImage: `linear-gradient(to bottom right, ${fromColor}, ${toColor})`,
      }}
    >
      {wordmarkText}
    </span>
  );
}

export default Wordmark;
