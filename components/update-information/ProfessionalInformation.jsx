import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import ProfessionalModel from "./ProfessionalModel";
import { MdCancel, MdEdit, MdSave } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import Loader from "../ui/Loader";
import { motion } from "framer-motion";

// Notification Toaster
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { useSession } from "next-auth/react";

const ProfessionalInformation = ({
  ProfessionalDetail,
  setProfessionalDetail,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [EditMode, setEditMode] = useState(false);
  const { data: session } = useSession();

  //Loading States
  const [SaveLoading, setSaveLoading] = useState(false);
  const [DeleteLoading, setDeleteLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const getMemberData = async () => {
    try {
      const response = await fetch(
        `/api/getProfessionalInformation/${session.user.memberId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      if (response.ok) {
        setProfessionalDetail(result.data);
      }
    } catch (error) {
      console.log("Error fetching professional data:", error);
    }
  };

  const handleEdit = (id) => {
    setEditMode(true);
    setEditingId(id);
    setEditedData(ProfessionalDetail.find((item) => item.MemberProID === id));
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleChange = (event, fieldName) => {
    setEditedData((prevData) => ({
      ...prevData,
      [fieldName]: event.target.value,
    }));
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      setDeletingId(id);
      await fetch(`/api/deleteProfessionalInformation/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      setDeleteLoading(false);
      console.log("Error deleting professional info:", error);
    } finally {
      getMemberData();
      setDeletingId(null);
      setDeleteLoading(false);
      toast.success("Deleted successfully!", {
        position: "top-right",
      });
    }
  };

  const handleEditSave = async (id) => {
    try {
      console.log(editedData);
      setSaveLoading(true);
      const api = `/api/updateProfessionalInformation/${id}`;
      const response = await fetch(api, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        setSaveLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Updated successfully!", {
        position: "top-right",
      });
      setSaveLoading(false);
      setEditingId(null);
      getMemberData();
    } catch (error) {
      console.log("Error updating professional info:", error);
    }
  };

  return (
    <>
      <div
        className="flex justify-between items-center px-4 py-2 bg-[#2E5077] text-white cursor-pointer rounded-t-lg"
        onClick={() => setToggle((prev) => !prev)}
      >
        <h2 className="font-semibold text-lg flex items-center">
          <LuBriefcaseBusiness className="mr-2" />
          <p>Professional Information</p>
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
                {session.user.isAdmin !== 1 ? (
                  <th className="px-1 py-2 text-left text-xs font-bold">
                    Actions
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ProfessionalDetail.map((item) => (
                <tr
                  key={item.MemberProID}
                  className="flex flex-col md:table-row hover:bg-gray-50"
                >
                  <div className="block md:hidden text-xs font-bold">
                    Company Name:
                  </div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {editingId === item.MemberProID ? (
                      <input
                        type="text"
                        value={editedData.CompanyName}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            CompanyName: e.target.value,
                          })
                        }
                        className="border border-gray-300 px- py-1 w-full"
                      />
                    ) : (
                      item.CompanyName
                    )}
                  </td>
                  <div className="block md:hidden text-xs font-bold">
                    Current Position:
                  </div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {editingId === item.MemberProID ? (
                      <input
                        type="text"
                        value={editedData.CurrentPosition}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            CurrentPosition: e.target.value,
                          })
                        }
                        className="border border-gray-300 px- py-1 w-full"
                      />
                    ) : (
                      item.CurrentPosition
                    )}
                  </td>
                  <div className="block md:hidden text-xs font-bold">
                    Current Profession:
                  </div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {editingId === item.MemberProID ? (
                      <select
                        value={editedData.CurrentProfession || ""}
                        onChange={(e) => handleChange(e, "CurrentProfession")}
                        className="w-full border border-gray-300 px- py-1"
                      >
                        <option value="Salaried Person">Salaried Person</option>
                        <option value="Business Owner">Business Owner</option>
                        <option value="Self Employeed">Self Employeed</option>
                        <option value="House Wife">House Wife</option>
                        <option value="Student">Student</option>
                      </select>
                    ) : (
                      item.CurrentProfession
                    )}
                  </td>
                  <div className="block md:hidden text-xs font-bold">
                    Professional Experience:
                  </div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {editingId === item.MemberProID ? (
                      <select
                        value={editedData.ProfessionalExperience || ""}
                        onChange={(e) =>
                          handleChange(e, "ProfessionalExperience")
                        }
                        className="w-full border border-gray-300 px- py-1"
                      >
                        <option value="1-2 Years">1-2 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="More than 5 Years">
                          More than 5 Years
                        </option>
                      </select>
                    ) : (
                      item.ProfessionalExperience
                    )}
                  </td>
                  <div className="block md:hidden text-xs font-bold">
                    Employeed Status:
                  </div>
                  <td className="px-1 py-2 text-xs md:min-w-[150px]">
                    {editingId === item.MemberProID ? (
                      <select
                        value={editedData.EmployeeUnEmployeed || ""}
                        onChange={(e) => handleChange(e, "EmployeeUnEmployeed")}
                        className="w-full border border-gray-300 px- py-1"
                      >
                        <option value="Under Employement">
                          Under Employement
                        </option>
                        <option value="Resigned">Resigned</option>
                      </select>
                    ) : (
                      item.EmployeeUnEmployeed
                    )}
                  </td>
                  {session.user.isAdmin !== 1 ? (
                    <td className="px-1 py-2 text-xs flex justify-center space-x-2 md:table-cell">
                      {editingId === item.MemberProID ? (
                        <button
                          className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleEditSave(item.MemberProID)}
                        >
                          {SaveLoading ? <Loader w={3} h={3} /> : <MdSave />}
                        </button>
                      ) : (
                        <button
                          className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          onClick={() => handleEdit(item.MemberProID)}
                        >
                          <MdEdit />
                        </button>
                      )}
                      {editingId === item.MemberProID ? (
                        <button
                          className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                          onClick={onCancelEdit}
                        >
                          <MdCancel />
                        </button>
                      ) : (
                        <button
                          className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(item.MemberProID)}
                          disabled={
                            DeleteLoading && deletingId === item.MemberProID
                          }
                        >
                          {DeleteLoading && deletingId === item.MemberProID ? (
                            <Loader w={3} h={3} />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      )}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <ProfessionalModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        MemberId={session.user.memberId}
        getMemberData={getMemberData}
      />
      <ToastContainer />
    </>
  );
};

export default ProfessionalInformation;
