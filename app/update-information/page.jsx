import React from "react";
import { RxUpdate } from "react-icons/rx";
import { RiDownloadCloud2Fill } from "react-icons/ri";
import GradientText from "@/components/ui/GradientText";

const Page = () => {
  return (
    <div className="m-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Update Information</h1>

        <div className="group relative">
          <button className="cursor-pointer group/download relative flex gap-1 px-4 py-2 bg-[#5c5fe9] text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 font-semibold shadow-xl active:shadow-inner transition-all duration-300">
            <RiDownloadCloud2Fill className="text-xl my-auto" />
            Fetch
          </button>
          <div className="absolute text-xs scale-0 rounded-md py-2 px-2 bg-[#5c5fe9]  mt-3 top-full group-hover:scale-100 origin-top transition-all duration-300 shadow-lg before:content-[''] before:absolute before:bottom-full before:left-2/4 before:w-3 before:h-3 before:border-solid before:bg-[#5c5fe9] before:rotate-45 before:translate-y-2/4 before:-translate-x-2/4 text-white">
            Fetch current data from the server
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
