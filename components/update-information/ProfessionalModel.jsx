"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";

// Notification Toaster
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfessionalModel = ({ isOpen, onClose, MemberId, getMemberData }) => {
  if (!isOpen) return null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { reset } = useForm();

  const [SubmitLoading, setSubmitLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!MemberId) {
      toast.error("Member ID is missing!");
      return;
    }
    try {
      setSubmitLoading(true);
      console.log("Form Data:", data);
      const api = `/api/insertProfessionalInfo/${MemberId}`;
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
      console.log("Professional detail inserted:", result);
      reset();
      // onClose();
      getMemberData();
      toast.success("Uploaded successfully!", {
        position: "top-right",
      });
    } catch (error) {
      setSubmitLoading(false);
      console.error("Error inserting Professional detail:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50  p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl text-xs shadow-lg w-full max-w-2xl p-4 overflow-y-auto max-h-[95vh] scrollbar-custom"
      >
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="font-semibold text-gray-800">
            Professional Information
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
          {" "}
          {/* Qualification */}
          <div>
            <label className="text-gray-600 ">Profession *</label>
            <select
              {...register("profession", {
                required: "Profession is required",
              })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select</option>
              <option value="Salaried Person">Salaried Person</option>
              <option value="Business Owner">Business Owner</option>
              <option value="Self Employeed">Self Employeed</option>
              <option value="House Wife">House Wife</option>
              <option value="Student">Student</option>
            </select>
            {errors.profession && (
              <p className="text-red-500 ">{errors.profession.message}</p>
            )}
          </div>
          <div>
            <label className="text-gray-600">Company Name</label>
            <input
              type="text"
              {...register("companyName")}
              className="w-full p-2 border rounded-md"
              placeholder="Enter Academic Year (e.g., 2021-2022)"
            />
          </div>
          <div>
            <label className="text-gray-600">Current Posistion</label>
            <input
              type="text"
              {...register("currentPosition")}
              className="w-full p-2 border rounded-md"
              placeholder="Enter Academic Year (e.g., 2021-2022)"
            />
          </div>
          <div>
            <label className="text-gray-600 ">Professional Experience</label>
            <select
              {...register("professionalExp")}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select</option>
              <option value="1-2 Years">1-2 Years</option>
              <option value="3-5 Years">3-5 Years</option>
              <option value="More than 5 Years">More than 5 Years</option>
            </select>
          </div>
          <div>
            <label className="text-gray-600 ">Employee Status</label>
            <select
              {...register("employeeStatus", {
                required: "Employee Status is required",
              })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select</option>
              <option value="Under Employement">Under Employement</option>
              <option value="Resigned">Resigned</option>
            </select>
            {errors.employeeStatus && (
              <p className="text-red-500 ">{errors.employeeStatus.message}</p>
            )}
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
  );
};

export default ProfessionalModel;
