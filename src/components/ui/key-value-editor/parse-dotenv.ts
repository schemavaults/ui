export interface DotenvEntry {
  key: string;
  value: string;
}

function unquote(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if (first === '"' && last === '"') {
      return trimmed
        .slice(1, -1)
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
    }
    if (first === "'" && last === "'") {
      return trimmed.slice(1, -1);
    }
  }
  // Unquoted values may carry a trailing ` # comment`.
  const commentAt = trimmed.search(/\s#/);
  return commentAt === -1 ? trimmed : trimmed.slice(0, commentAt).trimEnd();
}

/**
 * Parses `.env`-style text (`KEY=value` per line) into ordered entries.
 *
 * Blank lines and `#` comments are skipped, a leading `export ` is dropped,
 * and single/double quoted values are unwrapped. Lines without an `=` are
 * ignored. Duplicate keys are kept in order — the caller decides how to
 * surface them.
 */
export function parseDotenv(text: string): DotenvEntry[] {
  const entries: DotenvEntry[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith("#")) continue;
    const withoutExport = line.replace(/^export\s+/, "");
    const eq = withoutExport.indexOf("=");
    if (eq <= 0) continue;
    const key = withoutExport.slice(0, eq).trim();
    if (key.length === 0) continue;
    entries.push({ key, value: unquote(withoutExport.slice(eq + 1)) });
  }
  return entries;
}

function quoteIfNeeded(value: string): string {
  if (value.length === 0) return "";
  if (!/[\s#"'\\=]/.test(value)) return value;
  return `"${value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")}"`;
}

/**
 * Serialises entries back into `.env` text. Rows with an empty key are
 * dropped; values containing whitespace, quotes, `#` or `=` are double
 * quoted so `parseDotenv(serializeDotenv(x))` round-trips.
 */
export function serializeDotenv(entries: readonly DotenvEntry[]): string {
  return entries
    .filter((entry) => entry.key.trim().length > 0)
    .map((entry) => `${entry.key.trim()}=${quoteIfNeeded(entry.value)}`)
    .join("\n");
}

/**
 * Normalises free text into an `UPPER_SNAKE_CASE` environment-variable name:
 * `"api key"` → `"API_KEY"`, `"db-url"` → `"DB_URL"`.
 */
export function toEnvVarName(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9_]+/g, "_")
    .replace(/^(\d)/, "_$1");
}
