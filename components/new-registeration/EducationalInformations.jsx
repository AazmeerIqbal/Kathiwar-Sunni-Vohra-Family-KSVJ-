import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import Loader from "../ui/Loader";
import { useForm, Controller } from "react-hook-form";
import { IoIosArrowDown, IoIosSave } from "react-icons/io";
import { motion } from "framer-motion";
import { PiStudentFill } from "react-icons/pi";
import Select from "react-select";

const EducationalInformations = ({
  EducationData,
  setEducationData,
  HQ,
  setHQ,
  SP,
  setSP,
}) => {
  const { data: session } = useSession();
  const [toggle, setToggle] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editRow, setEditRow] = useState({});

  // Loading Stuff
  const [Loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [EditId, setEditId] = useState(null);

  // Form state
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  // ShowSpecialization state
  const [ShowSpecialization, setShowSpecialization] = useState(false);

  // Prepare options for react-select
  const HQOptions = HQ.map((item) => ({
    value: item.HQID,
    label: item.HighestQualification,
  }));
  const SPOptions = SP.map((item) => ({
    value: item.HQSPId,
    label: item.AreaofSpecialization,
  }));

  useEffect(() => {
    fetchHQData();
    fetchSPData();
  }, []);

  useEffect(() => {
    console.log(EducationData);
  }, [EducationData]);

  const fetchHQData = async () => {
    try {
      const response = await fetch(`/api/fill-HigherQualification`);
      const result = await response.json();
      if (response.ok) setHQ(result.data);
    } catch (error) {
      console.log("Error fetching HQ data:", error);
    }
  };

  const fetchSPData = async () => {
    try {
      const response = await fetch(`/api/fill-Specialization`);
      const result = await response.json();
      console.log(result);

      if (response.ok) setSP(result.data);
    } catch (error) {
      console.log("Error fetching SP data:", error);
    }
  };

  // Handler for HQ change
  const handleHQChange = (selected, fieldOnChange) => {
    const selectedHQID = selected ? Number(selected.value) : null;
    fieldOnChange(selected ? selected.value : "");
    if (selectedHQID && ![29, 30, 3].includes(selectedHQID)) {
      setShowSpecialization(true);
    } else {
      setShowSpecialization(false);
      setValue("specialization", "");
    }
  };

  // Add or update education entry
  const onSubmit = async (data) => {
    if (editIndex === null) {
      setEducationData((prev) => [...prev, data]);
      toast.success("Added successfully!", { position: "top-right" });
    } else {
      setEducationData((prev) =>
        prev.map((item, i) => (i === editIndex ? data : item))
      );
      toast.success("Updated successfully!", { position: "top-right" });
      setEditIndex(null);
    }
    reset();
    setShowSpecialization(false);
  };

  const onDelete = async (index) => {
    setEducationData((prev) => prev.filter((_, i) => i !== index));
    setDeletingId(null);
    setLoading(false);
    toast.success("Deleted successfully!", {
      position: "top-right",
    });
  };

  // Edit handler: populate form fields
  const onEdit = (index) => {
    const item = EducationData[index];
    setValue("qualification", item.qualification);
    setValue("specialization", item.specialization);
    setValue("degreeTitle", item.degreeTitle);
    setValue("completionYear", item.completionYear);
    setValue("description", item.description);
    // Show/hide specialization
    const selectedHQID = Number(item.qualification);
    if (selectedHQID && ![29, 30, 3].includes(selectedHQID)) {
      setShowSpecialization(true);
    } else {
      setShowSpecialization(false);
    }
    setEditIndex(index);
  };

  // Cancel edit handler
  const onCancelEdit = () => {
    reset();
    setEditIndex(null);
    setShowSpecialization(false);
  };

  return (
    <>
      {/* Education Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:grid sm:grid-cols-2 gap-4 mb-6 text-xs sm:text-[13px] md:text-sm lg:text-base bg-gray-50 p-2 sm:p-4 rounded-lg border border-gray-200"
      >
        {/* Highest Qualification */}
        <div>
          <label className="text-gray-600">Qualification *</label>
          <Controller
            name="qualification"
            control={control}
            rules={{ required: "Qualification is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={HQOptions}
                isClearable
                placeholder="Select..."
                onChange={(selected) =>
                  handleHQChange(selected, field.onChange)
                }
                value={
                  HQOptions.find((opt) => opt.value === field.value) || null
                }
              />
            )}
          />
          {errors.qualification && (
            <p className="text-red-500 ">{errors.qualification.message}</p>
          )}
        </div>

        {/* Specialization */}
        {ShowSpecialization && (
          <div>
            <label className="text-gray-600 ">Area of Specialization</label>
            <Controller
              name="specialization"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={SPOptions}
                  isClearable
                  placeholder="Select..."
                  onChange={(selected) =>
                    field.onChange(selected ? selected.value : "")
                  }
                  value={
                    SPOptions.find((opt) => opt.value === field.value) || null
                  }
                />
              )}
            />
            {errors.specialization && (
              <p className="text-red-500 ">{errors.specialization.message}</p>
            )}
          </div>
        )}

        {/* Degree Title */}
        <div>
          <label className="text-gray-600 ">Other Diploma/Certifications</label>
          <input
            type="text"
            {...register("degreeTitle")}
            className="w-full p-2 border rounded-md"
          />
          {errors.degreeTitle && (
            <p className="text-red-500 ">{errors.degreeTitle.message}</p>
          )}
        </div>

        {/* Completion Year */}
        {/* <div>
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
        </div> */}

        {/* Description / Notes */}
        {/* <div className="col-span-2">
          <label className="text-gray-600 ">Description / Notes</label>
          <textarea
            {...register("description")}
            className="w-full p-2 border rounded-md h-20"
          ></textarea>
        </div> */}

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
              "Add Education"
            )}
          </button>
        </div>
      </form>
      {/* End Education Form */}

      <div className="text-[12px] md:text-[13px] lg:text-[13px] border border-gray-300 font-crimson bg-white rounded-lg p-2 md:p-4 grid grid-cols-1 gap-2 text-gray-900">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-300">
            <thead className="bg-gray-100 text-gray-700">
              <tr className="hidden md:table-row">
                {/* <th className="px-1 py-2 text-left text-xs font-bold">Year</th> */}
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Qualification
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Specialization
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Diploma/Certifications
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {EducationData.length === 0 ? (
                <tr className="flex flex-col md:table-row">
                  <td
                    colSpan="9"
                    className="px-1 py-2 text-center text-gray-500"
                  >
                    No educational information available
                  </td>
                </tr>
              ) : (
                EducationData.map((item, index) => {
                  // Find Qualification Name
                  const Qualification = HQ.find(
                    (hq) => hq.HQID === Number(item.qualification)
                  );
                  // Find Specialization Name
                  const Specialization = SP.find(
                    (sp) => sp.HQSPId === Number(item.specialization)
                  );
                  return (
                    <tr
                      key={index}
                      className="flex flex-col md:table-row hover:bg-gray-50"
                    >
                      {/* <div className="block md:hidden text-xs font-bold">
                        Year:
                      </div>
                      <td className="px-1 py-2 text-xs ">
                        {item.completionYear}
                      </td> */}
                      <td className="px-1 py-2 text-xs ">
                        {Qualification
                          ? Qualification.HighestQualification
                          : "N/A"}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        {Specialization
                          ? Specialization.AreaofSpecialization
                          : ""}
                      </td>
                      <td className="px-1 py-2 text-xs ">{item.degreeTitle}</td>
                      <td className="px-1 py-2 text-xs flex justify-center space-x-2 md:table-cell">
                        <button
                          className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => onEdit(index)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => onDelete(index)}
                          disabled={Loading && deletingId === index}
                        >
                          {(deletingId === index) & Loading ? (
                            <Loader w={3} h={3} />
                          ) : (
                            <MdDelete />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EducationalInformations;
