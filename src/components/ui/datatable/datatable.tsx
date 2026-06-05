"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type FilterFn,
  type Row,
  type CellContext,
  type Cell,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type RowSelectionState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ReactElement,
  useCallback,
  useMemo,
  useState,
  type FC,
} from "react";

export type {
  ColumnDef,
  ColumnDef as DatatableColumnDef,
  Row as DatatableRow,
  CellContext as DatatableCellContext,
  Cell as DatatableCell,
  RowSelectionState,
  RowSelectionState as DatatableRowSelectionState,
};

/** Default page size options shown in the rows-per-page selector. */
const DEFAULT_PAGE_SIZE_OPTIONS: readonly number[] = [10, 20, 50, 100];

/** Column id for the built-in checkbox selection column. */
const SELECTION_COLUMN_ID = "__select__";

export interface DatatableProps<TData extends object, TValue = unknown> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  initialVisibleColumns: VisibilityState;
  // Renders buttons (or anything really) at the top of table. Useful for an 'Add' button.
  HeaderButtons?: FC;
  datatypeLabel: string;
  /**
   * Column(s) to search. Can be:
   * - A single column ID string (filters that column only)
   * - An array of column IDs (searches across those columns)
   * - Omit and set enableGlobalFilter for all-column search
   */
  searchColumn?: string | string[];
  /** Enable global filtering across all columns. Overrides searchColumn if true. */
  enableGlobalFilter?: boolean;
  /** Number of rows to show per page. Defaults to 10. */
  defaultPageSize?: number;
  /** Options shown in the rows-per-page selector. Defaults to [10, 20, 50, 100]. */
  pageSizeOptions?: number[];
  /** Column IDs that should be sortable via clickable headers. If omitted, no columns are sortable. */
  sortableColumns?: string[];
  /** Initial sort state applied on mount. The column must also be listed in sortableColumns. */
  defaultSort?: { id: string; desc: boolean };
  /**
   * Renders a leading checkbox column (with a select-all checkbox in the header)
   * so rows can be selected. Selection state is reflected by `row.getIsSelected()`
   * and highlights the row. Defaults to false.
   *
   * Selection can be observed/controlled regardless of this flag via
   * `selected` / `onSelectedChange`; this prop only toggles the built-in
   * checkbox UI. Provide your own column if you want custom selection controls.
   */
  enableRowSelection?: boolean;
  /**
   * Controlled row-selection state, keyed by row id (see `getRowId`). When
   * provided, the component becomes controlled and renders exactly this
   * selection. Pair with `onSelectedChange` to update it. Omit for uncontrolled
   * behavior with internally-managed selection.
   */
  selected?: RowSelectionState;
  /**
   * Called with the next row-selection state whenever the selection changes
   * (e.g. a checkbox is toggled). Receives a fully-resolved `RowSelectionState`
   * — a `Record<rowId, boolean>` — so a `useState` setter can be passed directly.
   */
  onSelectedChange?: (selected: RowSelectionState) => void;
  /**
   * Resolves the unique id for a row, which becomes the key used in the
   * selection state. Defaults to the row index. Provide this (e.g.
   * `(user) => user.id`) so controlled selection keys map to your own ids
   * and stay stable across sorting, filtering, and pagination.
   */
  getRowId?: (originalRow: TData, index: number) => string;
}

