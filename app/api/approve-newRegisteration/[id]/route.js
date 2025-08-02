import { NextResponse } from "next/server";
import { connectToDB, closeConnection, config } from "@/utils/database";
import sql from "mssql";

export async function POST(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Member ID is required." },
      { status: 400 }
    );
  }

  try {
    // Connect to DB
    const pool = await connectToDB();

    // Execute stored procedure
    const request = pool.request();
    request.input("MemberId", sql.Int, id);

    const result = await request.execute("FetchUserApproveData");

    return NextResponse.json(
      {
        success: true,
        message: "Information approved successfully.",
        data: result.recordset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in approve-updateInformation route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to approve information.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    closeConnection(); // Always close connection
  }
}
