import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    // Await params to ensure it's ready
    const { cnic } = await params;

    if (!cnic) {
      return NextResponse.json(
        { message: "CNIC is required as a parameter." },
        { status: 400 }
      );
    }

    const formData = await req.json();
    console.log("Received CNIC:", cnic);
    console.log("Form Data:", formData);

    const pool = await connectToDB(config);
    console.log("Connected to DB successfully.");

    await pool
      .request()
      .input("CNICNo", formData.cnic)
      .input("MemberShipNo", formData.membershipNumber)
      .input("MemberShipDt", formData.membershipDate)
      .input("MemberTitle", formData.nameTitle)
      .input("MemberName", formData.name)
      .input("MemberFatherName", formData.fatherHusbandName)
      .input("DOB", formData.dob)
      .input("Gender", formData.gender)
      .input("CellNo", formData.cellNumber)
      .input("EmailID", formData.email)
      .input("BloodGroupID", formData.bloodGroup)
      .input("FamilyID", formData.familyName)
      .input("MaritalStatus", formData.maritalStatus)
      .input("PostalAddress", formData.address)
      .input("DeathOn", formData.deathOn)
      .input("GraveNumber", formData.graveNumber)
      .input("Remarks", formData.remarks)
      .input("FromCountryID", formData.country)
      .input("FromStateID", formData.state)
      .input("FromCityID", formData.city)
      .input("Status", formData.activeStatus).query(`
        UPDATE tb_member_mst_test
        SET 
        MemberShipNo = @MemberShipNo,
        MemberShipDt = @MemberShipDt,
        MemberTitle = @MemberTitle,
        MemberName = @MemberName,
        MemberFatherName = @MemberFatherName,
        DOB = @DOB,
        Gender = @Gender,
        CellNo = @CellNo,
        EmailID = @EmailID,
        BloodGroupID = @BloodGroupID,
        FamilyID = @FamilyID,
        MaritalStatus = @MaritalStatus,
        PostalAddress = @PostalAddress,
        DeathOn = @DeathOn,
        GraveNumber = @GraveNumber,
        Remarks = @Remarks,
        FromCountryID = @FromCountryID,
        FromStateID = @FromStateID,
        FromCityID = @FromCityID,
        Status = @Status
        WHERE CNICNo = @CNICNo;
      `);

    await closeConnection(pool);
    return NextResponse.json({ message: "Data saved successfully." });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
