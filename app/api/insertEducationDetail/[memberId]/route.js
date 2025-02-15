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
      .input("AcademicYear", formData.academicYear)
      .input("HighestQualificationID", formData.qualification)
      .input("AreaofSpecializationID", formData.specialization)
      .input("Institute", formData.institute)
      .input("DegreeTitle", formData.degreeTitle)
      .input("DegreeCompleteInYear", formData.completionYear)
      .input("TotalMarks", formData.totalMarks)
      .input("ObtainMarks", formData.obtainMarks)
      .input("Percentage", formData.grade)
      .input("Description", formData.description).query(`
        INSERT INTO tb_member_edu_det_test (
          MemberID,
          CompanyID,
          AcademicYear,
          HighestQualificationID,
          AreaofSpecializationID,
          Institute,
          DegreeTitle,
          DegreeCompleteInYear,
          TotalMarks,
          ObtainMarks,
          Percentage,
          Description
        ) VALUES (
          @MemberID,
          @CompanyID,
          @AcademicYear,
          @HighestQualificationID,
          @AreaofSpecializationID,
          @Institute,
          @DegreeTitle,
          @DegreeCompleteInYear,
          @TotalMarks,
          @ObtainMarks,
          @Percentage,
          @Description
        );
      `);

    await closeConnection(pool);
    return NextResponse.json({
      message: "Education detail inserted successfully.",
    });
  } catch (error) {
    console.error("Error inserting education detail:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
