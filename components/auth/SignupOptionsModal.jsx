import React from "react";
import { UserPlus, UserCheck } from "lucide-react";

const SignupOptionsModal = ({
  isOpen,
  onClose,
  onNewRegistration,
  onSignup,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
          Are you already a member?
        </h3>
        <p className="text-gray-600 mb-6 text-center text-sm">
          Choose the option that best describes your situation
        </p>
        
        <div className="space-y-4">
          {/* New Member Registration */}
          <button
            onClick={onNewRegistration}
            className="w-full p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <UserPlus className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
              </div>
              <div className="text-left w-full">
                <div className="font-medium text-gray-900">I'm not a member</div>
                <div className="text-sm text-right text-gray-600">
                میں ایک ممبر نہیں ہوں۔
                </div>
                {/* <div className="text-sm text-gray-600">
                  Register as a new family member
                </div>
                 */}
              </div>
            </div>
          </button>

          {/* Existing Member Signup */}
          <button
            onClick={onSignup}
            className="w-full p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3 ">
              <div className="flex-shrink-0">
                <UserCheck className="w-6 h-6 text-green-600 group-hover:text-green-700" />
              </div>
              <div className="text-left w-full">
                <div className="font-medium text-gray-900">I'm already a member</div>
                <div className="text-sm text-right text-gray-600 ">
                میں ایک موجودہ ممبر ہوں۔
                </div>
                {/* <div className="text-sm text-gray-600">
                  Create login credentials for existing membership
                </div> */}
              </div>
            </div>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full text-gray-500 py-2 px-4 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupOptionsModal;
