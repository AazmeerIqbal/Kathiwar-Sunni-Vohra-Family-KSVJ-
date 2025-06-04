"use client";
import React, { useState } from "react";
import Link from "next/link";
import { encrypt } from "@/utils/Encryption";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

const NewRegisterationRequest = ({ RegisterReq, fetchUpdatedMembers }) => {
  const [cancelingMemberId, setCancelingMemberId] = useState(null);

  const handleCancelReq = async (memberId) => {
    if (!memberId) {
      Swal.fire({
        title: "Error!",
        text: "Invalid member ID",
        icon: "error",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure you want to delete this request?",
      icon: "warning", // Changed to warning since it's a deletion
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setCancelingMemberId(memberId);
      const response = await fetch(`/api/deleteRegisterationReq/${memberId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        fetchUpdatedMembers();
        Swal.fire({
          title: "Deleted!",
          text: data.message || "Request has been deleted successfully.",
          icon: "success",
        });
      } else {
        throw new Error(data.message || "Failed to delete request");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "An error occurred while deleting the request.",
        icon: "error",
      });
    } finally {
      setCancelingMemberId(null);
    }
  };

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
              Email
            </th>
            <th className="border-b py-2 px-4 border-r w-[15%] border-gray-300">
              Cnic
            </th>
            <th className="border-b py-2 px-4 border-r border-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          {RegisterReq.map((doc, index) => (
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
              <td className="p-2  border-r  border-gray-300">{doc.EmailID}</td>
              <td className="p-2  border-r border-gray-300">{doc.CNICNo}</td>
              <td className="p-2 gap-2">
                <div className="flex items-center gap-2">
                  <div>
                    <button className="sm:px-4 md:px-4 lg:px-4 px-2 py-2 bg-red-500 text-white rounded-lg flex gap-[6px] items-center hover:bg-red-600">
                      {cancelingMemberId === doc.memberId ? (
                        <Loader2 className="w-4 h-4 mx-auto animate-spin text-white" />
                      ) : (
                        <MdDelete
                          onClick={() => {
                            handleCancelReq(doc.memberId);
                          }}
                        />
                      )}
                    </button>
                  </div>
                  <div>
                    <Link
                      href={`/approve-registeration?memberId=${encrypt(
                        doc.memberId
                      )}`}
                    >
                      <button className="sm:px-4 md:px-4 lg:px-4 px-2 py-2 bg-blue-500 text-white rounded-lg flex gap-[6px] items-center hover:bg-blue-600">
                        <FaArrowUpRightFromSquare />
                      </button>
                    </Link>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewRegisterationRequest;
