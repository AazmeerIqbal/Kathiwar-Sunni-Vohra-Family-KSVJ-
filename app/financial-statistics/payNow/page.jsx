"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const Page = () => {
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const { data: session } = useSession();

  console.log("Session from pay now", session?.user);

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }

      // Clean up previous preview URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      setError("");

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleScreenshotUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a screenshot first");
      return;
    }

    if (!session?.user?.memberId) {
      setError("User session not found");
      return;
    }

    setIsUploading(true);
    setUploadMessage("");

    try {
      const formData = new FormData();
      formData.append("screenshot", selectedFile);

      const response = await fetch(
        `/api/TransactionSS/${session.user.memberId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUploadMessage("Screenshot uploaded successfully!");
        setSelectedFile(null);
        setPreviewUrl(null);
        // Reset file input
        e.target.reset();
      } else {
        setError(data.message || "Failed to upload screenshot");
      }
    } catch (error) {
      console.error("Error uploading screenshot:", error);
      setError("Failed to upload screenshot. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 text-center rounded-xl shadow-lg bg-gradient-to-br from-indigo-500/70 via-purple-500/60 to-indigo-600/70 m-6 border border-indigo-400 drop-shadow-2xl">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-wide">
        Bank Account Details
      </h2>
      <div className="bg-white/30 rounded-lg p-6 inline-block text-left shadow-md">
        <div className="mb-2">
          <span className="font-semibold text-indigo-900">Account Title:</span>
          <span className="ml-2 text-indigo-800">
            Kathiawar Sunni Vohra Jamat (General Fund)
          </span>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-indigo-900">A/c No.:</span>
          <span className="ml-2 text-indigo-800">0122-0100004301</span>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-indigo-900">IBAN:</span>
          <span className="ml-2 text-indigo-800 break-all">
            PK78MEZN0001220100004301
          </span>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-indigo-900">Bank:</span>
          <span className="ml-2 text-indigo-800">Meezan Bank Ltd.</span>
        </div>
        <div>
          <span className="font-semibold text-indigo-900">Branch:</span>
          <span className="ml-2 text-indigo-800">Dhoraji Branch, Karachi</span>
        </div>
      </div>

      <div className="mt-6 text-indigo-100 text-sm italic">
        Please use the above details to make your payment. <br />
        After payment, kindly upload the screen shot below.
      </div>

      {/* Screenshot Upload Section */}
      <div className="mt-8 bg-white/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Upload Transaction Screenshot
        </h3>

        <form onSubmit={handleScreenshotUpload} className="space-y-4">
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-indigo-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-700 file:text-white hover:file:bg-indigo-800 file:cursor-pointer"
            />
            <p className="text-xs text-indigo-200 mt-1">
              Supported formats: JPG, PNG, GIF (Max 5MB)
            </p>
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-4">
              <h4 className="text-white font-medium mb-2">Preview:</h4>
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Screenshot preview"
                  className="max-w-full h-auto max-h-64 rounded-lg border-2 border-indigo-300"
                />
              </div>
            </div>
          )}

          {/* Error and Success Messages */}
          {error && (
            <div className="text-red-200 text-sm bg-red-900/30 p-2 rounded">
              {error}
            </div>
          )}

          {uploadMessage && (
            <div className="text-green-200 text-sm bg-green-900/30 p-2 rounded">
              {uploadMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              !selectedFile || isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-700 hover:bg-indigo-800 text-white"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload Screenshot"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
