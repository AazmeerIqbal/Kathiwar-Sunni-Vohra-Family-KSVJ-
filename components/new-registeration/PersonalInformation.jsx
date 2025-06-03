import React from "react";

const PersonalInformation = ({
  formData,
  setFormData,
  handleChange,
  handleCellNumber,
  handleCNICChange,
  handleImageClick,
  handleImageUpload,
  fileInputRef,
  selectedImage,
  setSelectedImage,
  CountryDropDown,
  StateDropDown,
  CityDropDown,
  FamilyDropDown,
}) => {
  return (
    <div className="text-gray-900">
      <div>
        <div className="text-[12px] md:text-[13px] lg:text-[13px] border border-gray-300 font-crimson grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1">
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
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <button
                    className={"bg-gray-200 cursor-pointer rounded-lg p-1"}
                    onClick={handleImageClick}
                    title={"Upload profile image"}
                  >
                    <span className="sr-only">Upload</span>
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.707 10.293a1 1 0 00-1.414 0L11 14.586V3a1 1 0 10-2 0v11.586l-4.293-4.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l6-6a1 1 0 000-1.414z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between border border-gray-300">
            <div className="flex flex-col w-full">
              {/* Member Type */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Member Type <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300">
                  <select
                    name="memberType"
                    value={formData.memberType}
                    onChange={handleChange}
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 
                          text-sm"
                  >
                    <option value={"0"}>Member</option>
                    <option value={"1"}>DOJ</option>
                  </select>
                </div>
              </div>
              {/* Name*/}
              <div className="flex items-center border border-gray-300">
                <div className="w-[30%] py-1 px-1">
                  Name <span className="text-red-500">*</span>
                </div>
                <div className="border-l border-gray-300">
                  <select
                    name="nameTitle"
                    value={formData.nameTitle}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 text-sm"
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
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 
                          text-sm"
                  />
                </div>
              </div>
              {/* Father/Husband Name */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Father/Husband Name <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300">
                  <input
                    type="text"
                    name="fatherHusbandName"
                    value={formData.fatherHusbandName}
                    onChange={handleChange}
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 
                          text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between border border-gray-300">
            <div className="flex flex-col w-full">
              {/* Gender */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Gender <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 
                          text-sm"
                  >
                    <option value={"1"}>Male</option>
                    <option value={"2"}>Female</option>
                  </select>
                </div>
              </div>
              {/* Date of Birth */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  DOB <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300">
                  <input
                    id="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    type="date"
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 
                          text-sm"
                  />
                </div>
              </div>
              {/* Family Name */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Family Name <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300">
                  <select
                    name="familyName"
                    value={formData.familyName}
                    onChange={handleChange}
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 
                          text-sm"
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

          <div className="flex flex-col justify-between border border-gray-300">
            <div className="flex flex-col w-full">
              {/* {Cell #} */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Cell # <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300">
                  <input
                    type="text"
                    name="cellNumber"
                    value={formData.cellNumber}
                    id="cellNumber"
                    onChange={handleCellNumber}
                    placeholder="####-#######"
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 
                          text-sm"
                  />
                </div>
              </div>
              {/* E-mail ID */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  E-mail ID <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-[95%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 text-gray-600 
                          text-sm"
                  />
                </div>
              </div>
              {/* Blood Group */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">Blood Group</div>
                <div className="w-[50%] border-l border-gray-300">
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-[95%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 text-gray-600 
                          text-sm"
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

          <div className="flex flex-col justify-between border border-gray-300">
            <div className="flex flex-col w-full">
              {/* CNIC Number */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  CNIC NO <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300">
                  <input
                    type="text"
                    name="cnic"
                    placeholder="00000-000000-0"
                    value={formData.cnic}
                    id="cnic"
                    onChange={handleCNICChange}
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 
                          text-sm"
                  />
                </div>
              </div>

              {/* Marital Status */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Marital Status <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300">
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="border border-gray-300 w-[95%] rounded-xl my-1 mx-1 py-1 px-1 text-gray-600 
                          text-sm"
                  >
                    <option value={"1"}>Married</option>
                    <option value={"2"}>Unmarried</option>
                    <option value={"3"}>Divorced</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Address <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] border-l border-gray-300">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-[95%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 text-gray-600 
                          text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between border border-gray-300">
            <div className="flex flex-col w-full">
              {/* Remarks */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">Comments</div>
                <div className="w-[50%] border-l border-gray-300">
                  <input
                    type="text"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="w-[95%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 text-gray-500 
                          text-sm"
                  />
                </div>
              </div>

              {/* From Country/State/City */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">From Country/State/City</div>
                <div className="w-[50%] flex flex-col lg:flex-row border-l border-gray-300 gap-1">
                  {/* Country Dropdown */}
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full lg:w-[33%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 
                          text-gray-600 text-sm"
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
                    className="w-full lg:w-[33%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 
                          text-gray-600 text-sm"
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
                    className="w-full lg:w-[33%] rounded-xl my-1 mx-1 py-1 px-1 border border-gray-300 
                          text-gray-600 text-sm"
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
    </div>
  );
};

export default PersonalInformation;
