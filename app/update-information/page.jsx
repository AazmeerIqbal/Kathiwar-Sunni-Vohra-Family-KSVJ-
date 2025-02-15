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
import EducationalInformations from "@/components/update-information/EducationalInformations";
import ProfessionalInformation from "@/components/update-information/ProfessionalInformation";
import LivingInformation from "@/components/update-information/LivingInformation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cnic = decrypt(searchParams.get("cnic"));
  const { data: session } = useSession();
  const [FetchLoading, setFetchLoading] = useState(false);
  const [SbumitLoading, setSbumitLoading] = useState(false);
  const [UserData, setUserData] = useState([]);
  const [MemberId, setMemberId] = useState(null);

  // Personal Information Toggle
  const [toggle, setToggle] = useState(false);

  //state and city
  const [StateDropDown, setStateDropDown] = useState([]);
  const [CityDropDown, setCityDropDown] = useState([]);
  const [CountryDropDown, setCountryDropDown] = useState([]);

  // Get Member Data from Temp Table
  const getMemberData = async () => {
    try {
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
        if (result.data.length > 0) {
          setUserData(result.data[0]);
          fetchStateData(result.data[0].FromCountryID);
          fetchCityData(result.data[0].FromStateID);
          setMemberId(result.data[0].memberId);
        }
      } else {
        console.log("Error fetching data:", result.message);
        // Handle error (e.g., show an error message to the user)
      }
    } catch (error) {
      console.log("Error calling API:", error);
    }
  };

  useEffect(() => {
    getMemberData();
    fetchCountryData();
  }, []);

  // Fetch State
  const fetchCountryData = async () => {
    try {
      const apiUrl = `/api/fill-country`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        setCountryDropDown(result.data);
      } else {
        console.log("Error fetching state data:", result.message);
      }
    } catch (error) {
      console.log("Error calling state API:", error);
    }
  };

  // Fetch State
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
      } else {
        console.log("Error fetching state data:", result.message);
      }
    } catch (error) {
      console.log("Error calling state API:", error);
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
      } else {
        console.log("Error fetching City data:", result.message);
      }
    } catch (error) {
      console.log("Error calling City API:", error);
    }
  };

  const handleFetchData = async () => {
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
        console.log(result.data.recordset[0]);
        setUserData(result.data.recordset[0]);
        fetchStateData(result.data.recordset[0].FromCountryID);
        fetchCityData(result.data.recordset[0].FromStateID);

        setMemberId(result.data.recordset[0].memberId);
      } else {
        setFetchLoading(false);
        console.log("Error fetching data:", result.message);
        // Handle error (e.g., show an error message to the user)
      }
    } catch (error) {
      setFetchLoading(false);
      console.log("Error calling API:", error);
    }
  };

  const handleSubmit = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to submit data to Admin?",
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
        toast.success("Saved Successfully", { position: "top-right" });
      } else {
        setSbumitLoading(false);
        console.log("Error saving data:", result.message);
      }
    } catch (error) {
      setSbumitLoading(false);
      console.log("Error calling save API:", error);
    }
  };

  const handlePrint = () => {
    // router.push("update-information/print");
  };

  return (
    <>
      <div className="m-4 mb-24">
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
              CountryDropDown={CountryDropDown}
              StateDropDown={StateDropDown}
              CityDropDown={CityDropDown}
              fetchStateData={fetchStateData}
              fetchCityData={fetchCityData}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="w-full mt-4 bg-white shadow-lg rounded-lg border border-gray-300">
          <EducationalInformations MemberId={MemberId} />
        </div>

        {/* Personal Information */}
        <div className="w-full mt-4 bg-white shadow-lg rounded-lg border border-gray-300">
          <ProfessionalInformation MemberId={MemberId} />
        </div>

        {/* Living Information */}
        <div className="w-full mt-4 bg-white shadow-lg rounded-lg border border-gray-300">
          <LivingInformation
            MemberId={MemberId}
            CountryDropDown={CountryDropDown}
            StateDropDown={StateDropDown}
            CityDropDown={CityDropDown}
            fetchStateData={fetchStateData}
            fetchCityData={fetchCityData}
          />
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Page;
