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
 */
function ChartDataTable({
  caption,
  columns,
  rows,
}: ChartDataTableProps): ReactElement {
  return (
    <table data-slot="chart-data-table" className="sr-only">
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
  );
}
ChartDataTable.displayName = "ChartDataTable";

export { ChartDataTable };
