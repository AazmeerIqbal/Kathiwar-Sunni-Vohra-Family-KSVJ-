"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const FinancialChart = ({ data }) => {
  // Ensure data is formatted correctly
  const chartData = data?.map((item) => ({
    name: item.MonthName || item.PostDate, // X-axis label
    Credit: item.Credit || 0,
    Debit: item.Debit || 0,
  }));

  return (
    <div className="bg-gradient-to-tl from-rose-100 to-teal-100 p-5 rounded-lg drop-shadow-xl">
      <h2 className="text-xl font-semibold mb-4 ">Financial Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Credit"
            stroke="#34D399"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="Debit"
            stroke="#EF4444"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;
