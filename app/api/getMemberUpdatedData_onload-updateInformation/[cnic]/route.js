// import { connectToDB, closeConnection, config } from "@/utils/database";
// import { NextResponse } from "next/server";

// export async function POST(req, { params }) {
//   const { cnic } = await params; // Correctly extract 'cnic' from URL parameters

//   if (!cnic) {
//     return NextResponse.json(
//       { message: "CNIC is required as a parameter." },
//       { status: 400 }
//     );
//   }

//   try {
//     const pool = await connectToDB(config);
//     const request = pool.request().input("MemberId", cnic);

//     // Run multiple queries
//     const mst = await request.query(
//       "SELECT * FROM tb_member_mst_test WHERE memberId = @MemberId"
//     );
//     const edu = await request.query(
//       "SELECT * FROM tb_member_edu_det_test WHERE memberId = @MemberId"
//     );
//     const prof = await request.query(
//       "SELECT * FROM tb_member_professional_det_test WHERE memberId = @MemberId"
//     );
//     const living = await request.query(
//       "SELECT * FROM tb_member_living_det_test WHERE memberId = @MemberId"
//     );
//     const wife = await request.query(
//       "SELECT * FROM tb_member_wife_det_test WHERE memberId = @MemberId"
//     );
//     const child = await request.query(
//       "SELECT * FROM tb_member_child_det_test WHERE memberId = @MemberId"
//     );

//     await closeConnection(pool);

//     // Return all results
//     return NextResponse.json({
//       message: "Query executed successfully.",
//       data: {
//         member_mst: mst.recordset,
//         member_edu: edu.recordset,
//         member_professional: prof.recordset,
//         member_living: living.recordset,
//         member_wife: wife.recordset,
//         member_child: child.recordset,
//       },
//     });
//   } catch (error) {
//     console.error("Error executing query:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error", error: error.message },
//       { status: 500 }
//     );
//   }
// }

import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { cnic } = await params; // Correctly extract 'cnic' from URL parameters

  if (!cnic) {
    return NextResponse.json(
      { message: "CNIC is required as a parameter." },
      { status: 400 }
    );
  }

  try {
    const pool = await connectToDB(config);
    const request = pool.request().input("MemberId", cnic);

    // Execute all queries in a single request
    const result = await request.query(`
      -- Fetch member details
      SELECT * FROM tb_member_mst_test WHERE memberId = @MemberId;

      -- Fetch education details
      SELECT * FROM tb_member_edu_det_test WHERE memberId = @MemberId;

      -- Fetch professional details
      SELECT * FROM tb_member_professional_det_test WHERE memberId = @MemberId;

      -- Fetch living details
      SELECT * FROM tb_member_living_det_test WHERE memberId = @MemberId;

      -- Fetch wife details
      SELECT * FROM tb_member_wife_det_test WHERE memberId = @MemberId;

      -- Fetch child details
      SELECT * FROM tb_member_child_det_test WHERE memberId = @MemberId;
    `);

    await closeConnection(pool);

    // Destructure result.recordsets
    const [
      member_mst,
      member_edu,
      member_professional,
      member_living,
      member_wife,
      member_child,
    ] = result.recordsets;

    return NextResponse.json({
      message: "Query executed successfully.",
      data: {
        member_mst,
        member_edu,
        member_professional,
        member_living,
        member_wife,
        member_child,
      },
    });
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
