import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = params;
  const {
    fatherFamilyName,
    marriageDate,
    wifeName,
    fatherDetail,
    isFatherMember,
    fatherName,
    cellNumber,
    email,
    cnicNo,
    bloodGroup,
    dob,
    gender,
    deathDate,
    graveNumber,
    maritalStatus,
  } = await req.json();

  const maritalStatusMap = {
    Single: 1,
    Married: 2,
    "Under-Marriage": 3,
  };

  const maritalStatusInt = maritalStatusMap[maritalStatus] || null;

  try {
    const pool = await connectToDB(config);
    console.log("Incoming wife details for MemberId: ", id);

    const insertQuery = `
      INSERT INTO [KSVJ].[dbo].[tb_member_wife_det_test] (
        [memberId], [CompanyID], [FamilyID], [MarriageDt], [WifeName],
        [FatherId], [IsFatherMember], [WifeFatherName], [CellNo], [EmailID],
        [CNICNo], [xBloodGroup], [DOB], [Gender], [DeathOn], [GraveNumber],
        [Del], [MaritalStatus]
      ) VALUES (
        @MemberId, @CompanyID, @FamilyID, @MarriageDt, @WifeName,
        @FatherId, @IsFatherMember, @WifeFatherName, @CellNo, @EmailID,
        @CNICNo, @xBloodGroup, @DOB, @Gender, @DeathOn, @GraveNumber,
        @Del, @MaritalStatus
      )
    `;

    await pool
      .request()
      .input("MemberId", id)
      .input("CompanyID", config.companyId)
      .input("FamilyID", fatherFamilyName)
      .input("MarriageDt", marriageDate)
      .input("WifeName", wifeName)
      .input("FatherId", fatherDetail)
      .input("IsFatherMember", isFatherMember)
      .input("WifeFatherName", fatherName)
      .input("CellNo", cellNumber)
      .input("EmailID", email)
      .input("CNICNo", cnicNo)
      .input("xBloodGroup", bloodGroup)
      .input("DOB", dob)
      .input("Gender", gender)
      .input("DeathOn", deathDate)
      .input("GraveNumber", graveNumber)
      .input("Del", 0)
      .input("MaritalStatus", maritalStatusInt)
      .query(insertQuery);

    await closeConnection(pool);

    return NextResponse.json({
      message: "Wife details inserted successfully.",
    });
  } catch (error) {
    console.error("Error inserting wife details:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
