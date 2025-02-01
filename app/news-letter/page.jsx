"use client";
import React, { useState, useEffect } from "react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { MdDelete, MdFileUpload } from "react-icons/md";
import { FaEye } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import Loader from "@/components/ui/Loader";

import DocumentCards from "@/components/news-letter/DocumentCards";
import Swal from "sweetalert2";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DocumentPage = () => {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [fileTitle, setFileTitle] = useState("");
  const [isBulletChecked, setIsBulletChecked] = useState(false);
  const [UploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const baseName = selectedFile.name.split(".").slice(0, -1).join(".");
      setFile(selectedFile);
      setFileTitle(baseName);
    } else {
      setFile(null);
      setFileTitle("");
    }
  };

  // Fetch documents on Load
  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/get-documents/${session.user.id}`);
      const data = await response.json();
      setDocuments(data.documents);
      console.log(data.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Upload Documents
  const handleUpload = async () => {
    console.log(session.user);
    if (!file || !fileTitle) {
      alert("Please select a file and enter a title.");
      return;
    }
    setUploadLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", fileTitle);
    formData.append("uploadDate", new Date().toISOString());
    formData.append("extension", file.name.split(".").pop());
    formData.append("companyId", session.user.companyId);
    formData.append("memberId", session.user.id);
    formData.append(
      "memberName",
      session.user.firstName + " " + session.user.lastName
    );
    formData.append("cnic", session.user.cnic);
    formData.append("bulletNews", isBulletChecked ? 1 : 0);

    try {
      const response = await fetch(
        `/api/upload-document/${session.user.cnic}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUploadLoading(false);
        toast.success("Uploaded Successfully", {
          position: "top-right",
        });
        setFile(null);
        setFileTitle("");
        setIsBulletChecked(false);
        fetchDocuments();
      } else {
        setUploadLoading(false);
        alert(result.message); // Show error message in alert
        console.log("Upload failed:", result.message);
      }
    } catch (error) {
      setUploadLoading(false);
      alert("An error occurred while uploading the file. Please try again.");
      console.log("Error uploading file:", error);
    }
  };

  // Veiw Documents
  const handleView = (document) => {
    const documentPath = document.DocPath;
    window.open(documentPath, "_blank");
  };

  // Delete Document
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/delete-document/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setDocuments((prevDocs) => prevDocs.filter((doc) => doc.Id !== id));
        toast.success("Deleted Successfully", {
          position: "top-right",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting document!");
    }
  };

  // Download Document
  const handleDownload = (fileUrl, title) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = title;
    link.click();
  };

  return (
    <div className="m-2 p-4 border border-gray-300 rounded-lg md:text-md text-sm">
      {session.user.isAdmin === 1 ? (
        <div className="border border-gray-300 p-3 w-full  rounded-lg">
          {/* File Input and Upload Button */}
          <div>
            <input
              type="file"
              onChange={handleFileChange}
              className="border w-[80%] sm:w-[30%] md:w-[40%] lg:w-[40%] border-gray-300 p-2 rounded-lg"
            />
          </div>

          {/* File Title Input */}
          <div className="mb-4 mt-2">
            <input
              type="text"
              className="w-[80%] sm:w-[30%] md:w-[40%] lg:w-[40%] rounded-lg border border-gray-300 p-2"
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              placeholder="File Title"
            />
          </div>

          <div className=" ml-1 flex items-center gap-2">
            <input
              type="checkbox"
              checked={isBulletChecked}
              onChange={() => setIsBulletChecked(!isBulletChecked)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700 text-sm font-medium">
              Bulletin News
            </span>
            <button
              onClick={handleUpload}
              className="my-3 sm:ml-4 md:ml-4 lg:ml-4 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2"
            >
              {UploadLoading ? (
                <Loader w={4} h={4} />
              ) : (
                <MdFileUpload className="text-lg" />
              )}{" "}
              Upload
            </button>
          </div>
        </div>
      ) : null}

      <div className="my-4 flex flex-wrap gap-4 ">
        {documents
          .filter((doc) => doc.IsBulletNews === "1")
          .map((doc) => (
            <DocumentCards
              key={doc.Id}
              title={doc.DocTitle}
              date={doc.UploadDate}
              docPath={doc.DocPath}
              id={doc.Id}
              onView={() => handleView(doc)}
              onDownload={() => handleDownload(doc.DocPath, doc.DocTitle)}
              onDelete={() => handleDelete(doc.Id)}
            />
          ))}
      </div>

      {/* Document Table  */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-700 text-sm md:text-base">
              <th className="border-b py-3 px-4 border-r border-gray-300 text-center">
                S.NO
              </th>
              <th className="border-b py-3 px-4 border-r border-gray-300">
                Date
              </th>
              <th className="border-b py-3 px-4 border-r border-gray-300">
                Title
              </th>
              <th className="border-b border-gray-300 py-3 px-4 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {documents
              .filter((doc) => doc.IsBulletNews === "0") // Only show non-bullet news
              .map((doc, index) => (
                <tr
                  key={doc.Id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="py-2 px-3 border-r border-gray-300 text-center">
                    {index + 1}
                  </td>
                  <td className="py-2 px-3 border-r border-gray-300">
                    {new Date(doc.UploadDate).toLocaleString()}{" "}
                    {/* Format date */}
                  </td>
                  <td className="py-2 px-3 border-r border-gray-300">
                    {doc.DocTitle} {/* Use correct field name */}
                  </td>
                  <td className="py-2 px-3 flex gap-3 justify-center">
                    <button
                      onClick={() => handleView(doc)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDownload(doc.DocPath, doc.DocTitle)}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      title="Download"
                    >
                      <FaCloudDownloadAlt />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.Id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      title="Delete"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DocumentPage;
