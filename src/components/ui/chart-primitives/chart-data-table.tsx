import type { ReactElement, ReactNode } from "react";

export interface ChartDataTableRow {
  key: string;
  /** The first cell becomes the row header. */
  cells: ReadonlyArray<ReactNode>;
}

export interface ChartDataTableProps {
  caption: ReactNode;
  columns: ReadonlyArray<ReactNode>;
  rows: ReadonlyArray<ChartDataTableRow>;
}

/**
 * The table view of a chart, visually hidden: every value a chart draws is
 * reachable without the chart, so hover is never the only way to read it.
 *
 * `sr-only` goes on a wrapping `<div>`, not on the `<table>`: a table never
 * renders narrower than its content, so it ignores `width: 1px`, and with
 * `white-space: nowrap` its content is the longest unwrapped caption or row.
 * On the table itself that box still counts toward the page's scrollable
 * width and can make a phone-width page scroll sideways. The `<div>` does
 * honour `width: 1px` and `overflow: hidden`, so it clips the table out of the
 * layout while leaving it in the accessibility tree. (Never `display: none`,
 * `hidden` or `aria-hidden`: those would hide it from screen readers too.)
 */
function ChartDataTable({
  caption,
  columns,
  rows,
}: ChartDataTableProps): ReactElement {
  return (
    <div className="sr-only">
      <table data-slot="chart-data-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map(
              (column: ReactNode, index: number): ReactElement => (
                <th key={index} scope="col">
                  {column}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map(
            (row: ChartDataTableRow): ReactElement => (
              <tr key={row.key}>
                {row.cells.map(
                  (cell: ReactNode, index: number): ReactElement =>
                    index === 0 ? (
                      <th key={index} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={index}>{cell}</td>
                    ),
                )}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
ChartDataTable.displayName = "ChartDataTable";

export { ChartDataTable };
