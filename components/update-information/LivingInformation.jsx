import React, { useEffect, useState, useCallback } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import LivingModal from "./LivingModal";
import { MdCancel, MdEdit, MdSave } from "react-icons/md";
import Loader from "../ui/Loader";
import { motion } from "framer-motion";

//Notification Toaster
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoHome } from "react-icons/io5";
import { useSession } from "next-auth/react";

const LivingInformation = ({
  CountryDropDown,
  StateDropDown,
  CityDropDown,
  fetchStateData,
  fetchCityData,
  LivingDetail,
  setLivingDetail,
}) => {
  const [toggle, setToggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { data: session } = useSession();

  const getMemberData = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/getLivingInformation/${session.user.memberId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Server error:", errorData);
        throw new Error(
          errorData.message || "Failed to fetch living information"
        );
      }

      const result = await response.json();
      setLivingDetail(result.data || []);
      console.log("Living data fetched successfully:", result.data);
    } catch (error) {
      console.log("Error in getMemberData:", error);
      setLivingDetail([]); // Set empty array on error
      // Optionally show error to user
      toast.error("Failed to fetch living information");
    }
  }, [session.user.memberId]);

  // Handle Input Change
  const handleChange = useCallback((e, field) => {
    setEditedData((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  // Handle Edit Click
  const handleEdit = useCallback((id, item) => {
    setEditingId(id);
    setEditedData({ ...item }); // Pre-fill data
  }, []);

  const handleSave = async (id) => {
    setSaveLoading(true);
    console.log("Clicked");
    try {
      const response = await fetch(`/api/updateLivingInformation/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });
      const result = await response.json();
      if (response.ok) {
        await getMemberData(); // Ensure data refresh before UI update
        toast.success("Updated successfully!", {
          position: "top-right",
        });
        setEditingId(null);
      } else {
        console.log("Error updating data:", result.message);
      }
    } catch (error) {
      console.log("Error updating data:", error);
    } finally {
      setSaveLoading(false); // Ensure loading state is reset
    }
  };

  // Handle Cancel Edit
  const onCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditedData({});
  }, []);

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    setDeletingId(id);
    try {
      const response = await fetch(`/api/deleteLivingInformation/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        getMemberData();
        toast.success("Deleted successfully!", { position: "top-right" });
      } else {
        console.log("Error deleting data");
      }
    } catch (error) {
      console.log("Error deleting data:", error);
    }
    setDeleteLoading(false);
    setDeletingId(null);
  };

  return (
    <>
      <div
        className="flex justify-between items-center px-4 py-2 bg-[#2E5077] text-white cursor-pointer rounded-t-lg"
        onClick={() => setToggle((prev) => !prev)}
      >
        <h2 className="font-semibold text-lg flex items-center">
          <IoHome className="mr-2" />
          <p>Living Information</p>
        </h2>
        <div className="flex items-center gap-4">
          {session.user.isAdmin !== 1 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="flex gap-1 items-center my-2 hover:opacity-70 py-1 px-2 bg-[#e5e6e7] text-xs md:text-sm text-black font-semibold rounded-3xl"
            >
              <FaPlus className="text-sm" /> Add New
            </button>
          ) : null}
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
                  Country
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">State</th>
                <th className="px-1 py-2 text-left text-xs font-bold">City</th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Address
                </th>
                {session.user.isAdmin !== 1 ? (
                  <th className="px-1 py-2 text-left text-xs font-bold">
                    Actions
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {LivingDetail.map((item) => (
                <tr
                  key={item.LivingId}
                  className="flex flex-col md:table-row hover:bg-gray-50"
                >
                  <div className="block md:hidden text-xs font-bold">
                    Country:
                  </div>
                  {/* Country Dropdown */}
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {editingId === item.LivingId ? (
                      <select
                        value={editedData.LivingCountryID || ""}
                        onLoad={fetchStateData(item.LivingCountryID)}
                        onChange={(e) => {
                          handleChange(e, "LivingCountryID");
                          fetchStateData(e.target.value);
                        }}
                        className="w-full border border-gray-300 px- py-1 text-sm"
                      >
                        <option value="">Select Country</option>
                        {CountryDropDown.map((country) => (
                          <option key={country.ID} value={country.ID}>
                            {country.CountryName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      CountryDropDown.find((c) => c.ID === item.LivingCountryID)
                        ?.CountryName || "N/A"
                    )}
                  </td>
                  <div className="block md:hidden text-xs font-bold">
                    State:
                  </div>
                  {/* State Dropdown */}
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {editingId === item.LivingId ? (
                      <select
                        value={editedData.LivingStateID || ""}
                        onLoad={fetchCityData(item.LivingStateID)}
                        onChange={(e) => {
                          handleChange(e, "LivingStateID");
                          fetchCityData(e.target.value);
                        }}
                        className="w-full border border-gray-300 px- py-1 text-sm"
                      >
                        <option value="">Select State</option>
                        {StateDropDown.map((state) => (
                          <option key={state.ID} value={state.ID}>
                            {state.StateName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      StateDropDown.find((s) => s.ID === item.LivingStateID)
                        ?.StateName || "N/A"
                    )}
                  </td>
                  <div className="block md:hidden text-xs font-bold">City:</div>
                  {/* City Dropdown */}
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {editingId === item.LivingId ? (
                      <select
                        value={editedData.LivingCityID || ""}
                        onChange={(e) => handleChange(e, "LivingCityID")}
                        className="w-full border border-gray-300 px- py-1 text-sm"
                      >
                        <option value="">Select City</option>
                        {CityDropDown.map((city) => (
                          <option key={city.ID} value={city.ID}>
                            {city.CityName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      CityDropDown.find((c) => c.ID === item.LivingCityID)
                        ?.CityName || "N/A"
                    )}
                  </td>
                  <div className="block md:hidden text-xs font-bold">
                    Address:
                  </div>
                  {/* Address Column */}
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {editingId === item.LivingId ? (
                      <input
                        type="text"
                        value={editedData.Address}
                        onChange={(e) => handleChange(e, "Address")}
                        className="border border-gray-300 px- py-1 w-full"
                      />
                    ) : (
                      item.Address
                    )}
                  </td>
                  {/* Actions */}
                  {session.user.isAdmin !== 1 ? (
                    <td className="px-1 py-2 text-xs flex justify-center space-x-2 md:table-cell">
                      {editingId === item.LivingId ? (
                        <>
                          <button
                            className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded mr-2"
                            onClick={() => handleSave(item.LivingId)}
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
                            onClick={() => handleEdit(item.LivingId, item)}
                          >
                            <MdEdit />
                          </button>
                          <button
                            className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => handleDelete(item.LivingId)}
                            disabled={
                              deleteLoading && deletingId === item.LivingId
                            }
                          >
                            {deleteLoading && deletingId === item.LivingId ? (
                              <Loader w={3} h={3} />
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </>
                      )}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <LivingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        MemberId={session.user.memberId}
        CountryDropDown={CountryDropDown}
        StateDropDown={StateDropDown}
        CityDropDown={CityDropDown}
        fetchStateData={fetchStateData}
        fetchCityData={fetchCityData}
        getMemberData={getMemberData}
      />
      <ToastContainer />
    </>
  );
};

export default LivingInformation;
