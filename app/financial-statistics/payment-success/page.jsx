"use client";
import React from "react";

const page = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const amount = urlParams.get("amount");

  return (
    <div className="max-w-md mx-auto my-8 p-8 text-center rounded-lg shadow-lg bg-indigo-600/50">
      <h1 className="font-bold text-2xl text-white mb-4">Thank You!</h1>
      <p className="text-white text-lg mb-4">
        Your payment of {amount} PKR was successful.
      </p>
      <button
        onClick={() => (window.location.href = "/financial-statistics")}
        className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-md transition-colors"
      >
        Back to Financial Statistics
      </button>
    </div>
  );
};

export default page;
