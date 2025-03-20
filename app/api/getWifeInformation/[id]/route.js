import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  if (id == null) {
    return NextResponse.json(
      { message: "Member Id is null, required as a parameter." },
      { status: 400 }
    );
  }

  try {
    const pool = await connectToDB(config);

    // Run the query
    const result = await pool
      .request()
      .input("MemberID", id)
      .query(
        "SELECT * FROM tb_member_wife_det_test where memberwifeId = @MemberID"
      );

    await closeConnection(pool);

    // Return success message
    return NextResponse.json({
      message: "Query executed successfully.",
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
