"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RiDownloadCloud2Fill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { ButtonInfoHover } from "@/components/ui/ButtonInfoHover";
import { useSession } from "next-auth/react";
// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import { IoPrintSharp } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const { data: session } = useSession();
  const [Loading, setLoading] = useState(false);
  const [UserData, setUserData] = useState([]);

  // Personal Information Toggle
  const [toggle, setToggle] = useState(false);

  const handleFetchData = async () => {
    try {
      setLoading(true);
      // Log the CNIC from the session
      console.log(session.user.cnic);

      // Construct the API URL
      const apiUrl = `/api/update-information/${session.user.cnic}`;

      // Make the API call
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Parse the response
      const result = await response.json();

      // Check if the response is successful
      if (response.ok) {
        setLoading(false);
        toast.success("User Data Fetched Successfully", {
          position: "top-right",
        });
        setUserData(result.data.recordset[0]);
        console.log("Data fetched successfully:", UserData);
        // Handle success (e.g., update state, display a message, etc.)
      } else {
        setLoading(false);
        console.error("Error fetching data:", result.message);
        // Handle error (e.g., show an error message to the user)
      }
    } catch (error) {
      setLoading(false);
      console.error("Error calling API:", error);
    }
  };

  const router = useRouter();

  const handlePrint = () => {
    // router.push("/update-information/print");
  };

  return (
    <>
      <div className="m-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Update Information</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className=" flex gap-1 items-center my-2 hover:opacity-70 py-2 px-4 bg-[#213555] text-[#f1f1f1] font-semibold rounded-3xl "
            >
              <IoPrintSharp />
              Print
            </button>
            <ButtonInfoHover
              text={"Fetch"}
              info={"Fetch current data from the server"}
              icon={<RiDownloadCloud2Fill className="text-xl my-auto" />}
              Loading={Loading}
              handleFetchData={handleFetchData}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="w-full mt-4 bg-white shadow-lg rounded-lg border border-gray-300">
          <div
            className="flex justify-between items-center p-4 bg-[#2E5077] text-white cursor-pointer rounded-t-lg"
            onClick={() => setToggle((prev) => !prev)}
          >
            <h2 className="font-semibold text-lg">Personal Information</h2>
            <span
              className={`transform transition-transform ${
                toggle ? "rotate-45" : "rotate-0"
              }`}
            >
              <FaPlus />
            </span>
          </div>

          {/* Collapsible Content - Personal Information */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              toggle ? "h-auto" : "max-h-0"
            }`}
          >
            <div className="p-4 text-gray-900">
              <div>
                <div className="text-[13px] md:text-[14px] lg:text-[14px] font-crimson md:grid md:grid-cols-2 lg:grid lg:grid-cols-2 gap-1">
                  {/* Left Section */}
                  <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row border border-gray-300">
                    {/* Profile Image */}
                    <div className="flex order-[-1] sm:order  -none md:order-[-1] lg:order-none items-center  md:w-auto lg:w-auto mx-auto">
                      <img
                        className="rounded-[50%] w-[80px] h-[80px] md:w-[130px] md:h-[130px] mx-2 my-2"
                        src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                        alt="Profile"
                      />
                    </div>
                    {/* Left Sub-Section */}
                    <div className="flex flex-col lg:w-[50%]">
                      {/* Member Type */}
                      <div className="flex items-center border border-gray-300">
                        <div className="w-[50%] py-2 px-2">Member Type</div>
                        <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                          <select className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600">
                            <option>Member</option>
                            <option>Admin</option>
                          </select>
                        </div>
                      </div>
                      {/* Active/Inactive */}
                      <div className="flex items-center border border-gray-300">
                        <div className="w-[50%] py-2 px-2">Active/Inactive</div>
                        <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                          <select className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600">
                            <option>Active</option>
                            <option>Inactive</option>
                          </select>
                        </div>
                      </div>
                      {/* Membership Number */}
                      <div className="flex items-center border border-gray-300">
                        <div className="w-[50%] py-2 px-2">Membership #</div>
                        <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                          <input
                            type="number"
                            placeholder="0002-000016"
                            className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Membership Date */}
                  <div className="flex flex-col ">
                    <div className="flex  items-center border border-gray-300">
                      <div className="w-[50%] py-2 px-2">Membership Date</div>
                      <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                        <input
                          type="date"
                          defaultValue="2012-10-12"
                          className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                        />
                      </div>
                    </div>
                    {/* Name */}
                    <div className="flex items-center border border-gray-300">
                      <div className="w-[30%] py-2 px-2">Name</div>
                      <div className="border-l h-full flex items-center border-gray-300">
                        <select className="border border-gray-300 rounded-2xl my-2 mx-[2px] py-2 px-2 text-gray-600">
                          <option>Mr.</option>
                          <option>Mrs.</option>
                        </select>
                      </div>
                      <div className="w-[70%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                        <input
                          type="text"
                          placeholder="ABDUL MAJEED"
                          className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                        />
                      </div>
                    </div>
                    {/* Father/Husband Name */}
                    <div className="flex items-center border border-gray-300">
                      <div className="w-[50%] py-2 px-2">
                        Father/Husband Name
                      </div>
                      <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                        <input
                          type="text"
                          placeholder="MUHAMMAD HAJI AYUB"
                          className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Family Name */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Family Name</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                      <select className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600">
                        <option>JUNAGARH WALA</option>
                        <option>AHMED FAMILY</option>
                        <option>KHAN FAMILY</option>
                        <option>ALI FAMILY</option>
                        <option>CHAUDHARY FAMILY</option>
                      </select>
                    </div>
                  </div>
                  {/* Date of Birth */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">DOB</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                      <input
                        type="date"
                        defaultValue="1957-07-02"
                        className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                      />
                    </div>
                  </div>
                  {/* CNIC Number */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">CNIC NO</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                      <input
                        type="text"
                        placeholder="42401-7909552-7"
                        className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600"
                      />
                    </div>
                  </div>
                  {/* Gender */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Gender</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                      <select className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600">
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                  {/* Marital Status */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Marital Status</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                      <select className="border border-gray-300 w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 text-gray-600">
                        <option>Married</option>
                        <option>Unmarried</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Cell #</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                      <input
                        type="number"
                        placeholder="0333-2979540"
                        className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600"
                      />
                    </div>
                  </div>

                  {/* E-mail ID */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">E-mail ID</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                      <input
                        type="email"
                        placeholder="N/A"
                        className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Blood Group */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Blood Group</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                      <select className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600">
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

                  {/* From Country/State/City */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">
                      From Country/State/City
                    </div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] flex flex-col md:flex-row border-l border-gray-300">
                      <select className="w-[90%] md:w-[30%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600">
                        <option>Pakistan</option>
                        <option>India</option>
                        <option>Bangladesh</option>
                        <option>Afghanistan</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Canada</option>
                        <option>Australia</option>
                        <option>France</option>
                        <option>Germany</option>
                        <option>Japan</option>
                        <option>China</option>
                        <option>Russia</option>
                      </select>
                      <select className="w-[90%] md:w-[33%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600">
                        <option>Sindhi</option>
                        <option>Punjab</option>
                        <option>Balochistan</option>
                        <option>KPK</option>
                      </select>
                      <select className="w-[90%] md:w-[30%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600">
                        <option>Karachi</option>
                        <option>Lahore</option>
                        <option>Islamabad</option>
                        <option>Peshawar</option>
                        <option>Quetta</option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Address</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                      <input
                        type="text"
                        placeholder="402 C.P BERAR SOCIETY FLAT # 6"
                        className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Death On */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Death On</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                      <input
                        type="text"
                        className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Grave # */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Grave #</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                      <input
                        type="text"
                        className="w-[90%] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="flex items-center border border-gray-300">
                    <div className="w-[50%] py-2 px-2">Remarks</div>
                    <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                      <input
                        type="text"
                        className="w-[90%] h-[150px] rounded-2xl my-2 mx-[0.3rem] py-2 px-2 border border-gray-300 text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Page;
