import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.json();
    console.log("Form Data For New member Registeration:", formData);

    const pool = await connectToDB(config);
    console.log("Connected to DB successfully.");

    await pool
      .request()
      .input("CNICNo", formData.cnic)
      .input("Image", formData.image)
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
      .input("Remarks", formData.remarks)
      .input("FromCountryID", formData.country)
      .input("FromStateID", formData.state)
      .input("FromCityID", formData.city)
      .input("MemberType", formData.memberType)
      .input("CompanyID", "12")
      .input("RequestDate", new Date().toISOString().split("T")[0]) // Sending today's date in YYYY-MM-DD format
      .input("Status", formData.activeStatus).query(`
        INSERT INTO tb_member_mst_temp (
          CNICNo,
          PicPath,
          MemberTitle,
          MemberName,
          MemberFatherName,
          DOB,
          Gender,
          CellNo,
          EmailID,
          BloodGroupID,
          FamilyID,
          MaritalStatus,
          PostalAddress,
          Remarks,
          FromCountryID,
          FromStateID,
          FromCityID,
          DughterOfJamat,
          CompanyID,
          RequestDt,
          Status
        )
        VALUES (
          @CNICNo,
          @Image,
          @MemberTitle,
          @MemberName,
          @MemberFatherName,
          @DOB,
          @Gender,
          @CellNo,
          @EmailID,
          @BloodGroupID,
          @FamilyID,
          @MaritalStatus,
          @PostalAddress,
          @Remarks,
          @FromCountryID,
          @FromStateID,
          @FromCityID,
          @MemberType,
          @CompanyID,
          @RequestDate,
          @Status
        )
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
