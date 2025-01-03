import React from "react";
import { Shield } from "lucide-react";

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center p-4">
      <div className="md:max-w-lg max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8 border border-white/20">
        <div className="text-center space-y-2">
          {/* <span className="text-4xl font-extrabold tracking-wide">KSVJ</span> */}
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
};
