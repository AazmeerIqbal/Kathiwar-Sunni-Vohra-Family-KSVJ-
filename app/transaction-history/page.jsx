"use client";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { CiCircleCheck } from "react-icons/ci";
import Loader from "@/components/ui/Loader";
import Image from "next/image";

const page = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingIds, setApprovingIds] = useState(new Set());

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/transaction-history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (memberId, dateAndTime) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will approve and delete this transaction record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    const transactionKey = `${memberId}-${dateAndTime}`;
    setApprovingIds((prev) => new Set(prev).add(transactionKey));

    try {
      const response = await fetch(
        `/api/approve-transaction?memberId=${memberId}&dateAndTime=${encodeURIComponent(dateAndTime)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Approved!",
          text: "Transaction has been approved and deleted successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });

        // Remove the transaction from the list
        setTransactions((prev) =>
          prev.filter(
            (t) =>
              !(
                t.MemberId === memberId &&
                t.DateAndTime === dateAndTime
              )
          )
        );
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Failed to approve transaction.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Error approving transaction:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while approving the transaction.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setApprovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(transactionKey);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "Not specified";
    return `Rs. ${parseFloat(amount).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="p-4 md:text-sm text-xs">
        <div className="m-2 p-4 border border-gray-300 rounded-lg md:text-md text-sm">
          <div className="py-4 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600" />
              <p className="mt-2 text-gray-700">Loading transactions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:text-sm text-xs">
        <div className="m-2 p-4 border border-gray-300 rounded-lg md:text-md text-sm">
          <div className="py-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
            <button
              onClick={fetchTransactions}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:text-sm text-xs">
      <div className="m-2 p-4 border border-gray-300 rounded-lg md:text-md text-sm">
        <div className="py-4">
          <h4 className="md:text-xl text-lg tracking-wide font-bold mb-6">
            Transaction History
          </h4>

          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No transactions found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions.map((transaction, index) => {
                const transactionKey = `${transaction.MemberId}-${transaction.DateAndTime}`;
                const isApproving = approvingIds.has(transactionKey);
                const screenshotPath = transaction.ScreenShot
                  ? `/${transaction.ScreenShot}`
                  : null;

                return (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow"
                  >
                    {/* Member Information */}
                    <div className="mb-4">
                      <h5 className="font-bold text-lg text-gray-800 mb-2">
                        {transaction.MemberName || "N/A"}
                      </h5>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Father Name:</span>{" "}
                        {transaction.MemberFatherName || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Member ID:</span>{" "}
                        {transaction.MemberId}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Family ID:</span>{" "}
                        {transaction.FamilyID || "N/A"}
                      </p>
                      {/* <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Amount:</span>{" "}
                        <span
                          className={
                            transaction.Amount
                              ? "text-green-600 font-semibold"
                              : "text-gray-500"
                          }
                        >
                          {formatAmount(transaction.Amount)}
                        </span>
                      </p> */}
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Date:</span>{" "}
                        {formatDate(transaction.DateAndTime)}
                      </p>
                    </div>

                    {/* Screenshot */}
                    {screenshotPath && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Transaction Screenshot:
                        </p>
                        <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={screenshotPath}
                            alt={`Transaction screenshot for ${transaction.MemberName}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      </div>
                    )}

                    {/* Approve Button */}
                    <button
                      onClick={() =>
                        handleApprove(transaction.MemberId, transaction.DateAndTime)
                      }
                      disabled={isApproving}
                      className="w-full flex gap-2 items-center justify-center hover:opacity-70 py-2 px-4 bg-[#22583e] text-[#f1f1f1] font-semibold rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isApproving ? (
                        <>
                          <Loader w={4} h={4} />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CiCircleCheck className="text-xl" />
                          Approve
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;