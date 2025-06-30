import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.json();
    console.log("Form Data For New member Registeration:", formData);

    const pool = await connectToDB(config);
    console.log("Connected to DB successfully.");

    const result = await pool
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
        OUTPUT INSERTED.MemberID
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

    const NewMemberId = result.recordset[0].MemberID;
    console.log("New Member ID: ", NewMemberId);

    // Insert education data if present
    if (Array.isArray(formData.education)) {
      for (const edu of formData.education) {
        await pool
          .request()
          .input("CompanyID", "12")
          .input("MemberID", NewMemberId)
          .input("HighestQualificationID", edu.qualification || null)
          .input("AreaofSpecializationID", edu.specialization || null)
          .input("DegreeTitle", edu.degreeTitle || null)
          .input("DegreeCompleteInYear", edu.completionYear || null)
          .input("Description", edu.description || null).query(`
            INSERT INTO tb_member_edu_det_test (
              CompanyID,
              MemberID,
              HighestQualificationID,
              AreaofSpecializationID,
              DegreeTitle,
              DegreeCompleteInYear,
              Description
            ) VALUES (
              @CompanyID,
              @MemberID,
              @HighestQualificationID,
              @AreaofSpecializationID,
              @DegreeTitle,
              @DegreeCompleteInYear,
              @Description
            )
          `);
      }
    }

    // Insert Professional data if present
    if (Array.isArray(formData.profession)) {
      for (const pro of formData.profession) {
        await pool
          .request()
          .input("MemberID", NewMemberId)
          .input("CompanyID", "12")
          .input("CurrentProfession", pro.profession)
          .input("CompanyName", pro.companyName)
          .input("CurrentPosition", pro.currentPosition)
          .input("ProfessionalExperience", pro.professionalExp)
          .input("EmployeeUnEmployeed", pro.employeeStatus).query(`
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
      }
    }

    await closeConnection(pool);
    return NextResponse.json({
      message: "Data saved successfully.",
      // memberId: NewMemberId,
    });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
