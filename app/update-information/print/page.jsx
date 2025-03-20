"use client";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

const PrintPage = () => {
  const [userData, setUserData] = useState(null);
  //state and city
  const [StateDropDown, setStateDropDown] = useState([]);
  const [CityDropDown, setCityDropDown] = useState([]);
  const [CountryDropDown, setCountryDropDown] = useState([]);
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

  useEffect(() => {
    if (window.printData?.UserData) {
      setUserData(window.printData.UserData);
      setStateDropDown(window.printData.StateDropDown);
      setCityDropDown(window.printData.CityDropDown);
      setCountryDropDown(window.printData.CountryDropDown);
      setFamilyDropDown(window.printData.FamilyDropDown);

      //Educational Informtaion
      setEducationData(window.printData.EducationData);
      setHQ(window.printData.HQ);
      setSP(window.printData.SP);

      // Professional Informaion
      setProfessionalDetail(window.printData.ProfessionalDetail);

      // Living Informaion
      setLivingDetail(window.printData.LivingDetail);

      // Wife Informaion
      setWifeData(window.printData.wifeData);
      setWifeFamilyDropDown(window.printData.WifeFamilyDropDown);
      setFatherNames(window.printData.FatherNames);

      // Children Infotmation
      setChildrenDetail(window.printData.childrenDetail);
    }
  }, []);

  console.log("FAMILYYYY: ", FamilyDropDown);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="p-4 lg:p-6 border-collapse min-w-full mx-auto text-gray-900">
      <div>
        <div className="font-bold md:text-3xl text-2xl flex flex-col items-center md:flex-row md:items-[unset] lg:flex-row mx-1 md:mx-4 lg:mx-4">
          <div className="relative flex  flex-row items-center rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 overflow-hidden cursor-pointer ">
            <div
              className="inline-block relative z-2 text-transparent bg-cover animate-gradient"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(0, 229, 255), rgb(0, 71, 171), rgb(0, 229, 255))",
                animationDuration: "4s",
                backgroundClip: "text",
                backgroundSize: "300% 100%",
              }}
            >
              KSVJ
            </div>
          </div>

          <div className="w-[90%] text-center font-crimson font-medium flex flex-col gap-2">
            <div>
              <h1 className="text-3xl ">Kathiawar Sunni Vohra Jamat</h1>
            </div>

            <div className="text-center text-[12px] md:text-[14px] lg:text-[14px]">
              <div className="flex flex-col">
                <p className="h-6">
                  Address: 553/C, Haji Suleman Haji Omer Street, Adamjee Nagar,
                  K.C.H.S. Karachi-75350
                </p>
                <p className="h-6">
                  Email: ksjv_karachi@yahoo.com Phone: 021-34931434
                </p>
                {/* <p className="h-6">Sales Tax Reg No: 17-00-3655-352-18</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[20px] md:text-xl lg:text-2xl flex items-center justify-between gap-2 lg:gap-5 font-crimson py-3">
        <h1 className="text-xl font-semibold">Personal Information</h1>

        {/* Profile Image */}
        {/* <div>
          <img
            className="rounded-[50%] w-[80px] h-[80px] md:w-[130px] md:h-[130px]"
            src="https://www.arabians.pk/static/media/home_page_banner.2faa25771bc9ebe0e983.JPEG"
            alt="Profile"
          />
        </div> */}
      </div>

      {/* Personal Information */}
      <div>
        <div className="text-[12px] font-sans md:grid md:grid-cols-2 lg:grid lg:grid-cols-5 mb-6">
          {/* Left Section */}
          <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row ">
            {/* Left Sub-Section */}
            <div className="flex flex-col w-full">
              {/* Member Type */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">Member Type</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-black">
                  <input
                    type="text"
                    // value={userData.memberType}
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>
              {/* Active/Inactive */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">
                  Active/Inactive
                </div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-black">
                  <input
                    type="text"
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>
              {/* Membership Number */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">Membership #</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-black">
                  <input
                    type="text"
                    value={userData.MemberShipNo}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>

              {/* Membership Date */}
              <div className="flex  items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">
                  Membership Date
                </div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-black">
                  <input
                    type="text"
                    value={userData?.MemberShipDt?.split("T")[0] || ""}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row ">
            <div className="flex flex-col w-full">
              {/* Name */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[30%] py-1 px-2 font-bold">Name</div>
                <div className="border-l h-full flex items-center border-black">
                  <input
                    type="text"
                    value={userData?.MemberTitle || ""}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
                <div className="w-[70%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-black">
                  <input
                    type="text"
                    value={userData?.MemberName || ""}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>
              {/* Father/Husband Name */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">
                  Father/Husband Name
                </div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-black">
                  <input
                    type="text"
                    value={userData?.MemberFatherName || ""}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>
              {/* Family Name */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">Family Name</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-black">
                  <input
                    type="text"
                    value={
                      FamilyDropDown.find(
                        (family) => family.FamilyID === userData?.FamilyID
                      )?.FamilyName || ""
                    }
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                    readOnly
                  />
                </div>
              </div>
              {/* Date of Birth */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">DOB</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-black">
                  <input
                    type="text"
                    value={userData?.DOB ? userData.DOB.split("T")[0] : ""}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
            <div className="flex flex-col w-full">
              {/* CNIC Number */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">CNIC NO</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-black">
                  <input
                    type="text"
                    value={userData?.CNICNo || ""}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>
              {/* Gender */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">Gender</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-black">
                  <input
                    type="text"
                    value={
                      userData?.Gender === 0
                        ? "Male"
                        : userData?.Gender === 1
                        ? "Female"
                        : ""
                    }
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>
              {/* Marital Status */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">
                  Marital Status
                </div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-black">
                  <input
                    type="text"
                    value={userData?.MaritalStatus || ""}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>
              {/* {Cell #} */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">Cell #</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-black">
                  <input
                    type="text"
                    value={userData?.CellNo || ""}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
            <div className="flex flex-col w-full">
              {/* E-mail ID */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">E-mail ID</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-black">
                  <input
                    type="text"
                    value={userData?.EmailID || ""}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>
              {/* Blood Group */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">Blood Group</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-black">
                  <input
                    type="text"
                    value={userData?.xBloodGroup || ""}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">Address</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-black">
                  <input
                    type="text"
                    value={userData?.PostalAddress || ""}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>

              {/* {Country} */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">Country</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-black">
                  <input
                    type="text"
                    value={
                      CountryDropDown.find(
                        (con) => con.ID === userData?.FromCountryID
                      )?.CountryName || ""
                    }
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
            <div className="flex flex-col w-full">
              {/* {State} */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">State</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-black">
                  <input
                    type="text"
                    value={
                      StateDropDown.find(
                        (state) => state.ID === userData?.FromStateID
                      )?.StateName || ""
                    }
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>

              {/* {City} */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">City</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-black">
                  <input
                    type="text"
                    value={
                      CityDropDown.find(
                        (city) => city.ID === userData?.FromCityID
                      )?.CityName || ""
                    }
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>

              {/* Death On */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">Death On</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-black">
                  <input
                    type="text"
                    value={
                      userData?.DeathOn
                        ? dayjs(userData.DeathOn).format("YYYY-MM-DD")
                        : ""
                    }
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>

              {/* Grave # */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">Grave #</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-black">
                  <input
                    type="text"
                    value={userData?.GraveNumber || ""}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-black"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full justify-between sm:flex-row md:flex-col lg:flex-row">
            <div className="flex flex-col w-full">
              {/* Remarks */}
              <div className="flex items-center h-full border border-black">
                <div className="w-[50%] py-1 px-2 font-bold">Remarks</div>
                <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-black">
                  <input
                    type="text"
                    value={userData?.Remarks || ""}
                    readOnly
                    className="w-[90%] my-2 mx-[0.3rem] outline-none py-1 px-2 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Educational Information */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">
            Educational Information
          </h2>
          <table className="min-w-full border border-black bg-white table-fixed text-xs">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="py-1 border border-black w-[10vw]">Year</th>
                <th className="py-1 border border-black w-[10vw]">
                  Qualification
                </th>
                <th className="py-1 border border-black w-[10vw]">
                  Specialization
                </th>
                <th className="py-1 border border-black w-[10vw]">Institute</th>
                <th className="py-1 border border-black w-[10vw]">
                  Degree Year
                </th>
                <th className="py-1 border border-black w-[10vw]">
                  Total Marks
                </th>
                <th className="py-1 border border-black w-[10vw]">
                  Obtain Marks
                </th>
                <th className="py-1 border border-black w-[10vw]">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {EducationData && EducationData.length > 0 ? (
                EducationData.map((item, index) => {
                  // Find Qualification Name
                  const qualification = HQ.find(
                    (hq) => hq.HQID === item.HighestQualificationID
                  );

                  // Find Specialization Name
                  const specialization = SP.find(
                    (sp) => sp.HQSPId === item.AreaofSpecializationID
                  );
                  return (
                    <tr key={index} className="text-center border">
                      <td className="p-1 border border-black">
                        {item.AcademicYear}
                      </td>
                      <td className="p-1 border border-black">
                        {qualification.HighestQualification || "N/A"}
                      </td>
                      <td className="p-1 border border-black">
                        {specialization.AreaofSpecialization || "N/A"}
                      </td>
                      <td className="p-1 border border-black">
                        {item.Institute}
                      </td>
                      <td className="p-1 border border-black">
                        {item.DegreeCompleteInYear}
                      </td>
                      <td className="p-1 border border-black">
                        {item.TotalMarks}
                      </td>
                      <td className="p-1 border border-black">
                        {item.ObtainMarks}
                      </td>
                      <td className="p-1 border border-black">
                        {item.Percentage}%
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    No educational data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Professional Information */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Professional Education</h2>
          <table className="min-w-full bg-white border border-black text-xs">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  Company Name
                </th>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  Current Position
                </th>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  Profession
                </th>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  Experience
                </th>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  Employment Status
                </th>
              </tr>
            </thead>
            <tbody>
              {ProfessionalDetail && ProfessionalDetail.length > 0 ? ( // ✅ Safe check
                ProfessionalDetail.map((item) => (
                  <tr key={item.MemberProID} className="border">
                    <td className="px-2 py-1 border border-black ">
                      {item.CompanyName}
                    </td>
                    <td className="px-2 py-1 border border-black">
                      {item.CurrentPosition}
                    </td>
                    <td className="px-2 py-1 border border-black">
                      {item.CurrentProfession}
                    </td>
                    <td className="px-2 py-1 border border-black">
                      {item.ProfessionalExperience}
                    </td>
                    <td className="px-2 py-1 border border-black">
                      {item.EmployeeUnEmployeed}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No professional details available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Living Information */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Living Information</h2>

          <table className="min-w-full bg-white border border-black text-xs">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  Country
                </th>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  State
                </th>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  City
                </th>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  Address
                </th>
              </tr>
            </thead>
            <tbody>
              {LivingDetail && LivingDetail.length > 0 ? (
                LivingDetail.map((item) => (
                  <tr key={item.LivingId} className="border">
                    <td className="px-2 py-1 border border-black">
                      {CountryDropDown.find(
                        (con) => con.ID === item.LivingCountryID
                      )?.CountryName || ""}
                    </td>
                    <td className="px-2 py-1 border border-black">
                      {StateDropDown.find(
                        (state) => state.ID === item.LivingStateID
                      )?.StateName || ""}
                    </td>
                    <td className="px-2 py-1 border border-black">
                      {CityDropDown.find(
                        (city) => city.ID === item.LivingCityID
                      )?.CityName || ""}
                    </td>
                    <td className="px-2 py-1 border border-black">
                      {item.Address}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No living details available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Wife Information */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Wife Information</h2>
          <table className="w-full border-collapse border border-black text-xs">
            <thead className="bg-gray-200 text-black">
              <tr>
                {[
                  "Wife Name",
                  "Father",
                  "Family",
                  "DOB",
                  "CNIC",
                  "Cell #",
                  "Email",
                  "Marriage Date",
                  "Blood Group",
                  "Status",
                  "Death On",
                  "Grave Number",
                ].map((header) => (
                  <th
                    key={header}
                    className="border border-black px-2 py-1 text-left font-bold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!wifeData || wifeData.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center py-4 text-gray-500">
                    No wife information available
                  </td>
                </tr>
              ) : (
                wifeData.map((wife, index) => (
                  <tr key={index} className="border">
                    <td className="border border-black px-2 py-1">
                      {wife.WifeName}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {wife.WifeFatherName}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {WifeFamilyDropDown.find(
                        (family) => family.FamilyID === wife.FamilyID
                      )?.FamilyName || "N/A"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {new Date(wife.DOB).toLocaleDateString()}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {wife.CNICNo}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {wife.CellNo}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {wife.EmailID}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {new Date(wife.MarriageDt).toLocaleDateString()}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {wife.xBloodGroup}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {wife.MaritalStatus}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {wife.DeathOn !== "1900-01-01T00:00:00.000Z"
                        ? new Date(wife.DeathOn).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {wife.GraveNumber || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Children Information */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Children Information</h2>
          <table className="min-w-full bg-white border border-black rounded-lg text-xs">
            <thead className="bg-gray-200 text-black">
              <tr>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  Membership ID
                </th>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  Child Name
                </th>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  Gender
                </th>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  B-Form #
                </th>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  Blood Group
                </th>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  Date of Birth
                </th>
                <th className="px-2 py-1 text-left font-bold border border-black">
                  Age
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {childrenDetail && childrenDetail?.length > 0 ? (
                childrenDetail.map((item) => (
                  <tr key={item.memberChildId} className="hover:bg-gray-50">
                    <td className="px-2 py-1 border border-black">
                      {item.ChildMemberShipNo}
                    </td>
                    <td className="px-2 py-1 border border-black">
                      {item.ChildName}
                    </td>
                    <td className="px-2 py-1 border border-black">
                      {item.Gender === 0
                        ? "Male"
                        : item.Gender === 1
                        ? "Female"
                        : "Unknown"}
                    </td>
                    <td className="px-2 py-1 border border-black">
                      {item.BFormNo}
                    </td>
                    <td className="px-2 py-1">
                      {item.BloodGroupID || "Unknown"}
                    </td>
                    <td className="px-2 py-1 border border-black">
                      {item.DOB}
                    </td>
                    <td className="px-2 py-1 border border-black">
                      {item.Age18}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default PrintPage;
