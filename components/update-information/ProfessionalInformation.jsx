import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import ProfessionalModel from "./ProfessionalModel";
import { MdCancel, MdEdit, MdSave } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import Loader from "../ui/Loader";

// Notification Toaster
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfessionalInformation = ({ MemberId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ProfessionalDetail, setProfessionalDetail] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [EditMode, setEditMode] = useState(false);

  //Loading States
  const [SaveLoading, setSaveLoading] = useState(false);
  const [DeleteLoading, setDeleteLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (MemberId !== null) {
      getMemberData();
    }
  }, [MemberId]);

  const getMemberData = async () => {
    try {
      const response = await fetch(
        `/api/getProfessionalInformation/${MemberId}`,
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
        className="flex justify-between items-center px-4 py-2 bg-[#2E5077] text-white cursor-pointer rounded-t-lg "
        onClick={() => setToggle((prev) => !prev)}
      >
        <h2 className="font-semibold text-lg">Professional Information</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex gap-1 items-center my-2 hover:opacity-70 py-2 px-3 bg-[#e5e6e7] text-xs md:text-sm text-black font-semibold rounded-3xl"
          >
            <FaPlus /> Add New
          </button>
          <span
            className={`transform transition-transform bg-[#e5e6e7] p-1 rounded-md text-sm ${
              toggle ? "rotate-180" : "rotate-0"
            }`}
          >
            <IoIosArrowDown className="text-black" />
          </span>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          toggle ? "h-auto" : "max-h-0"
        }`}
      >
        <div className="p-4 text-gray-900 overflow-x-auto">
          <table className="min-w-full border text-sm border-gray-300 bg-white table-fixed">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-1 border w-[20%]">Company Name</th>
                <th className="py-1 border w-[20%]">Current Position</th>
                <th className="py-1 border w-[20%]">Profession</th>
                <th className="py-1 border w-[20%]">Experience</th>
                <th className="py-1 border w-[20%]">Employeed Status</th>
                <th className="py-1 border w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ProfessionalDetail.map((item) => (
                <tr key={item.MemberProID} className="text-center border">
                  <td className="p-1 border w-[150px]">
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
                        className="border p-1 w-full"
                      />
                    ) : (
                      item.CompanyName
                    )}
                  </td>
                  <td className="p-1 border w-[150px]">
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
                        className="border p-1 w-full"
                      />
                    ) : (
                      item.CurrentPosition
                    )}
                  </td>
                  <td className="p-1 border w-[150px]">
                    {editingId === item.MemberProID ? (
                      <select
                        value={editedData.CurrentProfession || ""}
                        onChange={(e) => handleChange(e, "CurrentProfession")}
                        className="w-full p-1 border"
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
                  <td className="p-1 border w-[150px]">
                    {editingId === item.MemberProID ? (
                      <select
                        value={editedData.ProfessionalExperience || ""}
                        onChange={(e) =>
                          handleChange(e, "ProfessionalExperience")
                        }
                        className="w-full p-1 border"
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
                  <td className="p-1 border w-[150px]">
                    {editingId === item.MemberProID ? (
                      <select
                        value={editedData.EmployeeUnEmployeed || ""}
                        onChange={(e) => handleChange(e, "EmployeeUnEmployeed")}
                        className="w-full p-1 border"
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
                  <td className="p-1 border flex justify-center gap-1 text-xs">
                    {editingId === item.MemberProID ? (
                      <button
                        className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded "
                        onClick={() => handleEditSave(item.MemberProID)}
                      >
                        {SaveLoading ? <Loader w={3} h={3} /> : <MdSave />}
                      </button>
                    ) : (
                      <button
                        className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded "
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
                        } // Disable button during deletion
                      >
                        {DeleteLoading && deletingId === item.MemberProID ? (
                          <Loader w={3} h={3} /> // Show loader only for the row being deleted
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ProfessionalModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        MemberId={MemberId}
        getMemberData={getMemberData}
      />
      <ToastContainer />
    </>
  );
};

export default ProfessionalInformation;
