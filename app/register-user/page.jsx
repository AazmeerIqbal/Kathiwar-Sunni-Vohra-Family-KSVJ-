"use client";

import Loader from "@/components/ui/Loader";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoIosSave } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineFileUpload } from "react-icons/md";
import PersonalInformation from "@/components/new-registeration/PersonalInformation";
import EducationalInformations from "@/components/new-registeration/EducationalInformations";
import ProfessionalInformation from "@/components/new-registeration/ProfessionalInformation";
import { Button } from "@/components/ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import WifeInformation from "@/components/new-registeration/WifeInformation";
import ChildrenInformation from "@/components/new-registeration/ChildrenInformation";

const page = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [SaveLoading, setSaveLoading] = useState(false);

  //state and city
  const [StateDropDown, setStateDropDown] = useState([]);
  const [CityDropDown, setCityDropDown] = useState([]);
  const [CountryDropDown, setCountryDropDown] = useState([]);

  //Personal Information
  const [FamilyDropDown, setFamilyDropDown] = useState([]);

  //Educational Informtaion
  const [EducationData, setEducationData] = useState([]);
  const [HQ, setHQ] = useState([]);
  const [SP, setSP] = useState([]);

  // Professional Informaion
  const [ProfessionalDetail, setProfessionalDetail] = useState([]);

  // Wife Informaion
  const [wifeData, setWifeData] = useState([]);
  const [FatherNames, setFatherNames] = useState([]);

  // Children Infotmation
  const [childrenDetail, setChildrenDetail] = useState([]);

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
    currentCountry: "",
    currentCity: "",
    currentAddress: "",
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

  const handleSubmit = async () => {
    try {
      setSaveLoading(true);
      const apiUrl = `/api/registerNewMember`;

      console.log(EducationData);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          education: EducationData,
          profession: ProfessionalDetail,
        }),
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
        setEducationData([]);
        setProfessionalDetail([]);

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

  const steps = [
    {
      title: "Personal Info",
      component: (
        <PersonalInformation
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleCellNumber={handleCellNumber}
          handleCNICChange={handleCNICChange}
          handleImageClick={handleImageClick}
          handleImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          CountryDropDown={CountryDropDown}
          StateDropDown={StateDropDown}
          CityDropDown={CityDropDown}
          FamilyDropDown={FamilyDropDown}
        />
      ),
    },
    {
      title: "Educational Info",
      component: (
        <EducationalInformations
          EducationData={EducationData}
          setEducationData={setEducationData}
          HQ={HQ}
          setHQ={setHQ}
          SP={SP}
          setSP={setSP}
        />
      ),
    },
    {
      title: "Professional Info",
      component: (
        <ProfessionalInformation
          ProfessionalDetail={ProfessionalDetail}
          setProfessionalDetail={setProfessionalDetail}
        />
      ),
    },

    {
      title: "Wife Info",
      component: (
        <WifeInformation
          wifeData={wifeData}
          setWifeData={setWifeData}
          FamilyDropDown={FamilyDropDown}
          FatherNames={FatherNames}
          setFatherNames={setFatherNames}
        />
      ),
    },

    {
      title: "Children Info",
      component: (
        <ChildrenInformation
          childrenDetail={childrenDetail}
          setChildrenDetail={setChildrenDetail}
        />
      ),
    },
  ];

  const handleNext = async () => {
    if (currentStep == 0) {
      const selectedCurrentCountry = CountryDropDown.find(
        (country) => country.ID === formData.currentCountry
      );
      const showPakistaniFields =
        selectedCurrentCountry &&
        selectedCurrentCountry.CountryName !== "Pakistan";

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
        { name: "currentCountry", label: "Current Country" },
        { name: "state", label: "State" },
        { name: "city", label: "City" },
        { name: "currentAddress", label: "Current Address" },
      ];

      if (showPakistaniFields) {
        requiredFields.push({ name: "address", label: "Address In Pakistan" });
      }

      const emptyFields = requiredFields.filter(
        (field) => !formData[field.name] || formData[field.name] === ""
      );

      if (emptyFields.length > 0) {
        // Create toast error message with all missing fields
        const missingFields = emptyFields
          .map((field) => field.label)
          .join(", ");
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

      const cnicCheck = await checkExistingUser(formData.cnic);
      if (cnicCheck.exists) {
        toast.error("A user with this CNIC already exists.", {
          duration: 4000,
          position: "top-center",
        });
        return;
      }
    }
    // If on Educational Info step, store the current EducationData in EducationalInfo
    if (currentStep === 1) {
      // Map EducationData to the required columns and store in EducationalInfo
      const mapped = EducationData.map((item) => ({
        Year: item.AcademicYear || "",
        Qualification: item.HighestQualificationID || "",
        Specialization: item.AreaofSpecializationID || "",
        Institute: item.Institute || "",
        DegreeYear: item.DegreeCompleteInYear || "",
        TotalMarks: item.TotalMarks || "",
        ObtainMarks: item.ObtainMarks || "",
        Percentage: item.Percentage || "",
        Actions: "", // Placeholder for actions
      }));
      setEducationData(mapped);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const checkExistingUser = async (cnic) => {
    try {
      const response = await fetch(`/api/checkExistingUser/${cnic}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return { error: "Network error" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 flex items-center justify-center p-1">
      <Toaster />

      <div className="w-full max-w-[75%] bg-white/60 backdrop-blur-lg rounded-xl shadow-lg p-3 space-y-4 border border-white/20">
        <div>
          <button
            onClick={() => router.push("/login")}
            className="absolute right-3  flex items-center gap-1 md:px-2 md:py-1 px-1 py-1 bg-gray-800 text-white hover:bg-gray-700  font-medium rounded-lg shadow-md transition-all duration-300 md:text-sm text-xs cursor-pointer"
          >
            {/* <ArrowLeft className="md:w-4 md:h-4 h-3 w-3" /> */}
            Close
          </button>
        </div>
        {/* Personal Information  */}
        <div className="bg-transparent">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold mb-4">
              Step {currentStep + 1}: {steps[currentStep].title}
            </h1>
            <div className="bg-white shadow rounded p-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeIn" }}
                >
                  {steps[currentStep].component}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center w-full">
              {currentStep > 0 ? (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="p-0 mt-3 text-xs"
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button
                onClick={handleNext}
                className="p-0 mt-3 text-xs"
                disabled={SaveLoading}
              >
                {SaveLoading ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Submitting...
                  </span>
                ) : currentStep === steps.length - 1 ? (
                  "Submit"
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
