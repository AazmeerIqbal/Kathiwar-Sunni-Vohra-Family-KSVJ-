import React from "react";

const FinancialStatistics = () => {
  return (
    <div className="m-2 p-4 border border-gray-300 rounded-lg md:text-md text-sm">
      <div className="py-4">
        <h4 className="text-xl bold">Financial Statistics</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">On Account</th>
              <th className="py-3 px-4 text-left font-semibold">Date</th>
              <th className="py-3 px-4 text-left font-semibold">Amount</th>
              <th className="py-3 px-4 text-left font-semibold">
                Trasaction ID
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Sample data rows - replace with your actual data */}
            <tr className="hover:bg-gray-50 transition-colors duration-200">
              <td className="py-3 px-4">Membership Fee</td>
              <td className="py-3 px-4">2023-10-15</td>
              <td className="py-3 px-4 font-medium text-green-600">$250.00</td>
              <td className="py-3 px-4">VCH-001</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors duration-200">
              <td className="py-3 px-4">Donation</td>
              <td className="py-3 px-4">2023-11-05</td>
              <td className="py-3 px-4 font-medium text-green-600">$500.00</td>
              <td className="py-3 px-4">VCH-002</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors duration-200">
              <td className="py-3 px-4">Event Fee</td>
              <td className="py-3 px-4">2023-12-20</td>
              <td className="py-3 px-4 font-medium text-green-600">$150.00</td>
              <td className="py-3 px-4">VCH-003</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors duration-200">
              <td className="py-3 px-4">Annual Dues</td>
              <td className="py-3 px-4">2024-01-10</td>
              <td className="py-3 px-4 font-medium text-green-600">$350.00</td>
              <td className="py-3 px-4">VCH-004</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right text-sm text-gray-500">
        <p>Showing 4 of 4 transactions</p>
      </div>
    </div>
  );
};

export default FinancialStatistics;
