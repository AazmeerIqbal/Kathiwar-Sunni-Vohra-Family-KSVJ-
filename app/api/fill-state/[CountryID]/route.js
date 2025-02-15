import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { cnic, CountryID } = await params;

  console.log("Incoming request for CNIC:", cnic);
  console.log("Selected country ID:", CountryID);

  if (!CountryID) {
    console.error("Missing country parameter!");
    return NextResponse.json(
      { message: "Country is required as a parameter." },
      { status: 400 }
    );
  }

  try {
    const pool = await connectToDB(config);
    console.log("Connected to DB successfully.");

    // Fetch states for the selected country
    const result = await pool
      .request()
      .input("CountryID", CountryID) // ✅ Corrected parameter name
      .query("SELECT * FROM StateMaster WHERE CountryID = @CountryID");

    console.log("Query executed successfully:", result.recordset);

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
