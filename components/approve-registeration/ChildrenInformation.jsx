import React from "react";

const bloodGroupMap = {
  1: "A+",
  2: "A-",
  3: "AB+",
  4: "AB-",
  5: "B+",
  6: "B-",
  7: "N/A",
  8: "O+",
  9: "O-",
};

const ChildrenInformation = ({ childrenDetail = [] }) => {
  return (
    <div className="mt-6 text-gray-900">
      <h2 className="text-lg font-bold mb-2">Children Information</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="hidden md:table-row">
              <th className="px-1 py-2 text-left text-xs font-bold">Membership ID</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Child Name</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Gender</th>
              <th className="px-1 py-2 text-left text-xs font-bold">B-Form #</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Blood Group</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Date of Birth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {childrenDetail.length === 0 ? (
              <tr className="flex flex-col md:table-row">
                <td colSpan="6" className="px-1 py-2 text-center text-gray-500">
                  No children information available
                </td>
              </tr>
            ) : (
              childrenDetail.map((item, index) => (
                <tr key={index} className="flex flex-col md:table-row hover:bg-gray-50">
                  <div className="block md:hidden text-xs font-bold">Membership ID:</div>
                  <td className="px-1 py-2 text-xs">
                    {item.MembershipID || item.ChildMemberShipNo}
                  </td>
                  <div className="block md:hidden text-xs font-bold">Child Name:</div>
                  <td className="px-1 py-2 text-xs">{item.ChildName}</td>
                  <div className="block md:hidden text-xs font-bold">Gender:</div>
                  <td className="px-1 py-2 text-xs">
                    {item.Gender === "0" || item.Gender === 0
                      ? "Male"
                      : item.Gender === "1" || item.Gender === 1
                      ? "Female"
                      : "Unknown"}
                  </td>
                  <div className="block md:hidden text-xs font-bold">B-Form #:</div>
                  <td className="px-1 py-2 text-xs">{item.BFormNo}</td>
                  <div className="block md:hidden text-xs font-bold">Blood Group:</div>
                  <td className="px-1 py-2 text-xs">
                    {bloodGroupMap[item.BloodGroupID] || "Unknown"}
                  </td>
                  <div className="block md:hidden text-xs font-bold">Date of Birth:</div>
                  <td className="px-1 py-2 text-xs">
                    {item.DOB ? new Date(item.DOB).toLocaleDateString() : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChildrenInformation;
