import React from "react";
import { Input } from "@/components/ui/Input";
import { User } from "lucide-react";

const CNICInput = ({ label, placeholder, formData, setFormData, errors }) => {
  const handleCNICChange = (e) => {
    // Remove non-numeric characters and existing dashes
    let value = e.target.value.replace(/[^0-9]/g, "").replace(/-/g, "");

    // Limit input to 13 numeric characters
    if (value.length > 13) value = value.slice(0, 13);

    // Format the value: XXXXX-XXXXXXX-X
    if (value.length > 5 && value.length <= 12) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }
    if (value.length > 12) {
      value =
        value.slice(0, 5) + "-" + value.slice(5, 12) + "-" + value.slice(12);
    }

    // Update the form data
    setFormData((prev) => ({ ...prev, cnic: value }));
  };

  return (
    <Input
      label={label}
      type="text"
      placeholder={placeholder}
      value={formData.cnic}
      onChange={handleCNICChange}
      error={errors.cnic}
      icon={<User className="w-5 h-5" />}
    />
  );
};

export default CNICInput;
