import React from "react";
import Loader from "./Loader";
export const ButtonInfoHover = ({
  text,
  info,
  icon,
  Loading,
  handleFetchData,
}) => {
  return (
    <>
      <div className="group relative flex items-center flex-col sm:flex-row sm:gap-2 md:flex md:flex-row md:gap-2 md:items-center lg:flex lg:flex-row lg:gap-2 lg:items-center">
        <button
          className="cursor-pointer group/download relative flex gap-1 px-4 py-2 bg-[#213555] text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 font-semibold shadow-xl active:shadow-inner transition-all duration-300"
          onClick={handleFetchData}
        >
          {Loading ? <Loader w={4} h={4} /> : icon}
          {text}
        </button>
        <div className="absolute text-xs scale-0 rounded-md py-2 px-2 bg-[#213555]  mt-3 top-full group-hover:scale-100 origin-top transition-all duration-300 shadow-lg before:content-[''] before:absolute before:bottom-full before:left-2/4 before:w-3 before:h-3 before:border-solid before:bg-[#213555] before:rotate-45 before:translate-y-2/4 before:-translate-x-2/4 text-white z-10">
          {info}
        </div>
      </div>
    </>
  );
};
