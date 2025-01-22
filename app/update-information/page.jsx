"use client";
import React, { useState } from "react";
import { RiDownloadCloud2Fill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { ButtonInfoHover } from "@/components/ui/ButtonInfoHover";
import { useSession } from "next-auth/react";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const { data: session } = useSession();
  const [Loading, setLoading] = useState(false);
  const [UserData, setUserData] = useState([]);

  // Personal Information Toggle
  const [toggle, setToggle] = useState(false);

  const handleFetchData = async () => {
    try {
      setLoading(true);
      // Log the CNIC from the session
      console.log(session.user.cnic);

      // Construct the API URL
      const apiUrl = `/api/update-information/${session.user.cnic}`;

      // Make the API call
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Parse the response
      const result = await response.json();

      // Check if the response is successful
      if (response.ok) {
        setLoading(false);
        toast.success("User Data Fetched Successfully", {
          position: "top-right",
        });
        setUserData(result.data.recordset[0]);
        console.log("Data fetched successfully:", UserData);
        // Handle success (e.g., update state, display a message, etc.)
      } else {
        setLoading(false);
        console.error("Error fetching data:", result.message);
        // Handle error (e.g., show an error message to the user)
      }
    } catch (error) {
      setLoading(false);
      console.error("Error calling API:", error);
    }
  };

  return (
    <>
      <div className="m-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Update Information</h1>

          <div className="group relative">
            <ButtonInfoHover
              text={"Fetch"}
              info={"Fetch current data from the server"}
              icon={<RiDownloadCloud2Fill className="text-xl my-auto" />}
              Loading={Loading}
              handleFetchData={handleFetchData}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="w-full mt-4 bg-white shadow-lg rounded-lg border border-gray-200">
          <div
            className="flex justify-between items-center p-4 bg-[#2E5077] text-white cursor-pointer rounded-t-lg"
            onClick={() => setToggle((prev) => !prev)}
          >
            <h2 className="font-semibold text-lg">Personal Information</h2>
            <span
              className={`transform transition-transform ${
                toggle ? "rotate-45" : "rotate-0"
              }`}
            >
              <FaPlus />
            </span>
          </div>

          {/* Collapsible Content - Personal Information */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              toggle ? "max-h-[500px]" : "max-h-0"
            }`}
          >
            <div className="p-4 text-gray-700">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
                malesuada.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Page;
