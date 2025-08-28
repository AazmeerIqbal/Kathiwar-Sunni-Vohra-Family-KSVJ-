import React from "react";
import { MdOutlineFileUpload } from "react-icons/md";

const PersonalInformation = ({
  formData,
  CountryDropDown,
  StateDropDown,
  CityDropDown,
  FamilyDropDown,
  FatherNames,
}) => {
  // Helper functions to get label from ID
  const getFamilyName = (id) =>
    FamilyDropDown.find(
      (f) => f.FamilyID?.toString() === (id?.toString() || "")
    )?.FamilyName || "";
  const getCountryName = (id) =>
    CountryDropDown.find((c) => c.ID?.toString() === (id?.toString() || ""))
      ?.CountryName || "";
  const getStateName = (id) =>
    StateDropDown.find((s) => s.ID?.toString() === (id?.toString() || ""))
      ?.StateName || "";
  const getCityName = (id) =>
    CityDropDown.find((c) => c.ID?.toString() === (id?.toString() || ""))
      ?.CityName || "";
  const getFatherName = (id) =>
    FatherNames && Array.isArray(FatherNames)
      ? FatherNames.find(
          (f) => f.memberId?.toString() === (id?.toString() || "")
        )?.MemberName || ""
      : "";
  const getBloodGroup = (id) => {
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
    return (
      bloodGroupOptions.find((b) => b.value === (id?.toString() || ""))
        ?.label || ""
    );
  };
  const getMemberType = (id) => {
    if (id === "1") return "DOJ";
    if (id === "2") return "Overseas";
    return "Member";
  };
  const getGender = (id) => (id === "2" ? "Female" : "Male");
  const getMaritalStatus = (id) => {
    if (id === "2") return "Single";
    if (id === "3") return "Divorced";
    return "Married";
  };

  const selectedCurrentCountry = CountryDropDown.find(
    (country) =>
      country.ID?.toString() === (formData.currentCountry?.toString() || "")
  );
  const showPakistaniFields =
    selectedCurrentCountry && selectedCurrentCountry.CountryName !== "Pakistan";

  return (
    <div className="text-gray-900">
      <div>
        <div className="text-[10px] md:text-[13px] lg:text-[13px] border border-gray-300 font-crimson grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1">
          {/* Left Section */}
          <div className="flex flex-col justify-between border border-gray-300">
            <div className="flex flex-col w-full">
              {/* Image section */}
              <div className="flex items-center border border-r-0 w-full border-gray-300 justify-center py-2">
                <img
                  className="rounded-full w-[60px] h-[60px] md:w-[90px] md:h-[90px] mx-1 my-1"
                  src={formData.image === "" ? "DummyUser.png" : formData.image}
                  alt="Profile"
                />
                <div className="flex flex-col gap-1">
                  <button
                    className={"bg-gray-200 cursor-not-allowed rounded-lg p-1"}
                    title={"Upload profile image"}
                    disabled
                  >
                    <span className="sr-only">Upload</span>
                    <MdOutlineFileUpload />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Member Type */}
          <div className="flex flex-col justify-between border border-gray-300">
            <div className="flex flex-col w-full">
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Member Type <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={getMemberType(formData.memberType)}
                    disabled
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
              {/* Name*/}
              <div className="flex items-center border border-gray-300">
                <div className="w-[30%] py-1 px-1">
                  Name <span className="text-red-500">*</span>
                </div>
                <div className="border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={formData.nameTitle}
                    disabled
                    className="border border-gray-300 rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100 w-[60px]"
                  />
                </div>
                <div className="w-[70%] border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={formData.name}
                    disabled
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
              {/* Father/Husband Name */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Father/Husband Name <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={formData.fatherHusbandName}
                    disabled
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gender, DOB, Family Name */}
          <div className="flex flex-col justify-between border border-gray-300">
            <div className="flex flex-col w-full">
              {/* Gender */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Gender <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={getGender(formData.gender)}
                    disabled
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
              {/* Date of Birth */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  DOB <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={formData.dob}
                    disabled
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
              {/* Family Name */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Family Name <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={getFamilyName(formData.familyName)}
                    disabled
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cell, Email */}
          <div className="flex flex-col justify-between border border-gray-300">
            <div className="flex flex-col w-full">
              {/* Cell # */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Cell # <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={formData.cellNumber}
                    disabled
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
              {/* E-mail ID */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  E-mail ID <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={formData.email}
                    disabled
                    className="w-[95%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CNIC, Marital Status, Blood Group, Reference */}
          <div className="flex flex-col justify-between border border-gray-300">
            <div className="flex flex-col w-full">
              {/* CNIC Number */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  CNIC NO <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={formData.cnic}
                    disabled
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
              {/* Marital Status */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Marital Status <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={getMaritalStatus(formData.maritalStatus)}
                    disabled
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
              {/* Blood Group */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">Blood Group</div>
                <div className="w-[50%] border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={getBloodGroup(formData.bloodGroup)}
                    disabled
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
              {/* Reference */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Reference <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300 flex items-center">
                  <div className="w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100 border border-gray-300 min-h-[40px] flex items-center">
                    {formData.reference ? (
                      <div className="w-full">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="font-semibold text-xs">
                              Name:{" "}
                            </span>
                            <span className="text-xs">
                              {formData.referenceMemberName ||
                                formData.reference}
                            </span>
                          </div>
                          <div className="flex-1 ml-2">
                            <span className="font-semibold text-xs">
                              Father:{" "}
                            </span>
                            <span className="text-xs">
                              {formData.referenceMemberFatherName ||
                                "Not available"}
                            </span>
                          </div>
                          <div className="flex-1 ml-2">
                            <span className="font-semibold text-xs">
                              Family:{" "}
                            </span>
                            <span className="text-xs">
                              {(() => {
                                const referenceMember = FatherNames.find(
                                  (member) =>
                                    member.memberId === formData.reference
                                );
                                if (
                                  referenceMember &&
                                  referenceMember.FamilyID
                                ) {
                                  const family = FamilyDropDown.find(
                                    (f) =>
                                      f.FamilyID === referenceMember.FamilyID
                                  );
                                  return family
                                    ? family.FamilyName
                                    : "Not available";
                                }
                                return "Not available";
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No reference selected
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Reference Number */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Reference Person Number{" "}
                  <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={formData.referenceNumber || ""}
                    disabled
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Current Country, City, Address, Address in Pakistan */}
          <div className="flex flex-col justify-between border border-gray-300">
            <div className="flex flex-col w-full">
              {/* Current Country */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Current Country <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300 flex items-center">
                  <input
                    type="text"
                    value={getCountryName(formData.country)}
                    disabled
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
              {/* Current City */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Current City <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                  <input
                    type="text"
                    value={formData.city}
                    disabled
                    className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-1 px-1 border border-gray-300 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
              {/* Current Address */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Current Address <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                  <input
                    type="text"
                    value={formData.currentAddress}
                    disabled
                    className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-1 px-1 border border-gray-300 text-gray-600 bg-gray-100"
                  />
                </div>
              </div>
              {formData.address.length > 0 && (
                <>
                  {/* Address In Pakistan */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">
                      Address In Pakistan{" "}
                      <span className="text-red-500">*</span>
                    </div>
                    <div className="w-[50%] border-l border-gray-300 flex items-center">
                      <input
                        type="text"
                        value={formData.address || ""}
                        disabled
                        className="w-[95%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 text-gray-600 bg-gray-100"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
