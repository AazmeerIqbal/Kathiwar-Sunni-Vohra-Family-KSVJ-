import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const {
      Age,
      BFormNo,
      BloodGroupID,
      ChildName,
      DOB,
      Gender,
      ChildMemberShipNo,
      MotherName,
    } = await req.json();

    const pool = await connectToDB(config);
    console.log("Updating child details for id: ", id);

    const updateQuery = `
    UPDATE tb_member_child_det_test
    SET 
      [ChildMemberShipNo] = @ChildMemberShipNo,
      [ChildName] = @ChildName,
      [Gender] = @Gender,
      [DOB] = @DOB,
      [BloodGroupID] = @BloodGroupID,
      [BFormNo] = @BFormNo
    WHERE 
      [memberChildId] = @memberChildId
  `;

    await pool
      .request()
      .input("ChildMemberShipNo", ChildMemberShipNo)
      .input("ChildName", ChildName)
      .input("Gender", Gender)
      .input("DOB", DOB)
      .input("BloodGroupID", BloodGroupID)
      .input("BFormNo", BFormNo)
      .input("memberChildId", id)
      .query(updateQuery);

    await closeConnection(pool);

    return NextResponse.json({
      message: "Child details updated successfully.",
    });
  } catch (error) {
    console.error("Error updating child details:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
