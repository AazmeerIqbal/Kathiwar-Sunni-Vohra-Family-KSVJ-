import { NextResponse } from "next/server";
import { connectToDB, closeConnection, config } from "@/utils/database";
import sql from "mssql";

export async function POST(req, { params }) {
  let pool;
  try {
    // Parse request body
    const { cnic } = await params;
    console.log("Member ID from Update information: ", cnic);

    if (!cnic) {
      return NextResponse.json(
        { message: "CNIC is required as a parameter." },
        { status: 400 }
      );
    }

    // Connect to DB
    pool = await connectToDB(config);

    // Execute stored procedure with timeout handling
    const result = await Promise.race([
      pool
        .request()
        .input("MemberId", sql.VarChar, cnic) // Use VarChar since it's a string from URL
        .execute("Get_UpdateInformationData"),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Stored procedure timeout")), 60000)
      ),
    ]);

    const responseData = {
      memberInfo: result.recordsets[0] || [],
      educationInfo: result.recordsets[1] || [],
      professionalInfo: result.recordsets[2] || [],
      livingInfo: result.recordsets[3] || [],
      wifeInfo: result.recordsets[4] || [],
      childInfo: result.recordsets[5] || [],
    };

    console.log("Stored procedure executed successfully");

    return NextResponse.json({
      message: "Data fetched successfully.",
      data: responseData,
    });
  } catch (error) {
    console.error("Error executing stored procedure:", error);

    // Check if it's a timeout error
    if (error.message.includes("timeout")) {
      return NextResponse.json(
        {
          message:
            "Request timed out. The database query is taking too long. Please try again.",
          error: error.message,
        },
        { status: 408 }
      );
    }

    // Check if it's a connection error
    if (error.code === "ECONNCLOSED" || error.code === "ECONNRESET") {
      console.log("Connection error detected, attempting to reconnect...");
      try {
        if (pool) {
          await pool.close();
        }
      } catch (closeError) {
        console.log("Error closing connection:", closeError);
      }
    }

    return NextResponse.json(
      {
        message: "Database error. Please try again.",
        error: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
