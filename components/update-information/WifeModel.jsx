import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Loader from "../ui/Loader";
import Select from "react-select";

//Notification Toaster
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WifeDetailForm = ({
  isOpen,
  onClose,
  MemberId,
  FamilyDropDown,
  FatherNames,
  getWifeData,
}) => {
  if (!isOpen) return null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [SubmitLoading, setSubmitLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!MemberId) {
      toast.error("Member ID is missing!");
      return;
    }
    try {
      setSubmitLoading(true);
      const api = `/api/insertWifeDetail/${MemberId}`;
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
      toast.success("Uploaded successfully!", {
        position: "top-right",
      });
      setSubmitLoading(false);
      reset();
      onClose();
      getWifeData();
    } catch (error) {
      setSubmitLoading(false);
      console.log("Error adding wife detail:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl text-xs shadow-lg w-full max-w-2xl p-4 overflow-y-auto max-h-[95vh]"
      >
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="font-semibold text-gray-800">Wife Detail</h2>
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
          {[
            { label: "Wife Name", name: "wifeName", required: true },
            { label: "Father's Name (non-member)", name: "fatherName" },
            { label: "DOB", name: "dob", type: "date" },
            { label: "CNIC No", name: "cnicNo", placeholder: "00000-000000-0" },
            { label: "Cell #", name: "cellNumber" },
            { label: "E-mail ID", name: "email", type: "email" },
            { label: "Marriage Date", name: "marriageDate", type: "date" },
            { label: "Death On", name: "deathDate", type: "date" },
            { label: "Grave Number", name: "graveNumber" },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-gray-600">{field.label}</label>
              <input
                type={field.type || "text"}
                placeholder={field.placeholder || ""}
                {...register(
                  field.name,
                  field.required && { required: `${field.label} is required` }
                )}
                className="w-full p-2 border rounded-md"
              />
              {errors[field.name] && (
                <p className="text-red-500">{errors[field.name].message}</p>
              )}
            </div>
          ))}
          <div>
            <label className="text-gray-600">Is Father Member Also?</label>
            <input
              type="checkbox"
              {...register("isFatherMember")}
              className="ml-2"
            />
          </div>
          <div>
            <label className="text-gray-600">Gender</label>
            <select
              {...register("gender")}
              className="w-full p-2 border rounded-md"
            >
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="text-gray-600">Father Name (if member)</label>

            <Select
              options={FatherNames.map((father) => ({
                value: father.memberId,
                label: father.MemberName,
              }))}
              menuPosition="fixed"
              onChange={(selectedOption) => {
                setValue(
                  "fatherDetail",
                  selectedOption ? selectedOption.value : ""
                );
              }}
              placeholder="Search Father Name..."
              isClearable
              isSearchable
            />
          </div>
          <div>
            <label className="text-gray-600">Father Family Name</label>
            <Select
              options={FamilyDropDown.map((family) => ({
                value: family.FamilyID,
                label: family.FamilyName,
              }))}
              menuPosition="fixed"
              onChange={(selectedOption) => {
                setValue(
                  "fatherFamilyName",
                  selectedOption ? selectedOption.value : ""
                );
              }}
              placeholder="Search Family..."
              isClearable
              isSearchable
            />
          </div>
          <div>
            <label className="text-gray-600">Blood Group</label>
            <select
              {...register("bloodGroup")}
              className="w-full p-2 border rounded-md"
            >
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
          <div>
            <label className="text-gray-600">Marital Status</label>
            <select
              {...register("maritalStatus")}
              className="w-full p-2 border rounded-md"
            >
              <option value="Under-Marriage">Under-Marriage</option>
              <option vlaue="Divorced">Divorced</option>
            </select>
          </div>
          <div className="col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {SubmitLoading ? <Loader w={4} h={4} /> : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default WifeDetailForm;
