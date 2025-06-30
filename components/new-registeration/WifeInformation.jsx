import React, { useState, useEffect } from "react";
import { FaPlus, FaVenus } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { MdSave, MdEdit, MdDelete, MdCancel } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../ui/Loader";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";

const WifeInformation = ({
  wifeData,
  setWifeData,
  FamilyDropDown,
  FatherNames,
  setFatherNames,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggle, setToggle] = useState(false);

  const [editIndex, setEditIndex] = useState(null);
  const [Loading, setLoading] = useState(false);
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

  const { data: session } = useSession();

  useEffect(() => {
    // fetchFamilyData();
    fetchFatherName();
  }, []);

  // const fetchFamilyData = async () => {
  //   try {
  //     // Construct the API URL
  //     const apiUrl = `/api/update-information/${session.user.cnic}/fill-dropDown`;

  //     // Make the API call
  //     const response = await fetch(apiUrl, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     // Parse the response
  //     const result = await response.json();

  //     // Check if the response is successful
  //     if (response.ok) {
  //       setFamilyDropDown(result.family); // Family dropdown data
  //       console.log(
  //         "KAAM KR RHA HE YA NAHI ABHI PATGA CHAL AASDhAIOSHDIO:",
  //         result.family
  //       );
  //     } else {
  //       console.log("Error fetching dropdown data:", result.message);
  //     }
  //   } catch (error) {
  //     console.log("Error calling API:", error);
  //   }
  // };

  const fetchFatherName = async () => {
    try {
      // Construct the API URL
      const apiUrl = `/api/getAllMembersName`;

      // Make the API call
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Parse the response
      const result = await response.json();

      // Check if the response is successful
      if (response.ok) {
        setFatherNames(result.fathers); // Father dropdown data
        console.log("Fathers data fetched:", result.fathers);
      } else {
        console.log("Error fetching dropdown data:", result.message);
      }
    } catch (error) {
      console.log("Error calling API:", error);
    }
  };

  const getWifeData = async () => {
    try {
      const response = await fetch(
        `/api/getWifeInformation/${session.user.memberId}`,
        {
          method: "GET",
        }
      );

      const result = await response.json();

      if (response.ok) {
        setWifeData(result.data || []);
        console.log("Wife data fetched successfully: ", result.data);
      } else {
        console.log("Error fetching wife data:", result.message);
        setWifeData([]);
      }
    } catch (error) {
      console.log("Error fetching wife data:", error);
      setWifeData([]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const onDelete = async (id) => {
    try {
      setDeletingId(id);
      setLoading(true);
      const response = await fetch(`/api/deleteWifeInformation/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDeletingId(null);
        setLoading(false);
        toast.success("Deleted successfully!");
        getWifeData();
      }
    } catch (error) {
      setDeletingId(null);
      setLoading(false);
      console.log("Error deleting wife information:", error);
      toast.error("Failed to delete wife information");
    }
  };

  // Add or update wife entry
  const onSubmit = async (data) => {
    if (editIndex === null) {
      setWifeData((prev) => [...prev, data]);
      console.log(wifeData);
      toast.success("Added successfully!", { position: "top-right" });
    } else {
      setWifeData((prev) =>
        prev.map((item, i) => (i === editIndex ? { ...item, ...data } : item))
      );
      toast.success("Updated successfully!", { position: "top-right" });
      setEditIndex(null);
    }
    reset();
  };

  // Edit handler: populate form fields
  const onEdit = (index) => {
    const item = wifeData[index];
    console.log("Editing item:", item); // Debug log

    // Handle both old and new data formats
    setValue("wifeName", item.wifeName || item.WifeName || "");
    setValue("fatherName", item.fatherName || item.WifeFatherName || "");
    setValue(
      "dob",
      item.dob || item.DOB ? (item.dob || item.DOB).split("T")[0] : ""
    );
    setValue("cnicNo", item.cnicNo || item.CNICNo || "");
    setValue("cellNumber", item.cellNumber || item.CellNo || "");
    setValue("email", item.email || item.EmailID || "");
    setValue(
      "marriageDate",
      item.marriageDate || item.MarriageDt
        ? (item.marriageDate || item.MarriageDt).split("T")[0]
        : ""
    );
    setValue("fatherDetail", item.fatherDetail || item.FatherDetail || "");
    setValue("fatherFamilyName", item.fatherFamilyName || item.FamilyID || "");
    setValue("bloodGroup", item.bloodGroup || item.xBloodGroup || "N/A");
    setValue("maritalStatus", item.maritalStatus || item.MaritalStatus || "");
    setValue(
      "deathOn",
      item.deathOn || item.DeathOn
        ? (item.deathOn || item.DeathOn).split("T")[0]
        : ""
    );
    setValue("graveNumber", item.graveNumber || item.GraveNumber || "");

    console.log("Form values set for editing"); // Debug log
    setEditIndex(index);
  };

  // Cancel edit handler
  const onCancelEdit = () => {
    reset();
    setEditIndex(null);
  };

  return (
    <>
      {/* Wife Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200"
      >
        {/* Wife Name */}
        <div>
          <label className="text-gray-600">Wife Name *</label>
          <input
            type="text"
            {...register("wifeName", { required: "Wife Name is required" })}
            className="w-full p-2 border rounded-md"
          />
          {errors.wifeName && (
            <p className="text-red-500">{errors.wifeName.message}</p>
          )}
        </div>
        {/* Father's Name (non-member) */}
        <div>
          <label className="text-gray-600">Father's Name (non-member)</label>
          <input
            type="text"
            {...register("fatherName")}
            className="w-full p-2 border rounded-md"
          />
        </div>
        {/* DOB */}
        <div>
          <label className="text-gray-600">DOB</label>
          <input
            type="date"
            {...register("dob")}
            className="w-full p-2 border rounded-md"
          />
        </div>
        {/* CNIC No */}
        <div>
          <label className="text-gray-600">CNIC No</label>
          <input
            type="text"
            {...register("cnicNo")}
            className="w-full p-2 border rounded-md"
            placeholder="00000-000000-0"
          />
        </div>
        {/* Cell # */}
        <div>
          <label className="text-gray-600">Cell #</label>
          <input
            type="text"
            {...register("cellNumber")}
            className="w-full p-2 border rounded-md"
          />
        </div>
        {/* E-mail ID */}
        <div>
          <label className="text-gray-600">E-mail ID</label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-2 border rounded-md"
          />
        </div>
        {/* Marriage Date */}
        <div>
          <label className="text-gray-600">Marriage Date</label>
          <input
            type="date"
            {...register("marriageDate")}
            className="w-full p-2 border rounded-md"
          />
        </div>
        {/* Father Name (if member) */}
        <div>
          <label className="text-gray-600">Father Name (if member)</label>
          <Controller
            name="fatherDetail"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={FatherNames.map((father) => ({
                  value: father.memberId,
                  label: father.MemberName,
                }))}
                onChange={(selectedOption) =>
                  field.onChange(selectedOption ? selectedOption.value : "")
                }
                placeholder="Search Father Name..."
                isClearable
                isSearchable
                menuPortalTarget={document.body}
                value={
                  FatherNames.map((father) => ({
                    value: father.memberId,
                    label: father.MemberName,
                  })).find((opt) => opt.value === field.value) || null
                }
              />
            )}
          />
        </div>
        {/* Family Name */}
        <div>
          <label className="text-gray-600">Family Name</label>
          <Controller
            name="fatherFamilyName"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={FamilyDropDown.map((family) => ({
                  value: family.FamilyID,
                  label: family.FamilyName,
                }))}
                onChange={(selectedOption) =>
                  field.onChange(selectedOption ? selectedOption.value : "")
                }
                placeholder="Search Family..."
                isClearable
                isSearchable
                menuPortalTarget={document.body}
                value={
                  FamilyDropDown.map((family) => ({
                    value: family.FamilyID,
                    label: family.FamilyName,
                  })).find((opt) => opt.value === field.value) || null
                }
              />
            )}
          />
        </div>
        {/* Blood Group */}
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
              "Add Wife Info"
            )}
          </button>
        </div>
      </form>

      {/* Wife Table */}
      <div className="p-4  rounded-b-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-300">
            <thead className="bg-gray-100 text-gray-700">
              <tr className="hidden md:table-row">
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Wife Name
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Father
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Family
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">DOB</th>
                <th className="px-1 py-2 text-left text-xs font-bold">CNIC</th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Cell #
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">Email</th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Marriage Date
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Blood Group
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold ">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {wifeData.length === 0 ? (
                <tr className="flex flex-col md:table-row">
                  <td
                    colSpan="10"
                    className="px-1 py-2 text-center text-gray-500"
                  >
                    No wife information available
                  </td>
                </tr>
              ) : (
                wifeData.map((wife, index) => {
                  // Find Father Name
                  const Father = FatherNames.find(
                    (father) => father.memberId === Number(wife.fatherDetail)
                  );

                  // Find Family Name
                  const Family = FamilyDropDown.find(
                    (family) =>
                      family.FamilyID === Number(wife.fatherFamilyName)
                  );

                  return (
                    <tr
                      key={index}
                      className="flex flex-col md:table-row hover:bg-gray-50"
                    >
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Wife Name:
                        </span>
                        {wife.wifeName || wife.WifeName}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Father:
                        </span>
                        {Father
                          ? Father.MemberName
                          : wife.fatherName || wife.WifeFatherName || "N/A"}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Family:
                        </span>
                        {Family ? Family.FamilyName : "N/A"}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          DOB:
                        </span>
                        {wife.dob || wife.DOB
                          ? new Date(wife.dob || wife.DOB).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          CNIC:
                        </span>
                        {wife.cnicNo || wife.CNICNo || "N/A"}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Cell #:
                        </span>
                        {wife.cellNumber || wife.CellNo || "N/A"}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Email:
                        </span>
                        {wife.email || wife.EmailID || "N/A"}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Marriage Date:
                        </span>
                        {wife.marriageDate || wife.MarriageDt
                          ? new Date(
                              wife.marriageDate || wife.MarriageDt
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Blood Group:
                        </span>
                        {wife.bloodGroup || wife.xBloodGroup || "N/A"}
                      </td>
                      <td className="px-1 py-2 text-xs flex justify-center gap-2 md:table-cell">
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
                          {deletingId === index && Loading ? (
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

export default WifeInformation;
