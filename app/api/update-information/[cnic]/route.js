import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { cnic } = await params;
  console.log("Member ID from Update information: ", cnic);

  if (!cnic) {
    return NextResponse.json(
      { message: "CNIC is required as a parameter." },
      { status: 400 }
    );
  }
  try {
    const pool = await connectToDB(config);

    // Execute the stored procedure
    const result = await pool
      .request()
      .input("MemberId", cnic) // Pass MemberId
      .execute("fetchUserData");

    await closeConnection(pool);

    // Extract different result sets
    const responseData = {
      memberInfo: result.recordsets[0] || [],
      educationInfo: result.recordsets[1] || [],
      professionalInfo: result.recordsets[2] || [],
      livingInfo: result.recordsets[3] || [],
      wifeInfo: result.recordsets[4] || [],
      childInfo: result.recordsets[5] || [],
    };

    return NextResponse.json({
      message: "Stored procedure executed successfully.",
      data: responseData,
    });
  } catch (error) {
    console.error("Error executing stored procedure:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
