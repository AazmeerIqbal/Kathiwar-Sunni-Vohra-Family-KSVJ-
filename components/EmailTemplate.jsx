import React from "react";

export const EmailTemplate = ({ firstName, message, link }) => (
  <div className="max-w-md mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg">
    <h1 className="text-2xl font-bold text-green-600 text-center">
      Welcome, {firstName}!
    </h1>
    <p className="text-gray-700 mt-4 text-base leading-relaxed">
      {message || "We're thrilled to have you on board! Let's get started."}
    </p>
    {link && (
      <div className="text-center mt-6">
        <a
          href={link}
          className="px-6 py-3 text-white bg-green-500 hover:bg-green-600 font-medium text-lg rounded-md transition duration-300"
        >
          Login Now
        </a>
      </div>
    )}
    <hr className="border-t border-gray-300 my-8" />
    <p className="text-sm text-gray-500 text-center">
      If you have any questions, feel free to reply to this email. We're here to
      help!
    </p>
  </div>
);
