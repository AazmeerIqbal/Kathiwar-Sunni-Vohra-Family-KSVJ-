import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing file",
        },
        { status: 400 }
      );
    }

    // Get the file extension from the original filename
    const originalFilename = file.name;
    const fileExtension = path.extname(originalFilename) || ".png"; // Default to .png if no extension

    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "NewRegisterImages");

    // Generate a 5-digit random number
    const randomId = Math.floor(10000 + Math.random() * 90000).toString();

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get file as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to disk with original extension
    const filePath = path.join(uploadDir, `${randomId}${fileExtension}`);

    // Check if file exists and log appropriate message
    const fileExists = fs.existsSync(filePath);
    console.log(
      fileExists
        ? `Replacing existing image with ID ${randomId}`
        : `Creating new image with ID ${randomId}`
    );

    // We don't need to check for existing files with this approach since we're using random IDs

    fs.writeFileSync(filePath, buffer);

    // Return the path that can be used in the frontend
    const imagePath = `/NewRegisterImages/${randomId}${fileExtension}`;

    return NextResponse.json({
      success: true,
      message: fileExists
        ? "Image replaced successfully"
        : "Image uploaded successfully",
      imagePath,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload image",
      },
      { status: 500 }
    );
  }
}
