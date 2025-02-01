import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { cnic } = await params;

  if (!cnic) {
    return NextResponse.json(
      { message: "CNIC is required as a parameter." },
      { status: 400 }
    );
  }

  try {
    const pool = await connectToDB(config);

    // Run the stored procedure
    const result = await pool
      .request()
      .input("CNICNo", cnic) // Pass the CNIC parameter
      .execute("fetchUserData");

    await closeConnection(pool);

    // Return success message
    return NextResponse.json({
      message: "Stored procedure executed successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error executing stored procedure:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
