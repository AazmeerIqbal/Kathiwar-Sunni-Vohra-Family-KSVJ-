import { connectToDB, closeConnection, config } from "@/utils/database";
import sql from "mssql";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();

    console;

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Member ID is required" }),
        { status: 400 }
      );
    }

    let pool = await connectToDB(config);

    await pool
      .request()
      .input("MemberID", sql.Int, id) // Ensure proper SQL type
      .input("CompanyID", sql.Int, data.CompanyID)
      .input("MemberWifeID", sql.Int, data.MemberWifeID || null)
      .input("MemberChildID", sql.Int, data.MemberChildID || null)
      .input("CurrentProfession", sql.NVarChar, data.CurrentProfession)
      .input("CompanyName", sql.NVarChar, data.CompanyName)
      .input("CurrentPosition", sql.NVarChar, data.CurrentPosition)
      .input(
        "ProfessionalExperience",
        sql.NVarChar,
        data.ProfessionalExperience
      )
      .input("EmployeeUnEmployeed", sql.NVarChar, data.EmployeeUnEmployeed)
      .query(`
        UPDATE tb_member_professional_det_test 
        SET 
          CompanyID = @CompanyID,
          MemberWifeID = @MemberWifeID,
          MemberChildID = @MemberChildID,
          CurrentProfession = @CurrentProfession,
          CompanyName = @CompanyName,
          CurrentPosition = @CurrentPosition,
          ProfessionalExperience = @ProfessionalExperience,
          EmployeeUnEmployeed = @EmployeeUnEmployeed
        WHERE MemberProID = @MemberID
      `);

    await closeConnection(pool);

    return new Response(
      JSON.stringify({
        message: "Professional information updated successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
