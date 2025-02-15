import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const pool = await connectToDB(config);
    console.log("Connected to DB successfully.");

    const result = await pool.request().query("SELECT * FROM CountryMaster");

    await closeConnection(pool);

    return NextResponse.json({
      message: "States fetched successfully.",
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
