import { NextResponse } from "next/server";
import { connectToDB, closeConnection, config } from "@/utils/database";
import fs from "fs/promises";
import path from "path";

// POST request handler
export async function POST(req, { params }) {
  const { id: memberId } = params;

  if (!memberId) {
    return NextResponse.json(
      { message: "Member ID is required as a parameter." },
      { status: 400 }
    );
  }

  try {
    // Parse form data
    const formData = await req.formData();
    console.log("Received FormData:", formData);

    const file = formData.get("screenshot");

    // Validate required fields
    if (!file) {
      console.error("Missing required fields:", { file });
      return NextResponse.json(
        { message: "Screenshot is required." },
        { status: 400 }
      );
    }

    // Connect to DB
    const pool = await connectToDB(config);

    // First query to get member details
    const memberResult = await pool.request().input("memberId", memberId)
      .query(`
        SELECT 
          m.MemberId,
          m.MemberName,
          m.MemberFatherName,
          m.FamilyID,
          f.FamilyName
        FROM tb_member_mst m
        INNER JOIN tb_member_family_mst f
          ON m.FamilyID = f.FamilyID
        WHERE m.MemberId = @memberId
      `);

    if (memberResult.recordset.length === 0) {
      await closeConnection(pool);
      return NextResponse.json(
        { message: "Member not found." },
        { status: 404 }
      );
    }

    const memberData = memberResult.recordset[0];

    // Get file extension
    const fileExt = path.extname(file.name).toLowerCase();

    // Define upload directory
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "TransactionScreenShots"
    );

    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate file name with MemberId and DateTime
    const now = new Date();
    const dateTime = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const fileName = `${memberId}-${dateTime}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // Store relative path for DB
    const relativeFilePath = `TransactionScreenShots/${fileName}`;

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Get current timestamp
    const currentDateTime = new Date().toISOString();

    // Insert data into TransactionHistorySS table
    await pool
      .request()
      .input("MemberId", memberData.MemberId)
      .input("MemberName", memberData.MemberName)
      .input("MemberFatherName", memberData.MemberFatherName)
      .input("FamilyID", memberData.FamilyID)
      .input("ScreenShot", relativeFilePath)
      .input("DateAndTime", currentDateTime).query(`
        INSERT INTO TransactionHistorySS 
        (MemberId, MemberName, MemberFatherName, FamilyID, ScreenShot, DateAndTime)
        VALUES (@MemberId, @MemberName, @MemberFatherName, @FamilyID, @ScreenShot, @DateAndTime)
      `);

    // Close connection
    await closeConnection(pool);

    return NextResponse.json(
      {
        message: "Transaction screenshot uploaded successfully.",
        filePath: relativeFilePath,
        memberData: memberData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading transaction screenshot:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
