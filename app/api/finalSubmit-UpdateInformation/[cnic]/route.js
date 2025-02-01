import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  try {
    // ✅ Await params properly in Next.js 15
    const { cnic } = await context.params;

    if (!cnic) {
      return NextResponse.json(
        { message: "CNIC is required as a parameter." },
        { status: 400 }
      );
    }

    // ✅ Read the request body safely
    const rawBody = await req.text();
    if (!rawBody) {
      return NextResponse.json(
        { message: "Request body is empty." },
        { status: 400 }
      );
    }

    const formData = JSON.parse(rawBody);
    console.log("Received CNIC:", cnic);
    console.log("Form Data:", formData);

    // ✅ Ensure database connection
    const pool = await connectToDB(config);
    console.log("Connected to DB successfully.");

    // ✅ Update query (fix syntax issue)
    await pool.request().input("CNICNo", cnic) // Use CNIC from params
      .query(`
        UPDATE tb_member_mst_test
        SET IsUpdatedFlag = 1
        WHERE CNICNo = @CNICNo;
      `);

    await closeConnection(pool);
    return NextResponse.json({ message: "Data updated successfully." });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
