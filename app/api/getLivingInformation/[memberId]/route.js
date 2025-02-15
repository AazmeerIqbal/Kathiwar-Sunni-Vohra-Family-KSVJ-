import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { memberId } = params; // Correctly destructure params

    if (!memberId) {
      return NextResponse.json(
        { message: "Member ID is required as a parameter." },
        { status: 400 }
      );
    }

    console.log("Fetching living information for Member ID:", memberId);

    // Connect to the database
    const pool = await connectToDB(config);

    // Fetch data from the database
    const result = await pool
      .request()
      .input("MemberID", memberId)
      .query(
        "SELECT * FROM tb_member_living_det_test WHERE MemberID = @MemberID"
      );

    await closeConnection(pool);

    return NextResponse.json({
      message: "Query executed successfully.",
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error executing Living query:", error);
    return NextResponse.json(
      { message: "Internal Server Error Living", error: error.message },
      { status: 500 }
    );
  }
}
