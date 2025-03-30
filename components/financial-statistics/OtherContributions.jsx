"use client";
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const OtherContributions = ({ data, loading }) => {
  // Reverse the data order to show bottom-to-top
  const reversedData = useMemo(() => [...data].reverse(), [data]);

  const columns = useMemo(
    () => [
      { accessorKey: "TransTypeName", header: "Transaction Type" },
      {
        accessorKey: "TransDAte",
        header: "Date",
        cell: ({ getValue }) =>
          new Date(getValue())
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-"),
      },
      {
        accessorKey: "Credit",
        header: "Amount",
        cell: ({ getValue }) => (
          <span className="text-green-600 font-medium">
            {getValue() !== null && getValue() !== undefined ? getValue() : 0}
          </span>
        ),
      },
      {
        accessorKey: "VoucherID",
        header: "Voucher ID",
        cell: ({ getValue }) => getValue() || "N/A",
      },
    ],
    []
  );

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

  const table = useReactTable({
    data: reversedData, // Using reversed data
    columns,
    state: { pagination },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  return (
    <div className="w-full p-4">
      <h1 className="md:text-xl text-lg font-bold mb-3">Other Transactions</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border border-gray-300 rounded-md">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm sm:text-base">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-2 px-3 sm:py-3 sm:px-4 text-left font-semibold"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm sm:text-base">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
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

export default OtherContributions;
