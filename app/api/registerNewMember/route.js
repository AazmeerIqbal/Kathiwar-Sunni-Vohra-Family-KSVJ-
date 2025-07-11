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
      .input("CurrentAddress", formData.currentAddress)
      .input("ReferenceID", formData.reference)
      .input("CurrentCountry", formData.currentCountry)
      .input("FromStateID", formData.state)
      .input("CurrentCity", formData.currentCity)
      .input("PostalAddress", formData.PakistaniAddress)
      .input("MemberType", formData.memberType)
      .input("CompanyID", "12")
      .input("NewRegisterationFlag", 1)
      .input("RequestDate", new Date().toISOString().split("T")[0]) // Sending today's date in YYYY-MM-DD format
      .input("Status", formData.activeStatus).query(`
        INSERT INTO tb_member_mst_test (
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
          CurrentAddress,
          ReferenceID,
          CurrentCountry,
          FromStateID,
          CurrentCity,
          PostalAddress,
          DughterOfJamat,
          CompanyID,
          NewRegisterationFlag,
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
          @CurrentAddress,
          @ReferenceID,
          @CurrentCountry,
          @FromStateID,
          @CurrentCity,
          @PostalAddress,
          @MemberType,
          @CompanyID,
          @NewRegisterationFlag,
          @RequestDate,
          @Status
        )
      `);

    const NewMemberId = result.recordset[0].MemberID;
    console.log("New Member ID: ", NewMemberId);

    console.log("Education Data: ", formData.education);

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

    // Insert Wife data if present
    if (Array.isArray(formData.wife)) {
      for (const wife of formData.wife) {
        await pool
          .request()
          .input("MemberID", NewMemberId)
          .input("CompanyID", "12")
          .input("WifeName", wife.wifeName)
          .input("WifeFatherName", wife.fatherDetail)
          .input("CellNo", wife.cellNumber)
          .input("EmailID", wife.email)
          .input("CNICNo", wife.cnicNo)
          .input("xBloodGroup", wife.bloodGroup)
          .input("DOB", wife.dob)
          .input("MarriageDt", wife.marriageDate)
          .input("MaritalStatus", wife.maritalStatus)
          .input("FamilyID", wife.fatherFamilyName)
          .input("Del", 0).query(`
    INSERT INTO tb_member_wife_det_test (
      MemberID,
      CompanyID,
      WifeName,
      WifeFatherName,
      CellNo,
      EmailID,
      CNICNo,   
      xBloodGroup,
      DOB,
      MarriageDt,
      MaritalStatus,
      FamilyID,
      Del
    ) VALUES (
      @MemberID,
      @CompanyID,
      @WifeName,
      @WifeFatherName,
      @CellNo,
      @EmailID,
      @CNICNo,
      @xBloodGroup,
      @DOB,
      @MarriageDt,
      @MaritalStatus,
      @FamilyID,
      @Del
    )
  `);
      }
    }

    console.log("Children Data: ", formData.children);

    // Insert Children data if present
    if (Array.isArray(formData.children)) {
      for (const child of formData.children) {
        await pool
          .request()
          .input("MemberId", NewMemberId)
          .input("CompanyID", "12")
          .input("MembershipID", child.MembershipID)
          .input("ChildName", child.ChildName)
          .input("Gender", child.Gender)
          .input("DOB", child.DOB)
          .input("BloodGroupID", child.BloodGroupID)
          .input("BFormNo", child.BFormNo)
          .input("Age", child.Age)
          .query(` INSERT INTO tb_member_child_det_test (
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
      )`);
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
