import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { cnic } = await params;
  console.log("Member ID from Update information: ", cnic);

  if (!cnic) {
    return NextResponse.json(
      { message: "CNIC is required as a parameter." },
      { status: 400 }
    );
  }

  let pool;
  try {
    pool = await connectToDB(config);
    const request = pool.request().input("MemberId", cnic);

    // First, check if data exists in temp tables
    const tempDataCheck = await request.query(`
      SELECT 
        (SELECT COUNT(*) FROM tb_member_mst_test WHERE memberId = @MemberId) as member_count,
        (SELECT COUNT(*) FROM tb_member_edu_det_test WHERE memberId = @MemberId) as edu_count,
        (SELECT COUNT(*) FROM tb_member_professional_det_test WHERE memberId = @MemberId) as prof_count,
        (SELECT COUNT(*) FROM tb_member_living_det_test WHERE memberId = @MemberId) as living_count,
        (SELECT COUNT(*) FROM tb_member_wife_det_test WHERE memberId = @MemberId) as wife_count,
        (SELECT COUNT(*) FROM tb_member_child_det_test WHERE memberId = @MemberId) as child_count
    `);

    const counts = tempDataCheck.recordset[0];
    const hasTempData =
      counts.member_count > 0 ||
      counts.edu_count > 0 ||
      counts.prof_count > 0 ||
      counts.living_count > 0 ||
      counts.wife_count > 0 ||
      counts.child_count > 0;

    let responseData;

    if (hasTempData) {
      // Data exists in temp tables, fetch from temp tables
      console.log("Fetching data from temp tables");

      const result = await request.query(`
        -- Fetch member details from temp table
        SELECT * FROM tb_member_mst_test WHERE memberId = @MemberId;

        -- Fetch education details from temp table
        SELECT * FROM tb_member_edu_det_test WHERE memberId = @MemberId;

        -- Fetch professional details from temp table
        SELECT * FROM tb_member_professional_det_test WHERE memberId = @MemberId;

        -- Fetch living details from temp table
        SELECT * FROM tb_member_living_det_test WHERE memberId = @MemberId;

        -- Fetch wife details from temp table
        SELECT * FROM tb_member_wife_det_test WHERE memberId = @MemberId;

        -- Fetch child details from temp table
        SELECT * FROM tb_member_child_det_test WHERE memberId = @MemberId;
      `);

      responseData = {
        memberInfo: result.recordsets[0] || [],
        educationInfo: result.recordsets[1] || [],
        professionalInfo: result.recordsets[2] || [],
        livingInfo: result.recordsets[3] || [],
        wifeInfo: result.recordsets[4] || [],
        childInfo: result.recordsets[5] || [],
      };
    } else {
      // No data in temp tables, execute stored procedure to fetch from main tables
      console.log("No temp data found, executing stored procedure");

      const result = await request.execute("fetchUserData");

      responseData = {
        memberInfo: result.recordsets[0] || [],
        educationInfo: result.recordsets[1] || [],
        professionalInfo: result.recordsets[2] || [],
        livingInfo: result.recordsets[3] || [],
        wifeInfo: result.recordsets[4] || [],
        childInfo: result.recordsets[5] || [],
      };
    }

    return NextResponse.json({
      message: "Data fetched successfully.",
      data: responseData,
      source: hasTempData ? "temp_tables" : "main_tables",
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    // Check if it's a connection error
    if (error.code === "ECONNCLOSED" || error.code === "ECONNRESET") {
      console.log("Connection error detected, attempting to reconnect...");
      try {
        // Force close the current connection and try to reconnect
        if (pool) {
          await pool.close();
        }
        // The next request will create a new connection
      } catch (closeError) {
        console.log("Error closing connection:", closeError);
      }
    }

    return NextResponse.json(
      {
        message: "Database connection error. Please try again.",
        error: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
