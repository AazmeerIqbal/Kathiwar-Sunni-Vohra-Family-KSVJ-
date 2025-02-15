import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import EducationModal from "./EducationModal";
import Loader from "../ui/Loader";
import { IoIosArrowDown, IoIosSave } from "react-icons/io";
import { motion } from "framer-motion";

const EducationalInformations = ({ MemberId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [EducationData, setEducationData] = useState([]);
  const { data: session } = useSession();
  const [toggle, setToggle] = useState(false);
  const [HQ, setHQ] = useState([]);
  const [SP, setSP] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editRow, setEditRow] = useState({});

  // Loading Stuff
  const [Loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [EditId, setEditId] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      if (HQ.length === 0) fetchHQData();
      if (SP.length === 0) fetchSPData();
    }
  }, [session]);

  useEffect(() => {
    if (MemberId !== null) {
      console.log("MEMBER ID:", MemberId);
      getMemberData();
    }
  }, [MemberId]);

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
      if (response.ok) setSP(result.data);
    } catch (error) {
      console.log("Error fetching SP data:", error);
    }
  };

  const getMemberData = async () => {
    try {
      const response = await fetch(
        `/api/getEductionalInformation/${MemberId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      if (response.ok) setEducationData(result.data);
    } catch (error) {
      console.log("Error fetching education data:", error);
    }
  };

  const onDelete = async (id) => {
    try {
      setDeletingId(id);
      setLoading(true);
      const response = await fetch(`api/deleteEducationInformation/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDeletingId(null);
        setLoading(false);
        toast.success("Deleted successfully!", {
          position: "top-right",
        });
        getMemberData();
      }
    } catch (error) {
      setDeletingId(null);
      setLoading(false);
      console.error("Error deleting education information:", error);
    }
  };

  const onEdit = async (index) => {
    setEditIndex(index);
    setEditRow({ ...EducationData[index] });
  };

  const onCancelEdit = () => {
    setEditIndex(null);
    setEditRow({});
  };

  const onSaveEdit = async (index) => {
    const selectedRow = EducationData[index]; // Get original data

    if (!selectedRow || !selectedRow.MemberEduID) {
      // Ensure correct ID key
      toast.error("Invalid education record!");
      return;
    }

    try {
      setEditId(index);
      setLoading(true);
      const api = `/api/editEducationInformation/${selectedRow.MemberEduID}`;
      const response = await fetch(api, {
        method: "PUT", // Use PUT or PATCH for updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editRow), // Send updated data instead of selectedRow
      });

      if (!response.ok) {
        setEditId(null);
        setLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setEditId(null);
      setLoading(false);
      const result = await response.json();
      console.log("Education detail updated:", result);
      toast.success("Updated successfully!", {
        position: "top-right",
      });

      setEditIndex(null); // Exit edit mode
      setEditRow(null);
      getMemberData(); // Refresh data after update
    } catch (error) {
      setEditId(null);
      setLoading(false);
      console.error("Error updating education detail:", error);
      toast.error("Failed to update education details.");
    }
  };

  return (
    <>
      <div
        className="flex justify-between items-center px-4 py-2 bg-[#2E5077] text-white cursor-pointer rounded-t-lg"
        onClick={() => setToggle((prev) => !prev)}
      >
        <h2 className="font-semibold text-lg">Educational Information</h2>
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
          <table className="min-w-full border text-sm border-gray-300 bg-white table-fixed">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-1 border w-[10vw]">Year</th>
                <th className="py-1 border w-[10vw]">Qualification</th>
                <th className="py-1 border w-[10vw]">Specialization</th>
                <th className="py-1 border w-[10vw]">Institute</th>
                <th className="py-1 border w-[10vw]">Degree Year</th>
                <th className="py-1 border w-[10vw]">Total Marks</th>
                <th className="py-1 border w-[10vw]">Obtain Marks</th>
                <th className="py-1 border w-[10vw]">Percentage</th>
                <th className="py-1 border w-[10vw]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {EducationData.map((item, index) => {
                // Find Qualification Name
                const qualification = HQ.find(
                  (hq) => hq.HQID === item.HighestQualificationID
                );

                // Find Specialization Name
                const specialization = SP.find(
                  (sp) => sp.HQSPId === item.AreaofSpecializationID
                );

                return (
                  <tr key={index} className="text-center border">
                    {editIndex === index ? (
                      <>
                        <td className="p-1 border w-[150px]">
                          <input
                            type="text"
                            value={editRow["AcademicYear"] || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                AcademicYear: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-center text-sm"
                          />
                        </td>
                        {/* Dropdown for Highest Qualification */}
                        <td className="p-1 border w-[150px]">
                          <select
                            value={editRow.HighestQualificationID || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                HighestQualificationID: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          >
                            <option value="">Select Qualification</option>
                            {HQ.map((hq) => (
                              <option key={hq.HQID} value={hq.HQID}>
                                {hq.HighestQualification}
                              </option>
                            ))}
                          </select>
                        </td>
                        {/* Dropdown for Area of Specialization */}
                        <td className="p-1 border w-[150px]">
                          <select
                            value={editRow.AreaofSpecializationID || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                AreaofSpecializationID: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          >
                            <option value="">Select Specialization</option>
                            {SP.map((sp) => (
                              <option key={sp.HQSPId} value={sp.HQSPId}>
                                {sp.AreaofSpecialization}
                              </option>
                            ))}
                          </select>
                        </td>
                        {[
                          "Institute",
                          "DegreeCompleteInYear",
                          "TotalMarks",
                          "ObtainMarks",
                          "Percentage",
                        ].map((field, i) => (
                          <td key={i} className="p-1 border w-[150px]">
                            <input
                              type="text"
                              value={editRow[field] || ""}
                              onChange={(e) =>
                                setEditRow({
                                  ...editRow,
                                  [field]: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 px-2 py-1 text-center text-sm"
                            />
                          </td>
                        ))}

                        <td className="p-1 border flex justify-center ">
                          <button
                            onClick={() => onSaveEdit(index)}
                            className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          >
                            {(EditId === index) & Loading ? (
                              <Loader w={3} h={3} />
                            ) : (
                              <MdSave />
                            )}
                          </button>
                          <button
                            onClick={onCancelEdit}
                            className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                          >
                            <MdCancel />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-1 border w-[80px]">
                          {item.AcademicYear}
                        </td>
                        <td className="p-1 border w-[150px]">
                          {qualification
                            ? qualification.HighestQualification
                            : "N/A"}
                        </td>
                        <td className="p-1 border w-[150px]">
                          {specialization
                            ? specialization.AreaofSpecialization
                            : "N/A"}
                        </td>
                        <td className="p-1 border w-[180px]">
                          {item.Institute}
                        </td>
                        <td className="p-1 border w-[100px]">
                          {item.DegreeCompleteInYear}
                        </td>
                        <td className="p-1 border w-[120px]">
                          {item.TotalMarks}
                        </td>
                        <td className="p-1 border w-[120px]">
                          {item.ObtainMarks}
                        </td>
                        <td className="p-1 border w-[100px]">
                          {item.Percentage}%
                        </td>
                        <td className="p-1 border flex justify-center ">
                          <button
                            className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded mr-2"
                            onClick={() => onEdit(index)}
                          >
                            <MdEdit />
                          </button>
                          <button
                            className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => onDelete(item.MemberEduID)}
                          >
                            {(deletingId === item.MemberEduID) & Loading ? (
                              <Loader w={3} h={3} />
                            ) : (
                              <MdDelete />
                            )}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
      <EducationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        MemberId={MemberId}
        getMemberData={getMemberData}
        HQ={HQ}
        SP={SP}
      />
      <ToastContainer />
    </>
  );
};

export default EducationalInformations;
