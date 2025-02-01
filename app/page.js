"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import Link from "next/link";

export default function Home() {
  const [UpdatedMembers, setUpdatedMembers] = useState([]);
  const { data: session } = useSession();

  const fetchUpdatedMembers = async () => {
    try {
      // Log the CNIC from the session
      console.log("Fetching data for CNIC:", session.user.cnic);

      // Construct the API URL
      const apiUrl = `/api/get-updatedMembers/${session.user.cnic}`;

      // Make the API call
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Parse the response
      const result = await response.json();

      // Check if the response is successful
      if (response.ok) {
        setUpdatedMembers(result.Members);
        console.log("Updated Members fetched successfully:", result.data);
      } else {
        console.error("Error fetching dropdown data:", result.message);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    fetchUpdatedMembers();
  }, []);

  useEffect(() => {
    console.log(UpdatedMembers);
  }, [UpdatedMembers]);

  return (
    <div className="p-4 md:text-sm text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        <div className="cursor-pointer overflow-hidden relative transition-all duration-500 hover:translate-y-2 bg-neutral-50 rounded-lg shadow-xl flex flex-row items-center justify-evenly gap-2 p-4 before:absolute before:w-full hover:before:top-0 before:duration-500 before:-top-1 before:h-1 before:bg-purple-200">
          <svg
            className="stroke-purple-200 shrink-0"
            height="50"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 100 100"
            width="50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.9,60.7A14.3,14.3,0,0,0,32.2,75H64.3a17.9,17.9,0,0,0,0-35.7h-.4a17.8,17.8,0,0,0-35.3,3.6,17.2,17.2,0,0,0,.4,3.9A14.3,14.3,0,0,0,17.9,60.7Z"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="8"
            ></path>
          </svg>
          <div>
            <span className="font-bold">Card title</span>
            <p className="line-clamp-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>

        <div className="cursor-pointer overflow-hidden relative transition-all duration-500 hover:translate-y-2 bg-neutral-50 rounded-lg shadow-xl flex flex-row items-center justify-evenly gap-2 p-4 before:absolute before:w-full hover:before:top-0 before:duration-500 before:-top-1 before:h-1 before:bg-purple-200">
          <svg
            className="stroke-purple-200 shrink-0"
            height="50"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 100 100"
            width="50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.9,60.7A14.3,14.3,0,0,0,32.2,75H64.3a17.9,17.9,0,0,0,0-35.7h-.4a17.8,17.8,0,0,0-35.3,3.6,17.2,17.2,0,0,0,.4,3.9A14.3,14.3,0,0,0,17.9,60.7Z"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="8"
            ></path>
          </svg>
          <div>
            <span className="font-bold">Card title</span>
            <p className="line-clamp-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>

        <div className="cursor-pointer overflow-hidden relative transition-all duration-500 hover:translate-y-2 bg-neutral-50 rounded-lg shadow-xl flex flex-row items-center justify-evenly gap-2 p-4 before:absolute before:w-full hover:before:top-0 before:duration-500 before:-top-1 before:h-1 before:bg-purple-200">
          <svg
            className="stroke-purple-200 shrink-0"
            height="50"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 100 100"
            width="50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.9,60.7A14.3,14.3,0,0,0,32.2,75H64.3a17.9,17.9,0,0,0,0-35.7h-.4a17.8,17.8,0,0,0-35.3,3.6,17.2,17.2,0,0,0,.4,3.9A14.3,14.3,0,0,0,17.9,60.7Z"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="8"
            ></path>
          </svg>
          <div>
            <span className="font-bold">Card title</span>
            <p className="line-clamp-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {/* Documents Table */}
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
                  <td className="p-2  border-r border-gray-300">
                    {doc.CNICNo}
                  </td>
                  <td className="p-2 gap-2">
                    <Link href={`/update-information?cnic=${doc.CNICNo}`}>
                      <button className="sm:px-4 md:px-4 lg:px-4 px-2 py-2 bg-blue-600 text-white rounded-lg flex gap-[6px] items-center">
                        <FaArrowUpRightFromSquare />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
