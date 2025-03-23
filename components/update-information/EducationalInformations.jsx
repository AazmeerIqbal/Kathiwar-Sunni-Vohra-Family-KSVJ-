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
import { PiStudentFill } from "react-icons/pi";

const EducationalInformations = ({
  EducationData,
  setEducationData,
  HQ,
  setHQ,
  SP,
  setSP,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const [toggle, setToggle] = useState(false);
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
    getMemberData();
  }, []);

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
        `/api/getEductionalInformation/${session.user.memberId}`,
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
        <h2 className="font-semibold text-lg flex items-center">
          <PiStudentFill className="mr-2" /> <p>Educational Information</p>
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
              <FaPlus /> Add New
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
                <th className="px-1 py-2 text-left text-xs font-bold">Year</th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Qualification
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Specialization
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Institute
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Degree Year
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Total Marks
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Obtain Marks
                </th>
                <th className="px-1 py-2 text-left text-xs font-bold">
                  Percentage
                </th>
                {session.user.isAdmin !== 1 ? (
                  <th className="px-1 py-2 text-left text-xs font-bold">
                    Actions
                  </th>
                ) : null}
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
                  const qualification = HQ.find(
                    (hq) => hq.HQID === item.HighestQualificationID
                  );

                  // Find Specialization Name
                  const specialization = SP.find(
                    (sp) => sp.HQSPId === item.AreaofSpecializationID
                  );

                  return (
                    <tr
                      key={index}
                      className="flex flex-col md:table-row hover:bg-gray-50"
                    >
                      <div className="block md:hidden text-xs font-bold">
                        Year:
                      </div>
                      <td className="px-1 py-2 text-xs ">
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow["AcademicYear"] || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                AcademicYear: e.target.value,
                              })
                            }
                            className="border border-gray-300 px-2 py-1 w-full"
                          />
                        ) : (
                          item.AcademicYear
                        )}
                      </td>

                      <div className="block md:hidden text-xs font-bold">
                        Qualification:
                      </div>
                      <td className="px-1 py-2 text-xs ">
                        {editIndex === index ? (
                          <select
                            value={editRow.HighestQualificationID || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                HighestQualificationID: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1"
                          >
                            <option value="">Select Qualification</option>
                            {HQ.map((hq) => (
                              <option key={hq.HQID} value={hq.HQID}>
                                {hq.HighestQualification}
                              </option>
                            ))}
                          </select>
                        ) : qualification ? (
                          qualification.HighestQualification
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <div className="block md:hidden text-xs font-bold">
                        Specialization:
                      </div>
                      <td className="px-1 py-2 text-xs ">
                        {editIndex === index ? (
                          <select
                            value={editRow.AreaofSpecializationID || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                AreaofSpecializationID: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1"
                          >
                            <option value="">Select Specialization</option>
                            {SP.map((sp) => (
                              <option key={sp.HQSPId} value={sp.HQSPId}>
                                {sp.AreaofSpecialization}
                              </option>
                            ))}
                          </select>
                        ) : specialization ? (
                          specialization.AreaofSpecialization
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <div className="block md:hidden text-xs font-bold">
                        Institute:
                      </div>
                      <td className="px-1 py-2 text-xs ">
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow["Institute"] || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                Institute: e.target.value,
                              })
                            }
                            className="border border-gray-300 px-2 py-1 w-full"
                          />
                        ) : (
                          item.Institute
                        )}
                      </td>

                      <div className="block md:hidden text-xs font-bold">
                        Degree Year:
                      </div>
                      <td className="px-1 py-2 text-xs ">
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow["DegreeCompleteInYear"] || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                DegreeCompleteInYear: e.target.value,
                              })
                            }
                            className="border border-gray-300 px-2 py-1 w-full"
                          />
                        ) : (
                          item.DegreeCompleteInYear
                        )}
                      </td>

                      <div className="block md:hidden text-xs font-bold">
                        Total Marks:
                      </div>
                      <td className="px-1 py-2 text-xs ">
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow["TotalMarks"] || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                TotalMarks: e.target.value,
                              })
                            }
                            className="border border-gray-300 px-2 py-1 w-full"
                          />
                        ) : (
                          item.TotalMarks
                        )}
                      </td>

                      <div className="block md:hidden text-xs font-bold">
                        Obtain Marks:
                      </div>
                      <td className="px-1 py-2 text-xs ">
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow["ObtainMarks"] || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                ObtainMarks: e.target.value,
                              })
                            }
                            className="border border-gray-300 px-2 py-1 w-full"
                          />
                        ) : (
                          item.ObtainMarks
                        )}
                      </td>

                      <div className="block md:hidden text-xs font-bold">
                        Percentage:
                      </div>
                      <td className="px-1 py-2 text-xs ">
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow["Percentage"] || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                Percentage: e.target.value,
                              })
                            }
                            className="border border-gray-300 px-2 py-1 w-full"
                          />
                        ) : (
                          `${item.Percentage}%`
                        )}
                      </td>
                      {session.user.isAdmin !== 1 ? (
                        <td className="px-1 py-2 text-xs flex justify-center space-x-2 md:table-cell">
                          {editIndex === index ? (
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
                          ) : (
                            <button
                              className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded mr-2"
                              onClick={() => onEdit(index)}
                            >
                              <MdEdit />
                            </button>
                          )}
                          {editIndex === index ? (
                            <button
                              onClick={onCancelEdit}
                              className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                            >
                              <MdCancel />
                            </button>
                          ) : (
                            <button
                              className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                              onClick={() => onDelete(item.MemberEduID)}
                              disabled={
                                Loading && deletingId === item.MemberEduID
                              }
                            >
                              {(deletingId === item.MemberEduID) & Loading ? (
                                <Loader w={3} h={3} />
                              ) : (
                                <MdDelete />
                              )}
                            </button>
                          )}
                        </td>
                      ) : null}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      <EducationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        MemberId={session.user.memberId}
        getMemberData={getMemberData}
        HQ={HQ}
        SP={SP}
      />
      <ToastContainer />
    </>
  );
};

export default EducationalInformations;
