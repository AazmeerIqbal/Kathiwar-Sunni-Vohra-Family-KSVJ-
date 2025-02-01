import { NextResponse } from "next/server";
import { connectToDB, closeConnection, config } from "@/utils/database";

export async function GET(req, { params }) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json(
      { message: "userId is required as a parameter." },
      { status: 400 }
    );
  }

  try {
    // Connect to DB
    const pool = await connectToDB(config);

    // Fetch documents for the given CNIC
    const result = await pool.request().input("userId", userId).query(`
        SELECT * FROM tb_BroadCast ORDER BY UploadDate DESC
      `);

    // Close DB connection
    await closeConnection(pool);

    // Return documents
    return NextResponse.json({ documents: result.recordset }, { status: 200 });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
