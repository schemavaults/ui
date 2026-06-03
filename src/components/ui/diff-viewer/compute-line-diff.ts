export const diffOpTypes = ["equal", "insert", "delete"] as const satisfies readonly string[];
export type DiffOpType = (typeof diffOpTypes)[number];

export interface DiffOp {
  type: DiffOpType;
  /** The line text. For "equal" this is identical on both sides. */
  text: string;
  /** 1-based line number in the old source (undefined for inserts). */
  oldLineNumber?: number;
  /** 1-based line number in the new source (undefined for deletes). */
  newLineNumber?: number;
}

/**
 * Compute a line-by-line diff between two strings using the classic
 * longest-common-subsequence dynamic-programming algorithm. Time and space
 * complexity are O(m * n), which is acceptable for typical document-sized
 * inputs (up to a few thousand lines).
 */
export function computeLineDiff(
  oldText: string,
  newText: string,
): DiffOp[] {
  const oldLines: string[] = oldText.split("\n");
  const newLines: string[] = newText.split("\n");
  const m: number = oldLines.length;
  const n: number = newLines.length;

  const dp: Uint32Array = new Uint32Array((m + 1) * (n + 1));
  const stride: number = n + 1;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i * stride + j] = dp[(i - 1) * stride + (j - 1)] + 1;
      } else {
        const up: number = dp[(i - 1) * stride + j];
        const left: number = dp[i * stride + (j - 1)];
        dp[i * stride + j] = up >= left ? up : left;
      }
    }
  }

  const ops: DiffOp[] = [];
  let i: number = m;
  let j: number = n;
  while (i > 0 && j > 0) {
    if (oldLines[i - 1] === newLines[j - 1]) {
      ops.push({
        type: "equal",
        text: oldLines[i - 1],
        oldLineNumber: i,
        newLineNumber: j,
      });
      i--;
      j--;
    } else if (dp[(i - 1) * stride + j] >= dp[i * stride + (j - 1)]) {
      ops.push({
        type: "delete",
        text: oldLines[i - 1],
        oldLineNumber: i,
      });
      i--;
    } else {
      ops.push({
        type: "insert",
        text: newLines[j - 1],
        newLineNumber: j,
      });
      j--;
    }
  }
  while (i > 0) {
    ops.push({
      type: "delete",
      text: oldLines[i - 1],
      oldLineNumber: i,
    });
    i--;
  }
  while (j > 0) {
    ops.push({
      type: "insert",
      text: newLines[j - 1],
      newLineNumber: j,
    });
    j--;
  }
  ops.reverse();
  return ops;
}

export interface DiffStats {
  additions: number;
  deletions: number;
  unchanged: number;
}

export function summarizeDiff(ops: readonly DiffOp[]): DiffStats {
  let additions: number = 0;
  let deletions: number = 0;
  let unchanged: number = 0;
  for (const op of ops) {
    if (op.type === "insert") additions++;
    else if (op.type === "delete") deletions++;
    else unchanged++;
  }
  return { additions, deletions, unchanged };
}

export interface SplitDiffRow {
  /** The op for the left (old) side, if any. */
  left?: DiffOp;
  /** The op for the right (new) side, if any. */
  right?: DiffOp;
}

/**
 * Convert a flat sequence of diff ops into rows suitable for side-by-side
 * display. Contiguous runs of delete/insert ops are zipped together so that
 * a deleted line lines up horizontally with the corresponding inserted line
 * when possible.
 */
export function buildSplitRows(ops: readonly DiffOp[]): SplitDiffRow[] {
  const rows: SplitDiffRow[] = [];
  let cursor: number = 0;
  while (cursor < ops.length) {
    const op: DiffOp = ops[cursor];
    if (op.type === "equal") {
      rows.push({ left: op, right: op });
      cursor++;
      continue;
    }
    const deletes: DiffOp[] = [];
    const inserts: DiffOp[] = [];
    while (cursor < ops.length && ops[cursor].type !== "equal") {
      const next: DiffOp = ops[cursor];
      if (next.type === "delete") deletes.push(next);
      else inserts.push(next);
      cursor++;
    }
    const pairCount: number = Math.max(deletes.length, inserts.length);
    for (let k = 0; k < pairCount; k++) {
      rows.push({ left: deletes[k], right: inserts[k] });
    }
  }
  return rows;
}
