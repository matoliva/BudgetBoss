'use client'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";

interface DataTableProps<TData extends { description?: string }> {
  columns: any;
  data: TData[];
}

export function DataTable<TData extends { description?: string }>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filter, setFilter] = useState<string>("");

  // Use useMemo to memoize filtered data and avoid recalculations on each render
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.description?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  // Initialize the table only once with memoization
  const table = useReactTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="dark:bg-gray-900 dark:text-gray-100 p-4 rounded-md shadow-md">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by description..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="cursor-pointer px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-medium"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {typeof header.column.columnDef.header === "function"
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                    {header.column.getIsSorted() === "asc"
                      ? " 🔼"
                      : header.column.getIsSorted() === "desc"
                      ? " 🔽"
                      : null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {typeof cell.column.columnDef.cell === "function"
                    ? cell.column.columnDef.cell(cell.getContext())
                    : cell.getValue()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination flex items-center justify-between mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
        >
          Previous
        </button>
        <span>
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
}
