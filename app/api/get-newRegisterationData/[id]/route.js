import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params; // Extract 'id' from URL parameters

  if (!id) {
    return NextResponse.json(
      { message: "Member ID is required as a parameter." },
      { status: 400 }
    );
  }

  try {
    const pool = await connectToDB(config);
    const request = pool.request().input("MemberId", id);

    // Execute all queries in a single request
    const result = await request.query(`
      SELECT * FROM tb_member_mst_test WHERE memberId = @MemberId;
    `);

    await closeConnection(pool);

    // Destructure result.recordsets
    const [member] = result.recordsets;

    return NextResponse.json({
      message: "Query executed successfully.",
      member: member.length > 0 ? member[0] : null,
    });
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
