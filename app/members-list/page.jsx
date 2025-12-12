"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Search, Loader2, ShieldX } from "lucide-react";

const MembersListPage = () => {
  const { data: session, status } = useSession();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch members from API (only if admin)
  useEffect(() => {
    const fetchMembers = async () => {
      // Only fetch if user is authenticated and is admin
      if (status === "loading" || !session) return;
      if (session.user.isAdmin !== 1) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/getAllMembersName");
        const result = await response.json();

        if (response.ok) {
          setMembers(result.fathers || []);
        } else {
          console.error("Error fetching members:", result.message);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [session, status]);

  // Get image path helper function
  const getImagePath = (picPath, memberId) => {
    if (picPath && picPath.trim() !== "") {
      // If picPath starts with /, use it directly, otherwise prepend /
      return picPath.startsWith("/") ? picPath : `/${picPath}`;
    }
    // Fallback to default image
    return "/DummyUser.png";
  };

  // Define columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "PicPath",
        header: "",
        cell: ({ row }) => {
          const picPath = row.original.PicPath;
          const memberId = row.original.memberId;
          const imagePath = getImagePath(picPath, memberId);

          return (
            <div className="flex items-center justify-center">
              <img
                src={imagePath}
                alt={`${row.original.MemberName || "Member"}`}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                onError={(e) => {
                  e.target.src = "/DummyUser.png";
                }}
              />
            </div>
          );
        },
        size: 80,
      },
      {
        accessorKey: "memberId",
        header: "Member ID",
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-900">{getValue() || "N/A"}</span>
        ),
      },
      {
        accessorKey: "MemberName",
        header: "Member Name",
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-800">{getValue() || "N/A"}</span>
        ),
      },
      {
        accessorKey: "MemberFatherName",
        header: "Father Name",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() || "N/A"}</span>
        ),
      },
      {
        accessorKey: "CNICNo",
        header: "CNIC No",
        cell: ({ getValue }) => {
          const cnic = getValue();
          return (
            <span className="text-gray-700 font-mono text-sm">
              {cnic || "N/A"}
            </span>
          );
        },
      },
      {
        accessorKey: "FamilyName",
        header: "Family Name",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() || "N/A"}</span>
        ),
      },
    ],
    []
  );

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return members;
    }

    const query = searchQuery.toLowerCase().trim();
    return members.filter((member) => {
      const memberName = (member.MemberName || "").toLowerCase();
      const cnic = (member.CNICNo || "").toLowerCase();
      const memberId = (member.memberId || "").toString().toLowerCase();

      return (
        memberName.includes(query) ||
        cnic.includes(query) ||
        memberId.includes(query)
      );
    });
  }, [members, searchQuery]);

  // Table configuration
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
  });

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and is admin
  if (!session || session.user.isAdmin !== 1) {
    return (
      <div className="w-full p-4 md:p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-red-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShieldX className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Access Denied
          </h1>
          <p className="text-gray-600 text-base mb-4">
            You do not have permission to access this page. This page is only
            available to administrators.
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-200 font-medium"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Members List
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            View and search through all registered members
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, CNIC, or Member ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination({ ...pagination, pageIndex: 0 }); // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600">
              Found {filteredData.length} member{filteredData.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <span className="ml-3 text-gray-600">Loading members...</span>
              </div>
            ) : (
              <>
                <table className="min-w-full border-collapse">
                  <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="py-3 px-4 text-left font-semibold text-sm md:text-base whitespace-nowrap"
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
                  <tbody className="divide-y divide-gray-200">
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center py-12 text-gray-500"
                        >
                          {searchQuery
                            ? "No members found matching your search."
                            : "No members available."}
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="py-3 px-4 text-sm md:text-base"
                            >
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

                {/* Pagination */}
                {table.getRowModel().rows.length > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 bg-gray-50 space-y-3 sm:space-y-0">
                    <div className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-medium">
                        {table.getState().pagination.pageIndex *
                          table.getState().pagination.pageSize +
                          1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          (table.getState().pagination.pageIndex + 1) *
                            table.getState().pagination.pageSize,
                          filteredData.length
                        )}
                      </span>{" "}
                      of <span className="font-medium">{filteredData.length}</span>{" "}
                      members
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-sm font-medium text-gray-700">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount() || 1}
                      </span>
                      <button
                        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersListPage;