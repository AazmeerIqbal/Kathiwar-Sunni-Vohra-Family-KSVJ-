import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { id } = params; // Assuming 'id' is the ChildMemberId

  try {
    const pool = await connectToDB(config);
    console.log("Deleting child details for ID: ", id);

    const deleteQuery = `
      DELETE FROM tb_member_child_det_test
      WHERE memberChildId = @memberChildId
    `;

    await pool.request().input("memberChildId", id).query(deleteQuery);

    await closeConnection(pool);

    return NextResponse.json({
      message: "Child details deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting child details:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
