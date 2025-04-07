import React from "react";
import Link from "next/link";
import { encrypt } from "@/utils/Encryption";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

const UpdateInformationRequest = ({ UpdatedMembers }) => {
  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-lg">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border-b md:w-[10px] lg:w-[10px] py-2 px-4 border-r border-gray-300">
              S.NO
            </th>
            <th className="border-b py-2 px-4 w-[60%] border-r  border-gray-300">
              Member Name
            </th>
            <th className="border-b border-gray-300 w-[15%] border-r py-2 px-4">
              Membership #
            </th>
            <th className="border-b py-2 px-4 border-r w-[15%] border-gray-300">
              Cnic
            </th>
            <th className="border-b py-2 px-4 border-r border-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          {UpdatedMembers.map((doc, index) => (
            <tr key={index} className="border-b">
              <td className="md:w-[10px] lg:w-[10px] p-2 sm:px-4 md:px-4 lg:px-4 border-r border-gray-300 text-center">
                {index + 1}
              </td>
              <td className="p-2 border-r flex items-center border-gray-300">
                <div>
                  <img
                    className="rounded-[50%] w-[30px] h-[30px] mx-2 my-2"
                    src={doc.PicPath}
                    alt="Profile"
                  />
                </div>
                <div>{doc.MemberName}</div>
              </td>
              <td className="p-2  border-r  border-gray-300">
                {doc.MemberShipNo}
              </td>
              <td className="p-2  border-r border-gray-300">{doc.CNICNo}</td>
              <td className="p-2 gap-2">
                <Link
                  href={`/update-information?memberId=${encrypt(doc.memberId)}`}
                >
                  <button className="sm:px-4 md:px-4 lg:px-4 px-2 py-2 bg-blue-500 text-white rounded-lg flex gap-[6px] items-center hover:bg-blue-600">
                    <FaArrowUpRightFromSquare />
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateInformationRequest;
