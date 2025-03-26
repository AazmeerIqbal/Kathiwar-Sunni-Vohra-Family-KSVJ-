import { NextResponse } from "next/server";
import sql from "mssql";
import { connectToDB, closeConnection, config } from "@/utils/database";

export async function GET(req, { params }) {
  let pool;
  try {
    const { id } = await params; // Extract ID from the request URL

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID parameter is required" },
        { status: 400 }
      );
    }

    // Connect to SQL Server
    pool = await connectToDB(config);

    // Execute stored procedure or SQL query
    const result = await pool
      .request()
      .input("MemberID", sql.VarChar, id) // Assuming CompanyID is VarChar
      .execute("sp_tb_member_fee_sel"); // Replace with your stored procedure

    // Close the connection
    await closeConnection(pool);

    return NextResponse.json({ success: true, data: result.recordset });
  } catch (error) {
    await closeConnection(pool);
    console.error("Error fetching financial statistics:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
