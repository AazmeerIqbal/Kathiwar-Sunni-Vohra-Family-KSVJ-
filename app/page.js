"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Cards from "../components/dashboard/Cards";
import UpdateInformationRequest from "@/components/dashboard/updateInformationRequest";
import NewRegisterationRequest from "@/components/dashboard/NewRegisterationRequest";
import { IoIosDocument, IoMdInformationCircleOutline } from "react-icons/io";
import { FaCircleDollarToSlot } from "react-icons/fa6";

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
            {session.user.isAdmin !== 1 && (
              <>
                <Cards
                  Icon={
                    <IoMdInformationCircleOutline className="stroke-purple-200 shrink-0 text-purple-200 w-12 h-12" />
                  }
                  Heading="Update Information"
                  Text="Manage and update your personal and professional details in one place."
                  link={"/update-information"}
                />
              </>
            )}

            <Cards
              Icon={
                <IoIosDocument className="stroke-purple-200 shrink-0 text-purple-200 w-12 h-12" />
              }
              Heading="News Letter"
              Text={
                session.user.isAdmin !== 1
                  ? "Stay informed with the latest news, announcements and updates."
                  : "Upload Important News, announcements and updates."
              }
              link={"/news-letter"}
            />
            <Cards
              Icon={
                <FaCircleDollarToSlot className="stroke-purple-200 shrink-0 text-purple-200 w-12 h-12" />
              }
              Heading="Financial Statistics"
              Text={
                session.user.isAdmin !== 1
                  ? "Monitor and analyze your financial performance with real-time insights."
                  : "Monitor and analyze Members financial performance with real-time insights."
              }
              link={"/financial-statistics"}
            />
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
