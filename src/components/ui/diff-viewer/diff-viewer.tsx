"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  useMemo,
} from "react";

import { cn } from "@/lib/utils";
import {
  buildSplitRows,
  computeLineDiff,
  summarizeDiff,
  type DiffOp,
  type DiffStats,
  type SplitDiffRow,
} from "./compute-line-diff";
import {
  diffViewerModeIds,
  diffViewerSizeIds,
  diffViewerVariantIds,
  type DiffViewerMode,
  type DiffViewerSize,
  type DiffViewerVariant,
} from "./diff-viewer-variants";

const diffViewerVariants = cva(
  "relative overflow-hidden rounded-md border font-mono",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-foreground",
        subtle: "border-transparent bg-muted/60 text-foreground",
        contrast: "border-foreground/10 bg-foreground/[0.03] text-foreground",
      } satisfies Record<DiffViewerVariant, string>,
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      } satisfies Record<DiffViewerSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const diffViewerHeaderVariants = cva(
  "flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2",
  {
    variants: {
      variant: {
        default: "border-border/60 bg-background/40",
        subtle: "border-border/40 bg-transparent",
        contrast: "border-foreground/10 bg-foreground/[0.04]",
      } satisfies Record<DiffViewerVariant, string>,
      size: {
        sm: "text-[11px]",
        md: "text-xs",
        lg: "text-sm",
      } satisfies Record<DiffViewerSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const diffViewerBodyPaddingVariants = cva("leading-6", {
  variants: {
    size: {
      sm: "leading-5",
      md: "leading-6",
      lg: "leading-7",
    } satisfies Record<DiffViewerSize, string>,
  },
  defaultVariants: { size: "md" },
});

const lineNumberClasses: string =
  "select-none px-2 py-0 text-right tabular-nums text-muted-foreground/70";

const equalRowClasses: string = "bg-transparent";
const insertRowClasses: string =
  "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300";
const deleteRowClasses: string =
  "bg-destructive/10 text-destructive dark:text-red-300";
const emptyRowClasses: string = "bg-muted/40";

const markerClasses: string = "select-none px-2 text-center font-semibold";

export interface DiffViewerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof diffViewerVariants> {
  /** The original text (the "before" state). */
  oldValue: string;
  /** The updated text (the "after" state). */
  newValue: string;
  /** Display mode. `unified` (default) shows one column; `split` shows two. */
  mode?: DiffViewerMode;
  /** Optional title rendered in the header (e.g. a file path). */
  title?: ReactNode;
  /** Label shown above the old/left column. Defaults to "Before". */
  oldLabel?: ReactNode;
  /** Label shown above the new/right column. Defaults to "After". */
  newLabel?: ReactNode;
  /** When true, displays line numbers in the gutter. Defaults to true. */
  showLineNumbers?: boolean;
  /** When true, shows additions/deletions counts in the header. Defaults to true. */
  showStats?: boolean;
  /** When true, long lines wrap rather than scroll horizontally. Defaults to false. */
  wrap?: boolean;
  /** Optional max-height applied to the scroll container, e.g. "20rem". */
  maxHeight?: string;
  /** Optional ref to the outer wrapper element. */
  ref?: Ref<HTMLDivElement>;
}

function DiffViewer({
  oldValue,
  newValue,
  mode = "unified",
  title,
  oldLabel = "Before",
  newLabel = "After",
  showLineNumbers = true,
  showStats = true,
  wrap = false,
  maxHeight,
  variant,
  size,
  className,
  ref,
  ...props
}: DiffViewerProps): ReactElement {
  const ops: DiffOp[] = useMemo(
    (): DiffOp[] => computeLineDiff(oldValue, newValue),
    [oldValue, newValue],
  );
  const stats: DiffStats = useMemo((): DiffStats => summarizeDiff(ops), [ops]);
  const splitRows: SplitDiffRow[] = useMemo(
    (): SplitDiffRow[] => (mode === "split" ? buildSplitRows(ops) : []),
    [ops, mode],
  );

  const resolvedVariant: DiffViewerVariant = variant ?? "default";
  const resolvedSize: DiffViewerSize = size ?? "md";

  return (
    <div
      ref={ref}
      data-slot="diff-viewer"
      data-mode={mode}
      data-variant={resolvedVariant}
      className={cn(
        diffViewerVariants({ variant, size }),
        className,
      )}
      {...props}
    >
      <div
        data-slot="diff-viewer-header"
        className={cn(diffViewerHeaderVariants({ variant, size }))}
      >
        <div className="flex min-w-0 items-center gap-2">
          {title !== undefined && (
            <span
              data-slot="diff-viewer-title"
              className="truncate font-sans font-medium opacity-90"
            >
              {title}
            </span>
          )}
        </div>
        {showStats && (
          <div
            data-slot="diff-viewer-stats"
            className="flex shrink-0 items-center gap-2 font-sans"
            aria-label={`${stats.additions} additions, ${stats.deletions} deletions`}
          >
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono font-semibold text-emerald-700 dark:text-emerald-300">
              +{stats.additions}
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-destructive/15 px-1.5 py-0.5 font-mono font-semibold text-destructive dark:text-red-300">
              -{stats.deletions}
            </span>
          </div>
        )}
      </div>
      <div
        data-slot="diff-viewer-body"
        className={cn(
          "overflow-auto",
          diffViewerBodyPaddingVariants({ size: resolvedSize }),
        )}
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        {mode === "split" ? (
          <SplitView
            rows={splitRows}
            showLineNumbers={showLineNumbers}
            wrap={wrap}
            oldLabel={oldLabel}
            newLabel={newLabel}
          />
        ) : (
          <UnifiedView
            ops={ops}
            showLineNumbers={showLineNumbers}
            wrap={wrap}
          />
        )}
      </div>
    </div>
  );
}
DiffViewer.displayName = "DiffViewer";

interface UnifiedViewProps {
  ops: readonly DiffOp[];
  showLineNumbers: boolean;
  wrap: boolean;
}

function UnifiedView({
  ops,
  showLineNumbers,
  wrap,
}: UnifiedViewProps): ReactElement {
  const cellWhitespace: string = wrap
    ? "whitespace-pre-wrap break-words"
    : "whitespace-pre";
  const gridTemplate: string = showLineNumbers
    ? "grid-cols-[auto_auto_auto_1fr]"
    : "grid-cols-[auto_1fr]";
  return (
    <div
      role="table"
      aria-label="Unified diff"
      data-slot="diff-viewer-unified"
      className={cn("grid min-w-full", gridTemplate)}
    >
      {ops.map((op, idx): ReactElement => {
        const rowClasses: string =
          op.type === "insert"
            ? insertRowClasses
            : op.type === "delete"
            ? deleteRowClasses
            : equalRowClasses;
        const marker: string =
          op.type === "insert" ? "+" : op.type === "delete" ? "-" : " ";
        return (
          <div
            key={idx}
            role="row"
            data-op={op.type}
            className={cn("contents")}
          >
            {showLineNumbers && (
              <span role="cell" className={cn(lineNumberClasses, rowClasses)}>
                {op.oldLineNumber ?? ""}
              </span>
            )}
            {showLineNumbers && (
              <span role="cell" className={cn(lineNumberClasses, rowClasses)}>
                {op.newLineNumber ?? ""}
              </span>
            )}
            <span
              role="cell"
              aria-hidden="true"
              className={cn(markerClasses, rowClasses)}
            >
              {marker}
            </span>
            <span
              role="cell"
              className={cn("pr-3", cellWhitespace, rowClasses)}
            >
              {op.text.length === 0 ? "​" : op.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface SplitViewProps {
  rows: readonly SplitDiffRow[];
  showLineNumbers: boolean;
  wrap: boolean;
  oldLabel: ReactNode;
  newLabel: ReactNode;
}

function SplitView({
  rows,
  showLineNumbers,
  wrap,
  oldLabel,
  newLabel,
}: SplitViewProps): ReactElement {
  const cellWhitespace: string = wrap
    ? "whitespace-pre-wrap break-words"
    : "whitespace-pre";
  const sidePattern: string = showLineNumbers ? "auto auto 1fr" : "auto 1fr";
  const gridTemplateColumns: string = `${sidePattern} ${sidePattern}`;
  const columnsPerSide: number = showLineNumbers ? 3 : 2;

  return (
    <div
      role="table"
      aria-label="Side-by-side diff"
      data-slot="diff-viewer-split"
      className={cn("grid min-w-full")}
      style={{ gridTemplateColumns }}
    >
      <div
        role="columnheader"
        className="border-b border-border/60 bg-muted/40 px-3 py-1 font-sans text-xs font-medium text-muted-foreground"
        style={{ gridColumn: `span ${columnsPerSide}` }}
      >
        {oldLabel}
      </div>
      <div
        role="columnheader"
        className="border-b border-l border-border/60 bg-muted/40 px-3 py-1 font-sans text-xs font-medium text-muted-foreground"
        style={{ gridColumn: `span ${columnsPerSide}` }}
      >
        {newLabel}
      </div>
      {rows.map((row, idx): ReactElement => {
        const leftOp: DiffOp | undefined = row.left;
        const rightOp: DiffOp | undefined = row.right;
        const leftRowClasses: string =
          leftOp === undefined
            ? emptyRowClasses
            : leftOp.type === "delete"
            ? deleteRowClasses
            : equalRowClasses;
        const rightRowClasses: string =
          rightOp === undefined
            ? emptyRowClasses
            : rightOp.type === "insert"
            ? insertRowClasses
            : equalRowClasses;
        const leftMarker: string = leftOp?.type === "delete" ? "-" : " ";
        const rightMarker: string = rightOp?.type === "insert" ? "+" : " ";
        return (
          <div
            key={idx}
            role="row"
            data-row-index={idx}
            className="contents"
          >
            {showLineNumbers && (
              <span role="cell" className={cn(lineNumberClasses, leftRowClasses)}>
                {leftOp?.oldLineNumber ?? ""}
              </span>
            )}
            <span
              role="cell"
              aria-hidden="true"
              className={cn(markerClasses, leftRowClasses)}
            >
              {leftMarker}
            </span>
            <span
              role="cell"
              className={cn("pr-3", cellWhitespace, leftRowClasses)}
            >
              {leftOp === undefined
                ? "​"
                : leftOp.text.length === 0
                ? "​"
                : leftOp.text}
            </span>
            {showLineNumbers && (
              <span
                role="cell"
                className={cn(
                  lineNumberClasses,
                  rightRowClasses,
                  "border-l border-border/40",
                )}
              >
                {rightOp?.newLineNumber ?? ""}
              </span>
            )}
            <span
              role="cell"
              aria-hidden="true"
              className={cn(
                markerClasses,
                rightRowClasses,
                !showLineNumbers && "border-l border-border/40",
              )}
            >
              {rightMarker}
            </span>
            <span
              role="cell"
              className={cn("pr-3", cellWhitespace, rightRowClasses)}
            >
              {rightOp === undefined
                ? "​"
                : rightOp.text.length === 0
                ? "​"
                : rightOp.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export {
  DiffViewer,
  diffViewerVariants,
  diffViewerVariantIds,
  diffViewerSizeIds,
  diffViewerModeIds,
};
export type { DiffViewerVariant, DiffViewerSize, DiffViewerMode };

export default DiffViewer;
