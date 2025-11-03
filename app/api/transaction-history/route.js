import { connectToDB, closeConnection } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Establish database connection
    const pool = await connectToDB();

    // Fetch all transactions from TransactionHistorySS table
    // Order by DateAndTime descending to show newest first
    const result = await pool.request().query(`
      SELECT 
        MemberId,
        MemberName,
        MemberFatherName,
        FamilyID,
        Amount,
        ScreenShot,
        DateAndTime
      FROM TransactionHistorySS
      ORDER BY DateAndTime DESC
    `);

    // Close the database connection
    await closeConnection();

    // Return success response with transactions
    return NextResponse.json({
      message: "Transactions fetched successfully.",
      transactions: result.recordset,
    });
  } catch (error) {
    // Handle and log errors
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

