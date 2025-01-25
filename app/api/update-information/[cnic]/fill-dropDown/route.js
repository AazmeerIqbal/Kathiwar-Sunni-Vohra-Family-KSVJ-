import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { cnic } = params;

  //   // Validate CNIC parameter
  //   if (!cnic) {
  //     return NextResponse.json(
  //       { message: "CNIC is required as a parameter." },
  //       { status: 400 }
  //     );
  //   }

  try {
    // Establish database connection
    const pool = await connectToDB(config);

    // Run the query to fetch data from the table
    const result = await pool
      .request()
      .query("SELECT * FROM tb_member_family_mst");

    // Close the database connection
    await closeConnection(pool);

    // Return success response with the result
    return NextResponse.json({
      message: "Query executed successfully.",
      data: result.recordset, // Assuming recordset contains the rows
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
