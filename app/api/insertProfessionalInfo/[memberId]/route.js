import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    // Await params to ensure it's ready
    const { memberId } = await params;

    if (!memberId) {
      return NextResponse.json(
        { message: "Member ID is required as a parameter." },
        { status: 400 }
      );
    }

    const formData = await req.json();
    console.log("Received Member ID:", memberId);
    console.log("Form Data:", formData);

    const pool = await connectToDB(config);
    console.log("Connected to DB successfully.");

    await pool
      .request()
      .input("MemberID", memberId)
      .input("CompanyID", "12")
      .input("CurrentProfession", formData.profession)
      .input("CompanyName", formData.companyName)
      .input("CurrentPosition", formData.currentPosition)
      .input("ProfessionalExperience", formData.professionalExp)
      .input("EmployeeUnEmployeed", formData.employeeStatus).query(`
        INSERT INTO tb_member_professional_det_test (
          MemberID,
          CompanyID,
          CurrentProfession,
          CompanyName,
          CurrentPosition,
          ProfessionalExperience,
          EmployeeUnEmployeed
        ) VALUES (
          @MemberID,
          @CompanyID,
          @CurrentProfession,
          @CompanyName,
          @CurrentPosition,
          @ProfessionalExperience,
          @EmployeeUnEmployeed
        );
      `);

    await closeConnection(pool);
    return NextResponse.json({
      message: "Professional detail inserted successfully.",
    });
  } catch (error) {
    console.error("Error inserting Professional detail:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
