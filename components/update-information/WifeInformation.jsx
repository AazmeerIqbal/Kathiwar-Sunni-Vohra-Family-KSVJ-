import React, { useState, useEffect } from "react";
import { FaPlus, FaVenus } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { motion } from "framer-motion";
import WifeDetailForm from "./WifeModel";
import { useSession } from "next-auth/react";
import { MdSave, MdEdit, MdDelete, MdCancel } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../ui/Loader";
import Select from "react-select";

const WifeInformation = ({
  wifeData,
  setWifeData,
  WifeFamilyDropDown,
  setWifeFamilyDropDown,
  FatherNames,
  setFatherNames,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggle, setToggle] = useState(false);

  const [editIndex, setEditIndex] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [Loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [EditId, setEditId] = useState(null);

  const { data: session } = useSession();

  useEffect(() => {
    fetchFamilyData();
    fetchFatherName();
  }, []);

  const fetchFamilyData = async () => {
    try {
      // Construct the API URL
      const apiUrl = `/api/update-information/${session.user.cnic}/fill-dropDown`;

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
        setWifeFamilyDropDown(result.family); // Family dropdown data
        console.log("Family data fetched:", result.family);
      } else {
        console.log("Error fetching dropdown data:", result.message);
      }
    } catch (error) {
      console.log("Error calling API:", error);
    }
  };

  const fetchFatherName = async () => {
    try {
      // Construct the API URL
      const apiUrl = `/api/getAllMembersName/${session.user.cnic}`;

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

  const onEdit = (index) => {
    setEditIndex(index);
    setEditRow({ ...wifeData[index] });
  };

  const onCancelEdit = () => {
    setEditIndex(null);
    setEditRow({});
  };

  const onSaveEdit = async (index) => {
    const selectedRow = wifeData[index];

    if (!selectedRow || !selectedRow.memberwifeId) {
      toast.error("Invalid wife record!");
      return;
    }

    try {
      setEditId(index);
      setLoading(true);
      const response = await fetch(
        `/api/editWifeInformation/${selectedRow.memberwifeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editRow),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setEditId(null);
      setLoading(false);
      toast.success("Updated successfully!");
      setEditIndex(null);
      setEditRow({});
      getWifeData();
    } catch (error) {
      setEditId(null);
      setLoading(false);
      console.log("Error updating wife information:", error);
      toast.error("Failed to update wife information");
    }
  };

  return (
    <>
      <div
        className="flex justify-between items-center px-4 py-2 bg-[#2E5077] text-white cursor-pointer rounded-t-lg"
        onClick={() => setToggle((prev) => !prev)}
      >
        <h2 className="font-semibold text-lg flex items-center">
          <FaVenus className="mr-2" />
          <p>Wife Information</p>
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
        <div className="p-4  rounded-b-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
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
                  <th className="px-1 py-2 text-left text-xs font-bold">
                    CNIC
                  </th>
                  <th className="px-1 py-2 text-left text-xs font-bold">
                    Cell #
                  </th>
                  <th className="px-1 py-2 text-left text-xs font-bold">
                    Email
                  </th>
                  <th className="px-1 py-2 text-left text-xs font-bold">
                    Marriage Date
                  </th>
                  <th className="px-1 py-2 text-left text-xs font-bold">
                    Blood Group
                  </th>
                  <th className="px-1 py-2 text-left text-xs font-bold">
                    Status
                  </th>
                  <th className="px-1 py-2 text-left text-xs font-bold">
                    Death On
                  </th>
                  <th className="px-1 py-2 text-left text-xs font-bold">
                    Grave Number
                  </th>
                  {session.user.isAdmin !== 1 ? (
                    <th className="px-1 py-2 text-left text-xs font-bold ">
                      Actions
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {wifeData.length === 0 ? (
                  <tr className="flex flex-col md:table-row">
                    <td
                      colSpan="13"
                      className="px-1 py-2 text-center text-gray-500"
                    >
                      No wife information available
                    </td>
                  </tr>
                ) : (
                  wifeData.map((wife, index) => (
                    <tr
                      key={wife.memberwifeId}
                      className="flex flex-col md:table-row hover:bg-gray-50"
                    >
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Wife Name:
                        </span>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow.WifeName || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                WifeName: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          wife.WifeName
                        )}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Father:
                        </span>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow.WifeFatherName || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                WifeFatherName: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          wife.WifeFatherName
                        )}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Family:
                        </span>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow.FamilyID || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                FamilyID: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          WifeFamilyDropDown.find(
                            (family) => family.FamilyID === wife.FamilyID
                          )?.FamilyName || "N/A"
                        )}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          DOB:
                        </span>
                        {editIndex === index ? (
                          <input
                            type="date"
                            value={editRow.DOB ? editRow.DOB.split("T")[0] : ""}
                            onChange={(e) =>
                              setEditRow({ ...editRow, DOB: e.target.value })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          new Date(wife.DOB).toLocaleDateString()
                        )}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          CNIC:
                        </span>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow.CNICNo || ""}
                            onChange={(e) =>
                              setEditRow({ ...editRow, CNICNo: e.target.value })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          wife.CNICNo
                        )}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Cell #:
                        </span>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow.CellNo || ""}
                            onChange={(e) =>
                              setEditRow({ ...editRow, CellNo: e.target.value })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          wife.CellNo
                        )}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Email:
                        </span>
                        {editIndex === index ? (
                          <input
                            type="email"
                            value={editRow.EmailID || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                EmailID: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          wife.EmailID
                        )}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Marriage Date:
                        </span>
                        {editIndex === index ? (
                          <input
                            type="date"
                            value={
                              editRow.MarriageDt
                                ? editRow.MarriageDt.split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                MarriageDt: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          new Date(wife.MarriageDt).toLocaleDateString()
                        )}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Blood Group:
                        </span>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow.xBloodGroup || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                xBloodGroup: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          wife.xBloodGroup
                        )}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Status:
                        </span>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow.MaritalStatus || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                MaritalStatus: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          wife.MaritalStatus
                        )}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Death On:
                        </span>
                        {editIndex === index ? (
                          <input
                            type="date"
                            value={
                              editRow.DeathOn
                                ? editRow.DeathOn.split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                DeathOn: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : wife.DeathOn !== "1900-01-01T00:00:00.000Z" ? (
                          new Date(wife.DeathOn).toLocaleDateString()
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-1 py-2 text-xs ">
                        <span className="font-semibold md:hidden mr-2">
                          Grave Number:
                        </span>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editRow.GraveNumber || ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                GraveNumber: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 px-2 py-1 text-sm"
                          />
                        ) : (
                          wife.GraveNumber || "N/A"
                        )}
                      </td>
                      {session.user.isAdmin !== 1 ? (
                        <td className="px-1 py-2 text-xs flex justify-center gap-2 md:table-cell">
                          {editIndex === index ? (
                            <>
                              <button
                                className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                onClick={() => onSaveEdit(index)}
                              >
                                {Loading ? <Loader w={4} h={4} /> : <MdSave />}
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
                                onClick={() => onEdit(index)}
                              >
                                <MdEdit />
                              </button>
                              <button
                                className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                                onClick={() => onDelete(wife.memberwifeId)}
                              >
                                {deletingId === wife.memberwifeId && Loading ? (
                                  <Loader w={4} h={4} />
                                ) : (
                                  <MdDelete />
                                )}
                              </button>
                            </>
                          )}
                        </td>
                      ) : null}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      <WifeDetailForm
        isOpen={isModalOpen}
        onClose={handleModalClose}
        MemberId={session.user.memberId}
        WifeFamilyDropDown={WifeFamilyDropDown}
        FatherNames={FatherNames}
        getWifeData={getWifeData}
      />
      <ToastContainer />
    </>
  );
};

export default WifeInformation;
