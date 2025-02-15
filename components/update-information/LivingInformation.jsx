import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import LivingModal from "./LivingModal";
import { ToastContainer } from "react-toastify";
import { MdCancel, MdEdit, MdSave } from "react-icons/md";
import Loader from "../ui/Loader";
import { motion } from "framer-motion";

const LivingInformation = ({
  MemberId,
  CountryDropDown,
  StateDropDown,
  CityDropDown,
  fetchStateData,
  fetchCityData,
}) => {
  const [toggle, setToggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [LivingDetail, setLivingDetail] = useState([]);

  useEffect(() => {
    if (MemberId !== null) {
      getMemberData();
    }
  }, [MemberId]);

  const getMemberData = async () => {
    try {
      const response = await fetch(`/api/getLivingInformation/${MemberId}`, {
        method: "GET", // Changed from POST to GET
      });

      const result = await response.json();

      if (response.ok) {
        setLivingDetail(result.data);
        console.log("Living data: ", result.data);
      } else {
        console.error("Error fetching Living data:", result.message);
      }
    } catch (error) {
      console.error("Error fetching Living data:", error);
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Handle Input Change
  const handleChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  // Handle Edit Click
  const handleEdit = (id, item) => {
    setEditingId(id);
    setEditedData({ ...item }); // Pre-fill data
  };

  const handleSave = async (id) => {
    // setSaveLoading(true);
    // try {
    //   const response = await fetch(`/api/updateLivingInformation/${id}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(editedData),
    //   });
    //   const result = await response.json();
    //   if (response.ok) {
    //     getMemberData(); // Refresh data
    //     setEditingId(null);
    //   } else {
    //     console.error("Error updating data:", result.message);
    //   }
    // } catch (error) {
    //   console.error("Error updating data:", error);
    // }
    // setSaveLoading(false);
  };

  // Handle Cancel Edit
  const onCancelEdit = () => {
    setEditingId(null);
    setEditedData({});
  };

  //Handle Delete
  const handleDelete = async (id) => {
    // setDeleteLoading(true);
    // setDeletingId(id);
    // try {
    //   const response = await fetch(`/api/deleteLivingInformation/${id}`, {
    //     method: "DELETE",
    //   });
    //   if (response.ok) {
    //     getMemberData(); // Refresh after delete
    //   } else {
    //     console.error("Error deleting data");
    //   }
    // } catch (error) {
    //   console.error("Error deleting data:", error);
    // }
    // setDeleteLoading(false);
    // setDeletingId(null);
  };

  return (
    <>
      <div
        className="flex justify-between items-center px-4 py-2 bg-[#2E5077] text-white cursor-pointer rounded-t-lg"
        onClick={() => setToggle((prev) => !prev)}
      >
        <h2 className="font-semibold text-lg">Living Information</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="flex gap-1 items-center my-2 hover:opacity-70 py-2 px-3 bg-[#e5e6e7] text-xs md:text-sm text-black font-semibold rounded-3xl"
          >
            <FaPlus /> Add New
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
          {" "}
          <table className="min-w-full border text-sm border-gray-300 bg-white table-fixed">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-1 border w-[22%]">Country</th>
                <th className="py-1 border w-[22%]">State</th>
                <th className="py-1 border w-[22%]">City</th>
                <th className="py-1 border w-[22%]">Address</th>
                <th className="py-1 border w-[12%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {LivingDetail.map((item) => (
                <tr key={item.LivingId} className="text-center border">
                  {/* Country Dropdown */}
                  <td className="p-1 border w-[150px]">
                    {editingId === item.LivingId ? (
                      <select
                        value={editedData.LivingCountryID || ""}
                        onChange={(e) => {
                          handleChange(e, "LivingCountryID");
                          fetchStateData(e.target.value);
                        }}
                        className="w-full p-1 border"
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

                  {/* State Dropdown */}
                  <td className="p-1 border w-[150px]">
                    {editingId === item.LivingId ? (
                      <select
                        value={editedData.LivingStateID || ""}
                        onChange={(e) => {
                          handleChange(e, "LivingStateID");
                          fetchCityData(e.target.value);
                        }}
                        className="w-full p-1 border"
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

                  {/* City Dropdown */}
                  <td className="p-1 border w-[150px]">
                    {editingId === item.LivingId ? (
                      <select
                        value={editedData.LivingCityID || ""}
                        onChange={(e) => handleChange(e, "LivingCityID")}
                        className="w-full p-1 border"
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

                  {/* Address Column */}
                  <td className="p-1 border w-[150px]">
                    {editingId === item.LivingId ? (
                      <input
                        type="text"
                        value={editedData.Address}
                        onChange={(e) => handleChange(e, "Address")}
                        className="border p-1 w-full"
                      />
                    ) : (
                      item.Address
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-1 border flex justify-center gap-1 text-xs">
                    {editingId === item.LivingId ? (
                      <>
                        <button
                          className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded"
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
                          className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded"
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <LivingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        MemberId={MemberId}
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
