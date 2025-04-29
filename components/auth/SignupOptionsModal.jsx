import React from "react";

const SignupOptionsModal = ({
  isOpen,
  onClose,
  onNewRegistration,
  onSignup,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Choose Registration Option
        </h3>
        <p className="text-gray-600 mb-6">
          Please select how you would like to proceed with registration
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onNewRegistration}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            New Registration
          </button>
          <button
            onClick={onSignup}
            className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors"
          >
            Sign Up
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-600 py-2 px-4 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupOptionsModal;
