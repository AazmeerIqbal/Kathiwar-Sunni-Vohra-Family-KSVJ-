"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RiDownloadCloud2Fill } from "react-icons/ri";
import { ButtonInfoHover } from "@/components/ui/ButtonInfoHover";
import { useSession } from "next-auth/react";
import { FaPlus } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import Loader from "@/components/ui/Loader";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { decrypt } from "@/utils/Encryption";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import { IoPrintSharp } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";

import PersonalInformations from "@/components/update-information/PersonalInformations";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cnic = decrypt(searchParams.get("cnic"));
  console.log(cnic);
  const { data: session } = useSession();
  const [FetchLoading, setFetchLoading] = useState(false);
  const [SbumitLoading, setSbumitLoading] = useState(false);
  const [UserData, setUserData] = useState([]);

  // Personal Information Toggle
  const [toggle, setToggle] = useState(false);

  //state and city
  const [StateDropDown, setStateDropDown] = useState([]);
  const [CityDropDown, setCityDropDown] = useState([]);

  // Get Member Data from Temp Table
  const getMemberData = async () => {
    try {
      console.log("CNIC FOR GET MEMBER DATA", cnic);
      const apiUrl = `/api/getMemberUpdatedData_onload-updateInformation/${cnic}`;

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
        console.log("Member Upadated data:", result);
        if (result.data.length > 0) {
          setUserData(result.data[0]);
          fetchStateData(result.data[0].FromCountryID);
          fetchCityData(result.data[0].FromStateID);
        }
        console.log("Data fetched successfully:", UserData);
      } else {
        console.error("Error fetching data:", result.message);
        // Handle error (e.g., show an error message to the user)
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    getMemberData();
  }, []);

  // Fetch Country
  const fetchStateData = async (selectedCountry) => {
    try {
      const apiUrl = `/api/fill-state/${selectedCountry}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        setStateDropDown(result.data);
        console.log("State data fetched:", result.data);
      } else {
        console.error("Error fetching state data:", result.message);
      }
    } catch (error) {
      console.error("Error calling state API:", error);
    }
  };

  // City Country
  const fetchCityData = async (selectedState) => {
    try {
      const apiUrl = `/api/fill-city/${selectedState}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        setCityDropDown(result.data);
        console.log("City data fetched:", result.data);
      } else {
        console.error("Error fetching City data:", result.message);
      }
    } catch (error) {
      console.error("Error calling City API:", error);
    }
  };

  const handleFetchData = async () => {
    try {
      setFetchLoading(true);

      // Construct the API URL
      const apiUrl = `/api/update-information/${cnic}`;

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
        setFetchLoading(false);
        toast.success("User Data Fetched Successfully", {
          position: "top-right",
        });
        setUserData(result.data.recordset[0]);
        console.log("Data fetched successfully:", UserData);
        fetchStateData(result.data.recordset[0].FromCountryID);
        fetchCityData(result.data.recordset[0].FromStateID);
        // Handle success (e.g., update state, display a message, etc.)
      } else {
        setFetchLoading(false);
        console.error("Error fetching data:", result.message);
        // Handle error (e.g., show an error message to the user)
      }
    } catch (error) {
      setFetchLoading(false);
      console.error("Error calling API:", error);
    }
  };

  const handleSubmit = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to fetch data from the main server?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Confirm!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;
    try {
      setSbumitLoading(true);
      const apiUrl = `/api/finalSubmit-UpdateInformation/${session.user.cnic}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnic: session.user.cnic }), // ✅ Ensure a valid JSON body
      });

      const result = await response.json();

      if (response.ok) {
        setSbumitLoading(false);
        console.log("Data saved successfully:", result);
        toast.success("Saved Successfully", { position: "top-right" });
      } else {
        setSbumitLoading(false);
        console.error("Error saving data:", result.message);
      }
    } catch (error) {
      setSbumitLoading(false);
      console.error("Error calling save API:", error);
    }
  };

  const handlePrint = () => {
    // router.push("update-information/print");
  };

  return (
    <>
      <div className="m-4">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center">
          <div>
            <h1 className="text-xl font-bold">Update Information</h1>
          </div>
          <div className="flex gap-2 ">
            {/* Print */}
            <button
              onClick={handlePrint}
              className=" flex gap-1 items-center my-2 hover:opacity-70 py-2 px-4 bg-[#213555] text-[#f1f1f1] font-semibold rounded-3xl "
            >
              <IoPrintSharp className="text-xl my-auto" />
              Print
            </button>

            {session.user.isAdmin === 1 ? (
              cnic !== "cxaa" && (
                <button
                  // onClick={handleSubmit}
                  className=" flex gap-1 items-center my-2 hover:opacity-70 py-2 px-4 bg-[#22583e] text-[#f1f1f1] font-semibold rounded-3xl "
                >
                  {SbumitLoading ? (
                    <Loader w={4} h={4} />
                  ) : (
                    <MdOutlineFileUpload className="text-xl my-auto" />
                  )}
                  Upload
                </button>
              )
            ) : (
              <>
                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  className=" flex gap-1 items-center my-2 hover:opacity-70 py-2 px-4 bg-[#22583e] text-[#f1f1f1] font-semibold rounded-3xl "
                >
                  {SbumitLoading ? (
                    <Loader w={4} h={4} />
                  ) : (
                    <MdOutlineFileUpload className="text-xl my-auto" />
                  )}
                  Submit
                </button>

                {/* Fetch */}
                <ButtonInfoHover
                  text={"Fetch"}
                  info={"Fetch current data from the server"}
                  icon={<RiDownloadCloud2Fill className="text-xl my-auto" />}
                  FetchLoading={FetchLoading}
                  handleFetchData={handleFetchData}
                />
              </>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="w-full mt-4 bg-white shadow-lg rounded-lg border border-gray-300">
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
              toggle ? "h-auto" : "max-h-0"
            }`}
          >
            <PersonalInformations
              UserData={UserData}
              StateDropDown={StateDropDown}
              CityDropDown={CityDropDown}
              fetchStateData={fetchStateData}
              fetchCityData={fetchCityData}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Page;
