import React, { useState } from "react";
import { Lock, User } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { validateEmail } from "@/utils/validation";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import CNICInput from "@/utils/CnicFormatter";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const LoginForm = ({ isAdmin, onToggleMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cnic: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Call the signIn function
      const result = await signIn("credentials", {
        redirect: false, // Prevent automatic redirection
        cnic: formData.cnic,
        password: formData.password,
      });

      setIsLoading(false);

      if (result.ok) {
        router.push("/"); // Redirect to the home page or any other page
      } else {
        toast.error("Invalid username or password", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        console.error("Login failed:", result.error);
        setErrors({ general: "Invalid username or password" });
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.error("Unexpected error:", error);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <CNICInput
          label="CNIC #"
          placeholder="Enter CNIC"
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          error={errors.password}
          icon={<Lock className="w-5 h-5" />}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <span className="text-sm text-gray-600">Show Password</span>
          </label>

          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" isLoading={isLoading} fullWidth>
          {isLoading
            ? "Signing in..."
            : `Sign in as ${isAdmin ? "Admin" : "User"}`}
        </Button>

        {/* {errors.general && (
          <p className="text-red-500 text-sm mt-2">{errors.general}</p>
        )} */}

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-blue-500 font-medium"
            onClick={onToggleMode}
          >
            Switch to {isAdmin ? "User" : "Admin"} Login
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};
