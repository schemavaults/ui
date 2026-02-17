"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { type ReactElement, useState, type FC } from "react";

export type { ColumnDef };

/** Default page size options shown in the rows-per-page selector. */
const DEFAULT_PAGE_SIZE_OPTIONS: readonly number[] = [10, 20, 50, 100];

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
}: DatatableProps<TData, TValue>): ReactElement {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialVisibleColumns,
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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

  const table = useReactTable({
    data,
    columns: columns satisfies ColumnDef<TData, TValue>[],
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
    onRowSelectionChange: setRowSelection,
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
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                  colSpan={columns.length}
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
          {/* Page indicator */}
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          {/* Navigation buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Datatable;
