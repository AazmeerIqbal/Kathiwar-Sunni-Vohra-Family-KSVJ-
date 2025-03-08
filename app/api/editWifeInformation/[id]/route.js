import { connectToDB, closeConnection, config } from "@/utils/database";
import sql from "mssql";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const data = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ message: "Wife ID is required" }), {
        status: 400,
      });
    }

    // Define marital status mapping
    const maritalStatusMap = {
      Single: 1,
      Married: 2,
      "Under-Marriage": 3,
    };

    // Convert marital status to integer
    const maritalStatusInt = maritalStatusMap[data.MaritalStatus] || null;

    // Sanitize and validate the data
    const sanitizedData = {
      WifeName: data.WifeName || null,
      FatherId: data.FatherId ? parseInt(data.FatherId) : null,
      FamilyID: data.FamilyID ? parseInt(data.FamilyID) : null,
      DOB: data.DOB || null,
      CNICNo: data.CNICNo || null,
      CellNo: data.CellNo || null,
      EmailID: data.EmailID || null,
      MarriageDt: data.MarriageDt || null,
      xBloodGroup: data.xBloodGroup || null,
      MaritalStatus: maritalStatusInt,
      DeathOn: data.DeathOn || null,
      GraveNumber: data.GraveNumber || null,
    };

    let pool = await connectToDB(config);

    // Update wife details in the database
    const updateResult = await pool
      .request()
      .input("memberwifeId", sql.Int, id)
      .input("WifeName", sql.NVarChar(100), sanitizedData.WifeName)
      .input("FatherId", sql.Int, sanitizedData.FatherId)
      .input("FamilyID", sql.Int, sanitizedData.FamilyID)
      .input("DOB", sql.Date, sanitizedData.DOB)
      .input("CNICNo", sql.NVarChar(15), sanitizedData.CNICNo)
      .input("CellNo", sql.NVarChar(15), sanitizedData.CellNo)
      .input("EmailID", sql.NVarChar(50), sanitizedData.EmailID)
      .input("MarriageDt", sql.Date, sanitizedData.MarriageDt)
      .input("xBloodGroup", sql.NVarChar(5), sanitizedData.xBloodGroup)
      .input("MaritalStatus", sql.Int, sanitizedData.MaritalStatus)
      .input("DeathOn", sql.Date, sanitizedData.DeathOn)
      .input("GraveNumber", sql.NVarChar(50), sanitizedData.GraveNumber)
      .query(
        `UPDATE tb_member_wife_det_test 
         SET 
           WifeName = @WifeName,
           FatherId = @FatherId,
           FamilyID = @FamilyID,
           DOB = @DOB,
           CNICNo = @CNICNo,
           CellNo = @CellNo,
           EmailID = @EmailID,
           MarriageDt = @MarriageDt,
           xBloodGroup = @xBloodGroup,
           MaritalStatus = @MaritalStatus,
           DeathOn = @DeathOn,
           GraveNumber = @GraveNumber
         WHERE memberwifeId = @memberwifeId`
      );

    await closeConnection(pool);

    if (updateResult.rowsAffected[0] > 0) {
      return new Response(
        JSON.stringify({ message: "Wife information updated successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Wife information not found in database" }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Update Error:", error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
