const { connectToDB, closeConnection, config } = require("@/utils/database");
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  let pool;
  try {
    const { cnic } = params;
    if (!cnic) {
      return NextResponse.json(
        { message: "Missing required parameter: cnic" },
        { status: 400 }
      );
    }

    pool = await connectToDB(config);
    console.log("Connected to DB successfully.");

    // Check if a user with the same CNIC already exists
    const checkExistingUser = await pool.request().input("CNICNo", cnic).query(`
        SELECT COUNT(*) as count FROM tb_member_mst 
        WHERE CNICNo = @CNICNo
      `);

    const userExists = checkExistingUser.recordset[0].count > 0;

    await closeConnection(pool);
    if (userExists) {
      console.log("User with this CNIC already exists");
      return NextResponse.json(
        { message: "User with this CNIC already exists", exists: true },
        { status: 409 }
      );
    } else {
      console.log("User with this CNIC does not exist");
      return NextResponse.json(
        { message: "User with this CNIC does not exist", exists: false },
        { status: 200 }
      );
    }
  } catch (error) {
    if (pool) await closeConnection(pool);
    console.error("Error in checkExistingUser:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
