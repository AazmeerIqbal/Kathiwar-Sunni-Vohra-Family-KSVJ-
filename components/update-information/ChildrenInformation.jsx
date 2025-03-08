import React, { useEffect, useState, useCallback } from "react"; // Added useEffect and useCallback
import { FaChild, FaPlus, FaTrash } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify"; // Added toast for notifications
import "react-toastify/dist/ReactToastify.css"; // Added toast CSS
import ChildrenModal from "./ChildrenModal";
import Loader from "../ui/Loader";
import { MdCancel, MdEdit, MdSave } from "react-icons/md";

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

const ChildrenInformation = ({ MemberId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [childrenDetail, setChildrenDetail] = useState([]); // State for children details
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (MemberId !== null) {
      console.log("MemberId from ChildrenInformation:", MemberId);
      getChildrenData(); // Fetch children data on load
    }
  }, [MemberId]);

  const getChildrenData = useCallback(async () => {
    try {
      console.log("Fetching data for MemberId:", MemberId); // Debugging line
      const response = await fetch(`/api/getChildrenInformation/${MemberId}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch children information"
        );
      }

      const result = await response.json();
      setChildrenDetail(result.data || []);
      console.log("Children data:", result.data); // Debugging line
    } catch (error) {
      console.log("Error in getChildrenData:", error);
      setChildrenDetail([]); // Set empty array on error
      toast.error("Failed to fetch children information");
    }
  }, [MemberId]);

  // Handle Input Change
  const handleChange = useCallback((e, field) => {
    setEditedData((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  // Handle Edit Click
  const handleEdit = useCallback((id, item) => {
    setEditingId(id);
    setEditedData({ ...item }); // Pre-fill data
  }, []);

  const onCancelEdit = () => {
    setEditingId(null); // Reset editing state to exit edit mode
  };

  const handleSave = async (id) => {
    try {
      setSaveLoading(true);
      const response = await fetch(`/api/updateChildrenDetail/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedData, // Spread the edited data
        }),
      });

      if (!response.ok) {
        setSaveLoading(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update child details");
      }

      // Optionally, you can fetch the updated data again
      await getChildrenData(); // Refresh data
      setSaveLoading(false);

      // Reset editing state
      setEditingId(null);
      toast.success("Child details updated successfully!");
    } catch (error) {
      setSaveLoading(false);
      console.error("Error updating child details:", error);
      toast.error("Failed to update child details");
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/deleteChildrenDetail/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setDeleteLoading(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete child details");
      }

      // Refresh the data after deletion
      await getChildrenData(); // Fetch updated data
      toast.success("Child details deleted successfully!");
      setDeleteLoading(false);
    } catch (error) {
      setDeleteLoading(false);
      console.error("Error deleting child details:", error);
      toast.error("Failed to delete child details");
    }
  };

  return (
    <>
      <div
        className="flex justify-between items-center px-4 py-2 bg-[#2E5077] text-white cursor-pointer rounded-t-lg"
        onClick={() => setToggle((prev) => !prev)}
      >
        <h2 className="font-semibold text-lg flex items-center">
          <FaChild className="mr-2" />
          <p>Children Information</p>
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="flex gap-1 items-center my-2 hover:opacity-70 py-1 px-2 bg-[#e5e6e7] text-xs md:text-sm text-black font-semibold rounded-3xl"
          >
            <FaPlus className="text-sm" /> Add New
          </button>
          <span
            className={`transform transition-transform duration-300 bg-[#e5e6e7] p-1 rounded-md text-sm ${
              toggle ? "rotate-180" : "rotate-0"
            }`}
          >
            <IoIosArrowDown className="text-black" />
          </span>
        </div>
      </div>

      {/* Smooth dropdown animation */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={
          toggle ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="p-4 text-gray-900 overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr className="hidden md:table-row">
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Membership ID
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Child Name
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Gender
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  B-Form #
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Blood Group
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Date of Birth
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">Age</th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {childrenDetail.map((item) => (
                <tr
                  key={item.memberChildId}
                  className="flex flex-col md:table-row hover:bg-gray-50"
                >
                  <td className="px-1 py-2 text-xs ">
                    {editingId === item.memberChildId ? (
                      <input
                        type="text"
                        value={editedData.ChildMemberShipNo || ""}
                        onChange={(e) => handleChange(e, "ChildMemberShipNo")}
                        className="border border-gray-300 px- py-1 w-full"
                      />
                    ) : (
                      item.ChildMemberShipNo
                    )}
                  </td>
                  <td className="px-1 py-2 text-xs ">
                    {editingId === item.memberChildId ? (
                      <input
                        type="text"
                        value={editedData.ChildName || ""}
                        onChange={(e) => handleChange(e, "ChildName")}
                        className="border border-gray-300 px- py-1 w-full"
                      />
                    ) : (
                      item.ChildName
                    )}
                  </td>
                  <td className="px-1 py-2 text-xs ">
                    {editingId === item.memberChildId ? (
                      <select
                        value={editedData.Gender || ""}
                        onChange={(e) => handleChange(e, "Gender")}
                        className="border border-gray-300 px- py-1 w-full"
                      >
                        <option value="0">Male</option>
                        <option value="1">Female</option>
                      </select>
                    ) : item.Gender === 0 ? (
                      "Male"
                    ) : item.Gender === 1 ? (
                      "Female"
                    ) : (
                      "Unknown"
                    )}
                  </td>
                  <td className="px-1 py-2 text-xs ">
                    {editingId === item.memberChildId ? (
                      <input
                        type="text"
                        value={editedData.BFormNo || ""}
                        onChange={(e) => handleChange(e, "BFormNo")}
                        className="border border-gray-300 px- py-1 w-full"
                      />
                    ) : (
                      item.BFormNo
                    )}
                  </td>
                  <td className="px-1 py-2 text-xs ">
                    {editingId === item.memberChildId ? (
                      <select
                        value={editedData.BloodGroupID || ""}
                        onChange={(e) => handleChange(e, "BloodGroupID")}
                        className="w-full border border-gray-300 px- py-1 text-sm"
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
                    ) : (
                      bloodGroupMap[item.BloodGroupID] || "Unknown"
                    )}
                  </td>
                  <td className="px-1 py-2 text-xs ">
                    {editingId === item.memberChildId ? (
                      <input
                        type="date"
                        value={editedData.DOB || ""}
                        onChange={(e) => handleChange(e, "DOB")}
                        className="border border-gray-300 px- py-1 w-full"
                      />
                    ) : (
                      item.DOB
                    )}
                  </td>
                  <td className="px-1 py-2 text-xs ">{item.Age18}</td>
                  {/* Actions */}
                  <td className="px-1 py-2 text-xs flex justify-center space-x-2 md:table-cell">
                    {editingId === item.memberChildId ? (
                      <>
                        <button
                          className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleSave(item.memberChildId)}
                        >
                          {saveLoading ? <Loader w={3} h={3} /> : <MdSave />}
                        </button>
                        <button
                          className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                          onClick={onCancelEdit}
                        >
                          <MdCancel />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleEdit(item.memberChildId, item)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(item.memberChildId)}
                          disabled={
                            deleteLoading && deletingId === item.memberChildId
                          }
                        >
                          {deleteLoading &&
                          deletingId === item.memberChildId ? (
                            <Loader w={3} h={3} />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <ChildrenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        MemberId={MemberId}
        getChildrenData={getChildrenData}
      />
      <ToastContainer />
    </>
  );
};

export default ChildrenInformation;
