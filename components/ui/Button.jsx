import React from "react";
import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  isLoading,
  variant = "primary",
  fullWidth,
  className = "",
  disabled,
  onClick,
  ...props
}) => {
  const baseStyles =
    "px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]";
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 shadow-lg hover:shadow-xl",
    secondary:
      "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 disabled:from-gray-300 disabled:to-gray-400",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
      onClick={onClick}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};
