"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown, IoIosSave } from "react-icons/io";
import { MdOutlineFileUpload, MdDelete } from "react-icons/md";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

// Notification Toaster
import { toast } from "react-toastify";
import Loader from "../ui/Loader";
import { FaPlus } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";

const PersonalInformations = ({
  UserData,
  getMemberData,
  CountryDropDown,
  StateDropDown,
  CityDropDown,
  fetchStateData,
  fetchCityData,
  FamilyDropDown,
  setFamilyDropDown,
}) => {
  const { data: session } = useSession();
  const [SaveLoading, setSaveLoading] = useState(false);

  // Personal Information Toggle
  const [toggle, setToggle] = useState(false);

  // Initialize state for form fields
  const [formData, setFormData] = useState({
    image: "",
    memberType: "",
    activeStatus: "",
    membershipNumber: "",
    membershipDate: "",
    nameTitle: "",
    name: "",
    fatherHusbandName: "",
    dob: "",
    cnic: "",
    gender: "",
    cellNumber: "",
    email: "",
    bloodGroup: "",
    familyName: "0",
    maritalStatus: "",
    address: "",
    deathOn: "",
    graveNumber: "",
    remarks: "",
    country: "",
    state: "",
    city: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (UserData) {
      setFormData({
        image: UserData.PicPath ?? "",
        memberType: UserData.memberType ?? "", // Ensure default empty string
        activeStatus: UserData.Status ?? "",
        membershipNumber: UserData.MemberShipNo ?? "",
        membershipDate: UserData.MemberShipDt
          ? dayjs(UserData.MemberShipDt).format("YYYY-MM-DD")
          : "",
        nameTitle: UserData.MemberTitle ?? "",
        name: UserData.MemberName ?? "",
        fatherHusbandName: UserData.MemberFatherName ?? "",
        dob: UserData.DOB ? dayjs(UserData.DOB).format("YYYY-MM-DD") : "",
        cnic: UserData.CNICNo ?? "",
        gender: UserData.Gender ?? "",
        cellNumber: UserData.CellNo ?? "",
        email: UserData.EmailID !== "N/A" ? UserData.EmailID : "",
        bloodGroup: UserData.xBloodGroup !== "N/A" ? UserData.xBloodGroup : "",
        familyName: UserData.FamilyID?.toString() ?? "0",
        maritalStatus: UserData.MaritalStatus ?? "",
        address: UserData.PostalAddress ?? "",
        deathOn: UserData.DeathOn
          ? dayjs(UserData.DeathOn).format("YYYY-MM-DD")
          : "",
        graveNumber: UserData.GraveNumber ?? "",
        remarks: UserData.Remarks ?? "",
        country: UserData.FromCountryID ?? "",
        state: UserData.FromStateID ?? "",
        city: UserData.FromCityID ?? "",
        currentCountry: UserData.CurrentCountry ?? "",
        currentCity: UserData.CurrentCity ?? "",
        currentAddress: UserData.CurrentAddress ?? "",
      });
    }
  }, [UserData]);
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
    try {
      setSaveLoading(true);
      const apiUrl = `/api/savePersonalInfo/${formData.cnic}`;

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
        getMemberData();
        console.log("Data saved successfully:", result);
        toast.success("Saved Successfully", {
          position: "top-right",
        });
      } else {
        setSaveLoading(false);
        console.log("Error saving data:", result.message);
      }
    } catch (error) {
      setSaveLoading(false);
      console.log("Error calling save API:", error);
    }
  };

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
      formDataFile.append("memberId", UserData.memberId || session.user.id);

      const response = await fetch("/api/upload-member-image", {
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
    <>
      <div
        className="flex justify-between items-center h-16 px-4 py-2 bg-[#2E5077] text-white cursor-pointer rounded-t-lg"
        onClick={() => setToggle((prev) => !prev)}
      >
        <h2 className="font-semibold text-lg flex items-center">
          <FaInfoCircle className="mr-2" />
          <p>Personal Information</p>
        </h2>
        <div className="flex items-center gap-4">
          <span
            className={`transform transition-transform duration-300 bg-[#e5e6e7] p-1 rounded-md text-sm ${
              toggle ? "rotate-180" : "rotate-0"
            }`}
          >
            <IoIosArrowDown className="text-black" />
          </span>
        </div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={
          toggle ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="p-4 text-gray-900">
          <div>
            <div className="text-[13px] md:text-[14px] lg:text-[14px] border border-gray-300 font-crimson md:grid md:grid-cols-2 lg:grid lg:grid-cols-2">
              {/* Left Section */}
              <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row border border-gray-300">
                {/* Profile Image */}
                <div className="flex order-[-1] sm:order-none md:order-[-1] lg:order-none items-center border border-r-0 lg:w-[50%] md:w-full border-gray-300 justify-center">
                  <img
                    className="rounded-[50%] w-[80px] h-[80px] md:w-[130px] md:h-[130px] mx-2 my-2"
                    src={
                      formData.image == "" ? "DummyUser.png" : formData.image
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
                      className={`${
                        !UserData
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gray-200 cursor-pointer"
                      } rounded-lg p-1`}
                      onClick={UserData ? handleImageClick : undefined}
                      disabled={!UserData}
                      title={
                        !UserData
                          ? "Save personal information first"
                          : "Upload profile image"
                      }
                    >
                      <MdOutlineFileUpload />
                    </button>
                    {/* <button className="bg-red-400 text-white rounded-lg p-1">
                      <MdDelete />
                    </button> */}
                  </div>
                </div>
                {/* Left Sub-Section */}
                <div className="flex flex-col lg:w-[50%] ">
                  {/* Member Type */}
                  <div className="flex items-center h-full  border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Member Type</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                      <select
                        name="memberType"
                        disabled
                        value={formData.memberType}
                        onChange={handleChange}
                        className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600 focus:border-2 focus:border-indigo-800"
                      >
                        <option>Member</option>
                        <option>Admin</option>
                      </select>
                    </div>
                  </div>
                  {/* Active/Inactive */}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2  px-2">Active/Inactive</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                      <select
                        value={formData.activeStatus}
                        onChange={handleChange}
                        disabled
                        name="activeStatus"
                        className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600 focus:border-2 focus:border-indigo-800"
                      >
                        <option value="0">Active</option>
                        <option value="1">Inactive</option>
                      </select>
                    </div>
                  </div>
                  {/* Membership Number */}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Membership #</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                      <input
                        type="text"
                        name="membershipNumber"
                        placeholder="0000-000000"
                        id="membership"
                        disabled
                        value={formData.membershipNumber}
                        onChange={handleMembershipChange}
                        className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between sm:flex-row md:flex-row lg:flex-row border border-gray-300">
                <div className="flex flex-col w-full">
                  {/* Membership Date */}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Membership Date</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                      <input
                        type="date"
                        name="membershipDate"
                        value={formData.membershipDate}
                        onChange={handleChange}
                        className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                      />
                    </div>
                  </div>
                  {/* Name*/}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[30%] py-2 px-2">Name</div>
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
                    <div className="w-[50%] py-2 px-2">Father/Husband Name</div>
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
                  {/* Date of Birth */}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2 px-2">DOB</div>
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
                  {/* CNIC Number */}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2 px-2">CNIC NO</div>
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
                  {/* Gender */}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Gender</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600 focus:border-2 focus:border-indigo-800"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row border border-gray-300">
                <div className="flex flex-col w-full">
                  {/* {Cell #} */}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Cell #</div>
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
                    <div className="w-[50%] py-2 px-2">E-mail ID</div>
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
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row border border-gray-300">
                <div className="flex flex-col w-full">
                  {/* Family Name */}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Family Name</div>
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

                  {/* Marital Status */}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Marital Status</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600 focus:border-2 focus:border-indigo-800"
                      >
                        <option>Married</option>
                        <option>Unmarried</option>
                      </select>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Remarks</div>
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
                </div>
              </div>

              <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row border border-gray-300">
                <div className="flex flex-col w-full">
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Current Country</div>
                    {/* Current Country Dropdown */}
                    <select
                      name="currentCountry"
                      value={formData.currentCountry}
                      onChange={handleChange}
                      className="w-[90%] lg:w-[45%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600"
                    >
                      <option value="0">Select Country</option>
                      {CountryDropDown.map((country) => (
                        <option key={country.ID} value={country.ID}>
                          {country.CountryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* City # */}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Current City</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                      <input
                        type="text"
                        name="currentCity"
                        value={formData.currentCity}
                        onChange={handleChange}
                        className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600"
                      />
                    </div>
                  </div>

                  {/*Current Address # */}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Current Address</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                      <input
                        type="text"
                        name="currentAddress"
                        value={formData.currentAddress}
                        onChange={handleChange}
                        className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Pakistani Address */}
                  <div className="flex items-center h-full border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Pakistani Address</div>
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

                  {/* From Country/State/City */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">
                      Pakistan Country/State/City
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
          {session.user.isAdmin === 1 ? null : (
            <div className="mt-4">
              <button
                onClick={handlePersonalInfoSave}
                className=" flex gap-1 items-center my-2 hover:opacity-70 py-2 px-4 bg-[#213555] text-[#f1f1f1] font-semibold rounded-3xl "
              >
                {SaveLoading ? <Loader w={4} h={4} /> : <IoIosSave />}
                Save
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default PersonalInformations;
