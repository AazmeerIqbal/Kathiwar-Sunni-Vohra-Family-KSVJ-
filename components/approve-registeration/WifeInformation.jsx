import React from "react";

const WifeInformation = ({ wifeData = [], FamilyDropDown = [], FatherNames = [] }) => {
  return (
    <div className="mt-6 text-gray-900">
      <h2 className="text-lg font-bold mb-2">Wife Information</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="hidden md:table-row">
              <th className="px-1 py-2 text-left text-xs font-bold">Wife Name</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Father</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Family</th>
              <th className="px-1 py-2 text-left text-xs font-bold">DOB</th>
              <th className="px-1 py-2 text-left text-xs font-bold">CNIC</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Cell #</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Email</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Marriage Date</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Blood Group</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {wifeData.length === 0 ? (
              <tr className="flex flex-col md:table-row">
                <td colSpan="9" className="px-1 py-2 text-center text-gray-500">
                  No wife information available
                </td>
              </tr>
            ) : (
              wifeData.map((wife, index) => {
                const Father = FatherNames.find(
                  (father) => father.memberId === Number(wife.fatherDetail)
                );
                const Family = FamilyDropDown.find(
                  (family) => family.FamilyID === Number(wife.fatherFamilyName)
                );
                return (
                  <tr key={index} className="flex flex-col md:table-row hover:bg-gray-50">
                    <div className="block md:hidden text-xs font-bold">Wife Name:</div>
                    <td className="px-1 py-2 text-xs">
                      {wife.wifeName || wife.WifeName}
                    </td>
                    <div className="block md:hidden text-xs font-bold">Father:</div>
                    <td className="px-1 py-2 text-xs">
                      {Father ? Father.MemberName : wife.fatherName || wife.WifeFatherName || ""}
                    </td>
                    <div className="block md:hidden text-xs font-bold">Family:</div>
                    <td className="px-1 py-2 text-xs">
                      {Family ? Family.FamilyName : ""}
                    </td>
                    <div className="block md:hidden text-xs font-bold">DOB:</div>
                    <td className="px-1 py-2 text-xs">
                      {wife.dob || wife.DOB ? new Date(wife.dob || wife.DOB).toLocaleDateString() : ""}
                    </td>
                    <div className="block md:hidden text-xs font-bold">CNIC:</div>
                    <td className="px-1 py-2 text-xs">
                      {wife.cnicNo || wife.CNICNo || ""}
                    </td>
                    <div className="block md:hidden text-xs font-bold">Cell #:</div>
                    <td className="px-1 py-2 text-xs">
                      {wife.cellNumber || wife.CellNo || ""}
                    </td>
                    <div className="block md:hidden text-xs font-bold">Email:</div>
                    <td className="px-1 py-2 text-xs">
                      {wife.email || wife.EmailID || ""}
                    </td>
                    <div className="block md:hidden text-xs font-bold">Marriage Date:</div>
                    <td className="px-1 py-2 text-xs">
                      {wife.marriageDate || wife.MarriageDt ? new Date(wife.marriageDate || wife.MarriageDt).toLocaleDateString() : ""}
                    </td>
                    <div className="block md:hidden text-xs font-bold">Blood Group:</div>
                    <td className="px-1 py-2 text-xs">
                      {wife.bloodGroup || wife.xBloodGroup || ""}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WifeInformation;
