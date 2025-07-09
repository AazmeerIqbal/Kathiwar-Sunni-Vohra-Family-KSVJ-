import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Member ID is required as a parameter." },
      { status: 400 }
    );
  }

  try {
    const pool = await connectToDB(config);
    const request = pool.request().input("MemberId", id);

    // Execute delete query
    await request.query(`
      DELETE FROM tb_member_mst_test WHERE memberId = @MemberId
    `);

    await closeConnection(pool);

    return NextResponse.json({
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
