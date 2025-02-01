import React from "react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa6";

const DocumentCards = ({
  title,
  date,
  onView,
  onDownload,
  onDelete,
  isAdmin,
}) => {
  return (
    <div className="w-64 bg-gradient-to-l from-slate-300 to-slate-100 text-slate-700 border border-slate-300 p-4 gap-3 rounded-lg shadow-md flex flex-col items-center">
      <div className="text-lg font-semibold text-center">{title}</div>
      <div className="text-sm text-gray-500">
        {new Date(date).toLocaleString()}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onView}
          className="rounded-md bg-blue-600 text-white hover:bg-blue-700 transition p-2"
        >
          <FaEye className="w-4 h-4" />
        </button>
        <button
          onClick={onDownload}
          className="rounded-md bg-green-600 text-white hover:bg-green-700 transition p-2"
        >
          <FaCloudDownloadAlt className="w-4 h-4" />
        </button>
        {isAdmin === 1 ? (
          <button
            onClick={onDelete}
            className="rounded-md bg-red-600 text-white hover:bg-red-700 transition p-2"
          >
            <MdDelete className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default DocumentCards;
