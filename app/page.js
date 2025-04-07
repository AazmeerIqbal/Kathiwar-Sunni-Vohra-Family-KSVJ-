"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import UpdateInformationRequest from "@/components/dashboard/updateInformationRequest";
import NewRegisterationRequest from "@/components/dashboard/NewRegisterationRequest";

export default function Home() {
  const [UpdatedMembers, setUpdatedMembers] = useState([]);
  const [RegisterReq, setRegisterReq] = useState([]);
  const [Loading, setLoading] = useState([]);
  const { data: session, status } = useSession();

  const fetchUpdatedMembers = async () => {
    if (session.user.isAdmin !== 1) return;
    try {
      setLoading(true);
      // Construct the API URL
      const apiUrl = `/api/get-updatedMembers/${session.user.isAdmin}`;

      // Make the API call
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        setUpdatedMembers(result.Members);
        setRegisterReq(result.RegisterReq);
        setLoading(false);
      } else {
        setLoading(false);
        console.error("Error fetching dropdown data:", result.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    fetchUpdatedMembers();
  }, [session]);

  return (
    <div className="p-4 md:text-sm text-xs">
      {status === "authenticated" ? (
        <>
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </div>

          {/* Requestes */}
          {session.user.isAdmin === 1 ? (
            <div className="mt-6">
              <h3 className="text-xl mb-2 font-bold">
                Update Information Requests
              </h3>
              {UpdatedMembers.length > 0 ? (
                <UpdateInformationRequest UpdatedMembers={UpdatedMembers} />
              ) : (
                <div className="text-center">
                  {Loading ? (
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600" />
                  ) : (
                    "No requests at the moment"
                  )}
                </div>
              )}

              <div className="my-4">
                <h3 className="text-xl mb-2 font-bold">
                  New Registeration Requests
                </h3>
                {RegisterReq.length > 0 ? (
                  <NewRegisterationRequest
                    RegisterReq={RegisterReq}
                    fetchUpdatedMembers={fetchUpdatedMembers}
                  />
                ) : (
                  <div className="text-center">
                    {Loading ? (
                      <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600" />
                    ) : (
                      "No requests at the moment"
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
