import React from "react";
import Image from "next/image";

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-3xl drop-shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Section with Logo */}
        <div className="bg-white px-8 pt-8 pb-6 text-center border-b border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28">
              <Image
                src="/ksvj.jpg"
                alt="KSVJ Logo"
                fill
                className="object-contain rounded-full"
                priority
              />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>}
        </div>
        
        {/* Form Section */}
        <div className="px-8 py-6 sm:py-8">
          {children}
        </div>
      </div>
    </div>
  );
};
