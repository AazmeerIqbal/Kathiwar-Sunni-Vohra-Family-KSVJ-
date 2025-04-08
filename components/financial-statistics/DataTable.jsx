"use client";
import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, Sector } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import DetailedDataTable from "@/components/financial-statistics/DetailedDataTable";
import OtherContributions from "./OtherContributions";

const DataTable = ({ data, loading }) => {
  // Calculate totals
  const totalDebit = data[0].reduce((sum, row) => sum + (row.Debit || 0), 0);
  const totalCredit = data[0].reduce((sum, row) => sum + (row.Credit || 0), 0);
  const totalBalance = totalDebit - totalCredit;

  // Pie Chart Data
  const chartData = [
    { name: "Monthly Donation", value: totalDebit, color: "#ef4444" },
    { name: "Received", value: totalCredit, color: "#10b981" },
    { name: "Balance", value: totalBalance, color: "#3b82f6" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [showDetailedTable, setShowDetailedTable] = useState(false);

  const onPieEnter = (_, index) => setActiveIndex(index);

  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 20) * cos;
    const my = cy + (outerRadius + 20) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
          className="text-lg font-bold"
        >
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy} L${mx},${my} L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          className="text-sm font-semibold"
        >
          {`${value} (${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  return (
    <div className="overflow-x-auto">
      {/* Summary Totals & Pie Chart */}
      <div className="bg-gray-100 p-4 mb-4 rounded-lg shadow-md flex flex-col lg:flex-row justify-end items-center flex-wrap">
        {/* Custom Active Shaped Pie Chart */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <PieChart width={300} height={300}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              dataKey="value"
              onMouseEnter={onPieEnter}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="p-2 sm:p-3 bg-red-200 rounded-md font-semibold">
              Monthly Donation <br />
              <span className="text-red-600">{totalDebit}</span>
            </div>
            <div className="p-2 sm:p-3 bg-green-200 rounded-md font-semibold">
              Received <br />
              <span className="text-green-600">{totalCredit}</span>
            </div>
            <div className="p-2 sm:p-3 bg-blue-200 rounded-md font-semibold">
              Balance <br />
              <span className="text-blue-600">{totalBalance}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="gap-4 flex">
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
