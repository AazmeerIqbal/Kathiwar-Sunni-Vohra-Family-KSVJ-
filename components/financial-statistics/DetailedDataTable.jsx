"use client";
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const DetailedDataTable = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      { accessorKey: "MemberFeeID", header: "ID" },
      {
        accessorKey: "PostDate",
        header: "Trans Date",
        cell: ({ getValue }) =>
          new Date(getValue()).toLocaleDateString("en-GB"),
      },
      { accessorKey: "MonthName", header: "Month Name" },
      {
        accessorKey: "Debit",
        header: "Monthly Donation",
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <span className="text-red-600 font-medium">
              {value !== null && value !== undefined ? value : 0}
            </span>
          );
        },
      },
      {
        accessorKey: "Credit",
        header: "Received",
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <span className="text-green-600 font-medium">
              {value !== null && value !== undefined ? value : 0}
            </span>
          );
        },
      },
      { accessorKey: "RunningTotal", header: "Balance" },
      {
        accessorKey: "VoucherID",
        header: "Voucher ID",
        cell: ({ getValue }) => getValue || "N/A",
      },
    ],
    []
  );

  const [sorting, setSorting] = useState([{ id: "PostDate", desc: true }]);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  return (
    <div className="w-full p-4">
      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border border-gray-300 rounded-md">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm sm:text-base">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-2 px-3 sm:py-3 sm:px-4 text-left font-semibold cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc"
                      ? " ▲"
                      : header.column.getIsSorted() === "desc"
                      ? " ▼"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm sm:text-base">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No records found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-2 px-3 sm:py-3 sm:px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 space-y-2 sm:space-y-0">
        <button
          className="px-3 py-1 bg-indigo-500 text-white rounded-md disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span className="text-sm sm:text-base">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          className="px-3 py-1 bg-indigo-500 text-white rounded-md disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DetailedDataTable;
