import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  let pool;
  try {
    const { memberId } = await params;

    if (!memberId) {
      return NextResponse.json(
        { message: "Member ID is required as a parameter." },
        { status: 400 }
      );
    }

    console.log("Attempting database connection...");
    pool = await connectToDB(config);
    console.log("Database connected successfully");

    console.log("Executing query for MemberID:", memberId);
    const result = await pool
      .request()
      .input("MemberID", parseInt(memberId)) // Convert to integer
      .query(
        "SELECT * FROM tb_member_living_det_test WHERE MemberID = @MemberID"
      );
    console.log("Query executed successfully");

    return NextResponse.json({
      message: "Query executed successfully.",
      data: result.recordset,
    });
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json(
      { message: "Internal Server Error Living", error: error.message },
      { status: 500 }
    );
  } finally {
    if (pool) {
      try {
        await closeConnection(pool);
        console.log("Database connection closed");
      } catch (closeError) {
        console.error("Error closing connection:", closeError);
      }
    }
  }
}
