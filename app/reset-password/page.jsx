"use client";
import { useSearchParams, useRouter } from "next/navigation"; // Correct hooks for App Router
import { useState } from "react";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token"); // Get the token from query params
  console.log(token);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`/api/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Password reset successful!");
        router.push("/login"); // Redirect to login page
      } else {
        setError(data.message || "Error resetting password.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <form
      onSubmit={handleReset}
      className="mx-auto mt-10 max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-200 md:mt-20"
    >
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Reset Password
      </h1>
      {error && (
        <p className="mb-4 text-red-500 text-sm font-medium text-center">
          {error}
        </p>
      )}
      <div className="mb-4">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>
      <div className="mb-6">
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-200"
      >
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
