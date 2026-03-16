import React, { useEffect, useState } from "react";

const EducationalInformation = ({ EducationData = [] }) => {
  const [HQ, setHQ] = useState([]);
  const [SP, setSP] = useState([]);

  useEffect(() => {
    fetchHQData();
    fetchSPData();
  }, []);

  const fetchHQData = async () => {
    try {
      const response = await fetch(`/api/fill-HigherQualification`);
      const result = await response.json();
      if (response.ok) setHQ(result.data);
    } catch (error) {
      console.log("Error fetching HQ data:", error);
    }
  };

  const fetchSPData = async () => {
    try {
      const response = await fetch(`/api/fill-Specialization`);
      const result = await response.json();
      if (response.ok) setSP(result.data);
    } catch (error) {
      console.log("Error fetching SP data:", error);
    }
  };

  return (
    <div className="mt-6 text-gray-900">
      <h2 className="text-lg font-bold mb-2">Educational Information</h2>
      <div className="text-[12px] md:text-[13px] lg:text-[13px] border border-gray-300 font-crimson bg-white rounded-lg p-2 md:p-4 grid grid-cols-1 gap-2">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-300">
            <thead className="bg-gray-100 text-gray-700">
              <tr className="hidden md:table-row">
                <th className="px-1 py-2 text-left text-xs font-bold">Qualification</th>
                <th className="px-1 py-2 text-left text-xs font-bold">Specialization</th>
                <th className="px-1 py-2 text-left text-xs font-bold">Diploma/Certifications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {EducationData.length === 0 ? (
                <tr className="flex flex-col md:table-row">
                  <td colSpan="3" className="px-1 py-2 text-center text-gray-500">
                    No educational information available
                  </td>
                </tr>
              ) : (
                EducationData.map((item, index) => {
                  const Qualification = HQ.find(
                    (hq) => hq.HQID === Number(item.qualification)
                  );
                  const Specialization = SP.find(
                    (sp) => sp.HQSPId === Number(item.specialization)
                  );
                  return (
                    <tr key={index} className="flex flex-col md:table-row hover:bg-gray-50">
                      <div className="block md:hidden text-xs font-bold">Qualification:</div>
                      <td className="px-1 py-2 text-xs">
                        {Qualification ? Qualification.HighestQualification : "N/A"}
                      </td>
                      <div className="block md:hidden text-xs font-bold">Specialization:</div>
                      <td className="px-1 py-2 text-xs">
                        {Specialization ? Specialization.AreaofSpecialization : ""}
                      </td>
                      <div className="block md:hidden text-xs font-bold">Diploma/Certifications:</div>
                      <td className="px-1 py-2 text-xs">{item.degreeTitle}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EducationalInformation;
