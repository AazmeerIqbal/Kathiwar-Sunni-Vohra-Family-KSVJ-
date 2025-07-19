"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown, IoIosSave } from "react-icons/io";
import { MdOutlineFileUpload, MdDelete } from "react-icons/md";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Select from "react-select";

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
    currentCountry: "",
    state: "",
    currentCity: "",
    currentAddress: "",
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
        currentCountry: UserData.CurrentCountry ?? "",
        currentCity: UserData.CurrentCity ?? "",
        currentAddress: UserData.CurrentAddress ?? "",
      });
    }
  }, [UserData]);

  const familyOptions =
    FamilyDropDown && FamilyDropDown.length > 0
      ? FamilyDropDown.map((family) => ({
          value: family.FamilyID?.toString(),
          label: family.FamilyName,
        }))
      : [];

  // Debug logging
  console.log("FamilyDropDown:", FamilyDropDown);
  console.log("familyOptions:", familyOptions);
  console.log("formData.familyName:", formData.familyName);

  const countryOptions = CountryDropDown.map((country) => ({
    value: country.ID,
    label: country.CountryName,
  }));

  const bloodGroupOptions = [
    { value: "0", label: "N/A" },
    { value: "1", label: "A+" },
    { value: "2", label: "A-" },
    { value: "3", label: "B+" },
    { value: "4", label: "B-" },
    { value: "5", label: "O+" },
    { value: "6", label: "O-" },
    { value: "7", label: "AB+" },
    { value: "8", label: "AB-" },
  ];

  // Debug logging for blood group
  console.log("formData.bloodGroup:", formData.bloodGroup);
  console.log("bloodGroupOptions:", bloodGroupOptions);

  const pkCountryOptions = CountryDropDown.map((country) => ({
    value: country.ID,
    label: country.CountryName,
  }));
  const pkStateOptions = StateDropDown.map((state) => ({
    value: state.ID,
    label: state.StateName,
  }));
  const pkCityOptions = CityDropDown.map((city) => ({
    value: city.ID,
    label: city.CityName,
  }));

  const selectedCurrentCountry = CountryDropDown.find(
    (country) => country.ID === formData.currentCountry
  );
  const showPakistaniFields =
    selectedCurrentCountry && selectedCurrentCountry.CountryName !== "Pakistan";

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
        setFamilyDropDown(result.family || result.data || []); // Family dropdown data
        console.log("Dropdown data fetched:", result);
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
            <div className="text-[10px] md:text-[13px] lg:text-[13px] border border-gray-300 font-crimson grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1">
              {/* Left Section */}
              <div className="flex flex-col justify-between border border-gray-300">
                <div className="flex flex-col w-full">
                  {/* Image section */}
                  <div className="flex items-center border border-r-0 w-full border-gray-300 justify-center py-2">
                    <img
                      className="rounded-full w-[60px] h-[60px] md:w-[90px] md:h-[90px] mx-1 my-1"
                      src={
                        formData.image == "" ? "DummyUser.png" : formData.image
                      }
                      alt="Profile"
                    />
                    <div className="flex flex-col gap-1">
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
                        <span className="sr-only">Upload</span>
                        <MdOutlineFileUpload />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional fields for update information */}
              <div className="flex flex-col justify-between border border-gray-300">
                <div className="flex flex-col w-full">
                  {/* Active/Inactive */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Active/Inactive</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <select
                        value={formData.activeStatus}
                        onChange={handleChange}
                        disabled
                        name="activeStatus"
                        className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600"
                      >
                        <option value="0">Active</option>
                        <option value="1">Inactive</option>
                      </select>
                    </div>
                  </div>
                  {/* Membership Number */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Membership #</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <input
                        type="text"
                        name="membershipNumber"
                        placeholder="0000-000000"
                        id="membership"
                        disabled
                        value={formData.membershipNumber}
                        onChange={handleMembershipChange}
                        className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600"
                      />
                    </div>
                  </div>
                  {/* Membership Date */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Membership Date</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <input
                        type="date"
                        name="membershipDate"
                        disabled
                        value={formData.membershipDate}
                        onChange={handleChange}
                        className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between border border-gray-300">
                <div className="flex flex-col w-full">
                  {/* Member Type */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Member Type</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <select
                        name="memberType"
                        disabled
                        value={formData.memberType}
                        onChange={handleChange}
                        className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600"
                      >
                        <option value="0">Member</option>
                        <option value="1">Admin</option>
                      </select>
                    </div>
                  </div>
                  {/* Name*/}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[30%] py-1 px-1">Name</div>
                    <div className="border-l border-gray-300">
                      <select
                        name="nameTitle"
                        value={formData.nameTitle}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-xl my-1 mx-1 py-1 px-1 text-gray-600"
                      >
                        <option>Mr.</option>
                        <option>Mrs.</option>
                      </select>
                    </div>

                    <div className="w-[70%] border-l border-gray-300">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600"
                      />
                    </div>
                  </div>
                  {/* Father/Husband Name */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Father/Husband Name</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <input
                        type="text"
                        name="fatherHusbandName"
                        value={formData.fatherHusbandName}
                        onChange={handleChange}
                        className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between border border-gray-300">
                <div className="flex flex-col w-full">
                  {/* Gender */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Gender</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600"
                      >
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                      </select>
                    </div>
                  </div>
                  {/* Date of Birth */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">DOB</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <input
                        id="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        type="date"
                        className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600"
                      />
                    </div>
                  </div>
                  {/* Family Name */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Family Name</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <Select
                        name="familyName"
                        value={
                          familyOptions.find(
                            (opt) => opt.value === formData.familyName
                          ) || null
                        }
                        onChange={(selected) =>
                          handleChange({
                            target: {
                              name: "familyName",
                              value: selected ? selected.value : "",
                            },
                          })
                        }
                        options={familyOptions}
                        isClearable
                        isSearchable
                        placeholder="Select Family"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between border border-gray-300">
                <div className="flex flex-col w-full">
                  {/* {Cell #} */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Cell #</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <input
                        type="text"
                        name="cellNumber"
                        value={formData.cellNumber}
                        id="cellNumber"
                        onChange={handleCellNumber}
                        placeholder="####-#######"
                        className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600"
                      />
                    </div>
                  </div>
                  {/* E-mail ID */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">E-mail ID</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-[95%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between border border-gray-300">
                <div className="flex flex-col w-full">
                  {/* CNIC Number */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">CNIC NO</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <input
                        type="text"
                        name="cnic"
                        placeholder="00000-000000-0"
                        value={formData.cnic}
                        id="cnic"
                        onChange={handleCNICChange}
                        className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Marital Status */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Marital Status</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600"
                      >
                        <option value="1">Married</option>
                        <option value="2">Unmarried</option>
                      </select>
                    </div>
                  </div>

                  {/* Blood Group */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Blood Group</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <Select
                        name="bloodGroup"
                        value={
                          bloodGroupOptions.find(
                            (opt) =>
                              opt.value === formData.bloodGroup?.toString()
                          ) || null
                        }
                        onChange={(selected) =>
                          handleChange({
                            target: {
                              name: "bloodGroup",
                              value: selected ? selected.value : "",
                            },
                          })
                        }
                        options={bloodGroupOptions}
                        isClearable
                        isSearchable
                        placeholder="Select Blood Group"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between border border-gray-300">
                <div className="flex flex-col w-full">
                  {/* Current Country */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Current Country</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <Select
                        name="currentCountry"
                        value={
                          countryOptions.find(
                            (opt) => opt.value === formData.currentCountry
                          ) || null
                        }
                        onChange={(selected) =>
                          handleChange({
                            target: {
                              name: "currentCountry",
                              value: selected ? selected.value : "",
                            },
                          })
                        }
                        options={countryOptions}
                        isClearable
                        isSearchable
                        placeholder="Select Country"
                      />
                    </div>
                  </div>

                  {/* City # */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Current City</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <input
                        type="text"
                        name="currentCity"
                        value={formData.currentCity}
                        onChange={handleChange}
                        className="w-[95%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 text-gray-600"
                      />
                    </div>
                  </div>

                  {/*Current Address # */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Current Address</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <input
                        type="text"
                        name="currentAddress"
                        value={formData.currentAddress}
                        onChange={handleChange}
                        className="w-[95%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 text-gray-600"
                      />
                    </div>
                  </div>

                  {showPakistaniFields && (
                    <>
                      {/* Address In Pakistan */}
                      <div className="flex items-center border border-gray-300">
                        <div className="w-[50%] py-1 px-1">
                          Address In Pakistan
                        </div>
                        <div className="w-[50%] border-l border-gray-300">
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-[95%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 text-gray-600"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* <div className="flex flex-col justify-between border border-gray-300">
                <div className="flex flex-col w-full">
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Remarks</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <input
                        type="text"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        className="w-[95%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Death On</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <input
                        type="date"
                        name="deathOn"
                        value={formData.deathOn}
                        onChange={handleChange}
                        className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">Grave Number</div>
                    <div className="w-[50%] border-l border-gray-300">
                      <input
                        type="text"
                        name="graveNumber"
                        value={formData.graveNumber}
                        onChange={handleChange}
                        className="w-[95%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div> */}
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
