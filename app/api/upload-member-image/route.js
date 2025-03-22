import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const memberId = formData.get("memberId");

    if (!file || !memberId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing file or member ID",
        },
        { status: 400 }
      );
    }

    // Get the file extension from the original filename
    const originalFilename = file.name;
    const fileExtension = path.extname(originalFilename) || ".png"; // Default to .png if no extension

    // Create directory if it doesn't exist
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "MemberImages",
      memberId
    );
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get file as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to disk with original extension
    const filePath = path.join(uploadDir, `${memberId}${fileExtension}`);

    // Check if file exists and log appropriate message
    const fileExists = fs.existsSync(filePath);
    console.log(
      fileExists
        ? `Replacing existing image for member ${memberId}`
        : `Creating new image for member ${memberId}`
    );

    // Remove any existing image files for this member (with any extension)
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      files.forEach((existingFile) => {
        if (existingFile.startsWith(memberId + ".")) {
          fs.unlinkSync(path.join(uploadDir, existingFile));
        }
      });
    }

    fs.writeFileSync(filePath, buffer);

    // Return the path that can be used in the frontend
    const imagePath = `/MemberImages/${memberId}/${memberId}${fileExtension}`;

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
