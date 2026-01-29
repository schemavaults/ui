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
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
}

export function Datatable<TData extends object, TValue = unknown>({
  data,
  columns,
  initialVisibleColumns,
  datatypeLabel,
  searchColumn,
  enableGlobalFilter = false,
  HeaderButtons,
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Datatable;
