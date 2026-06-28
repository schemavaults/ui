export const snippetVariantIds = [
  "default",
  "terminal",
  "subtle",
  "contrast",
  "brand",
] as const satisfies readonly string[];
export type SnippetVariant = (typeof snippetVariantIds)[number];

export const snippetSizeIds = ["sm", "md", "lg"] as const satisfies readonly string[];
export type SnippetSize = (typeof snippetSizeIds)[number];

/**
 * Built-in symbol presets that render before the snippet value. Useful for
 * conveying the context of a single-line command (e.g. a shell prompt or a
 * package-manager binary name).
 */
export const snippetSymbolIds = [
  "dollar",
  "angle",
  "percent",
  "hash",
  "npm",
  "bun",
  "pnpm",
  "yarn",
  "git",
  "python",
  "node",
  "psql",
  "sql",
] as const satisfies readonly string[];
export type SnippetSymbol = (typeof snippetSymbolIds)[number];

export const snippetSymbolGlyphs = {
  dollar: "$",
  angle: ">",
  percent: "%",
  hash: "#",
  npm: "npm",
  bun: "bun",
  pnpm: "pnpm",
  yarn: "yarn",
  git: "git",
  python: ">>>",
  node: "node",
  psql: "=#",
  sql: "SQL>",
} as const satisfies Record<SnippetSymbol, string>;
