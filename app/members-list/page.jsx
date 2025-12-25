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
import { Search, Loader2, ShieldX, Printer } from "lucide-react";

const MembersListPage = () => {
  const { data: session, status } = useSession();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [daughterFilter, setDaughterFilter] = useState("all"); // "all", "show", "hide"
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "inactive"
  const [printTimestamp, setPrintTimestamp] = useState("");

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
        accessorKey: "MemberShipNo",
        header: "MemberShip No.",
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
      },{
        accessorKey: "Age18",
        header: "Age",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() || "N/A"}</span>
        ),
      },
      // {
      //   accessorKey: "DughterOfJamat",
      //   header: "DOJ",
      //   cell: ({ getValue }) => {
      //     const val = getValue();
      //     const yesValues = ["1", 1, true, "true", "yes", "y", "t"];
      //     const isYes = yesValues.some((v) => v === val || `${val}`.toLowerCase() === `${v}`.toLowerCase());
      //     return <span className="text-gray-700">{isYes ? "Yes" : "No"}</span>;
      //   },
      // },
      {
        accessorKey: "Dues",
        header: "Dues",
        cell: ({ getValue }) => {
          const dues = getValue();
          return (
            <span className={`${dues > 0 ? 'text-red-500' : 'text-green-500'} font-medium`}>
              {dues !== null && dues !== undefined ? dues : "0"}
            </span>
          );
        },
      },
    ],
    []
  );

  // Filter data based on search query
  const filteredData = useMemo(() => {
    let data = members;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      data = data.filter((member) => {
        const memberName = (member.MemberName || "").toLowerCase();
        const cnic = (member.CNICNo || "").toLowerCase();
        const memberId = (member.memberId || "").toString().toLowerCase();
        const familyName = (member.FamilyName || "").toLowerCase();

        return (
          memberName.includes(query) ||
          cnic.includes(query) ||
          memberId.includes(query) ||
          familyName.includes(query)
        );
      });
    }

    // Filter by Daughter of Jamat
    if (daughterFilter === "show") {
      // Show only Daughter of Jamat (value = 1)
      data = data.filter((member) => {
        const raw = member.DughterOfJamat;
        const normalized = `${raw ?? ""}`.toLowerCase().trim();
        return (
          raw === 1 ||
          raw === "1" ||
          normalized === "yes" ||
          normalized === "true" ||
          normalized === "y" ||
          normalized === "t"
        );
      });
    } else if (daughterFilter === "hide") {
      // Hide Daughter of Jamat (value = 0)
      data = data.filter((member) => {
        const raw = member.DughterOfJamat;
        const normalized = `${raw ?? ""}`.toLowerCase().trim();
        return !(
          raw === 1 ||
          raw === "1" ||
          normalized === "yes" ||
          normalized === "true" ||
          normalized === "y" ||
          normalized === "t"
        );
      });
    }
    // If "all", no filtering needed

    // Filter by Status
    if (statusFilter === "active") {
      // Show only active members (Status = 1)
      data = data.filter((member) => {
        const status = member.Status;
        return status === 1 || status === "1" || status === true;
      });
    } else if (statusFilter === "inactive") {
      // Show only inactive members (Status = 0)
      data = data.filter((member) => {
        const status = member.Status;
        return status === 0 || status === "0" || status === false;
      });
    }
    // If "all", no filtering needed

    // Sorting
    if (sortOption === "default" || sortOption === "family-asc") {
      // Default: Sort by FamilyName A-Z
      data = [...data].sort((a, b) => {
        const familyA = (a.FamilyName || "").toLowerCase();
        const familyB = (b.FamilyName || "").toLowerCase();
        return familyA.localeCompare(familyB);
      });
    } else if (sortOption === "name-asc") {
      data = [...data].sort((a, b) =>
        (a.MemberName || "").toLowerCase().localeCompare((b.MemberName || "").toLowerCase())
      );
    } else if (sortOption === "name-desc") {
      data = [...data].sort((a, b) =>
        (b.MemberName || "").toLowerCase().localeCompare((a.MemberName || "").toLowerCase())
      );
    }

    return data;
  }, [members, searchQuery, daughterFilter, statusFilter, sortOption]);

  const handlePrint = () => {
    const now = new Date();
    setPrintTimestamp(now.toLocaleString());
    // allow state to flush before print
    setTimeout(() => window.print(), 50);
  };

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
    <>
      {/* Screen View */}
      <div className="w-full p-4 md:p-6 min-h-screen bg-gray-50 print:hidden">
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

        {/* Search & Filters */}
        <div className="mb-6 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, CNIC, Member ID, or Family Name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination({ ...pagination, pageIndex: 0 }); // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex gap-2 flex-col">
              <label className="text-sm w-3/4 sm:w-32 font-medium text-gray-700 pl-2">Arrange By</label>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setPagination({ ...pagination, pageIndex: 0 });
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="default">Default</option>
                <option value="name-asc">A → Z</option>
                <option value="name-desc">Z → A</option>
              </select>
            </div>

            <div className="flex gap-2 flex-col">
              <label className="text-sm w-3/4 sm:w-32 font-medium text-gray-700 text-left pl-2">DOJ</label>
              <select
                value={daughterFilter}
                onChange={(e) => {
                  setDaughterFilter(e.target.value);
                  setPagination({ ...pagination, pageIndex: 0 });
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="show">Show DOJ</option>
                <option value="hide">Show Members</option>
              </select>
            </div>

            <div className="flex gap-2 flex-col">
              <label className="text-sm w-3/4 sm:w-32 font-medium text-gray-700 text-left pl-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination({ ...pagination, pageIndex: 0 });
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-200 text-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>

          {searchQuery && (
            <p className="text-sm text-gray-600 w-full md:w-auto">
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

      {/* Print View */}
      <div className="hidden print:block text-gray-900 print-area">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">
            Kathiawar Sunni Vohra Jamat
          </h2>
        </div>
        <div className="flex justify-center">
          <div className="overflow-x-auto">
            <table className="border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-left text-sm">
                  {columns
                    .filter((col) => col.accessorKey !== "DughterOfJamat" && col.accessorKey !== "PicPath")
                    .map((col) => (
                      <th key={col.accessorKey || col.id} className="px-3 py-2 border-b border-gray-300">
                        {typeof col.header === "string"
                          ? col.header
                          : flexRender(col.header, {
                              table: { options: {} },
                              column: { columnDef: col },
                            })}
                      </th>
                    ))}
                  {/* Signature header cell */}
                  <th className="px-3 py-2 border-b border-gray-300 w-32">Signature</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.filter((col) => col.accessorKey !== "DughterOfJamat" && col.accessorKey !== "PicPath").length + 1} className="text-center py-6">
                      No members available.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      {columns
                        .filter((col) => col.accessorKey !== "DughterOfJamat" && col.accessorKey !== "PicPath")
                        .map((col) => {
                          const value =
                            typeof col.cell === "function"
                              ? col.cell({
                                  row: { original: row },
                                  getValue: () => row[col.accessorKey],
                                })
                              : row[col.accessorKey];
                          return (
                            <td key={col.accessorKey || col.id} className="px-3 py-2 align-top">
                              {value}
                            </td>
                          );
                        })}
                      {/* Signature cell with line */}
                      <td className="px-3 align-top w-32">
                        {/* <div className="border-b-2 border-gray-700 pt-1" style={{ minHeight: '20px' }}>
                          &nbsp;
                        </div> */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Print isolation to hide global layout/sidebars */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0 !important;
            padding: 0 !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          body * {
            visibility: hidden !important;
          }
          .print-area,
          .print-area * {
            visibility: visible !important;
          }
          .print-area {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            margin: 0 !important;
            padding: 20px !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </>
  );
};

export default MembersListPage;