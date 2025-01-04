import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { validateEmail, validatePassword } from "../../utils/validation";
import CNICInput from "@/utils/CnicFormatter";
import emailjs from "@emailjs/browser";

export const SignupForm = ({ setIsLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    memberId: "",
    cnic: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const SendEmail = (formData) => {
    const templateParams = {
      from_name: "KSVJ",
      to_email: formData.email,
      cnic: formData.cnic,
      message: `Welcome ${formData.firstName} ${formData.lastName}! We are thrilled to have you onboard.`,
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
          console.error("FAILED...", error);
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

    // Validate gender
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
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

    // If there are validation errors, show them
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
          gender: formData.gender,
          email: formData.email,
          memberId: formData.memberId,
          cnic: formData.cnic,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Signup successful:", data);
        alert("Signup successful!");

        SendEmail(formData);

        setFormData({
          username: "",
          firstName: "",
          lastName: "",
          gender: "",
          email: "",
          memberId: "",
          cnic: "",
          password: "",
          confirmPassword: "",
        });
        setIsLogin(true);
      } else {
        console.error("Signup failed:", data);
        alert(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert(error.message);
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

        <div className="space-y-2">
          <label htmlFor="gender" className="block text-sm font-medium">
            Gender
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, gender: e.target.value }))
            }
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.gender ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && (
            <p className="text-sm text-red-500">{errors.gender}</p>
          )}
        </div>

        <Input
          label="Member ID (optional)"
          type="text"
          placeholder="XXXX-XXXXXX"
          value={formData.memberId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, memberId: e.target.value }))
          }
          error={errors.memberId}
          icon={<Mail className="w-5 h-5" />}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          error={errors.password}
          icon={<Lock className="w-5 h-5" />}
        />

        <Input
          label="Confirm Password"
          type="password"
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
      </div>

      <Button type="submit" isLoading={isLoading} fullWidth>
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};
