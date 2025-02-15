import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const pool = await connectToDB(config);
    console.log("Connected to DB successfully.");

    // Fetch states for the selected country
    const result = await pool
      .request()
      .query("SELECT * FROM tb_member_education_HQ");

    await closeConnection(pool);

    return NextResponse.json({
      message: "HQ fetched successfully.",
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching HQ:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
