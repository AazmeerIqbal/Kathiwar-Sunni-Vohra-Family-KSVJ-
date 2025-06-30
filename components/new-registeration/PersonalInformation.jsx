import React from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import Select from "react-select";

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
  const familyOptions = FamilyDropDown.map((family) => ({
    value: family.FamilyID,
    label: family.FamilyName,
  }));

  const countryOptions = CountryDropDown.map((country) => ({
    value: country.ID,
    label: country.CountryName,
  }));

  const bloodGroupOptions = [
    { value: "N/A", label: "N/A" },
    { value: "1", label: "A+" },
    { value: "2", label: "A-" },
    { value: "3", label: "B+" },
    { value: "4", label: "B-" },
    { value: "5", label: "O+" },
    { value: "6", label: "O-" },
    { value: "7", label: "AB+" },
    { value: "8", label: "AB-" },
  ];

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
                    <MdOutlineFileUpload />
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
                    <option value={"2"}>Overseas</option>
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

              {/* Blood Group */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">Blood Group</div>
                <div className="w-[50%] border-l border-gray-300">
                  <Select
                    name="bloodGroup"
                    value={
                      bloodGroupOptions.find(
                        (opt) => opt.value === formData.bloodGroup
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

              {/* Comments */}
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
            </div>
          </div>

          <div className="flex flex-col justify-between border border-gray-300">
            <div className="flex flex-col w-full">
              {/* Current Country */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Current Country <span className="text-red-500">*</span>
                </div>
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
                <div className="w-[50%] py-1 px-1">
                  Current City <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                  <input
                    type="text"
                    name="currentCity"
                    value={formData.currentCity}
                    onChange={handleChange}
                    className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-1 px-1 border border-gray-300 text-gray-600"
                  />
                </div>
              </div>

              {/*Current Address # */}
              <div className="flex items-center border border-gray-300">
                <div className="w-[50%] py-1 px-1">
                  Current Address <span className="text-red-500">*</span>
                </div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                  <input
                    type="text"
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleChange}
                    className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-1 px-1 border border-gray-300 text-gray-600"
                  />
                </div>
              </div>

              {showPakistaniFields && (
                <>
                  {/* Address In Pakistan */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">
                      Address In Pakistan{" "}
                      <span className="text-red-500">*</span>
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
                  {/* Pakistani Country/State/City */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-1 px-1">
                      Pakistani Country/State/City
                    </div>
                    <div className="w-[50%] flex flex-col lg:flex-row border-l border-gray-300 gap-1">
                      {/* Country Dropdown */}
                      <Select
                        name="country"
                        value={
                          pkCountryOptions.find(
                            (opt) => opt.value === formData.country
                          ) || null
                        }
                        onChange={(selected) =>
                          handleChange({
                            target: {
                              name: "country",
                              value: selected ? selected.value : "",
                            },
                          })
                        }
                        options={pkCountryOptions}
                        isClearable
                        isSearchable
                        placeholder="Select Country"
                      />

                      {/* State Dropdown */}
                      <Select
                        name="state"
                        value={
                          pkStateOptions.find(
                            (opt) => opt.value === formData.state
                          ) || null
                        }
                        onChange={(selected) =>
                          handleChange({
                            target: {
                              name: "state",
                              value: selected ? selected.value : "",
                            },
                          })
                        }
                        options={pkStateOptions}
                        isClearable
                        isSearchable
                        placeholder="Select State"
                      />

                      {/* City Dropdown */}
                      <Select
                        name="city"
                        value={
                          pkCityOptions.find(
                            (opt) => opt.value === formData.city
                          ) || null
                        }
                        onChange={(selected) =>
                          handleChange({
                            target: {
                              name: "city",
                              value: selected ? selected.value : "",
                            },
                          })
                        }
                        options={pkCityOptions}
                        isClearable
                        isSearchable
                        placeholder="Select City"
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
