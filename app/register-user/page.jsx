"use client";

import Loader from "@/components/ui/Loader";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoIosSave } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineFileUpload } from "react-icons/md";

const page = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [SaveLoading, setSaveLoading] = useState(false);

  //state and city
  const [StateDropDown, setStateDropDown] = useState([]);
  const [CityDropDown, setCityDropDown] = useState([]);
  const [CountryDropDown, setCountryDropDown] = useState([]);

  //Personal Information
  const [FamilyDropDown, setFamilyDropDown] = useState([]);

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

  // Initialize state for form fields
  const [formData, setFormData] = useState({
    image: "",
    memberType: "0",
    activeStatus: "",
    membershipNumber: "",
    membershipDate: "",
    nameTitle: "",
    name: "",
    fatherHusbandName: "",
    dob: "",
    cnic: "",
    gender: "1",
    cellNumber: "",
    email: "",
    bloodGroup: "",
    familyName: "0",
    maritalStatus: "1",
    address: "",
    deathOn: "",
    graveNumber: "",
    remarks: "",
    country: "",
    state: "",
    city: "",
  });

  useEffect(() => {
    fetchDropdownData();
    fetchCountryData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "country") {
      fetchStateData(value);
    }
    if (name === "state") {
      fetchCityData(value);
    }

    console.log(formData);
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

  const [membershipNumber, setMembershipNumber] = useState("");

  const handleMembershipChange = (e) => {
    let value = e.target.value;

    // Remove all non-numeric characters
    value = value.replace(/\D/g, "");

    // Add hyphen (-) after 4 digits
    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4);
    }

    // Limit the length to 11 characters (4 digits + - + 6 digits)
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    // Update the membershipNumber state
    setMembershipNumber(value);

    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      membershipNumber: value, // Update the membershipNumber field in formData
    }));
  };

  const [cnic, setCnic] = useState("");

  const handleCNICChange = (e) => {
    // Remove non-numeric characters and existing dashes
    let value = e.target.value.replace(/[^0-9]/g, "").replace(/-/g, "");

    // Limit input to 13 numeric characters
    if (value.length > 13) value = value.slice(0, 13);

    // Format the value: XXXXX-XXXXXXX-X
    if (value.length > 5 && value.length <= 12) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }
    if (value.length > 12) {
      value =
        value.slice(0, 5) + "-" + value.slice(5, 12) + "-" + value.slice(12);
    }

    // Update the CNIC state
    setCnic(value);

    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      cnic: value, // Update the CNIC field in formData
    }));
    console.log(formData);
  };

  const [cellNumber, setCellNumber] = useState("");

  const handleCellNumber = (e) => {
    let value = e.target.value;

    // Remove all non-numeric characters
    value = value.replace(/\D/g, "");

    // Add hyphen (-) after 4 digits
    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4);
    }

    // Limit the length to 12 characters (4 digits + - + 7 digits)
    if (value.length > 12) {
      value = value.slice(0, 12);
    }

    // Update the cellNumber state
    setCellNumber(value);

    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      cellNumber: value, // Update the cellNumber field in formData
    }));
  };

  const handlePersonalInfoSave = async () => {
    // Validate required fields
    const requiredFields = [
      { name: "memberType", label: "Member Type" },
      { name: "cnic", label: "CNIC No" },
      { name: "dob", label: "Date Of Birth" },
      { name: "gender", label: "Gender" },
      { name: "email", label: "Email ID" },
      { name: "maritalStatus", label: "Marital Status" },
      { name: "familyName", label: "Family Name" },
      { name: "cellNumber", label: "Cell Number" },
      { name: "fatherHusbandName", label: "Father/Husband Name" },
      { name: "name", label: "Name" },
      { name: "address", label: "Address" },
    ];

    // Check for empty fields
    const emptyFields = requiredFields.filter(
      (field) => !formData[field.name] || formData[field.name] === ""
    );

    if (emptyFields.length > 0) {
      // Create toast error message with all missing fields
      const missingFields = emptyFields.map((field) => field.label).join(", ");
      toast.error(`Please fill in required fields: ${missingFields}`, {
        duration: 5000,
        position: "top-center",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    // CNIC validation - must be complete
    if (formData.cnic.length < 15) {
      // 13 digits + 2 hyphens = 15 characters
      toast.error("Please enter a complete 13-digit CNIC number", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    try {
      setSaveLoading(true);
      const apiUrl = `/api/registerNewMember`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSaveLoading(false);
        console.log("Data saved successfully:", result);
        toast.success("Registeration Request Sent to Admin Successfully!", {
          position: "top-center",
          duration: 3000,
        });

        // Clear form fields after successful submission
        setFormData({
          image: "",
          memberType: "0",
          activeStatus: "",
          membershipNumber: "",
          membershipDate: "",
          nameTitle: "",
          name: "",
          fatherHusbandName: "",
          dob: "",
          cnic: "",
          gender: "1",
          cellNumber: "",
          email: "",
          bloodGroup: "",
          familyName: "0",
          maritalStatus: "1",
          address: "",
          deathOn: "",
          graveNumber: "",
          remarks: "",
          country: "",
          state: "",
          city: "",
        });

        // Reset the state variables for CNIC and cell number
        setCnic("");
        setCellNumber("");
        setMembershipNumber("");
        setSelectedImage(null);

        // Redirect after success or reset form
        // router.push("/some-success-page"); // Uncomment if you want to redirect
      } else {
        setSaveLoading(false);
        console.log("Error saving data:", result.message);
        toast.error(
          result.message || "Failed to register member. Please try again.",
          {
            position: "top-center",
            duration: 4000,
          }
        );
      }
    } catch (error) {
      setSaveLoading(false);
      console.log("Error calling save API:", error);
      toast.error("Something went wrong. Please try again later.", {
        position: "top-center",
        duration: 3000,
      });
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes("image")) {
      toast.error("Please select an image file", {
        position: "top-right",
      });
      return;
    }

    setSelectedImage(file);

    try {
      const formDataFile = new FormData();
      formDataFile.append("file", file);

      const response = await fetch("/api/upload-newRegister-image", {
        method: "POST",
        body: formDataFile,
      });

      const result = await response.json();

      if (response.ok) {
        // Update the image in the form
        setFormData((prev) => ({ ...prev, image: result.imagePath }));
        toast.success("Image uploaded successfully", {
          position: "top-right",
        });
      } else {
        toast.error(result.message || "Failed to upload image", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-300 via-green-400 to-rose-700 flex items-center justify-center p-4">
      <Toaster />

      <div className="w-full bg-white/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8 border border-white/20">
        <div className="bg-transparent">
          <div>
            <button
              onClick={() => router.push("/login")}
              className="absolute left-4 top-4 flex items-center gap-1 md:px-4 md:py-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-md transition-all duration-300 md:text-base text-xs"
            >
              <ArrowLeft className="md:w-5 md:h-5 h-3 w-3" />
              Back
            </button>
          </div>
          <div className="text-center space-y-2">
            {/* <span className="text-4xl font-extrabold tracking-wide">KSVJ</span> */}
            <h1 className="md:text-3xl text-xl font-bold text-gray-900 mt-4">
              Register Member
            </h1>
          </div>

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
                          formData.image == ""
                            ? "DummyUser.png"
                            : formData.image
                        }
                        alt="Profile"
                      />
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <button
                          className={
                            "bg-gray-200 cursor-pointer rounded-lg p-1"
                          }
                          onClick={handleImageClick}
                          title={"Upload profile image"}
                        >
                          <MdOutlineFileUpload />
                        </button>
                        {/* <button className="bg-red-400 text-white rounded-lg p-1">
                      <MdDelete />
                    </button> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between sm:flex-row md:flex-row lg:flex-row border border-gray-300">
                  <div className="flex flex-col w-full">
                    {/* Member Type */}
                    <div className="flex items-center h-full  border border-gray-300">
                      <div className="w-[50%] py-2 px-2">
                        Member Type <span className="text-red-500">*</span>
                      </div>
                      <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                        <select
                          name="memberType"
                          value={formData.memberType}
                          onChange={handleChange}
                          className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600 focus:border-2 focus:border-indigo-800"
                        >
                          <option value={"0"}>Member</option>
                          <option value={"1"}>DOJ</option>
                        </select>
                      </div>
                    </div>
                    {/* Name*/}
                    <div className="flex items-center h-full border border-gray-300">
                      <div className="w-[30%] py-2 px-2">
                        Name <span className="text-red-500">*</span>
                      </div>
                      <div className="border-l h-full flex items-center border-gray-300">
                        <select
                          name="nameTitle"
                          value={formData.nameTitle}
                          onChange={handleChange}
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
                          className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                        />
                      </div>
                    </div>
                    {/* Father/Husband Name */}
                    <div className="flex items-center h-full border border-gray-300">
                      <div className="w-[50%] py-2 px-2">
                        Father/Husband Name{" "}
                        <span className="text-red-500">*</span>
                      </div>
                      <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                        <input
                          type="text"
                          name="fatherHusbandName"
                          value={formData.fatherHusbandName}
                          onChange={handleChange}
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
                    {/* {Cell #} */}
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
            <div className="mt-4">
              <button
                onClick={handlePersonalInfoSave}
                className="relative group flex items-center gap-2 p-[2px] font-semibold text-white bg-gray-800 shadow-2xl rounded-3xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 w-[40%] mx-auto"
              >
                {/* Gradient Border Effect */}
                <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 w-full"></span>

                {/* Button Content (Centered Text) */}
                <span className="relative z-10 flex items-center justify-center w-full bg-gray-950 px-6 py-3 rounded-3xl text-center">
                  {SaveLoading ? (
                    <Loader2 />
                  ) : (
                    <span className="transition-all duration-500 group-hover:translate-x-1">
                      Submit
                    </span>
                  )}
                </span>
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
