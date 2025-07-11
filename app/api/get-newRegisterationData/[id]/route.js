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

    const result = await pool
      .request()
      .input("MemberId", id)
      .execute("sp_Get_NewRegisteration"); // 👈 Call stored procedure

    await closeConnection(pool);

    // Destructure first result set
    const [member] = result.recordsets;

    return NextResponse.json({
      message: "Stored procedure executed successfully.",
      member: member.length > 0 ? member[0] : null,
    });
  } catch (error) {
    console.error("Error executing stored procedure:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
