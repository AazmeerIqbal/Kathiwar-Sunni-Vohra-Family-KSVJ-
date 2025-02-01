import { NextResponse } from "next/server";
import { connectToDB, closeConnection, config } from "@/utils/database";
import fs from "fs/promises";
import path from "path";

// POST request handler
export async function POST(req, { params }) {
  const { cnic } = params;

  if (!cnic) {
    return NextResponse.json(
      { message: "CNIC is required as a parameter." },
      { status: 400 }
    );
  }

  try {
    // Parse form data
    const formData = await req.formData();
    console.log("Received FormData:", formData);

    const file = formData.get("file");
    const docTitle = formData.get("title"); // Ensure consistency with form field names
    const isBulletNews = formData.get("bulletNews") === "1" ? 1 : 0;
    const memberId = formData.get("memberId");
    const memberName = formData.get("memberName");
    const companyId = formData.get("companyId");

    // Validate required fields
    if (!file || !docTitle || !memberId || !companyId) {
      console.error("Missing required fields:", {
        file,
        docTitle,
        memberId,
        companyId,
      });
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExt = path.extname(file.name).toLowerCase();

    // Define base upload directory
    const baseUploadDir = path.join(process.cwd(), "public", "Documents");

    // Define file storage path based on isBulletNews
    const targetDir = isBulletNews
      ? path.join(baseUploadDir, "BulletNews")
      : baseUploadDir;

    // Ensure the target directory exists
    await fs.mkdir(targetDir, { recursive: true });

    // Generate file name
    const fileName = `${file.name}`;
    const filePath = path.join(targetDir, fileName);

    // Store relative path for DB
    const relativeFilePath = isBulletNews
      ? `Documents/BulletNews/${fileName}`
      : `Documents/${fileName}`;

    // Connect to DB
    const pool = await connectToDB(config);

    // Check if the file already exists in the database
    const existingFile = await pool
      .request()
      .input("CompanyID", companyId)
      .input("DocTitle", docTitle)
      .query(
        `SELECT TOP 1 DocTitle FROM tb_BroadCast WHERE CompanyID = @CompanyID AND DocTitle = @DocTitle`
      );

    if (existingFile.recordset.length > 0) {
      await closeConnection(pool);
      return NextResponse.json(
        {
          message:
            "A document with this title already exists. Please rename the file and try again.",
        },
        { status: 409 }
      );
    }

    // Save file to the respective path
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Get timestamps
    const uploadDate = new Date().toISOString();
    const createdOn = uploadDate;

    // Insert data into tb_BroadCast
    await pool
      .request()
      .input("CompanyID", companyId)
      .input("MemberId", memberId)
      .input("TransDate", uploadDate)
      .input("UploadDate", uploadDate)
      .input("DocTitle", docTitle)
      .input("DocPath", relativeFilePath)
      .input("FileExtenstion", fileExt)
      .input("IsBulletNews", isBulletNews)
      .input("CreatedOn", createdOn)
      .input("CreatedBy", memberId)
      .input("LastUpdateOn", createdOn)
      .input("LastUpdateBy", memberId).query(`
        INSERT INTO tb_BroadCast 
        (CompanyID, MemberId, TransDate, UploadDate, DocTitle, DocPath, FileExtenstion, IsBulletNews, CreatedOn, CreatedBy, LastUpdateOn, LastUpdateBy)
        VALUES (@CompanyID, @MemberId, @TransDate, @UploadDate, @DocTitle, @DocPath, @FileExtenstion, @IsBulletNews, @CreatedOn, @CreatedBy, @LastUpdateOn, @LastUpdateBy)
      `);

    // Close connection
    await closeConnection(pool);

    return NextResponse.json(
      {
        message: "Document uploaded successfully.",
        filePath: relativeFilePath,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
