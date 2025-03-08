import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Loader from "../ui/Loader";

// Notification Toaster
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LivingModal = ({
  isOpen,
  onClose,
  MemberId,
  CountryDropDown,
  StateDropDown,
  CityDropDown,
  fetchStateData,
  fetchCityData,
  getMemberData,
}) => {
  if (!isOpen) return null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [SubmitLoading, setSubmitLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!MemberId) {
      toast.error("Member ID is missing!");
      return;
    }
    try {
      setSubmitLoading(true);
      console.log("Form Data:", data);
      const api = `/api/insertLivingDetail/${MemberId}`;
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
      console.log("Living detail inserted:", result);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50  p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl text-xs shadow-lg w-full max-w-2xl p-4 overflow-y-auto max-h-[95vh] scrollbar-custom"
      >
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="font-semibold text-gray-800">Living Information</h2>
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
          {/* Country Select */}
          <div>
            <label className="text-gray-600 ">Country *</label>
            <select
              {...register("country", {
                required: "Country is required",
              })}
              className="w-full p-2 border rounded-md"
              onChange={(e) => fetchStateData(e.target.value)}
            >
              <option value="0">Select Country</option>
              {CountryDropDown.map((country) => (
                <option key={country.ID} value={country.ID}>
                  {country.CountryName}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-red-500 ">{errors.country.message}</p>
            )}
          </div>
          {/* State Select */}
          <div>
            <label className="text-gray-600 ">State *</label>
            <select
              {...register("state", {
                required: "State is required",
              })}
              className="w-full p-2 border rounded-md"
              onChange={(e) => fetchCityData(e.target.value)}
            >
              <option value="0">Select State</option>
              {StateDropDown.map((state) => (
                <option key={state.ID} value={state.ID}>
                  {state.StateName}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-red-500 ">{errors.state.message}</p>
            )}
          </div>
          {/* City Select */}
          <div>
            <label className="text-gray-600 ">City *</label>
            <select
              {...register("city", {
                required: "City is required",
              })}
              className="w-full p-2 border rounded-md"
            >
              <option value="0">Select City</option>
              {CityDropDown.map((city) => (
                <option key={city.ID} value={city.ID}>
                  {city.CityName}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-red-500 ">{errors.city.message}</p>
            )}
          </div>
          {/* Description */}
          <div className="col-span-2">
            <label className="text-gray-600 ">Address</label>
            <textarea
              {...register("address")}
              className="w-full p-2 border rounded-md h-20"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 ">{errors.city.message}</p>
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

export default LivingModal;
