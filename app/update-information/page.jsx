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
import WifeInformation from "@/components/update-information/WifeInformation";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import { IoPrintSharp } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";

import PersonalInformations from "@/components/update-information/PersonalInformations";
import EducationalInformations from "@/components/update-information/EducationalInformations";
import ProfessionalInformation from "@/components/update-information/ProfessionalInformation";
import LivingInformation from "@/components/update-information/LivingInformation";
import ChildrenInformation from "@/components/update-information/ChildrenInformation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cnic = decrypt(searchParams.get("cnic"));
  const { data: session } = useSession();
  const [FetchLoading, setFetchLoading] = useState(false);
  const [SbumitLoading, setSbumitLoading] = useState(false);
  const [MemberId, setMemberId] = useState(null);

  //state and city
  const [StateDropDown, setStateDropDown] = useState([]);
  const [CityDropDown, setCityDropDown] = useState([]);
  const [CountryDropDown, setCountryDropDown] = useState([]);

  //Personal Information
  const [UserData, setUserData] = useState([]);
  const [FamilyDropDown, setFamilyDropDown] = useState([]);

  //Educational Informtaion
  const [EducationData, setEducationData] = useState([]);
  const [HQ, setHQ] = useState([]);
  const [SP, setSP] = useState([]);

  // Professional Informaion
  const [ProfessionalDetail, setProfessionalDetail] = useState([]);

  // Living Informaion
  const [LivingDetail, setLivingDetail] = useState([]);

  // Wife Informaion
  const [wifeData, setWifeData] = useState([]);
  const [WifeFamilyDropDown, setWifeFamilyDropDown] = useState([]);
  const [FatherNames, setFatherNames] = useState([]);

  // Children Infotmation
  const [childrenDetail, setChildrenDetail] = useState([]);

  const printData = {
    // State, City and Country
    StateDropDown,
    CityDropDown,
    CountryDropDown,
    // Personal Information
    UserData,
    FamilyDropDown,

    //Educational Information
    EducationData,
    HQ,
    SP,

    // Professional Informaion
    ProfessionalDetail,

    // Living Informaion
    LivingDetail,

    // Wife Informaion
    wifeData,
    WifeFamilyDropDown,
    FatherNames,

    // Children Informaion
    childrenDetail,
  };

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
          console.log("Member Data: ", result.data);
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
    console.log("Print Clicked");
    const printWindow = window.open(
      "update-information/print",
      "PrintWindow",
      "width=800,height=600"
    );

    // Pass the printData to the new window
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.printData = printData; // Make printData accessible in the new window
      };
    }
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
          <PersonalInformations
            UserData={UserData}
            getMemberData={getMemberData}
            CountryDropDown={CountryDropDown}
            StateDropDown={StateDropDown}
            CityDropDown={CityDropDown}
            fetchStateData={fetchStateData}
            fetchCityData={fetchCityData}
            FamilyDropDown={FamilyDropDown}
            setFamilyDropDown={setFamilyDropDown}
          />
        </div>

        {/* Educational Information */}
        <div className="w-full mt-4 bg-white shadow-lg rounded-lg border border-gray-300">
          <EducationalInformations
            MemberId={MemberId}
            EducationData={EducationData}
            setEducationData={setEducationData}
            HQ={HQ}
            setHQ={setHQ}
            SP={SP}
            setSP={setSP}
          />
        </div>

        {/* Personal Information */}
        <div className="w-full mt-4 bg-white shadow-lg rounded-lg border border-gray-300">
          <ProfessionalInformation
            MemberId={MemberId}
            ProfessionalDetail={ProfessionalDetail}
            setProfessionalDetail={setProfessionalDetail}
          />
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
            LivingDetail={LivingDetail}
            setLivingDetail={setLivingDetail}
          />
        </div>

        {/* Wife Information */}
        <div className="w-full mt-4 bg-white shadow-lg rounded-lg border border-gray-300">
          <WifeInformation
            MemberId={MemberId}
            wifeData={wifeData}
            setWifeData={setWifeData}
            WifeFamilyDropDown={WifeFamilyDropDown}
            setWifeFamilyDropDown={setWifeFamilyDropDown}
            FatherNames={FatherNames}
            setFatherNames={setFatherNames}
          />
        </div>

        {/* Children Information */}
        <div className="w-full mt-4 bg-white shadow-lg rounded-lg border border-gray-300">
          <ChildrenInformation
            MemberId={MemberId}
            childrenDetail={childrenDetail}
            setChildrenDetail={setChildrenDetail}
          />
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Page;
