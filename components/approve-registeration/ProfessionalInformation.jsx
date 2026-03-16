import React from "react";

const ProfessionalInformation = ({ ProfessionalDetail = [] }) => {
  return (
    <div className="mt-6 text-gray-900">
      <h2 className="text-lg font-bold mb-2">Professional Information</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="hidden md:table-row">
              <th className="px-1 py-2 text-left text-xs font-bold">Company Name</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Current Position</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Profession</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Experience</th>
              <th className="px-1 py-2 text-left text-xs font-bold">Employeed Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ProfessionalDetail.length === 0 ? (
              <tr className="flex flex-col md:table-row">
                <td colSpan="5" className="px-1 py-2 text-center text-gray-500">
                  No professional information available
                </td>
              </tr>
            ) : (
              ProfessionalDetail.map((item, index) => (
                <tr key={index} className="flex flex-col md:table-row hover:bg-gray-50">
                  <div className="block md:hidden text-xs font-bold">Company Name:</div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {item.companyName || item.CompanyName}
                  </td>
                  <div className="block md:hidden text-xs font-bold">Current Position:</div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {item.currentPosition || item.CurrentPosition}
                  </td>
                  <div className="block md:hidden text-xs font-bold">Current Profession:</div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {item.profession || item.CurrentProfession}
                  </td>
                  <div className="block md:hidden text-xs font-bold">Professional Experience:</div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {item.professionalExp || item.ProfessionalExperience}
                  </td>
                  <div className="block md:hidden text-xs font-bold">Employeed Status:</div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {item.employeeStatus || item.EmployeeUnEmployeed}
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

export default ProfessionalInformation;
