"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import DataTable from "@/components/financial-statistics/DataTable";
import FinancialChart from "@/components/financial-statistics/FinancialChart";

const FinancialStatistics = () => {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session.user.memberId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/getFinancialStatistics/${session.user.memberId}`
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch data");
        }

        setData(result.data);
        console.log("FInacial Data:", result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session.user.memberId]);

  return (
    <div className="m-2 p-4 border border-gray-300 rounded-lg md:text-md text-sm">
      {/* <FinancialChart data={data} /> */}
      <div className="py-4">
        <h4 className="md:text-xl text-lg tracking-wide font-bold bold">
          Financial Statistics
        </h4>
      </div>
      {loading ? (
        <div>
          {" "}
          <Loader className="animate-spin text-center" />
        </div>
      ) : data.length > 0 ? (
        <>
          <DataTable data={data} loading={loading} />
        </>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default FinancialStatistics;
