import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { query } = params;

  if (!query) {
    return NextResponse.json(
      { message: "Search query is required." },
      { status: 400 }
    );
  }

  try {
    // Establish database connection
    const pool = await connectToDB(config);

    // Run query to search members by name or membership number
    const result = await pool.request().input("SearchQuery", `%${query}%`)
      .query(`
        SELECT memberId, MemberName, MemberShipNo, CNICNo, PicPath
        FROM tb_member_mst
        WHERE MemberName LIKE @SearchQuery
        OR MemberShipNo LIKE @SearchQuery
        ORDER BY MemberName
      `);

    // Close the database connection
    await closeConnection(pool);

    // Return success response with search results
    return NextResponse.json({
      message: "Search completed successfully.",
      members: result.recordset,
    });
  } catch (error) {
    // Handle and log errors
    console.error("Error executing search query:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
