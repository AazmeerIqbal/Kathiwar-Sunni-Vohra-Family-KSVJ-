"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import DataTable from "@/components/financial-statistics/DataTable";
import FinancialChart from "@/components/financial-statistics/FinancialChart";
import MemberSearch from "@/components/financial-statistics/MemberSearch";

const FinancialStatistics = () => {
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchData = async (memberId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/getFinancialStatistics/${memberId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch data");
      }

      setData(result.data);
      console.log("Financial Data:", result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.memberId) return;

    // If user is not admin, fetch their data on initial load
    if (session.user.isAdmin !== 1) {
      setLoading(true);
      fetchData(session.user.memberId);
    } else {
      // For admin users, just show empty state
      setLoading(false);
      setData([]);
    }

    setInitialLoad(false);
  }, [session?.user?.memberId]);

  // When admin selects a member, fetch that member's data
  useEffect(() => {
    if (session?.user?.isAdmin === 1 && selectedMember) {
      fetchData(selectedMember.memberId);
    }
  }, [selectedMember]);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };

  if (initialLoad && !session) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="m-2 p-4 border border-gray-300 rounded-lg md:text-md text-sm">
      <div className="py-4">
        <h4 className="md:text-xl text-lg tracking-wide font-bold bold">
          Financial Statistics
        </h4>
      </div>

      {/* Admin search component */}
      {session?.user?.isAdmin === 1 && (
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Search for a member to view their financial statistics:
          </p>
          <MemberSearch onMemberSelect={handleMemberSelect} />
          {selectedMember && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
              <img
                src={selectedMember.PicPath || "/default-profile.png"}
                alt={selectedMember.MemberName}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-medium">{selectedMember.MemberName}</p>
                <p className="text-sm text-gray-600">
                  Membership #: {selectedMember.MemberShipNo}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* <FinancialChart data={data} /> */}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader className="animate-spin" />
        </div>
      ) : session?.user?.isAdmin === 1 && !selectedMember ? (
        <div className="text-center py-8 text-gray-500">
          Please search and select a member to view their financial statistics.
        </div>
      ) : data?.length > 0 ? (
        <DataTable data={data} loading={loading} />
      ) : (
        <div className="text-center py-8 text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default FinancialStatistics;
