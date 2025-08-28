"use client";
import { useState, useMemo } from "react";
import {
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import DetailedDataTable from "@/components/financial-statistics/DetailedDataTable";
import OtherContributions from "./OtherContributions";
import { useSession } from "next-auth/react";

const DataTable = ({ data, loading }) => {
  const { data: session } = useSession();
  // Calculate totals
  const totalDebit = data[0].reduce((sum, row) => sum + (row.Debit || 0), 0);
  const totalCredit = data[0].reduce((sum, row) => sum + (row.Credit || 0), 0);
  const baseBalance = totalDebit - totalCredit;

  // Determine monthly donation (use most recent non-zero Debit if available)
  const recentMonthlyDonation = (() => {
    const rows = Array.isArray(data[0]) ? data[0] : [];
    for (let i = rows.length - 1; i >= 0; i--) {
      const value = rows[i]?.Debit;
      if (typeof value === "number" && value > 0) return value;
    }
    return 0;
  })();

  // Calculate months remaining in current year (exclude current month)
  const now = new Date();
  const currentMonthNumber = now.getMonth() + 1; // 1-12
  const monthsRemainingToDecember = 12 - currentMonthNumber; // e.g., Aug(8) => 4
  const totalBalance =
    baseBalance + recentMonthlyDonation * monthsRemainingToDecember;

  // Year-to-date metrics for improved visualization
  const currentYear = now.getFullYear();
  const currentYearRows = useMemo(() => {
    const rows = Array.isArray(data[0]) ? data[0] : [];
    return rows.filter((row) => {
      const d = new Date(row.TransDAte);
      return !Number.isNaN(d?.getTime?.()) && d.getFullYear() === currentYear;
    });
  }, [data, currentYear]);

  const receivedThisYear = useMemo(
    () => currentYearRows.reduce((sum, row) => sum + (row.Credit || 0), 0),
    [currentYearRows]
  );

  const expectedThisYear = useMemo(
    () => recentMonthlyDonation * 12,
    [recentMonthlyDonation]
  );

  const percentPaidThisYear = useMemo(() => {
    if (!expectedThisYear) return 0;
    const pct = Math.round((receivedThisYear / expectedThisYear) * 100);
    return Math.max(0, Math.min(100, pct));
  }, [receivedThisYear, expectedThisYear]);

  const monthlySparklineData = useMemo(() => {
    const base = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(currentYear, i, 1).toLocaleString("en-US", {
        month: "short",
      }),
      credit: 0,
    }));
    currentYearRows.forEach((row) => {
      const d = new Date(row.TransDAte);
      if (!Number.isNaN(d?.getTime?.())) {
        const idx = d.getMonth();
        base[idx].credit += row.Credit || 0;
      }
    });
    return base;
  }, [currentYearRows, currentYear]);

  const [showDetailedTable, setShowDetailedTable] = useState(false);

  return (
    <div className="overflow-x-auto">
      {/* Summary Cards & Visualizations */}
      <div className="bg-gray-100 p-4 mb-4 rounded-lg shadow-md flex flex-col lg:flex-row justify-end items-center flex-wrap">
        {/* Radial progress: Paid this year */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="flex flex-col items-center">
            <ResponsiveContainer width={280} height={220}>
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={[{ name: "Paid", value: percentPaidThisYear }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background
                  clockWise
                  dataKey="value"
                  cornerRadius={12}
                  fill="#10b981"
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center -mt-6">
              <div className="text-sm text-gray-600">Paid this year</div>
              <div className="text-2xl font-bold">{percentPaidThisYear}%</div>
              <div className="text-xs text-gray-500">
                Received {receivedThisYear} of {expectedThisYear}
              </div>
            </div>
            {/* Sparkline for monthly received */}
            <div className="w-full mt-4">
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart
                  data={monthlySparklineData}
                  margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorCredit"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="credit"
                    stroke="#10b981"
                    fill="url(#colorCredit)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <div
            className="grid grid-cols-1 sm:grid-cols-1
           gap-2 sm:gap-4 text-center"
          >
            {/* <div className="p-2 sm:p-3 bg-red-200 rounded-md font-semibold">
              Monthly Donation <br />
              <span className="text-red-600">{totalDebit}</span>
            </div> */}
            {/* <div className="p-2 sm:p-3 bg-green-200 rounded-md font-semibold">
              Received <br />
              <span className="text-green-600">{totalCredit}</span>
            </div> */}
            <div className="p-2 sm:p-3 bg-blue-200 rounded-md font-semibold">
              {totalBalance > 0
                ? `⚠️ Due till December ${now.getFullYear()}`
                : `✅ Your Dues are all cleared`}

              <span className="text-blue-600">
                {totalBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="gap-4 flex">
            {session?.user?.isAdmin !== 1 && (
              <button
                type="submit"
                className="flex justify-center gap-2 items-center mx-auto drop-shadow-xl font-bold bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group w-full mt-4"
                onClick={() =>
                  (window.location.href = `financial-statistics/payNow?balance=${totalBalance}`)
                }
              >
                Pay Now
                <svg
                  className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                  viewBox="0 0 16 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                    className="fill-gray-800 group-hover:fill-gray-800"
                  ></path>
                </svg>
              </button>
            )}

            <button
              className="relative py-2 px-8 text-black font-bold nded-full overflow-hidden bg-white rounded-full transition-all duration-400 ease-in-out drop-shadow-xl hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 w-full mt-4"
              onClick={() => setShowDetailedTable(!showDetailedTable)}
            >
              {showDetailedTable
                ? "Hide Monthly Donation"
                : "Show Monthly Donation"}
            </button>
          </div>
        </div>
      </div>

      {/* Render DetailedDataTable with animation */}
      <AnimatePresence>
        {showDetailedTable && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <DetailedDataTable data={data[0]} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4">
        <OtherContributions data={data[1]} loading={loading} />
      </div>
    </div>
  );
};

export default DataTable;
