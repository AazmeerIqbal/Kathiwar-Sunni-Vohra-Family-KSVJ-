import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { MdCancel, MdEdit, MdSave } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import Loader from "../ui/Loader";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

// Notification Toaster
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuBriefcaseBusiness } from "react-icons/lu";

const ProfessionalInformation = ({
  ProfessionalDetail,
  setProfessionalDetail,
}) => {
  const [toggle, setToggle] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Loading States
  const [DeleteLoading, setDeleteLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form state
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  // Options for searchable dropdowns
  const professionOptions = [
    { value: "Salaried Person", label: "Salaried Person" },
    { value: "Business Owner", label: "Business Owner" },
    { value: "Self Employeed", label: "Self Employeed" },
    { value: "House Wife", label: "House Wife" },
    { value: "Student", label: "Student" },
  ];

  const experienceOptions = [
    { value: "1-2 Years", label: "1-2 Years" },
    { value: "3-5 Years", label: "3-5 Years" },
    { value: "More than 5 Years", label: "More than 5 Years" },
  ];

  const employeeStatusOptions = [
    { value: "Under Employement", label: "Under Employement" },
    { value: "Resigned", label: "Resigned" },
  ];

  // Add or update professional entry
  const onSubmit = async (data) => {
    if (editIndex === null) {
      setProfessionalDetail((prev) => [...prev, data]);
      toast.success("Added successfully!", { position: "top-right" });
    } else {
      setProfessionalDetail((prev) =>
        prev.map((item, i) => (i === editIndex ? data : item))
      );
      toast.success("Updated successfully!", { position: "top-right" });
      setEditIndex(null);
    }
    reset();
  };

  // Edit handler: populate form fields
  const onEdit = (index) => {
    const item = ProfessionalDetail[index];
    // Handle both old and new data formats
    setValue("profession", item.profession || item.CurrentProfession);
    setValue("companyName", item.companyName || item.CompanyName);
    setValue("currentPosition", item.currentPosition || item.CurrentPosition);
    setValue(
      "professionalExp",
      item.professionalExp || item.ProfessionalExperience
    );
    setValue("employeeStatus", item.employeeStatus || item.EmployeeUnEmployeed);
    setEditIndex(index);
  };

  // Cancel edit handler
  const onCancelEdit = () => {
    reset();
    setEditIndex(null);
  };

  const handleDelete = async (index) => {
    setProfessionalDetail((prev) => prev.filter((_, i) => i !== index));
    setDeletingId(null);
    setDeleteLoading(false);
    toast.success("Deleted successfully!", {
      position: "top-right",
    });
  };

  return (
    <>
      {/* Professional Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs sm:text-[13px] md:text-sm lg:text-base"
      >
        {/* Profession */}
        <div>
          <label className="text-gray-600 ">Profession *</label>
          <Controller
            name="profession"
            control={control}
            rules={{ required: "Profession is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={professionOptions}
                isClearable
                placeholder="Select..."
                onChange={(selected) =>
                  field.onChange(selected ? selected.value : "")
                }
                value={
                  professionOptions.find((opt) => opt.value === field.value) ||
                  null
                }
              />
            )}
          />
          {errors.profession && (
            <p className="text-red-500 ">{errors.profession.message}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="text-gray-600">Company Name</label>
          <input
            type="text"
            {...register("companyName")}
            className="w-full p-2 border-2 border-gray-400 rounded-md focus:border-blue-500 focus:outline-none transition-colors duration-200"
            placeholder="Enter Company Name"
          />
        </div>

        {/* Current Position */}
        <div>
          <label className="text-gray-600">Current Position</label>
          <input
            type="text"
            {...register("currentPosition")}
            className="w-full p-2 border-2 border-gray-400 rounded-md focus:border-blue-500 focus:outline-none transition-colors duration-200"
            placeholder="Enter Current Position"
          />
        </div>

        {/* Professional Experience */}
        <div>
          <label className="text-gray-600 ">Professional Experience</label>
          <Controller
            name="professionalExp"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={experienceOptions}
                isClearable
                placeholder="Select..."
                onChange={(selected) =>
                  field.onChange(selected ? selected.value : "")
                }
                value={
                  experienceOptions.find((opt) => opt.value === field.value) ||
                  null
                }
              />
            )}
          />
        </div>

        {/* Employee Status */}
        <div>
          <label className="text-gray-600 ">Employee Status *</label>
          <Controller
            name="employeeStatus"
            control={control}
            rules={{ required: "Employee Status is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={employeeStatusOptions}
                isClearable
                placeholder="Select..."
                onChange={(selected) =>
                  field.onChange(selected ? selected.value : "")
                }
                value={
                  employeeStatusOptions.find(
                    (opt) => opt.value === field.value
                  ) || null
                }
              />
            )}
          />
          {errors.employeeStatus && (
            <p className="text-red-500 ">{errors.employeeStatus.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-span-2 flex justify-end gap-3">
          {editIndex !== null && (
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader w={4} h={4} />
            ) : editIndex !== null ? (
              "Update"
            ) : (
              "Add Professional Info"
            )}
          </button>
        </div>
      </form>
      {/* End Professional Form */}

      <div className="p-4 text-gray-900 overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="hidden md:table-row">
              <th className="px-1 py-2 text-left text-xs font-bold">
                Company Name
              </th>
              <th className="px-1 py-2 text-left text-xs font-bold">
                Current Position
              </th>
              <th className="px-1 py-2 text-left text-xs font-bold">
                Profession
              </th>
              <th className="px-1 py-2 text-left text-xs font-bold">
                Experience
              </th>
              <th className="px-1 py-2 text-left text-xs font-bold">
                Employeed Status
              </th>
              <th className="px-1 py-2 text-left text-xs font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ProfessionalDetail.length === 0 ? (
              <tr className="flex flex-col md:table-row">
                <td colSpan="6" className="px-1 py-2 text-center text-gray-500">
                  No professional information available
                </td>
              </tr>
            ) : (
              ProfessionalDetail.map((item, index) => (
                <tr
                  key={index}
                  className="flex flex-col md:table-row hover:bg-gray-50"
                >
                  <div className="block md:hidden text-xs font-bold">
                    Company Name:
                  </div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {item.companyName || item.CompanyName}
                  </td>
                  <div className="block md:hidden text-xs font-bold">
                    Current Position:
                  </div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {item.currentPosition || item.CurrentPosition}
                  </td>
                  <div className="block md:hidden text-xs font-bold">
                    Current Profession:
                  </div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {item.profession || item.CurrentProfession}
                  </td>
                  <div className="block md:hidden text-xs font-bold">
                    Professional Experience:
                  </div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {item.professionalExp || item.ProfessionalExperience}
                  </td>
                  <div className="block md:hidden text-xs font-bold">
                    Employeed Status:
                  </div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {item.employeeStatus || item.EmployeeUnEmployeed}
                  </td>
                  <td className="px-1 py-2 text-xs flex justify-center space-x-2 md:table-cell">
                    <button
                      className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => onEdit(index)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(index)}
                      disabled={DeleteLoading && deletingId === index}
                    >
                      {DeleteLoading && deletingId === index ? (
                        <Loader w={3} h={3} />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProfessionalInformation;
