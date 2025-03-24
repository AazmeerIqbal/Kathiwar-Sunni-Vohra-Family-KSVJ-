import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { cnic } = await params;
    console.log("Member ID from Final Submit to Admin: ", cnic);

    if (!cnic) {
      return NextResponse.json(
        { message: "CNIC is required as a parameter." },
        { status: 400 }
      );
    }

    // ✅ Ensure database connection
    const pool = await connectToDB(config);
    console.log("Connected to DB successfully.");

    // ✅ Update query (fix syntax issue)
    await pool.request().input("CNICNo", cnic) // Use CNIC from params
      .query(`
        UPDATE tb_member_mst_test
        SET IsUpdatedFlag = 1
        WHERE memberId = @CNICNo;
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
