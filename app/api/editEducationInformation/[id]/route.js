import { connectToDB, closeConnection, config } from "@/utils/database";
import sql from "mssql";

export async function PUT(req, { params }) {
  try {
    const { id } = params; // Get education ID from dynamic route params
    const data = await req.json(); // Parse request body

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Education ID is required" }),
        { status: 400 }
      );
    }

    let pool = await connectToDB(config);

    // Update education information in the database
    const updateResult = await pool
      .request()
      .input("MemberEduID", id)
      .input("AcademicYear", data.AcademicYear)
      .input("HighestQualificationID", data.HighestQualificationID)
      .input("AreaofSpecializationID", data.AreaofSpecializationID)
      .input("Institute", data.Institute)
      .input("DegreeCompleteInYear", data.DegreeCompleteInYear)
      .input("TotalMarks", data.TotalMarks)
      .input("ObtainMarks", data.ObtainMarks)
      .input("Percentage", data.Percentage)
      .query(
        `UPDATE tb_member_edu_det_test 
         SET 
           AcademicYear = @AcademicYear,
           HighestQualificationID = @HighestQualificationID,
           AreaofSpecializationID = @AreaofSpecializationID,
           Institute = @Institute,
           DegreeCompleteInYear = @DegreeCompleteInYear,
           TotalMarks = @TotalMarks,
           ObtainMarks = @ObtainMarks,
           Percentage = @Percentage
         WHERE MemberEduID = @MemberEduID`
      );

    await closeConnection(pool);

    if (updateResult.rowsAffected[0] > 0) {
      return new Response(
        JSON.stringify({
          message: "Education information updated successfully",
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "Education information not found in database",
        }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Update Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
