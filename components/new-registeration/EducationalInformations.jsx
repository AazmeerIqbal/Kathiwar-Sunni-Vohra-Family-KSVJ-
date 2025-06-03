import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import EducationModal from "../update-information/EducationModal";
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

  const getMemberData = async () => {
    // try {
    //   const response = await fetch(
    //     `/api/getEductionalInformation/${session.user.memberId}`,
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //     }
    //   );
    //   const result = await response.json();
    //   if (response.ok) setEducationData(result.data);
    // } catch (error) {
    //   console.log("Error fetching education data:", error);
    // }
  };

  const onDelete = async (index) => {
    setEducationData((prev) => prev.filter((_, i) => i !== index));
    setDeletingId(null);
    setLoading(false);
    toast.success("Deleted successfully!", {
      position: "top-right",
    });
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
    // Update the item at the given index in EducationData
    setEducationData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...editRow } : item))
    );
    setEditId(null);
    setLoading(false);
    toast.success("Updated successfully!", {
      position: "top-right",
    });
    setEditIndex(null); // Exit edit mode
    setEditRow({});
  };

  return (
    <>
      <div className="text-[12px] md:text-[13px] lg:text-[13px] border border-gray-300 font-crimson bg-white rounded-lg p-2 md:p-4 grid grid-cols-1 gap-2 text-gray-900">
        <div className="flex justify-end items-center gap-4 mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="flex gap-1 items-center hover:opacity-70 py-1 px-2 bg-[#e5e6e7] text-xs md:text-sm text-black font-semibold rounded-3xl border border-gray-300"
          >
            <FaPlus /> Add New
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-300">
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
                  Degree Title
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
                  console.log(Qualification);

                  // Find Specialization Name
                  const Specialization = SP.find(
                    (sp) => sp.HQSPId === Number(item.specialization)
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
                            value={editRow["completionYear"] || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                completionYear: e.target.value,
                              })
                            }
                            className="border border-gray-300 px-2 py-1 w-full"
                          />
                        ) : (
                          item.completionYear
                        )}
                      </td>

                      <div className="block md:hidden text-xs font-bold">
                        Qualification:
                      </div>
                      <td className="px-1 py-2 text-xs ">
                        {editIndex === index ? (
                          <select
                            value={editRow.qualification || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                qualification: e.target.value,
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
                        ) : Qualification ? (
                          Qualification.HighestQualification
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
                            value={editRow.specialization || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                specialization: e.target.value,
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
                        ) : Specialization ? (
                          Specialization.AreaofSpecialization
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <div className="block md:hidden text-xs font-bold">
                        Degree Title:
                      </div>
                      <td className="px-1 py-2 text-xs ">
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow["degreeTitle"] || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                degreeTitle: e.target.value,
                              })
                            }
                            className="border border-gray-300 px-2 py-1 w-full"
                          />
                        ) : (
                          item.degreeTitle
                        )}
                      </td>

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
                            onClick={() => onDelete(index)}
                            disabled={Loading && deletingId === index}
                          >
                            {(deletingId === index) & Loading ? (
                              <Loader w={3} h={3} />
                            ) : (
                              <MdDelete />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <EducationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // MemberId={session.user.memberId}
        EducationData={EducationData}
        setEducationData={setEducationData}
        registerUser={1}
        getMemberData={getMemberData}
        HQ={HQ}
        SP={SP}
      />
      <ToastContainer />
    </>
  );
};

export default EducationalInformations;
