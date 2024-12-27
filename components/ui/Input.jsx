import React from 'react';

export const Input = ({
  label,
  error,
  className = '',
  icon,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 py-3 ${
            icon ? 'pl-11' : ''
          } border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
};