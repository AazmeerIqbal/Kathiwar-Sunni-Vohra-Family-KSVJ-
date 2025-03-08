import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const { MemberId } = await params;
    const {
      Age,
      BFormNo,
      BloodGroupID,
      ChildName,
      DOB,
      Gender,
      MembershipID,
      MotherName,
    } = await req.json();

    const pool = await connectToDB(config);
    console.log("Incoming child details for MemberId: ", MemberId);

    const insertQuery = `
      INSERT INTO tb_member_child_det_test (
        [memberId], [CompanyID], [ChildMemberShipNo], [ChildName],
        [Gender], [DOB], [BloodGroupID], [xBloodGroup], [CNICNo],
        [BFormNo], [DeathOn], [MemberIDAlot], [EducationSupportID],
         [MaritalStatus], [TakeCare], [GraveNumber],
        [EducationID], [PicPath], [HusbandId], [IsHusbandMember],
        [LastUpdateUser], [LastUpdateDate]
      ) VALUES (
        @MemberId, @CompanyID, @MembershipID, @ChildName,
        @Gender, @DOB, @BloodGroupID, NULL, NULL,
        @BFormNo, NULL, NULL, NULL,
         NULL, 0, NULL,
        NULL, NULL, NULL, NULL,
        NULL, NULL
      )
    `;

    await pool
      .request()
      .input("MemberId", MemberId)
      .input("CompanyID", config.companyId)
      .input("MembershipID", MembershipID)
      .input("ChildName", ChildName)
      .input("Gender", Gender)
      .input("DOB", DOB)
      .input("BloodGroupID", BloodGroupID)
      .input("BFormNo", BFormNo)
      .input("Age", Age)
      .query(insertQuery);

    await closeConnection(pool);

    return NextResponse.json({
      message: "Child details inserted successfully.",
    });
  } catch (error) {
    console.error("Error inserting child details:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
