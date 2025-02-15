import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    // Get Member ID from params
    const { memberId } = params;
    if (!memberId) {
      return NextResponse.json(
        { message: "Member ID is required as a parameter." },
        { status: 400 }
      );
    }

    // Parse form data from request
    const formData = await req.json();
    console.log("Received Member ID:", memberId);
    console.log("Form Data:", formData);

    // Connect to database
    const pool = await connectToDB(config);
    console.log("Connected to DB successfully.");

    // Insert data into tb_member_living_det_test
    await pool
      .request()
      .input("MemberId", memberId)
      .input("LivingCountryID", formData.country)
      .input("LivingStateID", formData.state)
      .input("LivingCityID", formData.city)
      .input("DateFrom", formData.dateFrom || null)
      .input("DateTo", formData.dateTo || null)
      .input("Remarks", formData.remarks || "")
      .input("Address", formData.address || "").query(`
        INSERT INTO tb_member_living_det_test (
          MemberId,
          LivingCountryID,
          LivingStateID,
          LivingCityID,
          DateFrom,
          DateTo,
          Remarks,
          Address
        ) VALUES (
          @MemberId,
          @LivingCountryID,
          @LivingStateID,
          @LivingCityID,
          @DateFrom,
          @DateTo,
          @Remarks,
          @Address
        );
      `);

    await closeConnection(pool);
    return NextResponse.json({
      message: "Living detail inserted successfully.",
    });
  } catch (error) {
    console.error("Error inserting living detail:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
