import React from "react";

const Loader = ({ w, h }) => {
  return (
    <div
      className={`w-${w} h-${h} my-auto border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin`}
    ></div>
  );
};

export default Loader;
