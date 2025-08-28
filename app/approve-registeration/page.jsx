"use client";
import React, { useEffect, useState } from "react";
import { decrypt } from "@/utils/Encryption"; // Ensure you have the decrypt function
import { Loader2 } from "lucide-react"; // Import the loader icon if used
import { useSearchParams } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { CiCircleCheck } from "react-icons/ci";
import Swal from "sweetalert2";
import { MdOutlineFileUpload } from "react-icons/md";
import PersonalInformation from "@/components/approve-registeration/PersonalInformation";
import { useRouter } from "next/navigation";

const page = () => {
  // Use the useSearchParams hook correctly
  const router = useRouter();
  const searchParams = useSearchParams();
  const [memberId, setMemberId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [SbumitLoading, setSbumitLoading] = useState(false);

  useEffect(() => {
    const encryptedMemberId = searchParams.get("memberId");

    if (!encryptedMemberId) return;

    try {
      const decoded = decodeURIComponent(encryptedMemberId); // decode before decrypt
      const decryptedMemberId = decrypt(decoded);
      setMemberId(decryptedMemberId);
      console.log("Decrypted Member ID:", decryptedMemberId);

      // Fetch member data with the decrypted ID
      fetchMemberData(decryptedMemberId);
    } catch (err) {
      console.error("Failed to decrypt memberId:", err);
      setError(
        "Failed to decrypt Member ID from URL. Please check the link and try again."
      );
    }
  }, [searchParams]);

  // Function to fetch member data using the memberId
  const fetchMemberData = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/get-newRegisterationData/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch member data");
      }

      const data = await response.json();
      console.log("Fetched member data:", data);

      // Update form data with the fetched member information
      if (data && data.member) {
        const member = data.member;

        // Prepare country, state, city data
        if (member.FromCountryID) {
          fetchStateData(member.FromCountryID);
        }

        if (member.FromStateID) {
          fetchCityData(member.FromStateID);
        }

        setFormData({
          image: member.PicPath || "",
          memberType: member.MemberType || "0",
          nameTitle: member.NameTitle || "Mr.",
          name: member.MemberName || "",
          fatherHusbandName: member.MemberFatherName || "",
          gender: member.Gender || "1",
          dob: member.DOB ? member.DOB.split("T")[0] : "",
          familyName: member.FamilyID?.toString() || "0",
          cellNumber: member.CellNo || "",
          email: member.EmailID || "",
          bloodGroup: member.BloodGroupID || "N/A",
          cnic: member.CNICNo || "",
          maritalStatus: member.MaritalStatus || "1",
          address: member.PostalAddress || "",
          remarks: member.Remarks || "",
          country: member.CurrentCountry || "0",
          state: member.FromStateID || "0",
          city: member.CurrentCity || "0",
          currentAddress: member.CurrentAddress,
          reference: member.ReferenceMemberName,
          referenceMemberName: member.ReferenceMemberName,
          referenceMemberFatherName: member.ReferenceMemberFatherName,
          referenceNumber: member.ReferenceNum,
        });
      } else {
        setError("No member data found for the given ID.");
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
      setError("Failed to fetch member data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  //state and city
  const [StateDropDown, setStateDropDown] = useState([]);
  const [CityDropDown, setCityDropDown] = useState([]);
  const [CountryDropDown, setCountryDropDown] = useState([]);

  //Personal Information
  const [FamilyDropDown, setFamilyDropDown] = useState([]);
  const [FatherNames, setFatherNames] = useState([]);
  const [formData, setFormData] = useState({
    image: "",
    memberType: "0",
    nameTitle: "Mr.",
    name: "",
    fatherHusbandName: "",
    gender: "1",
    dob: "",
    familyName: "0",
    cellNumber: "",
    email: "",
    bloodGroup: "N/A",
    cnic: "",
    maritalStatus: "1",
    address: "",
    remarks: "",
    country: "0",
    state: "0",
    city: "0",
    reference: "",
    referenceMemberName: "",
    referenceMemberFatherName: "",
    referenceNumber: "",
  });

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

  // Fetch City
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

  const fetchDropdownData = async () => {
    try {
      // Construct the API URL
      const apiUrl = `/api/getFamilyNames`;

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
        setFamilyDropDown(result.family); // Family dropdown data
        console.log("Dropdown data fetched:", result.data);
      } else {
        console.log("Error fetching dropdown data:", result.message);
      }
    } catch (error) {
      console.log("Error calling API:", error);
    }
  };

  const fetchFatherName = async () => {
    try {
      // Construct the API URL
      const apiUrl = `/api/getAllMembersName`;

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
        setFatherNames(result.fathers); // Father dropdown data
        console.log("Fathers data fetched:", result.fathers);
      } else {
        console.log("Error fetching fathers data:", result.message);
      }
    } catch (error) {
      console.log("Error calling fathers API:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    fetchCountryData();
    fetchFatherName();
  }, []);

  const handleChange = (e) => {
    // No need to handle changes in read-only mode
  };

  const handleCellNumber = (e) => {
    // No need to handle cell number input in read-only mode
  };

  const handleCNICChange = (e) => {
    // No need to handle CNIC input in read-only mode
  };

  const handleApprove = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to approve this person as a Member?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setSbumitLoading(true);
      const apiUrl = `/api/approve-newRegisteration/${memberId}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSbumitLoading(false);
        toast.success("Member approved successfully", {
          position: "top-right",
        });
        // Optionally refresh the data after approval
        router.push("/");
      } else {
        setSbumitLoading(false);
        toast.error(`Error: ${result.message}`, { position: "top-right" });
        console.log("Error approving data:", result.message);
      }
    } catch (error) {
      setSbumitLoading(false);
      toast.error("Failed to approve information", { position: "top-right" });
      console.log("Error calling approve API:", error);
    }
  };

  return (
    <div>
      {/* Error message */}
      {error && (
        <div className="p-4 mb-4 text-center text-red-600 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading ? (
        <div className="p-4 mb-4 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600" />
          <p className="mt-2 text-gray-700">Loading member data...</p>
        </div>
      ) : (
        <div className="p-4 text-gray-900">
          <div className="flex sm:flex-row flex-col justify-between sm:items-center mb-3">
            <div>
              <h1 className="text-xl font-bold">Approve New Registeration</h1>
            </div>
            <div>
              {" "}
              <button
                onClick={handleApprove}
                className=" flex gap-1 items-center my-2 hover:opacity-70 py-2 px-4 bg-[#22583e] text-[#f1f1f1] font-semibold rounded-3xl "
              >
                {SbumitLoading ? (
                  <Loader w={4} h={4} />
                ) : (
                  <CiCircleCheck className="text-xl my-auto" />
                )}
                Approve
              </button>
            </div>
          </div>
          <PersonalInformation
            formData={formData}
            FamilyDropDown={FamilyDropDown}
            CountryDropDown={CountryDropDown}
            StateDropDown={StateDropDown}
            CityDropDown={CityDropDown}
            FatherNames={FatherNames}
            handleChange={handleChange}
            handleCellNumber={handleCellNumber}
            handleCNICChange={handleCNICChange}
          />
        </div>
      )}
    </div>
  );
};

export default page;
