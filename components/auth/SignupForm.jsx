import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { validateEmail, validatePassword } from "../../utils/validation";
import CNICInput from "@/utils/CnicFormatter";
import emailjs from "@emailjs/browser";

// Notification Toaster
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SignupForm = ({ setIsLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    cnic: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const SendEmail = (formData) => {
    const templateParams = {
      from_name: "KSVJ",
      to_email: formData.email,
      message: `Welcome ${formData.firstName} ${formData.lastName}! We are thrilled to have you onboard.`,
      name: `${formData.firstName} ${formData.lastName}`,
      cnic: formData.cnic,
      link: "http://161.97.145.87:8075/login",
    };

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EmailJS_ServiceId,
        process.env.NEXT_PUBLIC_EmailJS_TemplateId,
        templateParams,
        process.env.NEXT_PUBLIC_EmailJS_PublicKey
      )
      .then(
        (result) => {
          console.log("SUCCESS!", result.status, result.text);
          // alert("Welcome email sent successfully!");
        },
        (error) => {
          console.log("FAILED...", error);
          alert("Failed to send the welcome email. Please try again.");
        }
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    // Validate first name
    if (!formData.firstName) {
      newErrors.firstName = "First Name is required";
    }

    // Validate last name
    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate CNIC
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/; // CNIC format XXXXX-XXXXXXX-X
    if (!cnicRegex.test(formData.cnic)) {
      newErrors.cnic =
        "Please enter a valid CNIC in the format XXXXX-XXXXXXX-X";
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/userSignUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          cnic: formData.cnic,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Signup successful!", {
          position: "bottom-center",
        });

        SendEmail(formData);

        setFormData({
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          cnic: "",
          password: "",
          confirmPassword: "",
        });
        setIsLogin(true);
      } else {
        toast.error(data.message || "Signup failed. Please try again.", {
          position: "bottom-center",
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="First Name"
          type="text"
          placeholder="John"
          value={formData.firstName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, firstName: e.target.value }))
          }
          error={errors.firstName}
          icon={<User className="w-5 h-5" />}
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Doe"
          value={formData.lastName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, lastName: e.target.value }))
          }
          error={errors.lastName}
          icon={<User className="w-5 h-5" />}
        />

        <Input
          label="Username"
          type="text"
          placeholder="John"
          value={formData.username}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, username: e.target.value }))
          }
          error={errors.username}
          icon={<User className="w-5 h-5" />}
        />

        <CNICInput
          label="CNIC #"
          placeholder="XXXXX-XXXXXX-X"
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          error={errors.email}
          icon={<Mail className="w-5 h-5" />}
        />

        <div className="relative">
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
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[45px] text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            error={errors.confirmPassword}
            icon={<Lock className="w-5 h-5" />}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[45px] text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} fullWidth>
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
      <ToastContainer />
    </form>
  );
};
