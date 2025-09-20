import React, { use, useState } from "react";
import { Lock } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import CNICInput from "@/utils/CnicFormatter";
import emailjs from "@emailjs/browser";
import { decrypt } from "@/utils/Encryption";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export const LoginForm = ({ isAdmin, onToggleMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    cnic: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [forgetPassClick, setforgetPassClick] = useState(false);
  const router = useRouter();

  const SendEmail = (formData) => {
    const { email, username, resetLink, cnic } = formData.data;
    const templateParams = {
      from_name: "KSVJ",
      username: username,
      cnic: cnic,
      to_email: email,
      message: `${username}, recover your password`,
      link: resetLink,
    };

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EmailJS_ServiceId,
        process.env.NEXT_PUBLIC_EmailJS_TemplateId_PassRecovery,
        templateParams,
        process.env.NEXT_PUBLIC_EmailJS_PublicKey
      )
      .then(
        (result) => {
          console.log("SUCCESS!", result.status, result.text);
        },
        (error) => {
          console.log("FAILED...", error);
          alert("Failed to send the reset email. Please try again.");
        }
      );
  };

  const handleForgotPass = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    // Validate CNIC
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/; // CNIC format XXXXX-XXXXXXX-X
    if (!cnicRegex.test(formData.cnic)) {
      newErrors.cnic =
        "Please enter a valid CNIC in the format XXXXX-XXXXXXX-X";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setforgetPassClick(true);

    try {
      // Send the GET request
      const response = await fetch(`/api/forgetPass/${formData.cnic.trim()}`, {
        method: "GET",
      });

      const data = await response.json();
      if (response.ok) {
        SendEmail(data);
        console.log("Fetched data:", data);

        // Access fetched user details
        const { email, userId, password, cnic, resetLink } = data.data;
        toast.success(`Password recovery email sent to ${email}`, {
          position: "bottom-center",
        });

        setFormData({ cnic: "", password: "" });
      } else {
        toast.error(data.message || "Error while sending email.", {
          position: "bottom-center",
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.", {
        position: "bottom-center",
      });
    } finally {
      setforgetPassClick(false);
    }
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    // Validate CNIC
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/; // CNIC format XXXXX-XXXXXXX-X
    if (!isAdmin && !cnicRegex.test(formData.cnic)) {
      newErrors.cnic =
        "Please enter a valid CNIC in the format XXXXX-XXXXXXX-X";
    }

    // Validate username for admin login
    if (isAdmin && !formData.username) {
      newErrors.username = "Username is required";
    }

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
        username: isAdmin ? formData.username : undefined,
        cnic: isAdmin ? undefined : formData.cnic,
        password: formData.password,
        isAdmin, // Pass the isAdmin flag to the backend
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

        console.log("Login failed:", result.error);
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

      console.log("Unexpected error:", error);
    }
  };

  const newRegisterationClick = () => {
    router.push("/register-user");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {isAdmin ? (
          <div className="space-y-2">
            <Input
              label="Username"
              type="text"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              error={errors.username}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <CNICInput
              label="CNIC #"
              placeholder="Enter CNIC"
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          </div>
        )}

        <div className="space-y-2">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            error={errors.password}
            icon={<Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <span className="text-sm text-gray-600 select-none">Show Password</span>
          </label>

          {!isAdmin && (
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200 self-start sm:self-auto"
              onClick={handleForgotPass}
              disabled={forgetPassClick}
            >
              {forgetPassClick ? "Sending..." : "Forgot password?"}
            </button>
          )}
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            isLoading={isLoading} 
            fullWidth={"w-full"}
            className="h-12 text-base font-semibold"
          >
            {isLoading
              ? "Signing in..."
              : `Sign in as ${isAdmin ? "Admin" : "Member"}`}
          </Button>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-blue-500 font-medium transition-colors duration-200"
            onClick={onToggleMode}
          >
            Switch to {isAdmin ? "Member" : "Admin"} Login
          </button>
        </div>
      </form>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};
