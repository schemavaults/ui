"use client";

import { cn } from "@/lib/utils";
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
  wordmarkGradientColorClassnames?: [
    fromClassName: string,
    toClassName: string,
  ];

  className?: string;
}

export function Wordmark({
  wordmarkText = DEFAULT_WORDMARK_TEXT,
  wordmarkGradientColorClassnames = [
    cn("from-schemavaults-brand-blue"),
    cn("to-schemavaults-brand-red"),
  ] as const,
  className,
}: WordmarkProps): ReactElement {
  if (typeof wordmarkText !== "string" || !(wordmarkText.length > 0)) {
    throw new TypeError(
      "Expected 'wordmarkText' to render to be a non-empty string!",
    );
  }

  if (
    !Array.isArray(wordmarkGradientColorClassnames) ||
    typeof wordmarkGradientColorClassnames[0] !== "string" ||
    typeof wordmarkGradientColorClassnames[1] !== "string"
  ) {
    throw new TypeError(
      "Expected a [to, from] tuple containing classNames for the <Wordmark /> gradient!",
    );
  }

  const finalSpanClassname: string = cn(
    "text-transparent bg-clip-text bg-gradient-to-br",
    wordmarkGradientColorClassnames[0],
    wordmarkGradientColorClassnames[1],
    "text-nowrap",
    className,
  );

  return <span className={finalSpanClassname}>{wordmarkText}</span>;
}

export default Wordmark;
