"use client";
import { useEffect } from "react";

const print = () => {
  useEffect(() => {
    // window.print();
    // window.onafterprint = () => {
    //     window.close(); // Close the window after printing
    // };
  }, []);
  return (
    <>
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
                <h1 className="text-3xl ">KSVJ</h1>
              </div>

              <div className="text-center text-[12px] md:text-[14px] lg:text-[14px]">
                <div className="flex flex-col">
                  <p className="h-6">
                    Portal Adress: Plot # 8/12-A, Sector 12-C North Karachi,
                    Industrial Area, Karachi
                  </p>
                  <p className="h-6">
                    Email: Info@denimcrafts.com Phone: 92-2138963175-6
                  </p>
                  <p className="h-6">Sales Tax Reg No: 17-00-3655-352-18</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[20px] md:text-xl lg:text-2xl flex items-center justify-between gap-2 lg:gap-5 font-crimson py-3">
          <h1>Personal Information</h1>

          {/* Profile Image */}
          <div>
            <img
              className="rounded-[50%] w-[80px] h-[80px] md:w-[130px] md:h-[130px]"
              src="https://www.arabians.pk/static/media/home_page_banner.2faa25771bc9ebe0e983.JPEG"
              alt="Profile"
            />
          </div>
        </div>

        <div>
          <div className="text-[12px] font-sans md:grid md:grid-cols-2 lg:grid lg:grid-cols-5 ">
            {/* Left Section */}
            <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row ">
              {/* Left Sub-Section */}
              <div className="flex flex-col w-full">
                {/* Member Type */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Member Type</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
                {/* Active/Inactive */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Active/Inactive</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
                {/* Membership Number */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Membership #</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>

                {/* Membership Date */}
                <div className="flex  items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Membership Date</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row ">
              <div className="flex flex-col w-full">
                {/* Name */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[30%] py-2 px-2">Name</div>
                  <div className="border-l h-full flex items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                  <div className="w-[70%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
                {/* Father/Husband Name */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Father/Husband Name</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>

                {/* Family Name */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Family Name</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
                {/* Date of Birth */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">DOB</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
              <div className="flex flex-col w-full">
                {/* CNIC Number */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">CNIC NO</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
                {/* Gender */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Gender</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
                {/* Marital Status */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Marital Status</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l md:h-full md:flex md:items-center lg:h-full lg:flex lg:items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
                {/* {Cell #} */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Cell #</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
              <div className="flex flex-col w-full">
                {/* E-mail ID */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">E-mail ID</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
                {/* Blood Group */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Blood Group</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Address</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>

                {/* {Country} */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Country</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
              <div className="flex flex-col w-full">
                {/* {State} */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">State</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>

                {/* {City} */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">City</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>

                {/* Death On */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Death On</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>

                {/* Grave # */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Grave #</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col h-full justify-between sm:flex-row md:flex-col lg:flex-row">
              <div className="flex flex-col w-full">
                {/* Remarks */}
                <div className="flex items-center h-full border border-gray-300">
                  <div className="w-[50%] py-2 px-2">Remarks</div>
                  <div className="w-[50%] md:w-[60%] lg:w-[60%] border-l flex items-center border-gray-300">
                    <input
                      type="text"
                      className="w-[90%] my-2 mx-[0.3rem] outline-none py-2 px-2 text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default print;
