import React, { useEffect, useState } from "react";
import { FaChild, FaPlus, FaTrash } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../ui/Loader";
import { MdCancel, MdEdit } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

const bloodGroupMap = {
  1: "A+",
  2: "A-",
  3: "AB+",
  4: "AB-",
  5: "B+",
  6: "B-",
  7: "N/A",
  8: "O+",
  9: "O-",
};

const bloodGroupOptions = [
  { value: "7", label: "N/A" },
  { value: "1", label: "A+" },
  { value: "2", label: "A-" },
  { value: "3", label: "AB+" },
  { value: "4", label: "AB-" },
  { value: "5", label: "B+" },
  { value: "6", label: "B-" },
  { value: "8", label: "O+" },
  { value: "9", label: "O-" },
];

const ChildrenInformation = ({ childrenDetail, setChildrenDetail }) => {
  const [toggle, setToggle] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const { data: session } = useSession();

  // Form state
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    control,
  } = useForm();

  // Add or update child entry
  const onSubmit = (data) => {
    if (editIndex === null) {
      setChildrenDetail((prev) => [...prev, data]);
      toast.success("Added successfully!", { position: "top-right" });
    } else {
      setChildrenDetail((prev) =>
        prev.map((item, i) => (i === editIndex ? { ...item, ...data } : item))
      );
      toast.success("Updated successfully!", { position: "top-right" });
      setEditIndex(null);
    }
    reset();
  };

  // Edit handler: populate form fields
  const onEdit = (index) => {
    const item = childrenDetail[index];
    setValue("MembershipID", item.MembershipID || item.ChildMemberShipNo || "");
    setValue("ChildName", item.ChildName || "");
    setValue("Gender", item.Gender !== undefined ? String(item.Gender) : "");
    setValue("BFormNo", item.BFormNo || "");
    setValue(
      "BloodGroupID",
      item.BloodGroupID ? String(item.BloodGroupID) : "7"
    );
    setValue("DOB", item.DOB ? item.DOB.split("T")[0] : "");
    setEditIndex(index);
  };

  // Cancel edit handler
  const onCancelEdit = () => {
    reset();
    setEditIndex(null);
  };

  return (
    <>
      {/* Children Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200"
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
          <Controller
            name="BloodGroupID"
            control={control}
            rules={{ required: "Blood Group is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={bloodGroupOptions}
                isClearable
                isSearchable
                placeholder="Select Blood Group..."
                onChange={(selected) =>
                  field.onChange(selected ? selected.value : "")
                }
                value={
                  bloodGroupOptions.find((opt) => opt.value === field.value) ||
                  null
                }
              />
            )}
          />
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
              "Add Child"
            )}
          </button>
        </div>
      </form>
      {/* End Children Form */}

      <div className="p-4 text-gray-900 overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="hidden md:table-row">
              <th className="px-1 py-2 text-left text-xs font-bold">
                Membership ID
              </th>
              <th className="px-1 py-2 text-left text-xs font-bold">
                Child Name
              </th>
              <th className="px-1 py-2 text-left text-xs font-bold">Gender</th>
              <th className="px-1 py-2 text-left text-xs font-bold">
                B-Form #
              </th>
              <th className="px-1 py-2 text-left text-xs font-bold">
                Blood Group
              </th>
              <th className="px-1 py-2 text-left text-xs font-bold">
                Date of Birth
              </th>
              <th className="px-1 py-2 text-left text-xs font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {childrenDetail.length === 0 ? (
              <tr className="flex flex-col md:table-row">
                <td colSpan="7" className="px-1 py-2 text-center text-gray-500">
                  No children information available
                </td>
              </tr>
            ) : (
              childrenDetail.map((item, index) => (
                <tr
                  key={item.memberChildId || index}
                  className="flex flex-col md:table-row hover:bg-gray-50"
                >
                  <td className="px-1 py-2 text-xs ">
                    {item.MembershipID || item.ChildMemberShipNo}
                  </td>
                  <td className="px-1 py-2 text-xs ">{item.ChildName}</td>
                  <td className="px-1 py-2 text-xs ">
                    {item.Gender === "0" || item.Gender === 0
                      ? "Male"
                      : item.Gender === "1" || item.Gender === 1
                      ? "Female"
                      : "Unknown"}
                  </td>
                  <td className="px-1 py-2 text-xs ">{item.BFormNo}</td>
                  <td className="px-1 py-2 text-xs ">
                    {bloodGroupMap[item.BloodGroupID] || "Unknown"}
                  </td>
                  <td className="px-1 py-2 text-xs ">
                    {item.DOB ? new Date(item.DOB).toLocaleDateString() : ""}
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
                      onClick={() =>
                        setChildrenDetail((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <FaTrash />
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

export default ChildrenInformation;
