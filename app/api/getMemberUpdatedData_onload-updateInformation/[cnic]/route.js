import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { cnic } = await params; // Correctly get 'cnic' from the URL parameters

  if (!cnic) {
    return NextResponse.json(
      { message: "CNIC is required as a parameter." },
      { status: 400 }
    );
  }

  try {
    const pool = await connectToDB(config);

    // Run the query
    const result = await pool
      .request()
      .input("CNICNo", cnic) // Pass CNIC as input parameter
      .query("SELECT * FROM tb_member_mst_test WHERE CNICNo=@CNICNo");

    await closeConnection(pool);

    // Return success message
    return NextResponse.json({
      message: "Query executed successfully.",
      data: result.recordset, // Ensure returning only recordset
    });
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
