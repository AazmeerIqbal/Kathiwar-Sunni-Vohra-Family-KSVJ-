import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Loader from "../ui/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChildrenModal = ({ isOpen, onClose, MemberId, getChildrenData }) => {
  if (!isOpen) return null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [submitLoading, setSubmitLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!MemberId) {
      toast.error("Member ID is missing!");
      return;
    }
    console.log("Form Data:", data);
    try {
      setSubmitLoading(true);
      console.log("Form Data:", data);
      const api = `/api/insertChildrenDetail/${MemberId}`;
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
      console.log("Children detail inserted:", result);
      reset();
      onClose();
      getChildrenData();
      toast.success("Uploaded successfully!", {
        position: "top-right",
      });
    } catch (error) {
      setSubmitLoading(false);
      console.log("Error inserting children detail:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl text-xs shadow-lg w-full max-w-2xl p-4 overflow-y-auto max-h-[95vh] scrollbar-custom"
      >
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="font-semibold text-gray-800">Children Information</h2>
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
          {/* Membership ID */}
          <div>
            <label className="text-gray-600">Membership ID</label>
            <input
              {...register("MembershipID")}
              className="w-full p-2 border rounded-md"
            />
            {errors.MembershipID && (
              <p className="text-red-500">{errors.MembershipID.message}</p>
            )}
          </div>

          {/* Child Name */}
          <div>
            <label className="text-gray-600">Child Name *</label>
            <input
              {...register("ChildName", { required: "Child Name is required" })}
              className="w-full p-2 border rounded-md"
            />
            {errors.ChildName && (
              <p className="text-red-500">{errors.ChildName.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="text-gray-600">Gender *</label>
            <select
              {...register("Gender", { required: "Gender is required" })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
            {errors.Gender && (
              <p className="text-red-500">{errors.Gender.message}</p>
            )}
          </div>

          {/* B-Form Number */}
          <div>
            <label className="text-gray-600">B-Form #</label>
            <input
              {...register("BFormNo")}
              className="w-full p-2 border rounded-md"
            />
            {errors.BFormNo && (
              <p className="text-red-500">{errors.BFormNo.message}</p>
            )}
          </div>

          {/* Blood Group */}
          <div>
            <label className="text-gray-600">Blood Group *</label>
            <select
              {...register("BloodGroupID", {
                required: "Blood Group is required",
              })}
              className="w-full p-2 border rounded-md"
            >
              <option value="7">N/A</option>
              <option value="1">A+</option>
              <option value="2">A-</option>
              <option value="3">AB+</option>
              <option value="4">AB-</option>
              <option value="5">B+</option>
              <option value="6">B-</option>
              <option value="8">O+</option>
              <option value="9">O-</option>
            </select>
            {errors.BloodGroupID && (
              <p className="text-red-500">{errors.BloodGroupID.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-gray-600">Date of Birth *</label>
            <input
              type="date"
              {...register("DOB", { required: "Date of Birth is required" })}
              className="w-full p-2 border rounded-md"
            />
            {errors.DOB && <p className="text-red-500">{errors.DOB.message}</p>}
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
              {submitLoading ? <Loader w={4} h={4} /> : "Submit"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ChildrenModal;
