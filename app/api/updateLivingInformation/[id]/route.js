import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    MemberProID,
    CompanyID,
    MemberID,
    MemberWifeID,
    MemberChildID,
    CurrentProfession,
    CompanyName,
    CurrentPosition,
    ProfessionalExperience,
    EmployeeUnEmployeed,
  } = req.body;

  if (!MemberProID) {
    return res.status(400).json({ message: "MemberProID is required" });
  }

  try {
    // Connect to the database
    const pool = await connectToDB(config);

    // Update query
    const result = await sql.query`
      UPDATE tb_member_professional_det_test
      SET 
        CompanyID = ${CompanyID},
        MemberID = ${MemberID},
        MemberWifeID = ${MemberWifeID},
        MemberChildID = ${MemberChildID},
        CurrentProfession = ${CurrentProfession},
        CompanyName = ${CompanyName},
        CurrentPosition = ${CurrentPosition},
        ProfessionalExperience = ${ProfessionalExperience},
        EmployeeUnEmployeed = ${EmployeeUnEmployeed}
      WHERE MemberProID = ${MemberProID}
    `;

    await closeConnection(pool);
    if (result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ message: "Member professional details updated successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "Member professional details not found" });
    }
  } catch (error) {
    console.error("Database update error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
