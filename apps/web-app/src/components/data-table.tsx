"use client";

import React, { useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
  type ColumnFiltersState,
  type VisibilityState,
  type ColumnSizingState,
  filterFns as tanstackFilterFns,
} from "@tanstack/react-table";

import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnSizing,
    },
    columnResizeMode: "onChange",
    // Set the default filter function for all columns
    defaultColumn: {
      filterFn: tanstackFilterFns.includesString,
    },
  });

  const footerGroups = table.getFooterGroups();

  const hasFooter = useMemo(
    () => columns.some((column) => "footer" in column),
    [columns],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      position: "relative",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex cursor-pointer items-center"
                        onClick={() => header.column.toggleSorting()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted() === "asc" && (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                        {header.column.getIsSorted() === false && (
                          <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100" />
                        )}
                      </div>
                      <DropdownMenu
                        open={openMenuId === header.id}
                        onOpenChange={(isOpen) => {
                          setOpenMenuId(isOpen ? header.id : null);
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuItem
                            onClick={() => header.column.toggleSorting(false)}
                          >
                            Sort ascending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => header.column.toggleSorting(true)}
                          >
                            Sort descending
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => header.column.setFilterValue("")}
                          >
                            Clear filter
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Input
                              placeholder={`Filter ${header.column.id}...`}
                              value={
                                (header.column.getFilterValue() as string) ?? ""
                              }
                              onChange={(event) =>
                                header.column.setFilterValue(event.target.value)
                              }
                              className="max-w-sm"
                            />
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              header.column.toggleVisibility(false)
                            }
                          >
                            Hide column
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className="resizer"
                    />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() =>
                    onRowClick && onRowClick(row.original as TData)
                  }
                  className={
                    onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
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
          {hasFooter && (
            <tfoot className="bg-muted/50 font-semibold">
              {footerGroups.map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext(),
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </tfoot>
          )}
        </Table>
      </div>
    </div>
  );
}
