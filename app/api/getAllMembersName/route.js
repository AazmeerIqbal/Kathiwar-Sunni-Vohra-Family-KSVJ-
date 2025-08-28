import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Establish database connection
    const pool = await connectToDB(config);

    // Run queries to fetch data from multiple tables
    const MemberName = await pool
      .request()
      .query(
        "SELECT memberId, MemberName, MemberFatherName, FamilyID FROM tb_member_mst"
      );

    //  "SELECT m.MemberId, m.MemberName, m.MemberFatherName, m.FamilyID, f.FamilyName FROM tb_member_mst m INNER JOIN tb_member_family_mst f ON m.FamilyID = f.FamilyID"
    // Close the database connection
    await closeConnection(pool);

    // Return success response with all fetched data
    return NextResponse.json({
      message: "Query executed successfully.",
      fathers: MemberName.recordset,
    });
  } catch (error) {
    // Handle and log errors
    console.error("Error executing query:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