export function Datatable<TData extends object, TValue = unknown>({
  data,
  columns,
  initialVisibleColumns,
  datatypeLabel,
  searchColumn,
  enableGlobalFilter = false,
  HeaderButtons,
  defaultPageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS as unknown as number[],
  sortableColumns,
  defaultSort,
  enableRowSelection = false,
  selected,
  onSelectedChange,
  getRowId,
}: DatatableProps<TData, TValue>): ReactElement {
  const [sorting, setSorting] = useState<SortingState>(
    defaultSort ? [defaultSort] : [],
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialVisibleColumns,
  );

  // Row selection supports both controlled (`selected` provided) and
  // uncontrolled (internal state) usage. When controlled, `selected` is the
  // source of truth; otherwise we manage it locally. Either way,
  // `onSelectedChange` is notified with the fully-resolved next selection.
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});
  const isSelectionControlled: boolean = selected !== undefined;
  const rowSelection: RowSelectionState = selected ?? internalRowSelection;
  const handleRowSelectionChange = useCallback<OnChangeFn<RowSelectionState>>(
    (updaterOrValue): void => {
      const nextSelection: RowSelectionState =
        typeof updaterOrValue === "function"
          ? updaterOrValue(rowSelection)
          : updaterOrValue;
      if (!isSelectionControlled) {
        setInternalRowSelection(nextSelection);
      }
      onSelectedChange?.(nextSelection);
    },
    [isSelectionControlled, onSelectedChange, rowSelection],
  );

  // Determine search mode
  const tanstackGlobalSearchEnabled: boolean =
    enableGlobalFilter || Array.isArray(searchColumn);
  const searchableColumns: readonly string[] | undefined = Array.isArray(
    searchColumn,
  )
    ? searchColumn
    : undefined;

  // Custom filter for multi-column search (when searchColumn is an array)
  const multiColumnFilterFn: FilterFn<TData> = (
    row,
    _columnId,
    filterValue: string,
  ): boolean => {
    if (!filterValue || !searchableColumns) return true;
    const search: string = filterValue.toLowerCase();
    return searchableColumns.some((colId: string) => {
      const value = row.getValue(colId);
      return String(value ?? "")
        .toLowerCase()
        .includes(search);
    });
  };

  // Set of column IDs that are sortable, for O(1) lookups.
  const sortableSet = useMemo<ReadonlySet<string>>(
    () => new Set(sortableColumns ?? []),
    [sortableColumns],
  );

  // Override enableSorting per column so only sortableColumns are interactive.
  const columnsWithSorting = useMemo<ColumnDef<TData, TValue>[]>(
    () =>
      columns.map((col) => {
        const colId =
          (col as { accessorKey?: string }).accessorKey ??
          (col as { id?: string }).id;
        return {
          ...col,
          enableSorting: colId ? sortableSet.has(colId) : false,
        };
      }),
    [columns, sortableSet],
  );

  // Optionally prepend a checkbox column for row selection. The header holds a
  // select-all checkbox (indeterminate when only some page rows are selected)
  // and each cell toggles that row.
  const tableColumns = useMemo<ColumnDef<TData, TValue>[]>(() => {
    if (!enableRowSelection) {
      return columnsWithSorting;
    }
    const selectionColumn: ColumnDef<TData, TValue> = {
      id: SELECTION_COLUMN_ID,
      header: ({ table }): ReactElement => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value): void =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all rows on this page"
        />
      ),
      cell: ({ row }): ReactElement => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(value): void => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };
    return [selectionColumn, ...columnsWithSorting];
  }, [enableRowSelection, columnsWithSorting]);

  const table = useReactTable({
    data,
    columns: tableColumns satisfies ColumnDef<TData, TValue>[],
    ...(getRowId && { getRowId }),
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleRowSelectionChange,
    ...(tanstackGlobalSearchEnabled && {
      globalFilterFn: searchableColumns
        ? multiColumnFilterFn
        : "includesString",
      onGlobalFilterChange: setGlobalFilter,
    }),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      ...(tanstackGlobalSearchEnabled && { globalFilter }),
    },
  });

  if (enableGlobalFilter && searchColumn) {
    throw new TypeError(
      "The props 'searchColumn' and 'enableGlobalFilter' may not both be set.",
    );
  }

  return (
    <div className="w-full flex flex-col justify-start items-center">
      {/** Table Helpers (search + buttons) */}
      <div className="flex flex-row flex-wrap gap-4 items-center py-2 md:py-4 w-full">
        {(searchColumn || enableGlobalFilter) && (
          <Input
            placeholder={`Filter ${datatypeLabel.toLowerCase()}s...`}
            value={
              tanstackGlobalSearchEnabled
                ? globalFilter
                : ((table
                    .getColumn(searchColumn as string)
                    ?.getFilterValue() as string) ?? "")
            }
            onChange={(event) => {
              if (tanstackGlobalSearchEnabled) {
                setGlobalFilter(event.target.value);
              } else if (typeof searchColumn === "string") {
                table
                  .getColumn(searchColumn)
                  ?.setFilterValue(event.target.value);
              }
            }}
            className="max-w-sm min-w-24 w-auto grow"
          />
        )}
        <div className="ml-auto flex flex-row flex-wrap justify-end gap-2 md:gap-4">
          {/** Extra buttons */}
          {typeof HeaderButtons === "function" && <HeaderButtons />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize cursor-pointer"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column["id"].toUpperCase()}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/** Table */}
      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <Button
                          variant="ghost"
                          className="-ml-4"
                          onClick={() =>
                            header.column.toggleSorting(
                              header.column.getIsSorted() === "asc",
                            )
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="ml-2 h-4 w-4" />
                          ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 w-full">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Rows per page
            </span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value: string) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size: number) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Page navigation */}
          <PaginationControls
            className="mx-0 w-auto justify-end"
            size="sm"
            variant="outline"
            page={table.getState().pagination.pageIndex + 1}
            totalPages={Math.max(1, table.getPageCount())}
            onPageChange={(nextPage) => {
              table.setPageIndex(nextPage - 1);
            }}
            showFirstLast
            iconOnlyPrevNext
            disabled={table.getPageCount() <= 1}
          />
        </div>
      </div>
    </div>
  );
}

export default Datatable;
