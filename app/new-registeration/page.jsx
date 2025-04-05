"use client";
import React, { useEffect, useState } from "react";
import { decrypt } from "@/utils/Encryption"; // Ensure you have the decrypt function
import { MdOutlineFileUpload } from "react-icons/md"; // Import the file upload icon
import { Loader2 } from "lucide-react"; // Import the loader icon if used
import { useSearchParams } from "next/navigation";

const page = () => {
  // Use the useSearchParams hook correctly
  const searchParams = useSearchParams();

  //state and city
  const [StateDropDown, setStateDropDown] = useState([]);
  const [CityDropDown, setCityDropDown] = useState([]);
  const [CountryDropDown, setCountryDropDown] = useState([]);

  //Personal Information
  const [FamilyDropDown, setFamilyDropDown] = useState([]);
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
  });

  useEffect(() => {
    const encryptedData = searchParams.get("formData");

    if (!encryptedData) return;

    try {
      const decoded = decodeURIComponent(encryptedData); // decode before decrypt
      const decryptedString = decrypt(decoded);

      const decryptedData = JSON.parse(decryptedString);
      console.log("Parsed decrypted data:", decryptedData);

      setFormData((prev) => ({
        ...prev,
        image: decryptedData.PicPath || "",
        name: decryptedData.MemberName || "",
        email: decryptedData.EmailID || "",
        cnic: decryptedData.CNICNo || "",
        bloodGroup: decryptedData.BloodGroupID || "",
        memberType: decryptedData.MemberType || "0",
        nameTitle: decryptedData.NameTitle || "Mr.",
        fatherHusbandName: decryptedData.MemberFatherName || "",
        gender: decryptedData.Gender || "1",
        dob: decryptedData.DOB ? decryptedData.DOB.split("T")[0] : "",
        familyName: decryptedData.FamilyID?.toString() || "0",
        cellNumber: decryptedData.CellNo || "",
        address: decryptedData.PostalAddress || "",
        remarks: decryptedData.Remarks || "",
        country: decryptedData.FromCountryID || "",
        state: decryptedData.FromStateID || "",
        city: decryptedData.FromCityID || "",

        // Map more fields as needed
      }));
    } catch (err) {
      console.error("Failed to decrypt or parse:", err);
    }
  }, [searchParams]);

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

  useEffect(() => {
    fetchDropdownData();
    fetchCountryData();
  }, []);

  const handleChange = (e) => {
    // No need to handle changes in read-only mode
  };

  const handleImageUpload = (e) => {
    // No need to handle image upload in read-only mode
  };

  const handleImageClick = () => {
    // No need to handle image click in read-only mode
  };

  const handleCellNumber = (e) => {
    // No need to handle cell number input in read-only mode
  };

  const handleCNICChange = (e) => {
    // No need to handle CNIC input in read-only mode
  };

  const handlePersonalInfoSave = () => {
    // No need to handle form submission in read-only mode
  };

  return (
    <div>
      {/* Fields */}
      <div className="p-4 text-gray-900">
        <div>
          <div className="text-[13px] md:text-[14px] lg:text-[14px] border border-gray-300 font-crimson md:grid md:grid-cols-2 lg:grid lg:grid-cols-2">
            {/* Left Section */}

            <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row border border-gray-300">
              <div className="flex flex-col w-full">
                {/* Image section */}
                <div className="flex order-[-1] sm:order-none md:order-[-1] lg:order-none items-center border border-r-0 w-full md:w-full border-gray-300 justify-center">
                  <img
                    className="rounded-[50%] w-[80px] h-[80px] md:w-[130px] md:h-[130px] mx-2 my-2"
                    src={
                      formData.image === "" ? "DummyUser.png" : formData.image
                    }
                    alt="Profile"
                  />
                  <div className="flex flex-col gap-2">
                    {/* Disable the image upload button */}
                    <button
                      className={
                        "bg-gray-200 cursor-not-allowed rounded-lg p-1"
                      }
                      title={"Upload profile image"}
                      disabled
                    >
                      <MdOutlineFileUpload />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between sm:flex-row md:flex-row lg:flex-row border border-gray-300">
              <div className="flex flex-col w-full">
                {/* Member Type */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">
                    Member Type <span className="text-red-500">*</span>
                  </div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <select
                      name="memberType"
                      value={formData.memberType}
                      onChange={handleChange}
                      disabled // Disable the select
                      className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600 focus:border-2 focus:border-indigo-800"
                    >
                      <option value={"0"}>Member</option>
                      <option value={"1"}>DOJ</option>
                    </select>
                  </div>
                </div>
                {/* Name */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[30%] py-2 px-2">
                    Name <span className="text-red-500">*</span>
                  </div>
                  <div className="border-l h-full flex items-center border-gray-300">
                    <select
                      name="nameTitle"
                      value={formData.nameTitle}
                      onChange={handleChange}
                      disabled // Disable the select
                      className="border border-gray-300 rounded-2xl my-2 mx-[2px] py-2 px-2 text-gray-600 focus:border-2 focus:border-indigo-800"
                    >
                      <option>Mr.</option>
                      <option>Mrs.</option>
                    </select>
                  </div>

                  <div className="w-[70%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled // Disable the input
                      className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
                {/* Father/Husband Name */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">
                    Father/Husband Name <span className="text-red-500">*</span>
                  </div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      name="fatherHusbandName"
                      value={formData.fatherHusbandName}
                      onChange={handleChange}
                      disabled // Disable the input
                      className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row border border-gray-300">
              <div className="flex flex-col w-full">
                {/* Gender */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">
                    Gender <span className="text-red-500">*</span>
                  </div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled // Disable the select
                      className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600 focus:border-2 focus:border-indigo-800"
                    >
                      <option value={"1"}>Male</option>
                      <option value={"2"}>Female</option>
                    </select>
                  </div>
                </div>
                {/* Date of Birth */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">
                    DOB <span className="text-red-500">*</span>
                  </div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] relative border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      id="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      type="date"
                      disabled // Disable the input
                      className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
                {/* Family Name */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">
                    Family Name <span className="text-red-500">*</span>
                  </div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <select
                      name="familyName"
                      value={formData.familyName}
                      onChange={handleChange}
                      disabled // Disable the select
                      className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600 focus:border-2 focus:border-indigo-800"
                    >
                      <option value="0">Select Family</option>
                      {FamilyDropDown.length > 0
                        ? FamilyDropDown.map((family, index) => (
                            <option key={index} value={family.FamilyID}>
                              {family.FamilyName}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row border border-gray-300">
              <div className="flex flex-col w-full">
                {/* Cell # */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">
                    Cell # <span className="text-red-500">*</span>
                  </div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      type="text"
                      name="cellNumber"
                      value={formData.cellNumber} // Use formData.cellNumber instead of cellNumber state
                      id="cellNumber"
                      onChange={handleCellNumber} // Only call handleCellNumber
                      placeholder="####-#######"
                      disabled // Disable the input
                      className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
                {/* E-mail ID */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">
                    E-mail ID <span className="text-red-500">*</span>
                  </div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled // Disable the input
                      className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600"
                    />
                  </div>
                </div>
                {/* Blood Group */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Blood Group</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      disabled // Disable the select
                      className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600 focus:border-2 focus:border-indigo-800"
                    >
                      <option value="N/A">N/A</option>
                      <option value="1">A+</option>
                      <option value="2">A-</option>
                      <option value="3">B+</option>
                      <option value="4">B-</option>
                      <option value="5">O+</option>
                      <option value="6">O-</option>
                      <option value="7">AB+</option>
                      <option value="8">AB-</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row border border-gray-300">
              <div className="flex flex-col w-full">
                {/* CNIC Number */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">
                    CNIC NO <span className="text-red-500">*</span>
                  </div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      name="cnic"
                      placeholder="00000-000000-0"
                      value={formData.cnic} // Use formData.cnic instead of cnic state
                      id="cnic"
                      onChange={handleCNICChange} // Only call handleCNICChange
                      disabled // Disable the input
                      className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>

                {/* Marital Status */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">
                    Marital Status <span className="text-red-500">*</span>
                  </div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      disabled // Disable the select
                      className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600 focus:border-2 focus:border-indigo-800"
                    >
                      <option value={"1"}>Married</option>
                      <option value={"2"}>Unmarried</option>
                      <option value={"3"}>Divorced</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">
                    Address <span className="text-red-500">*</span>
                  </div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled // Disable the input
                      className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row border border-gray-300">
              <div className="flex flex-col w-full">
                {/* Remarks */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Comments</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      type="text"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      disabled // Disable the input
                      className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-500"
                    />
                  </div>
                </div>

                {/* From Country/State/City */}
                <div className="flex items-center border border-gray-300">
                  <div className="w-[50%] py-2 px-2">
                    From Country/State/City
                  </div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] flex flex-col lg:flex-row border-l border-gray-300">
                    {/* Country Dropdown */}
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      disabled // Disable the select
                      className="w-[90%] lg:w-[30%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600"
                    >
                      <option value="0">Select Country</option>
                      {CountryDropDown.map((country) => (
                        <option key={country.ID} value={country.ID}>
                          {country.CountryName}
                        </option>
                      ))}
                    </select>

                    {/* State Dropdown */}
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled // Disable the select
                      className="w-[90%] lg:w-[33%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600"
                    >
                      <option value="0">Select State</option>
                      {StateDropDown.map((state) => (
                        <option key={state.ID} value={state.ID}>
                          {state.StateName}
                        </option>
                      ))}
                    </select>

                    {/* City Dropdown */}
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled // Disable the select
                      className="w-[90%] lg:w-[30%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600"
                    >
                      <option value="0">Select City</option>
                      {CityDropDown.map((city) => (
                        <option key={city.ID} value={city.ID}>
                          {city.CityName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        {/* <div className="mt-4">
          <button
            onClick={handlePersonalInfoSave}
            disabled // Disable the button
            className="relative group flex items-center gap-2 p-[2px] font-semibold text-white bg-gray-800 shadow-2xl rounded-3xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 w-[40%] mx-auto"
          >
            <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 w-full"></span>

            <span className="relative z-10 flex items-center justify-center w-full bg-gray-950 px-6 py-3 rounded-3xl text-center">
              <Loader2 />
              <span className="transition-all duration-500 group-hover:translate-x-1">
                Submit
              </span>
            </span>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default page;
