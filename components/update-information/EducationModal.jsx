"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Loader from "../ui/Loader";

// Notification Toaster
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EducationModal({
  isOpen,
  onClose,
  MemberId,
  getMemberData,
  HQ,
  SP,
  EducationData,
  setEducationData,
  registerUser,
}) {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { reset } = useForm();

  const [SubmitLoading, setSubmitLoading] = useState(false);

  const onSubmit = async (data) => {
    // if (!MemberId) {
    //   toast.error("Member ID is missing!");
    //   return;
    // }
    // If registerUser is 1, just push data to setEducationData
    if (registerUser === 1) {
      setSubmitLoading(true);
      setEducationData((prev) => [...prev, data]);
      setSubmitLoading(false);
      console.log(EducationData);
      reset();
      onClose();
      toast.success("Added successfully!", {
        position: "top-right",
      });
      return;
    }
    try {
      setSubmitLoading(true);
      console.log("Form Data:", data);
      const api = `/api/insertEducationDetail/${MemberId}`;
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setSubmitLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSubmitLoading(false);
      const result = await response.json();
      console.log("Education detail inserted:", result);
      reset();
      onClose();
      getMemberData();
      toast.success("Uploaded successfully!", {
        position: "top-right",
      });
    } catch (error) {
      setSubmitLoading(false);
      console.log("Error inserting education detail:", error);
    }
  };
  //   console.log("Session: ", session.user);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50  p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl text-xs shadow-lg w-full max-w-2xl p-4 overflow-y-auto max-h-[95vh] scrollbar-custom"
        >
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="font-semibold text-gray-800">
              Member Education Detail
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
          >
            {/* Highest Qualification */}
            <div>
              <label className="text-gray-600 ">Highest Qualification *</label>
              <select
                {...register("qualification", {
                  required: "Qualification is required",
                })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select</option>
                {HQ.map((item) => (
                  <option key={item.HQID} value={item.HQID}>
                    {item.HighestQualification}
                  </option>
                ))}
              </select>
              {errors.qualification && (
                <p className="text-red-500 ">{errors.qualification.message}</p>
              )}
            </div>

            {/* Specialization */}
            <div>
              <label className="text-gray-600 ">Area of Specialization</label>
              <select
                {...register("specialization")}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select</option>
                {SP.map((item) => (
                  <option key={item.HQSPId} value={item.HQSPId}>
                    {item.AreaofSpecialization}
                  </option>
                ))}
              </select>

              {errors.specialization && (
                <p className="text-red-500 ">{errors.specialization.message}</p>
              )}
            </div>

            {/* Degree Title */}
            <div>
              <label className="text-gray-600 ">Degree Title</label>
              <input
                type="text"
                {...register("degreeTitle")}
                className="w-full p-2 border rounded-md"
              />
              {errors.degreeTitle && (
                <p className="text-red-500 ">{errors.degreeTitle.message}</p>
              )}
            </div>

            {/* Institute */}
            {/* <div>
              <label className="text-gray-600 ">Institute</label>
              <input
                type="text"
                {...register("institute")}
                className="w-full p-2 border rounded-md"
              />
              {errors.institute && (
                <p className="text-red-500 ">{errors.institute.message}</p>
              )}
            </div> */}

            {/* Academic Year */}
            {/* <div>
              <label className="text-gray-600">Complition Year</label>
              <input
                type="text"
                {...register("academicYear")}
                className="w-full p-2 border rounded-md"
                placeholder="Enter Academic Year (e.g., 2021-2022)"
              />
              {errors.academicYear && (
                <p className="text-red-500">{errors.academicYear.message}</p>
              )}
            </div> */}

            {/* Completion Year */}
            <div>
              <label className="text-gray-600 ">Completion Year</label>
              <input
                type="number"
                {...register("completionYear", {
                  min: { value: 1970, message: "Enter a valid year (1970+)" },
                  max: {
                    value: new Date().getFullYear(),
                    message: "Year can't be in the future",
                  },
                })}
                className="w-full p-2 border rounded-md"
              />
              {errors.completionYear && (
                <p className="text-red-500 ">{errors.completionYear.message}</p>
              )}
            </div>

            {/* Total Marks */}
            {/* <div>
              <label className="text-gray-600 ">Total Marks</label>
              <input
                type="number"
                {...register("totalMarks")}
                className="w-full p-2 border rounded-md"
              />
              {errors.totalMarks && (
                <p className="text-red-500 ">{errors.totalMarks.message}</p>
              )}
            </div> */}

            {/* Obtain Marks */}
            {/* <div>
              <label className="text-gray-600 ">Obtained Marks</label>
              <input
                type="number"
                {...register("obtainMarks")}
                className="w-full p-2 border rounded-md"
              />
              {errors.obtainMarks && (
                <p className="text-red-500 ">{errors.obtainMarks.message}</p>
              )}
            </div> */}

            {/* CGPA or Grade */}
            {/* <div>
              <label className="text-gray-600 ">CGPA / Percentage</label>
              <input
                type="text"
                {...register("grade")}
                className="w-full p-2 border rounded-md"
              />
              {errors.grade && (
                <p className="text-red-500 ">{errors.grade.message}</p>
              )}
            </div> */}

            {/* Description */}
            <div className="col-span-2">
              <label className="text-gray-600 ">Description / Notes</label>
              <textarea
                {...register("description")}
                className="w-full p-2 border rounded-md h-20"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {SubmitLoading ? <Loader w={4} h={4} /> : "Submit"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      <ToastContainer />
    </>
  );
}
